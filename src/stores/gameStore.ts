import { create } from 'zustand';
import { talents } from '@/data/talents';
import { spiritRoots } from '@/data/spiritRoots';
import { realms } from '@/data/realms';
import { events } from '@/data/events';
import { getCultivationStrategy } from '@/data/strategies';
import type { GameState, Talent, GameEvent, Attributes, SpiritRoot, GrowthModifiers, CultivationStrategyId } from '@/types';
import { saveGameRecord } from '@/utils/storage';

interface GameStore {
  gameState: GameState;
  startNewGame: (selectedSpiritRoot?: SpiritRoot, selectedTalent?: Talent) => void;
  drawSpiritRoot: () => SpiritRoot;
  drawTalent: () => Talent;
  setStrategy: (strategyId: CultivationStrategyId) => void;
  chooseEventOption: (choiceId: string) => void;
  useBreakthroughPreparation: (actionId: string) => void;
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
  strategy: 'balanced',
  lifespan: 100,
  cultivationProgress: 0,
  pendingEvent: null,
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
        strategy: 'balanced',
        lifespan: 100,
        cultivationProgress: 0,
        pendingEvent: null,
        events: [],
        achievements: ['初入仙途']
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

  setStrategy: (strategyId) => {
    const { gameState } = get();
    if (gameState.status !== 'playing') return;

    set({
      gameState: {
        ...gameState,
        strategy: strategyId
      }
    });
  },

  chooseEventOption: (choiceId) => {
    const { gameState } = get();
    if (gameState.status !== 'playing' || !gameState.pendingEvent) return;

    const event = gameState.pendingEvent;
    const choice = getEventChoices(gameState, event).find(item => item.id === choiceId) ?? getEventChoices(gameState, event)[1];
    const isNeutralEvent = event.result === 'neutral';
    const successRate = isNeutralEvent
      ? 1
      : clampRate(calculateEventSuccessRate(event, gameState) + (choice.successModifier ?? 0));
    const isSuccess = isNeutralEvent || Math.random() < successRate;
    const result = isNeutralEvent ? 'neutral' : isSuccess ? 'success' : 'failure';

    const resolvedEffects = resolveEventEffects(event, isSuccess);
    const choiceEffects = resolveChoiceEffects(gameState, choice);
    const chosenEffects = mergeEffects(scaleEventEffectsForChoice(resolvedEffects, choice), choiceEffects);
    const adjustedEffects = applyAttributeModifiers(gameState, event, chosenEffects);
    const progressDelta = calculateCultivationProgressDelta(gameState, event, chosenEffects);
    const lifespanDelta = calculateLifespanDelta(gameState, event, chosenEffects);
    const appliedEffects = buildAppliedEffects(adjustedEffects, progressDelta, lifespanDelta);
    const stateForEffects = {
      ...gameState,
      pendingEvent: null
    };
    const newAttributes = applyAttributeEffects(stateForEffects, adjustedEffects);
    const newLifespan = lifespanDelta
      ? Math.max(1, gameState.lifespan + lifespanDelta)
      : gameState.lifespan;
    const requiredProgress = getRequiredCultivationProgress(gameState);
    const newEvent: GameEvent = {
      ...event,
      title: `${event.title}：${choice.label}`,
      description: `${event.description}你选择${choice.label}，${choice.outcome}`,
      appliedEffects,
      result
    };

    set({
      gameState: unlockAchievements({
        ...gameState,
        pendingEvent: null,
        attributes: newAttributes,
        lifespan: newLifespan,
        cultivationProgress: clampProgress(gameState.cultivationProgress + progressDelta, requiredProgress),
        events: [...gameState.events, newEvent]
      })
    });

    get().checkGameEnd();
  },

  useBreakthroughPreparation: (actionId) => {
    const { gameState } = get();
    if (gameState.status !== 'playing' || gameState.pendingEvent) return;

    const action = getPreparationAction(actionId);
    if (!action) return;

    if ((gameState.attributes.家境 ?? 0) < action.cost) return;

    const requiredProgress = getRequiredCultivationProgress(gameState);
    const effects = action.effects(gameState);
    const attributesAfterCost = {
      ...gameState.attributes,
      家境: clampAttribute(gameState.attributes.家境 - action.cost, getAttributeCap(gameState.currentRealm))
    };
    const stateAfterCost = {
      ...gameState,
      attributes: attributesAfterCost
    };
    const newAttributes = applyAttributeEffects(stateAfterCost, effects);
    const progressDelta = calculateCultivationProgressDelta(gameState, {
      id: action.id,
      age: gameState.age,
      type: 'daily',
      title: action.name,
      description: action.description,
      effects,
      result: 'neutral'
    }, effects);
    const lifespanDelta = calculateLifespanDelta(gameState, {
      id: action.id,
      age: gameState.age,
      type: 'daily',
      title: action.name,
      description: action.description,
      effects,
      result: 'neutral'
    }, effects);
    const preparationEvent: GameEvent = {
      id: `preparation-${action.id}-${Date.now()}`,
      age: gameState.age,
      type: 'daily',
      title: action.name,
      description: action.description,
      effects,
      appliedEffects: buildAppliedEffects(
        {
          ...effects,
          ...(action.cost ? { 家境: -action.cost } : {})
        },
        progressDelta,
        lifespanDelta
      ),
      result: 'neutral'
    };

    set({
      gameState: unlockAchievements({
        ...gameState,
        attributes: newAttributes,
        lifespan: lifespanDelta ? Math.max(1, gameState.lifespan + lifespanDelta) : gameState.lifespan,
        cultivationProgress: clampProgress(gameState.cultivationProgress + progressDelta, requiredProgress),
        events: [...gameState.events, preparationEvent]
      })
    });
  },

  advanceAge: () => {
    const { gameState } = get();
    if (gameState.status !== 'playing' || gameState.pendingEvent) return;

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
    if (gameState.status !== 'playing' || gameState.pendingEvent) return;

    set({
      gameState: {
        ...gameState,
        pendingEvent: {
          ...selectAvailableEvent(gameState),
          age: gameState.age
        }
      }
    });
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
      gameState: unlockAchievements({
        ...gameState,
        currentRealm: nextRealm,
        lifespan: addLifespan(gameState.lifespan, lifespanGain),
        cultivationProgress: 0,
        events: [...gameState.events, breakthroughEvent]
      })
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
        pendingEvent: null,
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

interface EventChoice {
  id: string;
  label: string;
  description: string;
  outcome: string;
  successModifier?: number;
  positiveScale?: number;
  negativeScale?: number;
  effects?: GameEvent['effects'];
}

interface PreparationAction {
  id: string;
  name: string;
  description: string;
  cost: number;
  effects: (gameState: GameState) => GameEvent['effects'];
}

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

function getEventChoices(gameState: GameState, event: GameEvent): EventChoice[] {
  const strategy = getCultivationStrategy(gameState.strategy);

  return [
    {
      id: 'steady',
      label: '稳扎稳打',
      description: '降低风险，收益略少。',
      outcome: '以稳为先，少取机缘，也少惹祸端。',
      successModifier: 0.1,
      positiveScale: 0.75,
      negativeScale: 0.6
    },
    {
      id: 'flow',
      label: '顺势而为',
      description: '按原本机缘发展。',
      outcome: '顺着当下局势行事，让因果自然落定。',
      positiveScale: 1,
      negativeScale: 1
    },
    {
      id: 'focus',
      label: strategy.name,
      description: `贯彻当前策略：${strategy.focus}。`,
      outcome: `你把此事纳入${strategy.name}的修行安排，获得了偏向性的收获。`,
      successModifier: getStrategySuccessModifier(gameState.strategy, event),
      positiveScale: getStrategyPositiveScale(gameState.strategy, event),
      negativeScale: getStrategyNegativeScale(gameState.strategy, event),
      effects: getStrategyChoiceEffects(gameState.strategy)
    }
  ];
}

function getStrategySuccessModifier(strategyId: CultivationStrategyId, event: GameEvent): number {
  if (strategyId === 'balanced') return 0.02;
  if (strategyId === 'body' && event.type === 'disaster') return 0.08;
  if (strategyId === 'insight' && event.type === 'mind') return 0.08;
  if (strategyId === 'roaming' && (event.type === 'encounter' || event.type === 'social')) return 0.06;
  if (strategyId === 'business' && (event.type === 'resource' || event.type === 'sect')) return 0.06;
  if (strategyId === 'seclusion' && event.type === 'cultivation') return 0.04;

  return strategyId === 'seclusion' ? -0.04 : 0;
}

function getStrategyPositiveScale(strategyId: CultivationStrategyId, event: GameEvent): number {
  if (strategyId === 'balanced') return 1;
  if (strategyId === 'seclusion' && event.type === 'cultivation') return 1.18;
  if (strategyId === 'roaming' && event.type === 'encounter') return 1.12;
  if (strategyId === 'business' && event.type === 'resource') return 1.12;
  return 1.05;
}

function getStrategyNegativeScale(strategyId: CultivationStrategyId, event: GameEvent): number {
  if (strategyId === 'body' && event.type === 'disaster') return 0.75;
  if (strategyId === 'seclusion' && event.type === 'disaster') return 1.18;
  return 1;
}

function getStrategyChoiceEffects(strategyId: CultivationStrategyId): GameEvent['effects'] {
  switch (strategyId) {
    case 'body':
      return { 根骨: 5, 修为: -2 };
    case 'insight':
      return { 悟性: 5, 修为: -1 };
    case 'roaming':
      return { 气运: 4, 颜值: 3, 修为: -2 };
    case 'business':
      return { 家境: 5, 修为: -3 };
    case 'seclusion':
      return { 修为: 6 };
    default:
      return { 气运: 2, 修为: 2 };
  }
}

function resolveChoiceEffects(gameState: GameState, choice: EventChoice): GameEvent['effects'] {
  const cap = getAttributeCap(gameState.currentRealm);
  const effects = choice.effects ?? {};
  const adjustedEffects: GameEvent['effects'] = {};

  Object.entries(effects).forEach(([key, value]) => {
    if (typeof value !== 'number') return;

    if (key in gameState.attributes && value > 0) {
      const attrKey = key as keyof Attributes;
      const remaining = cap - gameState.attributes[attrKey];
      if (remaining <= 0) return;
      (adjustedEffects as Record<string, number>)[key] = Math.min(value, remaining);
      return;
    }

    (adjustedEffects as Record<string, number>)[key] = value;
  });

  return adjustedEffects;
}

function scaleEventEffectsForChoice(effects: GameEvent['effects'], choice: EventChoice): GameEvent['effects'] {
  const scaledEffects: GameEvent['effects'] = {};

  Object.entries(effects).forEach(([key, value]) => {
    if (typeof value !== 'number') {
      (scaledEffects as Record<string, typeof value>)[key] = value;
      return;
    }

    const scale = value >= 0
      ? choice.positiveScale ?? 1
      : choice.negativeScale ?? 1;
    const scaledValue = value >= 0
      ? Math.floor(value * scale)
      : Math.ceil(value * scale);

    if (scaledValue !== 0) {
      (scaledEffects as Record<string, number>)[key] = scaledValue;
    }
  });

  return scaledEffects;
}

function mergeEffects(...effectsList: GameEvent['effects'][]): GameEvent['effects'] {
  return effectsList.reduce<GameEvent['effects']>((merged, effects) => {
    Object.entries(effects).forEach(([key, value]) => {
      if (typeof value !== 'number') {
        (merged as Record<string, typeof value>)[key] = value;
        return;
      }

      (merged as Record<string, number>)[key] = ((merged as Record<string, number | undefined>)[key] ?? 0) + value;
    });

    return merged;
  }, {});
}

function getPreparationAction(actionId: string): PreparationAction | undefined {
  const actions: PreparationAction[] = [
    {
      id: 'stabilize',
      name: '稳固根基',
      description: '你暂缓冲境，回头打磨根基与悟法。修为略退，但突破门槛更容易补齐。',
      cost: 6,
      effects: () => ({ 根骨: 6, 悟性: 4, 修为: -8 })
    },
    {
      id: 'elixir',
      name: '购置丹药',
      description: '你以灵石换来上好丹药，淬炼筋骨并稍延寿元。',
      cost: 18,
      effects: () => ({ 根骨: 12, 寿命: 3 })
    },
    {
      id: 'master',
      name: '请教高人',
      description: '你奉上厚礼，请高人为自己点破修行关窍。',
      cost: 16,
      effects: () => ({ 悟性: 12, 修为: 4 })
    },
    {
      id: 'ward',
      name: '布置护阵',
      description: '你修缮洞府阵法，凝聚气运，也让心神更安定。',
      cost: 12,
      effects: () => ({ 气运: 10, 颜值: 3 })
    }
  ];

  return actions.find(action => action.id === actionId);
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
  const realmProgressPace = getRealmProgressPace(gameState);
  const disasterResistance = getDisasterResistance(gameState);
  let percentDelta = typeof effects.修为 === 'number'
    ? effects.修为
    : getDefaultProgressPercent(event.type);

  Object.entries(effects).forEach(([key, value]) => {
    if (key === '寿命' || key === '境界' || key === '修为' || typeof value !== 'number') return;
    percentDelta += value > 0 ? 0.25 : -1.2;
  });

  if (event.type === 'disaster' && percentDelta < 0) {
    percentDelta *= Math.max(0.25, 1 - disasterResistance);
  }

  if (percentDelta > 0) {
    percentDelta *= cultivationMultiplier * realmProgressMultiplier * realmProgressPace;
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
      return 1.2;
    case 5:
      return 1.28;
    case 6:
      return 1.36;
    case 7:
      return 1.44;
    case 8:
      return 1.52;
    default:
      return 1;
  }
}

function getRealmProgressPace(gameState: GameState): number {
  if (gameState.currentRealm.level < 4) {
    return 1;
  }

  switch (gameState.currentRealm.level) {
    case 4:
      return 0.78;
    case 5:
      return 0.74;
    case 6:
      return 0.7;
    case 7:
      return 0.66;
    case 8:
      return 0.62;
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
  return !gameState.pendingEvent && gameState.cultivationProgress >= getRequiredCultivationProgress(gameState) && canAdvanceRealm(gameState);
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
  return mergeModifiers(
    gameState.spiritRoot?.modifiers,
    gameState.talent?.modifiers,
    getCultivationStrategy(gameState.strategy).modifiers
  );
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

function clampRate(value: number): number {
  return Math.max(0.05, Math.min(0.98, value));
}

function unlockAchievements(gameState: GameState): GameState {
  const achievements = new Set(gameState.achievements);

  if (gameState.events.length >= 1) achievements.add('初历世事');
  if (gameState.events.length >= 30) achievements.add('三十年风雨');
  if (gameState.currentRealm.level >= 2) achievements.add('筑基有成');
  if (gameState.currentRealm.level >= 3) achievements.add('金丹大道');
  if (gameState.currentRealm.level >= 4) achievements.add('元婴出窍');
  if (gameState.currentRealm.level >= 5) achievements.add('化神问道');
  if (gameState.currentRealm.level >= 8) achievements.add('大乘在望');
  if (gameState.currentRealm.name === '渡劫期') achievements.add('渡劫之身');
  if (Object.values(gameState.attributes).some(value => value >= 300)) achievements.add('一项通玄');
  if (Object.values(gameState.attributes).every(value => value >= 120)) achievements.add('五维均衡');
  if (gameState.attributes.家境 >= 200) achievements.add('富甲仙门');
  if (gameState.talent?.rarity === '传说') achievements.add('传说命格');
  if (gameState.spiritRoot?.rarity === '神话') achievements.add('神话灵根');

  return {
    ...gameState,
    achievements: Array.from(achievements)
  };
}
