import React, { useState } from 'react';
import { GridPreset, GRID_CONFIGS, GeneratorSettings, LabelItem } from '../types';
import { ZoomIn, ZoomOut, RotateCcw, FileText, Eye, Printer, Download, Sparkles, Scissors } from 'lucide-react';

interface A4PaperPreviewProps {
  labels: LabelItem[];
  selectedPreset: GridPreset;
  settings: GeneratorSettings;
  pdfBlobUrl: string | null;
  currentPage: number;
  onPageChange: (page: number) => void;
  onDownload: () => void;
  onPrint: () => void;
  onLoadSample: () => void;
}

export const A4PaperPreview: React.FC<A4PaperPreviewProps> = ({
  labels,
  selectedPreset,
  settings,
  pdfBlobUrl,
  currentPage,
  onPageChange,
  onDownload,
  onPrint,
  onLoadSample,
}) => {
  const [zoom, setZoom] = useState<number>(90);
  const [viewMode, setViewMode] = useState<'grid' | 'pdf'>('grid');

  const config = GRID_CONFIGS[selectedPreset];
  const { cols, rows } = config;
  const labelsPerPage = cols * rows;
  const totalPages = Math.max(1, Math.ceil(labels.length / labelsPerPage));

  // Labels for the current page
  const startIndex = (currentPage - 1) * labelsPerPage;
  const pageLabels = labels.slice(startIndex, startIndex + labelsPerPage);

  const handleZoom = (delta: number) => {
    setZoom((prev) => Math.max(50, Math.min(150, prev + delta)));
  };

  if (labels.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 bg-slate-100/70 border border-slate-200/80 rounded-2xl text-center">
        <div className="w-16 h-16 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center text-orange-600 mb-4">
          <FileText className="w-8 h-8" />
        </div>
        <h3 className="text-base font-bold text-slate-800">
          Pratinjau Kertas A4 Siap Cetak
        </h3>
        <p className="text-xs text-slate-500 max-w-md mt-1.5 leading-relaxed">
          Unggah file PDF resi pengiriman Anda atau coba dengan contoh resi untuk melihat otomatis penyusunan ke kertas A4 (2, 4, 6, 8, atau 10 resi per lembar).
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={onLoadSample}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-orange-600 hover:bg-orange-700 rounded-lg shadow-sm transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Muat Contoh Resi (Resi 10152026)</span>
          </button>
        </div>

        <div className="mt-8 grid grid-cols-5 gap-3 max-w-lg text-slate-500 text-[11px]">
          <div className="p-2 bg-white rounded-lg border border-slate-200">
            <strong>2 Resi</strong>
            <div className="text-[10px] text-slate-400">1×2 · Ukuran A5</div>
          </div>
          <div className="p-2 bg-white rounded-lg border border-slate-200">
            <strong>4 Resi</strong>
            <div className="text-[10px] text-slate-400">2×2 · Ukuran A6</div>
          </div>
          <div className="p-2 bg-orange-50 rounded-lg border border-orange-200 text-orange-950 font-semibold">
            <strong>6 Resi</strong>
            <div className="text-[10px] text-orange-600">2×3 · Standar</div>
          </div>
          <div className="p-2 bg-white rounded-lg border border-slate-200">
            <strong>8 Resi</strong>
            <div className="text-[10px] text-slate-400">2×4 · Hemat</div>
          </div>
          <div className="p-2 bg-white rounded-lg border border-slate-200">
            <strong>10 Resi</strong>
            <div className="text-[10px] text-slate-400">2×5 · Maksimal</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-slate-100 rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
      {/* Top Preview Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 bg-white border-b border-slate-200">
        {/* Left: View Mode Tabs */}
        <div className="flex items-center gap-1 p-0.5 bg-slate-100 rounded-lg text-xs">
          <button
            type="button"
            onClick={() => setViewMode('grid')}
            className={`px-3 py-1 font-medium rounded-md transition-colors cursor-pointer ${
              viewMode === 'grid'
                ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Grid Pratinjau ({config.cols}×{config.rows})
          </button>
          <button
            type="button"
            onClick={() => setViewMode('pdf')}
            disabled={!pdfBlobUrl}
            className={`px-3 py-1 font-medium rounded-md transition-colors cursor-pointer ${
              viewMode === 'pdf'
                ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            PDF Dokumen Asli
          </button>
        </div>

        {/* Center: Pagination */}
        <div className="flex items-center gap-2 text-xs">
          <button
            type="button"
            disabled={currentPage <= 1}
            onClick={() => onPageChange(currentPage - 1)}
            className="px-2 py-1 text-slate-600 hover:text-slate-900 disabled:opacity-30 disabled:cursor-not-allowed bg-slate-100 hover:bg-slate-200 rounded cursor-pointer"
          >
            &larr; Prev
          </button>
          <span className="font-mono font-medium text-slate-700">
            Halaman {currentPage} / {totalPages}
          </span>
          <button
            type="button"
            disabled={currentPage >= totalPages}
            onClick={() => onPageChange(currentPage + 1)}
            className="px-2 py-1 text-slate-600 hover:text-slate-900 disabled:opacity-30 disabled:cursor-not-allowed bg-slate-100 hover:bg-slate-200 rounded cursor-pointer"
          >
            Next &rarr;
          </button>
        </div>

        {/* Right: Zoom controls and action */}
        <div className="flex items-center gap-2 text-xs">
          <div className="flex items-center bg-slate-100 rounded-lg p-0.5">
            <button
              type="button"
              onClick={() => handleZoom(-10)}
              className="p-1 text-slate-600 hover:text-slate-900 cursor-pointer"
              title="Perkecil zoom"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="px-1.5 font-mono text-[11px] text-slate-600 w-10 text-center">
              {zoom}%
            </span>
            <button
              type="button"
              onClick={() => handleZoom(10)}
              className="p-1 text-slate-600 hover:text-slate-900 cursor-pointer"
              title="Perbesar zoom"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setZoom(90)}
              className="p-1 text-slate-500 hover:text-slate-800 cursor-pointer border-l border-slate-200 ml-0.5"
              title="Reset zoom ke 90%"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          </div>

          <button
            type="button"
            onClick={onPrint}
            className="inline-flex items-center gap-1 px-2.5 py-1 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer"
            title="Cetak lembar A4 ini"
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Cetak</span>
          </button>

          <button
            type="button"
            onClick={onDownload}
            className="inline-flex items-center gap-1 px-3 py-1 font-semibold text-white bg-orange-600 hover:bg-orange-700 rounded-lg cursor-pointer shadow-2xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Unduh PDF</span>
          </button>
        </div>
      </div>

      {/* Main Preview Viewport */}
      <div className="flex-1 overflow-auto p-6 flex items-center justify-center bg-slate-200/60">
        {viewMode === 'pdf' && pdfBlobUrl ? (
          <div
            className="w-full h-full bg-white rounded-lg shadow-md overflow-hidden flex flex-col"
            style={{ minHeight: '680px' }}
          >
            <iframe
              src={`${pdfBlobUrl}#page=${currentPage}&toolbar=1&navpanes=0`}
              className="w-full flex-1 border-0"
              title="PDF Viewer"
            />
          </div>
        ) : (
          /* Simulated A4 Sheet with accurate aspect ratio */
          <div
            id="printable-a4-area"
            className="relative bg-white shadow-xl transition-all duration-150 ease-out select-none"
            style={{
              width: `${(595 * zoom) / 100}px`,
              minWidth: `${(595 * zoom) / 100}px`,
              height: `${(842 * zoom) / 100}px`,
              minHeight: `${(842 * zoom) / 100}px`,
              padding: settings.marginPreset === 'tight' ? '12px' : settings.marginPreset === 'wide' ? '28px' : '20px',
              boxSizing: 'border-box',
            }}
          >
            {/* Header info if enabled */}
            {settings.showPageNumbers && (
              <div className="absolute top-2 left-5 right-5 flex justify-between text-[10px] text-slate-400 font-mono pointer-events-none">
                <span>Halaman {currentPage} dari {totalPages} · Format: {config.name}</span>
                <span>Ukuran Kertas: A4 (210 × 297 mm)</span>
              </div>
            )}

            {/* A4 Grid */}
            <div
              className="w-full h-full grid gap-1.5"
              style={{
                gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
                gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
              }}
            >
              {Array.from({ length: labelsPerPage }).map((_, slotIdx) => {
                const label = pageLabels[slotIdx];
                const globalIndex = startIndex + slotIdx + 1;
                const isDashed = settings.cutLineStyle === 'dashed';
                const hasBorder = settings.cutLineStyle !== 'none';

                return (
                  <div
                    key={slotIdx}
                    className={`relative w-full h-full p-1 flex flex-col items-center justify-center bg-white overflow-hidden transition-all group ${
                      hasBorder
                        ? isDashed
                          ? 'border border-dashed border-slate-400 hover:border-orange-500'
                          : 'border border-slate-300 hover:border-orange-500'
                        : 'hover:outline hover:outline-1 hover:outline-orange-400'
                    }`}
                  >
                    {/* Cutting line scissor hint on top left */}
                    {hasBorder && isDashed && slotIdx === 0 && (
                      <div className="absolute top-1 left-1 text-slate-400 flex items-center gap-0.5 text-[9px] pointer-events-none">
                        <Scissors className="w-2.5 h-2.5" />
                        <span>Garis Potong</span>
                      </div>
                    )}

                    {label ? (
                      <div className="w-full h-full relative flex items-center justify-center overflow-hidden">
                        {/* Label preview image */}
                        <img
                          src={label.thumbnailUrl}
                          alt={label.resiNo || `Resi ${globalIndex}`}
                          className={`w-full h-full object-contain pointer-events-none ${
                            settings.scaleMode === 'fill' ? 'object-fill' : 'object-contain'
                          }`}
                        />

                        {/* Hover Overlay with Metadata */}
                        <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2 text-white text-[11px]">
                          <div className="flex items-center justify-between">
                            <span className="font-mono font-bold bg-orange-600 px-1.5 py-0.5 rounded text-[10px]">
                              #{globalIndex}
                            </span>
                            <span className="text-[10px] bg-black/60 px-1 py-0.5 rounded">
                              Slot {slotIdx + 1}
                            </span>
                          </div>

                          <div className="space-y-0.5 bg-black/40 p-1.5 rounded backdrop-blur-xs">
                            <div className="font-mono font-bold truncate">
                              {label.resiNo || 'No. Resi'}
                            </div>
                            {label.recipientName && (
                              <div className="text-[10px] text-slate-200 truncate">
                                Penerima: {label.recipientName}
                              </div>
                            )}
                            {label.orderId && (
                              <div className="text-[9px] text-slate-300 truncate">
                                Order: {label.orderId}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* Empty slot */
                      <div className="w-full h-full border border-dashed border-slate-200 bg-slate-50/50 rounded flex flex-col items-center justify-center text-slate-400 p-2 text-center">
                        <span className="text-[10px] font-mono">Slot #{slotIdx + 1}</span>
                        <span className="text-[9px] text-slate-400">Kosong</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Footer bar summary */}
      <div className="px-4 py-2 bg-white border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-3">
          <span>
            Total: <strong className="text-slate-800 font-semibold">{labels.length} Resi</strong>
          </span>
          <span>·</span>
          <span>
            Format: <strong className="text-slate-800 font-semibold">{config.name}</strong> ({config.estimatedDimensions})
          </span>
          <span>·</span>
          <span>
            Total Kertas: <strong className="text-slate-800 font-semibold">{totalPages} Lembar A4</strong>
          </span>
        </div>

        <div className="hidden md:flex items-center gap-2 text-[11px] text-emerald-700 font-medium">
          <span>Menghemat hingga {Math.round((1 - 1 / selectedPreset) * 100)}% kertas & stiker</span>
        </div>
      </div>
    </div>
  );
};
