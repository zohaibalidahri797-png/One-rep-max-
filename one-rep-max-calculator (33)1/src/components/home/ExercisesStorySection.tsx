import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Dumbbell, ShieldCheck, Zap } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface ExercisesStorySectionProps {
  onNavigate: (path: string) => void;
}

const LIFTS = [
  {
    id: 'bench',
    num: '01',
    name: 'BARBELL BENCH PRESS',
    pattern: 'Horizontal Force Vector / Pectoral Girdle',
    optimalFormula: 'Mayhew Model (High Upper-Body Accuracy)',
    muscles: ['Pectoralis Major', 'Anterior Deltoid', 'Triceps Brachii'],
    cues: 'Scapular retraction, arched thoracic posture, controlled chest touch.',
    image: '/assets/hero_bench_press_poster_1788161169588.jpg',
  },
  {
    id: 'squat',
    num: '02',
    name: 'BARBELL BACK SQUAT',
    pattern: 'Knee Dominant / Quad & Gluteal Axis',
    optimalFormula: 'Epley Model (Optimal for Lower-Body Compound)',
    muscles: ['Quadriceps', 'Gluteus Maximus', 'Core & Spinal Erectors'],
    cues: 'Full femoral depth below parallel, braced intra-abdominal pressure.',
    image: '/assets/exercise_squat_1788161199567.jpg',
  },
  {
    id: 'deadlift',
    num: '03',
    name: 'CONVENTIONAL DEADLIFT',
    pattern: 'Posterior Chain / Hip Hinge Torque',
    optimalFormula: 'Lombardi Model (Conservative High-Rep Estimate)',
    muscles: ['Hamstrings', 'Gluteals', 'Latissimus Dorsi', 'Trapezius'],
    cues: 'Neutral spine lockout, wedge into bar, progressive leg drive.',
    image: '/assets/exercise_deadlift_1788161184578.jpg',
  },
  {
    id: 'ohp',
    num: '04',
    name: 'OVERHEAD PRESS',
    pattern: 'Vertical Force / Shoulder Articulation',
    optimalFormula: 'Brzycki Model (Strict Overhead Resistance)',
    muscles: ['Anterior & Lateral Deltoids', 'Triceps', 'Serratus Anterior'],
    cues: 'Strict upright posture, braced glutes, head through window at lockout.',
    image: '/assets/exercise_ohp_1788161214541.jpg',
  },
];

export const ExercisesStorySection: React.FC<ExercisesStorySectionProps> = ({ onNavigate }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeLiftIndex, setActiveLiftIndex] = useState(0);

  useEffect(() => {
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isReduced) return;

    const ctx = gsap.context(() => {
      const infoPanels = gsap.utils.toArray<HTMLElement>('.lift-info-panel');
      const imgPanels = gsap.utils.toArray<HTMLElement>('.lift-img-item');
      const total = LIFTS.length;

      // Initial layout states with subtle perspective and depth
      infoPanels.forEach((panel, i) => {
        if (i === 0) {
          gsap.set(panel, { opacity: 1, y: 0, zIndex: 10 });
        } else {
          gsap.set(panel, { opacity: 0, y: 35, zIndex: 10 + i });
        }
      });

      imgPanels.forEach((img, i) => {
        if (i === 0) {
          gsap.set(img, {
            opacity: 1,
            scale: 1,
            xPercent: 0,
            clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
            zIndex: 10,
          });
        } else {
          gsap.set(img, {
            opacity: 0,
            scale: 1.08,
            xPercent: 20,
            clipPath: 'polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)',
            zIndex: 10 + i,
          });
        }
      });

      let lastIdx = 0;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=210%',
          pin: true,
          scrub: 0.9,
          anticipatePin: 1,
          onUpdate: (self) => {
            const idx = Math.min(Math.floor(self.progress * total), total - 1);
            if (idx !== lastIdx) {
              lastIdx = idx;
              setActiveLiftIndex(idx);
            }
          },
        },
      });

      const stepDuration = 1 / (total - 1);

      for (let i = 1; i < total; i++) {
        const startTime = (i - 1) * stepDuration;
        const prevPanel = infoPanels[i - 1];
        const curPanel = infoPanels[i];
        const prevImg = imgPanels[i - 1];
        const curImg = imgPanels[i];

        // Lift text editorial transition
        tl.to(
          prevPanel,
          { opacity: 0, y: -30, duration: stepDuration * 0.7, ease: 'power2.inOut' },
          startTime
        ).to(
          curPanel,
          { opacity: 1, y: 0, duration: stepDuration * 0.7, ease: 'power2.out' },
          startTime + stepDuration * 0.15
        );

        // Sports campaign imagery transition:
        // Next image starts clipping in and scaling down from 1.08 to 1.0 BEFORE the previous image completely recedes!
        tl.to(
          curImg,
          {
            opacity: 1,
            scale: 1,
            xPercent: 0,
            clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
            duration: stepDuration * 0.9,
            ease: 'power2.out',
          },
          startTime
        ).to(
          prevImg,
          {
            opacity: 0.2,
            scale: 0.94,
            xPercent: -15,
            duration: stepDuration * 0.7,
            ease: 'power2.inOut',
          },
          startTime + stepDuration * 0.1
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      id="exercises-scene"
      className="h-screen w-full bg-[#0a0b0d] flex items-center justify-center relative overflow-hidden px-4 sm:px-6 lg:px-8 select-none"
    >
      <div className="max-w-7xl mx-auto w-full flex flex-col justify-center h-full max-h-[860px]">
        {/* Top bar with quick lift selector pills */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
          <div className="flex items-center space-x-2">
            <Dumbbell className="w-4 h-4 text-[#22c55e]" />
            <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#94a3b8]">
              EDITORIAL CAMPAIGN • THE BIG 4
            </span>
          </div>

          {/* Lift Indicator Pills */}
          <div className="flex items-center space-x-2">
            {LIFTS.map((lift, i) => (
              <span
                key={lift.id}
                className={`px-3 py-1 rounded-full text-xs font-mono font-bold transition-all ${
                  activeLiftIndex === i
                    ? 'bg-[#22c55e] text-[#0a0b0d] shadow-[0_0_15px_rgba(34,197,94,0.4)]'
                    : 'bg-white/5 text-[#64748b] border border-white/10'
                }`}
              >
                {lift.num}
              </span>
            ))}
          </div>
        </div>

        {/* Main 2-Column Split: Editorial Information + Cinematic Visual */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center flex-1 min-h-0">
          {/* Left Column: Lift Information Panels (Synchronized Stacking) */}
          <div className="lg:col-span-6 relative h-[360px] sm:h-[420px] flex items-center">
            {LIFTS.map((lift) => (
              <div
                key={lift.id}
                className="lift-info-panel absolute inset-0 flex flex-col justify-center will-change-transform"
              >
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <span className="font-heading font-extrabold text-4xl sm:text-5xl text-[#22c55e]/90 font-mono-num">
                      {lift.num}
                    </span>
                    <span className="text-xs font-mono uppercase tracking-widest text-[#94a3b8] px-3 py-1 rounded-full bg-white/5 border border-white/10">
                      {lift.pattern}
                    </span>
                  </div>

                  <h3 className="font-heading font-extrabold text-3xl sm:text-5xl lg:text-6xl text-white uppercase tracking-tight leading-[0.92]">
                    {lift.name}
                  </h3>

                  <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-xl bg-[#22c55e]/10 border border-[#22c55e]/25 text-[#22c55e] text-xs font-mono font-semibold">
                    <Zap className="w-3.5 h-3.5 shrink-0" />
                    <span>{lift.optimalFormula}</span>
                  </div>

                  <div className="space-y-2 pt-2">
                    <div className="text-xs font-mono text-[#64748b] uppercase tracking-wider">
                      Target Neuromuscular Drivers
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {lift.muscles.map((muscle) => (
                        <span
                          key={muscle}
                          className="text-xs font-mono px-3 py-1 rounded-lg bg-[#14171e] text-[#e2e8f0] border border-white/10"
                        >
                          {muscle}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#14171e]/70 border border-white/10 text-xs text-[#cbd5e1] leading-relaxed flex items-start space-x-2.5">
                    <ShieldCheck className="w-4 h-4 text-[#22c55e] shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-white font-semibold">Biomechanics Cue: </strong>
                      {lift.cues}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right Column: Full-Bleed Cinematic Lift Imagery (Sports Campaign Transition) */}
          <div
            style={{ perspective: '1200px' }}
            className="lg:col-span-6 relative h-[300px] sm:h-[420px] rounded-3xl overflow-hidden border border-white/15 bg-[#0e1015] shadow-[0_25px_70px_-15px_rgba(0,0,0,0.95)]"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0b0d] via-transparent to-[#0a0b0d]/40 z-20 pointer-events-none" />

            {LIFTS.map((lift) => (
              <div
                key={lift.id}
                className="lift-img-item absolute inset-0 w-full h-full will-change-transform"
              >
                <img
                  src={lift.image}
                  alt={lift.name}
                  className="w-full h-full object-cover object-center"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono text-[#94a3b8]">
          <span>SCROLL TO ADVANCE COMPOUND EXERCISES</span>
          <button
            onClick={() => onNavigate('/one-rep-max-calculator/')}
            className="text-[#22c55e] hover:text-[#4ade80] font-bold flex items-center space-x-1.5 cursor-pointer"
          >
            <span>Calculate 1RM for this lift</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </section>
  );
};
