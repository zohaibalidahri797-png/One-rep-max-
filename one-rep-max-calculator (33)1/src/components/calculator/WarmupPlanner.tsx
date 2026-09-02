import React, { useState, useEffect } from 'react';
import { WeightUnit } from '../../types';
import { generateWarmupSets } from '../../utils/calculator';
import { Flame, Clock, Play, Pause, RotateCcw, CheckCircle2, ChevronRight } from 'lucide-react';

interface WarmupPlannerProps {
  oneRepMax: number;
  unit: WeightUnit;
}

export const WarmupPlanner: React.FC<WarmupPlannerProps> = ({ oneRepMax, unit }) => {
  const sets = generateWarmupSets(oneRepMax, unit);
  const [completedSets, setCompletedSets] = useState<Record<number, boolean>>({});
  const [timerSeconds, setTimerSeconds] = useState<number | null>(null);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerRunning && timerSeconds !== null && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => (prev !== null && prev > 0 ? prev - 1 : 0));
      }, 1000);
    } else if (timerSeconds === 0) {
      setIsTimerRunning(false);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, timerSeconds]);

  const toggleSetComplete = (setNum: number, restSeconds: number) => {
    const nextState = !completedSets[setNum];
    setCompletedSets((prev) => ({ ...prev, [setNum]: nextState }));
    if (nextState && setNum < sets.length) {
      // Start rest timer automatically for next set
      setTimerSeconds(restSeconds);
      setIsTimerRunning(true);
    }
  };

  const startCustomRest = (sec: number) => {
    setTimerSeconds(sec);
    setIsTimerRunning(true);
  };

  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div id="warmup-sets-section" className="space-y-4">
      {/* Header and Live Rest Timer */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 rounded-lg bg-[#22c55e]/10 border border-[#22c55e]/30 flex items-center justify-center text-[#22c55e]">
            <Flame className="w-3.5 h-3.5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">Progressive Warm-Up Protocol</h2>
            <p className="text-xs text-[#94a3b8]">Optimal nervous system potentiation without inducing premature fatigue</p>
          </div>
        </div>

        {/* Integrated Rest Timer widget */}
        {timerSeconds !== null && (
          <div className="flex items-center space-x-2 px-3 py-1.5 bg-[#181b20] border border-white/15 rounded-lg text-xs font-mono">
            <Clock className="w-3.5 h-3.5 text-[#22c55e]" />
            <span className="text-[#94a3b8]">Rest:</span>
            <span className={`font-bold font-mono-num text-sm ${timerSeconds <= 10 ? 'text-amber-400 animate-pulse' : 'text-white'}`}>
              {formatTime(timerSeconds)}
            </span>
            <button
              onClick={() => setIsTimerRunning(!isTimerRunning)}
              className="p-1 hover:text-[#22c55e] transition-colors"
              title={isTimerRunning ? 'Pause timer' : 'Resume timer'}
            >
              {isTimerRunning ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
            </button>
            <button
              onClick={() => {
                setTimerSeconds(null);
                setIsTimerRunning(false);
              }}
              className="p-1 hover:text-rose-400 transition-colors"
              title="Reset timer"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>

      {/* Warm-Up Step Ladder */}
      <div className="space-y-2.5">
        {sets.map((set) => {
          const isDone = completedSets[set.setNumber];
          const isTargetAttempt = set.setNumber === sets.length;

          return (
            <div
              key={set.setNumber}
              className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                isDone
                  ? 'bg-[#181b20]/50 border-white/5 opacity-65'
                  : isTargetAttempt
                  ? 'bg-[#181b20] border-[#22c55e]/40 shadow-md'
                  : 'bg-[#111317] border-white/10 hover:border-white/20'
              }`}
            >
              <div className="flex items-start sm:items-center space-x-3.5">
                {/* Checkbox toggle */}
                <button
                  type="button"
                  onClick={() => toggleSetComplete(set.setNumber, set.restSeconds)}
                  className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-all shrink-0 mt-0.5 sm:mt-0 ${
                    isDone
                      ? 'bg-[#22c55e] border-[#22c55e] text-[#0a0b0d]'
                      : 'border-white/20 hover:border-[#22c55e]'
                  }`}
                  aria-label={`Mark Set ${set.setNumber} complete`}
                >
                  {isDone && <CheckCircle2 className="w-4 h-4" />}
                </button>

                {/* Set Info */}
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-white">
                      SET 0{set.setNumber}
                    </span>
                    <span className="text-[11px] font-mono text-[#64748b]">
                      {set.percentage === 0 ? 'Empty Bar' : `${set.percentage}% of 1RM`}
                    </span>
                  </div>
                  <p className="text-xs text-[#94a3b8] mt-0.5">{set.purpose}</p>
                </div>
              </div>

              {/* Right: Reps & Weight and Rest Trigger */}
              <div className="flex items-center justify-between sm:justify-end space-x-5 pl-9 sm:pl-0">
                <div className="text-right">
                  <div className="flex items-baseline space-x-1 justify-end">
                    <span className="font-heading font-extrabold text-xl text-white font-mono-num">
                      {set.weight}
                    </span>
                    <span className="text-xs font-mono text-[#64748b]">{unit}</span>
                  </div>
                  <span className="text-xs font-mono text-[#22c55e]">
                    {set.reps} {set.reps === 1 ? 'rep' : 'reps'}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => startCustomRest(set.restSeconds)}
                  className="px-2.5 py-1.5 rounded-lg bg-[#181b20] border border-white/10 hover:border-[#22c55e]/40 hover:bg-[#22c55e]/10 text-xs font-mono text-[#94a3b8] hover:text-white transition-all flex items-center space-x-1"
                  title={`Start ${set.restSeconds}s rest timer`}
                >
                  <Clock className="w-3 h-3 text-[#22c55e]" />
                  <span>{set.restSeconds}s</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
