import JsBarcode from 'jsbarcode';
import QRCode from 'qrcode';
import { LabelItem } from '../types';
import { dataUrlToBytes } from './pdfParser';

export interface SampleLabelSpec {
  courier: 'anteraja' | 'spx';
  serviceType: string;
  resiNo: string;
  orderId: string;
  recipientName: string;
  hasHomeBadge?: boolean;
  recipientAddress: string;
  recipientCity: string;
  recipientDistrict: string;
  recipientSubDistrict?: string;
  senderName: string;
  senderPhone: string;
  senderCity: string;
  weight: string;
  deadline: string;
  routeCode1?: string;
  routeCode2?: string;
  items: Array<{ name: string; qty: number; note?: string }>;
}

export const SAMPLE_LABELS_DATA: SampleLabelSpec[] = [
  // 1. Top-Left: Riva (Anteraja REG)
  {
    courier: 'anteraja',
    serviceType: 'REG',
    resiNo: '11004518656533',
    orderId: '261013H8GJY715',
    recipientName: 'Riva',
    hasHomeBadge: false,
    recipientAddress: 'Villa pamulang, jalan ismaya 1 u14 no 1b rumah ujung deket turunan, PAMULANG, KOTA TANGERANG SELATAN, BANTEN',
    recipientCity: 'KOTA TANGERANG SELATAN',
    recipientDistrict: 'PAMULANG',
    senderName: 'Pyoor Food & Healthy D...',
    senderPhone: '6282115090992',
    senderCity: 'KOTA TANGERANG SELAT AN',
    weight: '150 gr',
    deadline: '16-10-2026',
    items: [
      {
        name: '[New/Baru] 80 Halaman Buku Latihan Membaca by KUMON/ Reading / Worksheet Latihan Membaca Grade 1 atau setara SD Kelas 1',
        qty: 1,
      },
    ],
  },
  // 2. Top-Right: Valensia (Anteraja REG)
  {
    courier: 'anteraja',
    serviceType: 'REG',
    resiNo: '11004522988833',
    orderId: '261014K884KYF7',
    recipientName: 'Valensia',
    hasHomeBadge: true,
    recipientAddress: 'Perumahan Taman Modern. Jalan Flamboyan 3 blok F4 nmr 7. Cakung-jaktim, CAKUNG, KOTA JAKARTA TIMUR, DKI JAKARTA',
    recipientCity: 'KOTA JAKARTA TIMUR',
    recipientDistrict: 'CAKUNG',
    senderName: 'Pyoor Food & Healthy D...',
    senderPhone: '6282115090992',
    senderCity: 'KOTA TANGERANG SELAT AN',
    weight: '200 gr',
    deadline: '17-10-2026',
    items: [
      {
        name: '[New/Baru] 76 Halaman Buku Belajar Matematika WORD PROBLEMS Grade 2 by KUMON',
        qty: 1,
      },
    ],
  },
  // 3. Middle-Left: Nici (Anteraja REG)
  {
    courier: 'anteraja',
    serviceType: 'REG',
    resiNo: '11004522987364',
    orderId: '261014KJQVPQM2',
    recipientName: 'Nici',
    hasHomeBadge: true,
    recipientAddress: 'Citra Garden 2 blok C2 no 15, Jalan Kesayangan Selatan (Sebelah air isi ulang BIRU), KALIDERES, AN KOTA JAKARTA BARAT, DKI JAKARTA',
    recipientCity: 'KOTA JAKARTA BARAT',
    recipientDistrict: 'KALIDERES',
    senderName: 'Pyoor Food & Healthy D...',
    senderPhone: '6282115090992',
    senderCity: 'KOTA TANGERANG SELAT AN',
    weight: '200 gr',
    deadline: '20-10-2026',
    items: [
      {
        name: '[New/Baru] 80 Halaman Buku Latihan Matematika Kumon Kelas 4 SD / Word Problems Grade 4',
        qty: 1,
      },
    ],
  },
  // 4. Middle-Right: Toko Berjaya (SPX Express STD with QR Code)
  {
    courier: 'spx',
    serviceType: 'STD',
    resiNo: 'SPXID06678922670A',
    orderId: '261014KYFN5Q0Q',
    recipientName: 'Toko Berjaya',
    hasHomeBadge: true,
    recipientAddress: 'Jl. Raya Surodinawan 190 (tikungan Pekuncen), PRAJURIT KULON, KOTA MOJOKERTO, JAWA TIMUR',
    recipientCity: 'KOTA MOJOKERTO',
    recipientDistrict: 'PRAJURIT KULON',
    recipientSubDistrict: 'Wringinrejo',
    senderName: 'Pyoor Food & Healthy Drinks',
    senderPhone: '6282115090992',
    senderCity: 'KOTA TANGERANG S...',
    weight: '150 gr',
    deadline: '17-10-2026',
    routeCode1: 'N-10',
    routeCode2: 'MJK-B-01',
    items: [
      {
        name: '[New/Baru] 60 Lembar Latihan Soal OLIMPIADE NASIONAL BAHASA INGGRIS Kategori SD Kelas 3-4',
        qty: 1,
        note: 'Pesan: kelas 5-6 (261014KYFN5Q0Q) (SPXID06678922670A)',
      },
    ],
  },
  // 5. Bottom-Left: Nici (Anteraja REG - exact replica of bottom left in user's image)
  {
    courier: 'anteraja',
    serviceType: 'REG',
    resiNo: '11004522987364',
    orderId: '261014KJQVPQM2',
    recipientName: 'Nici',
    hasHomeBadge: true,
    recipientAddress: 'Citra Garden 2 blok C2 no 15, Jalan Kesayangan Selatan (Sebelah air isi ulang BIRU), KALIDERES, AN KOTA JAKARTA BARAT, DKI JAKARTA',
    recipientCity: 'KOTA JAKARTA BARAT',
    recipientDistrict: 'KALIDERES',
    senderName: 'Pyoor Food & Healthy D...',
    senderPhone: '6282115090992',
    senderCity: 'KOTA TANGERANG SELAT AN',
    weight: '200 gr',
    deadline: '20-10-2026',
    items: [
      {
        name: '[New/Baru] 80 Halaman Buku Latihan Matematika Kumon Kelas 4 SD / Word Problems Grade 4',
        qty: 1,
      },
    ],
  },
  // 6. Bottom-Right: Valensia (Anteraja REG - exact replica of bottom right in user's image)
  {
    courier: 'anteraja',
    serviceType: 'REG',
    resiNo: '11004522988833',
    orderId: '261014K884KYF7',
    recipientName: 'Valensia',
    hasHomeBadge: true,
    recipientAddress: 'Perumahan Taman Modern. Jalan Flamboyan 3 blok F4 nmr 7. Cakung-jaktim, CAKUNG, KOTA JAKARTA TIMUR, DKI JAKARTA',
    recipientCity: 'KOTA JAKARTA TIMUR',
    recipientDistrict: 'CAKUNG',
    senderName: 'Pyoor Food & Healthy D...',
    senderPhone: '6282115090992',
    senderCity: 'KOTA TANGERANG SELAT AN',
    weight: '200 gr',
    deadline: '17-10-2026',
    items: [
      {
        name: '[New/Baru] 76 Halaman Buku Belajar Matematika WORD PROBLEMS Grade 2 by KUMON',
        qty: 1,
      },
    ],
  },
];

/**
 * Draws the Anteraja label layout exactly matching the user's uploaded image.png
 */
async function drawAnterajaResi(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, spec: SampleLabelSpec) {
  const m = 18;
  const w = canvas.width - 2 * m;
  const h = canvas.height - 2 * m;

  // Solid black outer border
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 2.5;
  ctx.strokeRect(m, m, w, h);

  // Tracking numbers above the top border
  ctx.fillStyle = '#000000';
  ctx.font = 'bold 11px monospace';
  ctx.textAlign = 'left';
  ctx.fillText(spec.resiNo, m + 28, m - 5);
  ctx.textAlign = 'right';
  ctx.fillText(spec.resiNo, canvas.width - m - 28, m - 5);
  ctx.textAlign = 'left';

  // 1. Top header row: Shopee Logo | REG | anteraja
  // Shopee Logo
  ctx.fillStyle = '#ee4d2d';
  ctx.font = 'bold 22px sans-serif';
  ctx.fillText('🛍 Shopee', m + 14, m + 36);

  // REG (Center)
  ctx.fillStyle = '#000000';
  ctx.font = 'bold 28px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(spec.serviceType, canvas.width / 2, m + 38);
  ctx.textAlign = 'left';

  // Anteraja Logo (Right)
  ctx.fillStyle = '#d81b60';
  ctx.font = 'bold 20px sans-serif';
  ctx.textAlign = 'right';
  ctx.fillText('⚡ anteraja', canvas.width - m - 14, m + 36);
  ctx.textAlign = 'left';

  // Dashed separator line under header
  let curY = m + 48;
  ctx.lineWidth = 1;
  ctx.setLineDash([4, 3]);
  ctx.beginPath();
  ctx.moveTo(m, curY);
  ctx.lineTo(canvas.width - m, curY);
  ctx.stroke();
  ctx.setLineDash([]); // reset to solid

  // 2. Resi Number Title
  curY += 24;
  ctx.fillStyle = '#000000';
  ctx.font = 'bold 20px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(`No. Resi: ${spec.resiNo}`, canvas.width / 2, curY);
  ctx.textAlign = 'left';

  // 3. Large Barcode
  curY += 12;
  const barcodeCanvas = document.createElement('canvas');
  try {
    JsBarcode(barcodeCanvas, spec.resiNo, {
      format: 'CODE128',
      width: 2.8,
      height: 70,
      displayValue: false,
      margin: 0,
      background: '#ffffff',
      lineColor: '#000000',
    });
    const bW = Math.min(w - 70, barcodeCanvas.width);
    const bX = (canvas.width - bW) / 2;
    ctx.drawImage(barcodeCanvas, bX, curY, bW, 74);
  } catch {
    ctx.fillRect(m + 40, curY, w - 80, 60);
  }

  // 4. Vertical Tracking Number on Left & Right Borders
  ctx.save();
  ctx.font = 'bold 11px monospace';
  ctx.fillStyle = '#000000';
  ctx.translate(m - 5, curY + 110);
  ctx.rotate(-Math.PI / 2);
  ctx.fillText(spec.resiNo, 0, 0);
  ctx.restore();

  ctx.save();
  ctx.font = 'bold 11px monospace';
  ctx.fillStyle = '#000000';
  ctx.translate(canvas.width - m + 14, curY + 20);
  ctx.rotate(Math.PI / 2);
  ctx.fillText(spec.resiNo, 0, 0);
  ctx.restore();

  // Solid separator below barcode
  curY += 86;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(m, curY);
  ctx.lineTo(canvas.width - m, curY);
  ctx.stroke();

  // 5. Recipient (Penerima) and Sender (Pengirim)
  const splitX = m + w * 0.58;
  const recipientSectionHeight = 175;
  ctx.beginPath();
  ctx.moveTo(splitX, curY);
  ctx.lineTo(splitX, curY + recipientSectionHeight);
  ctx.stroke();

  // Recipient (Left side)
  ctx.font = 'bold 16px sans-serif';
  ctx.fillText(`Penerima: ${spec.recipientName}`, m + 14, curY + 24);

  let addrStartY = curY + 50;
  if (spec.hasHomeBadge) {
    // HOME badge box
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 1;
    ctx.strokeRect(m + 14, curY + 34, 54, 18);
    ctx.font = 'bold 11px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('HOME', m + 14 + 27, curY + 47);
    ctx.textAlign = 'left';
    addrStartY = curY + 68;
  }

  // Recipient Address (Wrapped)
  ctx.font = '13.5px sans-serif';
  ctx.fillStyle = '#111827';
  const addressWords = spec.recipientAddress.split(' ');
  let addrLine = '';
  let lineCount = 0;
  let py = addrStartY;

  for (const word of addressWords) {
    if ((addrLine + word).length > 33) {
      ctx.fillText(addrLine, m + 14, py);
      py += 19;
      lineCount++;
      addrLine = word + ' ';
      if (lineCount >= 4) break;
    } else {
      addrLine += word + ' ';
    }
  }
  if (addrLine.trim() && lineCount < 4) {
    ctx.fillText(addrLine, m + 14, py);
  }

  // Sender (Right side)
  ctx.font = 'bold 15px sans-serif';
  ctx.fillText('Pengirim:', splitX + 12, curY + 24);
  ctx.font = '13.5px sans-serif';
  ctx.fillText(spec.senderName, splitX + 12, curY + 46);
  ctx.fillText(spec.senderPhone, splitX + 12, curY + 68);
  ctx.fillText('KOTA TANGERANG SELAT', splitX + 12, curY + 90);
  ctx.fillText('AN', splitX + 12, curY + 108);

  // Solid line below recipient/sender
  curY += recipientSectionHeight;
  ctx.beginPath();
  ctx.moveTo(m, curY);
  ctx.lineTo(canvas.width - m, curY);
  ctx.stroke();

  // 6. Destination boxes: [ KOTA TANGERANG SELATAN ] [ PAMULANG ]
  const destH = 38;
  const leftBoxW = w * 0.55;
  ctx.strokeRect(m + 12, curY + 6, leftBoxW, destH);
  ctx.font = 'bold 15px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(spec.recipientCity, m + 12 + leftBoxW / 2, curY + 30);

  const rightBoxW = w * 0.45 - 24;
  ctx.strokeRect(m + 20 + leftBoxW, curY + 6, rightBoxW, destH);
  ctx.fillText(spec.recipientDistrict, m + 20 + leftBoxW + rightBoxW / 2, curY + 30);
  ctx.textAlign = 'left';

  // 7. Cashless row
  curY += 52;
  const cashH = 32;
  ctx.strokeRect(m + 12, curY, 120, cashH);
  ctx.font = 'bold 15px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('CASHLESS', m + 12 + 60, curY + 22);

  ctx.strokeRect(m + 138, curY, w - 150, cashH);
  ctx.font = '13.5px sans-serif';
  ctx.fillText('Penjual tidak perlu bayar ongkir ke Kurir', m + 138 + (w - 150) / 2, curY + 21);
  ctx.textAlign = 'left';

  // 8. Weight, Batas Kirim, No. Pesanan and Order Barcode
  curY += 42;
  ctx.font = 'bold 13.5px sans-serif';
  ctx.fillText(`Berat: ${spec.weight}`, m + 14, curY + 16);
  ctx.fillText(`Batas Kirim: ${spec.deadline}`, m + 14, curY + 36);
  ctx.fillText(`No. Pesanan: ${spec.orderId}`, m + 14, curY + 56);

  // Secondary order barcode
  const orderBarcodeCanvas = document.createElement('canvas');
  try {
    JsBarcode(orderBarcodeCanvas, spec.orderId, {
      format: 'CODE128',
      width: 1.9,
      height: 44,
      displayValue: false,
      margin: 0,
      background: '#ffffff',
      lineColor: '#000000',
    });
    ctx.drawImage(orderBarcodeCanvas, canvas.width - m - 230, curY + 10, 210, 46);
  } catch {
    ctx.fillRect(canvas.width - m - 230, curY + 10, 210, 40);
  }

  // Solid line above items table
  curY += 72;
  ctx.beginPath();
  ctx.moveTo(m, curY);
  ctx.lineTo(canvas.width - m, curY);
  ctx.stroke();

  // 9. Items table header
  ctx.font = 'bold 11px sans-serif';
  ctx.fillText('#', m + 14, curY + 16);
  ctx.fillText('Nama Produk', m + 36, curY + 16);
  ctx.fillText('SKU', m + 350, curY + 16);
  ctx.fillText('Variasi', m + 440, curY + 16);
  ctx.fillText('Qty', m + 530, curY + 16);

  curY += 24;
  spec.items.forEach((item, idx) => {
    ctx.font = '11.5px sans-serif';
    ctx.fillText(`${idx + 1}`, m + 14, curY + 14);

    const pwords = item.name.split(' ');
    let pline = '';
    let py = curY + 14;
    for (const w of pwords) {
      if ((pline + w).length > 46) {
        ctx.fillText(pline, m + 36, py);
        py += 15;
        pline = w + ' ';
      } else {
        pline += w + ' ';
      }
    }
    if (pline.trim()) {
      ctx.fillText(pline, m + 36, py);
    }

    ctx.font = 'bold 13px sans-serif';
    ctx.fillText(`${item.qty}`, m + 535, curY + 14);
    curY = py + 12;
  });

  // Pesan / Order note
  ctx.font = '11px sans-serif';
  ctx.fillText(`Pesan: (${spec.orderId})`, m + 14, canvas.height - m - 30);

  // 10. Bottom tracking numbers
  ctx.font = 'bold 11px monospace';
  ctx.textAlign = 'left';
  ctx.fillText(spec.resiNo, m + 28, canvas.height - m + 14);
  ctx.textAlign = 'right';
  ctx.fillText(spec.resiNo, canvas.width - m - 28, canvas.height - m + 14);
  ctx.textAlign = 'left';
}

/**
 * Draws the SPX Express STD label layout with route boxes & QR code
 * exactly matching the 4th box in user's uploaded image.png
 */
async function drawSpxResi(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, spec: SampleLabelSpec) {
  const m = 18;
  const w = canvas.width - 2 * m;
  const h = canvas.height - 2 * m;

  // Solid outer border
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 2.5;
  ctx.strokeRect(m, m, w, h);

  // Tracking numbers above top border
  ctx.fillStyle = '#000000';
  ctx.font = 'bold 10px monospace';
  ctx.textAlign = 'left';
  ctx.fillText(spec.resiNo.slice(0, 16), m + 20, m - 5);
  ctx.textAlign = 'right';
  ctx.fillText(spec.resiNo.slice(0, 16), canvas.width - m - 20, m - 5);
  ctx.textAlign = 'left';

  // 1. Top Header: Shopee Logo | STD | SPX Express
  ctx.fillStyle = '#ee4d2d';
  ctx.font = 'bold 22px sans-serif';
  ctx.fillText('🛍 Shopee', m + 14, m + 36);

  ctx.fillStyle = '#000000';
  ctx.font = 'bold 26px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('STD', canvas.width / 2, m + 38);
  ctx.textAlign = 'left';

  // SPX Express Logo
  ctx.fillStyle = '#ee4d2d';
  ctx.font = 'italic bold 26px sans-serif';
  ctx.textAlign = 'right';
  ctx.fillText('SPX', canvas.width - m - 14, m + 36);
  ctx.font = 'bold 10px sans-serif';
  ctx.fillText('EXPRESS', canvas.width - m - 14, m + 48);
  ctx.textAlign = 'left';

  let curY = m + 54;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(m, curY);
  ctx.lineTo(canvas.width - m, curY);
  ctx.stroke();

  // 2. Route Codes Section: [ N-10 ] | [ MJK-B-01 + barcode ] | [ No. Resi: SPXID... ]
  const routeBoxH = 92;
  // Left box: N-10
  const box1W = 120;
  ctx.strokeRect(m, curY, box1W, routeBoxH);
  ctx.font = 'bold 36px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('N-10', m + box1W / 2, curY + 58);
  ctx.textAlign = 'left';

  // Center / Right Box: MJK-B-01 with Barcode
  const box2X = m + box1W;
  const box2W = w - box1W;
  ctx.strokeRect(box2X, curY, box2W, routeBoxH);

  // Hub Code
  ctx.font = 'bold 18px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('MJK-B-01', box2X + box2W * 0.35, curY + 22);

  // Resi title on right
  ctx.font = '11px sans-serif';
  ctx.fillText('No. Resi:', box2X + box2W * 0.78, curY + 16);
  ctx.font = 'bold 11px sans-serif';
  ctx.fillText(spec.resiNo, box2X + box2W * 0.78, curY + 28);
  ctx.textAlign = 'left';

  // Barcode in route box
  const spxBarcodeCanvas = document.createElement('canvas');
  try {
    JsBarcode(spxBarcodeCanvas, spec.resiNo, {
      format: 'CODE128',
      width: 2.2,
      height: 48,
      displayValue: false,
      margin: 0,
      background: '#ffffff',
      lineColor: '#000000',
    });
    ctx.drawImage(spxBarcodeCanvas, box2X + 16, curY + 36, box2W - 32, 50);
  } catch {
    ctx.fillRect(box2X + 16, curY + 36, box2W - 32, 45);
  }

  curY += routeBoxH;
  ctx.beginPath();
  ctx.moveTo(m, curY);
  ctx.lineTo(canvas.width - m, curY);
  ctx.stroke();

  // 3. Penerima & Pengirim
  const recipientH = 120;
  const splitX = m + w * 0.58;
  ctx.beginPath();
  ctx.moveTo(splitX, curY);
  ctx.lineTo(splitX, curY + recipientH);
  ctx.stroke();

  // Penerima
  ctx.font = 'bold 15px sans-serif';
  ctx.fillText(`Penerima: ${spec.recipientName}`, m + 14, curY + 20);

  // HOME box
  ctx.strokeRect(m + 14, curY + 28, 48, 16);
  ctx.font = 'bold 10px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('HOME', m + 14 + 24, curY + 40);
  ctx.textAlign = 'left';

  ctx.font = '13px sans-serif';
  ctx.fillStyle = '#111827';
  ctx.fillText('Jl. Raya Surodinawan 190 (tikungan Pekuncen),', m + 14, curY + 60);
  ctx.fillText('PRAJURIT KULON, KOTA MOJOKERTO, JAWA', m + 14, curY + 76);
  ctx.fillText('TIMUR', m + 14, curY + 92);

  // Pengirim
  ctx.font = 'bold 14px sans-serif';
  ctx.fillText('Pengirim: Pyoor Food & Healthy', splitX + 10, curY + 20);
  ctx.fillText('Drinks', splitX + 65, curY + 36);
  ctx.font = '13px sans-serif';
  ctx.fillText('6282115090992', splitX + 10, curY + 54);
  ctx.fillText('KOTA TANGERANG S...', splitX + 10, curY + 72);

  curY += recipientH;
  ctx.beginPath();
  ctx.moveTo(m, curY);
  ctx.lineTo(canvas.width - m, curY);
  ctx.stroke();

  // 4. Destination 3 Boxes: [ KOTA MOJOKERTO ] [ PRAJURIT KULON ] [ Wringinrejo ]
  const destH = 34;
  const dBox1W = w * 0.38;
  const dBox2W = w * 0.32;
  const dBox3W = w - dBox1W - dBox2W;

  ctx.strokeRect(m, curY, dBox1W, destH);
  ctx.font = 'bold 14px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(spec.recipientCity, m + dBox1W / 2, curY + 22);

  ctx.strokeRect(m + dBox1W, curY, dBox2W, destH);
  ctx.fillText(spec.recipientDistrict, m + dBox1W + dBox2W / 2, curY + 22);

  ctx.strokeRect(m + dBox1W + dBox2W, curY, dBox3W, destH);
  ctx.font = '12px sans-serif';
  ctx.fillText(spec.recipientSubDistrict || 'Wringinrejo', m + dBox1W + dBox2W + dBox3W / 2, curY + 22);
  ctx.textAlign = 'left';

  curY += destH;
  ctx.beginPath();
  ctx.moveTo(m, curY);
  ctx.lineTo(canvas.width - m, curY);
  ctx.stroke();

  // 5. Weight, Deadline, COD Cek Dulu, AND QR CODE!
  const midH = 88;
  ctx.font = 'bold 12.5px sans-serif';
  ctx.fillText(`Berat: ${spec.weight}`, m + 14, curY + 18);
  ctx.fillText(`Batas Kirim: ${spec.deadline}`, m + 14, curY + 36);
  ctx.fillText(`No.Pesanan: ${spec.orderId}`, m + 14, curY + 54);

  // Center: COD Cek Dulu: Tidak
  ctx.font = 'bold 12px sans-serif';
  ctx.fillText('COD Cek Dulu: Tidak', m + 230, curY + 18);

  // Right: QR Code!
  const qrCanvas = document.createElement('canvas');
  try {
    await QRCode.toCanvas(qrCanvas, `SPX:${spec.resiNo}:${spec.orderId}`, {
      width: 76,
      margin: 1,
      color: { dark: '#000000', light: '#ffffff' },
    });
    ctx.drawImage(qrCanvas, canvas.width - m - 88, curY + 6, 76, 76);
  } catch {
    ctx.fillRect(canvas.width - m - 88, curY + 6, 76, 76);
  }

  curY += midH;
  ctx.beginPath();
  ctx.moveTo(m, curY);
  ctx.lineTo(canvas.width - m, curY);
  ctx.stroke();

  // 6. Items Table
  ctx.font = 'bold 10px sans-serif';
  ctx.fillText('#', m + 14, curY + 14);
  ctx.fillText('Nama Produk', m + 32, curY + 14);
  ctx.fillText('SKU', m + 360, curY + 14);
  ctx.fillText('Variasi', m + 440, curY + 14);
  ctx.fillText('Qty', m + 530, curY + 14);

  curY += 20;
  spec.items.forEach((item, idx) => {
    ctx.font = '11px sans-serif';
    ctx.fillText(`${idx + 1}`, m + 14, curY + 14);

    const pwords = item.name.split(' ');
    let pline = '';
    let py = curY + 14;
    for (const w of pwords) {
      if ((pline + w).length > 44) {
        ctx.fillText(pline, m + 32, py);
        py += 15;
        pline = w + ' ';
      } else {
        pline += w + ' ';
      }
    }
    if (pline.trim()) {
      ctx.fillText(pline, m + 32, py);
    }
    ctx.font = 'bold 12px sans-serif';
    ctx.fillText(`${item.qty}`, m + 535, curY + 14);

    if (item.note) {
      ctx.font = '10px sans-serif';
      ctx.fillText(item.note, m + 14, py + 16);
    }
  });

  // 7. Bottom numbers
  ctx.font = 'bold 10px monospace';
  ctx.textAlign = 'left';
  ctx.fillText(spec.resiNo.slice(0, 16), m + 20, canvas.height - m + 12);
  ctx.textAlign = 'right';
  ctx.fillText(spec.resiNo.slice(0, 16), canvas.width - m - 20, canvas.height - m + 12);
  ctx.textAlign = 'left';
}

/**
 * Creates 6 sample LabelItem objects by rendering the exact layouts shown in image.png
 */
export async function createSampleLabelItems(count = 6): Promise<LabelItem[]> {
  const items: LabelItem[] = [];
  const specs = SAMPLE_LABELS_DATA.slice(0, Math.min(count, SAMPLE_LABELS_DATA.length));

  for (let i = 0; i < specs.length; i++) {
    const spec = specs[i];
    const canvas = document.createElement('canvas');
    canvas.width = 620;
    canvas.height = 890;
    const ctx = canvas.getContext('2d');
    if (!ctx) continue;

    // Fill white
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (spec.courier === 'spx') {
      await drawSpxResi(ctx, canvas, spec);
    } else {
      await drawAnterajaResi(ctx, canvas, spec);
    }

    const dataUrl = canvas.toDataURL('image/png', 0.98);
    const imageBytes = dataUrlToBytes(dataUrl);

    items.push({
      id: `sample-${i + 1}-${Date.now()}`,
      sourceFileName: `resi_${spec.resiNo}.pdf`,
      pageIndex: 0,
      totalPagesInSource: 1,
      resiNo: spec.resiNo,
      orderId: spec.orderId,
      courier: spec.courier === 'spx' ? 'SPX STD' : 'Anteraja REG',
      recipientName: spec.recipientName,
      recipientCity: spec.recipientCity,
      width: canvas.width,
      height: canvas.height,
      thumbnailUrl: dataUrl,
      imageBytes: imageBytes,
      imageType: 'png',
    });
  }

  return items;
}
