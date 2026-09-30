import React, { useState } from 'react';
import { safeFetchJson, formatErrorMessage } from '../utils/api';
import { 
  Wand2, 
  Sparkles, 
  Copy, 
  Check, 
  ArrowRight, 
  Lightbulb, 
  Tv, 
  Tag, 
  ShieldAlert, 
  CheckCircle2, 
  Aperture 
} from 'lucide-react';

export const PromptDoctor: React.FC = () => {
  const [rawInput, setRawInput] = useState('');
  const [targetGenerator, setTargetGenerator] = useState('runway_gen3');
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [copiedType, setCopiedType] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleUpscale = async () => {
    if (!rawInput.trim()) return;
    setLoading(true);
    setError(null);

    try {
      const data = await safeFetchJson('/api/upscale-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rawPrompt: rawInput,
          targetGenerator,
          aspectRatio
        })
      });

      if (data.success && data.data) {
        setResult(data.data);
      } else {
        setError(formatErrorMessage(data.error || 'Gagal merombak prompt. Silakan klik tombol Coba Lagi.'));
      }
    } catch (err: any) {
      console.error(err);
      setError(formatErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-teal-950/40 to-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-semibold mb-3">
            <Wand2 className="w-3.5 h-3.5 text-teal-400" />
            <span>Prompt Upscaler &amp; Optimizer</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-2">
            Prompt Doctor: Ubah Ide Kasar Jadi 4K Stock Footage
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            Punya ide sederhana dalam Bahasa Indonesia atau Inggris? Ketik di bawah (misal: <em>"orang meeting kerja santai bawa laptop"</em>), dan biarkan AI menyempurnakannya menjadi prompt video komersial 4K berstandar tinggi dengan framing copy space, lighting sinematik, dan kata kunci Shutterstock.
          </p>
        </div>
      </div>

      {/* Input Box */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
        <div>
          <label className="block text-sm font-bold text-white mb-2">
            Ketik Ide Kasar / Konsepmu (Bisa Bahasa Indonesia):
          </label>
          <textarea
            rows={3}
            value={rawInput}
            onChange={e => setRawInput(e.target.value)}
            placeholder="Contoh: Orang minum kopi santai di balkon apartemen saat sunrise, ada pemandangan kota di belakang..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
          ></textarea>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">
              Generator Target:
            </label>
            <select
              value={targetGenerator}
              onChange={e => setTargetGenerator(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-teal-500"
            >
              <option value="runway_gen3">Runway Gen-3 Alpha</option>
              <option value="kling_ai">Kling AI 1.5</option>
              <option value="luma_dream">Luma Dream Machine</option>
              <option value="sora">OpenAI Sora</option>
              <option value="hailuo_minimax">Hailuo / Minimax</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">
              Rasio Aspek:
            </label>
            <select
              value={aspectRatio}
              onChange={e => setAspectRatio(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-teal-500"
            >
              <option value="16:9">16:9 Landscape (Microstock Standard)</option>
              <option value="9:16">9:16 Vertical (Reels / TikTok Stock)</option>
              <option value="1:1">1:1 Square</option>
            </select>
          </div>
        </div>

        {/* Quick Suggestion Pills */}
        <div className="flex items-center gap-2 overflow-x-auto text-xs text-slate-400 pt-1">
          <span className="shrink-0 text-slate-500">Coba contoh:</span>
          {[
            'Barista latte art slow motion 120fps',
            'Drone terbang melewati perkebunan teh berkabut',
            'Dokter muda tersenyum di lab penelitian modern',
            'Tangan mengetik keyboard mekanik dengan pencahayaan neon'
          ].map((sample, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setRawInput(sample)}
              className="px-2.5 py-1 rounded-full bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 shrink-0 text-[11px] transition-colors"
            >
              {sample}
            </button>
          ))}
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={handleUpscale}
            disabled={loading || !rawInput.trim()}
            className="w-full sm:w-auto px-7 py-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-teal-500/20 disabled:opacity-50 transition-all cursor-pointer"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
                <span>Menyempurnakan ke Format 4K...</span>
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4" />
                <span>Sempurnakan Prompt Jadi 4K Stock</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Upgraded Output */}
      {result && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="flex items-center gap-2 text-teal-400">
            <CheckCircle2 className="w-5 h-5" />
            <h3 className="font-bold text-white text-base">Hasil Optimasi 4K Stock Video</h3>
          </div>

          {/* Enhanced Prompt */}
          <div className="rounded-xl border border-teal-500/40 bg-slate-950 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-teal-300 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                Prompt Video 4K (Bahasa Inggris Teknis):
              </span>
              <button
                onClick={() => handleCopy(result.enhancedPrompt, 'enhanced')}
                className="px-3 py-1 rounded bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors"
              >
                {copiedType === 'enhanced' ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Tersalin!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Salin Prompt AI</span>
                  </>
                )}
              </button>
            </div>
            <p className="font-mono text-xs sm:text-sm text-teal-100 bg-slate-900/90 p-3.5 rounded-lg border border-slate-800 leading-relaxed select-all">
              {result.enhancedPrompt}
            </p>
          </div>

          {/* Negative Prompt & Title */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-semibold text-rose-300 flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                  Negative Prompt:
                </span>
                <button
                  onClick={() => handleCopy(result.negativePrompt, 'neg')}
                  className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
                >
                  {copiedType === 'neg' ? <span className="text-emerald-400">Tersalin!</span> : <Copy className="w-3 h-3" />}
                </button>
              </div>
              <p className="text-xs font-mono text-slate-400 bg-slate-900/70 p-2.5 rounded border border-slate-800">
                {result.negativePrompt}
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-semibold text-cyan-300 flex items-center gap-1.5">
                  <Tv className="w-3.5 h-3.5 text-cyan-400" />
                  Judul Stok SEO (Shutterstock):
                </span>
                <button
                  onClick={() => handleCopy(result.stockTitle, 'stitle')}
                  className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
                >
                  {copiedType === 'stitle' ? <span className="text-emerald-400">Tersalin!</span> : <Copy className="w-3 h-3" />}
                </button>
              </div>
              <p className="text-xs font-medium text-slate-200 bg-slate-900/70 p-2.5 rounded border border-slate-800">
                {result.stockTitle}
              </p>
            </div>
          </div>

          {/* Why It Sells */}
          <div className="rounded-xl border border-amber-500/20 bg-amber-950/15 p-4">
            <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5 mb-1">
              <Lightbulb className="w-4 h-4 text-amber-400" />
              Alasan Komersial &amp; Tips Penjualan:
            </span>
            <p className="text-xs text-amber-200/90 leading-relaxed">
              {result.whyItSells}
            </p>
          </div>

          {/* Keywords */}
          {result.keywords && (
            <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-teal-400" />
                  Kata Kunci Stok ({result.keywords.length} Tags):
                </span>
                <button
                  onClick={() => handleCopy(result.keywords.join(', '), 'kw')}
                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1 transition-colors border border-slate-700"
                >
                  {copiedType === 'kw' ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-400">Tersalin!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Salin Semua (Pisah Koma)</span>
                    </>
                  )}
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto pr-1">
                {result.keywords.map((tag: string, i: number) => (
                  <span key={i} className="text-[11px] px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
