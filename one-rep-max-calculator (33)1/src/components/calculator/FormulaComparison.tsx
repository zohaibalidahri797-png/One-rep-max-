import React from 'react';
import { FormulaType, WeightUnit } from '../../types';
import { FORMULAS_DATA, calculateFormula1RM } from '../../utils/calculator';
import { BookOpen, Check, Award, Compass, HelpCircle } from 'lucide-react';

interface FormulaComparisonProps {
  weight: number;
  reps: number;
  unit: WeightUnit;
  activeFormula: FormulaType;
  onSelectFormula: (f: FormulaType) => void;
}

export const FormulaComparison: React.FC<FormulaComparisonProps> = ({
  weight,
  reps,
  unit,
  activeFormula,
  onSelectFormula,
}) => {
  const calculations = FORMULAS_DATA.map((f) => {
    const val = calculateFormula1RM(weight, reps, f.id);
    return {
      ...f,
      calculated1RM: val,
    };
  });

  const allValues = calculations.map((c) => c.calculated1RM);
  const minVal = Math.min(...allValues);
  const maxVal = Math.max(...allValues);
  const avgVal = Math.round((allValues.reduce((a, b) => a + b, 0) / allValues.length) * 10) / 10;

  return (
    <div id="formula-comparison-section" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-lg bg-[#22c55e]/10 border border-[#22c55e]/30 flex items-center justify-center text-[#22c55e]">
              <Compass className="w-3.5 h-3.5" />
            </div>
            <h2 className="text-base font-bold text-white tracking-tight">The 7 Scientific Formulas Compared</h2>
          </div>
          <p className="text-xs text-[#94a3b8] mt-1">
            Real-time calculation results across the world's most cited peer-reviewed equations
          </p>
        </div>

        <div className="flex items-center space-x-3 text-xs font-mono text-[#94a3b8]">
          <span>Min: <strong className="text-white">{minVal}</strong></span>
          <span>•</span>
          <span>Avg: <strong className="text-[#22c55e]">{avgVal}</strong></span>
          <span>•</span>
          <span>Max: <strong className="text-white">{maxVal}</strong> {unit}</span>
        </div>
      </div>

      {/* Grid of Formulas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {calculations.map((item) => {
          const isSelected = activeFormula === item.id;
          const diffFromAvg = Math.round((item.calculated1RM - avgVal) * 10) / 10;

          return (
            <div
              key={item.id}
              onClick={() => onSelectFormula(item.id)}
              className={`p-5 rounded-2xl border transition-all cursor-pointer relative flex flex-col justify-between group ${
                isSelected
                  ? 'bg-[#181b20] border-[#22c55e] shadow-lg shadow-[#22c55e]/10'
                  : 'bg-[#111317] border-white/10 hover:border-white/25 hover:bg-[#15181d]'
              }`}
            >
              <div className="space-y-3">
                {/* Header Row */}
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-heading font-bold text-base text-white group-hover:text-[#22c55e] transition-colors">
                        {item.name}
                      </h3>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/5 text-[#94a3b8]">
                        {item.year}
                      </span>
                    </div>
                    <span className="text-[11px] text-[#64748b] block font-mono mt-0.5">
                      by {item.author}
                    </span>
                  </div>

                  {isSelected ? (
                    <span className="w-6 h-6 rounded-full bg-[#22c55e] text-[#0a0b0d] flex items-center justify-center text-xs font-bold shrink-0">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </span>
                  ) : (
                    <span className="text-[11px] font-mono text-[#64748b] group-hover:text-[#22c55e]">
                      Select
                    </span>
                  )}
                </div>

                {/* Mathematical Equation Display */}
                <div className="bg-[#0a0b0d] border border-white/5 rounded-lg px-3 py-2 text-xs font-mono text-[#94a3b8] overflow-x-auto">
                  <code>{item.formulaDisplay}</code>
                </div>

                {/* Description */}
                <p className="text-xs text-[#94a3b8] leading-relaxed">
                  {item.description}
                </p>
              </div>

              {/* Bottom Result & Target */}
              <div className="pt-4 mt-4 border-t border-white/5 flex items-end justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#64748b] block">
                    Best Application
                  </span>
                  <span className="text-xs text-white font-medium block mt-0.5">
                    {item.bestFor}
                  </span>
                </div>

                <div className="text-right">
                  <div className="flex items-baseline space-x-1 justify-end">
                    <span className="font-heading font-extrabold text-2xl text-white font-mono-num">
                      {item.calculated1RM}
                    </span>
                    <span className="text-xs font-mono text-[#64748b]">{unit}</span>
                  </div>
                  <span
                    className={`text-[10px] font-mono ${
                      diffFromAvg > 0
                        ? 'text-amber-400'
                        : diffFromAvg < 0
                        ? 'text-cyan-400'
                        : 'text-[#22c55e]'
                    }`}
                  >
                    {diffFromAvg > 0 ? `+${diffFromAvg}` : diffFromAvg} {unit} vs avg
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
