import React from 'react';
import { X, Check, FileText, Printer, Scissors, HelpCircle } from 'lucide-react';
import { GRID_CONFIGS, GridPreset } from '../types';

interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPreset: (preset: GridPreset) => void;
  currentPreset: GridPreset;
}

export const GuideModal: React.FC<GuideModalProps> = ({
  isOpen,
  onClose,
  onSelectPreset,
  currentPreset,
}) => {
  if (!isOpen) return null;

  const presets: GridPreset[] = [2, 4, 6, 8, 10];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Panduan Template Resi A4 (2, 4, 6, 8, 10 Resi)
              </h3>
              <p className="text-xs text-slate-500">
                Pilih susunan template terbaik sesuai jenis paket dan kebutuhan cetak Anda
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-600">
          {/* Comparison Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {presets.map((preset) => {
              const cfg = GRID_CONFIGS[preset];
              const isCurrent = currentPreset === preset;
              const isSample = preset === 6;

              return (
                <div
                  key={preset}
                  className={`p-3.5 rounded-xl border transition-all ${
                    isCurrent
                      ? 'border-orange-500 bg-orange-50/60 ring-1 ring-orange-400'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-sm text-slate-900">{cfg.name}</span>
                        {isSample && (
                          <span className="px-1.5 py-0.2 bg-orange-600 text-white font-bold text-[9px] rounded">
                            Contoh Anda
                          </span>
                        )}
                      </div>
                      <div className="font-mono text-[11px] text-slate-500 mt-0.5">
                        Grid: {cfg.cols} Kolom × {cfg.rows} Baris · {cfg.estimatedDimensions}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        onSelectPreset(preset);
                        onClose();
                      }}
                      className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition-colors cursor-pointer ${
                        isCurrent
                          ? 'bg-orange-600 text-white'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      {isCurrent ? 'Aktif' : 'Pilih'}
                    </button>
                  </div>

                  <p className="mt-2 text-slate-600 text-[11px] leading-relaxed">
                    {cfg.suitableFor}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Printing Tips */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <h4 className="font-bold text-slate-800 flex items-center gap-1.5">
              <Printer className="w-4 h-4 text-slate-600" />
              <span>Tips Hasil Cetak Tajam & Barcode Terbaca Sempurna:</span>
            </h4>
            <ul className="space-y-1.5 text-[11px] text-slate-600 list-disc list-inside">
              <li>
                <strong>Pilih Ukuran A4 (210 × 297 mm)</strong> di jendela pengaturan printer browser.
              </li>
              <li>
                <strong>Skala / Scale:</strong> Pilih <em>"Fit to printable area"</em> atau <em>"Actual size (100%)"</em>.
              </li>
              <li>
                <strong>Kertas yang Didukung:</strong> Kertas HVS A4 standar 70-80gr (dipotong pakai gunting/cutter mengikut garis putus-putus) atau Kertas Stiker HVS A4.
              </li>
              <li>
                <strong>Barcode Scanner:</strong> File PDF hasil unduhan disusun dengan elemen vektor murni sehingga garis barcode tetap presisi 100% dan dapat di-scan oleh kurir ekspedisi.
              </li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
