import * as pdfjsLib from 'pdfjs-dist';
import { LabelItem } from '../types';

// Configure PDF.js worker
if (typeof window !== 'undefined') {
  try {
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
  } catch (err) {
    console.warn('PDF.js worker initialization warning:', err);
  }
}

/**
 * Converts a data URL (e.g. data:image/png;base64,...) into a Uint8Array
 */
export function dataUrlToBytes(dataUrl: string): Uint8Array {
  const base64 = dataUrl.split(',')[1];
  const binary = atob(base64);
  const len = binary.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

/**
 * Automatically detects non-white content bounds on a canvas and returns a cropped canvas.
 * This removes excess outer blank margins often added by marketplace export engines (Shopee, etc.)
 * so the label fits cleanly and larger into each A4 slot.
 */
export function autoCropWhitespace(canvas: HTMLCanvasElement, padding = 6): HTMLCanvasElement {
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  const width = canvas.width;
  const height = canvas.height;
  const imgData = ctx.getImageData(0, 0, width, height);
  const data = imgData.data;

  let minX = width;
  let minY = height;
  let maxX = 0;
  let maxY = 0;
  let foundNonWhite = false;

  // Scan pixels (sampling step = 2 for speed on high-res)
  for (let y = 0; y < height; y += 2) {
    for (let x = 0; x < width; x += 2) {
      const idx = (y * width + x) * 4;
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];
      const a = data[idx + 3];

      // If pixel is not white and not fully transparent
      if (a > 30 && (r < 242 || g < 242 || b < 242)) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
        foundNonWhite = true;
      }
    }
  }

  // If no content found or crop area is negligible, return original
  if (!foundNonWhite || maxX <= minX || maxY <= minY) {
    return canvas;
  }

  // Add padding
  minX = Math.max(0, minX - padding);
  minY = Math.max(0, minY - padding);
  maxX = Math.min(width, maxX + padding);
  maxY = Math.min(height, maxY + padding);

  const cropW = maxX - minX;
  const cropH = maxY - minY;

  // Only crop if meaningful margin was trimmed (e.g. at least 5% cropped)
  if (cropW < width * 0.98 || cropH < height * 0.98) {
    const croppedCanvas = document.createElement('canvas');
    croppedCanvas.width = cropW;
    croppedCanvas.height = cropH;
    const croppedCtx = croppedCanvas.getContext('2d');
    if (croppedCtx) {
      croppedCtx.fillStyle = '#ffffff';
      croppedCtx.fillRect(0, 0, cropW, cropH);
      croppedCtx.drawImage(canvas, minX, minY, cropW, cropH, 0, 0, cropW, cropH);
      return croppedCanvas;
    }
  }

  return canvas;
}

/**
 * Extracts metadata from text content of a PDF page (Resi number, order ID, recipient, courier)
 */
function extractResiMetadata(text: string): { resiNo?: string; orderId?: string; courier?: string; recipientName?: string } {
  const result: { resiNo?: string; orderId?: string; courier?: string; recipientName?: string } = {};

  const resiMatch = text.match(/(?:No\.?\s*Resi|Resi|AWB|Tracking)\s*:?[\s#]*([A-Za-z0-9\-_]{8,25})/i);
  if (resiMatch) {
    result.resiNo = resiMatch[1].trim();
  } else {
    const standaloneMatch = text.match(/\b(SPX[A-Z0-9]{10,20}|JP[0-9]{10,15}|11[0-9]{12}|[0-9]{12,15})\b/);
    if (standaloneMatch) {
      result.resiNo = standaloneMatch[1];
    }
  }

  const orderMatch = text.match(/(?:No\.?\s*Pesanan|Order\s*ID|Pesanan)\s*:?[\s#]*([A-Za-z0-9]{10,22})/i);
  if (orderMatch) {
    result.orderId = orderMatch[1].trim();
  }

  if (/anteraja/i.test(text)) result.courier = 'Anteraja';
  else if (/spx|shopee\s*express/i.test(text)) result.courier = 'SPX Express';
  else if (/j&t|jnt/i.test(text)) result.courier = 'J&T Express';
  else if (/sicepat/i.test(text)) result.courier = 'SiCepat';
  else if (/jne/i.test(text)) result.courier = 'JNE';
  else if (/ninja/i.test(text)) result.courier = 'Ninja Xpress';
  else if (/id\s*express/i.test(text)) result.courier = 'ID Express';
  else if (/pos\s*indonesia/i.test(text)) result.courier = 'Pos Indonesia';
  else if (/shopee/i.test(text)) result.courier = 'Shopee';

  const recipientMatch = text.match(/Penerima\s*:?\s*([^\n\r,]{3,35})/i);
  if (recipientMatch) {
    result.recipientName = recipientMatch[1].trim();
  }

  return result;
}

/**
 * Parses an uploaded PDF file by capturing a high-resolution screenshot snapshot of each page,
 * exactly preserving the original layout, barcodes, and text without altering any styling.
 */
export async function parsePdfFile(file: File, autoTrim = true): Promise<LabelItem[]> {
  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) });
  const pdfDoc = await loadingTask.promise;
  const totalPages = pdfDoc.numPages;
  const items: LabelItem[] = [];

  for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
    const page = await pdfDoc.getPage(pageNum);

    // Render at 2.5x scale (approx 200-300 DPI for ultra sharp barcodes and labels)
    const scale = 2.5;
    const viewport = page.getViewport({ scale });

    const canvas = document.createElement('canvas');
    canvas.width = viewport.width;
    canvas.height = viewport.height;

    const ctx = canvas.getContext('2d');
    if (!ctx) continue;

    // Fill white background before rendering
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    await page.render({
      canvasContext: ctx,
      viewport: viewport,
      canvas: canvas,
    }).promise;

    // Optional auto crop whitespace so label fills slot neatly
    const finalCanvas = autoTrim ? autoCropWhitespace(canvas) : canvas;

    const dataUrl = finalCanvas.toDataURL('image/png', 0.95);
    const imageBytes = dataUrlToBytes(dataUrl);

    // Extract text metadata for item card display
    let metadata: { resiNo?: string; orderId?: string; courier?: string; recipientName?: string } = {};
    try {
      const textContent = await page.getTextContent();
      const fullText = textContent.items
        .map((item) => ('str' in item ? (item as { str: string }).str : ''))
        .join(' ');
      metadata = extractResiMetadata(fullText);
    } catch (err) {
      console.warn('Text extraction warning:', err);
    }

    items.push({
      id: `label-${Date.now()}-${pageNum}-${Math.random().toString(36).substring(2, 6)}`,
      sourceFileName: file.name,
      pageIndex: pageNum - 1,
      totalPagesInSource: totalPages,
      resiNo: metadata.resiNo || `RESI-${pageNum}`,
      orderId: metadata.orderId,
      courier: metadata.courier,
      recipientName: metadata.recipientName,
      width: finalCanvas.width,
      height: finalCanvas.height,
      thumbnailUrl: dataUrl,
      imageBytes: imageBytes,
      imageType: 'png',
    });
  }

  return items;
}

/**
 * Handles uploaded image files (PNG/JPG screenshots of resi)
 */
export async function parseImageFile(file: File, autoTrim = true): Promise<LabelItem> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas context unavailable'));
          return;
        }

        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);

        const finalCanvas = autoTrim ? autoCropWhitespace(canvas) : canvas;
        const dataUrl = finalCanvas.toDataURL('image/png', 0.95);
        const imageBytes = dataUrlToBytes(dataUrl);

        resolve({
          id: `img-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          sourceFileName: file.name,
          pageIndex: 0,
          totalPagesInSource: 1,
          resiNo: file.name.replace(/\.[^/.]+$/, '').slice(0, 20),
          width: finalCanvas.width,
          height: finalCanvas.height,
          thumbnailUrl: dataUrl,
          imageBytes: imageBytes,
          imageType: 'png',
        });
      };
      img.onerror = reject;
      img.src = reader.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
