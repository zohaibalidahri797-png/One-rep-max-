import React from 'react';
import { WeightUnit } from '../../types';
import { generateRepMaxTable } from '../../utils/calculator';
import { Target, Layers } from 'lucide-react';

interface RepMaxTableProps {
  oneRepMax: number;
  unit: WeightUnit;
  onSelectWeight?: (weight: number) => void;
}

export const RepMaxTable: React.FC<RepMaxTableProps> = ({ oneRepMax, unit, onSelectWeight }) => {
  const rows = generateRepMaxTable(oneRepMax, unit);

  return (
    <div id="rep-max-section" className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 rounded-lg bg-[#22c55e]/10 border border-[#22c55e]/30 flex items-center justify-center text-[#22c55e]">
            <Target className="w-3.5 h-3.5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">Rep Max Matrix (1RM to 15RM)</h2>
            <p className="text-xs text-[#94a3b8]">Projected load capacity for specific repetition targets</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {rows.map((row) => {
          const isSingle = row.reps === 1;
          return (
            <div
              key={row.reps}
              onClick={() => onSelectWeight && onSelectWeight(row.weight)}
              className={`p-4 rounded-xl border transition-all relative overflow-hidden group cursor-pointer ${
                isSingle
                  ? 'bg-[#181b20] border-[#22c55e]/40 shadow-lg shadow-[#22c55e]/5'
                  : 'bg-[#111317] border-white/10 hover:border-white/20 hover:bg-[#181b20]'
              }`}
            >
              {/* Top Row: Rep badge and percentage */}
              <div className="flex items-center justify-between">
                <span
                  className={`text-xs font-mono font-bold px-2 py-0.5 rounded-md ${
                    isSingle
                      ? 'bg-[#22c55e] text-[#0a0b0d]'
                      : 'bg-white/10 text-white'
                  }`}
                >
                  {row.reps} {row.reps === 1 ? 'REP (1RM)' : `REPS (${row.reps}RM)`}
                </span>
                <span className="text-[11px] font-mono text-[#94a3b8]">{row.percentage}%</span>
              </div>

              {/* Middle: Calculated Weight */}
              <div className="mt-3">
                <div className="flex items-baseline space-x-1.5">
                  <span className="font-heading font-extrabold text-2xl text-white font-mono-num group-hover:text-[#22c55e] transition-colors">
                    {row.weight}
                  </span>
                  <span className="text-xs text-[#64748b] font-mono uppercase">{unit}</span>
                </div>
              </div>

              {/* Bottom Visual Progress Bar */}
              <div className="mt-3 w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    isSingle ? 'bg-[#22c55e]' : 'bg-emerald-500/70 group-hover:bg-[#22c55e]'
                  }`}
                  style={{ width: `${row.percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
