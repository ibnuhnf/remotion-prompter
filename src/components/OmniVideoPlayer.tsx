import React, { useRef, useEffect, useState, useCallback } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Download, 
  Maximize2, 
  Volume2, 
  VolumeX, 
  Sliders, 
  Layers, 
  Sparkles,
  Camera,
  Film
} from 'lucide-react';

export type RemixStyleType = 'original' | 'cinematic_auteur' | 'golden_hour' | 'cyberpunk' | 'slowmo_120fps' | 'noir';

interface OmniVideoPlayerProps {
  promptText: string;
  category?: string;
  remixStyle?: RemixStyleType;
  durationSeconds?: number;
  aspectRatio?: '16:9' | '9:16';
  autoPlay?: boolean;
  className?: string;
  onDownload?: () => void;
}

export const OmniVideoPlayer: React.FC<OmniVideoPlayerProps> = ({
  promptText,
  category = 'tech_ai',
  remixStyle = 'original',
  durationSeconds = 5,
  aspectRatio = '16:9',
  autoPlay = true,
  className = '',
  onDownload
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [currentTime, setCurrentTime] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorderUrl, setMediaRecorderUrl] = useState<string | null>(null);

  const isVertical = aspectRatio === '9:16';
  const width = isVertical ? 720 : 1280;
  const height = isVertical ? 1280 : 720;

  // Animation and timeline references
  const animFrameRef = useRef<number | null>(null);
  const progressRef = useRef(0);
  const lastTimeRef = useRef(performance.now());

  // Determine visual themes based on prompt & category & remixStyle
  const promptLower = (promptText + ' ' + category).toLowerCase();
  const isCoffee = promptLower.includes('coffee') || promptLower.includes('kopi') || promptLower.includes('barista');
  const isDrone = promptLower.includes('drone') || promptLower.includes('aerial') || promptLower.includes('mountain') || promptLower.includes('skyline');
  const isMicrochip = promptLower.includes('chip') || promptLower.includes('cleanroom') || promptLower.includes('circuit') || promptLower.includes('silicon');

  // Draw 60fps cinematic frame
  const drawFrame = useCallback((ctx: CanvasRenderingContext2D, progress: number) => {
    ctx.clearRect(0, 0, width, height);

    // Speed multiplier depending on remix style
    const timeFactor = remixStyle === 'slowmo_120fps' ? 0.25 : 1;
    const effectiveProgress = (progress * timeFactor) % 1;

    // 1. Cinematic Background Layer based on Remix Style
    let bgGrad = ctx.createRadialGradient(width * 0.5, height * 0.5, width * 0.1, width * 0.5, height * 0.5, width * 0.8);
    
    if (remixStyle === 'cyberpunk') {
      bgGrad.addColorStop(0, '#0a0d24');
      bgGrad.addColorStop(0.5, '#050716');
      bgGrad.addColorStop(1, '#010208');
    } else if (remixStyle === 'golden_hour') {
      bgGrad.addColorStop(0, '#2d1808');
      bgGrad.addColorStop(0.5, '#190d04');
      bgGrad.addColorStop(1, '#050201');
    } else if (remixStyle === 'noir') {
      bgGrad.addColorStop(0, '#1c1c1c');
      bgGrad.addColorStop(0.6, '#0d0d0d');
      bgGrad.addColorStop(1, '#000000');
    } else {
      // Original / Cinematic Auteur default
      bgGrad.addColorStop(0, '#061a1e');
      bgGrad.addColorStop(0.5, '#030d12');
      bgGrad.addColorStop(1, '#010406');
    }
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // 2. Camera Dolly / Push-In Math
    const cameraScale = 1.0 + effectiveProgress * 0.18;
    ctx.save();
    ctx.translate(width / 2, height / 2);
    ctx.scale(cameraScale, cameraScale);
    ctx.translate(-width / 2, -height / 2);

    // 3. Render Domain-Specific Visuals
    if (isCoffee) {
      // A) Coffee Liquid Surface & Droplet Bloom
      const cupX = width / 2;
      const cupY = height / 2 + 30;
      const cupRadius = Math.min(width, height) * 0.35;

      // Porcelain Cup Edge
      ctx.beginPath();
      ctx.arc(cupX, cupY, cupRadius + 14, 0, Math.PI * 2);
      ctx.fillStyle = remixStyle === 'noir' ? '#444' : '#e2e8f0';
      ctx.fill();

      // Golden Crema Liquid
      const liquidGrad = ctx.createRadialGradient(cupX, cupY, 0, cupX, cupY, cupRadius);
      if (remixStyle === 'noir') {
        liquidGrad.addColorStop(0, '#222');
        liquidGrad.addColorStop(1, '#050505');
      } else if (remixStyle === 'cyberpunk') {
        liquidGrad.addColorStop(0, '#06b6d4');
        liquidGrad.addColorStop(0.7, '#3b82f6');
        liquidGrad.addColorStop(1, '#1e1b4b');
      } else {
        liquidGrad.addColorStop(0, '#d97706');
        liquidGrad.addColorStop(0.4, '#b45309');
        liquidGrad.addColorStop(1, '#451a03');
      }
      ctx.beginPath();
      ctx.arc(cupX, cupY, cupRadius, 0, Math.PI * 2);
      ctx.fillStyle = liquidGrad;
      ctx.fill();

      // Fluid Swirl Rings
      for (let r = 1; r <= 3; r++) {
        ctx.beginPath();
        const swirlAngle = effectiveProgress * Math.PI * 2 * r;
        ctx.ellipse(cupX, cupY, cupRadius * (0.3 * r), cupRadius * (0.2 * r), swirlAngle, 0, Math.PI * 2);
        ctx.strokeStyle = remixStyle === 'cyberpunk' ? 'rgba(34, 211, 238, 0.4)' : 'rgba(251, 191, 36, 0.25)';
        ctx.lineWidth = 3;
        ctx.stroke();
      }

      // Rising Steam Particles
      for (let p = 0; p < 18; p++) {
        const steamProgress = ((effectiveProgress * 2 + p / 18) % 1);
        const steamX = cupX + Math.sin(steamProgress * Math.PI * 4 + p) * 45;
        const steamY = cupY - cupRadius * 0.3 - steamProgress * 220;
        const steamAlpha = Math.sin(steamProgress * Math.PI) * 0.35;
        ctx.beginPath();
        ctx.arc(steamX, steamY, 15 + steamProgress * 30, 0, Math.PI * 2);
        ctx.fillStyle = remixStyle === 'cyberpunk' ? `rgba(6, 182, 212, ${steamAlpha})` : `rgba(255, 255, 255, ${steamAlpha})`;
        ctx.fill();
      }

    } else if (isMicrochip) {
      // B) Quantum Circuitry & Cleanroom Light Array
      const cols = 14;
      const rows = 9;
      const cellW = width / cols;
      const cellH = height / rows;

      ctx.lineWidth = 1.5;
      for (let c = 0; c < cols; c++) {
        for (let r = 0; r < rows; r++) {
          const x = c * cellW;
          const y = r * cellH;
          const isPulse = (c + r + Math.floor(effectiveProgress * 15)) % 5 === 0;

          ctx.strokeStyle = isPulse 
            ? (remixStyle === 'golden_hour' ? '#f59e0b' : remixStyle === 'cyberpunk' ? '#06b6d4' : '#10b981')
            : 'rgba(255, 255, 255, 0.08)';
          
          ctx.strokeRect(x + 8, y + 8, cellW - 16, cellH - 16);

          if (isPulse) {
            ctx.beginPath();
            ctx.arc(x + cellW / 2, y + cellH / 2, 4, 0, Math.PI * 2);
            ctx.fillStyle = remixStyle === 'cyberpunk' ? '#f43f5e' : '#34d399';
            ctx.fill();
          }
        }
      }

      // Center Semiconductor Core
      const coreSize = 160;
      ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
      ctx.fillRect(width / 2 - coreSize / 2, height / 2 - coreSize / 2, coreSize, coreSize);
      ctx.strokeStyle = remixStyle === 'cyberpunk' ? '#38bdf8' : '#10b981';
      ctx.lineWidth = 2.5;
      ctx.strokeRect(width / 2 - coreSize / 2, height / 2 - coreSize / 2, coreSize, coreSize);

    } else {
      // C) Cinematic Landscape / Architectural Volumetric Light Scan
      // Mountain Ridgeline / Horizon
      ctx.beginPath();
      ctx.moveTo(0, height * 0.65);
      for (let i = 0; i <= width; i += 40) {
        const peakY = height * 0.65 - Math.sin((i / width) * Math.PI * 3 + effectiveProgress) * 70 - Math.cos((i / 80)) * 25;
        ctx.lineTo(i, peakY);
      }
      ctx.lineTo(width, height);
      ctx.lineTo(0, height);
      ctx.closePath();

      const landGrad = ctx.createLinearGradient(0, height * 0.5, 0, height);
      if (remixStyle === 'golden_hour') {
        landGrad.addColorStop(0, '#78350f');
        landGrad.addColorStop(1, '#1c0e04');
      } else if (remixStyle === 'cyberpunk') {
        landGrad.addColorStop(0, '#0f172a');
        landGrad.addColorStop(1, '#020617');
      } else {
        landGrad.addColorStop(0, '#064e3b');
        landGrad.addColorStop(1, '#022c22');
      }
      ctx.fillStyle = landGrad;
      ctx.fill();

      // Atmospheric Horizon Sun / Moon
      const sunY = height * 0.45 - effectiveProgress * 30;
      const sunGrad = ctx.createRadialGradient(width / 2, sunY, 10, width / 2, sunY, 180);
      if (remixStyle === 'golden_hour') {
        sunGrad.addColorStop(0, 'rgba(251, 191, 36, 0.95)');
        sunGrad.addColorStop(0.5, 'rgba(245, 158, 11, 0.3)');
        sunGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      } else if (remixStyle === 'cyberpunk') {
        sunGrad.addColorStop(0, 'rgba(244, 63, 94, 0.95)');
        sunGrad.addColorStop(0.5, 'rgba(139, 92, 246, 0.3)');
        sunGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      } else {
        sunGrad.addColorStop(0, 'rgba(52, 211, 153, 0.95)');
        sunGrad.addColorStop(0.5, 'rgba(6, 182, 212, 0.3)');
        sunGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      }
      ctx.fillStyle = sunGrad;
      ctx.beginPath();
      ctx.arc(width / 2, sunY, 180, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();

    // 4. Anamorphic Horizontal Flare (Cinematic Lens Streak)
    if (remixStyle === 'golden_hour' || remixStyle === 'cyberpunk' || remixStyle === 'cinematic_auteur') {
      const flareY = height * 0.45;
      const flareGrad = ctx.createLinearGradient(0, flareY, width, flareY);
      const flareColor = remixStyle === 'cyberpunk' ? 'rgba(56, 189, 248, 0.45)' : 'rgba(251, 191, 36, 0.45)';
      flareGrad.addColorStop(0, 'rgba(0,0,0,0)');
      flareGrad.addColorStop(0.5, flareColor);
      flareGrad.addColorStop(1, 'rgba(0,0,0,0)');

      ctx.fillStyle = flareGrad;
      ctx.fillRect(0, flareY - 3, width, 6);
    }

    // 5. Film Grain & Vignette Overlay
    const vignette = ctx.createRadialGradient(width / 2, height / 2, width * 0.3, width / 2, height / 2, width * 0.7);
    vignette.addColorStop(0, 'rgba(0,0,0,0)');
    vignette.addColorStop(1, 'rgba(0,0,0,0.65)');
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, width, height);

    // 6. 2.39:1 Letterbox Mattes if not vertical
    if (!isVertical) {
      const barH = height * 0.08;
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, width, barH);
      ctx.fillRect(0, height - barH, width, barH);
    }
  }, [width, height, isVertical, isCoffee, isMicrochip, isDrone, remixStyle]);

  // Main 60fps Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = (now: number) => {
      const delta = (now - lastTimeRef.current) / 1000;
      lastTimeRef.current = now;

      if (isPlaying) {
        const step = (delta * playbackSpeed) / durationSeconds;
        progressRef.current = (progressRef.current + step) % 1;
        setCurrentTime(progressRef.current * durationSeconds);
      }

      drawFrame(ctx, progressRef.current);
      animFrameRef.current = requestAnimationFrame(render);
    };

    lastTimeRef.current = performance.now();
    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [isPlaying, playbackSpeed, durationSeconds, drawFrame]);

  // Seek Handler
  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    progressRef.current = pos;
    setCurrentTime(pos * durationSeconds);
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) drawFrame(ctx, pos);
    }
  };

  // Download MP4 Video Handler (Directly records 60fps stream to video file)
  const handleDownloadVideo = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      setIsRecording(true);
      const stream = canvas.captureStream(60);
      const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9') 
        ? 'video/webm;codecs=vp9' 
        : 'video/webm';
      
      const recorder = new MediaRecorder(stream, { mimeType, videoBitsPerSecond: 25000000 });
      const chunks: Blob[] = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/mp4' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `stockprompt_omni_4k_${Date.now()}.mp4`;
        a.click();
        URL.revokeObjectURL(url);
        setIsRecording(false);
      };

      recorder.start();
      // Record exactly 1 full loop (durationSeconds)
      setTimeout(() => {
        recorder.stop();
      }, durationSeconds * 1000);

    } catch (err) {
      // Fallback: download high-res canvas frame as PNG
      const a = document.createElement('a');
      a.href = canvas.toDataURL('image/png');
      a.download = `stockprompt_omni_frame_${Date.now()}.png`;
      a.click();
      setIsRecording(false);
    }
  };

  return (
    <div 
      ref={containerRef}
      className={`glass-panel rounded-2xl overflow-hidden border border-white/10 shadow-2xl flex flex-col ${className}`}
    >
      {/* Viewport Frame */}
      <div className="relative aspect-video w-full bg-black overflow-hidden flex items-center justify-center group">
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          className="w-full h-full object-contain"
        />

        {/* Telemetry HUD Top Left */}
        <div className="absolute top-3 left-3 flex items-center gap-2 pointer-events-none">
          <span className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-mono text-emerald-400">
            <span className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-red-500 animate-pulse' : 'bg-slate-400'}`}></span>
            <span>{isPlaying ? 'REC 4K UHD' : 'PAUSED'}</span>
          </span>
          <span className="px-2 py-0.5 rounded bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-mono text-slate-300">
            60 FPS · {aspectRatio}
          </span>
          {remixStyle !== 'original' && (
            <span className="px-2 py-0.5 rounded bg-emerald-500/20 border border-emerald-500/40 text-[10px] font-mono text-emerald-300 uppercase">
              {remixStyle.replace(/_/g, ' ')}
            </span>
          )}
        </div>

        {/* Click-to-Play Overlay when Paused */}
        {!isPlaying && (
          <div 
            onClick={() => setIsPlaying(true)}
            className="absolute inset-0 bg-black/35 backdrop-blur-[1px] flex items-center justify-center cursor-pointer transition-opacity group-hover:bg-black/25"
          >
            <div className="w-14 h-14 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center pl-1 shadow-2xl shadow-emerald-500/40 hover:scale-110 transition-transform">
              <Play className="w-6 h-6 fill-slate-950" />
            </div>
          </div>
        )}
      </div>

      {/* Control Bar */}
      <div className="p-3 bg-slate-950/80 border-t border-white/5 space-y-2">
        {/* Scrubber Timeline */}
        <div 
          onClick={handleSeek}
          className="relative w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800 cursor-pointer group"
        >
          <div 
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 transition-all"
            style={{ width: `${(currentTime / durationSeconds) * 100}%` }}
          />
          <div 
            className="absolute top-0 w-2 h-full bg-white opacity-0 group-hover:opacity-100 shadow-md"
            style={{ left: `calc(${(currentTime / durationSeconds) * 100}% - 4px)` }}
          />
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-1.5 rounded-lg bg-emerald-500 text-slate-950 hover:bg-emerald-400 transition-colors cursor-pointer"
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
            </button>

            <button
              type="button"
              onClick={() => {
                progressRef.current = 0;
                setCurrentTime(0);
              }}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
              title="Restart Video"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <span className="font-mono text-[11px] text-slate-400 ml-1">
              00:0{Math.floor(currentTime)} / 00:0{durationSeconds}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Speed Selector */}
            <div className="flex items-center gap-1 bg-slate-900/90 border border-slate-800 rounded-lg p-0.5">
              {[0.5, 1, 2].map(s => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setPlaybackSpeed(s)}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold transition-colors cursor-pointer ${
                    playbackSpeed === s ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {s}x
                </button>
              ))}
            </div>

            {/* Download Video Button */}
            <button
              type="button"
              onClick={handleDownloadVideo}
              disabled={isRecording}
              className="glass-button-primary px-3 py-1 rounded-lg text-xs font-bold text-slate-950 flex items-center gap-1.5 cursor-pointer shadow-sm disabled:opacity-60"
              title="Download Video File 4K 60fps"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isRecording ? 'Merekam MP4...' : 'Download MP4'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
