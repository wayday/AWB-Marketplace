import React from 'react';
import { GridPreset, GRID_CONFIGS } from '../types';
import { Check } from 'lucide-react';

interface GridSelectorProps {
  selectedPreset: GridPreset;
  onSelectPreset: (preset: GridPreset) => void;
  totalLabels: number;
}

const PRESETS: GridPreset[] = [2, 4, 6, 8, 10];

export const GridSelector: React.FC<GridSelectorProps> = ({
  selectedPreset,
  onSelectPreset,
  totalLabels,
}) => {
  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-slate-800 tracking-tight">
          Pilihan Template Resi (A4)
        </label>
        <span className="text-[11px] text-slate-500">
          {totalLabels > 0 ? (
            <>
              {Math.ceil(totalLabels / selectedPreset)} lembar A4 untuk {totalLabels} resi
            </>
          ) : (
            'Pilih jumlah per lembar'
          )}
        </span>
      </div>

      <div className="grid grid-cols-5 gap-1.5">
        {PRESETS.map((preset) => {
          const config = GRID_CONFIGS[preset];
          const isSelected = selectedPreset === preset;
          const isRecommended = preset === 6;

          return (
            <button
              key={preset}
              type="button"
              onClick={() => onSelectPreset(preset)}
              className={`relative flex flex-col items-center justify-between p-2 rounded-lg border text-center transition-all cursor-pointer ${
                isSelected
                  ? 'border-orange-500 bg-orange-50/80 text-orange-950 shadow-xs ring-1 ring-orange-400'
                  : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700 hover:bg-slate-50'
              }`}
            >
              {isRecommended && (
                <span className="absolute -top-2 left-1/2 -translate-x-1/2 px-1.5 py-0.2 bg-orange-600 text-[9px] font-bold text-white rounded shadow-xs whitespace-nowrap">
                  Contoh Anda
                </span>
              )}

              {/* Grid visual thumbnail */}
              <div
                className="w-full h-8 mb-1.5 rounded border border-slate-300 bg-slate-50 p-0.5 grid gap-0.5"
                style={{
                  gridTemplateColumns: `repeat(${config.cols}, minmax(0, 1fr))`,
                  gridTemplateRows: `repeat(${config.rows}, minmax(0, 1fr))`,
                }}
              >
                {Array.from({ length: config.cols * config.rows }).map((_, i) => (
                  <div
                    key={i}
                    className={`rounded-[1px] ${
                      isSelected ? 'bg-orange-300' : 'bg-slate-300'
                    }`}
                  />
                ))}
              </div>

              {/* Label */}
              <div className="text-[11px] font-bold leading-tight">
                {preset} Resi
              </div>
              <div className="text-[9px] text-slate-500 font-mono">
                {config.cols}×{config.rows}
              </div>

              {isSelected && (
                <div className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full bg-orange-600 text-white flex items-center justify-center">
                  <Check className="w-2.5 h-2.5" />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Selected preset description box */}
      <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-xs flex items-center justify-between">
        <div>
          <span className="font-semibold text-slate-800">
            {GRID_CONFIGS[selectedPreset].name}:
          </span>{' '}
          <span className="text-slate-600">
            {GRID_CONFIGS[selectedPreset].description}
          </span>
          <div className="text-[11px] text-slate-500 mt-0.5">
            Estimasi area: {GRID_CONFIGS[selectedPreset].estimatedDimensions} · {GRID_CONFIGS[selectedPreset].suitableFor}
          </div>
        </div>
      </div>
    </div>
  );
};
