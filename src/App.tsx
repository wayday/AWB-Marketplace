/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import confetti from 'canvas-confetti';
import { Header } from './components/Header';
import { GridSelector } from './components/GridSelector';
import { UploadZone } from './components/UploadZone';
import { SettingsPanel } from './components/SettingsPanel';
import { LabelQueue } from './components/LabelQueue';
import { A4PaperPreview } from './components/A4PaperPreview';
import { GuideModal } from './components/GuideModal';
import { GridPreset, GeneratorSettings, LabelItem, GRID_CONFIGS } from './types';
import { createSampleLabelItems } from './utils/sampleData';
import { parsePdfFile, parseImageFile } from './utils/pdfParser';
import { generateMultiUpPdf, GeneratedPdfResult } from './utils/pdfGenerator';
import { CheckCircle2, AlertTriangle, FileDown, Sparkles } from 'lucide-react';

const DEFAULT_SETTINGS: GeneratorSettings = {
  gridPreset: 6, // Default to 6 resi as in the user's screenshot!
  cutLineStyle: 'dashed',
  cutLineColor: '#cbd5e1',
  marginPreset: 'normal',
  gapPreset: 'medium',
  autoTrimWhiteMargins: true,
  trimMarginAmount: 4,
  showCutGuides: true,
  showPageNumbers: true,
  scaleMode: 'fit',
};

export default function App() {
  const [labels, setLabels] = useState<LabelItem[]>([]);
  const [settings, setSettings] = useState<GeneratorSettings>(DEFAULT_SETTINGS);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isProcessingUpload, setIsProcessingUpload] = useState<boolean>(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState<boolean>(false);
  const [generatedPdfResult, setGeneratedPdfResult] = useState<GeneratedPdfResult | null>(null);
  const [isGuideOpen, setIsGuideOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage((prev) => (prev === message ? null : prev));
    }, 4000);
  };

  // Re-generate the multi-up PDF whenever labels or settings change
  const triggerPdfGeneration = useCallback(
    async (currentLabels: LabelItem[], currentSettings: GeneratorSettings) => {
      if (currentLabels.length === 0) {
        setGeneratedPdfResult(null);
        return;
      }

      setIsGeneratingPdf(true);
      try {
        const result = await generateMultiUpPdf(currentLabels, currentSettings);
        setGeneratedPdfResult(result);
      } catch (err) {
        console.error('Error generating multi-up PDF:', err);
        showToast('Gagal memproses template PDF. Silakan coba kembali.');
      } finally {
        setIsGeneratingPdf(false);
      }
    },
    []
  );

  // Debounced trigger for PDF generation
  useEffect(() => {
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);

    debounceTimerRef.current = setTimeout(() => {
      triggerPdfGeneration(labels, settings);
    }, 250);

    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, [labels, settings, triggerPdfGeneration]);

  // Adjust current page if labels count shrinks
  useEffect(() => {
    const config = GRID_CONFIGS[settings.gridPreset];
    const maxPages = Math.max(1, Math.ceil(labels.length / (config.cols * config.rows)));
    if (currentPage > maxPages) {
      setCurrentPage(maxPages);
    }
  }, [labels.length, settings.gridPreset, currentPage]);

  // Auto-load the 6 sample labels on initial mount so the user immediately sees the working template
  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const sampleItems = await createSampleLabelItems(6);
        if (isMounted) {
          setLabels(sampleItems);
          showToast('6 Resi contoh berhasil dimuat (sesuai template Anda)');
        }
      } catch (err) {
        console.warn('Initial sample load error:', err);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  // Handle uploading files (PDFs or images)
  const handleFilesSelected = async (files: File[]) => {
    setIsProcessingUpload(true);
    const newItems: LabelItem[] = [];

    try {
      for (const file of files) {
        if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
          const parsed = await parsePdfFile(file, settings.autoTrimWhiteMargins);
          newItems.push(...parsed);
        } else if (file.type.startsWith('image/')) {
          const parsed = await parseImageFile(file, settings.autoTrimWhiteMargins);
          newItems.push(parsed);
        }
      }

      if (newItems.length > 0) {
        setLabels((prev) => [...prev, ...newItems]);
        showToast(`Berhasil menambahkan ${newItems.length} resi baru!`);
      } else {
        showToast('Tidak ada file resi yang didukung.');
      }
    } catch (err) {
      console.error('Error parsing files:', err);
      showToast('Gagal memproses file PDF. Pastikan file tidak rusak.');
    } finally {
      setIsProcessingUpload(false);
    }
  };

  // Load sample resi matching the user's prompt (Resi 10152026)
  const handleLoadSample = async () => {
    setIsProcessingUpload(true);
    try {
      const sampleItems = await createSampleLabelItems(6);
      setLabels(sampleItems);
      setSettings((prev) => ({ ...prev, gridPreset: 6 }));
      setCurrentPage(1);
      showToast('6 Contoh Resi (Resi 10152026) dimuat ke template 6 per A4!');
    } catch (err) {
      console.error('Failed to load sample:', err);
      showToast('Gagal memuat contoh resi.');
    } finally {
      setIsProcessingUpload(false);
    }
  };

  // Duplicate a label
  const handleDuplicateLabel = (id: string) => {
    const item = labels.find((l) => l.id === id);
    if (!item) return;
    const duplicated: LabelItem = {
      ...item,
      id: `copy-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    };
    setLabels((prev) => [...prev, duplicated]);
    showToast(`Resi ${item.resiNo || ''} berhasil diduplikasi.`);
  };

  // Delete a label
  const handleDeleteLabel = (id: string) => {
    setLabels((prev) => prev.filter((l) => l.id !== id));
  };

  // Reorder labels
  const handleMoveLabel = (index: number, direction: 'up' | 'down') => {
    setLabels((prev) => {
      const copy = [...prev];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= copy.length) return prev;
      const temp = copy[index];
      copy[index] = copy[targetIndex];
      copy[targetIndex] = temp;
      return copy;
    });
  };

  // Clear all
  const handleClearAll = () => {
    setLabels([]);
    setGeneratedPdfResult(null);
    showToast('Semua resi telah dihapus.');
  };

  // Duplicate first label to fill 1 full A4 page
  const handleFillPageWithFirst = () => {
    if (labels.length === 0) return;
    const first = labels[0];
    const targetCount = settings.gridPreset;
    const itemsToCreate = targetCount - labels.length;
    if (itemsToCreate <= 0) return;

    const duplicates: LabelItem[] = Array.from({ length: itemsToCreate }).map((_, i) => ({
      ...first,
      id: `fill-${Date.now()}-${i}`,
    }));

    setLabels((prev) => [...prev, ...duplicates]);
    showToast(`Berhasil menduplikasi menjadi 1 lembar A4 penuh (${targetCount} resi).`);
  };

  // Download PDF
  const handleDownload = () => {
    if (!generatedPdfResult) return;

    try {
      const link = document.createElement('a');
      link.href = generatedPdfResult.blobUrl;
      link.download = generatedPdfResult.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Trigger celebratory confetti
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
      });

      showToast(`File ${generatedPdfResult.filename} berhasil diunduh!`);
    } catch (err) {
      console.error('Download error:', err);
      showToast('Gagal mengunduh file.');
    }
  };

  // Print directly
  const handlePrint = () => {
    if (generatedPdfResult?.blobUrl) {
      const printWindow = window.open(generatedPdfResult.blobUrl, '_blank');
      if (printWindow) {
        printWindow.focus();
        setTimeout(() => {
          printWindow.print();
        }, 800);
      } else {
        window.print();
      }
    } else {
      window.print();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900">
      {/* Top Bar Contract compliant Header */}
      <Header
        onDownload={handleDownload}
        onPrint={handlePrint}
        onOpenGuide={() => setIsGuideOpen(true)}
        onLoadSample={handleLoadSample}
        isGenerating={isGeneratingPdf}
        hasLabels={labels.length > 0}
        totalLabels={labels.length}
      />

      {/* Main Workspace */}
      <main className="flex-1 max-w-[1720px] w-full mx-auto px-4 sm:px-6 py-5 flex flex-col lg:flex-row gap-6">
        {/* Left Column / Control Sidebar (380px) */}
        <section className="w-full lg:w-[420px] shrink-0 space-y-4">
          {/* Preset Selector: 2, 4, 6, 8, 10 Resi */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
            <GridSelector
              selectedPreset={settings.gridPreset}
              onSelectPreset={(preset) => {
                setSettings((prev) => ({ ...prev, gridPreset: preset }));
                setCurrentPage(1);
              }}
              totalLabels={labels.length}
            />
          </div>

          {/* Upload Dropzone */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-slate-800">
                Upload File Resi PDF
              </label>
              <span className="text-[11px] text-slate-500">
                Multi-halaman didukung
              </span>
            </div>

            <UploadZone
              onFilesSelected={handleFilesSelected}
              onLoadSample={handleLoadSample}
              isProcessing={isProcessingUpload}
              totalLabels={labels.length}
            />
          </div>

          {/* Print & Layout Settings */}
          <SettingsPanel
            settings={settings}
            onChangeSettings={setSettings}
          />

          {/* Label Queue / Order List */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
            <LabelQueue
              labels={labels}
              selectedPreset={settings.gridPreset}
              onDeleteLabel={handleDeleteLabel}
              onDuplicateLabel={handleDuplicateLabel}
              onMoveLabel={handleMoveLabel}
              onClearAll={handleClearAll}
              onFillPageWithFirst={handleFillPageWithFirst}
            />
          </div>
        </section>

        {/* Right / Center Column: Live A4 Interactive Preview Viewport */}
        <section className="flex-1 min-w-0 flex flex-col">
          <A4PaperPreview
            labels={labels}
            selectedPreset={settings.gridPreset}
            settings={settings}
            pdfBlobUrl={generatedPdfResult?.blobUrl || null}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            onDownload={handleDownload}
            onPrint={handlePrint}
            onLoadSample={handleLoadSample}
          />
        </section>
      </main>

      {/* Guide Modal */}
      <GuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
        onSelectPreset={(preset) => {
          setSettings((prev) => ({ ...prev, gridPreset: preset }));
          setCurrentPage(1);
        }}
        currentPreset={settings.gridPreset}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 px-4 py-2.5 bg-slate-900 text-white text-xs font-medium rounded-xl shadow-xl border border-slate-700 animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
