import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Code2, Layers, ChevronRight, ShieldCheck } from 'lucide-react';
import { FORMULAS_DATA } from '../../utils/calculator';

gsap.registerPlugin(ScrollTrigger);

interface FormulasStorySectionProps {
  onNavigate: (path: string) => void;
}

export const FormulasStorySection: React.FC<FormulasStorySectionProps> = ({ onNavigate }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const formulaNumRef = useRef<HTMLSpanElement>(null);
  const formulaNameRef = useRef<HTMLDivElement>(null);
  const formulaTypeRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isReduced) return;

    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>('.formula-deck-card');
      const total = cards.length;
      if (total === 0) return;

      // Define standard 3D depth slot presets
      const getSlotStyle = (slotIndex: number) => {
        if (slotIndex === 0) {
          return {
            opacity: 1,
            scale: 1,
            y: 0,
            z: 0,
            rotateX: 0,
            rotateY: 0,
            zIndex: 40,
            filter: 'brightness(1)',
            pointerEvents: 'auto' as const,
          };
        } else if (slotIndex === 1) {
          return {
            opacity: 0.72,
            scale: 0.92,
            y: 28,
            z: -85,
            rotateX: -5,
            rotateY: 0,
            zIndex: 30,
            filter: 'brightness(0.75)',
            pointerEvents: 'none' as const,
          };
        } else if (slotIndex === 2) {
          return {
            opacity: 0.4,
            scale: 0.84,
            y: 56,
            z: -170,
            rotateX: -9,
            rotateY: 0,
            zIndex: 20,
            filter: 'brightness(0.55)',
            pointerEvents: 'none' as const,
          };
        } else if (slotIndex === 3) {
          return {
            opacity: 0.18,
            scale: 0.76,
            y: 82,
            z: -250,
            rotateX: -13,
            rotateY: 0,
            zIndex: 10,
            filter: 'brightness(0.38)',
            pointerEvents: 'none' as const,
          };
        } else {
          return {
            opacity: 0,
            scale: 0.68,
            y: 105,
            z: -330,
            rotateX: -16,
            rotateY: 0,
            zIndex: 1,
            filter: 'brightness(0.2)',
            pointerEvents: 'none' as const,
          };
        }
      };

      // Set initial staggered 3D stack configuration
      cards.forEach((card, idx) => {
        gsap.set(card, {
          transformPerspective: 1200,
          transformStyle: 'preserve-3d',
          ...getSlotStyle(idx),
        });
      });

      let lastActiveIdx = 0;

      // Master ScrollTrigger Timeline for 3D Stack Transition
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=220%',
          pin: true,
          scrub: 0.9,
          anticipatePin: 1,
          onUpdate: (self) => {
            const currentIdx = Math.min(
              Math.floor(self.progress * total),
              total - 1
            );
            if (currentIdx !== lastActiveIdx) {
              lastActiveIdx = currentIdx;
              if (formulaNumRef.current) {
                formulaNumRef.current.textContent = `0${currentIdx + 1} / 07`;
              }
              if (formulaNameRef.current) {
                formulaNameRef.current.textContent = FORMULAS_DATA[currentIdx]?.name || '';
              }
              if (formulaTypeRef.current) {
                formulaTypeRef.current.textContent = FORMULAS_DATA[currentIdx]?.author || 'Validated Model';
              }
            }
          },
        },
      });

      // Progress bar fill across full scroll duration
      if (progressBarRef.current) {
        tl.to(progressBarRef.current, { scaleX: 1, ease: 'none', duration: 1 }, 0);
      }

      // Choreograph step-by-step 3D slot transitions
      const stepDuration = 1 / (total - 1);

      for (let i = 0; i < total - 1; i++) {
        const startTime = i * stepDuration;
        const currentCard = cards[i];
        const card1 = cards[i + 1];
        const card2 = i + 2 < total ? cards[i + 2] : null;
        const card3 = i + 3 < total ? cards[i + 3] : null;
        const card4 = i + 4 < total ? cards[i + 4] : null;

        // Current active card exits: Glides upward, tilts back into spatial depth and fades
        tl.to(
          currentCard,
          {
            opacity: 0,
            scale: 0.88,
            y: -70,
            z: -140,
            rotateX: 7,
            filter: 'brightness(0.4)',
            duration: stepDuration * 0.88,
            ease: 'power2.inOut',
          },
          startTime
        );

        // Next card glides forward from Slot 1 into active Slot 0 (Dominant front card)
        tl.to(
          card1,
          {
            opacity: 1,
            scale: 1,
            y: 0,
            z: 0,
            rotateX: 0,
            filter: 'brightness(1)',
            zIndex: 40 + (i + 1) * 2,
            duration: stepDuration * 0.88,
            ease: 'power2.out',
          },
          startTime + stepDuration * 0.04
        );

        // 3rd card advances from Slot 2 to Slot 1 (Clearly visible behind front card)
        if (card2) {
          tl.to(
            card2,
            {
              opacity: 0.72,
              scale: 0.92,
              y: 28,
              z: -85,
              rotateX: -5,
              filter: 'brightness(0.75)',
              zIndex: 30 + (i + 1) * 2,
              duration: stepDuration * 0.88,
              ease: 'power2.out',
            },
            startTime + stepDuration * 0.04
          );
        }

        // 4th card advances from Slot 3 to Slot 2
        if (card3) {
          tl.to(
            card3,
            {
              opacity: 0.4,
              scale: 0.84,
              y: 56,
              z: -170,
              rotateX: -9,
              filter: 'brightness(0.55)',
              zIndex: 20 + (i + 1) * 2,
              duration: stepDuration * 0.88,
              ease: 'power2.out',
            },
            startTime + stepDuration * 0.04
          );
        }

        // 5th card emerges from deep stack into Slot 3
        if (card4) {
          tl.to(
            card4,
            {
              opacity: 0.18,
              scale: 0.76,
              y: 82,
              z: -250,
              rotateX: -13,
              filter: 'brightness(0.38)',
              zIndex: 10 + (i + 1) * 2,
              duration: stepDuration * 0.88,
              ease: 'power2.out',
            },
            startTime + stepDuration * 0.04
          );
        }
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      id="formulas-scene"
      className="h-screen w-full bg-[#0a0b0d] flex items-center justify-center relative overflow-hidden px-4 sm:px-6 lg:px-8 select-none"
    >
      {/* Precision 3D Spatial Grid & Glow Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(34,197,94,0.08)_0%,transparent_68%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none opacity-40" />

      <div className="max-w-6xl mx-auto w-full flex flex-col items-center relative z-10">
        {/* Section Header with live 3D deck counter and continuous progress */}
        <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 sm:mb-8 pb-4 border-b border-white/10">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-[#22c55e]/15 border border-[#22c55e]/30 flex items-center justify-center text-[#22c55e]">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#94a3b8]">
                SCIENTIFIC FORMULA DECK
              </div>
              <h2 className="font-heading font-extrabold text-xl sm:text-2xl text-white uppercase tracking-tight">
                7 Peer-Reviewed Equations
              </h2>
            </div>
          </div>

          {/* Dynamic Step indicator & Progress bar */}
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <span ref={formulaNumRef} className="text-xs font-mono font-bold text-[#22c55e]">
                01 / 07
              </span>
              <div ref={formulaNameRef} className="text-xs font-heading font-bold text-white uppercase truncate max-w-[170px]">
                {FORMULAS_DATA[0]?.name}
              </div>
            </div>
            <div className="w-24 sm:w-36 h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div
                ref={progressBarRef}
                className="h-full bg-[#22c55e] origin-left scale-x-0 will-change-transform"
              />
            </div>
          </div>
        </div>

        {/* 3D Perspective Card Stage with preserve-3d and shadow anchor */}
        <div
          style={{ perspective: '1200px', transformStyle: 'preserve-3d' }}
          className="relative w-full max-w-2xl h-[390px] sm:h-[420px] flex items-center justify-center"
        >
          {/* Spatial Floor Shadow Under Stack */}
          <div
            className="absolute -bottom-8 w-4/5 h-12 bg-black/80 rounded-full blur-xl pointer-events-none"
            style={{ transform: 'rotateX(80deg) translateZ(-60px)' }}
          />

          {FORMULAS_DATA.map((formula, idx) => {
            return (
              <div
                key={formula.id}
                data-index={idx}
                className="formula-deck-card absolute inset-0 w-full h-full bg-gradient-to-b from-[#14171f] to-[#0c0e12] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-[0_30px_70px_-15px_rgba(0,0,0,0.95)] flex flex-col justify-between will-change-transform backdrop-blur-md"
                style={{ transformStyle: 'preserve-3d' }}
              >
                {/* Card Top Row */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono px-3 py-1 rounded-full bg-white/10 text-white font-bold tracking-wider">
                      0{idx + 1} OF 07
                    </span>
                    <span className="text-xs font-mono text-[#22c55e] font-semibold flex items-center space-x-1">
                      <ShieldCheck className="w-3.5 h-3.5 mr-1" />
                      Validated Equation
                    </span>
                  </div>

                  <div className="flex items-baseline justify-between mb-2">
                    <h3 className="font-heading font-extrabold text-2xl sm:text-3xl text-white uppercase tracking-tight">
                      {formula.name}
                    </h3>
                    <span className="text-xs font-mono text-[#94a3b8]">{formula.year}</span>
                  </div>

                  <p className="text-sm text-[#cbd5e1] font-normal leading-relaxed line-clamp-2 sm:line-clamp-3">
                    {formula.description}
                  </p>
                </div>

                {/* Mathematical Equation Readout */}
                <div className="bg-[#08090c] border border-white/10 rounded-2xl p-4 sm:p-5 my-3 font-mono text-sm sm:text-base text-[#22c55e] flex items-center justify-between shadow-inner">
                  <div className="flex items-center space-x-3 truncate">
                    <Code2 className="w-4 h-4 text-[#64748b] shrink-0" />
                    <span className="font-bold tracking-wide truncate">
                      {formula.formulaDisplay}
                    </span>
                  </div>
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-[#22c55e]/15 text-[#22c55e] shrink-0 ml-2">
                    {formula.repRange || '1-10 Reps'}
                  </span>
                </div>

                {/* Card Footer Breakdown */}
                <div className="grid grid-cols-2 gap-4 pt-3 border-t border-white/10 text-xs">
                  <div>
                    <span className="text-[#64748b] font-mono text-[10px] uppercase tracking-wider block">
                      Optimal Application
                    </span>
                    <span className="text-white font-semibold truncate block">
                      {formula.bestFor}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#64748b] font-mono text-[10px] uppercase tracking-wider block">
                      Primary Author
                    </span>
                    <span className="text-[#94a3b8] font-semibold truncate block">
                      {formula.author}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Navigation Link */}
        <div className="mt-8">
          <button
            onClick={() => onNavigate('/one-rep-max-calculator/')}
            className="inline-flex items-center space-x-2 text-xs font-mono uppercase tracking-[0.2em] text-[#94a3b8] hover:text-[#22c55e] transition-colors group cursor-pointer"
          >
            <span>Compare all 7 equations in the active calculator</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
};
