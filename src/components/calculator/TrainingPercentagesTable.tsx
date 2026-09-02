import React from 'react';
import { PercentageRow, WeightUnit } from '../../types';
import { generateTrainingPercentages } from '../../utils/calculator';
import { Percent, Layers, ArrowRight } from 'lucide-react';

interface TrainingPercentagesTableProps {
  oneRepMax: number;
  unit: WeightUnit;
  onSelectWeightForPlateLoader?: (weight: number) => void;
}

export const TrainingPercentagesTable: React.FC<TrainingPercentagesTableProps> = ({
  oneRepMax,
  unit,
  onSelectWeightForPlateLoader,
}) => {
  const percentages = generateTrainingPercentages(oneRepMax, unit);

  return (
    <div id="training-percentages-section" className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 rounded-lg bg-[#22c55e]/10 border border-[#22c55e]/30 flex items-center justify-center text-[#22c55e]">
            <Percent className="w-3.5 h-3.5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">Training Percentages (PBT)</h2>
            <p className="text-xs text-[#94a3b8]">Calibrated submaximal training zones for periodized blocks</p>
          </div>
        </div>
        <span className="text-[11px] font-mono text-[#64748b] self-start sm:self-auto">
          Rounded to standard plate increments
        </span>
      </div>

      <div className="overflow-x-auto rounded-xl border border-white/10 bg-[#111317]">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="border-b border-white/10 bg-[#181b20]/60 text-[11px] font-mono uppercase tracking-wider text-[#94a3b8]">
              <th className="py-3 px-4">Percentage</th>
              <th className="py-3 px-4">Target Load</th>
              <th className="py-3 px-4 hidden sm:table-cell">Rep Target</th>
              <th className="py-3 px-4 hidden md:table-cell">Velocity Zone</th>
              <th className="py-3 px-4 hidden lg:table-cell">Training Objective</th>
              {onSelectWeightForPlateLoader && <th className="py-3 px-4 text-right">Load Bar</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 font-medium">
            {percentages.map((row) => {
              const isMax = row.percentage === 100;
              const isHeavy = row.percentage >= 85;

              return (
                <tr
                  key={row.percentage}
                  className={`group transition-colors ${
                    isMax
                      ? 'bg-[#22c55e]/5 hover:bg-[#22c55e]/10'
                      : 'hover:bg-white/[0.03]'
                  }`}
                >
                  {/* Percentage badge */}
                  <td className="py-3.5 px-4 font-mono">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        isMax
                          ? 'bg-[#22c55e] text-[#0a0b0d]'
                          : isHeavy
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-white/10 text-white'
                      }`}
                    >
                      {row.percentage}%
                    </span>
                  </td>

                  {/* Calculated Weight */}
                  <td className="py-3.5 px-4">
                    <span className="font-heading font-extrabold text-base text-white group-hover:text-[#22c55e] transition-colors font-mono-num">
                      {row.weight}
                    </span>{' '}
                    <span className="text-xs text-[#64748b] font-mono uppercase">{unit}</span>
                  </td>

                  {/* Estimated Reps */}
                  <td className="py-3.5 px-4 text-xs font-mono text-[#94a3b8] hidden sm:table-cell">
                    {row.repsEstimate}
                  </td>

                  {/* Velocity Zone */}
                  <td className="py-3.5 px-4 text-xs text-[#cbd5e1] hidden md:table-cell">
                    <span className="font-semibold">{row.velocityZone}</span>
                  </td>

                  {/* Training Goal Description */}
                  <td className="py-3.5 px-4 text-xs text-[#94a3b8] hidden lg:table-cell">
                    {row.description}
                  </td>

                  {/* Interactive Action: Send to Plate Loader */}
                  {onSelectWeightForPlateLoader && (
                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => onSelectWeightForPlateLoader(row.weight)}
                        className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-md text-[11px] font-mono font-semibold bg-[#181b20] border border-white/10 text-[#94a3b8] group-hover:text-white group-hover:border-[#22c55e]/40 hover:bg-[#22c55e]/10 transition-all"
                        title="Load this weight in the Plate Calculator"
                      >
                        <Layers className="w-3 h-3 text-[#22c55e]" />
                        <span>Plates</span>
                      </button>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
