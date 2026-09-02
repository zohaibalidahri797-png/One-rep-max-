export type WeightUnit = 'KG' | 'LB';

export type FormulaType =
  | 'epley'
  | 'brzycki'
  | 'lombardi'
  | 'mayhew'
  | 'oconner'
  | 'wathan'
  | 'lander'
  | 'average';

export interface FormulaInfo {
  id: FormulaType;
  name: string;
  author: string;
  year: number;
  formulaDisplay: string;
  description: string;
  bestFor: string;
  repRange: string;
}

export interface ExerciseInfo {
  id: string;
  name: string;
  category: 'Upper Body Push' | 'Upper Body Pull' | 'Lower Body Quad' | 'Lower Body Posterior' | 'Compound';
  primaryMuscles: string[];
  recommendedFormula: FormulaType;
  defaultWeightKg: number;
  defaultWeightLb: number;
  defaultReps: number;
  description: string;
  image?: string;
  cues: string[];
}

export interface CalculationResult {
  oneRepMax: number;
  weight: number;
  reps: number;
  unit: WeightUnit;
  exercise: string;
  formula: FormulaType;
  formulaName: string;
  allFormulas: {
    formula: FormulaType;
    name: string;
    value: number;
    difference: number;
  }[];
  timestamp: string;
}

export interface PercentageRow {
  percentage: number;
  weight: number;
  repsEstimate: string;
  velocityZone: string;
  trainingGoal: string;
  description: string;
}

export interface RepMaxRow {
  reps: number;
  percentage: number;
  weight: number;
}

export interface WarmupSet {
  setNumber: number;
  percentage: number;
  weight: number;
  reps: number;
  purpose: string;
  restSeconds: number;
}

export interface PlateCount {
  weight: number;
  count: number;
  color: string;
  label: string;
  diameterPercent: number; // for visual scaling in barbell
}

export interface PlateLoaderResult {
  targetWeight: number;
  barWeight: number;
  weightToLoad: number;
  weightPerSide: number;
  actualLoadedWeight: number;
  difference: number;
  platesPerSide: PlateCount[];
  totalPlatesCount: number;
  unit: WeightUnit;
}

export interface SavedRecord {
  id: string;
  date: string;
  exercise: string;
  oneRepMax: number;
  weight: number;
  reps: number;
  unit: WeightUnit;
  formula: string;
  notes?: string;
}
