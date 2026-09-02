import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface CalculatorPreviewSectionProps {
  onNavigate: (path: string) => void;
}

export const CalculatorPreviewSection: React.FC<CalculatorPreviewSectionProps> = ({ onNavigate }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textColRef = useRef<HTMLDivElement>(null);
  const cardWrapperRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const layer1Ref = useRef<HTMLDivElement>(null);
  const layer2Ref = useRef<HTMLDivElement>(null);
  const shadowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isReduced) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=160%',
          pin: true,
          scrub: 0.9,
          anticipatePin: 1,
        },
      });

      // Establish Initial 3D Spatial Depth
      gsap.set(cardRef.current, {
        scale: 0.72,
        rotateX: 12,
        rotateY: -10,
        z: -120,
        opacity: 0,
        y: 110,
        transformPerspective: 1400,
        transformStyle: 'preserve-3d',
      });

      gsap.set(shadowRef.current, {
        opacity: 0,
        scale: 0.6,
      });

      gsap.set(textColRef.current, {
        opacity: 0,
        x: -45,
        y: 35,
      });

      // Internal Layered Depth Displacements
      gsap.set(layer1Ref.current, {
        z: 25,
        transformStyle: 'preserve-3d',
      });
      gsap.set(layer2Ref.current, {
        z: 45,
        transformStyle: 'preserve-3d',
      });

      // PHASE 1 (0 -> 0.45): Physical Calculator smoothly glides forward from 3D depth into focal plane
      tl.to(
        cardRef.current,
        {
          scale: 1,
          rotateX: 0,
          rotateY: 0,
          z: 0,
          opacity: 1,
          y: 0,
          duration: 0.45,
          ease: 'power3.out',
        },
        0
      )
        .to(
          shadowRef.current,
          {
            opacity: 0.7,
            scale: 1,
            duration: 0.45,
            ease: 'power3.out',
          },
          0
        )
        .to(
          textColRef.current,
          {
            opacity: 1,
            x: 0,
            y: 0,
            duration: 0.4,
            ease: 'power2.out',
          },
          0.04
        )
        // PHASE 2 (0.45 -> 0.75): Layered Spatial Shift
        .to(
          textColRef.current,
          {
            x: -20,
            y: -25,
            duration: 0.3,
            ease: 'power1.inOut',
          },
          0.45
        )
        .to(
          cardRef.current,
          {
            x: 25,
            y: -18,
            scale: 0.98,
            rotateX: -2,
            rotateY: 2,
            z: -20,
            duration: 0.3,
            ease: 'power1.inOut',
          },
          0.45
        )
        // PHASE 3 (0.75 -> 1.0): Calculator passes by and recedes backward into spatial depth
        .to(
          cardRef.current,
          {
            scale: 0.85,
            opacity: 0.2,
            y: -65,
            rotateX: -6,
            z: -180,
            duration: 0.25,
            ease: 'power2.in',
          },
          0.75
        )
        .to(
          shadowRef.current,
          {
            opacity: 0,
            scale: 0.5,
            duration: 0.25,
            ease: 'power2.in',
          },
          0.75
        )
        .to(
          textColRef.current,
          {
            opacity: 0.15,
            y: -50,
            duration: 0.25,
            ease: 'power2.in',
          },
          0.75
        );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      id="preview-scene"
      className="h-screen w-full bg-[#0a0b0d] flex items-center justify-center relative overflow-hidden px-4 sm:px-6 lg:px-8 select-none"
    >
      {/* Subtle ambient lighting */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(34,197,94,0.08)_0%,transparent_65%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center relative z-10">
        {/* Left Column: Heading & Context */}
        <div ref={textColRef} className="lg:col-span-5 space-y-6 will-change-transform">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#22c55e]/10 border border-[#22c55e]/20 text-[#22c55e] text-xs font-mono font-bold tracking-[0.2em] uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>PRECISION INTERACTION</span>
          </div>

          <h2 className="font-heading font-extrabold text-4xl sm:text-6xl md:text-7xl uppercase tracking-tight text-white leading-[0.92]">
            MEASURE YOUR <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-200 to-slate-400">
              TRUE POTENTIAL.
            </span>
          </h2>

          <p className="text-base sm:text-lg text-[#94a3b8] font-normal leading-relaxed">
            Experience an engineered interface with instant mathematical feedback, Olympic barbell plate calculations, and periodized training percentages.
          </p>

          <div className="pt-2">
            <button
              id="preview-open-full-calculator-btn"
              onClick={() => onNavigate('/one-rep-max-calculator/')}
              className="px-8 py-4 rounded-full text-xs font-bold uppercase tracking-wider bg-[#22c55e] text-[#0a0b0d] hover:bg-[#4ade80] active:scale-95 transition-all shadow-[0_0_30px_-5px_rgba(34,197,94,0.5)] inline-flex items-center space-x-3 group cursor-pointer"
            >
              <span>Open 1RM Calculator</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Right Column: 3D Depth Product Presentation */}
        <div
          ref={cardWrapperRef}
          style={{ perspective: '1400px', transformStyle: 'preserve-3d' }}
          className="lg:col-span-7 flex flex-col items-center justify-center will-change-transform relative"
        >
          {/* Spatial Floor Shadow */}
          <div
            ref={shadowRef}
            className="absolute -bottom-8 w-4/5 h-12 bg-black/90 rounded-full blur-2xl pointer-events-none"
            style={{ transform: 'rotateX(80deg) translateZ(-60px)' }}
          />

          <div
            ref={cardRef}
            className="w-full max-w-xl bg-gradient-to-b from-[#141720] via-[#0f1117] to-[#0a0b0e] border border-white/20 rounded-3xl p-7 sm:p-9 shadow-[0_35px_110px_-15px_rgba(0,0,0,0.98)] relative overflow-hidden will-change-transform"
            style={{ transformStyle: 'preserve-3d' }}
          >
            {/* Header bar */}
            <div className="flex items-center justify-between border-b border-white/10 pb-5">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 rounded-full bg-[#ef4444]/80" />
                <div className="w-3 h-3 rounded-full bg-[#f59e0b]/80" />
                <div className="w-3 h-3 rounded-full bg-[#22c55e]/80" />
                <span className="text-xs font-mono text-[#94a3b8] ml-2 tracking-wider">
                  ONE REP MAX ENGINE
                </span>
              </div>
              <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-[#22c55e]/15 text-[#22c55e] font-bold uppercase border border-[#22c55e]/30">
                CALIBRATED
              </span>
            </div>

            {/* Input Simulation Badges with Layered Z-Depth */}
            <div ref={layer1Ref} className="grid grid-cols-3 gap-3 my-6 will-change-transform">
              <div className="bg-[#161a24] border border-white/15 rounded-2xl p-4 space-y-1 shadow-md">
                <span className="text-[10px] font-mono text-[#64748b] uppercase tracking-wider">
                  Working Weight
                </span>
                <div className="font-heading font-extrabold text-2xl text-white">
                  100 <span className="text-xs font-mono text-[#94a3b8]">KG</span>
                </div>
              </div>

              <div className="bg-[#161a24] border border-white/15 rounded-2xl p-4 space-y-1 shadow-md">
                <span className="text-[10px] font-mono text-[#64748b] uppercase tracking-wider">
                  Reps Done
                </span>
                <div className="font-heading font-extrabold text-2xl text-[#22c55e] font-mono-num">
                  5 <span className="text-xs font-mono text-[#94a3b8]">Reps</span>
                </div>
              </div>

              <div className="bg-[#161a24] border border-white/15 rounded-2xl p-4 space-y-1 shadow-md">
                <span className="text-[10px] font-mono text-[#64748b] uppercase tracking-wider">
                  Active Model
                </span>
                <div className="font-heading font-extrabold text-xl text-white truncate">
                  Epley
                </div>
              </div>
            </div>

            {/* Estimated 1RM Hero Readout with Elevated Z-Depth */}
            <div
              ref={layer2Ref}
              className="bg-gradient-to-br from-[#1b212f] to-[#0e1118] border border-[#22c55e]/40 rounded-2xl p-6 sm:p-7 space-y-2 relative overflow-hidden shadow-[0_15px_35px_rgba(0,0,0,0.6)] will-change-transform"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-[#94a3b8] uppercase tracking-wider">
                  Estimated One Rep Max
                </span>
                <span className="text-xs font-mono text-[#22c55e] font-bold">100% Neural Capacity</span>
              </div>
              <div className="flex items-baseline space-x-3">
                <span className="font-heading font-extrabold text-5xl sm:text-6xl text-white font-mono-num leading-none">
                  116.7
                </span>
                <span className="font-heading font-bold text-2xl text-[#22c55e]">KG</span>
                <span className="text-xs font-mono text-[#64748b] ml-auto">
                  ≈ 257.3 LBS
                </span>
              </div>
            </div>

            {/* Simulated Plate Distribution Preview */}
            <div className="mt-6 pt-5 border-t border-white/10 flex items-center justify-between text-xs font-mono text-[#94a3b8]">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-[#22c55e]" />
                <span>Olympic 20kg Bar + [20kg, 20kg, 5kg, 2.5kg, 0.85kg]</span>
              </div>
              <span className="text-[#22c55e] font-bold">95% @ 110.8kg</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
