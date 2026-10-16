import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { GRID_CONFIGS, GeneratorSettings, LabelItem, MARGIN_VALUES, GAP_VALUES } from '../types';

// Standard A4 dimensions in PDF points (72 points per inch)
export const A4_WIDTH = 595.28;
export const A4_HEIGHT = 841.89;

export interface GeneratedPdfResult {
  pdfBytes: Uint8Array;
  blobUrl: string;
  totalPages: number;
  totalLabels: number;
  labelsPerPage: number;
  filename: string;
}

function toSafePdfText(text: string): string {
  return text.replace(/[^\x20-\x7E]/g, ' ');
}

/**
 * Builds the composite Multi-Up A4 PDF from a list of LabelItems by pasting
 * the exact screenshots of the labels directly into the grid slots.
 */
export async function generateMultiUpPdf(
  labels: LabelItem[],
  settings: GeneratorSettings
): Promise<GeneratedPdfResult> {
  if (labels.length === 0) {
    throw new Error('Tidak ada resi untuk diproses');
  }

  const gridConfig = GRID_CONFIGS[settings.gridPreset];
  const { cols, rows, preset } = gridConfig;
  const labelsPerPage = cols * rows;
  const totalPages = Math.ceil(labels.length / labelsPerPage);

  const outDoc = await PDFDocument.create();
  const font = await outDoc.embedFont(StandardFonts.Helvetica);

  const pageMargin = MARGIN_VALUES[settings.marginPreset];
  const gap = GAP_VALUES[settings.gapPreset];

  const totalGridWidth = A4_WIDTH - 2 * pageMargin;
  const totalGridHeight = A4_HEIGHT - 2 * pageMargin - (settings.showPageNumbers ? 14 : 0);

  const cellWidth = (totalGridWidth - (cols - 1) * gap) / cols;
  const cellHeight = (totalGridHeight - (rows - 1) * gap) / rows;

  for (let pageIdx = 0; pageIdx < totalPages; pageIdx++) {
    const a4Page = outDoc.addPage([A4_WIDTH, A4_HEIGHT]);
    const pageLabels = labels.slice(pageIdx * labelsPerPage, (pageIdx + 1) * labelsPerPage);

    // Optional Header text
    if (settings.showPageNumbers) {
      const pageInfo = `Halaman ${pageIdx + 1} dari ${totalPages}  |  Format: ${gridConfig.name}  |  Cetak Resi A4`;
      a4Page.drawText(toSafePdfText(pageInfo), {
        x: pageMargin,
        y: A4_HEIGHT - pageMargin + 4,
        size: 7,
        font: font,
        color: rgb(0.4, 0.45, 0.5),
      });
    }

    // Process each cell in the grid
    for (let slotIdx = 0; slotIdx < labelsPerPage; slotIdx++) {
      const col = slotIdx % cols;
      const row = Math.floor(slotIdx / cols);

      // Cell coordinates (PDF bottom-left origin)
      const cellLeft = pageMargin + col * (cellWidth + gap);
      const cellTop = A4_HEIGHT - pageMargin - (settings.showPageNumbers ? 14 : 0) - row * (cellHeight + gap);
      const cellBottom = cellTop - cellHeight;

      // Draw Cut Lines / Cell Borders if requested
      if (settings.cutLineStyle !== 'none') {
        const isDashed = settings.cutLineStyle === 'dashed';
        const strokeColor = rgb(0.7, 0.72, 0.75);

        a4Page.drawRectangle({
          x: cellLeft,
          y: cellBottom,
          width: cellWidth,
          height: cellHeight,
          borderWidth: 0.6,
          borderColor: strokeColor,
          borderDashArray: isDashed ? [3, 2] : undefined,
          color: undefined,
        });

        // Small corner cut guide marks if dashed
        if (isDashed && settings.showCutGuides && slotIdx === 0) {
          a4Page.drawLine({
            start: { x: cellLeft + 2, y: cellTop - 2 },
            end: { x: cellLeft + 8, y: cellTop - 2 },
            thickness: 0.5,
            color: rgb(0.5, 0.5, 0.5),
          });
          a4Page.drawLine({
            start: { x: cellLeft + 2, y: cellTop - 2 },
            end: { x: cellLeft + 2, y: cellTop - 8 },
            thickness: 0.5,
            color: rgb(0.5, 0.5, 0.5),
          });
        }
      }

      // Check if there is a label in this slot
      const label = pageLabels[slotIdx];
      if (!label) {
        continue;
      }

      try {
        // Embed the exact screenshot image of the resi (paste method)
        let embeddedImage;
        if (label.imageType === 'jpg') {
          embeddedImage = await outDoc.embedJpg(label.imageBytes);
        } else {
          embeddedImage = await outDoc.embedPng(label.imageBytes);
        }

        const srcW = embeddedImage.width;
        const srcH = embeddedImage.height;

        // Cell padding to keep resi cleanly within border
        const padding = 2;
        const innerCellW = cellWidth - 2 * padding;
        const innerCellH = cellHeight - 2 * padding;

        let drawW: number;
        let drawH: number;
        let drawX: number;
        let drawY: number;

        if (settings.scaleMode === 'fit') {
          const scale = Math.min(innerCellW / srcW, innerCellH / srcH);
          drawW = srcW * scale;
          drawH = srcH * scale;
          drawX = cellLeft + padding + (innerCellW - drawW) / 2;
          drawY = cellBottom + padding + (innerCellH - drawH) / 2;
        } else {
          // Fill
          drawW = innerCellW;
          drawH = innerCellH;
          drawX = cellLeft + padding;
          drawY = cellBottom + padding;
        }

        // Paste the exact screenshot image into the cell
        a4Page.drawImage(embeddedImage, {
          x: drawX,
          y: drawY,
          width: drawW,
          height: drawH,
        });
      } catch (err) {
        console.error('Failed to paste label image into A4:', err);
        a4Page.drawText(toSafePdfText(`Resi #${slotIdx + 1}: ${label.resiNo || 'Error'}`), {
          x: cellLeft + 10,
          y: cellBottom + cellHeight / 2,
          size: 8,
          font: font,
          color: rgb(0.8, 0.2, 0.2),
        });
      }
    }
  }

  const pdfBytes = await outDoc.save();
  const blob = new Blob([pdfBytes as unknown as BlobPart], { type: 'application/pdf' });
  const blobUrl = URL.createObjectURL(blob);

  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const filename = `Resi_A4_${preset}up_${dateStr}.pdf`;

  return {
    pdfBytes,
    blobUrl,
    totalPages,
    totalLabels: labels.length,
    labelsPerPage,
    filename,
  };
}
