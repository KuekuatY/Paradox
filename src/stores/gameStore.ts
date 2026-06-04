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
  age: 0,
  currentRealm: realms[0],
  attributes: {
    根骨: 5,
    悟性: 5,
    气运: 5,
    颜值: 5,
    家境: 5
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
      根骨: Math.min(10, 5 + (talent.effect.根骨 || 0)),
      悟性: Math.min(10, 5 + (talent.effect.悟性 || 0)),
      气运: Math.min(10, 5 + (talent.effect.气运 || 0)),
      颜值: Math.min(10, 5 + (talent.effect.颜值 || 0)),
      家境: Math.min(10, 5 + (talent.effect.家境 || 0))
    };

    set({
      gameState: {
        status: 'playing',
        age: 0,
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
    const newEvent: GameEvent = {
      ...event,
      age,
      appliedEffects: effects,
      result: isSuccess ? 'success' : 'failure'
    };

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
          1,
          Math.min(10, newAttributes[attrKey] + effectValue)
        );
      }
    });

    let newLifespan = gameState.lifespan;
    const progressDelta = calculateCultivationProgressDelta(event, effects);

    if (effects.寿命) {
      newLifespan = Math.max(1, newLifespan + effects.寿命);
    }

    set({
      gameState: {
        ...gameState,
        attributes: newAttributes,
        lifespan: newLifespan,
        cultivationProgress: clampProgress(gameState.cultivationProgress + progressDelta),
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
    const breakthroughEvent: GameEvent = {
      id: `breakthrough-${Date.now()}`,
      age: gameState.age,
      type: 'cultivation',
      title: '突破瓶颈',
      description: `灵机圆满，瓶颈破开，你踏入了${nextRealm.name}。`,
      effects: { 境界: 'advance', 修为: -100 },
      appliedEffects: { 境界: 'advance', 修为: -100 },
      result: 'success'
    };

    set({
      gameState: {
        ...gameState,
        currentRealm: nextRealm,
        lifespan: nextRealm.maxAge,
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

function calculateCultivationProgressDelta(
  event: GameEvent,
  effects: GameEvent['effects']
): number {
  if (typeof effects.修为 === 'number') {
    return effects.修为;
  }

  let delta = 0;

  switch (event.type) {
    case 'cultivation':
      delta = 8;
      break;
    case 'encounter':
      delta = 5;
      break;
    case 'daily':
      delta = 4;
      break;
    case 'social':
      delta = 2;
      break;
    case 'disaster':
      delta = -8;
      break;
  }

  Object.entries(effects).forEach(([key, value]) => {
    if (key === '寿命' || key === '境界' || key === '修为' || typeof value !== 'number') return;
    delta += value > 0 ? 1 : -2;
  });

  return Math.max(-25, Math.min(25, delta));
}

function clampProgress(progress: number): number {
  return Math.max(0, Math.min(100, progress));
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
  return gameState.cultivationProgress >= 100 && canAdvanceRealm(gameState);
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
