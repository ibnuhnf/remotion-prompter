import React from 'react';
import { Sparkles, TrendingUp, Layers, Wand2, Bookmark, BookOpen, Film, Code2, Video } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  savedCount: number;
  onOpenGuide: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  savedCount,
  onOpenGuide
}) => {
  return (
    <header className="border-b border-white/10 bg-slate-950/75 backdrop-blur-2xl sticky top-0 z-40 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
      {/* Top Trending Ticker */}
      <div className="bg-slate-900/60 backdrop-blur-md border-b border-white/5 px-4 py-1.5 text-xs text-slate-300 flex items-center justify-between overflow-x-auto whitespace-nowrap">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-semibold text-emerald-400 tracking-wide uppercase text-[10px]">
            Tren Pasar Microstock Terkini:
          </span>
          <span className="text-slate-300 text-[11px]">
            🔥 AI Infrastructure (+142%) · ⚡ Offshore Clean Energy (+118%) · ☕ 120fps Artisanal Coffee (+95%) · 🧘 Active Seniors Lifestyle (+88%) · 🏙️ Minimalist Studio Architecture (+76%)
          </span>
        </div>
        <div className="hidden md:flex items-center gap-3 text-slate-400 text-[11px] pl-4">
          <span className="text-slate-300">
            Shutterstock · Adobe Stock · Pond5
          </span>
          <span className="text-emerald-400/90 font-mono">4K UHD 60fps</span>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        {/* Brand Logo & Tagline */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setActiveTab('studio')}>
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-slate-950 font-black group-hover:scale-105 transition-transform">
              <Film className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight text-white">StockPrompt</span>
                <span className="text-[11px] font-mono text-emerald-400 font-semibold">4K UHD</span>
                <span aria-hidden="true" className="text-slate-700">·</span>
                <span className="text-[11px] text-cyan-300 font-medium">5-15s Stock</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Brainstorming Ide & Generator Prompt Video Siap Jual di Microstock
              </p>
            </div>
          </div>

          {/* Guide Button for Mobile */}
          <button
            onClick={onOpenGuide}
            className="md:hidden flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 bg-slate-900/80 border border-slate-700 hover:border-emerald-500 transition-colors"
          >
            <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
            <span>Panduan</span>
          </button>
        </div>

        {/* Navigation Tabs (Glassmorphism Segmented Bar) */}
        <div className="flex items-center gap-1 p-1 bg-slate-900/70 border border-white/5 rounded-xl backdrop-blur-xl overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('studio')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium tracking-wide transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'studio'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Studio</span>
          </button>

          {/* NEW: Omni Transition Studio & Remix tab */}
          <button
            onClick={() => setActiveTab('omni')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium tracking-wide transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'omni'
                ? 'bg-gradient-to-r from-emerald-500 to-cyan-400 text-slate-950 font-bold shadow-md shadow-emerald-500/25'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            <span>Omni Transition &amp; Remix</span>
          </button>

          <button
            onClick={() => setActiveTab('trends')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium tracking-wide transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'trends'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Tren Pasar</span>
          </button>

          <button
            onClick={() => setActiveTab('series')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium tracking-wide transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'series'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Paket 5-Shot</span>
          </button>

          <button
            onClick={() => setActiveTab('doctor')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium tracking-wide transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'doctor'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Wand2 className="w-3.5 h-3.5" />
            <span>Doctor</span>
          </button>

          <button
            onClick={() => setActiveTab('remotion')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium tracking-wide transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'remotion'
                ? 'bg-purple-500 text-white font-bold shadow-md shadow-purple-500/20'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Remotion</span>
          </button>

          <button
            onClick={() => setActiveTab('saved')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium tracking-wide transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'saved'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>Koleksi</span>
            {savedCount > 0 && (
              <span className="font-mono text-[10px] text-emerald-400 font-bold">
                ({savedCount})
              </span>
            )}
          </button>

          {/* Guide Button Desktop */}
          <button
            onClick={onOpenGuide}
            className="hidden md:flex items-center gap-1.5 ml-1 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-colors cursor-pointer whitespace-nowrap"
          >
            <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
            <span>Panduan</span>
          </button>
        </div>
      </div>
    </header>
  );
};

