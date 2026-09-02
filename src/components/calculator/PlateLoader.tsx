import React, { useState } from 'react';
import { WeightUnit } from '../../types';
import { calculatePlates, STANDARD_PLATES_KG, STANDARD_PLATES_LB } from '../../utils/calculator';
import { Layers, Plus, Minus, Settings2, CheckCircle2, RotateCcw, AlertTriangle } from 'lucide-react';

interface PlateLoaderProps {
  initialTargetWeight: number;
  unit: WeightUnit;
}

export const PlateLoader: React.FC<PlateLoaderProps> = ({ initialTargetWeight, unit }) => {
  const defaultBar = unit === 'KG' ? 20 : 45;
  const [targetWeight, setTargetWeight] = useState(initialTargetWeight);
  const [barWeight, setBarWeight] = useState(defaultBar);
  const [availablePlates, setAvailablePlates] = useState<Record<number, boolean>>({});
  const [showConfig, setShowConfig] = useState(false);

  // Sync if prop changes significantly
  React.useEffect(() => {
    setTargetWeight(initialTargetWeight);
  }, [initialTargetWeight]);

  const plateDefs = unit === 'KG' ? STANDARD_PLATES_KG : STANDARD_PLATES_LB;
  const result = calculatePlates(targetWeight, barWeight, unit, availablePlates);

  const togglePlateAvailability = (weight: number) => {
    setAvailablePlates((prev) => ({
      ...prev,
      [weight]: prev[weight] === undefined ? false : !prev[weight],
    }));
  };

  const quickBarsKg = [
    { label: 'Standard Men (20kg)', weight: 20 },
    { label: 'Women / Technique (15kg)', weight: 15 },
    { label: 'Squat Bar (25kg)', weight: 25 },
    { label: 'Trap / Hex Bar (22kg)', weight: 22 },
  ];

  const quickBarsLb = [
    { label: 'Standard Men (45lb)', weight: 45 },
    { label: 'Women / Technique (35lb)', weight: 35 },
    { label: 'Squat Bar (55lb)', weight: 55 },
    { label: 'Trap / Hex Bar (50lb)', weight: 50 },
  ];

  const barOptions = unit === 'KG' ? quickBarsKg : quickBarsLb;

  return (
    <div id="plate-loader-card" className="bg-[#111317] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-[#22c55e]/10 border border-[#22c55e]/30 flex items-center justify-center text-[#22c55e]">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">Barbell Plate Loader</h2>
            <p className="text-xs text-[#94a3b8]">Exact per-side Olympic plate distribution algorithm</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowConfig(!showConfig)}
          className={`px-3 py-1.5 rounded-lg border text-xs font-mono flex items-center space-x-1.5 transition-all ${
            showConfig
              ? 'bg-[#22c55e]/20 border-[#22c55e] text-[#22c55e]'
              : 'bg-[#181b20] border-white/10 text-[#94a3b8] hover:text-white'
          }`}
        >
          <Settings2 className="w-3.5 h-3.5" />
          <span>{showConfig ? 'Hide Config' : 'Inventory & Bar'}</span>
        </button>
      </div>

      {/* Target Weight Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-[#94a3b8]">
            Target Weight ({unit})
          </label>
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => setTargetWeight((w) => Math.max(barWeight, w - (unit === 'KG' ? 2.5 : 5)))}
              className="w-10 h-10 rounded-lg bg-[#181b20] border border-white/10 text-white hover:border-[#22c55e] flex items-center justify-center font-bold text-lg transition-all"
            >
              <Minus className="w-4 h-4" />
            </button>
            <input
              type="number"
              value={targetWeight || ''}
              onChange={(e) => setTargetWeight(Math.max(0, parseFloat(e.target.value) || 0))}
              step={unit === 'KG' ? '0.5' : '1'}
              className="w-full bg-[#181b20] border border-white/15 rounded-lg py-2 text-center text-xl font-mono-num font-extrabold text-white focus:border-[#22c55e] focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setTargetWeight((w) => w + (unit === 'KG' ? 2.5 : 5))}
              className="w-10 h-10 rounded-lg bg-[#181b20] border border-white/10 text-white hover:border-[#22c55e] flex items-center justify-center font-bold text-lg transition-all"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Total Loaded vs Difference Stat */}
        <div className="bg-[#181b20] border border-white/10 rounded-xl p-3.5 flex flex-col justify-center">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#64748b]">Per-Side Load</span>
          <div className="flex items-baseline space-x-1.5">
            <span className="font-heading font-extrabold text-2xl text-white font-mono-num">
              {result.weightPerSide}
            </span>
            <span className="text-xs font-mono text-[#22c55e] uppercase">{unit} / SIDE</span>
          </div>
        </div>

        <div className="bg-[#181b20] border border-white/10 rounded-xl p-3.5 flex flex-col justify-center">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#64748b]">Bar & Collars</span>
          <div className="flex items-baseline space-x-1.5">
            <span className="font-heading font-extrabold text-2xl text-white font-mono-num">
              {barWeight}
            </span>
            <span className="text-xs font-mono text-[#94a3b8] uppercase">{unit} BAR</span>
          </div>
        </div>
      </div>

      {/* Advanced Inventory Config (Collapsible) */}
      {showConfig && (
        <div className="bg-[#181b20] border border-white/10 rounded-xl p-4 space-y-4 animate-in fade-in">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#94a3b8] block">
              Barbell Selection
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {barOptions.map((opt) => (
                <button
                  key={opt.weight}
                  type="button"
                  onClick={() => setBarWeight(opt.weight)}
                  className={`p-2 rounded-lg border text-left text-xs transition-all ${
                    barWeight === opt.weight
                      ? 'bg-[#22c55e]/20 border-[#22c55e] text-white'
                      : 'bg-[#111317] border-white/10 text-[#94a3b8] hover:text-white'
                  }`}
                >
                  <div className="font-bold">{opt.weight} {unit}</div>
                  <div className="text-[10px] text-[#64748b] truncate">{opt.label}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold uppercase tracking-wider text-[#94a3b8]">
                Available Plate Inventory (Click to toggle)
              </span>
              <button
                type="button"
                onClick={() => setAvailablePlates({})}
                className="text-[11px] font-mono text-[#22c55e] hover:underline"
              >
                Reset All Enabled
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {plateDefs.map((p) => {
                const isEnabled = availablePlates[p.weight] !== false;
                return (
                  <button
                    key={p.weight}
                    type="button"
                    onClick={() => togglePlateAvailability(p.weight)}
                    className={`px-3 py-1.5 rounded-lg border text-xs font-mono font-bold flex items-center space-x-2 transition-all ${
                      isEnabled
                        ? 'bg-[#111317] border-white/20 text-white'
                        : 'bg-[#111317]/50 border-white/5 text-[#64748b] line-through'
                    }`}
                  >
                    <span
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ backgroundColor: p.hex }}
                    />
                    <span>{p.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Visual 3D Barbell Sleeve Graphic */}
      <div className="bg-[#0a0b0d] border border-white/10 rounded-xl p-6 relative overflow-hidden flex flex-col items-center justify-center min-h-[190px]">
        {/* Subtle background track */}
        <div className="absolute inset-0 bg-[radial-gradient(#22c55e0a_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

        {result.platesPerSide.length === 0 ? (
          <div className="text-center space-y-1 relative z-10 py-6">
            <span className="text-sm font-bold text-white block">Empty Barbell ({barWeight} {unit})</span>
            <p className="text-xs text-[#94a3b8]">No plates required on either sleeve for this target weight.</p>
          </div>
        ) : (
          <div className="w-full flex items-center justify-center py-4 relative z-10 overflow-x-auto">
            {/* Barbell Assembly */}
            <div className="flex items-center space-x-1 sm:space-x-1.5 min-w-max px-4">
              {/* Inner Shaft */}
              <div className="w-16 sm:w-28 h-5 bg-gradient-to-b from-slate-400 via-slate-200 to-slate-500 rounded-l-sm shadow-md border-r border-slate-700 relative flex items-center justify-center">
                <span className="text-[9px] font-mono font-extrabold text-slate-800 tracking-wider uppercase">
                  SHAFT
                </span>
              </div>

              {/* Sleeve Collar (Thick silver ring) */}
              <div className="w-4 sm:w-5 h-16 bg-gradient-to-r from-slate-500 via-slate-300 to-slate-600 rounded-sm border border-slate-400/50 shadow-inner" />

              {/* Plates Stack (Inside out) */}
              {result.platesPerSide.map((plateGroup) => {
                const platesArray = Array.from({ length: plateGroup.count });
                const heightPx = Math.max(50, Math.round((plateGroup.diameterPercent / 100) * 120));

                return platesArray.map((_, idx) => (
                  <div
                    key={`${plateGroup.weight}-${idx}`}
                    className="relative group flex items-center justify-center transition-transform hover:scale-105"
                    style={{
                      height: `${heightPx}px`,
                      width: plateGroup.weight >= 20 ? '22px' : plateGroup.weight >= 10 ? '18px' : '14px',
                    }}
                  >
                    {/* Plate Body */}
                    <div
                      className="w-full h-full rounded-sm shadow-xl flex items-center justify-center border border-white/20 relative"
                      style={{
                        backgroundColor: plateGroup.color,
                        boxShadow: `0 0 12px ${plateGroup.color}40`,
                      }}
                    >
                      {/* Vertical Label */}
                      <span className="rotate-90 text-[8px] sm:text-[9px] font-mono font-black text-white/90 whitespace-nowrap drop-shadow">
                        {plateGroup.weight}
                      </span>
                    </div>

                    {/* Tooltip on hover */}
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#181b20] border border-white/10 text-[10px] font-mono px-2 py-0.5 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-20">
                      {plateGroup.label}
                    </div>
                  </div>
                ));
              })}

              {/* Outer Barbell Sleeve Tip */}
              <div className="w-8 sm:w-12 h-5 bg-gradient-to-b from-slate-400 via-slate-200 to-slate-500 rounded-r-md shadow-md border-l border-slate-700" />
            </div>
          </div>
        )}
      </div>

      {/* Numerical Plate Breakdown Summary */}
      <div className="space-y-2">
        <span className="text-xs font-mono uppercase tracking-wider text-[#64748b] block">
          Loading Checklist (Each Side)
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {result.platesPerSide.map((p) => (
            <div
              key={p.weight}
              className="bg-[#181b20] border border-white/10 rounded-xl p-3 flex items-center justify-between"
            >
              <div className="flex items-center space-x-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: p.color }}
                />
                <span className="text-xs font-mono font-bold text-white">{p.label}</span>
              </div>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-white/10 text-[#22c55e]">
                × {p.count}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
