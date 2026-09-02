import React, { useState, useEffect } from 'react';
import { WeightUnit, FormulaType, CalculationResult, SavedRecord } from '../types';
import { EXERCISES, FAQ_LIST } from '../utils/constants';
import { computeFullCalculation, FORMULAS_DATA } from '../utils/calculator';
import { CalculatorForm } from '../components/calculator/CalculatorForm';
import { ResultDisplay } from '../components/calculator/ResultDisplay';
import { TrainingPercentagesTable } from '../components/calculator/TrainingPercentagesTable';
import { RepMaxTable } from '../components/calculator/RepMaxTable';
import { WarmupPlanner } from '../components/calculator/WarmupPlanner';
import { PlateLoader } from '../components/calculator/PlateLoader';
import { FormulaComparison } from '../components/calculator/FormulaComparison';
import { SavedRecords } from '../components/calculator/SavedRecords';
import { ChevronRight, Home, Percent, Target, Flame, Layers, Compass, BookmarkCheck, HelpCircle, Dumbbell } from 'lucide-react';

interface CalculatorPageProps {
  onNavigate: (path: string) => void;
}

const PR_STORAGE_KEY = 'one_rep_max_saved_prs_v1';

export const CalculatorPage: React.FC<CalculatorPageProps> = ({ onNavigate }) => {
  const [exercise, setExercise] = useState('bench-press');
  const [weight, setWeight] = useState(100);
  const [reps, setReps] = useState(5);
  const [unit, setUnit] = useState<WeightUnit>('KG');
  const [formula, setFormula] = useState<FormulaType>('mayhew');

  const [calcResult, setCalcResult] = useState<CalculationResult>(() =>
    computeFullCalculation(100, 5, 'KG', 'Barbell Bench Press', 'mayhew')
  );

  const [activeTab, setActiveTab] = useState<'percentages' | 'repmax' | 'warmup' | 'plates' | 'formulas'>('percentages');
  const [isRecordSaved, setIsRecordSaved] = useState(false);

  // Recompute when inputs trigger
  const handleCalculate = () => {
    const exObj = EXERCISES.find((e) => e.id === exercise);
    const name = exObj ? exObj.name : 'Barbell Lift';
    const newRes = computeFullCalculation(weight, reps, unit, name, formula);
    setCalcResult(newRes);
    setIsRecordSaved(false);
  };

  const handleSaveRecord = (res: CalculationResult) => {
    const newRecord: SavedRecord = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      date: new Date().toISOString(),
      exercise: res.exercise,
      oneRepMax: res.oneRepMax,
      weight: res.weight,
      reps: res.reps,
      unit: res.unit,
      formula: res.formulaName,
    };

    try {
      const existing = localStorage.getItem(PR_STORAGE_KEY);
      const list: SavedRecord[] = existing ? JSON.parse(existing) : [];
      list.unshift(newRecord);
      localStorage.setItem(PR_STORAGE_KEY, JSON.stringify(list.slice(0, 30)));
      setIsRecordSaved(true);
    } catch (e) {
      console.error('Error saving record', e);
    }
  };

  const handleLoadSavedRecord = (rec: SavedRecord) => {
    const foundEx = EXERCISES.find((e) => e.name === rec.exercise);
    if (foundEx) {
      setExercise(foundEx.id);
    }
    setWeight(rec.weight);
    setReps(rec.reps);
    setUnit(rec.unit);
    const foundFormula = FORMULAS_DATA.find((f) => f.name === rec.formula);
    if (foundFormula) {
      setFormula(foundFormula.id);
    }
    setCalcResult(
      computeFullCalculation(
        rec.weight,
        rec.reps,
        rec.unit,
        rec.exercise,
        foundFormula ? foundFormula.id : 'epley'
      )
    );
    window.scrollTo({ top: 180, behavior: 'smooth' });
  };

  return (
    <div className="w-full bg-[#0a0b0d] text-[#f7f7f8] pt-24 pb-28 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Top Breadcrumb & SEO Header */}
        <div className="space-y-4 border-b border-white/10 pb-8">
          <nav className="flex items-center space-x-2 text-xs font-mono text-[#94a3b8]" aria-label="Breadcrumb">
            <button
              onClick={() => onNavigate('/')}
              className="hover:text-white flex items-center space-x-1 transition-colors"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Home</span>
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-[#64748b]" />
            <span className="text-[#22c55e] font-bold">One Rep Max Calculator</span>
          </nav>

          <div className="space-y-2">
            <h1 className="font-heading font-extrabold text-4xl sm:text-5xl lg:text-6xl uppercase tracking-tight text-white">
              One Rep Max Calculator
            </h1>
            <p className="text-base sm:text-lg text-[#94a3b8] max-w-3xl leading-relaxed">
              Calculate your theoretical single-repetition maximum (1RM) using 7 validated scientific equations. Calibrate percentage-based training cycles, calculate Olympic barbell plate distribution, and generate progressive warm-up ladders.
            </p>
          </div>
        </div>

        {/* Primary Calculator Interface (Desktop: 2 Columns) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Inputs Form */}
          <div className="lg:col-span-6 xl:col-span-5">
            <CalculatorForm
              exercise={exercise}
              setExercise={setExercise}
              weight={weight}
              setWeight={setWeight}
              reps={reps}
              setReps={setReps}
              unit={unit}
              setUnit={setUnit}
              formula={formula}
              setFormula={setFormula}
              onCalculate={handleCalculate}
            />
          </div>

          {/* Right Column: Hero Result Display */}
          <div className="lg:col-span-6 xl:col-span-7 space-y-6">
            <ResultDisplay
              result={calcResult}
              onSaveRecord={handleSaveRecord}
              isSaved={isRecordSaved}
            />

            {/* Quick action bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => setActiveTab('percentages')}
                className={`p-3 rounded-xl border text-xs font-bold font-mono flex items-center justify-center space-x-1.5 transition-all ${
                  activeTab === 'percentages'
                    ? 'bg-[#22c55e] text-[#0a0b0d] border-[#22c55e]'
                    : 'bg-[#111317] border-white/10 text-[#94a3b8] hover:text-white'
                }`}
              >
                <Percent className="w-3.5 h-3.5" />
                <span>Percentages</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('plates')}
                className={`p-3 rounded-xl border text-xs font-bold font-mono flex items-center justify-center space-x-1.5 transition-all ${
                  activeTab === 'plates'
                    ? 'bg-[#22c55e] text-[#0a0b0d] border-[#22c55e]'
                    : 'bg-[#111317] border-white/10 text-[#94a3b8] hover:text-white'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Plate Loader</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('warmup')}
                className={`p-3 rounded-xl border text-xs font-bold font-mono flex items-center justify-center space-x-1.5 transition-all ${
                  activeTab === 'warmup'
                    ? 'bg-[#22c55e] text-[#0a0b0d] border-[#22c55e]'
                    : 'bg-[#111317] border-white/10 text-[#94a3b8] hover:text-white'
                }`}
              >
                <Flame className="w-3.5 h-3.5" />
                <span>Warm-Up</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('formulas')}
                className={`p-3 rounded-xl border text-xs font-bold font-mono flex items-center justify-center space-x-1.5 transition-all ${
                  activeTab === 'formulas'
                    ? 'bg-[#22c55e] text-[#0a0b0d] border-[#22c55e]'
                    : 'bg-[#111317] border-white/10 text-[#94a3b8] hover:text-white'
                }`}
              >
                <Compass className="w-3.5 h-3.5" />
                <span>7 Formulas</span>
              </button>
            </div>
          </div>
        </div>

        {/* Analytics Tabs View */}
        <div className="space-y-10 pt-6">
          {activeTab === 'percentages' && (
            <div className="space-y-10 animate-in fade-in">
              <TrainingPercentagesTable
                oneRepMax={calcResult.oneRepMax}
                unit={unit}
                onSelectWeightForPlateLoader={(w) => {
                  setWeight(w);
                  setActiveTab('plates');
                }}
              />
              <RepMaxTable
                oneRepMax={calcResult.oneRepMax}
                unit={unit}
                onSelectWeight={(w) => {
                  setWeight(w);
                  setActiveTab('plates');
                }}
              />
            </div>
          )}

          {activeTab === 'plates' && (
            <div className="animate-in fade-in">
              <PlateLoader initialTargetWeight={calcResult.oneRepMax} unit={unit} />
            </div>
          )}

          {activeTab === 'warmup' && (
            <div className="animate-in fade-in">
              <WarmupPlanner oneRepMax={calcResult.oneRepMax} unit={unit} />
            </div>
          )}

          {activeTab === 'formulas' && (
            <div className="animate-in fade-in">
              <FormulaComparison
                weight={weight}
                reps={reps}
                unit={unit}
                activeFormula={formula}
                onSelectFormula={(f) => {
                  setFormula(f);
                  handleCalculate();
                }}
              />
            </div>
          )}
        </div>

        {/* Saved Personal Records */}
        <SavedRecords onLoadRecord={handleLoadSavedRecord} />

        {/* Deep Scientific SEO Guide Section */}
        <div className="bg-[#0e1014] border border-white/10 rounded-3xl p-8 sm:p-12 space-y-8">
          <div className="space-y-2">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#22c55e]">
              EXHAUSTIVE METHODOLOGY
            </span>
            <h2 className="font-heading font-bold text-2xl sm:text-3xl text-white">
              How to Apply 1RM Calculations to Strength Programming
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-[#94a3b8] leading-relaxed">
            <div className="space-y-4">
              <h3 className="font-bold text-white text-base">The Neuromuscular Basis of 1RM</h3>
              <p>
                A true One Rep Max requires maximum voluntary contraction (MVC), recruiting both Type I (slow-twitch) and Type IIa/IIx (fast-twitch high-threshold) motor units simultaneously. By recording the repetitions performed at submaximal loads (typically 75% to 90% of maximum), mathematical models map the rate of motor unit exhaustion and project your absolute peak capacity.
              </p>
              <h3 className="font-bold text-white text-base">Selecting the Ideal Repetition Window</h3>
              <p>
                For maximum accuracy, calculate your 1RM from sets performed between <strong>2 and 6 repetitions</strong> at an RPE (Rating of Perceived Exertion) of 9 or 10. When rep ranges exceed 8–10 repetitions, anaerobic lactic threshold, technique breakdown, and breathing mechanics introduce greater statistical error.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="font-bold text-white text-base">Velocity Zones & Training Prescriptions</h3>
              <ul className="space-y-2 list-disc pl-5">
                <li><strong className="text-white">90%–100% 1RM:</strong> Intramuscular coordination, neural drive, peaking.</li>
                <li><strong className="text-white">80%–90% 1RM:</strong> High-threshold hypertrophy and foundational strength (5×5, 4×4).</li>
                <li><strong className="text-white">70%–80% 1RM:</strong> Hypertrophic volume accumulation and time-under-tension (3–4 sets of 8–10).</li>
                <li><strong className="text-white">60%–70% 1RM:</strong> Dynamic effort speed-strength and deloading sessions.</li>
              </ul>
              <h3 className="font-bold text-white text-base">Safety and Injury Risk Mitigation</h3>
              <p>
                Submaximal estimation provides virtually identical programming utility to direct 1RM testing while dramatically decreasing spinal shear stress, connective tissue inflammation, and recovery debt.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
