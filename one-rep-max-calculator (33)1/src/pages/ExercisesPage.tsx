import React, { useState } from 'react';
import { EXERCISES } from '../utils/constants';
import { Dumbbell, ArrowRight, ShieldCheck, Target, ChevronRight, Check } from 'lucide-react';

interface ExercisesPageProps {
  onNavigate: (path: string) => void;
  onSelectExerciseToCalculate?: (exerciseId: string) => void;
}

export const ExercisesPage: React.FC<ExercisesPageProps> = ({ onNavigate, onSelectExerciseToCalculate }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Upper Body Push', 'Lower Body Quad', 'Lower Body Posterior', 'Upper Body Pull'];

  const filtered = selectedCategory === 'All'
    ? EXERCISES
    : EXERCISES.filter((e) => e.category === selectedCategory);

  const handleCalculateExercise = (exId: string) => {
    if (onSelectExerciseToCalculate) {
      onSelectExerciseToCalculate(exId);
    }
    onNavigate('/one-rep-max-calculator/');
  };

  return (
    <div className="w-full bg-[#0a0b0d] text-[#f7f7f8] pt-24 pb-28 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="border-b border-white/10 pb-8 space-y-4">
          <div className="flex items-center space-x-2 text-xs font-mono text-[#94a3b8]">
            <button onClick={() => onNavigate('/')} className="hover:text-white">Home</button>
            <ChevronRight className="w-3.5 h-3.5 text-[#64748b]" />
            <span className="text-[#22c55e] font-bold">Exercises & Movement Standards</span>
          </div>

          <h1 className="font-heading font-extrabold text-4xl sm:text-5xl lg:text-6xl uppercase tracking-tight text-white">
            Major Lifts & Biomechanics
          </h1>
          <p className="text-base sm:text-lg text-[#94a3b8] max-w-3xl leading-relaxed">
            Biomechanical cues, prime movers, formula recommendations, and 1RM optimization protocols for the most foundational barbell compound movements.
          </p>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-2 pt-4">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-mono font-bold transition-all ${
                  selectedCategory === cat
                    ? 'bg-[#22c55e] text-[#0a0b0d] shadow-lg shadow-[#22c55e]/20'
                    : 'bg-[#181b20] text-[#94a3b8] hover:text-white border border-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Exercises Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((ex) => (
            <div
              key={ex.id}
              className="bg-[#111317] border border-white/10 hover:border-[#22c55e]/40 rounded-2xl overflow-hidden flex flex-col justify-between transition-all group"
            >
              {/* Image Banner if exists */}
              {ex.image && (
                <div className="h-48 w-full overflow-hidden relative">
                  <img
                    src={ex.image}
                    alt={ex.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-70"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#111317] to-transparent" />
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md text-[10px] font-mono font-bold uppercase bg-[#0a0b0d]/80 text-[#22c55e] border border-white/10 backdrop-blur">
                    {ex.category}
                  </span>
                </div>
              )}

              <div className="p-6 space-y-4 flex-1">
                <div>
                  <h3 className="font-heading font-bold text-2xl text-white group-hover:text-[#22c55e] transition-colors">
                    {ex.name}
                  </h3>
                  <p className="text-xs text-[#94a3b8] mt-2 leading-relaxed">
                    {ex.description}
                  </p>
                </div>

                {/* Primary Muscles */}
                <div className="space-y-1.5 pt-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#64748b]">
                    Primary Muscles Recruited
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {ex.primaryMuscles.map((muscle) => (
                      <span
                        key={muscle}
                        className="px-2 py-0.5 rounded bg-white/5 text-[#cbd5e1] text-[11px] font-mono"
                      >
                        {muscle}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Technical Cues */}
                <div className="space-y-1.5 pt-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#64748b]">
                    Technical Execution Keys
                  </span>
                  <ul className="space-y-1 text-xs text-[#94a3b8]">
                    {ex.cues.map((cue, i) => (
                      <li key={i} className="flex items-start space-x-2">
                        <Check className="w-3.5 h-3.5 text-[#22c55e] shrink-0 mt-0.5" />
                        <span>{cue}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Bottom Action */}
              <div className="p-6 pt-0 border-t border-white/5 mt-4">
                <button
                  type="button"
                  onClick={() => handleCalculateExercise(ex.id)}
                  className="w-full py-3 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#181b20] hover:bg-[#22c55e] text-white hover:text-[#0a0b0d] border border-white/10 hover:border-[#22c55e] transition-all flex items-center justify-center space-x-2"
                >
                  <span>Calculate {ex.name.split(' ')[0]} 1RM</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
