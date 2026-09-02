import { FormulaType, WeightUnit, CalculationResult, PercentageRow, RepMaxRow, WarmupSet, PlateLoaderResult, PlateCount } from '../types';

/**
 * Scientific One Rep Max Formulas:
 * 1. Epley: 1RM = w * (1 + r / 30)
 * 2. Brzycki: 1RM = w * (36 / (37 - r))
 * 3. Lombardi: 1RM = w * (r ^ 0.10)
 * 4. Mayhew et al.: 1RM = (100 * w) / (52.2 + 41.9 * e^(-0.055 * r))
 * 5. O'Conner et al.: 1RM = w * (1 + 0.025 * r)
 * 6. Wathan: 1RM = (100 * w) / (48.8 + 53.8 * e^(-0.075 * r))
 * 7. Lander: 1RM = (100 * w) / (101.3 - 2.67123 * r)
 */

export const FORMULAS_DATA = [
  {
    id: 'epley' as FormulaType,
    name: 'Epley',
    author: 'Boyd Epley',
    year: 1985,
    formulaDisplay: 'Weight × (1 + Reps / 30)',
    description: 'The global standard equation developed at the University of Nebraska. Highly reliable across 2–10 repetitions, particularly accurate for squats and deadlifts.',
    bestFor: 'General strength, squats, deadlifts',
    repRange: '2 – 10 reps',
  },
  {
    id: 'brzycki' as FormulaType,
    name: 'Brzycki',
    author: 'Matt Brzycki',
    year: 1993,
    formulaDisplay: 'Weight × (36 / (37 - Reps))',
    description: 'Derived from testing collegiate athletes at Princeton University. Known for its conservative, safe estimates in low rep ranges (1–6 reps).',
    bestFor: 'Lower reps, upper body, collegiate lifters',
    repRange: '1 – 8 reps',
  },
  {
    id: 'lombardi' as FormulaType,
    name: 'Lombardi',
    author: 'V. Lombardi',
    year: 1989,
    formulaDisplay: 'Weight × Reps^0.10',
    description: 'A power-law logarithmic equation designed to prevent overestimation at higher repetition sets (8–12 reps).',
    bestFor: 'Hypertrophy rep ranges, moderate loads',
    repRange: '4 – 12 reps',
  },
  {
    id: 'mayhew' as FormulaType,
    name: 'Mayhew et al.',
    author: 'Jerry L. Mayhew et al.',
    year: 1992,
    formulaDisplay: '100 × Weight / (52.2 + 41.9 × e^(-0.055 × Reps))',
    description: 'Developed specifically through comprehensive bench press biomechanics research across collegiate football players. Exceptionally accurate for horizontal pressing.',
    bestFor: 'Bench Press & Pec Deck movements',
    repRange: '2 – 12 reps',
  },
  {
    id: 'oconner' as FormulaType,
    name: "O'Conner et al.",
    author: "O'Conner et al.",
    year: 1989,
    formulaDisplay: 'Weight × (1 + 0.025 × Reps)',
    description: 'A linear equation with a 2.5% increment per repetition. Tends to offer slightly more conservative numbers than Epley.',
    bestFor: 'Conservative estimates, compound movements',
    repRange: '2 – 10 reps',
  },
  {
    id: 'wathan' as FormulaType,
    name: 'Wathan',
    author: 'Denise Wathan',
    year: 1994,
    formulaDisplay: '100 × Weight / (48.8 + 53.8 × e^(-0.075 × Reps))',
    description: 'Exponential decay equation optimized for male & female competitive powerlifters across heavy multi-joint lifts.',
    bestFor: 'Powerlifting, heavy sets',
    repRange: '3 – 10 reps',
  },
  {
    id: 'lander' as FormulaType,
    name: 'Lander',
    author: 'J. Lander',
    year: 1985,
    formulaDisplay: '100 × Weight / (101.3 - 2.67123 × Reps)',
    description: 'Linear coefficient model designed for submaximal testing without reaching absolute muscular failure.',
    bestFor: 'Submaximal training, strength testing',
    repRange: '2 – 8 reps',
  },
];

export function calculateFormula1RM(weight: number, reps: number, formula: FormulaType): number {
  if (weight <= 0 || reps <= 0) return 0;
  if (reps === 1) return weight;

  let result = weight;

  switch (formula) {
    case 'epley':
      result = weight * (1 + reps / 30);
      break;
    case 'brzycki':
      // Brzycki denominator check
      if (reps >= 37) {
        result = weight * (1 + reps / 30);
      } else {
        result = weight * (36 / (37 - reps));
      }
      break;
    case 'lombardi':
      result = weight * Math.pow(reps, 0.1);
      break;
    case 'mayhew':
      result = (100 * weight) / (52.2 + 41.9 * Math.exp(-0.055 * reps));
      break;
    case 'oconner':
      result = weight * (1 + 0.025 * reps);
      break;
    case 'wathan':
      result = (100 * weight) / (48.8 + 53.8 * Math.exp(-0.075 * reps));
      break;
    case 'lander':
      if (101.3 - 2.67123 * reps <= 0) {
        result = weight * (1 + reps / 30);
      } else {
        result = (100 * weight) / (101.3 - 2.67123 * reps);
      }
      break;
    case 'average': {
      const allSeven = [
        calculateFormula1RM(weight, reps, 'epley'),
        calculateFormula1RM(weight, reps, 'brzycki'),
        calculateFormula1RM(weight, reps, 'lombardi'),
        calculateFormula1RM(weight, reps, 'mayhew'),
        calculateFormula1RM(weight, reps, 'oconner'),
        calculateFormula1RM(weight, reps, 'wathan'),
        calculateFormula1RM(weight, reps, 'lander'),
      ];
      result = allSeven.reduce((a, b) => a + b, 0) / allSeven.length;
      break;
    }
    default:
      result = weight * (1 + reps / 30);
  }

  return Math.round(result * 10) / 10;
}

export function computeFullCalculation(
  weight: number,
  reps: number,
  unit: WeightUnit,
  exerciseName: string,
  selectedFormula: FormulaType
): CalculationResult {
  const chosen1RM = calculateFormula1RM(weight, reps, selectedFormula);
  const formulaObj = FORMULAS_DATA.find((f) => f.id === selectedFormula);
  const formulaName = formulaObj ? formulaObj.name : selectedFormula === 'average' ? '7-Formula Average' : 'Epley';

  const allSevenCalculated = FORMULAS_DATA.map((item) => {
    const val = calculateFormula1RM(weight, reps, item.id);
    return {
      formula: item.id,
      name: item.name,
      value: val,
      difference: Math.round((val - chosen1RM) * 10) / 10,
    };
  });

  return {
    oneRepMax: chosen1RM,
    weight,
    reps,
    unit,
    exercise: exerciseName,
    formula: selectedFormula,
    formulaName,
    allFormulas: allSevenCalculated,
    timestamp: new Date().toISOString(),
  };
}

export function generateTrainingPercentages(oneRepMax: number, unit: WeightUnit): PercentageRow[] {
  const percentages = [
    { p: 100, reps: '1 rep', zone: 'Absolute Max', goal: 'Peak Neural Activation', desc: 'Maximum single-effort testing / competition attempts' },
    { p: 95, reps: '1 – 2 reps', zone: 'Max Strength', goal: 'Heavy Overload', desc: 'Peaking blocks, high intensity heavy singles/doubles' },
    { p: 90, reps: '2 – 3 reps', zone: 'Max Strength', goal: 'Intra-muscular Coordination', desc: 'Core strength development with high motor unit recruitment' },
    { p: 85, reps: '3 – 5 reps', zone: 'Strength / Power', goal: 'Functional Strength', desc: 'Optimal range for 5x5, 3x3 powerbuilding foundations' },
    { p: 80, reps: '6 – 8 reps', zone: 'Hypertrophy-Strength', goal: 'Muscle Size & Density', desc: 'Standard compound hypertrophy with high mechanical tension' },
    { p: 75, reps: '8 – 10 reps', zone: 'Hypertrophy', goal: 'Volume Accumulation', desc: 'Metabolic stress and volume threshold training' },
    { p: 70, reps: '10 – 12 reps', zone: 'Hypertrophy', goal: 'Work Capacity', desc: 'High repetition volume blocks and accessory work' },
    { p: 65, reps: '12 – 15 reps', zone: 'Strength Endurance', goal: 'Muscular Endurance', desc: 'Conditioning, hypertrophy, and connective tissue resilience' },
    { p: 60, reps: '15 – 20 reps', zone: 'Endurance / Speed', goal: 'Dynamic Effort / Speed', desc: 'Speed-strength, bar speed velocity, deloading & recovery' },
  ];

  return percentages.map((item) => {
    const rawWeight = (oneRepMax * item.p) / 100;
    // Clean rounding: to nearest 0.5 for KG, 1.0 for LB
    const rounded = unit === 'KG' ? Math.round(rawWeight * 2) / 2 : Math.round(rawWeight);
    return {
      percentage: item.p,
      weight: rounded,
      repsEstimate: item.reps,
      velocityZone: item.zone,
      trainingGoal: item.goal,
      description: item.desc,
    };
  });
}

export function generateRepMaxTable(oneRepMax: number, unit: WeightUnit): RepMaxRow[] {
  const repsList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 15];
  // Standard average percentage coefficients for reps
  const repPercentages: Record<number, number> = {
    1: 100,
    2: 95.5,
    3: 92.5,
    4: 89.0,
    5: 86.0,
    6: 83.5,
    7: 80.5,
    8: 77.5,
    9: 75.0,
    10: 72.5,
    12: 67.5,
    15: 61.5,
  };

  return repsList.map((reps) => {
    const pct = repPercentages[reps] || Math.max(50, 100 - reps * 2.8);
    const rawWeight = (oneRepMax * pct) / 100;
    const rounded = unit === 'KG' ? Math.round(rawWeight * 2) / 2 : Math.round(rawWeight);
    return {
      reps,
      percentage: pct,
      weight: rounded,
    };
  });
}

export function generateWarmupSets(oneRepMax: number, unit: WeightUnit): WarmupSet[] {
  const barWeight = unit === 'KG' ? 20 : 45;

  const setsConfig = [
    { pct: 0, reps: 10, purpose: 'Joint lubrication, movement groove & blood flow', rest: 60, isBarOnly: true },
    { pct: 40, reps: 5, purpose: 'Light acceleration & neural priming', rest: 90, isBarOnly: false },
    { pct: 60, reps: 3, purpose: 'Moderate load motor-pattern reinforcement', rest: 120, isBarOnly: false },
    { pct: 75, reps: 2, purpose: 'Heavy transition & nervous system calibration', rest: 150, isBarOnly: false },
    { pct: 85, reps: 1, purpose: 'Post-activation potentiation single', rest: 180, isBarOnly: false },
    { pct: 100, reps: 1, purpose: 'Target 1RM Attempt / Peak Working Set', rest: 240, isBarOnly: false },
  ];

  return setsConfig.map((item, idx) => {
    let weightVal = barWeight;
    if (!item.isBarOnly) {
      const calculated = (oneRepMax * item.pct) / 100;
      weightVal = Math.max(barWeight, unit === 'KG' ? Math.round(calculated * 2) / 2 : Math.round(calculated));
    }

    return {
      setNumber: idx + 1,
      percentage: item.pct === 0 ? 0 : item.pct,
      weight: weightVal,
      reps: item.reps,
      purpose: item.purpose,
      restSeconds: item.rest,
    };
  });
}

/**
 * Standard IWF / Olympic Plate Colors & Specifications
 */
export const STANDARD_PLATES_KG: { weight: number; color: string; hex: string; label: string; diameterPercent: number }[] = [
  { weight: 25, color: 'Red', hex: '#dc2626', label: '25 KG', diameterPercent: 100 },
  { weight: 20, color: 'Blue', hex: '#2563eb', label: '20 KG', diameterPercent: 95 },
  { weight: 15, color: 'Yellow', hex: '#eab308', label: '15 KG', diameterPercent: 85 },
  { weight: 10, color: 'Green', hex: '#16a34a', label: '10 KG', diameterPercent: 75 },
  { weight: 5, color: 'White', hex: '#f8fafc', label: '5 KG', diameterPercent: 62 },
  { weight: 2.5, color: 'Black', hex: '#334155', label: '2.5 KG', diameterPercent: 50 },
  { weight: 1.25, color: 'Silver', hex: '#94a3b8', label: '1.25 KG', diameterPercent: 40 },
];

export const STANDARD_PLATES_LB: { weight: number; color: string; hex: string; label: string; diameterPercent: number }[] = [
  { weight: 45, color: 'Red / Standard', hex: '#dc2626', label: '45 LB', diameterPercent: 100 },
  { weight: 35, color: 'Blue', hex: '#2563eb', label: '35 LB', diameterPercent: 90 },
  { weight: 25, color: 'Yellow', hex: '#eab308', label: '25 LB', diameterPercent: 80 },
  { weight: 10, color: 'Green', hex: '#16a34a', label: '10 LB', diameterPercent: 68 },
  { weight: 5, color: 'White', hex: '#f8fafc', label: '5 LB', diameterPercent: 54 },
  { weight: 2.5, color: 'Black', hex: '#334155', label: '2.5 LB', diameterPercent: 44 },
];

export function calculatePlates(
  targetWeight: number,
  barWeight: number,
  unit: WeightUnit,
  availablePlatesMap?: Record<number, boolean>
): PlateLoaderResult {
  const plateDefs = unit === 'KG' ? STANDARD_PLATES_KG : STANDARD_PLATES_LB;

  if (targetWeight <= barWeight) {
    return {
      targetWeight,
      barWeight,
      weightToLoad: 0,
      weightPerSide: 0,
      actualLoadedWeight: barWeight,
      difference: barWeight - targetWeight,
      platesPerSide: [],
      totalPlatesCount: 0,
      unit,
    };
  }

  const weightToLoad = targetWeight - barWeight;
  let remainingPerSide = weightToLoad / 2;
  const platesPerSide: PlateCount[] = [];
  let totalPlates = 0;

  // Filter available plates
  const activePlates = plateDefs.filter((p) => (availablePlatesMap ? availablePlatesMap[p.weight] !== false : true));

  for (const plate of activePlates) {
    if (remainingPerSide >= plate.weight) {
      const count = Math.floor(remainingPerSide / plate.weight);
      if (count > 0) {
        platesPerSide.push({
          weight: plate.weight,
          count,
          color: plate.hex,
          label: plate.label,
          diameterPercent: plate.diameterPercent,
        });
        remainingPerSide = Math.round((remainingPerSide - count * plate.weight) * 100) / 100;
        totalPlates += count * 2;
      }
    }
  }

  const loadedPerSide = platesPerSide.reduce((acc, p) => acc + p.weight * p.count, 0);
  const actualLoadedWeight = barWeight + loadedPerSide * 2;
  const difference = Math.round((actualLoadedWeight - targetWeight) * 100) / 100;

  return {
    targetWeight,
    barWeight,
    weightToLoad,
    weightPerSide: loadedPerSide,
    actualLoadedWeight,
    difference,
    platesPerSide,
    totalPlatesCount: totalPlates,
    unit,
  };
}

export function convertWeight(weight: number, from: WeightUnit, to: WeightUnit): number {
  if (from === to) return weight;
  if (from === 'KG' && to === 'LB') {
    return Math.round(weight * 2.20462 * 10) / 10;
  }
  return Math.round((weight / 2.20462) * 10) / 10;
}
