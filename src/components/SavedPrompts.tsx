import React, { useState } from 'react';
import { PromptConcept } from '../types';
import { PromptCard } from './PromptCard';
import { CsvExportModal } from './CsvExportModal';
import { 
  Bookmark, 
  Trash2, 
  Download, 
  Search, 
  Filter, 
  Film, 
  FileSpreadsheet, 
  CheckCircle2,
  Sparkles
} from 'lucide-react';

interface SavedPromptsProps {
  savedPrompts: PromptConcept[];
  onRemovePrompt: (id: string) => void;
  onClearAll: () => void;
  onGenerateSeries: (prompt: PromptConcept) => void;
}

export const SavedPrompts: React.FC<SavedPromptsProps> = ({
  savedPrompts,
  onRemovePrompt,
  onClearAll,
  onGenerateSeries
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('ALL');
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  const filtered = savedPrompts.filter(item => {
    const matchesSearch = 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.videoPrompt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.keywords?.some(k => k.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = filterCategory === 'ALL' || item.category === filterCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-8 pb-12">
      {/* Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-amber-950/30 to-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-3">
            <Bookmark className="w-3.5 h-3.5" />
            <span>Koleksi Ide Prompt Favorit ({savedPrompts.length})</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-2">
            Perpustakaan Prompt Tersimpan &amp; Ekspor CSV
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            Kelola ide-ide video 4K yang telah Anda bookmark. Anda dapat mengekspor seluruh metadata (Judul, Deskripsi, 40+ Keyword) langsung ke template CSV resmi Shutterstock atau Adobe Stock untuk upload batch tanpa repot mengetik ulang satu per satu.
          </p>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-slate-900 border border-slate-800">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Search */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Cari ide, prompt, atau keyword..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          {savedPrompts.length > 0 && (
            <>
              <button
                onClick={() => setIsExportModalOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 text-xs font-extrabold flex items-center gap-2 transition-all shadow-md shadow-emerald-500/20 cursor-pointer"
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>Ekspor Metadata CSV (Shutterstock / Adobe)</span>
              </button>

              <button
                onClick={onClearAll}
                className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-rose-950/60 hover:text-rose-300 text-slate-400 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-700"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Hapus Semua</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* List */}
      {filtered.length > 0 ? (
        <div className="space-y-6">
          {filtered.map(prompt => (
            <div key={prompt.id} className="relative group">
              <PromptCard
                prompt={prompt}
                onSave={() => onRemovePrompt(prompt.id)}
                isSaved={true}
                onGenerateSeries={onGenerateSeries}
              />
              <button
                onClick={() => onRemovePrompt(prompt.id)}
                className="absolute top-4 right-20 text-xs text-rose-400 hover:text-rose-300 px-2 py-1 rounded bg-rose-950/80 border border-rose-800/60 z-20 flex items-center gap-1"
                title="Hapus dari koleksi"
              >
                <Trash2 className="w-3 h-3" />
                <span>Hapus</span>
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-800 p-12 text-center bg-slate-950/30">
          <Bookmark className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white mb-1">Belum Ada Prompt Tersimpan</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Buka tab <strong>Studio Brainstorming</strong> atau <strong>Radar Tren</strong>, lalu klik tombol "Simpan" pada kartu prompt yang Anda sukai untuk mengumpulkan klip yang mau diekspor ke CSV.
          </p>
        </div>
      )}

      {/* CSV Export Modal */}
      <CsvExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        prompts={savedPrompts}
      />
    </div>
  );
};

