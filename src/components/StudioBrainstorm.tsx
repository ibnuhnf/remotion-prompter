import React, { useState } from 'react';
import { 
  CATEGORIES, 
  CAMERA_MOVEMENTS, 
  LIGHTING_MOODS, 
  DURATIONS, 
  ASPECT_RATIOS, 
  AI_GENERATORS, 
  BUYER_NICHES, 
  RANDOM_INSPIRATIONS 
} from '../data/mockData';
import { PromptConcept, GeneratorOptions } from '../types';
import { PromptCard } from './PromptCard';
import { CsvExportModal } from './CsvExportModal';
import { 
  Sparkles, 
  Dices, 
  SlidersHorizontal, 
  Film, 
  Camera, 
  Sun, 
  Clock, 
  Tv, 
  Cpu, 
  Target, 
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet
} from 'lucide-react';

interface StudioBrainstormProps {
  onSavePrompt: (prompt: PromptConcept) => void;
  savedPrompts: PromptConcept[];
  onGenerateSeries: (prompt: PromptConcept) => void;
  initialCategory?: string;
  initialIdea?: string;
}

export const StudioBrainstorm: React.FC<StudioBrainstormProps> = ({
  onSavePrompt,
  savedPrompts,
  onGenerateSeries,
  initialCategory,
  initialIdea
}) => {
  const [options, setOptions] = useState<GeneratorOptions>({
    theme: initialCategory || 'tech_ai',
    customIdea: initialIdea || '',
    cameraMovement: 'drone_aerial_forward',
    lightingMood: 'golden_hour',
    duration: '8s',
    aspectRatio: '16:9',
    generatorTarget: 'runway_gen3',
    buyerNiche: 'commercial_ad',
    count: 3
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [infoNotice, setInfoNotice] = useState<string | null>(null);
  const [generatedPrompts, setGeneratedPrompts] = useState<PromptConcept[]>([]);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Quick Random Inspiration
  const handleRandomize = () => {
    const randomItem = RANDOM_INSPIRATIONS[Math.floor(Math.random() * RANDOM_INSPIRATIONS.length)];
    setOptions(prev => ({ ...prev, customIdea: randomItem }));
  };

  // Generate Prompts
  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    setInfoNotice(null);

    try {
      const response = await fetch('/api/generate-prompts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(options)
      });

      const data = await response.json();

      if (data.success && Array.isArray(data.data)) {
        setGeneratedPrompts(data.data);
        if (data.notice) {
          setInfoNotice(data.notice);
        }
      } else {
        throw new Error(data.error || 'Gagal menghasilkan prompt video');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Terjadi gangguan jaringan saat memproses prompt. Silakan klik coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  // Check if saved
  const isPromptSaved = (id: string) => {
    return savedPrompts.some(p => p.id === id);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Studio Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/40 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Generator Video 4K HD Terverifikasi Pasar</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-2">
            Brainstorming Ide Video 4K & Generator Prompt Siap Jual
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            Pilih tema, sudut kamera, pencahayaan, dan durasi (5 - 15 detik). AI akan merumuskan prompt video komersial dalam bahasa Inggris lengkap dengan negative prompt, judul SEO Shutterstock, serta 40+ tag kata kunci.
          </p>
        </div>
      </div>

      {/* Control Panel: Buttons & Selectors */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-7">
        {/* Section 1: Tema & Kategori Video */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-bold text-white flex items-center gap-2">
              <Film className="w-4 h-4 text-emerald-400" />
              <span>1. Pilih Tema / Kategori Video (Berdasarkan Kebutuhan Pasar)</span>
            </label>
            <span className="text-xs text-slate-400">
              Terpilih: <strong className="text-emerald-400">{CATEGORIES.find(c => c.id === options.theme)?.name}</strong>
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
            {CATEGORIES.map(category => {
              const isSelected = options.theme === category.id;
              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => setOptions({ ...options, theme: category.id })}
                  className={`p-3 rounded-xl border text-left transition-all relative flex flex-col justify-between ${
                    isSelected
                      ? 'bg-emerald-500/15 border-emerald-500 text-white shadow-md shadow-emerald-500/10 ring-1 ring-emerald-500'
                      : 'bg-slate-950/50 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900'
                  }`}
                >
                  <div>
                    <span className="text-xs font-bold block mb-1">{category.name}</span>
                    <span className="text-[10px] text-slate-400 block line-clamp-1">{category.popularFor}</span>
                  </div>
                  {isSelected && (
                    <span className="w-2 h-2 rounded-full bg-emerald-400 mt-2 self-end"></span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 2: Gerakan Kamera & Pencahayaan */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 border-t border-slate-800">
          {/* Camera Motion */}
          <div>
            <label className="text-sm font-bold text-white flex items-center gap-2 mb-2.5">
              <Camera className="w-4 h-4 text-cyan-400" />
              <span>2. Gerakan Kamera (Camera Motion)</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {CAMERA_MOVEMENTS.map(cam => {
                const isSelected = options.cameraMovement === cam.id;
                return (
                  <button
                    key={cam.id}
                    type="button"
                    onClick={() => setOptions({ ...options, cameraMovement: cam.id })}
                    className={`p-2.5 rounded-lg border text-left transition-all ${
                      isSelected
                        ? 'bg-cyan-950/70 border-cyan-500 text-white ring-1 ring-cyan-500'
                        : 'bg-slate-950/40 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <span className="text-xs font-semibold block">{cam.name}</span>
                    <span className="text-[10px] text-slate-400 block line-clamp-1">{cam.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Lighting & Mood */}
          <div>
            <label className="text-sm font-bold text-white flex items-center gap-2 mb-2.5">
              <Sun className="w-4 h-4 text-amber-400" />
              <span>3. Pencahayaan & Suasana (Lighting & Mood)</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {LIGHTING_MOODS.map(light => {
                const isSelected = options.lightingMood === light.id;
                return (
                  <button
                    key={light.id}
                    type="button"
                    onClick={() => setOptions({ ...options, lightingMood: light.id })}
                    className={`p-2.5 rounded-lg border text-left transition-all ${
                      isSelected
                        ? 'bg-amber-950/60 border-amber-500 text-white ring-1 ring-amber-500'
                        : 'bg-slate-950/40 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <span className="text-xs font-semibold block">{light.name}</span>
                    <span className="text-[10px] text-slate-400 block line-clamp-1">{light.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Section 3: Durasi & Aspek Rasio (5-15 Detik) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 border-t border-slate-800">
          {/* Duration (5s, 8s, 10s, 15s) */}
          <div>
            <label className="text-sm font-bold text-white flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-emerald-400" />
              <span>4. Durasi Video Singkat (5 - 15 Detik)</span>
            </label>
            <p className="text-xs text-slate-400 mb-2">
              Durasi pendek adalah standar microstock yang paling dicari pembeli untuk looping iklan.
            </p>
            <div className="grid grid-cols-4 gap-2">
              {DURATIONS.map(dur => {
                const isSelected = options.duration === dur.id;
                return (
                  <button
                    key={dur.id}
                    type="button"
                    onClick={() => setOptions({ ...options, duration: dur.id })}
                    className={`py-2 px-3 rounded-lg border text-center font-bold text-xs transition-all ${
                      isSelected
                        ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md'
                        : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div>{dur.name}</div>
                    <div className="text-[9px] font-normal opacity-80 mt-0.5">
                      {dur.id === '8s' ? 'Terlaris' : dur.id === '10s' ? 'Komersial' : dur.id === '5s' ? 'B-Roll' : 'Cerita'}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Aspect Ratio */}
          <div>
            <label className="text-sm font-bold text-white flex items-center gap-2 mb-2">
              <Tv className="w-4 h-4 text-indigo-400" />
              <span>5. Rasio Aspek Video</span>
            </label>
            <p className="text-xs text-slate-400 mb-2">
              16:9 untuk TV/Billboard/Web, atau 9:16 untuk stok vertikal iklan TikTok & Reels.
            </p>
            <div className="grid grid-cols-3 gap-2">
              {ASPECT_RATIOS.map(ratio => {
                const isSelected = options.aspectRatio === ratio.id;
                return (
                  <button
                    key={ratio.id}
                    type="button"
                    onClick={() => setOptions({ ...options, aspectRatio: ratio.id })}
                    className={`py-2.5 px-3 rounded-lg border text-center transition-all ${
                      isSelected
                        ? 'bg-indigo-950/80 border-indigo-500 text-white ring-1 ring-indigo-500'
                        : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <span className="font-bold text-xs block">{ratio.name}</span>
                    <span className="text-[9px] text-slate-400 block mt-0.5">{ratio.id === '16:9' ? 'Utama Shutterstock' : ratio.id === '9:16' ? 'Vertical Reels' : 'Square Feed'}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Section 4: Target Generator AI & Target Pembeli */}
        <div className="pt-2 border-t border-slate-800">
          <div className="flex items-center justify-between mb-2.5">
            <label className="text-sm font-bold text-white flex items-center gap-2">
              <Cpu className="w-4 h-4 text-purple-400" />
              <span>6. Target Generator AI (Sintaks Prompt Dioptimasi Khusus)</span>
            </label>
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
            >
              <SlidersHorizontal className="w-3 h-3" />
              <span>{showAdvanced ? 'Sembunyikan Pembeli' : 'Filter Pembeli Niche'}</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
            {AI_GENERATORS.map(gen => {
              const isSelected = options.generatorTarget === gen.id;
              return (
                <button
                  key={gen.id}
                  type="button"
                  onClick={() => setOptions({ ...options, generatorTarget: gen.id })}
                  className={`p-2.5 rounded-lg border text-left transition-all ${
                    isSelected
                      ? 'bg-purple-950/70 border-purple-500 text-white ring-1 ring-purple-500'
                      : 'bg-slate-950/40 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-purple-900/60 text-purple-300 inline-block mb-1">
                    {gen.badge}
                  </span>
                  <span className="text-xs font-bold block text-slate-200">{gen.name}</span>
                </button>
              );
            })}
          </div>

          {/* Advanced Buyer Persona Filter */}
          {showAdvanced && (
            <div className="mt-4 p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
                <Target className="w-3.5 h-3.5 text-emerald-400" />
                <span>Target Niche Pembeli Microstock:</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                {BUYER_NICHES.map(niche => {
                  const isSelected = options.buyerNiche === niche.id;
                  return (
                    <button
                      key={niche.id}
                      type="button"
                      onClick={() => setOptions({ ...options, buyerNiche: niche.id })}
                      className={`p-2 rounded-lg border text-left text-xs transition-all ${
                        isSelected
                          ? 'bg-emerald-950/70 border-emerald-500 text-white'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-300'
                      }`}
                    >
                      <span className="font-semibold block">{niche.name}</span>
                      <span className="text-[10px] opacity-70 block">{niche.desc}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Section 5: Custom Idea or Keywords (Optional) */}
        <div className="pt-2 border-t border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>7. Ide Tambahan / Objek Spesifik (Opsional)</span>
            </label>
            <button
              type="button"
              onClick={handleRandomize}
              className="text-xs font-medium text-emerald-400 hover:text-emerald-300 flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-950/50 border border-emerald-800/40 hover:bg-emerald-900/50 transition-colors"
            >
              <Dices className="w-3.5 h-3.5" />
              <span>Kocok Ide Acak (Surprise Me)</span>
            </button>
          </div>
          <div className="relative">
            <input
              type="text"
              value={options.customIdea}
              onChange={e => setOptions({ ...options, customIdea: e.target.value })}
              placeholder="Contoh: Barista tuang kopi latte art dengan cangkir keramik, atau robot AI periksa tanaman di green house..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            />
            {options.customIdea && (
              <button
                type="button"
                onClick={() => setOptions({ ...options, customIdea: '' })}
                className="absolute right-3 top-3 text-xs text-slate-500 hover:text-slate-300"
              >
                Hapus
              </button>
            )}
          </div>
        </div>

        {/* Action Button: Generate */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-xs text-slate-400">
            <span>Jumlah Hasil:</span>
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
              {[1, 2, 3].map(cnt => (
                <button
                  key={cnt}
                  type="button"
                  onClick={() => setOptions({ ...options, count: cnt })}
                  className={`px-3 py-1 rounded text-xs font-bold transition-all ${
                    options.count === cnt
                      ? 'bg-emerald-500 text-slate-950'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {cnt} Konsep
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={handleGenerate}
            disabled={loading}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-extrabold text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-lg shadow-emerald-500/25 disabled:opacity-50 transition-all cursor-pointer"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
                <span>Merumuskan Prompt 4K Microstock...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>Generate Ide Video 4K Siap Jual</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Error Notice */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-800 text-rose-300 text-sm flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
          <button
            onClick={handleGenerate}
            className="px-3 py-1 bg-rose-900/60 hover:bg-rose-800 text-white rounded text-xs font-bold shrink-0 transition-colors"
          >
            Coba Lagi
          </button>
        </div>
      )}

      {/* Info / Traffic Spike Notice */}
      {infoNotice && (
        <div className="p-3.5 rounded-xl bg-amber-950/40 border border-amber-800/60 text-amber-200 text-xs flex items-center gap-2.5">
          <Sparkles className="w-4 h-4 shrink-0 text-amber-400" />
          <span>{infoNotice}</span>
        </div>
      )}

      {/* Generated Results Area */}
      {generatedPrompts.length > 0 && (
        <div className="space-y-6 pt-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span>Hasil Prompt 4K Terverifikasi ({generatedPrompts.length} Konsep)</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Salin prompt langsung ke generator AI video favoritmu, atau ekspor metadata CSV untuk Shutterstock/Adobe Stock.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsExportModalOpen(true)}
                className="text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors shadow-sm"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>Ekspor ke CSV</span>
              </button>

              <button
                onClick={handleGenerate}
                disabled={loading}
                className="text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors"
              >
                <RotateCcw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                <span>Regenerate</span>
              </button>
            </div>
          </div>

          <div className="space-y-6">
            {generatedPrompts.map(prompt => (
              <PromptCard
                key={prompt.id}
                prompt={prompt}
                onSave={onSavePrompt}
                isSaved={isPromptSaved(prompt.id)}
                onGenerateSeries={onGenerateSeries}
              />
            ))}
          </div>
        </div>
      )}

      {/* Empty State / Initial Encouragement */}
      {generatedPrompts.length === 0 && !loading && (
        <div className="rounded-2xl border border-dashed border-slate-800 p-12 text-center bg-slate-950/30">
          <div className="w-12 h-12 rounded-2xl bg-emerald-950/60 border border-emerald-800/40 flex items-center justify-center mx-auto mb-4 text-emerald-400">
            <Film className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white mb-1">Siap untuk Mulai Brainstorming?</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto mb-5 leading-relaxed">
            Tekan tombol <strong>"Generate Ide Video 4K Siap Jual"</strong> di atas. AI akan menghasilkan prompt teknis dalam Bahasa Inggris yang dioptimasi untuk rasio penerimaan tinggi di Shutterstock.
          </p>
          <button
            type="button"
            onClick={handleGenerate}
            className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-colors"
          >
            Generate Konsep Pertama Sekarang
          </button>
        </div>
      )}
      {/* CSV Export Modal */}
      <CsvExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        prompts={generatedPrompts}
      />
    </div>
  );
};
