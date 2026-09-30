import React from 'react';
import { Sparkles, TrendingUp, Layers, Wand2, Bookmark, BookOpen, Film, Code2 } from 'lucide-react';

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
    <header className="border-b border-slate-800 bg-slate-950/90 backdrop-blur-md sticky top-0 z-40">
      {/* Top Trending Ticker */}
      <div className="bg-gradient-to-r from-emerald-950/60 via-slate-900 to-cyan-950/60 border-b border-slate-800/80 px-4 py-1.5 text-xs text-slate-300 flex items-center justify-between overflow-x-auto whitespace-nowrap">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-semibold text-emerald-400 tracking-wide uppercase text-[10px]">
            Tren Pasar Microstock Terkini:
          </span>
          <span className="text-slate-300">
            🔥 AI Infrastructure (+142%) &bull; ⚡ Offshore Clean Energy (+118%) &bull; ☕ 120fps Artisanal Coffee (+95%) &bull; 🧘 Active Seniors Lifestyle (+88%) &bull; 🏙️ Scandinavian Minimalist Office (+76%)
          </span>
        </div>
        <div className="hidden md:flex items-center gap-3 text-slate-400 text-[11px] pl-4">
          <span className="bg-slate-800/80 px-2 py-0.5 rounded text-slate-300 border border-slate-700/50">
            Shutterstock &bull; Adobe Stock &bull; Pond5
          </span>
          <span className="text-emerald-400/90 font-mono">Format 4K UHD 60fps</span>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        {/* Brand Logo & Tagline */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('studio')}>
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-slate-950 font-black">
              <Film className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight text-white">StockPrompt</span>
                <span className="px-1.5 py-0.5 text-[10px] font-bold tracking-wider uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded">
                  4K HD
                </span>
                <span className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-semibold bg-cyan-950/70 text-cyan-300 border border-cyan-800/60 rounded">
                  5 - 15 Detik
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Brainstorming Ide & Generator Prompt Video Siap Jual di Microstock
              </p>
            </div>
          </div>

          {/* Guide Button for Mobile */}
          <button
            onClick={onOpenGuide}
            className="md:hidden flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 bg-slate-900 border border-slate-700 hover:border-emerald-500 transition-colors"
          >
            <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
            <span>Panduan</span>
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          <button
            onClick={() => setActiveTab('studio')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all ${
              activeTab === 'studio'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20 font-bold'
                : 'text-slate-300 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Studio Brainstorming</span>
          </button>

          <button
            onClick={() => setActiveTab('trends')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all ${
              activeTab === 'trends'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20 font-bold'
                : 'text-slate-300 hover:text-white hover:bg-slate-900'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Radar Tren Pasar</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          </button>

          <button
            onClick={() => setActiveTab('series')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all ${
              activeTab === 'series'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20 font-bold'
                : 'text-slate-300 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Paket Seri 5-Shot</span>
          </button>

          <button
            onClick={() => setActiveTab('doctor')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all ${
              activeTab === 'doctor'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20 font-bold'
                : 'text-slate-300 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Wand2 className="w-4 h-4" />
            <span>Prompt Doctor</span>
          </button>

          <button
            onClick={() => setActiveTab('remotion')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all ${
              activeTab === 'remotion'
                ? 'bg-purple-500 text-white shadow-md shadow-purple-500/20 font-bold'
                : 'text-slate-300 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Code2 className="w-4 h-4" />
            <span>Remotion 4K (React)</span>
            <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-purple-950 text-purple-300 border border-purple-800">
              Code
            </span>
          </button>

          <button
            onClick={() => setActiveTab('saved')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all ${
              activeTab === 'saved'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20 font-bold'
                : 'text-slate-300 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Bookmark className="w-4 h-4" />
            <span>Koleksi</span>
            {savedCount > 0 && (
              <span className="px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-emerald-400 text-slate-950">
                {savedCount}
              </span>
            )}
          </button>

          {/* Guide Button Desktop */}
          <button
            onClick={onOpenGuide}
            className="hidden md:flex items-center gap-1.5 ml-2 px-3 py-2 rounded-lg text-xs font-medium text-slate-300 bg-slate-900/90 border border-slate-700/80 hover:border-emerald-500/70 hover:text-white transition-colors"
          >
            <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
            <span>Tips Lolos Shutterstock</span>
          </button>
        </div>
      </div>
    </header>
  );
};
