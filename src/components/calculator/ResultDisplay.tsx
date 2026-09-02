import React, { useState, useEffect } from 'react';
import { CalculationResult } from '../../types';
import { Trophy, Share2, BookmarkPlus, Check, Flame, ArrowUpRight } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ResultDisplayProps {
  result: CalculationResult;
  onSaveRecord?: (result: CalculationResult) => void;
  isSaved?: boolean;
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ result, onSaveRecord, isSaved = false }) => {
  const [displayValue, setDisplayValue] = useState(result.oneRepMax);
  const [copied, setCopied] = useState(false);

  // Smooth number interpolation on result change
  useEffect(() => {
    let startTimestamp: number | null = null;
    const startVal = displayValue;
    const targetVal = result.oneRepMax;
    const duration = 400; // ms

    if (startVal === targetVal) return;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // Ease out cubic
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const current = startVal + (targetVal - startVal) * easeProgress;
      setDisplayValue(Math.round(current * 10) / 10);

      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };

    window.requestAnimationFrame(step);
  }, [result.oneRepMax]);

  const handleShare = () => {
    const text = `🎯 My estimated ${result.exercise} 1RM is ${result.oneRepMax} ${result.unit} (calculated from ${result.weight} ${result.unit} × ${result.reps} reps via ${result.formulaName} formula on One Rep Max Calculator).`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSave = () => {
    if (onSaveRecord) {
      onSaveRecord(result);
      try {
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.7 },
          colors: ['#22c55e', '#4ade80', '#ffffff'],
        });
      } catch (e) {
        // silent
      }
    }
  };

  return (
    <div
      id="calculator-result-card"
      className="bg-[#111317] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden flex flex-col justify-between"
    >
      {/* Background ambient gradient glow */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#22c55e]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Meta Bar */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4 relative z-10">
        <div className="flex items-center space-x-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#22c55e] animate-pulse" />
          <span className="text-xs font-mono font-bold tracking-widest text-[#94a3b8] uppercase">
            CALCULATION COMPLETE
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            id="share-result-btn"
            onClick={handleShare}
            className="p-2 rounded-lg bg-[#181b20] border border-white/10 text-[#94a3b8] hover:text-white hover:border-white/20 transition-all text-xs flex items-center space-x-1.5"
            title="Copy formatted 1RM summary"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#22c55e]" />
                <span className="text-[#22c55e] font-mono text-[11px]">Copied</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline font-mono text-[11px]">Copy</span>
              </>
            )}
          </button>

          {onSaveRecord && (
            <button
              id="save-pr-record-btn"
              onClick={handleSave}
              disabled={isSaved}
              className={`p-2 rounded-lg border text-xs flex items-center space-x-1.5 transition-all ${
                isSaved
                  ? 'bg-[#22c55e]/15 border-[#22c55e]/30 text-[#22c55e]'
                  : 'bg-[#181b20] border-white/10 text-[#94a3b8] hover:text-[#22c55e] hover:border-[#22c55e]/30'
              }`}
              title="Save to personal records history"
            >
              <BookmarkPlus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline font-mono text-[11px]">
                {isSaved ? 'Saved PR' : 'Save PR'}
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Main 1RM Hero Value */}
      <div className="space-y-2 py-4 relative z-10 text-center sm:text-left">
        <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#22c55e] block">
          ESTIMATED 1RM
        </span>
        <div className="flex items-baseline justify-center sm:justify-start space-x-3">
          <span className="font-heading font-extrabold text-6xl sm:text-7xl lg:text-8xl tracking-tight text-white font-mono-num drop-shadow-md">
            {displayValue}
          </span>
          <span className="font-heading font-bold text-2xl sm:text-3xl text-[#94a3b8] font-mono-num">
            {result.unit}
          </span>
        </div>
        <p className="text-sm text-[#94a3b8] flex items-center justify-center sm:justify-start space-x-2">
          <Flame className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            Calculated from <strong className="text-white">{result.weight} {result.unit}</strong> for{' '}
            <strong className="text-white">{result.reps} {result.reps === 1 ? 'rep' : 'reps'}</strong>
          </span>
        </p>
      </div>

      {/* Breakdown Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-white/10 relative z-10 text-xs">
        <div className="bg-[#181b20] border border-white/5 rounded-xl p-3">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#64748b] block">
            Formula Used
          </span>
          <span className="font-bold text-white tracking-tight truncate block mt-0.5">
            {result.formulaName}
          </span>
        </div>

        <div className="bg-[#181b20] border border-white/5 rounded-xl p-3">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#64748b] block">
            Lift Target
          </span>
          <span className="font-bold text-white tracking-tight truncate block mt-0.5">
            {result.exercise}
          </span>
        </div>

        <div className="bg-[#181b20] border border-white/5 rounded-xl p-3">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#64748b] block">
            Rep Intensity
          </span>
          <span className="font-bold text-white tracking-tight block mt-0.5">
            {result.reps <= 3 ? 'Max Strength (≥90%)' : result.reps <= 6 ? 'Strength (85–90%)' : 'Hypertrophy (<85%)'}
          </span>
        </div>

        <div className="bg-[#181b20] border border-white/5 rounded-xl p-3">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#64748b] block">
            Precision Est.
          </span>
          <span className="font-bold text-[#22c55e] tracking-tight block mt-0.5">
            {result.reps <= 5 ? '±2.5% High' : result.reps <= 10 ? '±4.0% Moderate' : '±6.5% Wide'}
          </span>
        </div>
      </div>
    </div>
  );
};
