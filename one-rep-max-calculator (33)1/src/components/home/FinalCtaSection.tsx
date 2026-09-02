import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Sparkles } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface FinalCtaSectionProps {
  onNavigate: (path: string) => void;
}

export const FinalCtaSection: React.FC<FinalCtaSectionProps> = ({ onNavigate }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isReduced) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, y: 50, scale: 0.96 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 75%',
            end: 'bottom bottom',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      id="final-cinematic-section"
      className="w-full bg-[#07080a] py-32 sm:py-44 px-4 sm:px-6 lg:px-8 border-t border-white/10 text-center relative overflow-hidden select-none"
    >
      {/* Background subtle radial ambient highlight */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,197,94,0.06)_0%,transparent_70%)] pointer-events-none" />

      <div ref={contentRef} className="relative z-10 max-w-4xl mx-auto space-y-8 will-change-transform">
        <div className="inline-flex items-center space-x-2.5 px-4 py-1.5 rounded-full bg-[#22c55e]/10 border border-[#22c55e]/20 text-xs font-mono font-bold tracking-[0.25em] text-[#22c55e] uppercase">
          <Sparkles className="w-3.5 h-3.5" />
          <span>TAKE COMMAND OF YOUR PROGRAMMING</span>
        </div>

        <h2 className="font-heading font-extrabold text-5xl sm:text-7xl md:text-8xl lg:text-9xl uppercase tracking-tighter text-white leading-[0.88]">
          KNOW YOUR <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-200 to-slate-400">
            STRENGTH.
          </span>
        </h2>

        <p className="text-lg sm:text-xl text-[#94a3b8] max-w-xl mx-auto font-light leading-relaxed">
          Calculate your One Rep Max. Calibrate your working weights with absolute scientific precision.
        </p>

        <div className="pt-4">
          <button
            id="final-calculate-cta"
            onClick={() => onNavigate('/one-rep-max-calculator/')}
            className="px-10 py-5 rounded-full text-sm font-bold uppercase tracking-wider bg-[#22c55e] text-[#0a0b0d] hover:bg-[#4ade80] active:scale-95 transition-all shadow-[0_0_35px_-5px_rgba(34,197,94,0.5)] inline-flex items-center space-x-3 group cursor-pointer"
          >
            <span>Calculate Your 1RM</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
};
