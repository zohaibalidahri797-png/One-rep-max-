import { EXERCISES, FORMULAS_DATA } from './data.js';
import {
  calculateFormula1RM,
  computeFullCalculation,
  generateTrainingPercentages,
  generateRepMaxTable,
  generateWarmupSets,
  calculatePlates,
  STANDARD_PLATES_KG,
  STANDARD_PLATES_LB,
} from './calculator.js';

// Application State
const state = {
  exercise: 'bench-press',
  weight: 100,
  reps: 5,
  unit: 'KG',
  formula: 'average',
  activeTab: 'percentages', // percentages | repmax | warmup | plates | formulas
  plateTargetWeight: 100,
  plateBarWeight: 20,
  availablePlates: {},
  showPlateConfig: false,
  warmupCompleted: {},
  restTimerSeconds: null,
  isRestTimerRunning: false,
  restInterval: null,
  savedRecords: [],
};

const STORAGE_KEY = 'one_rep_max_saved_prs_v1';

document.addEventListener('DOMContentLoaded', () => {
  loadSavedRecords();
  initFormControls();
  initTabs();
  initPlateLoaderControls();
  initWarmupTimer();
  recalculateAll();
});

function loadSavedRecords() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      state.savedRecords = JSON.parse(data);
    }
  } catch (e) {
    console.error('Could not load saved PRs', e);
  }
  renderSavedRecords();
}

function saveRecordsToStorage() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.savedRecords));
  } catch (e) {
    console.error('Could not save PRs', e);
  }
  renderSavedRecords();
}

function initFormControls() {
  const exerciseSelect = document.getElementById('exercise-select');
  const weightInput = document.getElementById('weight-input');
  const repsInput = document.getElementById('reps-input');
  const formulaSelect = document.getElementById('formula-select');
  const unitBtnKg = document.getElementById('unit-btn-kg');
  const unitBtnLb = document.getElementById('unit-btn-lb');
  const form = document.getElementById('one-rep-max-form');
  const shareBtn = document.getElementById('share-result-btn');
  const savePrBtn = document.getElementById('save-pr-record-btn');

  // Populate exercise select options
  if (exerciseSelect) {
    exerciseSelect.innerHTML = EXERCISES.map(
      (ex) => `<option value="${ex.id}">${ex.name} (${ex.category})</option>`
    ).join('');
    exerciseSelect.value = state.exercise;

    exerciseSelect.addEventListener('change', (e) => {
      const exId = e.target.value;
      state.exercise = exId;
      const found = EXERCISES.find((ex) => ex.id === exId);
      if (found) {
        state.weight = state.unit === 'KG' ? found.defaultWeightKg : found.defaultWeightLb;
        state.reps = found.defaultReps;
        state.formula = found.recommendedFormula;
        if (weightInput) weightInput.value = state.weight;
        if (repsInput) repsInput.value = state.reps;
        if (formulaSelect) formulaSelect.value = state.formula;
        state.plateTargetWeight = state.weight;
      }
      renderQuickPresets();
      recalculateAll();
    });
  }

  // Populate formulas select options
  if (formulaSelect) {
    let opts = `<option value="average">7-Formula Scientific Average (Highest Reliability)</option>`;
    opts += FORMULAS_DATA.map((f) => `<option value="${f.id}">${f.name} (${f.year}) — ${f.bestFor}</option>`).join('');
    formulaSelect.innerHTML = opts;
    formulaSelect.value = state.formula;

    formulaSelect.addEventListener('change', (e) => {
      state.formula = e.target.value;
      recalculateAll();
    });
  }

  // Weight & Reps inputs
  if (weightInput) {
    weightInput.value = state.weight;
    weightInput.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value);
      state.weight = isNaN(val) ? 0 : Math.max(0, Math.min(1000, val));
      state.plateTargetWeight = state.weight;
      recalculateAll();
    });
  }

  if (repsInput) {
    repsInput.value = state.reps;
    repsInput.addEventListener('input', (e) => {
      const val = parseInt(e.target.value, 10);
      state.reps = isNaN(val) ? 1 : Math.max(1, Math.min(30, val));
      recalculateAll();
    });
  }

  // Unit switch
  if (unitBtnKg && unitBtnLb) {
    unitBtnKg.addEventListener('click', () => setUnit('KG'));
    unitBtnLb.addEventListener('click', () => setUnit('LB'));
  }

  // Form submit
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      recalculateAll();
      const resultCard = document.getElementById('calculator-result-card');
      if (resultCard) {
        resultCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });
  }

  // Share button
  if (shareBtn) {
    shareBtn.addEventListener('click', handleShare);
  }

  // Save PR button
  if (savePrBtn) {
    savePrBtn.addEventListener('click', handleSavePR);
  }

  renderQuickPresets();
}

function setUnit(newUnit) {
  if (state.unit === newUnit) return;
  if (newUnit === 'LB') {
    state.weight = Math.round(state.weight * 2.20462);
    state.plateTargetWeight = Math.round(state.plateTargetWeight * 2.20462);
    state.plateBarWeight = 45;
  } else {
    state.weight = Math.round((state.weight / 2.20462) * 2) / 2;
    state.plateTargetWeight = Math.round((state.plateTargetWeight / 2.20462) * 2) / 2;
    state.plateBarWeight = 20;
  }
  state.unit = newUnit;

  const unitBtnKg = document.getElementById('unit-btn-kg');
  const unitBtnLb = document.getElementById('unit-btn-lb');
  const weightUnitBadge = document.getElementById('weight-unit-badge');
  const weightInput = document.getElementById('weight-input');

  if (unitBtnKg && unitBtnLb) {
    if (state.unit === 'KG') {
      unitBtnKg.className = 'px-3 py-1 text-xs font-bold font-mono rounded-md transition-all bg-[#22c55e] text-[#0a0b0d] shadow-sm';
      unitBtnLb.className = 'px-3 py-1 text-xs font-mono rounded-md transition-all text-[#94a3b8] hover:text-white';
    } else {
      unitBtnLb.className = 'px-3 py-1 text-xs font-bold font-mono rounded-md transition-all bg-[#22c55e] text-[#0a0b0d] shadow-sm';
      unitBtnKg.className = 'px-3 py-1 text-xs font-mono rounded-md transition-all text-[#94a3b8] hover:text-white';
    }
  }

  if (weightUnitBadge) weightUnitBadge.textContent = state.unit;
  if (weightInput) weightInput.value = state.weight;

  renderQuickPresets();
  recalculateAll();
}

function renderQuickPresets() {
  const container = document.getElementById('quick-presets-container');
  if (!container) return;

  const presets = state.unit === 'KG' ? [60, 80, 100, 120, 140, 180] : [135, 185, 225, 275, 315, 405];

  container.innerHTML = presets
    .map(
      (p) => `
      <button
        type="button"
        class="preset-btn px-2.5 py-1 text-xs font-mono rounded-md border transition-all ${
          state.weight === p
            ? 'bg-[#22c55e]/20 border-[#22c55e] text-[#22c55e]'
            : 'bg-[#181b20] border-white/10 text-[#94a3b8] hover:text-white hover:border-white/25'
        }"
        data-weight="${p}"
      >
        ${p} ${state.unit}
      </button>
    `
    )
    .join('');

  container.querySelectorAll('.preset-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const w = parseFloat(btn.dataset.weight);
      state.weight = w;
      state.plateTargetWeight = w;
      const weightInput = document.getElementById('weight-input');
      if (weightInput) weightInput.value = w;
      renderQuickPresets();
      recalculateAll();
    });
  });
}

function initTabs() {
  const tabButtons = document.querySelectorAll('.calc-tab-button');
  tabButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const tab = btn.dataset.tab;
      state.activeTab = tab;

      tabButtons.forEach((b) => {
        if (b.dataset.tab === tab) {
          b.className = 'calc-tab-button px-4 py-2.5 text-xs font-bold uppercase tracking-wider rounded-xl bg-[#22c55e] text-[#0a0b0d] transition-all shadow-md';
        } else {
          b.className = 'calc-tab-button px-4 py-2.5 text-xs font-bold uppercase tracking-wider rounded-xl bg-[#181b20] text-[#94a3b8] hover:text-white border border-white/10 transition-all';
        }
      });

      // Show/hide sections
      const sections = ['percentages', 'repmax', 'warmup', 'plates', 'formulas'];
      sections.forEach((s) => {
        const secEl = document.getElementById(`tab-section-${s}`);
        if (secEl) {
          secEl.classList.toggle('hidden', s !== tab);
        }
      });
    });
  });
}

function recalculateAll() {
  const currentEx = EXERCISES.find((e) => e.id === state.exercise);
  const exerciseName = currentEx ? currentEx.name : 'Barbell Lift';

  const fullResult = computeFullCalculation(
    state.weight,
    state.reps,
    state.unit,
    exerciseName,
    state.formula
  );

  // Update Hero 1RM display with smooth animation
  const resultDisplay = document.getElementById('calc-result-1rm-val');
  const resultUnitDisplay = document.getElementById('calc-result-unit-val');
  const resultFormulaBadge = document.getElementById('calc-result-formula-badge');
  const resultExerciseBadge = document.getElementById('calc-result-exercise-badge');
  const resultWeightRepsText = document.getElementById('calc-result-weight-reps-text');
  const resultIntensityBadge = document.getElementById('calc-result-intensity-badge');
  const resultPrecisionBadge = document.getElementById('calc-result-precision-badge');

  if (resultDisplay) {
    animateValue(resultDisplay, parseFloat(resultDisplay.textContent) || 0, fullResult.oneRepMax, 400);
  }
  if (resultUnitDisplay) resultUnitDisplay.textContent = state.unit;
  if (resultFormulaBadge) resultFormulaBadge.textContent = fullResult.formulaName;
  if (resultExerciseBadge) resultExerciseBadge.textContent = fullResult.exercise;
  if (resultWeightRepsText) {
    resultWeightRepsText.innerHTML = `Calculated from <strong class="text-white">${fullResult.weight} ${fullResult.unit}</strong> for <strong class="text-white">${fullResult.reps} ${fullResult.reps === 1 ? 'rep' : 'reps'}</strong>`;
  }
  if (resultIntensityBadge) {
    resultIntensityBadge.textContent = state.reps <= 3 ? 'Max Strength (≥90%)' : state.reps <= 6 ? 'Strength (85–90%)' : 'Hypertrophy (<85%)';
  }
  if (resultPrecisionBadge) {
    resultPrecisionBadge.textContent = state.reps <= 5 ? '±2.5% High' : state.reps <= 10 ? '±4.0% Moderate' : '±6.5% Wide';
  }

  // Render sub-modules
  renderTrainingPercentages(fullResult.oneRepMax);
  renderRepMaxMatrix(fullResult.oneRepMax);
  renderWarmupProtocol(fullResult.oneRepMax);
  renderFormulaComparison(fullResult);
  renderPlateLoader();
}

function animateValue(element, start, end, duration) {
  let startTimestamp = null;
  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    const easeProgress = 1 - Math.pow(1 - progress, 3);
    const current = start + (end - start) * easeProgress;
    element.textContent = (Math.round(current * 10) / 10).toFixed(1);
    if (progress < 1) {
      window.requestAnimationFrame(step);
    } else {
      element.textContent = end;
    }
  };
  window.requestAnimationFrame(step);
}

// 1. Training Percentages Table
function renderTrainingPercentages(oneRepMax) {
  const container = document.getElementById('training-percentages-table-body');
  if (!container) return;

  const rows = generateTrainingPercentages(oneRepMax, state.unit);
  container.innerHTML = rows
    .map((r) => {
      const isMax = r.percentage === 100;
      const isHeavy = r.percentage >= 85;
      return `
      <tr class="group transition-colors ${isMax ? 'bg-[#22c55e]/5 hover:bg-[#22c55e]/10' : 'hover:bg-white/[0.03]'}">
        <td class="py-3.5 px-4 font-mono">
          <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
            isMax ? 'bg-[#22c55e] text-[#0a0b0d]' : isHeavy ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-white/10 text-white'
          }">
            ${r.percentage}%
          </span>
        </td>
        <td class="py-3.5 px-4">
          <span class="font-heading font-extrabold text-base text-white group-hover:text-[#22c55e] transition-colors font-mono-num">
            ${r.weight}
          </span>
          <span class="text-xs text-[#64748b] font-mono uppercase">${state.unit}</span>
        </td>
        <td class="py-3.5 px-4 text-xs font-mono text-[#94a3b8] hidden sm:table-cell">${r.repsEstimate}</td>
        <td class="py-3.5 px-4 text-xs text-[#cbd5e1] hidden md:table-cell font-semibold">${r.velocityZone}</td>
        <td class="py-3.5 px-4 text-xs text-[#94a3b8] hidden lg:table-cell">${r.description}</td>
        <td class="py-3.5 px-4 text-right">
          <button
            type="button"
            class="load-plate-btn inline-flex items-center space-x-1 px-2.5 py-1 rounded-md text-[11px] font-mono font-semibold bg-[#181b20] border border-white/10 text-[#94a3b8] group-hover:text-white group-hover:border-[#22c55e]/40 hover:bg-[#22c55e]/10 transition-all cursor-pointer"
            data-weight="${r.weight}"
          >
            <span>Plates</span>
          </button>
        </td>
      </tr>
    `;
    })
    .join('');

  container.querySelectorAll('.load-plate-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetW = parseFloat(btn.dataset.weight);
      state.plateTargetWeight = targetW;
      // Switch tab to plates
      const platesTabBtn = document.querySelector('.calc-tab-button[data-tab="plates"]');
      if (platesTabBtn) platesTabBtn.click();
      renderPlateLoader();
      const plateCard = document.getElementById('plate-loader-card');
      if (plateCard) plateCard.scrollIntoView({ behavior: 'smooth' });
    });
  });
}

// 2. Rep Max Matrix (1RM to 15RM)
function renderRepMaxMatrix(oneRepMax) {
  const container = document.getElementById('rep-max-grid-container');
  if (!container) return;

  const rows = generateRepMaxTable(oneRepMax, state.unit);
  container.innerHTML = rows
    .map((r) => {
      const isSingle = r.reps === 1;
      return `
      <div
        class="rep-max-card p-4 rounded-xl border transition-all relative overflow-hidden group cursor-pointer ${
          isSingle
            ? 'bg-[#181b20] border-[#22c55e]/40 shadow-lg shadow-[#22c55e]/5'
            : 'bg-[#111317] border-white/10 hover:border-white/20 hover:bg-[#181b20]'
        }"
        data-weight="${r.weight}"
      >
        <div class="flex items-center justify-between">
          <span class="text-xs font-mono font-bold px-2 py-0.5 rounded-md ${
            isSingle ? 'bg-[#22c55e] text-[#0a0b0d]' : 'bg-white/10 text-white'
          }">
            ${r.reps} ${r.reps === 1 ? 'REP (1RM)' : `REPS (${r.reps}RM)`}
          </span>
          <span class="text-[11px] font-mono text-[#94a3b8]">${r.percentage}%</span>
        </div>
        <div class="mt-3 flex items-baseline space-x-1.5">
          <span class="font-heading font-extrabold text-2xl text-white font-mono-num group-hover:text-[#22c55e] transition-colors">
            ${r.weight}
          </span>
          <span class="text-xs text-[#64748b] font-mono uppercase">${state.unit}</span>
        </div>
        <div class="mt-3 w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
          <div class="h-full rounded-full ${isSingle ? 'bg-[#22c55e]' : 'bg-emerald-500/70 group-hover:bg-[#22c55e]'}" style="width: ${r.percentage}%"></div>
        </div>
      </div>
    `;
    })
    .join('');

  container.querySelectorAll('.rep-max-card').forEach((card) => {
    card.addEventListener('click', () => {
      const w = parseFloat(card.dataset.weight);
      state.plateTargetWeight = w;
      const platesTabBtn = document.querySelector('.calc-tab-button[data-tab="plates"]');
      if (platesTabBtn) platesTabBtn.click();
      renderPlateLoader();
      const plateCard = document.getElementById('plate-loader-card');
      if (plateCard) plateCard.scrollIntoView({ behavior: 'smooth' });
    });
  });
}

// 3. Warm-up Protocol
function renderWarmupProtocol(oneRepMax) {
  const container = document.getElementById('warmup-ladder-container');
  if (!container) return;

  const sets = generateWarmupSets(oneRepMax, state.unit);
  container.innerHTML = sets
    .map((s) => {
      const isDone = state.warmupCompleted[s.setNumber] === true;
      const isTarget = s.setNumber === sets.length;

      return `
      <div
        class="warmup-row p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
          isDone
            ? 'bg-[#181b20]/50 border-white/5 opacity-65'
            : isTarget
            ? 'bg-[#181b20] border-[#22c55e]/40 shadow-md'
            : 'bg-[#111317] border-white/10 hover:border-white/20'
        }"
        data-set="${s.setNumber}"
      >
        <div class="flex items-start sm:items-center space-x-3.5">
          <button
            type="button"
            class="warmup-check-btn w-6 h-6 rounded-lg border flex items-center justify-center transition-all shrink-0 mt-0.5 sm:mt-0 cursor-pointer ${
              isDone ? 'bg-[#22c55e] border-[#22c55e] text-[#0a0b0d]' : 'border-white/20 hover:border-[#22c55e]'
            }"
            data-set="${s.setNumber}"
            data-rest="${s.restSeconds}"
            aria-label="Toggle set ${s.setNumber}"
          >
            ${isDone ? '<span class="text-xs font-bold">✓</span>' : ''}
          </button>
          <div>
            <div class="flex items-center space-x-2">
              <span class="text-xs font-mono font-bold uppercase tracking-wider text-white">SET 0${s.setNumber}</span>
              <span class="text-[11px] font-mono text-[#64748b]">${s.percentage === 0 ? 'Empty Bar' : `${s.percentage}% of 1RM`}</span>
            </div>
            <p class="text-xs text-[#94a3b8] mt-0.5">${s.purpose}</p>
          </div>
        </div>

        <div class="flex items-center justify-between sm:justify-end space-x-5 pl-9 sm:pl-0">
          <div class="text-right">
            <div class="flex items-baseline space-x-1 justify-end">
              <span class="font-heading font-extrabold text-xl text-white font-mono-num">${s.weight}</span>
              <span class="text-xs font-mono text-[#64748b]">${state.unit}</span>
            </div>
            <span class="text-xs font-mono text-[#22c55e]">${s.reps} ${s.reps === 1 ? 'rep' : 'reps'}</span>
          </div>
          <button
            type="button"
            class="warmup-timer-btn px-2.5 py-1.5 rounded-lg bg-[#181b20] border border-white/10 hover:border-[#22c55e]/40 hover:bg-[#22c55e]/10 text-xs font-mono text-[#94a3b8] hover:text-white transition-all flex items-center space-x-1 cursor-pointer"
            data-rest="${s.restSeconds}"
          >
            <span>⏱ ${s.restSeconds}s</span>
          </button>
        </div>
      </div>
    `;
    })
    .join('');

  container.querySelectorAll('.warmup-check-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const setNum = parseInt(btn.dataset.set, 10);
      const restSec = parseInt(btn.dataset.rest, 10);
      state.warmupCompleted[setNum] = !state.warmupCompleted[setNum];
      if (state.warmupCompleted[setNum]) {
        startRestTimer(restSec);
      }
      renderWarmupProtocol(oneRepMax);
    });
  });

  container.querySelectorAll('.warmup-timer-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const restSec = parseInt(btn.dataset.rest, 10);
      startRestTimer(restSec);
    });
  });
}

function initWarmupTimer() {
  const pauseBtn = document.getElementById('warmup-timer-pause-btn');
  const resetBtn = document.getElementById('warmup-timer-reset-btn');

  if (pauseBtn) {
    pauseBtn.addEventListener('click', () => {
      state.isRestTimerRunning = !state.isRestTimerRunning;
      pauseBtn.textContent = state.isRestTimerRunning ? '⏸' : '▶';
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      clearInterval(state.restInterval);
      state.restTimerSeconds = null;
      state.isRestTimerRunning = false;
      const widget = document.getElementById('warmup-rest-timer-widget');
      if (widget) widget.classList.add('hidden');
    });
  }
}

function startRestTimer(seconds) {
  if (state.restInterval) clearInterval(state.restInterval);
  state.restTimerSeconds = seconds;
  state.isRestTimerRunning = true;

  const widget = document.getElementById('warmup-rest-timer-widget');
  const display = document.getElementById('warmup-timer-display');
  if (widget) widget.classList.remove('hidden');

  updateTimerDisplay();

  state.restInterval = setInterval(() => {
    if (state.isRestTimerRunning && state.restTimerSeconds !== null) {
      if (state.restTimerSeconds > 0) {
        state.restTimerSeconds -= 1;
        updateTimerDisplay();
      } else {
        clearInterval(state.restInterval);
        state.isRestTimerRunning = false;
        if (display) display.textContent = '0:00 (Ready!)';
      }
    }
  }, 1000);
}

function updateTimerDisplay() {
  const display = document.getElementById('warmup-timer-display');
  if (!display || state.restTimerSeconds === null) return;
  const m = Math.floor(state.restTimerSeconds / 60);
  const s = state.restTimerSeconds % 60;
  display.textContent = `${m}:${s.toString().padStart(2, '0')}`;
  if (state.restTimerSeconds <= 10) {
    display.className = 'font-bold font-mono-num text-sm text-amber-400 animate-pulse';
  } else {
    display.className = 'font-bold font-mono-num text-sm text-white';
  }
}

// 4. Plate Loader
function initPlateLoaderControls() {
  const minusBtn = document.getElementById('plate-minus-btn');
  const plusBtn = document.getElementById('plate-plus-btn');
  const plateTargetInput = document.getElementById('plate-target-input');
  const toggleConfigBtn = document.getElementById('plate-toggle-config-btn');
  const resetPlatesBtn = document.getElementById('plate-reset-inventory-btn');

  if (minusBtn) {
    minusBtn.addEventListener('click', () => {
      const step = state.unit === 'KG' ? 2.5 : 5;
      state.plateTargetWeight = Math.max(state.plateBarWeight, state.plateTargetWeight - step);
      if (plateTargetInput) plateTargetInput.value = state.plateTargetWeight;
      renderPlateLoader();
    });
  }

  if (plusBtn) {
    plusBtn.addEventListener('click', () => {
      const step = state.unit === 'KG' ? 2.5 : 5;
      state.plateTargetWeight += step;
      if (plateTargetInput) plateTargetInput.value = state.plateTargetWeight;
      renderPlateLoader();
    });
  }

  if (plateTargetInput) {
    plateTargetInput.value = state.plateTargetWeight;
    plateTargetInput.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value);
      state.plateTargetWeight = isNaN(val) ? 0 : Math.max(0, val);
      renderPlateLoader();
    });
  }

  if (toggleConfigBtn) {
    toggleConfigBtn.addEventListener('click', () => {
      state.showPlateConfig = !state.showPlateConfig;
      const configPanel = document.getElementById('plate-config-panel');
      if (configPanel) configPanel.classList.toggle('hidden', !state.showPlateConfig);
      toggleConfigBtn.textContent = state.showPlateConfig ? 'Hide Config' : 'Inventory & Bar';
    });
  }

  if (resetPlatesBtn) {
    resetPlatesBtn.addEventListener('click', () => {
      state.availablePlates = {};
      renderPlateConfigOptions();
      renderPlateLoader();
    });
  }

  renderPlateConfigOptions();
}

function renderPlateConfigOptions() {
  const barContainer = document.getElementById('plate-bar-options-container');
  const inventoryContainer = document.getElementById('plate-inventory-container');

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

  const barOpts = state.unit === 'KG' ? quickBarsKg : quickBarsLb;

  if (barContainer) {
    barContainer.innerHTML = barOpts
      .map(
        (opt) => `
      <button
        type="button"
        class="plate-bar-btn p-2 rounded-lg border text-left text-xs transition-all ${
          state.plateBarWeight === opt.weight
            ? 'bg-[#22c55e]/20 border-[#22c55e] text-white'
            : 'bg-[#111317] border-white/10 text-[#94a3b8] hover:text-white'
        }"
        data-weight="${opt.weight}"
      >
        <div class="font-bold">${opt.weight} ${state.unit}</div>
        <div class="text-[10px] text-[#64748b] truncate">${opt.label}</div>
      </button>
    `
      )
      .join('');

    barContainer.querySelectorAll('.plate-bar-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        state.plateBarWeight = parseFloat(btn.dataset.weight);
        renderPlateConfigOptions();
        renderPlateLoader();
      });
    });
  }

  if (inventoryContainer) {
    const plates = state.unit === 'KG' ? STANDARD_PLATES_KG : STANDARD_PLATES_LB;
    inventoryContainer.innerHTML = plates
      .map((p) => {
        const isEnabled = state.availablePlates[p.weight] !== false;
        return `
        <button
          type="button"
          class="plate-toggle-btn px-3 py-1.5 rounded-lg border text-xs font-mono font-bold flex items-center space-x-2 transition-all ${
            isEnabled ? 'bg-[#111317] border-white/20 text-white' : 'bg-[#111317]/50 border-white/5 text-[#64748b] line-through'
          }"
          data-weight="${p.weight}"
        >
          <span class="w-3 h-3 rounded-full shrink-0" style="background-color: ${p.hex}"></span>
          <span>${p.label}</span>
        </button>
      `;
      })
      .join('');

    inventoryContainer.querySelectorAll('.plate-toggle-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const w = parseFloat(btn.dataset.weight);
        state.availablePlates[w] = state.availablePlates[w] === undefined ? false : !state.availablePlates[w];
        renderPlateConfigOptions();
        renderPlateLoader();
      });
    });
  }
}

function renderPlateLoader() {
  const result = calculatePlates(
    state.plateTargetWeight,
    state.plateBarWeight,
    state.unit,
    state.availablePlates
  );

  const perSideEl = document.getElementById('plate-per-side-display');
  const barWeightEl = document.getElementById('plate-bar-weight-display');
  const sleeveContainer = document.getElementById('barbell-sleeve-render');
  const checklistContainer = document.getElementById('plate-checklist-container');

  if (perSideEl) perSideEl.textContent = result.weightPerSide;
  if (barWeightEl) barWeightEl.textContent = result.barWeight;

  if (sleeveContainer) {
    if (result.platesPerSide.length === 0) {
      sleeveContainer.innerHTML = `
        <div class="text-center space-y-1 py-6">
          <span class="text-sm font-bold text-white block">Empty Barbell (${state.plateBarWeight} ${state.unit})</span>
          <p class="text-xs text-[#94a3b8]">No plates required on either sleeve for this target weight.</p>
        </div>
      `;
    } else {
      let platesHTML = '';
      result.platesPerSide.forEach((group) => {
        const heightPx = Math.max(50, Math.round((group.diameterPercent / 100) * 120));
        const widthPx = group.weight >= 20 ? 22 : group.weight >= 10 ? 18 : 14;

        for (let i = 0; i < group.count; i++) {
          platesHTML += `
            <div
              class="relative group flex items-center justify-center transition-transform hover:scale-105"
              style="height: ${heightPx}px; width: ${widthPx}px;"
            >
              <div
                class="w-full h-full rounded-sm shadow-xl flex items-center justify-center border border-white/20 relative"
                style="background-color: ${group.color}; box-shadow: 0 0 12px ${group.color}40;"
              >
                <span class="rotate-90 text-[8px] sm:text-[9px] font-mono font-black text-white/90 whitespace-nowrap drop-shadow">
                  ${group.weight}
                </span>
              </div>
            </div>
          `;
        }
      });

      sleeveContainer.innerHTML = `
        <div class="flex items-center space-x-1 sm:space-x-1.5 min-w-max px-4">
          <div class="w-16 sm:w-28 h-5 bg-gradient-to-b from-slate-400 via-slate-200 to-slate-500 rounded-l-sm shadow-md border-r border-slate-700 relative flex items-center justify-center">
            <span class="text-[9px] font-mono font-extrabold text-slate-800 tracking-wider uppercase">SHAFT</span>
          </div>
          <div class="w-4 sm:w-5 h-16 bg-gradient-to-r from-slate-500 via-slate-300 to-slate-600 rounded-sm border border-slate-400/50 shadow-inner"></div>
          ${platesHTML}
          <div class="w-8 sm:w-12 h-5 bg-gradient-to-b from-slate-400 via-slate-200 to-slate-500 rounded-r-md shadow-md border-l border-slate-700"></div>
        </div>
      `;
    }
  }

  if (checklistContainer) {
    if (result.platesPerSide.length === 0) {
      checklistContainer.innerHTML = `<span class="text-xs text-[#64748b] col-span-4">Empty bar only.</span>`;
    } else {
      checklistContainer.innerHTML = result.platesPerSide
        .map(
          (p) => `
        <div class="bg-[#181b20] border border-white/10 rounded-xl p-3 flex items-center justify-between">
          <div class="flex items-center space-x-2">
            <div class="w-3 h-3 rounded-full" style="background-color: ${p.color}"></div>
            <span class="text-xs font-mono font-bold text-white">${p.label}</span>
          </div>
          <span class="text-xs font-mono font-bold px-2 py-0.5 rounded bg-white/10 text-[#22c55e]">× ${p.count}</span>
        </div>
      `
        )
        .join('');
    }
  }
}

// 5. 7 Scientific Formulas Comparison
function renderFormulaComparison(fullResult) {
  const container = document.getElementById('formula-comparison-grid');
  if (!container) return;

  const allVals = fullResult.formulaBreakdown.map((f) => f.calculated1RM);
  const minVal = Math.min(...allVals);
  const maxVal = Math.max(...allVals);
  const avgVal = Math.round((allVals.reduce((a, b) => a + b, 0) / allVals.length) * 10) / 10;

  const minEl = document.getElementById('formula-min-val');
  const avgEl = document.getElementById('formula-avg-val');
  const maxEl = document.getElementById('formula-max-val');
  if (minEl) minEl.textContent = minVal;
  if (avgEl) avgEl.textContent = avgVal;
  if (maxEl) maxEl.textContent = maxVal;

  container.innerHTML = fullResult.formulaBreakdown
    .map((item) => {
      const isSelected = state.formula === item.id;
      const diffFromAvg = Math.round((item.calculated1RM - avgVal) * 10) / 10;
      const fDef = FORMULAS_DATA.find((f) => f.id === item.id);

      return `
      <div
        class="formula-card p-5 rounded-2xl border transition-all cursor-pointer relative flex flex-col justify-between group ${
          isSelected
            ? 'bg-[#181b20] border-[#22c55e] shadow-lg shadow-[#22c55e]/10'
            : 'bg-[#111317] border-white/10 hover:border-white/25 hover:bg-[#15181d]'
        }"
        data-formula="${item.id}"
      >
        <div class="space-y-3">
          <div class="flex items-start justify-between">
            <div>
              <div class="flex items-center space-x-2">
                <h3 class="font-heading font-bold text-base text-white group-hover:text-[#22c55e] transition-colors">
                  ${item.name}
                </h3>
                <span class="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/5 text-[#94a3b8]">${fDef ? fDef.year : ''}</span>
              </div>
              <span class="text-[11px] text-[#64748b] block font-mono mt-0.5">by ${fDef ? fDef.author : ''}</span>
            </div>
            ${
              isSelected
                ? '<span class="w-6 h-6 rounded-full bg-[#22c55e] text-[#0a0b0d] flex items-center justify-center text-xs font-bold">✓</span>'
                : '<span class="text-[11px] font-mono text-[#64748b] group-hover:text-[#22c55e]">Select</span>'
            }
          </div>

          <div class="bg-[#0a0b0d] border border-white/5 rounded-lg px-3 py-2 text-xs font-mono text-[#94a3b8] overflow-x-auto">
            <code>${item.formulaDisplay}</code>
          </div>

          <p class="text-xs text-[#94a3b8] leading-relaxed">
            ${fDef ? fDef.description : ''}
          </p>
        </div>

        <div class="pt-4 mt-4 border-t border-white/5 flex items-end justify-between">
          <div>
            <span class="text-[10px] font-mono uppercase tracking-wider text-[#64748b] block">Best Application</span>
            <span class="text-xs text-white font-medium block mt-0.5">${item.bestFor}</span>
          </div>

          <div class="text-right">
            <div class="flex items-baseline space-x-1 justify-end">
              <span class="font-heading font-extrabold text-2xl text-white font-mono-num">${item.calculated1RM}</span>
              <span class="text-xs font-mono text-[#64748b]">${state.unit}</span>
            </div>
            <span class="text-[10px] font-mono ${
              diffFromAvg > 0 ? 'text-amber-400' : diffFromAvg < 0 ? 'text-cyan-400' : 'text-[#22c55e]'
            }">
              ${diffFromAvg > 0 ? `+${diffFromAvg}` : diffFromAvg} ${state.unit} vs avg
            </span>
          </div>
        </div>
      </div>
    `;
    })
    .join('');

  container.querySelectorAll('.formula-card').forEach((card) => {
    card.addEventListener('click', () => {
      state.formula = card.dataset.formula;
      const formulaSelect = document.getElementById('formula-select');
      if (formulaSelect) formulaSelect.value = state.formula;
      recalculateAll();
    });
  });
}

// 6. Save PR Record & Export CSV
function handleSavePR() {
  const currentEx = EXERCISES.find((e) => e.id === state.exercise);
  const exerciseName = currentEx ? currentEx.name : 'Barbell Lift';
  const fullResult = computeFullCalculation(
    state.weight,
    state.reps,
    state.unit,
    exerciseName,
    state.formula
  );

  const newRecord = {
    id: `pr_${Date.now()}`,
    date: new Date().toISOString(),
    exercise: fullResult.exercise,
    weight: fullResult.weight,
    reps: fullResult.reps,
    unit: fullResult.unit,
    formula: fullResult.formulaName,
    oneRepMax: fullResult.oneRepMax,
  };

  state.savedRecords.unshift(newRecord);
  saveRecordsToStorage();

  // Trigger celebratory confetti if library is loaded
  if (typeof confetti !== 'undefined') {
    try {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#22c55e', '#4ade80', '#ffffff'],
      });
    } catch (e) {}
  }

  const savePrBtn = document.getElementById('save-pr-record-btn');
  if (savePrBtn) {
    savePrBtn.innerHTML = `<span>✓ Saved PR</span>`;
    savePrBtn.className = 'p-2 rounded-lg border text-xs flex items-center space-x-1.5 transition-all bg-[#22c55e]/15 border-[#22c55e]/30 text-[#22c55e]';
    setTimeout(() => {
      savePrBtn.innerHTML = `<span>Save PR</span>`;
      savePrBtn.className = 'p-2 rounded-lg border text-xs flex items-center space-x-1.5 transition-all bg-[#181b20] border-white/10 text-[#94a3b8] hover:text-[#22c55e]';
    }, 2500);
  }
}

function handleShare() {
  const currentEx = EXERCISES.find((e) => e.id === state.exercise);
  const exerciseName = currentEx ? currentEx.name : 'Barbell Lift';
  const fullResult = computeFullCalculation(
    state.weight,
    state.reps,
    state.unit,
    exerciseName,
    state.formula
  );

  const text = `🎯 My estimated ${fullResult.exercise} 1RM is ${fullResult.oneRepMax} ${fullResult.unit} (calculated from ${fullResult.weight} ${fullResult.unit} × ${fullResult.reps} reps via ${fullResult.formulaName} on One Rep Max Calculator).`;

  navigator.clipboard.writeText(text);

  const shareBtn = document.getElementById('share-result-btn');
  if (shareBtn) {
    shareBtn.innerHTML = `<span class="text-[#22c55e] font-mono text-[11px]">✓ Copied!</span>`;
    setTimeout(() => {
      shareBtn.innerHTML = `<span class="font-mono text-[11px]">Copy Summary</span>`;
    }, 2500);
  }
}

function renderSavedRecords() {
  const container = document.getElementById('saved-records-container');
  const section = document.getElementById('saved-records-section');
  const exportBtn = document.getElementById('export-records-csv-btn');

  if (!section || !container) return;

  if (state.savedRecords.length === 0) {
    section.classList.add('hidden');
    return;
  }

  section.classList.remove('hidden');

  if (exportBtn) {
    exportBtn.onclick = handleExportCSV;
  }

  container.innerHTML = state.savedRecords
    .map(
      (rec) => `
    <div
      class="saved-record-card p-4 rounded-xl bg-[#181b20] border border-white/5 hover:border-[#22c55e]/40 transition-all cursor-pointer group flex flex-col justify-between"
      data-id="${rec.id}"
    >
      <div>
        <div class="flex items-center justify-between">
          <span class="text-xs font-mono text-[#64748b]">
            ${new Date(rec.date).toLocaleDateString()}
          </span>
          <button
            type="button"
            class="delete-record-btn text-[#64748b] hover:text-rose-400 p-1 transition-colors"
            data-id="${rec.id}"
            title="Delete record"
          >
            ✕
          </button>
        </div>
        <h4 class="font-heading font-bold text-sm text-white group-hover:text-[#22c55e] transition-colors mt-2">
          ${rec.exercise}
        </h4>
        <p class="text-xs text-[#94a3b8] font-mono mt-0.5">
          Set: ${rec.weight} ${rec.unit} × ${rec.reps} reps (${rec.formula})
        </p>
      </div>

      <div class="pt-3 mt-3 border-t border-white/5 flex items-baseline justify-between">
        <span class="text-[10px] font-mono uppercase tracking-wider text-[#64748b]">Estimated 1RM</span>
        <div class="flex items-baseline space-x-1">
          <span class="font-heading font-extrabold text-xl text-white font-mono-num">${rec.oneRepMax}</span>
          <span class="text-xs font-mono text-[#22c55e]">${rec.unit}</span>
        </div>
      </div>
    </div>
  `
    )
    .join('');

  container.querySelectorAll('.saved-record-card').forEach((card) => {
    card.addEventListener('click', (e) => {
      if (e.target.classList.contains('delete-record-btn')) return;
      const rec = state.savedRecords.find((r) => r.id === card.dataset.id);
      if (rec) {
        state.weight = rec.weight;
        state.reps = rec.reps;
        state.unit = rec.unit;
        state.plateTargetWeight = rec.weight;

        const exFound = EXERCISES.find((ex) => ex.name === rec.exercise);
        if (exFound) state.exercise = exFound.id;

        const weightInput = document.getElementById('weight-input');
        const repsInput = document.getElementById('reps-input');
        const exerciseSelect = document.getElementById('exercise-select');

        if (weightInput) weightInput.value = state.weight;
        if (repsInput) repsInput.value = state.reps;
        if (exerciseSelect) exerciseSelect.value = state.exercise;

        setUnit(state.unit);
        recalculateAll();

        const form = document.getElementById('one-rep-max-form');
        if (form) form.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  container.querySelectorAll('.delete-record-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.dataset.id;
      state.savedRecords = state.savedRecords.filter((r) => r.id !== id);
      saveRecordsToStorage();
    });
  });
}

function handleExportCSV() {
  if (state.savedRecords.length === 0) return;
  const headers = ['Date', 'Exercise', '1RM', 'Weight', 'Reps', 'Unit', 'Formula'];
  const rows = state.savedRecords.map((r) => [
    r.date,
    `"${r.exercise}"`,
    r.oneRepMax,
    r.weight,
    r.reps,
    r.unit,
    `"${r.formula}"`,
  ]);
  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `1rm-records-${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
