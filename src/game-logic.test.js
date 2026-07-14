import { describe, it, expect } from 'vitest';
import {
  genders,
  genderDescriptors,
  DIE_FACTOR_BY_ROLL,
  MIN_SAVINGS,
  NOBEL_REQUIREMENTS,
  MAX_GAME_ROUNDS,
  questions,
  randomInt,
  shuffle,
  rollDie,
  dieFactor,
  dieText,
  applyImpact,
  hasMetNobelRequirements,
  createInitialState
} from './game-logic.js';

describe('dieFactor', () => {
  it('returns the correct multiplier for every die face', () => {
    expect(dieFactor(1)).toBe(0.45);
    expect(dieFactor(2)).toBe(0.75);
    expect(dieFactor(3)).toBe(1);
    expect(dieFactor(4)).toBe(1.15);
    expect(dieFactor(5)).toBe(1.35);
    expect(dieFactor(6)).toBe(1.65);
  });

  it('matches every entry defined in DIE_FACTOR_BY_ROLL', () => {
    Object.entries(DIE_FACTOR_BY_ROLL).forEach(([roll, factor]) => {
      expect(dieFactor(Number(roll))).toBe(factor);
    });
  });
});

describe('dieText', () => {
  it('describes obstacles for low rolls (1–2)', () => {
    expect(dieText(1)).toContain('obstáculos imprevistos');
    expect(dieText(2)).toContain('obstáculos imprevistos');
  });

  it('describes a reasonable result for medium rolls (3–4)', () => {
    expect(dieText(3)).toContain('razonable');
    expect(dieText(4)).toContain('razonable');
  });

  it('describes a better-than-expected result for high rolls (5–6)', () => {
    expect(dieText(5)).toContain('mejor de lo esperado');
    expect(dieText(6)).toContain('mejor de lo esperado');
  });

  it('includes the roll number in the returned string', () => {
    for (let roll = 1; roll <= 6; roll++) {
      expect(dieText(roll)).toContain(String(roll));
    }
  });
});

describe('createInitialState', () => {
  it('returns a fresh state object with the expected default values', () => {
    const state = createInitialState();
    expect(state.age).toBe(18);
    expect(state.gender).toBe('');
    expect(state.prestige).toBe(0);
    expect(state.wellbeing).toBe(50);
    expect(state.savings).toBe(10);
    expect(state.papers).toBe(0);
    expect(state.discoveries).toBe(0);
    expect(state.rounds).toBe(0);
    expect(state.queue).toEqual([]);
  });

  it('sets maxRounds to the minimum of MAX_GAME_ROUNDS and questions.length', () => {
    const state = createInitialState();
    expect(state.maxRounds).toBe(Math.min(MAX_GAME_ROUNDS, questions.length));
  });

  it('returns a new independent object on every call', () => {
    const a = createInitialState();
    const b = createInitialState();
    a.prestige = 99;
    expect(b.prestige).toBe(0);
  });
});

describe('applyImpact', () => {
  it('applies the die factor to every impact key', () => {
    const state = createInitialState();
    // roll=3 → factor=1, so values are unchanged
    applyImpact(state, { prestige: 10, wellbeing: 5, savings: 2, papers: 1, discoveries: 1 }, 3);
    expect(state.prestige).toBe(10);
    expect(state.wellbeing).toBe(55);
    expect(state.savings).toBe(12);
    expect(state.papers).toBe(1);
    expect(state.discoveries).toBe(1);
  });

  it('increments age and rounds by 1 each call', () => {
    const state = createInitialState();
    applyImpact(state, {}, 3);
    expect(state.age).toBe(19);
    expect(state.rounds).toBe(1);
  });

  it('clamps wellbeing to a maximum of 100', () => {
    const state = createInitialState();
    state.wellbeing = 98;
    // roll=6 → factor=1.65; 10*1.65=16.5 → Math.round=17 → 98+17=115 → clamped to 100
    applyImpact(state, { wellbeing: 10 }, 6);
    expect(state.wellbeing).toBe(100);
  });

  it('clamps wellbeing to a minimum of 0', () => {
    const state = createInitialState();
    state.wellbeing = 2;
    // roll=6 → factor=1.65; -20*1.65=-33 → Math.round(-33)=-33 → 2-33=-31 → clamped to 0
    applyImpact(state, { wellbeing: -20 }, 6);
    expect(state.wellbeing).toBe(0);
  });

  it('clamps savings to MIN_SAVINGS', () => {
    const state = createInitialState();
    state.savings = MIN_SAVINGS;
    applyImpact(state, { savings: -100 }, 3);
    expect(state.savings).toBe(MIN_SAVINGS);
  });

  it('treats missing impact keys as 0', () => {
    const state = createInitialState();
    const before = { ...state };
    applyImpact(state, {}, 3);
    expect(state.prestige).toBe(before.prestige);
    expect(state.papers).toBe(before.papers);
    expect(state.discoveries).toBe(before.discoveries);
  });
});

describe('hasMetNobelRequirements', () => {
  it('returns false for the initial state', () => {
    expect(hasMetNobelRequirements(createInitialState())).toBe(false);
  });

  it('returns true when all requirements are exactly met', () => {
    const state = createInitialState();
    state.prestige = NOBEL_REQUIREMENTS.prestige;
    state.papers = NOBEL_REQUIREMENTS.papers;
    state.discoveries = NOBEL_REQUIREMENTS.discoveries;
    state.wellbeing = NOBEL_REQUIREMENTS.wellbeing;
    expect(hasMetNobelRequirements(state)).toBe(true);
  });

  it('returns true when all requirements are exceeded', () => {
    const state = createInitialState();
    state.prestige = NOBEL_REQUIREMENTS.prestige + 10;
    state.papers = NOBEL_REQUIREMENTS.papers + 2;
    state.discoveries = NOBEL_REQUIREMENTS.discoveries + 1;
    state.wellbeing = NOBEL_REQUIREMENTS.wellbeing + 5;
    expect(hasMetNobelRequirements(state)).toBe(true);
  });

  it.each([
    ['prestige', NOBEL_REQUIREMENTS.prestige - 1],
    ['papers', NOBEL_REQUIREMENTS.papers - 1],
    ['discoveries', NOBEL_REQUIREMENTS.discoveries - 1],
    ['wellbeing', NOBEL_REQUIREMENTS.wellbeing - 1]
  ])('returns false when %s is one below the requirement', (key, value) => {
    const state = createInitialState();
    state.prestige = NOBEL_REQUIREMENTS.prestige;
    state.papers = NOBEL_REQUIREMENTS.papers;
    state.discoveries = NOBEL_REQUIREMENTS.discoveries;
    state.wellbeing = NOBEL_REQUIREMENTS.wellbeing;
    state[key] = value;
    expect(hasMetNobelRequirements(state)).toBe(false);
  });
});

describe('shuffle', () => {
  it('returns an array with the same elements in any order', () => {
    const items = [1, 2, 3, 4, 5];
    const result = shuffle(items);
    expect(result).toHaveLength(items.length);
    expect([...result].sort((a, b) => a - b)).toEqual(items);
  });

  it('does not mutate the original array', () => {
    const items = [1, 2, 3, 4, 5];
    const copy = [...items];
    shuffle(items);
    expect(items).toEqual(copy);
  });

  it('returns a new array reference', () => {
    const items = [1, 2, 3];
    expect(shuffle(items)).not.toBe(items);
  });
});

describe('rollDie', () => {
  it('always returns an integer between 1 and 6 inclusive', () => {
    for (let i = 0; i < 200; i++) {
      const result = rollDie();
      expect(result).toBeGreaterThanOrEqual(1);
      expect(result).toBeLessThanOrEqual(6);
      expect(Number.isInteger(result)).toBe(true);
    }
  });
});

describe('randomInt', () => {
  it('returns values in [0, maxExclusive)', () => {
    for (let i = 0; i < 100; i++) {
      const result = randomInt(5);
      expect(result).toBeGreaterThanOrEqual(0);
      expect(result).toBeLessThan(5);
    }
  });
});

describe('questions', () => {
  it(`has at least ${MAX_GAME_ROUNDS} questions`, () => {
    expect(questions.length).toBeGreaterThanOrEqual(MAX_GAME_ROUNDS);
  });

  it('every question has a non-empty title and text', () => {
    questions.forEach((q) => {
      expect(typeof q.title).toBe('string');
      expect(q.title.length).toBeGreaterThan(0);
      expect(typeof q.text).toBe('string');
      expect(q.text.length).toBeGreaterThan(0);
    });
  });

  it('every question has at least one option with a label and an impact object', () => {
    questions.forEach((q) => {
      expect(q.options.length).toBeGreaterThan(0);
      q.options.forEach((opt) => {
        expect(typeof opt.label).toBe('string');
        expect(opt.label.length).toBeGreaterThan(0);
        expect(typeof opt.impact).toBe('object');
      });
    });
  });

  it('question titles are unique', () => {
    const titles = questions.map((q) => q.title);
    expect(new Set(titles).size).toBe(titles.length);
  });
});

describe('genders and genderDescriptors', () => {
  it('every gender has a corresponding descriptor', () => {
    genders.forEach((gender) => {
      expect(genderDescriptors[gender]).toBeDefined();
      expect(typeof genderDescriptors[gender]).toBe('string');
    });
  });
});
