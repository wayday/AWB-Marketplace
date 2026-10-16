import React, { useRef, useState } from 'react';
import { UploadCloud, FileUp, Sparkles, AlertCircle, FileCheck } from 'lucide-react';

interface UploadZoneProps {
  onFilesSelected: (files: File[]) => void;
  onLoadSample: () => void;
  isProcessing: boolean;
  totalLabels: number;
}

export const UploadZone: React.FC<UploadZoneProps> = ({
  onFilesSelected,
  onLoadSample,
  isProcessing,
  totalLabels,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const filesArray = Array.from(e.dataTransfer.files).filter(
        (f) => f.type === 'application/pdf' || f.type.startsWith('image/') || f.name.endsWith('.pdf')
      );
      if (filesArray.length > 0) {
        onFilesSelected(filesArray);
      }
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFilesSelected(Array.from(e.target.files));
      // reset so the same file can be re-selected if deleted
      e.target.value = '';
    }
  };

  return (
    <div className="space-y-2">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all ${
          isDragOver
            ? 'border-orange-500 bg-orange-50/70 scale-[0.99]'
            : 'border-slate-300 hover:border-orange-400 bg-slate-50/50 hover:bg-orange-50/30'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,application/pdf,image/png,image/jpeg"
          multiple
          onChange={handleFileInputChange}
          className="hidden"
        />

        <div className="flex flex-col items-center justify-center gap-2">
          <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center">
            {isProcessing ? (
              <div className="w-5 h-5 border-2 border-orange-600 border-t-transparent rounded-full animate-spin" />
            ) : totalLabels > 0 ? (
              <FileCheck className="w-5 h-5 text-emerald-600" />
            ) : (
              <UploadCloud className="w-5 h-5" />
            )}
          </div>

          <div>
            <p className="text-xs font-semibold text-slate-800">
              {isProcessing
                ? 'Membaca dan memproses halaman resi...'
                : 'Tarik & Letakkan file PDF Resi di sini'}
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              atau <span className="text-orange-600 font-medium underline">Pilih File dari Komputer</span> (Bisa banyak file / 1 file PDF banyak halaman)
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-1.5 text-[10px] text-slate-400 mt-1">
            <span>Shopee</span>
            <span>·</span>
            <span>Tokopedia</span>
            <span>·</span>
            <span>TikTok Shop</span>
            <span>·</span>
            <span>Lazada</span>
            <span>·</span>
            <span>Anteraja / SPX / J&T</span>
          </div>
        </div>
      </div>

      {/* Quick Sample Button */}
      <div className="flex items-center justify-between gap-2 px-1">
        <button
          type="button"
          onClick={onLoadSample}
          disabled={isProcessing}
          className="flex-1 inline-flex items-center justify-center gap-1.5 py-1.5 px-2.5 text-xs font-medium text-orange-700 bg-orange-50 hover:bg-orange-100 rounded-lg border border-orange-200 transition-colors cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-orange-500" />
          <span>Muat Contoh Resi (Resi 10152026)</span>
        </button>

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isProcessing}
          className="inline-flex items-center gap-1 py-1.5 px-2.5 text-xs font-medium text-slate-600 bg-white hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors cursor-pointer shrink-0"
        >
          <FileUp className="w-3.5 h-3.5" />
          <span>+ Tambah PDF</span>
        </button>
      </div>
    </div>
  );
};
