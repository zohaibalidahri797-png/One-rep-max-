import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Layers, CheckCircle2, Sliders, Cpu, ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const PROTOCOL_STEPS = [
  {
    step: '01',
    phaseName: 'PHASE 01: INPUT METRICS',
    title: 'ENTER YOUR SUBMAXIMAL SET',
    description:
      'Input the working weight and completed repetitions from a clean training set performed with pristine biomechanical technique.',
    detail: 'Optimal statistical window: 2 to 6 repetitions without technical breakdown.',
    icon: <Sliders className="w-6 h-6 text-[#22c55e]" />,
    metricHighlight: 'WORKING LOAD & REPS',
  },
  {
    step: '02',
    phaseName: 'PHASE 02: MATHEMATICAL CALIBRATION',
    title: 'SELECT SCIENTIFIC FORMULA',
    description:
      'Select a peer-reviewed equation tailored for your movement pattern—or apply the 7-Formula Scientific Mean for smooth statistical consensus.',
    detail: 'Epley for Squats, Mayhew for Bench, Lombardi for Deadlifts, or all 7 combined.',
    icon: <Cpu className="w-6 h-6 text-[#22c55e]" />,
    metricHighlight: '7 PEER-REVIEWED MODELS',
  },
  {
    step: '03',
    phaseName: 'PHASE 03: STRENGTH ANALYTICS',
    title: 'ACQUIRE 1RM & TRAINING ZONES',
    description:
      'Instantly receive your estimated single-rep peak along with 1RM–15RM matrix tables, Olympic barbell plate distributions, and progressive warm-up ladders.',
    detail: 'Export training percentages directly into your periodized programming cycles.',
    icon: <CheckCircle2 className="w-6 h-6 text-[#22c55e]" />,
    metricHighlight: '100% NEURAL CAPACITY',
  },
];

export const HowItWorksSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const bigNumRef = useRef<HTMLDivElement>(null);
  const phaseTagRef = useRef<HTMLSpanElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const detailRef = useRef<HTMLParagraphElement>(null);
  const metricHighlightRef = useRef<HTMLSpanElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  useEffect(() => {
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isReduced) return;

    const ctx = gsap.context(() => {
      const total = PROTOCOL_STEPS.length;

      let lastIdx = 0;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=150%',
          pin: true,
          scrub: 0.85,
          anticipatePin: 1,
          onUpdate: (self) => {
            const idx = Math.min(Math.floor(self.progress * total), total - 1);
            if (idx !== lastIdx) {
              lastIdx = idx;
              setActiveStepIndex(idx);

              // Dynamic state text update
              const stepData = PROTOCOL_STEPS[idx];
              if (bigNumRef.current) bigNumRef.current.textContent = stepData.step;
              if (phaseTagRef.current) phaseTagRef.current.textContent = stepData.phaseName;
              if (titleRef.current) titleRef.current.textContent = stepData.title;
              if (descRef.current) descRef.current.textContent = stepData.description;
              if (detailRef.current) detailRef.current.textContent = stepData.detail;
              if (metricHighlightRef.current) metricHighlightRef.current.textContent = stepData.metricHighlight;
            }
          },
        },
      });

      // Continuous timeline progress bar
      if (progressBarRef.current) {
        tl.to(progressBarRef.current, { scaleX: 1, ease: 'none', duration: 1 }, 0);
      }

      // Morph transitions between 01 -> 02 -> 03
      const stepDuration = 1 / (total - 1);

      for (let i = 1; i < total; i++) {
        const transitionPoint = (i - 0.5) * (1 / total);

        tl.to(
          bigNumRef.current,
          {
            scale: 0.82,
            opacity: 0.2,
            y: -20,
            duration: 0.1,
            ease: 'power2.in',
          },
          transitionPoint - 0.05
        ).to(
          bigNumRef.current,
          {
            scale: 1,
            opacity: 1,
            y: 0,
            duration: 0.1,
            ease: 'back.out(1.5)',
          },
          transitionPoint + 0.05
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      id="how-it-works-scene"
      className="h-screen w-full bg-[#0a0b0d] flex items-center justify-center relative overflow-hidden px-4 sm:px-6 lg:px-8 select-none"
    >
      {/* Background ambient lighting */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(34,197,94,0.07)_0%,transparent_75%)] pointer-events-none" />

      <div className="max-w-5xl mx-auto w-full flex flex-col items-center justify-center relative z-10">
        {/* Section Tag */}
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#181b20] border border-white/10 mb-8">
          <Layers className="w-3.5 h-3.5 text-[#22c55e]" />
          <span className="text-xs font-mono font-bold tracking-[0.25em] text-[#94a3b8] uppercase">
            3-STEP SYSTEM PROTOCOL
          </span>
        </div>

        {/* Central Transforming Unified Frame */}
        <div className="w-full bg-[#101318] border border-white/15 rounded-3xl p-8 sm:p-12 shadow-[0_30px_90px_-20px_rgba(0,0,0,0.95)] relative overflow-hidden">
          {/* Header row with step tracker & live metric highlight */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-6 mb-8">
            <div className="flex items-center space-x-3">
              <span
                ref={phaseTagRef}
                className="text-xs font-mono font-bold uppercase tracking-wider text-[#22c55e]"
              >
                {PROTOCOL_STEPS[0].phaseName}
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-mono text-[#64748b] uppercase tracking-wider">
                CORE SYSTEM TARGET:
              </span>
              <span
                ref={metricHighlightRef}
                className="text-xs font-mono font-bold text-white px-2.5 py-1 rounded-md bg-white/10"
              >
                {PROTOCOL_STEPS[0].metricHighlight}
              </span>
            </div>
          </div>

          {/* Core Transforming Stage: Huge State-Morphing Number & Content */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center">
            {/* Morphing Number Canvas */}
            <div className="md:col-span-4 flex flex-col items-center justify-center py-4 bg-[#0a0b0d] rounded-2xl border border-white/10 shadow-inner">
              <div
                ref={bigNumRef}
                className="font-heading font-extrabold text-7xl sm:text-9xl text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-200 to-[#22c55e] leading-none tracking-tighter will-change-transform"
              >
                01
              </div>
              <span className="text-[10px] font-mono text-[#64748b] tracking-widest uppercase mt-2">
                ACTIVE STAGE
              </span>
            </div>

            {/* Transforming Contextual Breakdown */}
            <div className="md:col-span-8 space-y-4">
              <h3
                ref={titleRef}
                className="font-heading font-extrabold text-2xl sm:text-4xl text-white uppercase tracking-tight leading-tight"
              >
                {PROTOCOL_STEPS[0].title}
              </h3>

              <p
                ref={descRef}
                className="text-base sm:text-lg text-[#cbd5e1] font-normal leading-relaxed"
              >
                {PROTOCOL_STEPS[0].description}
              </p>

              <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-start space-x-3">
                <CheckCircle2 className="w-5 h-5 text-[#22c55e] shrink-0 mt-0.5" />
                <p ref={detailRef} className="text-xs sm:text-sm text-[#94a3b8] leading-relaxed">
                  {PROTOCOL_STEPS[0].detail}
                </p>
              </div>
            </div>
          </div>

          {/* Continuous Interactive Stage Progress Markers */}
          <div className="mt-10 pt-6 border-t border-white/10 space-y-3">
            <div className="flex justify-between items-center text-xs font-mono">
              <div className="flex space-x-6">
                {PROTOCOL_STEPS.map((step, idx) => (
                  <span
                    key={step.step}
                    className={`transition-colors font-bold ${
                      activeStepIndex === idx ? 'text-[#22c55e]' : 'text-[#64748b]'
                    }`}
                  >
                    {step.step}. {step.title.split(' ')[0]}
                  </span>
                ))}
              </div>
              <span className="text-[#94a3b8] hidden sm:inline">
                SCROLL TO ADVANCE STATE
              </span>
            </div>

            {/* Bottom Progress Track */}
            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div
                ref={progressBarRef}
                className="h-full bg-[#22c55e] origin-left scale-x-0 will-change-transform"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
