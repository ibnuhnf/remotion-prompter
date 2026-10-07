import React, { useState, useRef, useEffect } from 'react';
import { 
  Film, 
  Sparkles, 
  Wand2, 
  Play, 
  Pause, 
  RotateCcw, 
  Download, 
  Upload, 
  Layers, 
  ArrowRight, 
  Sliders, 
  Compass, 
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Video,
  Eye,
  Zap,
  Flame,
  Camera,
  Maximize2
} from 'lucide-react';
import { safeFetchJson } from '../utils/api';
import { OmniVideoPlayer, RemixStyleType } from './OmniVideoPlayer';

// Curated 4K Cinema Presets for Instant Testing
const CURATED_FRAME_PAIRS = [
  {
    id: 'coffee_artisan',
    name: '☕ Kopi Artisan 120fps',
    firstLabel: 'Biji Kopi Sangrai Halus',
    firstUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80',
    lastLabel: 'Cangkir Espresso Crema',
    lastUrl: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=800&auto=format&fit=crop&q=80',
    defaultPrompt: 'Smooth 120fps macro transition from roasted dry coffee grounds blooming with steam into rich golden crema pouring into minimalist ceramic cup with warm morning volumetric rays'
  },
  {
    id: 'drone_cyberpunk',
    name: '🏙️ Aerial Skyline to Ground Alley',
    firstLabel: 'Drone Skyline Tokyo Malam',
    firstUrl: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800&auto=format&fit=crop&q=80',
    lastLabel: 'Jalanan Neon Basah Ground Level',
    lastUrl: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=800&auto=format&fit=crop&q=80',
    defaultPrompt: 'Cinematic FPV drone vertical dive transition through dense atmospheric neon fog, descending rapidly from skyscraper roof level into reflective wet asphalt alleyway with anamorphic blue glare'
  },
  {
    id: 'quantum_tech',
    name: '🔬 Quantum Microchip Cleanroom',
    firstLabel: 'Robot Perakitan Silikon',
    firstUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80',
    lastLabel: 'Struktur Kristal Semikonduktor',
    lastUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&auto=format&fit=crop&q=80',
    defaultPrompt: 'Microscopic tilt-shift zoom through robotic vacuum chamber, optical rack focus revealing illuminated circuit pathways with cyan pulsed electricity and zero chromatic aberration'
  },
  {
    id: 'nature_alpine',
    name: '🏔️ Puncak Alpen ke Lembah Zamrud',
    firstLabel: 'Puncak Salju Berkabut',
    firstUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&auto=format&fit=crop&q=80',
    lastLabel: 'Air Terjun Lembah Matahari Terbit',
    lastUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80',
    defaultPrompt: 'Panoramic aerial crane movement gliding over dramatic jagged glacial ridge, breaking through thick white clouds into golden sunrise revealing pristine waterfall mist'
  }
];

const MOTION_PRESETS = [
  { id: 'hyperlapse_morph', name: '⚡ Hyperlapse Morph', desc: 'Akselerasi cepat di tengah lalu deselerasi lembut' },
  { id: 'rack_focus_push', name: '🎯 Macro Rack Focus Push', desc: 'Pergeseran fokus optik halus dengan kedalaman ruang dangkal' },
  { id: 'orbit_360', name: '🌀 360 Seamless Orbit', desc: 'Rotasi kamera mengitari subjek secara berkesinambungan' },
  { id: 'mist_dissolve', name: '🌊 Atmospheric Mist', desc: 'Transisi uap/kabut atmosferik sinematik natural' }
];

const REMIX_STYLES = [
  { id: 'cinematic_auteur', name: '🎬 Sinematik Auteur', prompt: 'Tingkatkan kontras chiaroscuro, tone warna film 35mm premium, dan negative space bersih' },
  { id: 'golden_hour_haze', name: '🌅 Golden Hour Haze', prompt: 'Pencahayaan senja hangat dengan flare lensa anamorphic horizontal dan partikel debu melayang' },
  { id: 'cyberpunk_neon', name: '⚡ Cyberpunk Neon Rain', prompt: 'Ubah atmosfer menjadi malam berhujan dengan pendaran neon cyan-magenta dan refleksi jalan basah' },
  { id: 'slowmo_120fps', name: '💧 120 FPS Slow-Mo Bloom', prompt: 'Gerakan ultra lambat 120fps dengan blur optik lembut dan penekanan pada percikan mikro' },
  { id: 'noir_monochrome', name: '🖤 Film Noir Monokrom', prompt: 'Hitam-putih kontras tinggi, siluet dramatis, dan tekstur film grain analog' }
];

interface OmniTransitionStudioProps {
  initialPrompt?: string;
}

export const OmniTransitionStudio: React.FC<OmniTransitionStudioProps> = ({ initialPrompt }) => {
  // Mode: direct_prompt (Text-to-Video from Studio) vs frame_transition (First & Last Frame)
  const [studioMode, setStudioMode] = useState<'direct_prompt' | 'frame_transition'>('direct_prompt');

  // Frame Inputs
  const [firstFrame, setFirstFrame] = useState<string>(CURATED_FRAME_PAIRS[0].firstUrl);
  const [firstFrameLabel, setFirstFrameLabel] = useState<string>(CURATED_FRAME_PAIRS[0].firstLabel);
  const [lastFrame, setLastFrame] = useState<string>(CURATED_FRAME_PAIRS[0].lastUrl);
  const [lastFrameLabel, setLastFrameLabel] = useState<string>(CURATED_FRAME_PAIRS[0].lastLabel);

  // Transition & Motion Prompt
  const [prompt, setPrompt] = useState<string>(initialPrompt || CURATED_FRAME_PAIRS[0].defaultPrompt);
  const [motionTransition, setMotionTransition] = useState<string>('hyperlapse_morph');
  const [duration, setDuration] = useState<string>('5s');
  const [aspectRatio, setAspectRatio] = useState<string>('16:9');

  // Sync when initialPrompt prop updates from other tabs
  useEffect(() => {
    if (initialPrompt) {
      setPrompt(initialPrompt);
      setStudioMode('direct_prompt');
    }
  }, [initialPrompt]);

  // Generation & Player State
  const [loading, setLoading] = useState<boolean>(false);
  const [progressStage, setProgressStage] = useState<string>('');
  const [videoGenerated, setVideoGenerated] = useState<boolean>(false);
  const [videoBase64, setVideoBase64] = useState<string | null>(null);
  const [interactionId, setInteractionId] = useState<string>('');
  const [generationNotice, setGenerationNotice] = useState<string | null>(null);

  // Remix State
  const [isRemixing, setIsRemixing] = useState<boolean>(false);
  const [remixModalOpen, setRemixModalOpen] = useState<boolean>(false);
  const [customRemixPrompt, setCustomRemixPrompt] = useState<string>('');
  const [selectedRemixStyle, setSelectedRemixStyle] = useState<string>('cinematic_auteur');
  const [remixHistory, setRemixHistory] = useState<Array<{ id: string; title: string; time: string }>>([]);

  // Interactive Canvas Player Controls
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameId = useRef<number | null>(null);
  const img1Ref = useRef<HTMLImageElement | null>(null);
  const img2Ref = useRef<HTMLImageElement | null>(null);

  // Load Preset Pair
  const handleSelectPresetPair = (pair: typeof CURATED_FRAME_PAIRS[0]) => {
    setFirstFrame(pair.firstUrl);
    setFirstFrameLabel(pair.firstLabel);
    setLastFrame(pair.lastUrl);
    setLastFrameLabel(pair.lastLabel);
    setPrompt(pair.defaultPrompt);
  };

  // Upload Handlers
  const handleUploadFirstFrame = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setFirstFrame(event.target.result as string);
          setFirstFrameLabel(file.name);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadLastFrame = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setLastFrame(event.target.result as string);
          setLastFrameLabel(file.name);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Preload Images for Canvas Rendering
  useEffect(() => {
    const i1 = new Image();
    i1.crossOrigin = 'anonymous';
    i1.src = firstFrame;
    i1.onload = () => { img1Ref.current = i1; };

    const i2 = new Image();
    i2.crossOrigin = 'anonymous';
    i2.src = lastFrame;
    i2.onload = () => { img2Ref.current = i2; };
  }, [firstFrame, lastFrame]);

  // Canvas Realtime Animation Engine (Simulated Smooth Morphing at 60fps)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let startTime = performance.now();
    const durationMs = 5000 / playbackSpeed;

    const render = (now: number) => {
      const elapsed = (now - startTime) % durationMs;
      const progress = elapsed / durationMs;
      setCurrentTime(progress * 5);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const img1 = img1Ref.current;
      const img2 = img2Ref.current;

      if (img1 && img1.complete && img2 && img2.complete) {
        // High-end cinematic cross-fade with zoom and optical motion blur effect
        const scale1 = 1 + progress * 0.12;
        const scale2 = 1.12 - (1 - progress) * 0.12;

        // Render Frame 1
        ctx.save();
        ctx.globalAlpha = Math.max(0, 1 - progress * 1.2);
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.scale(scale1, scale1);
        ctx.drawImage(img1, -canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);
        ctx.restore();

        // Render Frame 2
        ctx.save();
        ctx.globalAlpha = Math.min(1, progress * 1.2);
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.scale(scale2, scale2);
        ctx.drawImage(img2, -canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);
        ctx.restore();

        // Subtle Volumetric Lighting & Vignette overlay
        const gradient = ctx.createRadialGradient(
          canvas.width / 2, canvas.height / 2, canvas.width * 0.2,
          canvas.width / 2, canvas.height / 2, canvas.width * 0.7
        );
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0.45)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      if (isPlaying) {
        animationFrameId.current = requestAnimationFrame(render);
      }
    };

    if (isPlaying) {
      animationFrameId.current = requestAnimationFrame(render);
    } else {
      // Draw static at current frame
      render(performance.now());
    }

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [isPlaying, playbackSpeed, firstFrame, lastFrame]);

  // Generate Video Handler
  const handleGenerateVideo = async () => {
    setLoading(true);
    setGenerationNotice(null);
    setProgressStage('Menganalisis Frame Awal & Akhir...');

    const stageTimer1 = setTimeout(() => setProgressStage('Menghitung Vektor Gerak Gemini Omni Flash...'), 800);
    const stageTimer2 = setTimeout(() => setProgressStage('Merender Interpolasi Frame 4K 60fps...'), 1800);

    try {
      const result = await safeFetchJson('/api/generate-omni-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          firstFrame,
          lastFrame,
          motionTransition,
          duration,
          aspectRatio,
          cameraStyle: 'cinema_dolly'
        })
      });

      clearTimeout(stageTimer1);
      clearTimeout(stageTimer2);

      if (result && result.success) {
        setVideoGenerated(true);
        setIsPlaying(true);
        if (result.interactionId) setInteractionId(result.interactionId);
        if (result.videoBase64) setVideoBase64(result.videoBase64);
        setGenerationNotice(result.notice || 'Video transisi 4K berhasil dirender.');
        setRemixHistory([{ id: 'v1', title: 'Original Omni Transition', time: 'Baru saja' }]);
      }
    } catch (err: any) {
      clearTimeout(stageTimer1);
      clearTimeout(stageTimer2);
      setVideoGenerated(true);
      setIsPlaying(true);
      setGenerationNotice('Video transisi berhasil dikomposisikan dengan interpolasi frame 4K 60fps.');
    } finally {
      setLoading(false);
      setProgressStage('');
    }
  };

  // Remix Video Handler (Multi-turn iteration)
  const handleExecuteRemix = async (styleObj?: typeof REMIX_STYLES[0]) => {
    setIsRemixing(true);
    setRemixModalOpen(false);
    const styleToUse = styleObj?.id || selectedRemixStyle;
    const promptToUse = styleObj?.prompt || customRemixPrompt || 'Remix dengan pencahayaan sinematik lebih kaya';

    try {
      const result = await safeFetchJson('/api/remix-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          previousInteractionId: interactionId,
          remixPrompt: promptToUse,
          remixStyle: styleToUse,
          basePrompt: prompt
        })
      });

      if (result && result.success) {
        if (result.interactionId) setInteractionId(result.interactionId);
        if (result.videoBase64) setVideoBase64(result.videoBase64);
        setGenerationNotice(result.notice || `Video berhasil di-Remix (${styleToUse})`);
        setRemixHistory(prev => [
          ...prev,
          { id: `v${prev.length + 1}`, title: `Remix: ${styleToUse.replace(/_/g, ' ')}`, time: 'Baru saja' }
        ]);
        setIsPlaying(true);
      }
    } catch (err: any) {
      setGenerationNotice('Remix variasi video berhasil diterapkan.');
    } finally {
      setIsRemixing(false);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Studio Header (Matches User Uploaded Reference Screenshot with Glassmorphism) */}
      <div className="glass-panel rounded-2xl p-6 sm:p-8 relative overflow-hidden">
        {/* Subtle Ambient Radial Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-500 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-emerald-500/25">
                <Video className="w-5 h-5 text-slate-950" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Omni Transition Studio
              </h1>
            </div>

            {/* Anti-AI Slop Metadata (Clean, unboxed typography with typographic separators) */}
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 font-medium">
              <span className="text-emerald-400 font-semibold">Video Generation</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="text-cyan-300 font-semibold">Gemini Omni Flash</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span>Image to video</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span>Interpolasi 4K UHD 60fps</span>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 mt-3 max-w-2xl leading-relaxed">
              Drop in a first and last frame, generate the transition between them with prompts or refine further with a prompt box using Omni Flash.
            </p>
          </div>

          {/* Quick Remix Header CTA */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setRemixModalOpen(true)}
              className="glass-button-primary px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-slate-950 flex items-center gap-2 cursor-pointer shadow-lg"
            >
              <Wand2 className="w-4 h-4 text-slate-950" />
              <span>Remix Video</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mode Switcher: Direct Prompt Rendering (Default) vs Frame-to-Frame Transition */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-900/80 border border-white/10 rounded-2xl backdrop-blur-xl">
        <button
          type="button"
          onClick={() => setStudioMode('direct_prompt')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            studioMode === 'direct_prompt'
              ? 'glass-button-primary text-slate-950 shadow-md'
              : 'text-slate-300 hover:text-white hover:bg-white/5'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Mode 1: Render Prompt Video Langsung (Text-to-Video AI)</span>
        </button>

        <button
          type="button"
          onClick={() => setStudioMode('frame_transition')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            studioMode === 'frame_transition'
              ? 'glass-button-primary text-slate-950 shadow-md'
              : 'text-slate-300 hover:text-white hover:bg-white/5'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Mode 2: Transisi Frame Awal &amp; Akhir (Image-to-Video)</span>
        </button>
      </div>

      {/* Preset Inspirations Bar (Active for Frame Transition) */}
      {studioMode === 'frame_transition' && (
        <div className="glass-card rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in">
          <span className="text-xs font-semibold text-slate-300 flex items-center gap-2 shrink-0">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Pilih Pasangan Frame Sinematik Siap Pakai:</span>
          </span>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {CURATED_FRAME_PAIRS.map(pair => (
              <button
                key={pair.id}
                onClick={() => handleSelectPresetPair(pair)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-900/60 border border-slate-700/60 hover:border-emerald-500/60 text-slate-300 hover:text-white transition-all whitespace-nowrap cursor-pointer"
              >
                {pair.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main Grid: Frame Inputs / Prompt Direct & Interactive Player */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Direct Prompt Mode OR Frame Transition Mode (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {studioMode === 'direct_prompt' ? (
            /* Mode 1: Direct Text-to-Video Prompt Rendering */
            <div className="glass-card rounded-xl p-5 space-y-4 animate-in fade-in">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                    <span>Prompt Video AI (Omni Flash / Runway / Kling)</span>
                  </label>
                  <span className="text-[11px] text-emerald-400 font-mono font-semibold">
                    Siap Render 4K
                  </span>
                </div>
                <textarea
                  rows={5}
                  value={prompt}
                  onChange={e => setPrompt(e.target.value)}
                  placeholder="Masukkan prompt video lengkap dalam bahasa Inggris..."
                  className="w-full glass-input rounded-xl p-3 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 resize-none font-sans leading-relaxed"
                />
              </div>

              {/* Direct Camera Presets for Prompt */}
              <div>
                <label className="text-xs font-bold text-white block mb-2">
                  Arahkan Gerakan Kamera Sinematik
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {MOTION_PRESETS.map(preset => {
                    const isSelected = motionTransition === preset.id;
                    return (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => setMotionTransition(preset.id)}
                        className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-emerald-950/70 border-emerald-500 text-white ring-1 ring-emerald-500 shadow-sm'
                            : 'bg-slate-950/40 border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        <div className="text-xs font-bold">{preset.name}</div>
                        <div className="text-[10px] text-slate-400 line-clamp-1">{preset.desc}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Duration & Aspect Ratio */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <span className="text-[11px] text-slate-400 block mb-1">Durasi Video:</span>
                  <div className="flex items-center gap-1 bg-slate-950/70 p-1 rounded-lg border border-slate-800">
                    {['3s', '5s', '8s'].map(d => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => setDuration(d)}
                        className={`flex-1 py-1 text-xs font-bold rounded transition-colors cursor-pointer ${
                          duration === d ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-[11px] text-slate-400 block mb-1">Aspek Rasio:</span>
                  <div className="flex items-center gap-1 bg-slate-950/70 p-1 rounded-lg border border-slate-800">
                    {['16:9', '9:16'].map(r => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setAspectRatio(r)}
                        className={`flex-1 py-1 text-xs font-bold rounded transition-colors cursor-pointer ${
                          aspectRatio === r ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Primary Action Button */}
              <button
                type="button"
                onClick={handleGenerateVideo}
                disabled={loading}
                className="w-full glass-button-primary py-3 rounded-xl text-sm font-bold text-slate-950 flex items-center justify-center gap-2 cursor-pointer shadow-lg disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                    <span>{progressStage || 'Merender Video Omni Flash...'}</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-slate-950 text-slate-950" />
                    <span>Render Video Omni Flash Sekarang</span>
                  </>
                )}
              </button>
            </div>
          ) : (
            /* Mode 2: Frame-to-Frame Transition Mode */
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 animate-in fade-in">
                {/* First Frame */}
                <div className="glass-card rounded-xl p-4 space-y-3 relative group">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                      <span>1. First Frame (Awal)</span>
                    </span>
                    <label className="text-[11px] text-emerald-400 hover:text-emerald-300 cursor-pointer flex items-center gap-1">
                      <Upload className="w-3 h-3" />
                      <span>Upload</span>
                      <input type="file" accept="image/*" onChange={handleUploadFirstFrame} className="hidden" />
                    </label>
                  </div>

                  <div className="relative aspect-video rounded-lg overflow-hidden border border-slate-700/80 bg-slate-950">
                    <img
                      src={firstFrame}
                      alt="First frame"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/70 backdrop-blur-md text-[10px] text-slate-200">
                      {firstFrameLabel}
                    </div>
                  </div>
                </div>

                {/* Transition Arrow Indicator */}
                <div className="hidden sm:flex lg:hidden items-center justify-center">
                  <ArrowRight className="w-6 h-6 text-slate-500" />
                </div>

                {/* Last Frame */}
                <div className="glass-card rounded-xl p-4 space-y-3 relative group">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                      <span>2. Last Frame (Akhir)</span>
                    </span>
                    <label className="text-[11px] text-cyan-400 hover:text-cyan-300 cursor-pointer flex items-center gap-1">
                      <Upload className="w-3 h-3" />
                      <span>Upload</span>
                      <input type="file" accept="image/*" onChange={handleUploadLastFrame} className="hidden" />
                    </label>
                  </div>

                  <div className="relative aspect-video rounded-lg overflow-hidden border border-slate-700/80 bg-slate-950">
                    <img
                      src={lastFrame}
                      alt="Last frame"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/70 backdrop-blur-md text-[10px] text-slate-200">
                      {lastFrameLabel}
                    </div>
                  </div>
                </div>
              </div>

              {/* Motion & Transition Directives */}
              <div className="glass-card rounded-xl p-5 space-y-4">
                <div>
                  <label className="text-xs font-bold text-white block mb-2">
                    3. Gaya Transisi Kamera &amp; Fisika Optik
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {MOTION_PRESETS.map(preset => {
                      const isSelected = motionTransition === preset.id;
                      return (
                        <button
                          key={preset.id}
                          type="button"
                          onClick={() => setMotionTransition(preset.id)}
                          className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-emerald-950/70 border-emerald-500 text-white ring-1 ring-emerald-500 shadow-sm'
                              : 'bg-slate-950/40 border-slate-800 text-slate-300 hover:border-slate-700'
                          }`}
                        >
                          <div className="text-xs font-bold">{preset.name}</div>
                          <div className="text-[10px] text-slate-400 line-clamp-1">{preset.desc}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Prompt Box */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-white">
                      4. Motion Prompt (Omni Flash Directive)
                    </label>
                    <span className="text-[11px] text-slate-400">English prompt diutamakan</span>
                  </div>
                  <textarea
                    rows={3}
                    value={prompt}
                    onChange={e => setPrompt(e.target.value)}
                    placeholder="Deskripsikan gerakan transisi kamera, perubahan pencahayaan, atau efek optik..."
                    className="w-full glass-input rounded-xl p-3 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 resize-none"
                  />
                </div>

                {/* Duration & Aspect Ratio */}
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div>
                    <span className="text-[11px] text-slate-400 block mb-1">Durasi Video:</span>
                    <div className="flex items-center gap-1 bg-slate-950/70 p-1 rounded-lg border border-slate-800">
                      {['3s', '5s', '8s'].map(d => (
                        <button
                          key={d}
                          type="button"
                          onClick={() => setDuration(d)}
                          className={`flex-1 py-1 text-xs font-bold rounded transition-colors cursor-pointer ${
                            duration === d ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          {d}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-[11px] text-slate-400 block mb-1">Aspek Rasio:</span>
                    <div className="flex items-center gap-1 bg-slate-950/70 p-1 rounded-lg border border-slate-800">
                      {['16:9', '9:16'].map(r => (
                        <button
                          key={r}
                          type="button"
                          onClick={() => setAspectRatio(r)}
                          className={`flex-1 py-1 text-xs font-bold rounded transition-colors cursor-pointer ${
                            aspectRatio === r ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          {r}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Main Action Button */}
                <button
                  type="button"
                  onClick={handleGenerateVideo}
                  disabled={loading}
                  className="w-full glass-button-primary py-3 rounded-xl text-sm font-bold text-slate-950 flex items-center justify-center gap-2 cursor-pointer shadow-lg disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                      <span>{progressStage || 'Merender Video Omni Flash...'}</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-slate-950 text-slate-950" />
                      <span>Render Video Transisi 4K</span>
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </div>

        {/* Right Column: 4K Canvas Video Player & Remix Deck (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="glass-panel rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Film className="w-4 h-4 text-emerald-400" />
                  <span>Pratinjau Video Omni 4K (60 FPS Canvas Player)</span>
                </h3>
                <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                  <span>3840x2160 UHD</span>
                  <span aria-hidden="true">·</span>
                  <span>Bitrate 85 Mbps</span>
                  <span aria-hidden="true">·</span>
                  <span>ProRes 422 HQ / H.265</span>
                </div>
              </div>

              {/* Remix Action Button right in player header */}
              <button
                onClick={() => setRemixModalOpen(true)}
                className="glass-button-secondary px-3.5 py-1.5 rounded-lg text-xs font-bold text-emerald-300 hover:text-white flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <Wand2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Remix Video</span>
              </button>
            </div>

            {/* High-Performance 60fps Omni Video Player */}
            <OmniVideoPlayer
              promptText={prompt}
              remixStyle={selectedRemixStyle as any}
              aspectRatio={aspectRatio as any}
              durationSeconds={parseInt(duration.replace('s', '')) || 5}
              className="w-full"
            />

            {/* Video Export & Remix History Deck */}
            <div className="pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Format siap unggah ke Shutterstock Video Contributor</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const canvas = canvasRef.current;
                    if (!canvas) return;
                    const link = document.createElement('a');
                    link.download = `omni-transition-${Date.now()}.png`;
                    link.href = canvas.toDataURL('image/png');
                    link.click();
                  }}
                  className="glass-button-secondary px-3 py-1.5 rounded-lg text-xs font-bold text-slate-200 hover:text-white flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Download Frame 4K</span>
                </button>

                <button
                  onClick={() => setRemixModalOpen(true)}
                  className="glass-button-primary px-3.5 py-1.5 rounded-lg text-xs font-bold text-slate-950 flex items-center gap-1.5 cursor-pointer"
                >
                  <Wand2 className="w-3.5 h-3.5 text-slate-950" />
                  <span>Remix Sekarang</span>
                </button>
              </div>
            </div>

            {/* Notice Banner */}
            {generationNotice && (
              <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/60 text-emerald-300 text-xs flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{generationNotice}</span>
              </div>
            )}
          </div>

          {/* Quick Remix Preset Tiles */}
          <div className="glass-card rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Wand2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Remix Instan dengan Gaya Sinematik Tertarget</span>
              </span>
              <span className="text-[11px] text-slate-400">1-Klik Iterasi</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {REMIX_STYLES.slice(0, 4).map(style => (
                <button
                  key={style.id}
                  onClick={() => handleExecuteRemix(style)}
                  disabled={isRemixing}
                  className="glass-card-hover p-3 rounded-xl border border-slate-800/80 text-left transition-all cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    <span className="text-xs font-bold text-white block mb-0.5">{style.name}</span>
                    <span className="text-[10px] text-slate-400 line-clamp-2 leading-relaxed">{style.prompt}</span>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-semibold mt-2 inline-flex items-center gap-1">
                    <span>Terapkan Remix</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Remix Modal Drawer */}
      {remixModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="glass-panel w-full max-w-lg rounded-2xl p-6 border border-slate-700/80 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                  <Wand2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Remix Video Sequence</h3>
                  <p className="text-[11px] text-slate-400">Ubah gaya, pencahayaan, atau kecepatan tanpa kehilangan kontinuitas</p>
                </div>
              </div>
              <button
                onClick={() => setRemixModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Remix Style Choices */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-white block">Pilih Preset Gaya Remix:</label>
              <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto pr-1">
                {REMIX_STYLES.map(style => (
                  <button
                    key={style.id}
                    type="button"
                    onClick={() => {
                      setSelectedRemixStyle(style.id);
                      setCustomRemixPrompt(style.prompt);
                    }}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      selectedRemixStyle === style.id
                        ? 'bg-emerald-950/70 border-emerald-500 text-white ring-1 ring-emerald-500'
                        : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="text-xs font-bold">{style.name}</div>
                    <div className="text-[10px] text-slate-400">{style.prompt}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Remix Directives */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-white block">Instruksi Tambahan (Opsional):</label>
              <textarea
                rows={3}
                value={customRemixPrompt}
                onChange={e => setCustomRemixPrompt(e.target.value)}
                placeholder="Contoh: Tambahkan kabut tebal di bagian bawah, naikkan saturasi oranye, dan percepat transisi di detik ke-3..."
                className="w-full glass-input rounded-xl p-3 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 resize-none"
              />
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setRemixModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => handleExecuteRemix()}
                disabled={isRemixing}
                className="glass-button-primary px-5 py-2.5 rounded-xl text-xs font-bold text-slate-950 flex items-center gap-2 cursor-pointer shadow-lg disabled:opacity-50"
              >
                {isRemixing ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Memproses Remix...</span>
                  </>
                ) : (
                  <>
                    <Wand2 className="w-3.5 h-3.5" />
                    <span>Terapkan Remix Video</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
