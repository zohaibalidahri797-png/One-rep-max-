import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, ChevronDown } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface HeroSectionProps {
  onNavigate: (path: string) => void;
  onExploreClick: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onNavigate, onExploreClick }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoWrapperRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const vignetteRef = useRef<HTMLDivElement>(null);
  const darkRecedeOverlayRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isReduced) return;

    const ctx = gsap.context(() => {
      // Pinned Hero Timeline with continuous, responsive scroll mapping
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=140%',
          pin: true,
          scrub: 0.85,
          anticipatePin: 1,
          onLeave: () => {
            if (videoRef.current) videoRef.current.pause();
          },
          onEnterBack: () => {
            if (videoRef.current) videoRef.current.play().catch(() => {});
          },
        },
      });

      // Initial States
      gsap.set(videoWrapperRef.current, { scale: 1.0, y: 0, opacity: 1 });
      gsap.set(vignetteRef.current, { opacity: 0.5 });
      gsap.set(darkRecedeOverlayRef.current, { opacity: 0 });
      gsap.set(eyebrowRef.current, { y: 0, opacity: 1 });
      gsap.set(headlineRef.current, { y: 0, scale: 1, opacity: 1 });
      gsap.set(subtitleRef.current, { y: 0, opacity: 1 });
      gsap.set(ctaRef.current, { y: 0, opacity: 1 });
      gsap.set(scrollIndicatorRef.current, { opacity: 1, y: 0 });

      // PHASE 1: Scroll indicator disappears immediately, subtle video movement begins
      tl.to(
        scrollIndicatorRef.current,
        { opacity: 0, y: 25, duration: 0.12, ease: 'power2.out' },
        0
      )
        // Video subtle zoom from 1.00 -> 1.08 / 1.10
        .to(
          videoWrapperRef.current,
          { scale: 1.08, y: -20, duration: 1.0, ease: 'none' },
          0
        )
        // Subtle vignette increase to draw focus into center
        .to(
          vignetteRef.current,
          { opacity: 0.85, duration: 0.7, ease: 'power1.inOut' },
          0
        )
        // PHASE 2: Differential Speeds for true depth (Eyebrow -> Headline -> Subtitle -> CTA)
        .to(
          eyebrowRef.current,
          { y: -65, opacity: 0.2, duration: 0.5, ease: 'power2.in' },
          0.02
        )
        .to(
          headlineRef.current,
          { y: -90, scale: 1.02, opacity: 0.2, duration: 0.65, ease: 'power2.in' },
          0.04
        )
        .to(
          subtitleRef.current,
          { y: -125, opacity: 0.1, duration: 0.55, ease: 'power2.in' },
          0.06
        )
        .to(
          ctaRef.current,
          { y: -160, opacity: 0, duration: 0.45, ease: 'power2.in' },
          0.08
        )
        // PHASE 3 & 4: Hero recedes into depth with gentle darkening without completely disappearing
        .to(
          darkRecedeOverlayRef.current,
          { opacity: 0.65, duration: 0.4, ease: 'power2.inOut' },
          0.6
        )
        .to(
          videoWrapperRef.current,
          { opacity: 0.35, duration: 0.35, ease: 'power2.out' },
          0.65
        )
        .to(
          headlineRef.current,
          { opacity: 0, y: -130, duration: 0.25, ease: 'power1.in' },
          0.7
        );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      id="hero-scene"
      className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-[#0a0b0d] select-none"
    >
      {/* 3D Bench Press Video Background */}
      <div
        ref={videoWrapperRef}
        className="absolute inset-0 w-full h-full z-0 overflow-hidden pointer-events-none origin-center will-change-transform"
      >
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="/assets/hero-poster.jpg"
          className="w-full h-full object-cover object-center"
        >
          <source src="/assets/hero-bench-press.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Cinematic Vignette & Dynamic Recede Overlays */}
      <div
        ref={vignetteRef}
        className="absolute inset-0 z-0 bg-gradient-to-t from-[#0a0b0d] via-[#0a0b0d]/50 to-[#0a0b0d]/70 pointer-events-none will-change-opacity"
      />
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,transparent_25%,#0a0b0d_95%)] pointer-events-none" />
      <div
        ref={darkRecedeOverlayRef}
        className="absolute inset-0 z-0 bg-[#0a0b0d] pointer-events-none will-change-opacity"
      />

      {/* Hero Content Layer */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-20 sm:pt-24 flex flex-col items-center">
        {/* Eyebrow badge */}
        <div
          ref={eyebrowRef}
          className="inline-flex items-center space-x-2.5 px-4 py-1.5 rounded-full bg-[#181b20] border border-white/15 mb-6 will-change-transform"
        >
          <span className="w-2 h-2 rounded-full bg-[#22c55e] animate-pulse" />
          <span className="text-[11px] sm:text-xs font-mono font-bold tracking-[0.25em] text-[#e2e8f0] uppercase">
            STRENGTH • PERFORMANCE • PRECISION
          </span>
        </div>

        {/* Main H1 Headline */}
        <h1
          ref={headlineRef}
          className="font-heading font-extrabold text-5xl sm:text-7xl md:text-8xl lg:text-9xl tracking-tighter text-white uppercase leading-[0.88] drop-shadow-2xl will-change-transform"
        >
          ONE REP MAX <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-200 to-slate-400">
            CALCULATOR
          </span>
        </h1>

        {/* Subtitle */}
        <p
          ref={subtitleRef}
          className="mt-6 text-base sm:text-xl text-[#cbd5e1] max-w-2xl font-normal leading-relaxed drop-shadow will-change-transform"
        >
          Estimate your maximum strength from the sets you already train with. Engineered with 7 scientific formulas and interactive barbell analytics.
        </p>

        {/* Interactive CTA Buttons */}
        <div
          ref={ctaRef}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto will-change-transform"
        >
          <button
            id="hero-primary-cta"
            onClick={() => onNavigate('/one-rep-max-calculator/')}
            className="w-full sm:w-auto px-9 py-4 rounded-full text-sm font-bold uppercase tracking-wider bg-[#22c55e] text-[#0a0b0d] hover:bg-[#4ade80] active:scale-95 transition-all shadow-[0_0_35px_-5px_rgba(34,197,94,0.55)] flex items-center justify-center space-x-2.5 group cursor-pointer"
          >
            <span>Calculate Your 1RM</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            id="hero-secondary-cta"
            onClick={onExploreClick}
            className="w-full sm:w-auto px-9 py-4 rounded-full text-sm font-bold uppercase tracking-wider bg-white/10 hover:bg-white/15 text-white border border-white/20 hover:border-white/40 backdrop-blur-md transition-all flex items-center justify-center space-x-2 cursor-pointer"
          >
            <span>Explore the Science</span>
          </button>
        </div>
      </div>

      {/* Floating Scroll Indicator */}
      <div
        ref={scrollIndicatorRef}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center space-y-2 pointer-events-none will-change-transform"
      >
        <span className="text-[10px] font-mono tracking-[0.25em] text-[#94a3b8] uppercase">
          SCROLL TO EXPLORE
        </span>
        <ChevronDown className="w-4 h-4 text-[#22c55e] animate-bounce" />
      </div>
    </section>
  );
};
