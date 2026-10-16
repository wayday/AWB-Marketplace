import React, { useState } from 'react';
import { GeneratorSettings, CutLineStyle, MarginPreset, GapPreset } from '../types';
import { Scissors, Sliders, ChevronDown, ChevronUp, Maximize2, ShieldCheck } from 'lucide-react';

interface SettingsPanelProps {
  settings: GeneratorSettings;
  onChangeSettings: (newSettings: GeneratorSettings) => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  settings,
  onChangeSettings,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const updateSetting = <K extends keyof GeneratorSettings>(key: K, value: GeneratorSettings[K]) => {
    onChangeSettings({
      ...settings,
      [key]: value,
    });
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-2xs overflow-hidden">
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-3 text-left hover:bg-slate-50 transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-slate-500" />
          <div>
            <span className="text-xs font-semibold text-slate-800 block">
              Pengaturan Cetak & Garis Potong
            </span>
            <span className="text-[10px] text-emerald-600 font-medium block">
              Metode: Screenshot & Tempel Asli (100% Sesuai PDF Asli)
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-slate-500">
            {settings.cutLineStyle === 'dashed' ? 'Garis Putus-putus' : settings.cutLineStyle === 'solid' ? 'Garis Tipis' : 'Tanpa Garis'}
          </span>
          {isExpanded ? (
            <ChevronUp className="w-4 h-4 text-slate-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-400" />
          )}
        </div>
      </button>

      {/* Main quick toggles always visible */}
      <div className="px-3 pb-3 pt-1 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
        <div>
          <label className="text-[11px] font-medium text-slate-600 block mb-1">
            Garis Potong (Cut Guide)
          </label>
          <div className="grid grid-cols-3 gap-1 bg-slate-100 p-0.5 rounded-lg">
            {(['dashed', 'solid', 'none'] as CutLineStyle[]).map((style) => (
              <button
                key={style}
                type="button"
                onClick={() => updateSetting('cutLineStyle', style)}
                className={`py-1 text-[11px] font-medium rounded-md transition-colors cursor-pointer ${
                  settings.cutLineStyle === style
                    ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {style === 'dashed' ? 'Putus' : style === 'solid' ? 'Solid' : 'Tanpa'}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-[11px] font-medium text-slate-600 block mb-1">
            Margin Kertas A4
          </label>
          <div className="grid grid-cols-3 gap-1 bg-slate-100 p-0.5 rounded-lg">
            {(['tight', 'normal', 'wide'] as MarginPreset[]).map((margin) => (
              <button
                key={margin}
                type="button"
                onClick={() => updateSetting('marginPreset', margin)}
                className={`py-1 text-[11px] font-medium rounded-md transition-colors cursor-pointer ${
                  settings.marginPreset === margin
                    ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {margin === 'tight' ? 'Minimal' : margin === 'normal' ? 'Standar' : 'Lebar'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Detailed collapsible options */}
      {isExpanded && (
        <div className="px-3 pb-3 pt-2 bg-slate-50/70 border-t border-slate-200 space-y-2.5 text-xs">
          {/* Auto Trim White Margins */}
          <div className="flex items-center justify-between">
            <div>
              <span className="font-medium text-slate-800 text-[11px] block">
                Auto Trim Margin Putih Berlebih
              </span>
              <span className="text-[10px] text-slate-500 block">
                Memotong ruang kosong bawaan Shopee/marketplace agar barcode lebih besar
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.autoTrimWhiteMargins}
                onChange={(e) => updateSetting('autoTrimWhiteMargins', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-8 h-4 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3 after:w-3.5 after:transition-all peer-checked:bg-orange-600"></div>
            </label>
          </div>

          {/* Scale mode */}
          <div className="flex items-center justify-between pt-1">
            <div>
              <span className="font-medium text-slate-800 text-[11px] block">
                Rasio Proporsi Resi
              </span>
              <span className="text-[10px] text-slate-500 block">
                Kunci rasio asli agar teks & barcode tidak melar/gepeng
              </span>
            </div>
            <div className="flex items-center gap-1 bg-slate-200/70 p-0.5 rounded-md">
              <button
                type="button"
                onClick={() => updateSetting('scaleMode', 'fit')}
                className={`px-2 py-0.5 text-[10px] rounded transition-colors cursor-pointer ${
                  settings.scaleMode === 'fit' ? 'bg-white font-semibold text-slate-900 shadow-2xs' : 'text-slate-600'
                }`}
              >
                Pas Asli (Fit)
              </button>
              <button
                type="button"
                onClick={() => updateSetting('scaleMode', 'fill')}
                className={`px-2 py-0.5 text-[10px] rounded transition-colors cursor-pointer ${
                  settings.scaleMode === 'fill' ? 'bg-white font-semibold text-slate-900 shadow-2xs' : 'text-slate-600'
                }`}
              >
                Penuh Kotak
              </button>
            </div>
          </div>

          {/* Show Page Numbers Header/Footer */}
          <div className="flex items-center justify-between pt-1">
            <div>
              <span className="font-medium text-slate-800 text-[11px] block">
                Tampilkan Header Keterangan Halaman
              </span>
              <span className="text-[10px] text-slate-500 block">
                Mencetak "Halaman X dari Y · Format A4" di margin atas
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.showPageNumbers}
                onChange={(e) => updateSetting('showPageNumbers', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-8 h-4 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3 after:w-3.5 after:transition-all peer-checked:bg-orange-600"></div>
            </label>
          </div>
        </div>
      )}
    </div>
  );
};
