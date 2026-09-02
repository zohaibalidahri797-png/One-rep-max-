import { ExerciseInfo } from '../types';

export const EXERCISES: ExerciseInfo[] = [
  {
    id: 'bench-press',
    name: 'Barbell Bench Press',
    category: 'Upper Body Push',
    primaryMuscles: ['Pectoralis Major', 'Anterior Deltoids', 'Triceps Brachii'],
    recommendedFormula: 'mayhew',
    defaultWeightKg: 100,
    defaultWeightLb: 225,
    defaultReps: 5,
    description: 'The definitive horizontal pressing test of upper-body power and pectoral engagement. Optimal bar path follows a subtle J-curve with scapular retraction.',
    image: '/assets/hero_bench_press_poster_1788161169588.jpg',
    cues: [
      'Retract and depress scapulae firmly into the bench pad',
      'Maintain active leg drive through flat heels',
      'Control eccentric descent to the lower sternum',
      'Drive aggressively upward while maintaining wrist stacking',
    ],
  },
  {
    id: 'barbell-squat',
    name: 'Barbell Back Squat',
    category: 'Lower Body Quad',
    primaryMuscles: ['Quadriceps', 'Gluteus Maximus', 'Adductors', 'Spinal Erectors'],
    recommendedFormula: 'epley',
    defaultWeightKg: 140,
    defaultWeightLb: 315,
    defaultReps: 5,
    description: 'The king of lower-body compound movements. Demands extreme core brace (Valsalva maneuver), hip mobility, and quad-glute force production.',
    image: '/assets/exercise_squat_1788161199567.jpg',
    cues: [
      'Create 360-degree intra-abdominal pressure with deep belly breath',
      'Break simultaneously at hips and knees',
      'Hit parallel or below while keeping chest proud',
      'Drive through the mid-foot out of the hole without knee collapse',
    ],
  },
  {
    id: 'deadlift',
    name: 'Conventional Deadlift',
    category: 'Lower Body Posterior',
    primaryMuscles: ['Hamstrings', 'Gluteus Maximus', 'Latissimus Dorsi', 'Erector Spinae', 'Trapezius'],
    recommendedFormula: 'epley',
    defaultWeightKg: 180,
    defaultWeightLb: 405,
    defaultReps: 3,
    description: 'Pure raw posterior chain power from a dead stop. Measures total-body neurological strength and grip integrity.',
    image: '/assets/exercise_deadlift_1788161184578.jpg',
    cues: [
      'Bar over mid-foot with shins 1 inch away',
      'Engage lats by pulling the bar into your shins (bend the bar)',
      'Pull slack out of the barbell before leg drive initiation',
      'Push the floor away rather than pulling back with the spine',
    ],
  },
  {
    id: 'overhead-press',
    name: 'Overhead Press (OHP)',
    category: 'Upper Body Push',
    primaryMuscles: ['Deltoids (Anterior & Lateral)', 'Triceps', 'Upper Pectorals', 'Core Stabilizers'],
    recommendedFormula: 'brzycki',
    defaultWeightKg: 65,
    defaultWeightLb: 145,
    defaultReps: 5,
    description: 'The ultimate strict vertical pressing movement. Demands pristine shoulder stability, glute lock, and thoracic extension.',
    image: '/assets/exercise_ohp_1788161214541.jpg',
    cues: [
      'Squeeze glutes and quads to create a rigid kinetic chain',
      'Tuck chin back during initial ascent to clear bar path',
      'Push head forward through the window at lockout',
      'Lock elbows over middle of the head',
    ],
  },
  {
    id: 'barbell-row',
    name: 'Barbell Bent-Over Row',
    category: 'Upper Body Pull',
    primaryMuscles: ['Latissimus Dorsi', 'Rhomboids', 'Rear Deltoids', 'Biceps Brachii'],
    recommendedFormula: 'lombardi',
    defaultWeightKg: 85,
    defaultWeightLb: 185,
    defaultReps: 6,
    description: 'Essential horizontal pulling foundation to balance heavy benching, thicken the upper back, and stabilize scapular rhythm.',
    image: '/assets/exercise_deadlift_1788161184578.jpg',
    cues: [
      'Hinge at hips to a 45-degree or parallel torso angle',
      'Pull with elbows tracking toward hip crease',
      'Squeeze shoulder blades together at apex without jerking spine',
    ],
  },
  {
    id: 'incline-bench',
    name: 'Incline Barbell Bench Press',
    category: 'Upper Body Push',
    primaryMuscles: ['Clavicular Pectoralis (Upper Chest)', 'Anterior Deltoids', 'Triceps'],
    recommendedFormula: 'mayhew',
    defaultWeightKg: 80,
    defaultWeightLb: 175,
    defaultReps: 6,
    description: 'Angled pressing (30°–45°) emphasizing the clavicular head of the pectoralis major and upper-body shoulder stabilization.',
    image: '/assets/hero_bench_press_poster_1788161169588.jpg',
    cues: [
      'Set bench to 30 degrees for maximum upper pec recruitment',
      'Lower bar to upper collarbone/sternum junction',
      'Keep forearms vertical throughout the eccentric phase',
    ],
  },
  {
    id: 'front-squat',
    name: 'Barbell Front Squat',
    category: 'Lower Body Quad',
    primaryMuscles: ['Quadriceps', 'Rectus Abdominis', 'Upper Back / Thoracic Extensors'],
    recommendedFormula: 'wathan',
    defaultWeightKg: 105,
    defaultWeightLb: 235,
    defaultReps: 4,
    description: 'Clean-grip anterior load forcing an upright torso, massive quad isolation, and profound anterior core tension.',
    image: '/assets/exercise_squat_1788161199567.jpg',
    cues: [
      'Drive elbows high and parallel to the floor',
      'Rest barbell in front rack groove across anterior deltoids',
      'Maintain vertical spine throughout full knee flexion',
    ],
  },
  {
    id: 'romanian-deadlift',
    name: 'Romanian Deadlift (RDL)',
    category: 'Lower Body Posterior',
    primaryMuscles: ['Hamstrings', 'Gluteus Maximus', 'Erector Spinae'],
    recommendedFormula: 'lombardi',
    defaultWeightKg: 120,
    defaultWeightLb: 265,
    defaultReps: 8,
    description: 'Controlled eccentric hip hinge building high-threshold hamstring strength and bulletproofing the posterior chain.',
    image: '/assets/exercise_deadlift_1788161184578.jpg',
    cues: [
      'Maintain soft knee bend and push hips backward toward wall',
      'Keep bar skimming thighs and shins',
      'Stop when hips can no longer travel backward',
    ],
  },
];

export const FAQ_LIST = [
  {
    question: 'What is a One Rep Max (1RM)?',
    answer:
      'A One Rep Max (1RM) is the maximum amount of weight an athlete can successfully lift for a single, complete repetition through a full range of motion with standard biomechanical technique. It serves as the gold standard baseline for strength diagnostics, powerlifting classifications, and percentage-based program design.',
  },
  {
    question: 'How accurate is an estimated 1RM compared to a true 1RM test?',
    answer:
      'Submaximal 1RM estimations are typically within 2% to 5% accuracy of an actual true 1RM when calculated from sets between 2 and 6 repetitions performed with high intensity (RPE 9–10). Sets above 10 repetitions experience greater variance due to individual muscular endurance characteristics and fatigue rates.',
  },
  {
    question: 'Which 1RM formula should I use?',
    answer:
      'For general compound lifts (squats and deadlifts), the Epley formula is the most widely validated worldwide. For horizontal presses like the Bench Press, Mayhew et al. is mathematically optimized. For heavy low-rep sets (1–5 reps), Brzycki or Lander provide excellent conservative estimations. Our tool also offers the 7-Formula Average for maximum statistical smoothing.',
  },
  {
    question: 'Can I calculate my 1RM from 5 reps or higher?',
    answer:
      'Yes. 3 to 6 reps is widely considered the "sweet spot" for 1RM estimation because it represents true neurological strength without requiring a dangerous maximal attempt. While 8–12 reps can still be calculated, anaerobic endurance and muscle fiber composition start introducing larger deviances.',
  },
  {
    question: 'Should I test my actual true 1RM in the gym?',
    answer:
      'True 1RM testing places extreme mechanical and neural stress on tendons, joints, and the central nervous system (CNS). Unless preparing for a sanctioned powerlifting meet or Olympic weightlifting event, calculating your 1RM from a heavy 3–5 rep set is safer, reduces injury risk, and avoids interrupting weekly training volume.',
  },
  {
    question: 'What is the difference between calculating in KG vs LB?',
    answer:
      'The underlying mathematical formulas are dimensionless multipliers and work identically in both kilograms and pounds. Our calculator automatically handles precision rounding (to 0.5 kg or 1 lb increments) and optimizes plate loading calculations based on standard IWF metric plates or imperial iron discs.',
  },
  {
    question: 'How often should I calculate or update my 1RM?',
    answer:
      'In a structured periodized program, you should re-evaluate your estimated 1RM at the end of each 4-to-6 week training mesocycle (often following an AMRAP or heavy top set on week 4) to calibrate load progression for your subsequent block.',
  },
  {
    question: 'Can beginners use a One Rep Max calculator?',
    answer:
      'Beginners can use 1RM calculators to gain an objective sense of their strength progress. However, because novice lifters experience rapid motor learning adaptations and technical fluctuations from session to session, they should base their daily training weights on strict linear progression and RPE rather than rigid 1RM percentages.',
  },
];
