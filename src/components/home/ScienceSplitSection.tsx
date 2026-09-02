import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Activity, ShieldCheck, Zap, Scale, HeartPulse, Brain } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const SCIENCE_MODULES = [
  {
    num: '01',
    icon: <Brain className="w-5 h-5 text-[#22c55e]" />,
    title: 'What is a One Rep Max?',
    content:
      'The absolute mathematical ceiling of force that a musculoskeletal system can produce against an external resistance for a solitary, technically valid repetition through full joint articulation.',
  },
  {
    num: '02',
    icon: <ShieldCheck className="w-5 h-5 text-[#22c55e]" />,
    title: 'Why Estimate Instead of Direct Testing?',
    content:
      'Direct 1RM testing imposes acute central nervous system (CNS) exhaustion, high axial fatigue, and elevated connective tissue strain. Submaximal estimation from 2–6 repetitions delivers 97%+ precision with near-zero injury risk.',
  },
  {
    num: '03',
    icon: <Activity className="w-5 h-5 text-[#22c55e]" />,
    title: 'Neuromuscular Motor Unit Recruitment',
    content:
      'Submaximal models correlate fatigue velocity with high-threshold Type IIx muscle fiber recruitment. As fatigue accumulates, the rate of force decay projects your asymptote at 100% capacity.',
  },
  {
    num: '04',
    icon: <Scale className="w-5 h-5 text-[#22c55e]" />,
    title: 'Repetition Window Accuracy',
    content:
      'Sets between 2 and 6 reps exhibit the lowest statistical deviance (under 1.8% error). Sets above 10 reps become confounded by anaerobic glycolysis, cardiovascular conditioning, and local muscular endurance.',
  },
  {
    num: '05',
    icon: <Zap className="w-5 h-5 text-[#22c55e]" />,
    title: 'Percentage-Based Training (PBT)',
    content:
      'Establishing an accurate 1RM unlocks periodized load prescription. Coaches program precise zones—such as 85% for myofibrillar hypertrophy or 65% for dynamic speed work—without guesswork.',
  },
  {
    num: '06',
    icon: <HeartPulse className="w-5 h-5 text-[#22c55e]" />,
    title: 'Biological & Daily Variance',
    content:
      'Submaximal formulas assume pristine form and consistent bar velocity. Daily sleep debt, hydration, nutrition, and psychological arousal introduce standard biological strength fluctuations of 2% to 4%.',
  },
];

export const ScienceSplitSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rightColRef = useRef<HTMLDivElement>(null);
  const [activeModule, setActiveModule] = useState(0);

  useEffect(() => {
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isReduced) return;

    const ctx = gsap.context(() => {
      const moduleCards = gsap.utils.toArray<HTMLElement>('.science-module-item');
      const total = SCIENCE_MODULES.length;

      // Animate cards on scroll entrance with subtle depth and scale
      moduleCards.forEach((card, idx) => {
        gsap.fromTo(
          card,
          { opacity: 0.35, y: 40, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 80%',
              end: 'top 45%',
              scrub: 0.6,
            },
          }
        );
      });

      // Update sticky neural recruitment indicator on scroll
      let lastMod = 0;
      ScrollTrigger.create({
        trigger: rightColRef.current,
        start: 'top center+=120',
        end: 'bottom center',
        onUpdate: (self) => {
          const mod = Math.min(Math.floor(self.progress * total), total - 1);
          if (mod !== lastMod) {
            lastMod = mod;
            setActiveModule(mod);
          }
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      id="science-section"
      className="py-28 sm:py-36 px-4 sm:px-6 lg:px-8 border-t border-white/10 bg-[#0c0e12] relative"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Sticky Title & Scientific Gauge */}
          <div className="lg:col-span-5 lg:sticky lg:top-28 space-y-8 select-none">
            <div className="space-y-4">
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#181b20] border border-[#22c55e]/20 text-[#22c55e] text-xs font-mono font-bold tracking-[0.2em] uppercase">
                <Activity className="w-3.5 h-3.5" />
                <span>EXERCISE PHYSIOLOGY</span>
              </div>

              <h2 className="font-heading font-extrabold text-4xl sm:text-6xl uppercase tracking-tight text-white leading-none">
                THE SCIENCE <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-200 to-slate-400">
                  OF 1RM
                </span>
              </h2>

              <p className="text-base text-[#94a3b8] leading-relaxed">
                Understanding the neuromuscular motor recruitment, fatigue decay curves, and mathematical statistics governing human maximal force output.
              </p>
            </div>

            {/* Neural Recruitment Visual Dial Box */}
            <div className="bg-[#111317] border border-white/10 rounded-2xl p-6 space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-[#94a3b8] uppercase">Neural Recruitment</span>
                <span className="text-xs font-mono text-[#22c55e] font-bold">
                  {Math.round(((activeModule + 1) / 6) * 100)}% Type IIx
                </span>
              </div>
              <div className="w-full h-3 bg-[#0a0b0d] rounded-full overflow-hidden p-0.5 border border-white/5">
                <div
                  className="h-full bg-gradient-to-r from-[#15803d] via-[#22c55e] to-[#4ade80] rounded-full transition-all duration-300"
                  style={{ width: `${((activeModule + 1) / 6) * 100}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] font-mono text-[#64748b]">
                <span>Type I (Endurance)</span>
                <span>Type IIa</span>
                <span>Type IIx (Max Force)</span>
              </div>
            </div>
          </div>

          {/* Right Column: Scrolling Educational Modules */}
          <div ref={rightColRef} className="lg:col-span-7 space-y-6">
            {SCIENCE_MODULES.map((mod, idx) => {
              const isActive = idx === activeModule;
              return (
                <div
                  key={mod.num}
                  className={`science-module-item transition-all duration-300 rounded-3xl p-7 sm:p-9 border will-change-transform ${
                    isActive
                      ? 'bg-[#12151b] border-[#22c55e]/50 shadow-2xl ring-1 ring-[#22c55e]/25'
                      : 'bg-[#0f1116] border-white/10 opacity-75 hover:opacity-95'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2.5 rounded-xl bg-[#181b20] border border-white/10">
                        {mod.icon}
                      </div>
                      <span className="text-xs font-mono font-bold text-[#64748b]">
                        MODULE {mod.num} / 06
                      </span>
                    </div>
                    {isActive && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#22c55e]/15 text-[#22c55e] font-bold">
                        ACTIVE TOPIC
                      </span>
                    )}
                  </div>

                  <h3 className="mt-4 font-heading font-bold text-2xl sm:text-3xl text-white">
                    {mod.title}
                  </h3>

                  <p className="mt-3 text-sm sm:text-base text-[#94a3b8] leading-relaxed">
                    {mod.content}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
