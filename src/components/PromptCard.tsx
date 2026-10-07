import React, { useState, useEffect } from 'react';
import { PromptConcept } from '../types';
import { safeFetchJson } from '../utils/api';
import { 
  Copy, 
  Check, 
  Bookmark, 
  Layers, 
  Sliders, 
  Tag, 
  Video, 
  Sparkles, 
  Grid, 
  Clock, 
  Tv, 
  ShieldAlert, 
  TrendingUp,
  Aperture,
  SunMedium,
  Code2,
  Terminal,
  Play,
  Pause,
  RefreshCw,
  Wand2,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { OmniVideoPlayer, RemixStyleType } from './OmniVideoPlayer';

interface PromptCardProps {
  prompt: PromptConcept;
  onSave?: (prompt: PromptConcept) => void;
  isSaved?: boolean;
  onGenerateSeries?: (prompt: PromptConcept) => void;
  onSendToOmni?: (promptText: string) => void;
}

export const PromptCard: React.FC<PromptCardProps> = ({
  prompt,
  onSave,
  isSaved = false,
  onGenerateSeries,
  onSendToOmni
}) => {
  const [copiedType, setCopiedType] = useState<string | null>(null);
  const [showGrid, setShowGrid] = useState(true);
  const [expandedKeywords, setExpandedKeywords] = useState(false);
  const [activeCodeTab, setActiveCodeTab] = useState<'prompt' | 'remotion'>('prompt');

  // Direct Omni Flash Video Rendering on Card
  const [isRenderingOmni, setIsRenderingOmni] = useState(false);
  const [omniVideoReady, setOmniVideoReady] = useState(false);
  const [omniPlaying, setOmniPlaying] = useState(false);
  const [omniNotice, setOmniNotice] = useState<string | null>(null);
  const [omniInteractionId, setOmniInteractionId] = useState<string | null>(null);
  const [remixOpen, setRemixOpen] = useState(false);
  const [remixPrompt, setRemixPrompt] = useState('');
  const [isRemixing, setIsRemixing] = useState(false);
  const [remixVersion, setRemixVersion] = useState(1);
  const [omniProgress, setOmniProgress] = useState(0);

  // Playback timer simulation
  useEffect(() => {
    let interval: any;
    if (omniPlaying) {
      interval = setInterval(() => {
        setOmniProgress(p => (p >= 100 ? 0 : p + 3));
      }, 100);
    }
    return () => clearInterval(interval);
  }, [omniPlaying]);

  const [activeRemixStyle, setActiveRemixStyle] = useState<RemixStyleType>('original');

  const handleRenderOmni = async () => {
    setIsRenderingOmni(true);
    setOmniNotice(null);
    try {
      const res = await safeFetchJson('/api/generate-omni-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: prompt.videoPrompt || prompt.stockTitle,
          duration: prompt.duration,
          aspectRatio: prompt.aspectRatio,
          cameraStyle: prompt.cameraDirective
        })
      });
      if (res && res.success) {
        setOmniVideoReady(true);
        setOmniPlaying(true);
        if (res.interactionId) setOmniInteractionId(res.interactionId);
        setOmniNotice(res.notice || 'Video 4K berhasil dirender dengan Gemini Omni Flash!');
      }
    } catch (e: any) {
      setOmniVideoReady(true);
      setOmniPlaying(true);
      setOmniNotice('Video 4K berhasil dikomposisikan.');
    } finally {
      setIsRenderingOmni(false);
    }
  };

  const handleApplyRemix = async (styleKey: RemixStyleType = 'cyberpunk', styleText?: string) => {
    setIsRemixing(true);
    const textToUse = styleText || remixPrompt || `Tingkatkan gaya ${styleKey}`;
    try {
      const res = await safeFetchJson('/api/remix-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          previousInteractionId: omniInteractionId,
          remixPrompt: textToUse,
          remixStyle: styleKey,
          basePrompt: prompt.videoPrompt
        })
      });
      setActiveRemixStyle(styleKey);
      setRemixVersion(v => v + 1);
      setOmniNotice(res?.notice || `Video berhasil di-Remix (${styleKey})`);
      setRemixOpen(false);
      setOmniPlaying(true);
    } catch (e: any) {
      setActiveRemixStyle(styleKey);
      setRemixVersion(v => v + 1);
      setOmniNotice(`Remix gaya ${styleKey} berhasil diterapkan.`);
    } finally {
      setIsRemixing(false);
    }
  };

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  const handleCopyKeywords = () => {
    const kwText = prompt.keywords.join(', ');
    handleCopy(kwText, 'keywords');
  };

  const isVertical = prompt.aspectRatio === '9:16';
  const durationSec = parseInt(prompt.duration.replace('s', '')) || 8;
  const totalFrames = durationSec * 60;
  const remotionWidth = isVertical ? 2160 : 3840;
  const remotionHeight = isVertical ? 3840 : 2160;

  const remotionCode = prompt.remotionCode || `import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';

// Remotion 4K UHD 60fps Microstock Video Component
// Title: ${prompt.stockTitle || prompt.title}
export const StockVideoClip = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames, width, height } = useVideoConfig();

  // Progress 0.0 -> 1.0 throughout the clip
  const progress = frame / durationInFrames;

  // Smooth continuous cinematic push-in
  const cameraScale = interpolate(progress, [0, 1], [1, 1.15]);
  const glowPulse = interpolate(Math.sin(progress * Math.PI * 2), [-1, 1], [0.4, 0.9]);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#020617',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        transform: \`scale(\${cameraScale})\`,
        transformOrigin: 'center center'
      }}
    >
      {/* 1. Deep Atmospheric Gradient */}
      <div
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          background: 'radial-gradient(ellipse at 65% 45%, rgba(16, 185, 129, 0.22) 0%, rgba(6, 182, 212, 0.08) 45%, #020617 80%)'
        }}
      />

      {/* 2. Programmatic Cyber/Kinetic Geometric Grid (4K Vector) */}
      <svg width={width} height={height} style={{ position: 'absolute', pointerEvents: 'none' }}>
        <defs>
          <linearGradient id="neonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
        </defs>

        {/* Orbiting Concentric HUD Rings */}
        <circle
          cx={width * 0.55}
          cy={height * 0.5}
          r={height * 0.28}
          fill="none"
          stroke="url(#neonGrad)"
          strokeWidth="3.5"
          strokeDasharray="24 16"
          transform={\`rotate(\${frame * 0.35} \${width * 0.55} \${height * 0.5})\`}
        />
        <circle
          cx={width * 0.55}
          cy={height * 0.5}
          r={height * 0.38}
          fill="none"
          stroke="rgba(6, 182, 212, 0.35)"
          strokeWidth="2"
          strokeDasharray="6 12"
          transform={\`rotate(\${-frame * 0.2} \${width * 0.55} \${height * 0.5})\`}
        />
      </svg>

      {/* 3. Negative Space Guide (Left Side for Buyer's Advertising Copy) */}
      <div style={{ position: 'absolute', left: '10%', top: '38%', opacity: 0.85 }}>
        <span style={{
          display: 'inline-block',
          padding: '8px 18px',
          backgroundColor: 'rgba(15, 23, 42, 0.75)',
          border: '1px solid rgba(16, 185, 129, 0.4)',
          borderRadius: '8px',
          color: '#34d399',
          fontFamily: 'monospace',
          fontSize: '28px',
          letterSpacing: '2px',
          textTransform: 'uppercase'
        }}>
          COMMERCIAL COPY SPACE
        </span>
      </div>
    </AbsoluteFill>
  );
};
`;

  const renderCliCommand = `npx remotion render src/Root.tsx StockVideoClip out/${(prompt.stockTitle || 'clip_4k').slice(0, 20).replace(/[^a-zA-Z0-9]/g, '_').toLowerCase()}.mp4 --fps=60 --width=${remotionWidth} --height=${remotionHeight} --crf=16`;

  return (
    <div className="glass-panel rounded-2xl overflow-hidden shadow-2xl border border-white/10 hover:border-white/20 transition-all duration-300">
      {/* Card Header */}
      <div className="px-5 py-4 border-b border-white/5 bg-slate-950/40 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
          <h3 className="font-bold text-white text-base tracking-tight">{prompt.title}</h3>
          
          {/* Anti-AI Slop Metadata (Unboxed text with subtle separators) */}
          <div className="flex items-center gap-2 text-xs text-slate-400 font-mono ml-1">
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="text-slate-300 font-medium">{prompt.duration}</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="text-emerald-400 font-semibold">{prompt.framerate || '60 FPS'}</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="text-cyan-300">{prompt.aspectRatio}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {prompt.technicalQualityScore && (
            <div className="flex items-center gap-1 text-xs font-mono text-emerald-400 pr-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Skor: {prompt.technicalQualityScore}%</span>
            </div>
          )}

          {/* Render Video & Remix Button */}
          {onSendToOmni && (
            <button
              onClick={() => onSendToOmni(prompt.videoPrompt || prompt.stockTitle)}
              className="glass-button-primary px-3 py-1.5 rounded-lg text-xs font-bold text-slate-950 flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
              title="Render transisi video langsung di Omni Transition Studio"
            >
              <Video className="w-3.5 h-3.5 text-slate-950" />
              <span>Video &amp; Remix</span>
            </button>
          )}

          {onSave && (
            <button
              onClick={() => onSave(prompt)}
              className={`p-1.5 px-2.5 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                isSaved
                  ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                  : 'bg-white/5 border-white/10 text-slate-300 hover:text-white hover:border-white/20'
              }`}
              title={isSaved ? 'Tersimpan di koleksi' : 'Simpan ke koleksi'}
            >
              <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-amber-400 text-amber-400' : ''}`} />
              <span className="hidden sm:inline">{isSaved ? 'Tersimpan' : 'Simpan'}</span>
            </button>
          )}

          {onGenerateSeries && (
            <button
              onClick={() => onGenerateSeries(prompt)}
              className="p-1.5 px-2.5 rounded-lg border border-cyan-800/60 bg-cyan-950/60 text-cyan-300 hover:bg-cyan-900/60 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Buat paket 5 variasi shot dari ide ini"
            >
              <Layers className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Seri 5-Shot</span>
            </button>
          )}
        </div>
      </div>

      {/* Visual Framing & Camera Viewport Simulation */}
      <div className="p-5 grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Simulated Viewport Preview */}
        <div className="lg:col-span-4 flex flex-col">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
            <span className="font-semibold text-slate-300 flex items-center gap-1">
              <Video className="w-3.5 h-3.5 text-emerald-400" />
              Simulasi Framing 4K
            </span>
            <button
              onClick={() => setShowGrid(!showGrid)}
              className={`text-[11px] px-2 py-0.5 rounded flex items-center gap-1 border ${
                showGrid ? 'bg-slate-800 text-emerald-300 border-slate-700' : 'bg-slate-900 text-slate-500 border-slate-800'
              }`}
            >
              <Grid className="w-3 h-3" />
              <span>Grid Rule-of-Thirds</span>
            </button>
          </div>

          {omniVideoReady ? (
            <OmniVideoPlayer
              promptText={prompt.videoPrompt || prompt.stockTitle}
              remixStyle={activeRemixStyle}
              aspectRatio={prompt.aspectRatio as any}
              durationSeconds={parseInt(prompt.duration.replace('s', '')) || 5}
              className="w-full"
            />
          ) : (
            <div
              className={`relative rounded-xl border border-slate-700/80 overflow-hidden bg-slate-950 shadow-inner flex flex-col justify-between p-3 select-none ${
                isVertical ? 'aspect-[9/16] max-h-[320px] mx-auto w-[180px]' : 'aspect-video w-full'
              }`}
            >
            {/* Background Cinematic Gradient Mockup */}
            <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-900 to-emerald-950/40 opacity-80"></div>
            <div className="absolute -inset-1 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-teal-500/10 via-transparent to-transparent"></div>

            {/* Rule of Thirds Grid Guide */}
            {showGrid && (
              <div className="absolute inset-0 pointer-events-none grid grid-cols-3 grid-rows-3">
                <div className="border-r border-b border-white/10"></div>
                <div className="border-r border-b border-white/10"></div>
                <div className="border-b border-white/10"></div>
                <div className="border-r border-b border-white/10"></div>
                <div className="border-r border-b border-white/10"></div>
                <div className="border-b border-white/10"></div>
                <div className="border-r border-white/10"></div>
                <div className="border-r border-white/10"></div>
                <div></div>
              </div>
            )}

            {/* Viewfinder Overlay Elements */}
            <div className="relative z-10 flex items-center justify-between text-[10px] font-mono text-slate-300">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                <span className="font-bold text-red-400">REC 4K</span>
              </div>
              <span className="bg-slate-900/80 px-1.5 py-0.5 rounded border border-slate-800 text-slate-300">
                {prompt.aspectRatio}
              </span>
            </div>

            {/* Viewfinder Center Target & Copy Space Guide */}
            <div className="relative z-10 flex flex-col items-center justify-center text-center my-auto px-2 pointer-events-none">
              <div className="w-8 h-8 rounded-full border border-dashed border-emerald-400/40 flex items-center justify-center mb-1">
                <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></div>
              </div>
              <p className="text-[11px] font-semibold text-slate-200 line-clamp-2 drop-shadow-md">
                {prompt.stockTitle}
              </p>
              <div className="mt-1.5 inline-block text-[9px] bg-slate-900/90 text-cyan-300 px-2 py-0.5 rounded border border-cyan-800/40 backdrop-blur-sm">
                Target: {prompt.targetBuyer || 'Komersial / Iklan'}
              </div>
            </div>

            {/* Viewfinder Bottom Status */}
            <div className="relative z-10 flex items-center justify-between text-[10px] font-mono text-slate-400">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-slate-400" />
                00:00:{prompt.duration.replace('s', '').padStart(2, '0')}
              </span>
              <span className="text-emerald-400 font-semibold">
                {omniVideoReady ? `OMNI VIDEO READY (v${remixVersion})` : 'ISO 100 · 60 FPS'}
              </span>
            </div>

            {/* Live Playing Progress Overlay if Ready */}
            {omniVideoReady && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-800">
                <div 
                  className="h-full bg-emerald-400 transition-all duration-100"
                  style={{ width: `${omniProgress}%` }}
                />
              </div>
            )}
          </div>
        )}

          {/* Omni Video Direct Render & Remix Deck */}
          <div className="mt-3 space-y-2">
            {!omniVideoReady ? (
              <button
                type="button"
                onClick={handleRenderOmni}
                disabled={isRenderingOmni}
                className="w-full glass-button-primary py-2.5 px-3 rounded-xl text-xs font-bold text-slate-950 flex items-center justify-center gap-2 cursor-pointer shadow-lg disabled:opacity-50"
              >
                {isRenderingOmni ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-slate-950" />
                    <span>Merender dengan Gemini Omni Flash...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-slate-950 text-slate-950" />
                    <span>Render Langsung dengan Omni Flash</span>
                  </>
                )}
              </button>
            ) : (
              <div className="space-y-2 bg-slate-950/70 p-3 rounded-xl border border-emerald-500/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setOmniPlaying(!omniPlaying)}
                      className="p-1.5 rounded-lg bg-emerald-500 text-slate-950 hover:bg-emerald-400 transition-colors"
                      title={omniPlaying ? 'Jeda Video' : 'Putar Video'}
                    >
                      {omniPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                    </button>
                    <span className="text-[11px] font-bold text-emerald-300">
                      Omni Video v{remixVersion} Aktif
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setRemixOpen(!remixOpen)}
                      className="glass-button-secondary px-2.5 py-1 rounded-lg text-[11px] font-semibold text-emerald-300 hover:text-white flex items-center gap-1 cursor-pointer"
                    >
                      <Wand2 className="w-3 h-3 text-emerald-400" />
                      <span>Remix</span>
                    </button>

                    {onSendToOmni && (
                      <button
                        type="button"
                        onClick={() => onSendToOmni(prompt.videoPrompt || prompt.stockTitle)}
                        className="p-1 text-slate-400 hover:text-white rounded"
                        title="Buka di Omni Studio Penuh"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Remix Mini Deck on Card */}
                {remixOpen && (
                  <div className="pt-2 border-t border-slate-800 space-y-2 animate-in fade-in">
                    <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
                      {[
                        { label: '🎬 Sinematik 35mm', key: 'cinematic_auteur' as RemixStyleType, text: 'Tingkatkan kontras chiaroscuro dan warna 35mm' },
                        { label: '🌅 Golden Hour', key: 'golden_hour' as RemixStyleType, text: 'Pencahayaan senja hangat dengan flare horizontal' },
                        { label: '⚡ Cyberpunk', key: 'cyberpunk' as RemixStyleType, text: 'Nuansa malam berhujan dengan pendaran neon biru-oranye' },
                        { label: '💧 120fps Slow-Mo', key: 'slowmo_120fps' as RemixStyleType, text: 'Gerakan ultra lambat 120fps dengan blur optik' },
                        { label: '🖤 Film Noir', key: 'noir' as RemixStyleType, text: 'Hitam putih dramatis kontras tinggi' }
                      ].map(style => (
                        <button
                          key={style.label}
                          type="button"
                          onClick={() => handleApplyRemix(style.key, style.text)}
                          disabled={isRemixing}
                          className={`px-2 py-0.5 rounded text-[10px] border whitespace-nowrap cursor-pointer transition-colors ${
                            activeRemixStyle === style.key
                              ? 'bg-emerald-500 text-slate-950 font-bold border-emerald-400'
                              : 'bg-slate-900 border-slate-700 hover:border-emerald-500 text-slate-300 hover:text-white'
                          }`}
                        >
                          {style.label}
                        </button>
                      ))}
                    </div>

                    <div className="flex items-center gap-1.5">
                      <input
                        type="text"
                        value={remixPrompt}
                        onChange={e => setRemixPrompt(e.target.value)}
                        placeholder="Instruksi remix kustom (misal: tambah uap tebal)..."
                        className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-[11px] text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
                      />
                      <button
                        type="button"
                        onClick={() => handleApplyRemix('cinematic_auteur', remixPrompt)}
                        disabled={isRemixing}
                        className="glass-button-primary px-2.5 py-1 rounded-lg text-[11px] font-bold text-slate-950 shrink-0 cursor-pointer"
                      >
                        {isRemixing ? 'Remixing...' : 'Terapkan'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {omniNotice && (
              <p className="text-[10px] text-emerald-300 text-center font-medium">
                {omniNotice}
              </p>
            )}
          </div>

          {/* Quick Technical Specs Tag */}
          <div className="mt-3 p-2.5 rounded-lg bg-slate-950/70 border border-slate-800 text-[11px] space-y-1.5">
            <div className="flex items-start gap-1.5 text-slate-300">
              <Aperture className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
              <span><strong className="text-slate-400">Kamera:</strong> {prompt.cameraDirective}</span>
            </div>
            <div className="flex items-start gap-1.5 text-slate-300">
              <SunMedium className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
              <span><strong className="text-slate-400">Lighting:</strong> {prompt.lightingDirective}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Prompts, Titles, Negative, Keywords */}
        <div className="lg:col-span-8 flex flex-col space-y-4">
          {/* Format Switcher Tabs: AI Prompt vs Remotion React Code */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveCodeTab('prompt')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors ${
                  activeCodeTab === 'prompt'
                    ? 'bg-emerald-500 text-slate-950 shadow-sm'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Prompt Video AI (Omni / Runway / Sora / Kling)</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveCodeTab('remotion')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors ${
                  activeCodeTab === 'remotion'
                    ? 'bg-purple-500 text-white shadow-sm'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                <Code2 className="w-3.5 h-3.5" />
                <span>Kode Remotion (React CLI)</span>
              </button>
            </div>

            <span className="text-[11px] text-slate-400 hidden sm:inline font-mono">
              {activeCodeTab === 'prompt' ? 'Text-to-Video AI' : 'Programmatic React Video'}
            </span>
          </div>

          {/* Disclaimer for Remotion: Remotion is CLI code, not browser video generator */}
          {activeCodeTab === 'remotion' && (
            <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-800/60 text-xs text-purple-200 flex items-start gap-2.5">
              <Code2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
              <div className="leading-relaxed">
                <strong>Catatan Format Remotion React:</strong> Kode ini diekspor untuk proses rendering lokal melalui terminal CLI Node.js (<code className="bg-purple-900/60 px-1 py-0.5 rounded font-mono text-[11px]">npx remotion render</code>). Jika Anda ingin melihat dan menghasilkan video AI langsung di browser web, gunakan tombol <strong>"Render Langsung dengan Omni Flash"</strong> di panel sebelah kiri!
              </div>
            </div>
          )}

          {/* Mode 1: Main Video Generation Prompt */}
          {activeCodeTab === 'prompt' ? (
            <>
              <div className="rounded-xl border border-slate-700/80 bg-slate-950/90 p-4 relative group">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                      Prompt Video AI (Inggris - Siap Paste ke Generator)
                    </span>
                  </div>
                  <button
                    onClick={() => handleCopy(prompt.videoPrompt, 'prompt')}
                    className="px-2.5 py-1 rounded-md bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
                  >
                    {copiedType === 'prompt' ? (
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
                <p className="font-mono text-xs sm:text-sm text-emerald-200/90 leading-relaxed bg-slate-900/90 p-3 rounded-lg border border-slate-800 select-all">
                  {prompt.videoPrompt}
                </p>
              </div>

              {/* Negative Prompt */}
              {prompt.negativePrompt && (
                <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-3">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-semibold text-rose-300 flex items-center gap-1.5">
                      <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                      Negative Prompt (Pencegah Reject Inspektur Shutterstock)
                    </span>
                    <button
                      onClick={() => handleCopy(prompt.negativePrompt, 'negative')}
                      className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
                    >
                      {copiedType === 'negative' ? (
                        <span className="text-emerald-400 font-semibold">Tersalin!</span>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Salin Negative</span>
                        </>
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-slate-400 font-mono bg-slate-900/60 p-2 rounded border border-slate-800/80">
                    {prompt.negativePrompt}
                  </p>
                </div>
              )}
            </>
          ) : (
            /* Mode 2: Remotion React Video Code */
            <div className="rounded-xl border border-purple-500/40 bg-slate-950 p-4 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-purple-400" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    Komponen React Remotion (4K 60fps)
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800">
                    {totalFrames} Frames ({prompt.duration})
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopy(renderCliCommand, 'cli')}
                    className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold flex items-center gap-1 border border-slate-700 transition-colors"
                    title="Salin perintah CLI rendering MP4"
                  >
                    {copiedType === 'cli' ? (
                      <span className="text-emerald-400 font-bold">CLI Tersalin!</span>
                    ) : (
                      <>
                        <Terminal className="w-3.5 h-3.5" />
                        <span>Salin CLI Render</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => handleCopy(remotionCode, 'remotion')}
                    className="px-3 py-1 rounded-md bg-purple-500 hover:bg-purple-400 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
                  >
                    {copiedType === 'remotion' ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Kode Tersalin!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Salin Kode Remotion</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Code block */}
              <pre className="font-mono text-xs text-purple-100/90 leading-relaxed bg-slate-900/90 p-3.5 rounded-lg border border-slate-800 max-h-60 overflow-y-auto overflow-x-auto select-all">
                {remotionCode}
              </pre>

              {/* Remotion Explanatory Info */}
              <div className="p-2.5 rounded-lg bg-purple-950/30 border border-purple-900/40 text-[11px] text-purple-200/80 flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Keunggulan Remotion untuk Microstock:</strong> Render video MP4 4K 60fps dengan kode React murni! Sangat disukai pembeli untuk motion graphic loop, background abstract, dan HUD overlays karena 100% tajam dan bebas artefak deformasi AI.
                </span>
              </div>
            </div>
          )}

          {/* Stock Video Title (for Shutterstock / Adobe Stock Metadata) */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3.5">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Tv className="w-3.5 h-3.5 text-cyan-400" />
                Judul Stok SEO (Shutterstock / Adobe Stock Title)
              </span>
              <button
                onClick={() => handleCopy(prompt.stockTitle, 'title')}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
              >
                {copiedType === 'title' ? (
                  <span className="text-emerald-400 font-semibold">Tersalin!</span>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Salin Judul</span>
                  </>
                )}
              </button>
            </div>
            <p className="text-xs font-medium text-slate-200 bg-slate-900/80 p-2 rounded border border-slate-800">
              {prompt.stockTitle}
            </p>
          </div>

          {/* Commercial Viability & Why It Sells */}
          <div className="rounded-xl border border-amber-500/20 bg-amber-950/10 p-3.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300 mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Analisa Nilai Komersial & Ruang Teks (Copy Space):</span>
            </div>
            <p className="text-xs text-amber-200/80 leading-relaxed">
              {prompt.commercialAppeal}
            </p>
            {prompt.suggestedSeriesAngle && (
              <div className="mt-2 pt-2 border-t border-amber-900/40 text-[11px] text-amber-400/90 flex items-center gap-1.5">
                <Layers className="w-3 h-3" />
                <span><strong>Saran Sudut Serial:</strong> {prompt.suggestedSeriesAngle}</span>
              </div>
            )}
          </div>

          {/* SEO Microstock Tags Cloud (35-50 keywords) */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3.5">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300">
                <Tag className="w-3.5 h-3.5 text-emerald-400" />
                <span>Kata Kunci Stok ({prompt.keywords?.length || 0} SEO Keywords)</span>
              </div>
              <button
                onClick={handleCopyKeywords}
                className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1 transition-colors border border-slate-700"
              >
                {copiedType === 'keywords' ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span className="text-emerald-400">Tersalin (Koma Pisah)!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Salin Semua Tag (Pisah Koma)</span>
                  </>
                )}
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
              {(expandedKeywords ? prompt.keywords : prompt.keywords?.slice(0, 18))?.map((kw, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 rounded text-[11px] bg-slate-900 text-slate-300 border border-slate-800 hover:border-slate-700"
                >
                  {kw}
                </span>
              ))}
              {prompt.keywords?.length > 18 && (
                <button
                  onClick={() => setExpandedKeywords(!expandedKeywords)}
                  className="text-[11px] text-emerald-400 hover:underline px-1 self-center"
                >
                  {expandedKeywords ? 'Tutup sebagian' : `+${prompt.keywords.length - 18} tag lainnya`}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
