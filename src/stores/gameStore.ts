import { create } from 'zustand';
import { talents } from '@/data/talents';
import { spiritRoots } from '@/data/spiritRoots';
import { realms } from '@/data/realms';
import { events } from '@/data/events';
import type { GameState, Talent, GameEvent, Attributes, SpiritRoot, GrowthModifiers } from '@/types';
import { saveGameRecord } from '@/utils/storage';

interface GameStore {
  gameState: GameState;
  startNewGame: (selectedSpiritRoot?: SpiritRoot, selectedTalent?: Talent) => void;
  drawSpiritRoot: () => SpiritRoot;
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

const ATTRIBUTE_MAX = 800;
const STARTING_AGE = 10;
const BASE_ATTRIBUTE_VALUE = 10;

const initialState: GameState = {
  status: 'idle',
  age: STARTING_AGE,
  currentRealm: realms[0],
  attributes: {
    根骨: BASE_ATTRIBUTE_VALUE,
    悟性: BASE_ATTRIBUTE_VALUE,
    气运: BASE_ATTRIBUTE_VALUE,
    颜值: BASE_ATTRIBUTE_VALUE,
    家境: BASE_ATTRIBUTE_VALUE
  },
  spiritRoot: null,
  talent: null,
  lifespan: 100,
  cultivationProgress: 0,
  events: [],
  achievements: []
};

export const useGameStore = create<GameStore>((set, get) => ({
  gameState: initialState,

  startNewGame: (selectedSpiritRoot, selectedTalent) => {
    const spiritRoot = selectedSpiritRoot ?? get().drawSpiritRoot();
    const talent = selectedTalent ?? get().drawTalent();
    const startingAttributeCap = getAttributeCap(realms[0]);
    const initialAttributes: Attributes = {
      根骨: clampAttribute(BASE_ATTRIBUTE_VALUE + (spiritRoot.effect.根骨 || 0) + (talent.effect.根骨 || 0), startingAttributeCap),
      悟性: clampAttribute(BASE_ATTRIBUTE_VALUE + (spiritRoot.effect.悟性 || 0) + (talent.effect.悟性 || 0), startingAttributeCap),
      气运: clampAttribute(BASE_ATTRIBUTE_VALUE + (spiritRoot.effect.气运 || 0) + (talent.effect.气运 || 0), startingAttributeCap),
      颜值: clampAttribute(BASE_ATTRIBUTE_VALUE + (spiritRoot.effect.颜值 || 0) + (talent.effect.颜值 || 0), startingAttributeCap),
      家境: clampAttribute(BASE_ATTRIBUTE_VALUE + (spiritRoot.effect.家境 || 0) + (talent.effect.家境 || 0), startingAttributeCap)
    };

    set({
      gameState: {
        status: 'playing',
        age: STARTING_AGE,
        currentRealm: realms[0],
        attributes: initialAttributes,
        spiritRoot,
        talent,
        lifespan: 100,
        cultivationProgress: 0,
        events: [],
        achievements: []
      }
    });

    get().processEvent();
  },

  drawSpiritRoot: () => {
    return pickByProbability(spiritRoots);
  },

  drawTalent: () => {
    return pickByProbability(talents);
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

    const { age } = gameState;

    const event = selectAvailableEvent(gameState);
    const isNeutralEvent = event.result === 'neutral';
    const successRate = isNeutralEvent ? 1 : calculateEventSuccessRate(event, gameState);
    const isSuccess = isNeutralEvent || Math.random() < successRate;
    const result = isNeutralEvent ? 'neutral' : isSuccess ? 'success' : 'failure';

    const resolvedEffects = resolveEventEffects(event, isSuccess);
    const adjustedEffects = applyAttributeModifiers(gameState, event, resolvedEffects);
    const progressDelta = calculateCultivationProgressDelta(gameState, event, resolvedEffects);
    const lifespanDelta = calculateLifespanDelta(gameState, event, resolvedEffects);
    const appliedEffects = buildAppliedEffects(adjustedEffects, progressDelta, lifespanDelta);

    const newAttributes = applyAttributeEffects(gameState, adjustedEffects);
    const newLifespan = lifespanDelta
      ? Math.max(1, gameState.lifespan + lifespanDelta)
      : gameState.lifespan;
    const requiredProgress = getRequiredCultivationProgress(gameState);

    const newEvent: GameEvent = {
      ...event,
      age,
      appliedEffects,
      result
    };

    set({
      gameState: {
        ...gameState,
        attributes: newAttributes,
        lifespan: newLifespan,
        cultivationProgress: clampProgress(gameState.cultivationProgress + progressDelta, requiredProgress),
        events: [...gameState.events, newEvent]
      }
    });

    get().checkGameEnd();
  },

  checkRealmAdvancement: () => {
    const { gameState } = get();
    return canAdvanceRealm(gameState);
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
    const lifespanGain = getRealmLifespanGain(currentIndex);
    const breakthroughEvent: GameEvent = {
      id: `breakthrough-${Date.now()}`,
      age: gameState.age,
      type: 'cultivation',
      title: '突破瓶颈',
      description: `灵机圆满，瓶颈破开，你踏入了${nextRealm.name}。`,
      effects: { 境界: 'advance', 寿命: lifespanGain },
      appliedEffects: { 境界: 'advance', 寿命: lifespanGain },
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
      spiritRoot: gameState.spiritRoot?.name || '',
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

function pickByProbability<T extends { probability: number }>(items: T[]): T {
  const totalProbability = items.reduce((sum, item) => sum + item.probability, 0);
  let random = Math.random() * totalProbability;

  for (const item of items) {
    random -= item.probability;
    if (random <= 0) {
      return item;
    }
  }

  return items[0];
}

function selectAvailableEvent(gameState: GameState): GameEvent {
  const availableEvents = events.filter(event => {
    return event.effects.境界 !== 'advance' && matchesEventConditions(event, gameState);
  });

  return pickWeightedEvent(availableEvents.length > 0 ? availableEvents : events, gameState);
}

function pickWeightedEvent(availableEvents: GameEvent[], gameState: GameState): GameEvent {
  const modifiers = getCombinedModifiers(gameState);
  const weightedEvents = availableEvents.map(event => ({
    event,
    weight: Math.max(0.05, (event.weight ?? 1) * (modifiers.事件权重?.[event.type] ?? 1))
  }));
  const totalWeight = weightedEvents.reduce((sum, item) => sum + item.weight, 0);
  let random = Math.random() * totalWeight;

  for (const item of weightedEvents) {
    random -= item.weight;
    if (random <= 0) {
      return item.event;
    }
  }

  return weightedEvents[0].event;
}

function matchesEventConditions(event: GameEvent, gameState: GameState): boolean {
  const conditions = event.conditions;
  if (!conditions) return true;

  const realmLevel = gameState.currentRealm.level;
  if (conditions.minRealmLevel && realmLevel < conditions.minRealmLevel) return false;
  if (conditions.maxRealmLevel && realmLevel > conditions.maxRealmLevel) return false;
  if (conditions.minAge && gameState.age < conditions.minAge) return false;
  if (conditions.spiritRootIds && !conditions.spiritRootIds.includes(gameState.spiritRoot?.id ?? '')) return false;
  if (conditions.talentIds && !conditions.talentIds.includes(gameState.talent?.id ?? '')) return false;

  if (conditions.attributes && !meetsAttributeRequirements(gameState.attributes, conditions.attributes)) {
    return false;
  }

  return true;
}

function clampAttribute(value: number, cap = ATTRIBUTE_MAX): number {
  return Math.max(0, Math.min(cap, Math.round(value)));
}

function applyAttributeEffects(gameState: GameState, effects: GameEvent['effects']): Attributes {
  const attributeCap = getAttributeCap(gameState.currentRealm);
  const { attributes } = gameState;
  const newAttributes = { ...attributes };
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
      newAttributes[attrKey] = clampAttribute(newAttributes[attrKey] + effectValue, attributeCap);
    }
  });

  return newAttributes;
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
  const modifiers = getCombinedModifiers(gameState);
  const cultivationMultiplier = modifiers.修为倍率 ?? 1;
  const realmProgressMultiplier = getRealmProgressMultiplier(gameState);
  const disasterResistance = getDisasterResistance(gameState);
  let percentDelta = typeof effects.修为 === 'number'
    ? effects.修为
    : getDefaultProgressPercent(event.type);

  Object.entries(effects).forEach(([key, value]) => {
    if (key === '寿命' || key === '境界' || key === '修为' || typeof value !== 'number') return;
    percentDelta += value > 0 ? 0.6 : -1.2;
  });

  if (event.type === 'disaster' && percentDelta < 0) {
    percentDelta *= Math.max(0.25, 1 - disasterResistance);
  }

  if (percentDelta > 0) {
    percentDelta *= cultivationMultiplier * realmProgressMultiplier;
  }

  return toProgressDelta(Math.max(-35, Math.min(40, percentDelta)));
}

function getRealmProgressMultiplier(gameState: GameState): number {
  switch (gameState.currentRealm.level) {
    case 1:
      return 1;
    case 2:
      return 1.08;
    case 3:
      return 1.16;
    case 4:
      return 1.28;
    case 5:
      return 1.42;
    case 6:
      return 1.56;
    case 7:
      return 1.7;
    case 8:
      return 1.85;
    default:
      return 1;
  }
}

function getDefaultProgressPercent(type: GameEvent['type']): number {
  switch (type) {
    case 'cultivation':
      return 8;
    case 'encounter':
      return 5;
    case 'daily':
      return 4;
    case 'social':
      return 2;
    case 'disaster':
      return -8;
    case 'resource':
      return 5;
    case 'mind':
      return 6;
    case 'sect':
      return 6;
    default:
      return 0;
  }
}

function calculateLifespanDelta(
  gameState: GameState,
  event: GameEvent,
  effects: GameEvent['effects']
): number {
  if (typeof effects.寿命 !== 'number' || gameState.lifespan === Infinity) {
    return 0;
  }

  const modifiers = getCombinedModifiers(gameState);
  const lifespanMultiplier = modifiers.寿命倍率 ?? 1;
  const resistance = event.type === 'disaster' ? getDisasterResistance(gameState) : 0;
  const percent = effects.寿命 > 0
    ? effects.寿命 * lifespanMultiplier
    : effects.寿命 * Math.max(0.25, 1 - resistance);

  return Math.trunc(gameState.lifespan * percent / 100);
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

function calculateEventSuccessRate(event: GameEvent, gameState: GameState): number {
  const { attributes } = gameState;
  const disasterResistance = getDisasterResistance(gameState);
  let baseRate = 0.5;

  switch (event.type) {
    case 'cultivation':
      baseRate = 0.2
        + (attributes.根骨 * 0.003)
        + (attributes.悟性 * 0.003)
        + (attributes.家境 * 0.001);
      break;
    case 'encounter':
      baseRate = 0.25
        + (attributes.气运 * 0.004)
        + (attributes.家境 * 0.0015);
      break;
    case 'social':
      baseRate = 0.25
        + (attributes.颜值 * 0.0035)
        + (attributes.家境 * 0.0015);
      break;
    case 'disaster':
      baseRate = 0.25
        + (attributes.根骨 * 0.003)
        + (attributes.家境 * 0.0015)
        + disasterResistance;
      break;
    case 'daily':
      baseRate = 0.35
        + (attributes.悟性 * 0.002)
        + (attributes.家境 * 0.002);
      break;
    case 'resource':
      baseRate = 0.26
        + (attributes.家境 * 0.004)
        + (attributes.气运 * 0.0015);
      break;
    case 'mind':
      baseRate = 0.28
        + (attributes.悟性 * 0.0035)
        + (attributes.气运 * 0.001);
      break;
    case 'sect':
      baseRate = 0.27
        + (attributes.家境 * 0.0025)
        + (attributes.颜值 * 0.0015)
        + (attributes.悟性 * 0.001);
      break;
  }

  baseRate += getEventSpecificModifier(event, attributes);

  return Math.max(0.1, Math.min(0.95, baseRate));
}

function getEventSpecificModifier(event: GameEvent, attributes: Attributes): number {
  switch (event.id) {
    case 'daily-merchant':
    case 'resource-auction':
      return attributes.家境 * 0.0015;
    case 'daily-sect-mission':
    case 'sect-inner-test':
      return attributes.家境 * 0.001;
    case 'encounter-master':
      return attributes.家境 * 0.001;
    case 'social-partner':
    case 'social-brother':
      return attributes.家境 * 0.001;
    default:
      return 0;
  }
}

function applyAttributeModifiers(
  gameState: GameState,
  event: GameEvent,
  effects: GameEvent['effects']
): GameEvent['effects'] {
  const modifiers = getCombinedModifiers(gameState);
  const attributeMultiplier = modifiers.属性倍率 ?? 1;
  const disasterResistance = event.type === 'disaster' ? getDisasterResistance(gameState) : 0;
  const adjustedEffects: GameEvent['effects'] = {};

  Object.entries(effects).forEach(([key, value]) => {
    if (typeof value !== 'number') {
      (adjustedEffects as Record<string, typeof value>)[key] = value;
      return;
    }

    if (key === '寿命' || key === '修为') {
      (adjustedEffects as Record<string, number>)[key] = value;
      return;
    }

    const rawValue = value > 0
      ? value * attributeMultiplier
      : value * Math.max(0.35, 1 - disasterResistance);
    const roundedValue = rawValue > 0 ? Math.ceil(rawValue) : Math.floor(rawValue);

    if (roundedValue !== 0) {
      (adjustedEffects as Record<string, number>)[key] = roundedValue;
    }
  });

  return adjustedEffects;
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

function getAttributeCap(realm: GameState['currentRealm']): number {
  return Math.min(ATTRIBUTE_MAX, realm.attributeCap);
}

function getCombinedModifiers(gameState: GameState): GrowthModifiers {
  return mergeModifiers(gameState.spiritRoot?.modifiers, gameState.talent?.modifiers);
}

function mergeModifiers(...modifiersList: Array<GrowthModifiers | undefined>): GrowthModifiers {
  return modifiersList.reduce<GrowthModifiers>((merged, modifiers) => {
    if (!modifiers) return merged;

    return {
      修为倍率: multiplyOptional(merged.修为倍率, modifiers.修为倍率),
      属性倍率: multiplyOptional(merged.属性倍率, modifiers.属性倍率),
      寿命倍率: multiplyOptional(merged.寿命倍率, modifiers.寿命倍率),
      灾劫抗性: (merged.灾劫抗性 ?? 0) + (modifiers.灾劫抗性 ?? 0),
      事件权重: mergeEventWeights(merged.事件权重, modifiers.事件权重)
    };
  }, {});
}

function multiplyOptional(current: number | undefined, next: number | undefined): number | undefined {
  if (next === undefined) return current;
  return (current ?? 1) * next;
}

function mergeEventWeights(
  current: GrowthModifiers['事件权重'],
  next: GrowthModifiers['事件权重']
): GrowthModifiers['事件权重'] {
  if (!next) return current;

  return Object.entries(next).reduce<NonNullable<GrowthModifiers['事件权重']>>((merged, [type, weight]) => {
    merged[type as keyof NonNullable<GrowthModifiers['事件权重']>] =
      (merged[type as keyof NonNullable<GrowthModifiers['事件权重']>] ?? 1) * (weight ?? 1);
    return merged;
  }, { ...current });
}

function getDisasterResistance(gameState: GameState): number {
  return Math.max(-0.25, Math.min(0.5, getCombinedModifiers(gameState).灾劫抗性 ?? 0));
}
