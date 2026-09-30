import React, { useState, useEffect, useRef } from 'react';
import { 
  Code2, 
  Play, 
  Pause, 
  RotateCcw, 
  Copy, 
  Check, 
  Download, 
  Terminal, 
  Layers, 
  Sparkles, 
  Cpu, 
  Tv, 
  Sliders, 
  Info,
  CheckCircle2
} from 'lucide-react';

interface RemotionTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  defaultDuration: string;
  themeColor: string;
}

const REMOTION_TEMPLATES: RemotionTemplate[] = [
  {
    id: 'cyber_hud_loop',
    name: 'Cyber HUD & Quantum Circuit Loop',
    category: 'Teknologi & AI',
    description: 'Looping cincin HUD berputar dengan partikel data fotonik dan ruang teks komersial di sisi kiri.',
    defaultDuration: '8s',
    themeColor: '#10b981'
  },
  {
    id: 'fluid_liquid_wave',
    name: 'Luxury Fluid Wave & Caustics',
    category: 'Abstrak 3D',
    description: 'Gelombang sinusoidal berdimensi halus dengan gradasi warna mewah untuk background presentasi & LED event.',
    defaultDuration: '10s',
    themeColor: '#06b6d4'
  },
  {
    id: 'fintech_data_matrix',
    name: 'FinTech Growth Bar & Metric Stream',
    category: 'Bisnis & Finansial',
    description: 'Grafik batang dinamis dan garis analitik bertumbuh dengan angka floating bebas hak cipta.',
    defaultDuration: '8s',
    themeColor: '#f59e0b'
  },
  {
    id: 'kinetic_copy_space',
    name: 'Minimalist Clean Kinetic Backing',
    category: 'Korporat & Iklan',
    description: 'Transisi bidang geometris minimalis modern dengan 60% negative space bersih untuk copywriter iklan.',
    defaultDuration: '6s',
    themeColor: '#8b5cf6'
  }
];

export const RemotionStudio: React.FC = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<RemotionTemplate>(REMOTION_TEMPLATES[0]);
  const [durationSec, setDurationSec] = useState<number>(8);
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('16:9');
  const [accentColor, setAccentColor] = useState<string>('#10b981');
  
  // Player state
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [currentFrame, setCurrentFrame] = useState<number>(0);
  const [copiedType, setCopiedType] = useState<string | null>(null);

  const fps = 60;
  const totalFrames = durationSec * fps;
  const width = aspectRatio === '9:16' ? 2160 : 3840;
  const height = aspectRatio === '9:16' ? 3840 : 2160;

  // Frame animation loop
  useEffect(() => {
    let animId: number;
    if (isPlaying) {
      animId = requestAnimationFrame(() => {
        setCurrentFrame(prev => (prev + 1) % totalFrames);
      });
    }
    return () => cancelAnimationFrame(animId);
  }, [isPlaying, currentFrame, totalFrames]);

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  // Generate Remotion TSX Component Code
  const generatedRemotionCode = `import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

// Remotion 4K UHD 60fps Microstock Video Component
// Title: 4K ${selectedTemplate.name}
// Platform: Shutterstock & Adobe Stock Ready
// Duration: ${durationSec}s (${totalFrames} frames @ 60fps)
// Resolution: ${width}x${height} (${aspectRatio})

export const StockClipComposition = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames, width, height } = useVideoConfig();

  // Normalized progress from 0.0 to 1.0
  const progress = frame / durationInFrames;

  // Cinematic Camera push-in and subtle continuous rotation
  const cameraScale = interpolate(progress, [0, 1], [1.0, 1.15]);
  const rotationAngle = interpolate(progress, [0, 1], [-0.5, 0.5]);
  const glowOscillation = interpolate(Math.sin(progress * Math.PI * 2), [-1, 1], [0.35, 0.85]);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#020617',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        transform: \`scale(\${cameraScale}) rotate(\${rotationAngle}deg)\`,
        transformOrigin: 'center center'
      }}
    >
      {/* 1. Deep Atmospheric Vignette */}
      <div
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          background: 'radial-gradient(ellipse at 65% 45%, ${accentColor}33 0%, rgba(6, 182, 212, 0.08) 45%, #020617 80%)'
        }}
      />

      {/* 2. Programmatic 4K Motion Vector Graphic */}
      <svg
        width={width}
        height={height}
        style={{ position: 'absolute', pointerEvents: 'none' }}
      >
        <defs>
          <linearGradient id="mainNeonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="${accentColor}" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.75" />
          </linearGradient>
          <filter id="bloomGlow">
            <feGaussianBlur stdDeviation="12" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Outer Orbiting Ring */}
        <circle
          cx={width * 0.6}
          cy={height * 0.5}
          r={height * 0.32}
          fill="none"
          stroke="url(#mainNeonGrad)"
          strokeWidth="4"
          strokeDasharray="32 18"
          filter="url(#bloomGlow)"
          transform={\`rotate(\${frame * 0.4} \${width * 0.6} \${height * 0.5})\`}
        />

        {/* Counter-rotating Inner Ring */}
        <circle
          cx={width * 0.6}
          cy={height * 0.5}
          r={height * 0.22}
          fill="none"
          stroke="${accentColor}66"
          strokeWidth="2.5"
          strokeDasharray="8 14"
          transform={\`rotate(\${-frame * 0.25} \${width * 0.6} \${height * 0.5})\`}
        />

        {/* Dynamic Sine Wave Data Stream */}
        <path
          d={\`M 0 \${height * 0.72} Q \${width * 0.25} \${height * 0.72 + Math.sin(frame * 0.08) * 45}, \${width * 0.5} \${height * 0.72} T \${width} \${height * 0.72}\`}
          fill="none"
          stroke="${accentColor}"
          strokeWidth="3"
          opacity={0.6}
        />
      </svg>

      {/* 3. Negative Space Guide (Designated Copy Area for Stock Video Buyers) */}
      <div
        style={{
          position: 'absolute',
          left: '10%',
          top: '36%',
          maxWidth: '38%',
          opacity: 0.9
        }}
      >
        <span
          style={{
            display: 'inline-block',
            padding: '10px 22px',
            backgroundColor: 'rgba(15, 23, 42, 0.8)',
            border: '1px solid ${accentColor}66',
            borderRadius: '10px',
            color: '${accentColor}',
            fontFamily: 'monospace',
            fontSize: '32px',
            letterSpacing: '2px',
            textTransform: 'uppercase'
          }}
        >
          COMMERCIAL COPY SPACE
        </span>
      </div>
    </AbsoluteFill>
  );
};
`;

  const remotionRootCode = `import { Composition } from 'remotion';
import { StockClipComposition } from './StockClipComposition';

export const RemotionRoot = () => {
  return (
    <Composition
      id="StockClip4K"
      component={StockClipComposition}
      durationInFrames={${totalFrames}}
      fps={60}
      width={${width}}
      height={${height}}
    />
  );
};`;

  const cliRenderCommand = `npx remotion render src/Root.tsx StockClip4K out/stock_remotion_4k_${selectedTemplate.id}.mp4 --codec=h264 --crf=16`;

  // Download TSX component file
  const handleDownloadFile = () => {
    const blob = new Blob([generatedRemotionCode], { type: 'text/typescript;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `StockClipComposition_${selectedTemplate.id}.tsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Preview animation values
  const progressRatio = currentFrame / totalFrames;
  const simulatedScale = 1 + progressRatio * 0.12;

  return (
    <div className="space-y-8 pb-12">
      {/* Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-purple-950/40 to-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-semibold mb-3">
            <Code2 className="w-3.5 h-3.5 text-purple-400" />
            <span>Remotion React Video 4K &bull; Programmatic Stock Footage</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-2">
            Studio Remotion: Buat Video 4K 60fps dengan Kode React
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            Selain menggunakan text-to-video AI, Anda juga dapat menghasilkan video stok 4K HD murni berbasis kode menggunakan <strong>Remotion</strong>! Sangat disukai pembeli Shutterstock untuk <em>motion background, cyber HUD loop, dan animasi teks kinetik</em> karena 100% tajam, bebas halusinasi AI, dan loop-nya mulus tanpa cela.
          </p>
        </div>
      </div>

      {/* Main Grid: Live Simulated Player & Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Live Simulated Remotion Viewport */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
            <div className="flex items-center justify-between mb-3 text-xs">
              <span className="font-bold text-white flex items-center gap-2">
                <Play className="w-4 h-4 text-purple-400" />
                <span>Simulasi Render Player (60 FPS)</span>
              </span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-950 text-slate-300 border border-slate-800">
                Frame {currentFrame} / {totalFrames} ({(currentFrame / 60).toFixed(1)}s)
              </span>
            </div>

            {/* Viewport Screen */}
            <div
              className={`relative rounded-xl border border-slate-700/80 overflow-hidden bg-slate-950 shadow-2xl flex flex-col justify-between p-4 select-none ${
                aspectRatio === '9:16' ? 'aspect-[9/16] max-h-[380px] mx-auto w-[220px]' : 'aspect-video w-full'
              }`}
            >
              {/* Radial Glow */}
              <div
                className="absolute inset-0 transition-opacity duration-300 pointer-events-none"
                style={{
                  background: `radial-gradient(circle at 65% 45%, ${accentColor}33 0%, rgba(6, 182, 212, 0.08) 50%, #020617 80%)`
                }}
              />

              {/* Viewport Top Indicators */}
              <div className="relative z-10 flex items-center justify-between text-[10px] font-mono text-slate-400">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping"></span>
                  <span className="font-bold text-purple-300">REMOTION 4K</span>
                </div>
                <span className="bg-slate-900/80 px-2 py-0.5 rounded border border-slate-800 text-slate-300">
                  {width} x {height} @ 60fps
                </span>
              </div>

              {/* Animated Vector Centerpiece */}
              <div
                className="relative z-10 my-auto flex items-center justify-center transition-transform"
                style={{ transform: `scale(${simulatedScale})` }}
              >
                <svg width="220" height="150" viewBox="0 0 220 150" className="overflow-visible">
                  {/* Outer Orbit */}
                  <circle
                    cx="140"
                    cy="75"
                    r="55"
                    fill="none"
                    stroke={accentColor}
                    strokeWidth="2.5"
                    strokeDasharray="14 8"
                    transform={`rotate(${currentFrame * 0.7} 140 75)`}
                  />
                  {/* Inner Orbit */}
                  <circle
                    cx="140"
                    cy="75"
                    r="40"
                    fill="none"
                    stroke="#06b6d4"
                    strokeWidth="1.5"
                    strokeDasharray="4 6"
                    opacity={0.7}
                    transform={`rotate(${-currentFrame * 0.5} 140 75)`}
                  />
                  {/* Waveform line */}
                  <path
                    d={`M 10 110 Q 70 ${110 + Math.sin(currentFrame * 0.09) * 18} 140 110 T 210 110`}
                    fill="none"
                    stroke={accentColor}
                    strokeWidth="2"
                    opacity={0.8}
                  />
                </svg>

                {/* Simulated Copy Space Guide */}
                <div className="absolute left-2 top-8 text-left">
                  <span
                    className="text-[9px] font-mono px-2 py-1 rounded bg-slate-900/80 border text-slate-200 block max-w-[100px] leading-tight"
                    style={{ borderColor: `${accentColor}80` }}
                  >
                    COPY SPACE TEXT
                  </span>
                </div>
              </div>

              {/* Viewport Bottom Status */}
              <div className="relative z-10 flex items-center justify-between text-[10px] font-mono text-slate-400">
                <span>Composition: StockClip4K</span>
                <span className="text-purple-400 font-bold">100% Vector Sharp</span>
              </div>
            </div>

            {/* Timeline Controls */}
            <div className="mt-4 space-y-2">
              <input
                type="range"
                min={0}
                max={totalFrames - 1}
                value={currentFrame}
                onChange={e => {
                  setIsPlaying(false);
                  setCurrentFrame(Number(e.target.value));
                }}
                className="w-full accent-purple-500 cursor-pointer"
              />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
                  >
                    {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    <span>{isPlaying ? 'Jeda' : 'Putar'}</span>
                  </button>

                  <button
                    onClick={() => setCurrentFrame(0)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                    title="Reset ke frame 0"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span>Durasi:</span>
                  {[5, 8, 10, 15].map(sec => (
                    <button
                      key={sec}
                      onClick={() => {
                        setDurationSec(sec);
                        setCurrentFrame(0);
                      }}
                      className={`px-2 py-0.5 rounded text-[11px] font-bold transition-colors ${
                        durationSec === sec
                          ? 'bg-purple-500 text-white'
                          : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                      }`}
                    >
                      {sec}s
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Template Selection */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-purple-400" />
              <span>Pilih Template Video Remotion Siap Jual</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {REMOTION_TEMPLATES.map(tmpl => {
                const isSelected = selectedTemplate.id === tmpl.id;
                return (
                  <button
                    key={tmpl.id}
                    onClick={() => {
                      setSelectedTemplate(tmpl);
                      setAccentColor(tmpl.themeColor);
                      setCurrentFrame(0);
                    }}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'bg-purple-950/60 border-purple-500 text-white ring-1 ring-purple-500'
                        : 'bg-slate-950/40 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-900 text-slate-400 inline-block mb-1">
                      {tmpl.category}
                    </span>
                    <span className="text-xs font-bold block text-white">{tmpl.name}</span>
                    <span className="text-[10px] text-slate-400 block line-clamp-2 mt-1">
                      {tmpl.description}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Code Generator, Root, and CLI Commands */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-emerald-400" />
                  <span>Kode Remotion Component (.tsx)</span>
                </h3>
                <span className="text-xs text-slate-400">Siap copy &amp; paste ke folder <code>src/</code> proyek Remotion Anda</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleDownloadFile}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-700"
                  title="Unduh file .tsx"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Unduh .tsx</span>
                </button>

                <button
                  onClick={() => handleCopy(generatedRemotionCode, 'code')}
                  className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
                >
                  {copiedType === 'code' ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Kode Tersalin!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Salin Kode TSX</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Code Box */}
            <pre className="font-mono text-xs text-emerald-200/90 leading-relaxed bg-slate-950 p-4 rounded-xl border border-slate-800 max-h-[320px] overflow-y-auto overflow-x-auto select-all">
              {generatedRemotionCode}
            </pre>

            {/* Root.tsx Registration */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-300">
                  Registrasi Komposisi di <code>src/Root.tsx</code>:
                </span>
                <button
                  onClick={() => handleCopy(remotionRootCode, 'root')}
                  className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
                >
                  {copiedType === 'root' ? <span className="text-emerald-400">Tersalin!</span> : <Copy className="w-3 h-3" />}
                </button>
              </div>
              <pre className="font-mono text-[11px] text-slate-300 bg-slate-900 p-2.5 rounded border border-slate-800/80 overflow-x-auto">
                {remotionRootCode}
              </pre>
            </div>

            {/* CLI Command Box */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Perintah Render Video MP4 4K di Terminal:</span>
                </span>
                <button
                  onClick={() => handleCopy(cliRenderCommand, 'cli')}
                  className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
                >
                  {copiedType === 'cli' ? <span className="text-emerald-400 font-bold">Tersalin!</span> : <Copy className="w-3 h-3" />}
                </button>
              </div>
              <div className="flex items-center justify-between bg-slate-900 p-2.5 rounded border border-slate-800 text-xs font-mono text-cyan-300">
                <span className="truncate pr-2">{cliRenderCommand}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
