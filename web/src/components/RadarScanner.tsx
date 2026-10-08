import { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface RadarScannerProps {
  tenderCount: number;
  totalValueCr: number;
  className?: string;
}

export function RadarScanner({ tenderCount, totalValueCr, className = '' }: RadarScannerProps) {
  const sweepRef = useRef<HTMLDivElement>(null);
  const ring1Ref = useRef<HTMLDivElement>(null);
  const ring2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Rotating sweep beam
      if (sweepRef.current) {
        gsap.to(sweepRef.current, {
          rotation: 360,
          duration: 3.6,
          repeat: -1,
          ease: 'none',
          transformOrigin: 'center center',
        });
      }

      // Concentric expanding sonar rings
      if (ring1Ref.current && ring2Ref.current) {
        gsap.fromTo(
          ring1Ref.current,
          { scale: 0.2, opacity: 0.8 },
          { scale: 1.4, opacity: 0, duration: 2.4, repeat: -1, ease: 'power1.out' }
        );
        gsap.fromTo(
          ring2Ref.current,
          { scale: 0.2, opacity: 0.8 },
          { scale: 1.4, opacity: 0, duration: 2.4, delay: 1.2, repeat: -1, ease: 'power1.out' }
        );
      }
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className={`relative flex items-center justify-center overflow-hidden rounded-xl border border-cyan-500/30 bg-[#040e1a] p-4 ${className}`}>
      {/* Background grid lines */}
      <div className="absolute inset-0 bg-[radial-gradient(#083344_1px,transparent_1px)] [background-size:16px_16px] opacity-40"></div>

      {/* Radar circular container */}
      <div className="relative size-48 rounded-full border border-cyan-500/40 bg-cyan-950/20 shadow-inner shadow-cyan-950/60 flex items-center justify-center">
        {/* Distance Range Rings */}
        <div className="absolute size-36 rounded-full border border-cyan-500/20"></div>
        <div className="absolute size-24 rounded-full border border-cyan-500/30"></div>
        <div className="absolute size-12 rounded-full border border-cyan-500/40"></div>

        {/* Crosshair Axes */}
        <div className="absolute w-full h-[1px] bg-cyan-500/25"></div>
        <div className="absolute h-full w-[1px] bg-cyan-500/25"></div>

        {/* Sonar Expanding Waves */}
        <div ref={ring1Ref} className="absolute size-32 rounded-full border border-cyan-400 pointer-events-none"></div>
        <div ref={ring2Ref} className="absolute size-32 rounded-full border border-cyan-400 pointer-events-none"></div>

        {/* Rotating Radar Sweep Beam */}
        <div
          ref={sweepRef}
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            background: 'conic-gradient(from 0deg, rgba(6, 182, 212, 0.45) 0deg, rgba(6, 182, 212, 0.08) 45deg, transparent 90deg)',
          }}
        ></div>

        {/* Active Radar Blips (Simulating the 9 IT SEZ Venue Tenders) */}
        <div className="absolute top-10 left-16 size-2 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400 animate-ping"></div>
        <div className="absolute top-10 left-16 size-2 rounded-full bg-emerald-400 border border-black"></div>

        <div className="absolute bottom-12 right-14 size-2 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400"></div>
        <div className="absolute top-14 right-12 size-1.5 rounded-full bg-emerald-400"></div>
        <div className="absolute bottom-16 left-12 size-1.5 rounded-full bg-emerald-400"></div>
        <div className="absolute bottom-8 left-20 size-2 rounded-full bg-emerald-400"></div>
        <div className="absolute top-20 right-20 size-1.5 rounded-full bg-cyan-400"></div>

        {/* Center Venue Beacon */}
        <div className="relative z-10 size-3 rounded-full bg-amber-400 shadow-md shadow-amber-400/80 border-2 border-[#040e1a] animate-pulse"></div>
      </div>

      {/* Overlay Location & Status Badges */}
      <div className="absolute top-3 left-3 bg-[#081528]/90 border border-cyan-500/30 rounded-md px-2 py-1 text-[11px] font-mono text-cyan-300">
        GEO: 24.8333°N, 93.9500°E
      </div>

      <div className="absolute bottom-3 right-3 bg-[#081528]/90 border border-cyan-500/30 rounded-md px-2 py-1 text-[11px] font-mono text-emerald-400 flex items-center gap-1.5">
        <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
        <span>{tenderCount} Tenders ({totalValueCr.toFixed(1)} Cr)</span>
      </div>
    </div>
  );
}
