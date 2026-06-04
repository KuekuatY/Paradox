import { create } from 'zustand';
import { talents } from '@/data/talents';
import { realms } from '@/data/realms';
import { events } from '@/data/events';
import type { GameState, Talent, GameEvent, Attributes } from '@/types';
import { randomSelect } from '@/utils/random';
import { saveGameRecord } from '@/utils/storage';

interface GameStore {
  gameState: GameState;
  startNewGame: (selectedTalent?: Talent) => void;
  drawTalent: () => Talent;
  advanceAge: () => void;
  processEvent: () => void;
  checkRealmAdvancement: () => boolean;
  canBreakthrough: () => boolean;
  breakthroughRealm: () => void;
  checkGameEnd: () => void;
  endGame: (result: 'died' | 'ascended', reason?: GameState['endReason']) => void;
  resetGame: () => void;
}

const initialState: GameState = {
  status: 'idle',
  age: 10,
  currentRealm: realms[0],
  attributes: {
    根骨: 0,
    悟性: 0,
    气运: 0,
    颜值: 0,
    家境: 0
  },
  talent: null,
  lifespan: 100,
  cultivationProgress: 0,
  events: [],
  achievements: []
};

export const useGameStore = create<GameStore>((set, get) => ({
  gameState: initialState,

  startNewGame: (selectedTalent) => {
    const talent = selectedTalent ?? get().drawTalent();
    const initialAttributes: Attributes = {
      根骨: clampAttribute(talent.effect.根骨 || 0),
      悟性: clampAttribute(talent.effect.悟性 || 0),
      气运: clampAttribute(talent.effect.气运 || 0),
      颜值: clampAttribute(talent.effect.颜值 || 0),
      家境: clampAttribute(talent.effect.家境 || 0)
    };

    set({
      gameState: {
        status: 'playing',
        age: 10,
        currentRealm: realms[0],
        attributes: initialAttributes,
        talent,
        lifespan: 100,
        cultivationProgress: 0,
        events: [],
        achievements: []
      }
    });

    get().advanceAge();
  },

  drawTalent: () => {
    const totalProbability = talents.reduce((sum, t) => sum + t.probability, 0);
    let random = Math.random() * totalProbability;

    for (const talent of talents) {
      random -= talent.probability;
      if (random <= 0) {
        return talent;
      }
    }

    return talents[0];
  },

  advanceAge: () => {
    const { gameState } = get();
    if (gameState.status !== 'playing') return;

    const newAge = gameState.age + 1;
    const agedState: GameState = {
      ...gameState,
      age: newAge
    };

    if (newAge >= gameState.lifespan) {
      set({ gameState: agedState });
      get().endGame('died', 'lifespan');
      return;
    }

    set({ gameState: agedState });

    get().processEvent();
  },

  processEvent: () => {
    const { gameState } = get();
    if (gameState.status !== 'playing') return;

    const { age, attributes } = gameState;

    const event = selectAvailableEvent();
    const successRate = calculateEventSuccessRate(event, attributes);
    const isSuccess = Math.random() < successRate;

    const newAttributes = { ...attributes };
    const effects = resolveEventEffects(event, isSuccess);
    const effectsRecord = effects as Record<string, number | undefined>;
    Object.keys(effects).forEach((key) => {
      const attrKey = key as keyof Attributes;
      const effectValue = effectsRecord[key];
      if (
        attrKey in newAttributes
        && key !== '境界'
        && key !== '寿命'
        && key !== '修为'
        && effectValue !== undefined
      ) {
        newAttributes[attrKey] = Math.max(
          0,
          Math.min(10, newAttributes[attrKey] + effectValue)
        );
      }
    });

    let newLifespan = gameState.lifespan;
    const progressDelta = calculateCultivationProgressDelta(gameState, event, effects);
    const lifespanDelta = calculateLifespanDelta(gameState, effects);
    const appliedEffects = buildAppliedEffects(effects, progressDelta, lifespanDelta);
    const newEvent: GameEvent = {
      ...event,
      age,
      appliedEffects,
      result: isSuccess ? 'success' : 'failure'
    };

    if (lifespanDelta) {
      newLifespan = Math.max(1, newLifespan + lifespanDelta);
    }

    set({
      gameState: {
        ...gameState,
        attributes: newAttributes,
        lifespan: newLifespan,
        cultivationProgress: clampProgress(
          gameState.cultivationProgress + progressDelta,
          getRequiredCultivationProgress(gameState)
        ),
        events: [...gameState.events, newEvent]
      }
    });

    get().checkGameEnd();
  },

  checkRealmAdvancement: () => {
    const { gameState } = get();
    const { currentRealm, attributes } = gameState;

    const realmIndex = realms.findIndex(r => r.name === currentRealm.name);
    if (realmIndex >= realms.length - 1) return false;

    const nextRealm = realms[realmIndex + 1];
    const requirements = nextRealm.requirements;

    if (!meetsAttributeRequirements(attributes, requirements.attributes)) return false;

    return true;
  },

  canBreakthrough: () => {
    const { gameState } = get();
    return canBreakthrough(gameState);
  },

  breakthroughRealm: () => {
    const { gameState } = get();
    if (gameState.status !== 'playing' || !canBreakthrough(gameState)) return;

    const currentIndex = realms.findIndex(r => r.name === gameState.currentRealm.name);
    const nextRealm = realms[currentIndex + 1];
    const requiredProgress = getRequiredCultivationProgress(gameState);
    const lifespanGain = getRealmLifespanGain(currentIndex);
    const breakthroughEvent: GameEvent = {
      id: `breakthrough-${Date.now()}`,
      age: gameState.age,
      type: 'cultivation',
      title: '突破瓶颈',
      description: `灵机圆满，瓶颈破开，你踏入了${nextRealm.name}。`,
      effects: { 境界: 'advance', 修为: -100, 寿命: lifespanGain },
      appliedEffects: { 境界: 'advance', 修为: -requiredProgress, 寿命: lifespanGain },
      result: 'success'
    };

    set({
      gameState: {
        ...gameState,
        currentRealm: nextRealm,
        lifespan: addLifespan(gameState.lifespan, lifespanGain),
        cultivationProgress: 0,
        events: [...gameState.events, breakthroughEvent]
      }
    });

    get().checkGameEnd();
  },

  checkGameEnd: () => {
    const { gameState } = get();

    if (gameState.age >= gameState.lifespan) {
      get().endGame('died', 'lifespan');
      return;
    }

    if (gameState.currentRealm.name === '渡劫期' && gameState.age >= 5000) {
      get().endGame('ascended', 'ascended');
    }
  },

  endGame: (result, reason) => {
    const { gameState } = get();
    if (gameState.status === 'ended') return;
    const endReason = reason ?? (result === 'ascended' ? 'ascended' : 'lifespan');
    
    set({
      gameState: {
        ...gameState,
        status: 'ended',
        endReason
      }
    });

    saveGameRecord({
      id: Date.now().toString(),
      date: new Date().toISOString(),
      finalRealm: gameState.currentRealm.name,
      age: gameState.age,
      talent: gameState.talent?.name || '',
      result,
      stats: gameState.attributes,
      achievements: gameState.achievements
    });
  },

  resetGame: () => {
    set({ gameState: initialState });
  }
}));

function selectAvailableEvent(): GameEvent {
  const availableEvents = events.filter(event => {
    return event.effects.境界 !== 'advance';
  });

  return randomSelect(availableEvents.length > 0 ? availableEvents : events);
}

function clampAttribute(value: number): number {
  return Math.max(0, Math.min(10, value));
}

function calculateCultivationProgressDelta(
  gameState: GameState,
  event: GameEvent,
  effects: GameEvent['effects']
): number {
  const requiredProgress = getRequiredCultivationProgress(gameState);
  const toProgressDelta = (percent: number) => {
    return Math.trunc(requiredProgress * percent / 100);
  };

  if (typeof effects.修为 === 'number') {
    return toProgressDelta(effects.修为);
  }

  let percentDelta = 0;

  switch (event.type) {
    case 'cultivation':
      percentDelta = 8;
      break;
    case 'encounter':
      percentDelta = 5;
      break;
    case 'daily':
      percentDelta = 4;
      break;
    case 'social':
      percentDelta = 2;
      break;
    case 'disaster':
      percentDelta = -8;
      break;
  }

  Object.entries(effects).forEach(([key, value]) => {
    if (key === '寿命' || key === '境界' || key === '修为' || typeof value !== 'number') return;
    percentDelta += value > 0 ? 1 : -2;
  });

  return toProgressDelta(Math.max(-25, Math.min(25, percentDelta)));
}

function calculateLifespanDelta(
  gameState: GameState,
  effects: GameEvent['effects']
): number {
  if (typeof effects.寿命 !== 'number' || gameState.lifespan === Infinity) {
    return 0;
  }

  return Math.trunc(gameState.lifespan * effects.寿命 / 100);
}

function addLifespan(lifespan: number, lifespanGain: number): number {
  if (lifespan === Infinity || lifespanGain === Infinity) {
    return Infinity;
  }

  return Math.max(1, lifespan + lifespanGain);
}

function buildAppliedEffects(
  effects: GameEvent['effects'],
  progressDelta: number,
  lifespanDelta: number
): GameEvent['effects'] {
  return {
    ...effects,
    ...(typeof effects.修为 === 'number' ? { 修为: progressDelta } : {}),
    ...(typeof effects.寿命 === 'number' ? { 寿命: lifespanDelta } : {})
  };
}

function clampProgress(progress: number, requiredProgress: number): number {
  return Math.max(0, Math.min(requiredProgress, progress));
}

function calculateEventSuccessRate(event: GameEvent, attributes: Attributes): number {
  let baseRate = 0.5;

  switch (event.type) {
    case 'cultivation':
      baseRate = 0.24
        + (attributes.根骨 * 0.04)
        + (attributes.悟性 * 0.04)
        + (attributes.家境 * 0.015);
      break;
    case 'encounter':
      baseRate = 0.28
        + (attributes.气运 * 0.05)
        + (attributes.家境 * 0.025);
      break;
    case 'social':
      baseRate = 0.34
        + (attributes.颜值 * 0.04)
        + (attributes.家境 * 0.03);
      break;
    case 'disaster':
      baseRate = 0.24
        + (attributes.根骨 * 0.04)
        + (attributes.家境 * 0.025);
      break;
    case 'daily':
      baseRate = 0.44
        + (attributes.悟性 * 0.025)
        + (attributes.家境 * 0.035);
      break;
  }

  baseRate += getEventSpecificModifier(event, attributes);

  return Math.max(0.1, Math.min(0.95, baseRate));
}

function getEventSpecificModifier(event: GameEvent, attributes: Attributes): number {
  switch (event.id) {
    case 'daily-merchant':
      return attributes.家境 * 0.015;
    case 'daily-sect-mission':
      return attributes.家境 * 0.01;
    case 'encounter-master':
      return attributes.家境 * 0.01;
    case 'social-partner':
    case 'social-brother':
      return attributes.家境 * 0.01;
    default:
      return 0;
  }
}

function resolveEventEffects(event: GameEvent, isSuccess: boolean): GameEvent['effects'] {
  const isHarmful = isHarmfulEvent(event);

  if (isSuccess) {
    return isHarmful ? scaleNumericEffects(event.effects, 0.5) : event.effects;
  }

  return isHarmful ? event.effects : scaleNumericEffects(event.effects, 0.5);
}

function isHarmfulEvent(event: GameEvent): boolean {
  return Object.values(event.effects).some(value => typeof value === 'number' && value < 0);
}

function scaleNumericEffects(effects: GameEvent['effects'], factor: number): GameEvent['effects'] {
  const scaledEffects: GameEvent['effects'] = {};

  Object.entries(effects).forEach(([key, value]) => {
    if (typeof value !== 'number') return;

    const scaledValue = value > 0
      ? Math.floor(value * factor)
      : Math.ceil(value * factor);

    if (scaledValue !== 0) {
      (scaledEffects as Record<string, number>)[key] = scaledValue;
    }
  });

  return scaledEffects;
}

function canBreakthrough(gameState: GameState): boolean {
  return gameState.cultivationProgress >= getRequiredCultivationProgress(gameState) && canAdvanceRealm(gameState);
}

function canAdvanceRealm(gameState: GameState): boolean {
  const { currentRealm, attributes } = gameState;

  const realmIndex = realms.findIndex(r => r.name === currentRealm.name);
  if (realmIndex >= realms.length - 1) return false;

  const requirements = realms[realmIndex + 1].requirements;

  if (!meetsAttributeRequirements(attributes, requirements.attributes)) return false;

  return true;
}

function meetsAttributeRequirements(
  attributes: Attributes,
  requirements: Partial<Attributes>
): boolean {
  return Object.entries(requirements).every(([key, required]) => {
    if (!required) return true;

    return attributes[key as keyof Attributes] >= required;
  });
}

function getRequiredCultivationProgress(gameState: GameState): number {
  const realmIndex = realms.findIndex(r => r.name === gameState.currentRealm.name);
  const nextRealm = realmIndex >= 0 ? realms[realmIndex + 1] : undefined;

  return nextRealm?.cultivationRequired ?? 0;
}

function getRealmLifespanGain(currentIndex: number): number {
  const currentRealm = realms[currentIndex];
  const nextRealm = realms[currentIndex + 1];

  if (!currentRealm || !nextRealm) {
    return 0;
  }

  if (nextRealm.maxAge === Infinity) {
    return Infinity;
  }

  if (currentRealm.maxAge === Infinity) {
    return 0;
  }

  return Math.max(0, nextRealm.maxAge - currentRealm.maxAge);
}
