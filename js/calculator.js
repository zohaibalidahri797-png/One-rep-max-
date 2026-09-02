import { FORMULAS_DATA } from './data.js';

// Standard Olympic Plate Configurations
export const STANDARD_PLATES_KG = [
  { weight: 25, color: '#dc2626', hex: '#dc2626', label: '25 kg (Red)', diameterPercent: 100 },
  { weight: 20, color: '#2563eb', hex: '#2563eb', label: '20 kg (Blue)', diameterPercent: 100 },
  { weight: 15, color: '#eab308', hex: '#eab308', label: '15 kg (Yellow)', diameterPercent: 90 },
  { weight: 10, color: '#16a34a', hex: '#16a34a', label: '10 kg (Green)', diameterPercent: 75 },
  { weight: 5, color: '#ffffff', hex: '#ffffff', label: '5 kg (White)', diameterPercent: 55 },
  { weight: 2.5, color: '#000000', hex: '#334155', label: '2.5 kg (Black)', diameterPercent: 45 },
  { weight: 1.25, color: '#94a3b8', hex: '#94a3b8', label: '1.25 kg (Silver)', diameterPercent: 35 },
  { weight: 0.5, color: '#64748b', hex: '#64748b', label: '0.5 kg (Micro)', diameterPercent: 28 },
];

export const STANDARD_PLATES_LB = [
  { weight: 45, color: '#2563eb', hex: '#2563eb', label: '45 lb (Blue)', diameterPercent: 100 },
  { weight: 35, color: '#eab308', hex: '#eab308', label: '35 lb (Yellow)', diameterPercent: 90 },
  { weight: 25, color: '#16a34a', hex: '#16a34a', label: '25 lb (Green)', diameterPercent: 75 },
  { weight: 10, color: '#ffffff', hex: '#ffffff', label: '10 lb (White)', diameterPercent: 55 },
  { weight: 5, color: '#000000', hex: '#334155', label: '5 lb (Black)', diameterPercent: 45 },
  { weight: 2.5, color: '#94a3b8', hex: '#94a3b8', label: '2.5 lb (Silver)', diameterPercent: 35 },
];

/**
 * Calculate 1RM using a specific formula
 */
export function calculateFormula1RM(weight, reps, formula) {
  if (reps <= 0 || weight <= 0) return 0;
  if (reps === 1) return weight;

  let oneRepMax = 0;

  switch (formula) {
    case 'epley':
      oneRepMax = weight * (1 + reps / 30);
      break;
    case 'brzycki':
      oneRepMax = weight * (36 / (37 - reps));
      break;
    case 'mayhew':
      oneRepMax = (100 * weight) / (52.2 + 41.9 * Math.exp(-0.055 * reps));
      break;
    case 'lombardi':
      oneRepMax = weight * Math.pow(reps, 0.1);
      break;
    case 'oconner':
      oneRepMax = weight * (1 + 0.025 * reps);
      break;
    case 'wathan':
      oneRepMax = (100 * weight) / (48.8 + 53.8 * Math.exp(-0.075 * reps));
      break;
    case 'lander':
      oneRepMax = (100 * weight) / (101.3 - 2.67123 * reps);
      break;
    case 'average': {
      const e = weight * (1 + reps / 30);
      const b = reps < 37 ? weight * (36 / (37 - reps)) : e;
      const m = (100 * weight) / (52.2 + 41.9 * Math.exp(-0.055 * reps));
      const l = weight * Math.pow(reps, 0.1);
      const o = weight * (1 + 0.025 * reps);
      const w = (100 * weight) / (48.8 + 53.8 * Math.exp(-0.075 * reps));
      const la = (100 * weight) / (101.3 - 2.67123 * reps);
      oneRepMax = (e + b + m + l + o + w + la) / 7;
      break;
    }
    default:
      oneRepMax = weight * (1 + reps / 30);
  }

  return Math.round(oneRepMax * 10) / 10;
}

/**
 * Compute full calculation including 7-formula breakdown
 */
export function computeFullCalculation(weight, reps, unit, exerciseName, formula = 'average') {
  const oneRepMax = calculateFormula1RM(weight, reps, formula);
  const foundFormula = FORMULAS_DATA.find((f) => f.id === formula);
  const formulaName = formula === 'average' ? '7-Formula Scientific Mean' : (foundFormula ? foundFormula.name : 'Scientific Model');

  const formulaBreakdown = FORMULAS_DATA.map((f) => ({
    id: f.id,
    name: f.name,
    calculated1RM: calculateFormula1RM(weight, reps, f.id),
    formulaDisplay: f.formulaDisplay,
    bestFor: f.bestFor,
  }));

  return {
    oneRepMax,
    weight,
    reps,
    unit,
    exercise: exerciseName,
    formulaUsed: formula,
    formulaName,
    formulaBreakdown,
  };
}

/**
 * Generate standard training percentages (PBT) table
 */
export function generateTrainingPercentages(oneRepMax, unit) {
  const roundIncrement = unit === 'KG' ? 0.5 : 1;

  const percentageMatrix = [
    { pct: 100, reps: '1 Rep (Max Effort)', velocity: '< 0.15 m/s', desc: 'Absolute peak single repetition capacity.' },
    { pct: 95, reps: '1–2 Reps', velocity: '0.15–0.25 m/s', desc: 'Peak neural drive & competition simulation.' },
    { pct: 90, reps: '2–3 Reps', velocity: '0.25–0.35 m/s', desc: 'High neuromuscular recruitment & max strength.' },
    { pct: 85, reps: '4–5 Reps', velocity: '0.35–0.45 m/s', desc: 'Myofibrillar hypertrophy & heavy strength.' },
    { pct: 80, reps: '6–8 Reps', velocity: '0.45–0.55 m/s', desc: 'Hypertrophic accumulation & structural volume.' },
    { pct: 75, reps: '8–10 Reps', velocity: '0.55–0.65 m/s', desc: 'Sarcoplasmic hypertrophy & muscular endurance.' },
    { pct: 70, reps: '10–12 Reps', velocity: '0.65–0.75 m/s', desc: 'Volume accumulation & technique refinement.' },
    { pct: 65, reps: '12–15 Reps', velocity: '0.75–0.85 m/s', desc: 'Local muscular endurance & conditioning.' },
    { pct: 60, reps: '15+ Reps', velocity: '0.85–1.00 m/s', desc: 'Dynamic effort speed-strength & deloading.' },
    { pct: 50, reps: 'Speed / Deload', velocity: '> 1.00 m/s', desc: 'Active recovery, warm-ups, & explosive speed.' },
  ];

  return percentageMatrix.map((row) => {
    const rawWeight = (oneRepMax * row.pct) / 100;
    const roundedWeight = Math.round(rawWeight / roundIncrement) * roundIncrement;

    return {
      percentage: row.pct,
      weight: roundedWeight,
      repsEstimate: row.reps,
      velocityZone: row.velocity,
      description: row.desc,
    };
  });
}

/**
 * Generate 1RM through 15RM Matrix
 */
export function generateRepMaxTable(oneRepMax, unit) {
  const roundIncrement = unit === 'KG' ? 0.5 : 1;
  const rows = [];

  for (let r = 1; r <= 15; r++) {
    // Epley inverse factor
    const percentage = Math.round((1 / (1 + r / 30)) * 1000) / 10;
    const rawWeight = (oneRepMax * percentage) / 100;
    const weight = Math.round(rawWeight / roundIncrement) * roundIncrement;

    rows.push({
      reps: r,
      weight,
      percentage,
    });
  }

  return rows;
}

/**
 * Generate structured progressive warm-up ladder sets
 */
export function generateWarmupSets(oneRepMax, unit) {
  const barWeight = unit === 'KG' ? 20 : 45;
  const roundIncrement = unit === 'KG' ? 2.5 : 5;

  const roundToPlate = (w) => Math.max(barWeight, Math.round(w / roundIncrement) * roundIncrement);

  return [
    {
      setNumber: 1,
      percentage: 0,
      weight: barWeight,
      reps: 10,
      purpose: 'Barbell Path & Joint Lubrication (Empty Bar)',
      restSeconds: 45,
    },
    {
      setNumber: 2,
      percentage: 45,
      weight: roundToPlate(oneRepMax * 0.45),
      reps: 5,
      purpose: 'Motor Unit Recruitment & Groove Activation',
      restSeconds: 60,
    },
    {
      setNumber: 3,
      percentage: 65,
      weight: roundToPlate(oneRepMax * 0.65),
      reps: 3,
      purpose: 'Force Production & Kinetic Stabilization',
      restSeconds: 90,
    },
    {
      setNumber: 4,
      percentage: 80,
      weight: roundToPlate(oneRepMax * 0.8),
      reps: 2,
      purpose: 'CNS Potentiation & Tension Acclimation',
      restSeconds: 120,
    },
    {
      setNumber: 5,
      percentage: 90,
      weight: roundToPlate(oneRepMax * 0.9),
      reps: 1,
      purpose: 'Single Primer / Final Calibration',
      restSeconds: 180,
    },
    {
      setNumber: 6,
      percentage: 100,
      weight: Math.round(oneRepMax / (unit === 'KG' ? 0.5 : 1)) * (unit === 'KG' ? 0.5 : 1),
      reps: 1,
      purpose: 'Calculated 1RM Target Attempt',
      restSeconds: 300,
    },
  ];
}

/**
 * Calculate per-sleeve Olympic barbell plate distribution
 */
export function calculatePlates(targetWeight, barWeight, unit, availablePlatesConfig = {}) {
  const standardPlates = unit === 'KG' ? STANDARD_PLATES_KG : STANDARD_PLATES_LB;

  if (targetWeight <= barWeight) {
    return {
      targetWeight,
      barWeight,
      weightPerSide: 0,
      platesPerSide: [],
      remainderWeight: 0,
      totalLoadedWeight: barWeight,
    };
  }

  const weightNeeded = targetWeight - barWeight;
  const weightPerSideTarget = weightNeeded / 2;
  let remainingPerSide = weightPerSideTarget;

  const platesPerSide = [];

  for (const plateDef of standardPlates) {
    if (availablePlatesConfig[plateDef.weight] === false) {
      continue;
    }

    if (remainingPerSide >= plateDef.weight) {
      const count = Math.floor(remainingPerSide / plateDef.weight);
      if (count > 0) {
        platesPerSide.push({
          weight: plateDef.weight,
          color: plateDef.color,
          label: plateDef.label,
          diameterPercent: plateDef.diameterPercent,
          count,
        });
        remainingPerSide = Math.round((remainingPerSide - count * plateDef.weight) * 100) / 100;
      }
    }
  }

  const actualPerSide = weightPerSideTarget - remainingPerSide;
  const totalLoadedWeight = barWeight + actualPerSide * 2;

  return {
    targetWeight,
    barWeight,
    weightPerSide: actualPerSide,
    platesPerSide,
    remainderWeight: remainingPerSide * 2,
    totalLoadedWeight,
  };
}
