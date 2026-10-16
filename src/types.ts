export type GridPreset = 2 | 4 | 6 | 8 | 10;

export type CutLineStyle = 'dashed' | 'solid' | 'none';

export type MarginPreset = 'tight' | 'normal' | 'wide';

export type GapPreset = 'none' | 'small' | 'medium' | 'large';

export interface GridLayoutConfig {
  preset: GridPreset;
  cols: number;
  rows: number;
  name: string;
  badge?: string;
  description: string;
  estimatedDimensions: string;
  suitableFor: string;
}

export const GRID_CONFIGS: Record<GridPreset, GridLayoutConfig> = {
  2: {
    preset: 2,
    cols: 1,
    rows: 2,
    name: '2 Resi / A4',
    description: '1 kolom × 2 baris (Ukuran A5)',
    estimatedDimensions: '190 × 130 mm',
    suitableFor: 'Resi detail ukuran besar dengan daftar produk panjang',
  },
  4: {
    preset: 4,
    cols: 2,
    rows: 2,
    name: '4 Resi / A4',
    description: '2 kolom × 2 baris (Ukuran A6)',
    estimatedDimensions: '95 × 135 mm',
    suitableFor: 'Standar kertas thermal/stiker A6, sangat jelas terbaca',
  },
  6: {
    preset: 6,
    cols: 2,
    rows: 3,
    name: '6 Resi / A4',
    badge: 'Contoh User',
    description: '2 kolom × 3 baris (Resi 10152026)',
    estimatedDimensions: '95 × 90 mm',
    suitableFor: 'Format paling favorit & seimbang hemat kertas (seperti sampel Anda)',
  },
  8: {
    preset: 8,
    cols: 2,
    rows: 4,
    name: '8 Resi / A4',
    description: '2 kolom × 4 baris (Hemat Kertas)',
    estimatedDimensions: '95 × 68 mm',
    suitableFor: 'Resi paket kecil / amplop, hemat 87% kertas A4',
  },
  10: {
    preset: 10,
    cols: 2,
    rows: 5,
    name: '10 Resi / A4',
    description: '2 kolom × 5 baris (Maksimal Hemat)',
    estimatedDimensions: '95 × 54 mm',
    suitableFor: 'Resi ringkas / barcode ekspedisi reguler jumlah besar',
  },
};

export interface LabelItem {
  id: string;
  sourceFileName: string;
  pageIndex: number;
  totalPagesInSource: number;
  resiNo?: string;
  orderId?: string;
  courier?: string;
  recipientName?: string;
  recipientCity?: string;
  width: number;
  height: number;
  thumbnailUrl: string; // High-res screenshot data URL
  imageBytes: Uint8Array; // PNG/JPEG bytes for embedding
  imageType: 'png' | 'jpg';
  pdfBytes?: Uint8Array;
}

export interface GeneratorSettings {
  gridPreset: GridPreset;
  cutLineStyle: CutLineStyle;
  cutLineColor: string;
  marginPreset: MarginPreset;
  gapPreset: GapPreset;
  autoTrimWhiteMargins: boolean;
  trimMarginAmount: number; // in percentage, e.g. 0 to 15%
  showCutGuides: boolean;
  showPageNumbers: boolean;
  scaleMode: 'fit' | 'fill';
}

export const MARGIN_VALUES: Record<MarginPreset, number> = {
  tight: 10, // ~3.5mm
  normal: 18, // ~6.3mm
  wide: 28, // ~10mm
};

export const GAP_VALUES: Record<GapPreset, number> = {
  none: 0,
  small: 4, // ~1.4mm
  medium: 8, // ~2.8mm
  large: 14, // ~5mm
};
