import React, { useState } from 'react';
import { SeriesPack } from '../types';
import { 
  Layers, 
  Sparkles, 
  Copy, 
  Check, 
  Film, 
  Clock, 
  HelpCircle, 
  Download, 
  ArrowRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

interface SeriesPackBuilderProps {
  initialConcept?: string;
}

export const SeriesPackBuilder: React.FC<SeriesPackBuilderProps> = ({ initialConcept }) => {
  const [concept, setConcept] = useState(initialConcept || 'Teknisi AI di Ruang Server Modern Berpendar');
  const [category, setCategory] = useState('tech_ai');
  const [generator, setGenerator] = useState('runway_gen3');
  const [loading, setLoading] = useState(false);
  const [seriesData, setSeriesData] = useState<SeriesPack | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleGenerateSeries = async () => {
    if (!concept.trim()) return;
    setLoading(true);

    try {
      const res = await fetch('/api/generate-series', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          masterConcept: concept,
          category,
          generator
        })
      });

      const data = await res.json();
      if (data.success && data.data) {
        setSeriesData(data.data);
      } else if (data.clips) {
        setSeriesData(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleCopyAllPrompts = () => {
    if (!seriesData) return;
    const text = seriesData.clips.map(c => `[${c.shotType}]\nPrompt: ${c.prompt}\nDurasi: ${c.duration}`).join('\n\n');
    handleCopy(text, 'all-prompts');
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-3">
            <Layers className="w-3.5 h-3.5 text-indigo-400" />
            <span>Strategi Penjualan Bundle Microstock</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-2">
            Paket Seri 5-Shot (Multi-Angle Video Bundle)
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            Trik rahasia kontributor berpenghasilan tinggi: Pembeli stok video (editor iklan/film) jarang membeli hanya 1 klip acak. Mereka mencari <strong>seri klip terkoordinasi</strong> (Wide, Medium, POV, Macro, Hero) dari 1 adegan untuk dipotong menjadi video iklan utuh!
          </p>
        </div>
      </div>

      {/* Control Panel */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
        <div>
          <label className="block text-sm font-bold text-white mb-2">
            Konsep Master Adegan:
          </label>
          <div className="relative">
            <input
              type="text"
              value={concept}
              onChange={e => setConcept(e.target.value)}
              placeholder="Contoh: Barista artisan di kafe minimalis menyeduh kopi manual brew saat matahari terbit..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">
              Kategori Terkait:
            </label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="tech_ai">Teknologi &amp; AI</option>
              <option value="corporate">Bisnis &amp; Korporat</option>
              <option value="food_slowmo">Makanan &amp; Minuman (Slow-Mo)</option>
              <option value="lifestyle_health">Lifestyle &amp; Wellness</option>
              <option value="nature_drone">Alam &amp; Drone</option>
              <option value="renewable_energy">Energi Terbarukan</option>
              <option value="craft_artisanal">Artisanal &amp; Kerajinan</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">
              Generator Target:
            </label>
            <select
              value={generator}
              onChange={e => setGenerator(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="runway_gen3">Runway Gen-3 Alpha</option>
              <option value="kling_ai">Kling AI 1.5</option>
              <option value="luma_dream">Luma Dream Machine</option>
              <option value="sora">OpenAI Sora</option>
              <option value="hailuo_minimax">Hailuo / Minimax</option>
            </select>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={handleGenerateSeries}
            disabled={loading || !concept.trim()}
            className="w-full sm:w-auto px-7 py-3 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-slate-950 font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20 disabled:opacity-50 transition-all cursor-pointer"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
                <span>Merancang Paket Seri 5-Shot...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Buat Paket Seri 5-Shot Sekarang</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Results View */}
      {seriesData && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-900 border border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-indigo-400" />
                <h3 className="font-bold text-white text-base">
                  {seriesData.seriesName || `Paket Serial: ${concept}`}
                </h3>
              </div>
              {seriesData.seriesRationale && (
                <p className="text-xs text-slate-300 mt-1">{seriesData.seriesRationale}</p>
              )}
            </div>

            <button
              onClick={handleCopyAllPrompts}
              className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center justify-center gap-2 shrink-0 transition-colors"
            >
              {copiedKey === 'all-prompts' ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>5 Prompt Tersalin Sekaligus!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Salin Semua 5 Prompt Seri</span>
                </>
              )}
            </button>
          </div>

          {/* 5 Clips Timeline */}
          <div className="space-y-4">
            {seriesData.clips?.map((clip, idx) => {
              const copyKey = `clip-${idx}`;
              return (
                <div
                  key={idx}
                  className="bg-slate-900 border border-slate-800 rounded-xl p-4 hover:border-slate-700 transition-all"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-800 flex items-center justify-center text-xs font-bold">
                        {idx + 1}
                      </span>
                      <h4 className="font-bold text-slate-200 text-sm">{clip.shotType}</h4>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                        {clip.duration}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs text-indigo-300/80 bg-indigo-950/40 px-2.5 py-0.5 rounded border border-indigo-900/40">
                        {clip.role}
                      </span>
                      <button
                        onClick={() => handleCopy(clip.prompt, copyKey)}
                        className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-700"
                      >
                        {copiedKey === copyKey ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span className="text-emerald-400">Tersalin!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Salin Prompt</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  <p className="font-mono text-xs text-indigo-200/90 bg-slate-950 p-3 rounded-lg border border-slate-800 select-all leading-relaxed">
                    {clip.prompt}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Common Keywords for the whole series */}
          {seriesData.commonKeywords && (
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-xs font-semibold text-slate-300 block mb-2">
                Kata Kunci Koleksi Bersama (Salin untuk Seluruh 5 Klip di Shutterstock):
              </span>
              <div className="flex flex-wrap gap-1.5 mb-3">
                {seriesData.commonKeywords.map((kw, i) => (
                  <span key={i} className="text-xs px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800">
                    {kw}
                  </span>
                ))}
              </div>
              <button
                onClick={() => handleCopy(seriesData.commonKeywords?.join(', ') || '', 'common-kw')}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-700"
              >
                {copiedKey === 'common-kw' ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span className="text-emerald-400">Semua Tag Tersalin (Pisah Koma)!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Salin Semua Tag Koleksi (Pisah Koma)</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
