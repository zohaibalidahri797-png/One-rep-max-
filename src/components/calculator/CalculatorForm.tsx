import React, { useState } from 'react';
import { WeightUnit, FormulaType } from '../../types';
import { EXERCISES } from '../../utils/constants';
import { FORMULAS_DATA } from '../../utils/calculator';
import { Dumbbell, Scale, Repeat, Calculator, Sparkles, AlertCircle } from 'lucide-react';

interface CalculatorFormProps {
  exercise: string;
  setExercise: (val: string) => void;
  weight: number;
  setWeight: (val: number) => void;
  reps: number;
  setReps: (val: number) => void;
  unit: WeightUnit;
  setUnit: (val: WeightUnit) => void;
  formula: FormulaType;
  setFormula: (val: FormulaType) => void;
  onCalculate: () => void;
  isCompact?: boolean;
}

export const CalculatorForm: React.FC<CalculatorFormProps> = ({
  exercise,
  setExercise,
  weight,
  setWeight,
  reps,
  setReps,
  unit,
  setUnit,
  formula,
  setFormula,
  onCalculate,
  isCompact = false,
}) => {
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleUnitToggle = (newUnit: WeightUnit) => {
    if (newUnit === unit) return;
    if (newUnit === 'LB') {
      setWeight(Math.round(weight * 2.20462));
    } else {
      setWeight(Math.round((weight / 2.20462) * 2) / 2);
    }
    setUnit(newUnit);
  };

  const handleExerciseChange = (exId: string) => {
    setExercise(exId);
    const found = EXERCISES.find((e) => e.id === exId);
    if (found) {
      setWeight(unit === 'KG' ? found.defaultWeightKg : found.defaultWeightLb);
      setReps(found.defaultReps);
      setFormula(found.recommendedFormula);
    }
  };

  const handleWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    if (isNaN(val)) {
      setWeight(0);
    } else {
      setWeight(Math.max(0, Math.min(1000, val)));
      if (errorMsg) setErrorMsg(null);
    }
  };

  const handleRepsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    if (isNaN(val)) {
      setReps(1);
    } else {
      setReps(Math.max(1, Math.min(30, val)));
      if (errorMsg) setErrorMsg(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (weight <= 0) {
      setErrorMsg('Please enter a valid weight greater than 0.');
      return;
    }
    if (reps < 1 || reps > 30) {
      setErrorMsg('Repetitions must be between 1 and 30.');
      return;
    }
    setErrorMsg(null);
    onCalculate();
  };

  const quickWeightPresets = unit === 'KG' ? [60, 80, 100, 120, 140, 180] : [135, 185, 225, 275, 315, 405];

  return (
    <form
      id="one-rep-max-form"
      onSubmit={handleSubmit}
      className={`bg-[#111317] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl ${
        isCompact ? 'max-w-xl' : 'w-full'
      }`}
    >
      {/* Form Header with Unit Switch */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-[#22c55e]/10 border border-[#22c55e]/30 flex items-center justify-center text-[#22c55e]">
            <Calculator className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">Lift Parameters</h2>
            <p className="text-xs text-[#94a3b8]">Enter your working set data</p>
          </div>
        </div>

        {/* Unit Toggle */}
        <div className="inline-flex rounded-lg p-1 bg-[#181b20] border border-white/10" role="group" aria-label="Weight Unit Switcher">
          <button
            type="button"
            id="unit-btn-kg"
            onClick={() => handleUnitToggle('KG')}
            className={`px-3 py-1 text-xs font-bold font-mono rounded-md transition-all ${
              unit === 'KG'
                ? 'bg-[#22c55e] text-[#0a0b0d] shadow-sm'
                : 'text-[#94a3b8] hover:text-white'
            }`}
          >
            KG
          </button>
          <button
            type="button"
            id="unit-btn-lb"
            onClick={() => handleUnitToggle('LB')}
            className={`px-3 py-1 text-xs font-bold font-mono rounded-md transition-all ${
              unit === 'LB'
                ? 'bg-[#22c55e] text-[#0a0b0d] shadow-sm'
                : 'text-[#94a3b8] hover:text-white'
            }`}
          >
            LB
          </button>
        </div>
      </div>

      {/* Exercise Selection */}
      <div className="space-y-2">
        <label htmlFor="exercise-select" className="block text-xs font-bold uppercase tracking-wider text-[#94a3b8]">
          Exercise
        </label>
        <div className="relative">
          <select
            id="exercise-select"
            value={exercise}
            onChange={(e) => handleExerciseChange(e.target.value)}
            className="w-full bg-[#181b20] border border-white/15 rounded-xl px-4 py-3.5 text-sm text-white font-medium focus:border-[#22c55e] focus:ring-1 focus:ring-[#22c55e] focus:outline-none transition-all appearance-none cursor-pointer"
          >
            {EXERCISES.map((ex) => (
              <option key={ex.id} value={ex.id} className="bg-[#181b20] text-white">
                {ex.name} ({ex.category})
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-[#94a3b8]">
            <Dumbbell className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Weight and Reps Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Weight Input */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label htmlFor="weight-input" className="text-xs font-bold uppercase tracking-wider text-[#94a3b8]">
              Lifted Weight ({unit})
            </label>
          </div>
          <div className="relative">
            <input
              id="weight-input"
              type="number"
              min="1"
              max="1000"
              step={unit === 'KG' ? '0.5' : '1'}
              value={weight || ''}
              onChange={handleWeightChange}
              placeholder="e.g. 100"
              className="w-full bg-[#181b20] border border-white/15 rounded-xl pl-4 pr-12 py-3.5 text-lg font-mono-num font-bold text-white focus:border-[#22c55e] focus:ring-1 focus:ring-[#22c55e] focus:outline-none transition-all"
              required
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-xs font-mono font-bold text-[#64748b]">
              {unit}
            </div>
          </div>
        </div>

        {/* Repetitions Input */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label htmlFor="reps-input" className="text-xs font-bold uppercase tracking-wider text-[#94a3b8]">
              Reps Performed (1–30)
            </label>
          </div>
          <div className="relative">
            <input
              id="reps-input"
              type="number"
              min="1"
              max="30"
              step="1"
              value={reps || ''}
              onChange={handleRepsChange}
              placeholder="e.g. 5"
              className="w-full bg-[#181b20] border border-white/15 rounded-xl pl-4 pr-12 py-3.5 text-lg font-mono-num font-bold text-white focus:border-[#22c55e] focus:ring-1 focus:ring-[#22c55e] focus:outline-none transition-all"
              required
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-xs font-mono font-bold text-[#64748b]">
              REPS
            </div>
          </div>
        </div>
      </div>

      {/* Quick Weight Presets */}
      <div className="space-y-1.5">
        <span className="text-[11px] font-mono uppercase tracking-wider text-[#64748b]">Quick Presets</span>
        <div className="flex flex-wrap gap-1.5">
          {quickWeightPresets.map((preset) => (
            <button
              key={preset}
              type="button"
              id={`preset-btn-${preset}`}
              onClick={() => setWeight(preset)}
              className={`px-2.5 py-1 text-xs font-mono rounded-md border transition-all ${
                weight === preset
                  ? 'bg-[#22c55e]/20 border-[#22c55e] text-[#22c55e]'
                  : 'bg-[#181b20] border-white/10 text-[#94a3b8] hover:text-white hover:border-white/25'
              }`}
            >
              {preset} {unit}
            </button>
          ))}
        </div>
      </div>

      {/* Formula Selector */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label htmlFor="formula-select" className="text-xs font-bold uppercase tracking-wider text-[#94a3b8]">
            Calculation Formula
          </label>
          <span className="text-[11px] text-[#22c55e] font-mono">Scientific standard</span>
        </div>
        <select
          id="formula-select"
          value={formula}
          onChange={(e) => setFormula(e.target.value as FormulaType)}
          className="w-full bg-[#181b20] border border-white/15 rounded-xl px-4 py-3 text-sm text-white font-medium focus:border-[#22c55e] focus:ring-1 focus:ring-[#22c55e] focus:outline-none transition-all cursor-pointer"
        >
          <option value="average">7-Formula Scientific Average (Highest Reliability)</option>
          {FORMULAS_DATA.map((f) => (
            <option key={f.id} value={f.id} className="bg-[#181b20] text-white">
              {f.name} ({f.year}) — {f.bestFor}
            </option>
          ))}
        </select>
      </div>

      {/* Error Message if invalid */}
      {errorMsg && (
        <div className="flex items-center space-x-2 text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 p-3 rounded-lg">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Primary Submit Button */}
      <button
        type="submit"
        id="calculate-1rm-submit-btn"
        className="w-full py-4 rounded-xl text-sm font-bold uppercase tracking-wider bg-[#22c55e] text-[#0a0b0d] hover:bg-[#4ade80] active:scale-[0.99] transition-all shadow-[0_0_30px_-8px_rgba(34,197,94,0.4)] flex items-center justify-center space-x-2 group cursor-pointer"
      >
        <Sparkles className="w-4 h-4 text-[#0a0b0d] group-hover:rotate-12 transition-transform" />
        <span>Calculate 1RM</span>
      </button>
    </form>
  );
};
