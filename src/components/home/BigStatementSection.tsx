import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const BigStatementSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const tagRef = useRef<HTMLDivElement>(null);
  const line1Ref = useRef<HTMLHeadingElement>(null);
  const line2Ref = useRef<HTMLHeadingElement>(null);
  const line3Ref = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const contentWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isReduced) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=130%',
          pin: true,
          scrub: 0.85,
          anticipatePin: 1,
        },
      });

      // Initial state: physically clipped & displaced
      gsap.set(tagRef.current, { opacity: 0, y: 30 });
      gsap.set(line1Ref.current, {
        opacity: 0,
        y: 70,
        scale: 0.94,
        clipPath: 'polygon(0 100%, 100% 100%, 100% 100%, 0 100%)',
      });
      gsap.set(line2Ref.current, {
        opacity: 0,
        y: 85,
        scale: 0.92,
        clipPath: 'polygon(0 100%, 100% 100%, 100% 100%, 0 100%)',
      });
      gsap.set(line3Ref.current, {
        opacity: 0,
        y: 100,
        scale: 0.9,
        letterSpacing: '-0.05em',
        clipPath: 'polygon(0 100%, 100% 100%, 100% 100%, 0 100%)',
      });
      gsap.set(descRef.current, { opacity: 0, y: 35 });
      gsap.set(badgeRef.current, { opacity: 0, scale: 0.88, y: 25 });
      gsap.set(contentWrapperRef.current, { scale: 1, opacity: 1, y: 0 });

      // Staggered physical construction along scroll progression
      // Step 1: Tag & Line 1 "YOUR"
      tl.to(
        tagRef.current,
        { opacity: 1, y: 0, duration: 0.18, ease: 'power2.out' },
        0
      )
        .to(
          line1Ref.current,
          {
            opacity: 1,
            y: 0,
            scale: 1,
            clipPath: 'polygon(0 0%, 100% 0%, 100% 100%, 0 100%)',
            duration: 0.32,
            ease: 'power3.out',
          },
          0.04
        )
        // Step 2: Line 2 "STRENGTH"
        .to(
          line2Ref.current,
          {
            opacity: 1,
            y: 0,
            scale: 1,
            clipPath: 'polygon(0 0%, 100% 0%, 100% 100%, 0 100%)',
            duration: 0.35,
            ease: 'power3.out',
          },
          0.16
        )
        // Step 3: Line 3 "HAS A NUMBER." expands & takes shape
        .to(
          line3Ref.current,
          {
            opacity: 1,
            y: 0,
            scale: 1,
            letterSpacing: '-0.035em',
            clipPath: 'polygon(0 0%, 100% 0%, 100% 100%, 0 100%)',
            duration: 0.38,
            ease: 'power3.out',
          },
          0.28
        )
        // Step 4: Supporting context & 1RM Neural Badge emerge
        .to(
          descRef.current,
          { opacity: 1, y: 0, duration: 0.28, ease: 'power2.out' },
          0.42
        )
        .to(
          badgeRef.current,
          { opacity: 1, scale: 1, y: 0, duration: 0.28, ease: 'back.out(1.4)' },
          0.46
        )
        // Step 5: Active hold & gradual transition out as calculator approaches
        .to(
          contentWrapperRef.current,
          {
            scale: 0.95,
            y: -30,
            opacity: 0.3,
            duration: 0.32,
            ease: 'power2.inOut',
          },
          0.72
        );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      id="statement-scene"
      className="h-screen w-full bg-[#f4f4f6] text-[#0a0b0d] flex items-center justify-center relative overflow-hidden select-none"
    >
      {/* Precision Architectural Grid Texture */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0000000a_1px,transparent_1px),linear-gradient(to_bottom,#0000000a_1px,transparent_1px)] bg-[size:4.5rem_4.5rem] pointer-events-none" />

      <div
        ref={contentWrapperRef}
        className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 w-full flex flex-col items-start justify-center relative z-10 will-change-transform"
      >
        {/* Section tag */}
        <div
          ref={tagRef}
          className="inline-flex items-center space-x-2.5 px-4 py-1.5 rounded-full bg-[#0a0b0d]/5 border border-[#0a0b0d]/10 mb-8 will-change-transform"
        >
          <span className="w-2 h-2 rounded-full bg-[#22c55e]" />
          <span className="text-xs font-mono font-extrabold uppercase tracking-[0.25em] text-[#475569]">
            01 / ABSOLUTE CAPACITY
          </span>
        </div>

        {/* Sculptural kinetic typography with clip containers */}
        <div className="space-y-1 sm:space-y-2 w-full">
          <div>
            <h2
              ref={line1Ref}
              className="font-heading font-extrabold text-5xl sm:text-7xl md:text-8xl lg:text-9xl tracking-tighter uppercase leading-[0.88] text-[#0a0b0d] will-change-transform"
            >
              YOUR
            </h2>
          </div>

          <div>
            <h2
              ref={line2Ref}
              className="font-heading font-extrabold text-5xl sm:text-7xl md:text-8xl lg:text-9xl tracking-tighter uppercase leading-[0.88] text-[#0a0b0d] will-change-transform"
            >
              STRENGTH
            </h2>
          </div>

          <div>
            <h2
              ref={line3Ref}
              className="font-heading font-extrabold text-5xl sm:text-7xl md:text-8xl lg:text-9xl tracking-tighter uppercase leading-[0.88] text-transparent bg-clip-text bg-gradient-to-r from-[#0a0b0d] via-[#1e293b] to-[#475569] will-change-transform"
            >
              HAS A NUMBER.
            </h2>
          </div>
        </div>

        {/* Supporting description & interactive badge */}
        <div className="mt-10 sm:mt-14 grid grid-cols-1 md:grid-cols-12 gap-8 items-end w-full">
          <p
            ref={descRef}
            className="md:col-span-8 text-lg sm:text-2xl text-[#334155] font-light leading-relaxed max-w-2xl will-change-transform"
          >
            Your One Rep Max is the absolute statistical boundary of what your neuromuscular system can lift for a single, full-range repetition.
          </p>

          <div
            ref={badgeRef}
            className="md:col-span-4 flex md:justify-end will-change-transform"
          >
            <div className="inline-flex items-center space-x-4 bg-[#0a0b0d] text-white px-7 py-5 rounded-2xl shadow-2xl border border-white/10">
              <div className="w-12 h-12 rounded-xl bg-[#22c55e]/15 border border-[#22c55e]/30 flex items-center justify-center">
                <span className="font-heading font-extrabold text-2xl text-[#22c55e]">1RM</span>
              </div>
              <div className="text-xs font-mono">
                <div className="text-[#94a3b8] tracking-wider text-[10px]">NEURAL CEILING</div>
                <div className="text-white font-bold tracking-wide">100% RECRUITMENT</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
