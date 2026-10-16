import React from 'react';
import { LabelItem, GridPreset } from '../types';
import { Trash2, Copy, ArrowUp, ArrowDown, Layers, AlertCircle } from 'lucide-react';

interface LabelQueueProps {
  labels: LabelItem[];
  selectedPreset: GridPreset;
  onDeleteLabel: (id: string) => void;
  onDuplicateLabel: (id: string) => void;
  onMoveLabel: (index: number, direction: 'up' | 'down') => void;
  onClearAll: () => void;
  onFillPageWithFirst: () => void;
}

export const LabelQueue: React.FC<LabelQueueProps> = ({
  labels,
  selectedPreset,
  onDeleteLabel,
  onDuplicateLabel,
  onMoveLabel,
  onClearAll,
  onFillPageWithFirst,
}) => {
  if (labels.length === 0) {
    return (
      <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-center">
        <p className="text-xs text-slate-500 font-medium">Belum ada resi yang dimuat</p>
        <p className="text-[11px] text-slate-400 mt-0.5">
          Upload file PDF resi atau klik tombol "Muat Contoh Resi" di atas.
        </p>
      </div>
    );
  }

  const remainder = labels.length % selectedPreset;
  const emptySlotsInLastPage = remainder === 0 ? 0 : selectedPreset - remainder;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-semibold text-slate-800">
            Daftar Resi Terunggah
          </span>
          <span className="text-xs font-mono font-bold px-1.5 py-0.5 bg-slate-200 text-slate-700 rounded-md">
            {labels.length}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {labels.length === 1 && (
            <button
              type="button"
              onClick={onFillPageWithFirst}
              className="text-[11px] font-medium text-orange-600 hover:text-orange-700 underline cursor-pointer"
              title={`Duplikasi resi ini menjadi ${selectedPreset} agar mengisi 1 lembar A4 penuh`}
            >
              Isi 1 Halaman ({selectedPreset}x)
            </button>
          )}
          <button
            type="button"
            onClick={onClearAll}
            className="text-[11px] font-medium text-red-600 hover:text-red-700 cursor-pointer"
          >
            Hapus Semua
          </button>
        </div>
      </div>

      {emptySlotsInLastPage > 0 && (
        <div className="p-2 bg-amber-50 border border-amber-200 rounded-lg text-[11px] text-amber-800 flex items-center gap-1.5">
          <AlertCircle className="w-3.5 h-3.5 shrink-0 text-amber-600" />
          <span>
            Halaman terakhir berisi {remainder} resi ({emptySlotsInLastPage} slot kosong). Anda dapat menambahkan {emptySlotsInLastPage} resi lagi atau menduplikasikannya.
          </span>
        </div>
      )}

      {/* Scrollable list */}
      <div className="max-h-[300px] overflow-y-auto space-y-1.5 pr-1 divide-y divide-slate-100">
        {labels.map((item, index) => {
          const pageNumber = Math.floor(index / selectedPreset) + 1;
          const slotNumber = (index % selectedPreset) + 1;

          return (
            <div
              key={item.id}
              className="flex items-center gap-2.5 p-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg text-xs transition-colors group"
            >
              {/* Index & Page label */}
              <div className="shrink-0 text-center w-6 font-mono text-[11px] text-slate-400">
                #{index + 1}
              </div>

              {/* Thumbnail */}
              <div className="w-10 h-14 shrink-0 bg-slate-100 rounded border border-slate-200 overflow-hidden flex items-center justify-center">
                {item.thumbnailUrl ? (
                  <img
                    src={item.thumbnailUrl}
                    alt={item.resiNo || 'Resi'}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Layers className="w-4 h-4 text-slate-400" />
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-slate-800 font-mono text-[11px] truncate">
                    {item.resiNo || 'Resi Pengiriman'}
                  </span>
                  {item.courier && (
                    <span className="text-[10px] px-1 py-0.2 bg-slate-100 text-slate-600 rounded">
                      {item.courier}
                    </span>
                  )}
                </div>

                <div className="text-[11px] text-slate-500 truncate">
                  {item.recipientName ? `Penerima: ${item.recipientName}` : item.sourceFileName}
                </div>

                <div className="text-[10px] text-slate-400 font-mono">
                  Hal. {pageNumber} · Slot #{slotNumber}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-0.5 shrink-0 opacity-80 group-hover:opacity-100">
                <button
                  type="button"
                  disabled={index === 0}
                  onClick={() => onMoveLabel(index, 'up')}
                  className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-20 cursor-pointer"
                  title="Pindah ke atas"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  disabled={index === labels.length - 1}
                  onClick={() => onMoveLabel(index, 'down')}
                  className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-20 cursor-pointer"
                  title="Pindah ke bawah"
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => onDuplicateLabel(item.id)}
                  className="p-1 text-slate-400 hover:text-orange-600 cursor-pointer"
                  title="Duplikasi resi ini"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => onDeleteLabel(item.id)}
                  className="p-1 text-slate-400 hover:text-red-600 cursor-pointer"
                  title="Hapus resi"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
