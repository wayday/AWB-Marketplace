import React from 'react';
import { Printer, Download, Sparkles, FileText, HelpCircle } from 'lucide-react';

interface HeaderProps {
  onDownload: () => void;
  onPrint: () => void;
  onOpenGuide: () => void;
  onLoadSample: () => void;
  isGenerating: boolean;
  hasLabels: boolean;
  totalLabels: number;
}

export const Header: React.FC<HeaderProps> = ({
  onDownload,
  onPrint,
  onOpenGuide,
  onLoadSample,
  isGenerating,
  hasLabels,
  totalLabels,
}) => {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-8 px-6 py-3.5 bg-white border-b border-slate-200 shadow-xs">
      {/* Zone 1: Single text wordmark */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="w-9 h-9 rounded-lg bg-orange-600 flex items-center justify-center text-white shadow-xs">
          <FileText className="w-5 h-5" />
        </div>
        <div>
          <span className="text-base font-bold tracking-tight text-slate-900 whitespace-nowrap block leading-tight">
            Cetak Resi A4
          </span>
          <span className="text-[11px] text-slate-500 whitespace-nowrap block leading-tight">
            Pembuat Template Resi Multi-Up Otomatis
          </span>
        </div>
      </div>

      {/* Zone 2: Navigation / Info links */}
      <nav className="hidden lg:flex items-center gap-6 text-xs font-medium text-slate-600">
        <button
          onClick={onLoadSample}
          className="hover:text-orange-600 transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer text-slate-700"
          title="Muat 6 contoh resi seperti gambar yang Anda upload"
        >
          <Sparkles className="w-3.5 h-3.5 text-orange-500" />
          <span>Contoh Resi (Resi 10152026)</span>
        </button>
        <button
          onClick={onOpenGuide}
          className="hover:text-slate-900 transition-colors whitespace-nowrap flex items-center gap-1 cursor-pointer"
        >
          <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
          <span>Panduan Ukuran (2, 4, 6, 8, 10 Resi)</span>
        </button>
        <span className="text-slate-300">|</span>
        <span className="text-slate-500 whitespace-nowrap">
          Kertas: <strong className="text-slate-800 font-semibold">A4 Standar (210 × 297 mm)</strong>
        </span>
      </nav>

      {/* Zone 3: Primary Action buttons */}
      <div className="flex items-center gap-2.5 shrink-0">
        <button
          onClick={onPrint}
          disabled={!hasLabels || isGenerating}
          className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          title="Cetak langsung ke printer"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>Cetak Langsung</span>
        </button>

        <button
          onClick={onDownload}
          disabled={!hasLabels || isGenerating}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-orange-600 hover:bg-orange-700 active:bg-orange-800 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg shadow-xs hover:shadow transition-all whitespace-nowrap shrink-0 cursor-pointer"
        >
          {isGenerating ? (
            <>
              <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Menyiapkan PDF...</span>
            </>
          ) : (
            <>
              <Download className="w-3.5 h-3.5" />
              <span>Unduh PDF A4 {hasLabels ? `(${totalLabels} Resi)` : ''}</span>
            </>
          )}
        </button>
      </div>
    </header>
  );
};
