import {
  genders,
  genderDescriptors,
  questions,
  randomInt,
  shuffle,
  rollDie,
  dieText,
  applyImpact,
  hasMetNobelRequirements,
  createInitialState
} from './src/game-logic.js';

const characterEl = document.getElementById('character');
const statsEl = document.getElementById('stats');
const questionTitleEl = document.getElementById('question-title');
const questionEl = document.getElementById('question');
const optionsEl = document.getElementById('options');
const resultEl = document.getElementById('result');
const startBtn = document.getElementById('start-btn');
const restartBtn = document.getElementById('restart-btn');

const state = createInitialState();

function renderStats() {
  statsEl.textContent = `Edad: ${state.age} · Prestigio: ${state.prestige} · Bienestar: ${state.wellbeing} · Ahorros: ${state.savings} · Papers: ${state.papers} · Hallazgos: ${state.discoveries}`;
}

function finishGame() {
  optionsEl.innerHTML = '';
  questionTitleEl.textContent = 'Final de partida';

  const wonNobel = hasMetNobelRequirements(state);

  if (wonNobel) {
    questionEl.textContent = '¡Ganaste el Nobel! Llegaste lejos combinando rigor, decisiones difíciles y algo de suerte.';
  } else {
    questionEl.textContent = 'No llegó el Nobel esta vez, pero construiste una carrera real: con aprendizaje, tropiezos y logros.';
  }

  resultEl.textContent = `Cierre: terminaste con ${state.papers} papers y ${state.discoveries} descubrimientos. La ciencia es una maratón, no un sprint.`;
  startBtn.hidden = true;
  restartBtn.hidden = false;
}

function renderQuestion() {
  if (state.rounds >= state.maxRounds || state.queue.length === 0) {
    finishGame();
    renderStats();
    return;
  }

  const q = state.queue.pop();
  questionTitleEl.textContent = q.title;
  questionEl.textContent = q.text;
  optionsEl.innerHTML = '';

  q.options.forEach((option) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = option.label;
    button.addEventListener('click', () => {
      optionsEl.querySelectorAll('button').forEach((optionButton) => {
        optionButton.disabled = true;
      });
      const roll = rollDie();
      applyImpact(state, option.impact, roll);
      resultEl.textContent = `${dieText(roll)} Decidiste: "${option.label}"`;
      renderStats();
      renderQuestion();
    });
    optionsEl.appendChild(button);
  });
}

function startGame() {
  state.age = 18 + randomInt(3);
  state.gender = genders[randomInt(genders.length)];
  state.prestige = 0;
  state.wellbeing = 50;
  state.savings = 10;
  state.papers = 0;
  state.discoveries = 0;
  state.rounds = 0;
  state.queue = shuffle(questions).slice(0, state.maxRounds);

  const descriptor = genderDescriptors[state.gender];
  characterEl.textContent = `Tu protagonista es ${descriptor} de ${state.age} años que empieza a decidir su camino científico.`;
  resultEl.textContent = 'Cada opción se resuelve con un dado virtual (1-6).';
  startBtn.hidden = true;
  restartBtn.hidden = true;

  renderStats();
  renderQuestion();
}

startBtn.addEventListener('click', startGame);
restartBtn.addEventListener('click', startGame);
