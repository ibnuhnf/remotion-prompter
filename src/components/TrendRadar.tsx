import React, { useState, useEffect } from 'react';
import { MarketTrend } from '../types';
import { 
  TrendingUp, 
  Sparkles, 
  ArrowUpRight, 
  RefreshCw, 
  Calendar, 
  Users, 
  CheckCircle, 
  Film, 
  Tag, 
  Copy, 
  Check, 
  Flame,
  Search
} from 'lucide-react';

interface TrendRadarProps {
  onSelectTrendForStudio: (category: string, idea: string) => void;
}

export const TrendRadar: React.FC<TrendRadarProps> = ({ onSelectTrendForStudio }) => {
  const [trends, setTrends] = useState<MarketTrend[]>([]);
  const [seasonalData, setSeasonalData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);

  // Fetch initial trends
  useEffect(() => {
    fetchTrends();
  }, []);

  const fetchTrends = async () => {
    try {
      const res = await fetch('/api/trends');
      const data = await res.json();
      if (data.success) {
        setTrends(data.data);
        setSeasonalData(data.seasonalCalendar);
      }
    } catch (err) {
      console.error('Failed to fetch trends:', err);
    }
  };

  const handleRefreshLiveTrends = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/trends/live', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category: selectedFilter })
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setTrends(data.data);
      }
    } catch (err) {
      console.error('Live trend refresh failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(id);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950/40 to-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold mb-3">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span>Radar Intelijen Pasar Shutterstock & Adobe Stock</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-2">
            Apa yang Sedang Laku & Dicari Pembeli Microstock?
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            Kunci sukses kontributor microstock adalah memproduksi video yang <em>sedang dicari pembeli</em>, bukan sekadar yang ingin kita buat. Pantau topik dengan volume lonjakan pencarian tertinggi bulan ini dan langsung buat prompt-nya dalam 1 klik.
          </p>
        </div>
      </div>

      {/* Seasonal Advice & Calendar */}
      {seasonalData && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex items-start gap-3">
            <div className="p-2.5 rounded-lg bg-emerald-950/60 border border-emerald-800/40 text-emerald-400 shrink-0">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider block">
                Fase Musim Komersial
              </span>
              <h4 className="text-sm font-bold text-white mb-1">{seasonalData.currentQuarter}</h4>
              <p className="text-xs text-slate-400">
                Agensi periklanan membeli materi video stok 2-3 bulan sebelum hari kampanye besar.
              </p>
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex items-start gap-3">
            <div className="p-2.5 rounded-lg bg-cyan-950/60 border border-cyan-800/40 text-cyan-400 shrink-0">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider block">
                Top Tema Paling Dicari
              </span>
              <div className="flex flex-wrap gap-1 mt-1">
                {seasonalData.topThemes?.map((theme: string, i: number) => (
                  <span key={i} className="text-[11px] px-1.5 py-0.5 rounded bg-slate-950 text-slate-300 border border-slate-800">
                    {theme}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex items-start gap-3">
            <div className="p-2.5 rounded-lg bg-purple-950/60 border border-purple-800/40 text-purple-400 shrink-0">
              <Film className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-purple-400 uppercase tracking-wider block">
                Format Video Favorit
              </span>
              <ul className="text-xs text-slate-300 mt-1 space-y-0.5">
                {seasonalData.highDemandFormats?.map((fmt: string, i: number) => (
                  <li key={i} className="flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-purple-400"></span>
                    <span>{fmt}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Filter & Live AI Refresh */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-slate-900/90 border border-slate-800">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          <span className="text-xs font-semibold text-slate-400 shrink-0">Filter Sektor:</span>
          {['All', 'Teknologi & AI', 'Bisnis', 'Lifestyle & Medis', 'Makanan', 'Alam & Energi'].map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedFilter(cat)}
              className={`text-xs px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
                selectedFilter === cat
                  ? 'bg-emerald-500 text-slate-950 font-bold'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <button
          onClick={handleRefreshLiveTrends}
          disabled={loading}
          className="w-full sm:w-auto px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-emerald-400 ${loading ? 'animate-spin' : ''}`} />
          <span>{loading ? 'Menganalisa Pasar Terkini...' : 'Analisis Tren Baru dengan AI'}</span>
        </button>
      </div>

      {/* Trend Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {trends.map(trend => (
          <div
            key={trend.id}
            className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 shadow-lg flex flex-col justify-between transition-all"
          >
            <div>
              {/* Card Header */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                  {trend.category}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                    {trend.growth}
                  </span>
                  <span className="text-xs font-semibold text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/40">
                    {trend.commercialDemand}
                  </span>
                </div>
              </div>

              {/* Title & Description */}
              <h3 className="text-lg font-bold text-white mb-2">{trend.title}</h3>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                {trend.description}
              </p>

              {/* Target Buyers */}
              <div className="mb-4 p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80">
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-cyan-300 mb-1">
                  <Users className="w-3.5 h-3.5" />
                  <span>Siapa yang Membeli Video Ini:</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {trend.buyerTypes?.map((buyer, idx) => (
                    <span key={idx} className="text-[10px] px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800">
                      {buyer}
                    </span>
                  ))}
                </div>
              </div>

              {/* Sample Prompts Preview */}
              <div className="space-y-2 mb-4">
                <span className="text-[11px] font-semibold text-slate-400 block">
                  Contoh Prompt Siap Pakai:
                </span>
                {trend.samplePrompts?.map((sample, idx) => {
                  const copyKey = `${trend.id}-prompt-${idx}`;
                  return (
                    <div
                      key={idx}
                      className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/70 text-xs font-mono text-emerald-200/90 relative group"
                    >
                      <p className="pr-12 text-[11px] leading-relaxed">{sample}</p>
                      <button
                        onClick={() => handleCopy(sample, copyKey)}
                        className="absolute right-2 top-2 p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                        title="Salin contoh prompt"
                      >
                        {copiedIndex === copyKey ? (
                          <Check className="w-3 h-3 text-emerald-400" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* High Demand Keywords */}
              <div className="mb-4">
                <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-400 mb-1.5">
                  <Tag className="w-3 h-3 text-slate-400" />
                  <span>Kata Kunci Populer:</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {trend.recommendedKeywords?.map((kw, idx) => (
                    <span key={idx} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800">
                      #{kw}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Action: Send to Studio */}
            <button
              onClick={() => onSelectTrendForStudio(trend.category, trend.title)}
              className="w-full mt-2 py-2.5 px-4 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 text-emerald-300 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Ambil Tren Ini &amp; Generate di Studio</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
