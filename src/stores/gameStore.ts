import { create } from 'zustand';
import { talents } from '@/data/talents';
import { spiritRoots } from '@/data/spiritRoots';
import { realms } from '@/data/realms';
import { childhoodEvents, events } from '@/data/events';
import { getCultivationPath } from '@/data/cultivationPaths';
import { lifeGoals, getLifeGoalDefinition } from '@/data/lifeGoals';
import { getSpecificEventChoices, hasSpecificEventChoices } from '@/data/eventChoices';
import type {
  ActiveLifeGoal,
  EventChoice,
  GameState,
  Talent,
  GameEvent,
  Attributes,
  SpiritRoot,
  GrowthModifiers,
  CultivationPathId,
  LifeGoalDefinition
} from '@/types';
import { saveGameRecord } from '@/utils/storage';

interface GameStore {
  gameState: GameState;
  startNewGame: (selectedSpiritRoot?: SpiritRoot, selectedTalent?: Talent) => void;
  drawSpiritRoot: () => SpiritRoot;
  drawTalent: () => Talent;
  drawTalentOptions: (count?: number) => Talent[];
  chooseCultivationPath: (pathId: CultivationPathId) => void;
  getCurrentEventChoices: () => EventChoice[];
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
const STARTING_AGE = 0;
const QI_CONDENSING_AGE = 10;
const BASE_ATTRIBUTE_VALUE = 10;

const initialState: GameState = {
  status: 'idle',
  age: STARTING_AGE,
  currentRealm: realms[0],
  attributes: {
    根骨: BASE_ATTRIBUTE_VALUE,
    神识: BASE_ATTRIBUTE_VALUE,
    悟性: BASE_ATTRIBUTE_VALUE,
    气运: BASE_ATTRIBUTE_VALUE,
    颜值: BASE_ATTRIBUTE_VALUE
  },
  familyWealth: BASE_ATTRIBUTE_VALUE,
  spiritRoot: null,
  talent: null,
  cultivationPath: null,
  lifespan: 100,
  cultivationProgress: 0,
  pendingEvent: null,
  pendingPathChoice: false,
  activeGoal: null,
  completedGoals: [],
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
      神识: clampAttribute(BASE_ATTRIBUTE_VALUE + (spiritRoot.effect.神识 || 0) + (talent.effect.神识 || 0), startingAttributeCap),
      悟性: clampAttribute(BASE_ATTRIBUTE_VALUE + (spiritRoot.effect.悟性 || 0) + (talent.effect.悟性 || 0), startingAttributeCap),
      气运: clampAttribute(BASE_ATTRIBUTE_VALUE + (spiritRoot.effect.气运 || 0) + (talent.effect.气运 || 0), startingAttributeCap),
      颜值: clampAttribute(BASE_ATTRIBUTE_VALUE + (spiritRoot.effect.颜值 || 0) + (talent.effect.颜值 || 0), startingAttributeCap)
    };
    const initialFamilyWealth = Math.max(
      0,
      BASE_ATTRIBUTE_VALUE + (spiritRoot.effect.家境 || 0) + (talent.effect.家境 || 0)
    );

    const newGameState: GameState = {
      status: 'playing',
      age: STARTING_AGE,
      currentRealm: realms[0],
      attributes: initialAttributes,
      familyWealth: initialFamilyWealth,
      spiritRoot,
      talent,
      cultivationPath: null,
      lifespan: 100,
      cultivationProgress: 0,
      pendingEvent: null,
      pendingPathChoice: false,
      activeGoal: null,
      completedGoals: [],
      events: [],
      achievements: ['初入仙途']
    };

    set({
      gameState: {
        ...newGameState,
        activeGoal: createActiveLifeGoal(newGameState)
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

  drawTalentOptions: (count = 3) => {
    return pickManyByProbability(talents, count);
  },

  chooseCultivationPath: (pathId) => {
    const { gameState } = get();
    if (gameState.status !== 'playing' || !gameState.pendingPathChoice) return;

    const path = getCultivationPath(pathId);
    if (!path) return;

    const pathEvent: GameEvent = {
      id: `cultivation-path-${path.id}-${gameState.age}`,
      age: gameState.age,
      type: 'cultivation',
      title: `流派初定：${path.name}`,
      description: `引气入体之后，你立下${path.name}之路。${path.description}`,
      weight: 0,
      effects: path.effect,
      appliedEffects: path.effect,
      result: 'success'
    };
    const stateAfterPath: GameState = {
      ...gameState,
      cultivationPath: path.id,
      pendingPathChoice: false,
      attributes: applyAttributeEffects(gameState, path.effect),
      familyWealth: applyFamilyWealthEffects(gameState, path.effect),
      events: [...gameState.events, pathEvent]
    };

    set({
      gameState: unlockAchievements(applyLifeGoalProgress(stateAfterPath, pathEvent))
    });
  },

  getCurrentEventChoices: () => {
    const { gameState } = get();
    if (!gameState.pendingEvent) return [];

    return getEventChoices(gameState.pendingEvent);
  },

  chooseEventOption: (choiceId) => {
    const { gameState } = get();
    if (gameState.status !== 'playing' || !gameState.pendingEvent) return;

    const event = gameState.pendingEvent;
    const eventChoices = getEventChoices(event);
    const choice = eventChoices.find(item => item.id === choiceId) ?? eventChoices[1];

    set({
      gameState: resolveGameEvent(gameState, event, choice)
    });

    get().checkGameEnd();
  },

  useBreakthroughPreparation: (actionId) => {
    const { gameState } = get();
    if (gameState.status !== 'playing' || gameState.pendingEvent || gameState.pendingPathChoice) return;

    const action = getPreparationAction(actionId, gameState.currentRealm.level);
    if (!action) return;

    if (gameState.familyWealth < action.cost) return;

    const requiredProgress = getRequiredCultivationProgress(gameState);
    const effects = action.effects(gameState);
    const stateAfterCost = {
      ...gameState,
      familyWealth: Math.max(0, gameState.familyWealth - action.cost)
    };
    const newAttributes = applyAttributeEffects(stateAfterCost, effects);
    const newFamilyWealth = applyFamilyWealthEffects(stateAfterCost, effects);
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

    const stateAfterPreparation: GameState = {
      ...gameState,
      attributes: newAttributes,
      familyWealth: newFamilyWealth,
      lifespan: lifespanDelta ? Math.max(1, gameState.lifespan + lifespanDelta) : gameState.lifespan,
      cultivationProgress: clampProgress(gameState.cultivationProgress + progressDelta, requiredProgress),
      events: [...gameState.events, preparationEvent]
    };

    set({
      gameState: unlockAchievements(applyLifeGoalProgress(stateAfterPreparation, preparationEvent))
    });
  },

  advanceAge: () => {
    const { gameState } = get();
    if (gameState.status !== 'playing' || gameState.pendingEvent || gameState.pendingPathChoice) return;

    const newAge = gameState.age + getCultivationYearStep(gameState.currentRealm.level);
    const agedState: GameState = {
      ...gameState,
      age: newAge
    };

    if (newAge >= gameState.lifespan) {
      set({ gameState: agedState });
      get().endGame('died', 'lifespan');
      return;
    }

    if (gameState.currentRealm.name === '幼年期' && newAge >= QI_CONDENSING_AGE) {
      set({ gameState: enterQiCondensingRealm(agedState) });
      return;
    }

    set({ gameState: agedState });

    get().processEvent();
  },

  processEvent: () => {
    const { gameState } = get();
    if (gameState.status !== 'playing' || gameState.pendingEvent || gameState.pendingPathChoice) return;
    const event = {
      ...selectAvailableEvent(gameState),
      age: gameState.age
    };

    if (!shouldOfferEventChoice(gameState, event)) {
      set({
        gameState: resolveGameEvent(gameState, event)
      });

      get().checkGameEnd();
      return;
    }

    set({
      gameState: {
        ...gameState,
        pendingEvent: event
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
    if (gameState.status !== 'playing' || gameState.pendingPathChoice || !canBreakthrough(gameState)) return;

    const currentIndex = realms.findIndex(r => r.name === gameState.currentRealm.name);
    const nextRealm = realms[currentIndex + 1];
    const breakthroughDeficit = calculateBreakthroughAverageDeficit(gameState, nextRealm);
    const breakthroughSuccessRate = calculateBreakthroughSuccessRate(gameState, nextRealm);

    if (Math.random() > breakthroughSuccessRate) {
      const failureEvent: GameEvent = {
        id: `breakthrough-failed-${Date.now()}`,
        age: gameState.age,
        type: 'disaster',
        title: '冲关失利',
        description: '你强行冲击瓶颈，灵机却在关口前散乱反噬，寿元与修为都折损了不少。',
        effects: {
          修为: -getBreakthroughFailureProgressPercent(gameState, breakthroughDeficit),
          寿命: -getBreakthroughFailureLifespanPercent(gameState, breakthroughDeficit)
        },
        result: 'failure'
      };
      const lifespanDelta = calculateLifespanDelta(gameState, failureEvent, failureEvent.effects);
      const progressDelta = calculateCultivationProgressDelta(gameState, failureEvent, failureEvent.effects);
      const stateAfterFailure: GameState = {
        ...gameState,
        lifespan: lifespanDelta ? Math.max(1, gameState.lifespan + lifespanDelta) : gameState.lifespan,
        cultivationProgress: clampProgress(
          gameState.cultivationProgress + progressDelta,
          getRequiredCultivationProgress(gameState)
        ),
        events: [
          ...gameState.events,
          {
            ...failureEvent,
            appliedEffects: buildAppliedEffects(failureEvent.effects, progressDelta, lifespanDelta)
          }
        ]
      };

      set({
        gameState: unlockAchievements(applyLifeGoalProgress(stateAfterFailure, failureEvent))
      });

      get().checkGameEnd();
      return;
    }

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

    const stateAfterBreakthrough: GameState = {
      ...gameState,
      currentRealm: nextRealm,
      lifespan: addLifespan(gameState.lifespan, lifespanGain),
      cultivationProgress: 0,
      events: [...gameState.events, breakthroughEvent]
    };

    set({
      gameState: unlockAchievements(applyLifeGoalProgress(stateAfterBreakthrough, breakthroughEvent))
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
      familyWealth: gameState.familyWealth,
      achievements: gameState.achievements
    });
  },

  resetGame: () => {
    set({ gameState: initialState });
  }
}));

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

function pickManyByProbability<T extends { probability: number }>(items: T[], count: number): T[] {
  const pool = [...items];
  const pickedItems: T[] = [];

  while (pickedItems.length < count && pool.length > 0) {
    const picked = pickByProbability(pool);
    pickedItems.push(picked);
    pool.splice(pool.indexOf(picked), 1);
  }

  return pickedItems;
}

function enterQiCondensingRealm(gameState: GameState): GameState {
  const qiRealm = realms.find(realm => realm.name === '炼气期') ?? realms[1];
  const transitionEvent: GameEvent = {
    id: `qi-condensing-${gameState.age}`,
    age: gameState.age,
    type: 'cultivation',
    title: '引气入体',
    description: '十岁这一年，你第一次清楚感到天地灵气入体流转，幼年蒙学至此化作修行根基。',
    weight: 0,
    effects: { 境界: 'advance' },
    appliedEffects: { 境界: 'advance' },
    result: 'success'
  };
  const stateAfterTransition: GameState = {
    ...gameState,
    currentRealm: qiRealm,
    cultivationProgress: 0,
    pendingPathChoice: true,
    events: [...gameState.events, transitionEvent]
  };

  return unlockAchievements(applyLifeGoalProgress(stateAfterTransition, transitionEvent));
}

function selectAvailableEvent(gameState: GameState): GameEvent {
  if (isChildhood(gameState)) {
    return pickWeightedEvent(childhoodEvents, gameState);
  }

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

  if (conditions.attributes && !meetsEventAttributeRequirements(gameState, conditions.attributes)) {
    return false;
  }

  return true;
}

function shouldOfferEventChoice(gameState: GameState, event: GameEvent): boolean {
  if (event.type === 'childhood') return false;
  if (hasSpecificEventChoices(event.id)) return true;
  if (event.result === 'neutral' && event.type === 'daily') return false;
  if (event.type === 'disaster') return true;
  if (hasNegativeNumericEffect(event)) return true;
  if (event.conditions && event.type !== 'daily') return true;
  if ((event.weight ?? 1) <= 0.55) return true;

  const choiceFriendlyTypes: GameEvent['type'][] = ['combat', 'encounter', 'social', 'resource', 'mind', 'sect'];
  if (!choiceFriendlyTypes.includes(event.type)) return false;

  const baseChance = gameState.currentRealm.level >= 4 ? 0.32 : 0.22;
  const typeBonus = event.type === 'encounter' || event.type === 'resource' || event.type === 'combat' ? 0.08 : 0;
  return Math.random() < baseChance + typeBonus;
}

function resolveGameEvent(gameState: GameState, event: GameEvent, choice?: EventChoice): GameState {
  const isNeutralEvent = event.result === 'neutral';
  const successRate = isNeutralEvent
    ? 0.5
    : clampRate(calculateEventSuccessRate(event, gameState) + (choice?.successModifier ?? 0));
  const result = event.type === 'childhood' ? 'neutral' : calculateEventOutcome(successRate, isNeutralEvent);
  const resolvedEffects = event.type === 'childhood' ? event.effects : resolveEventEffects(event, result);
  const chosenEffects = choice
    ? mergeEffects(scaleEventEffectsForChoice(resolvedEffects, choice), resolveChoiceEffects(gameState, choice))
    : resolvedEffects;
  const adjustedEffects = applyAttributeModifiers(gameState, event, chosenEffects);
  const progressDelta = calculateCultivationProgressDelta(gameState, event, chosenEffects);
  const lifespanDelta = calculateLifespanDelta(gameState, event, chosenEffects);
  const appliedEffects = buildAppliedEffects(adjustedEffects, progressDelta, lifespanDelta);
  const stateForEffects = {
    ...gameState,
    pendingEvent: null
  };
  const newAttributes = applyAttributeEffects(stateForEffects, adjustedEffects);
  const newFamilyWealth = applyFamilyWealthEffects(stateForEffects, adjustedEffects);
  const newLifespan = lifespanDelta
    ? Math.max(1, gameState.lifespan + lifespanDelta)
    : gameState.lifespan;
  const requiredProgress = getRequiredCultivationProgress(gameState);
  const newEvent: GameEvent = {
    ...event,
    title: choice ? `${event.title}：${choice.label}` : event.title,
    description: choice ? `${event.description}你选择${choice.label}，${choice.outcome}` : event.description,
    appliedEffects,
    result
  };
  const stateAfterEvent: GameState = {
    ...gameState,
    pendingEvent: null,
    attributes: newAttributes,
    familyWealth: newFamilyWealth,
    lifespan: newLifespan,
    cultivationProgress: clampProgress(gameState.cultivationProgress + progressDelta, requiredProgress),
    events: [...gameState.events, newEvent]
  };

  return unlockAchievements(applyLifeGoalProgress(stateAfterEvent, newEvent));
}

function calculateEventOutcome(successRate: number, isNeutralEvent: boolean): GameEvent['result'] {
  if (isNeutralEvent) return 'neutral';

  const greatSuccessChance = Math.max(0.04, Math.min(0.1, 0.04 + successRate * 0.06));
  const greatFailureChance = Math.max(0.04, Math.min(0.1, 0.04 + (1 - successRate) * 0.06));
  const roll = Math.random();

  if (roll < greatFailureChance) return 'great-failure';
  if (roll < greatFailureChance + greatSuccessChance) return 'great-success';
  return 'neutral';
}

function getEventChoices(event: GameEvent): EventChoice[] {
  const specificChoices = getSpecificEventChoices(event.id);
  if (specificChoices) return specificChoices;

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
    }
  ];
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

function getPreparationAction(actionId: string, realmLevel: number): PreparationAction | undefined {
  const actions: PreparationAction[] = [
    {
      id: 'stabilize',
      name: '稳固根基',
      description: '你暂缓冲境，回头打磨根基与悟法。修为略退，但突破门槛更容易补齐。',
      cost: 6,
      effects: () => ({ 根骨: 6, 神识: 4, 悟性: 4, 修为: -8 })
    },
    {
      id: 'elixir',
      name: '购置丹药',
      description: '你以灵石换来上好丹药，淬炼筋骨并稍延寿元。',
      cost: 18,
      effects: () => ({ 根骨: 10, 寿命: 1 })
    },
    {
      id: 'master',
      name: '请教高人',
      description: '你奉上厚礼，请高人为自己点破修行关窍。',
      cost: 16,
      effects: () => ({ 神识: 8, 悟性: 10, 修为: 4 })
    },
    {
      id: 'ward',
      name: '布置护阵',
      description: '你修缮洞府阵法，凝聚气运，也让心神更安定。',
      cost: 12,
      effects: () => ({ 神识: 3, 气运: 10, 颜值: 3 })
    }
  ];

  const action = actions.find(item => item.id === actionId);
  if (!action) return undefined;

  return {
    ...action,
    cost: getPreparationCost(action.cost, realmLevel)
  };
}

function getPreparationCost(baseCost: number, realmLevel: number): number {
  if (realmLevel >= 7) return Math.ceil(baseCost * 4);
  if (realmLevel >= 5) return Math.ceil(baseCost * 2.5);
  if (realmLevel >= 3) return Math.ceil(baseCost * 1.5);
  return baseCost;
}

function createActiveLifeGoal(gameState: GameState): ActiveLifeGoal | null {
  const availableGoals = getAvailableLifeGoals(gameState, false);
  const candidates = availableGoals.length > 0 ? availableGoals : getAvailableLifeGoals(gameState, true);
  if (candidates.length === 0) return null;

  const selected = candidates[Math.floor(Math.random() * candidates.length)];
  return {
    id: selected.id,
    progress: 0
  };
}

function getAvailableLifeGoals(gameState: GameState, allowCompleted: boolean): LifeGoalDefinition[] {
  return lifeGoals.filter(goal => {
    if (!allowCompleted && gameState.completedGoals.includes(goal.id)) return false;
    if (goal.minRealmLevel && gameState.currentRealm.level < goal.minRealmLevel) return false;
    if (goal.maxRealmLevel && gameState.currentRealm.level > goal.maxRealmLevel) return false;
    return true;
  });
}

function applyLifeGoalProgress(gameState: GameState, triggeringEvent: GameEvent): GameState {
  if (!gameState.activeGoal) {
    return {
      ...gameState,
      activeGoal: createActiveLifeGoal(gameState)
    };
  }

  const definition = getLifeGoalDefinition(gameState.activeGoal.id);
  if (!definition) {
    return {
      ...gameState,
      activeGoal: createActiveLifeGoal(gameState)
    };
  }

  const progressGain = calculateLifeGoalProgress(definition, triggeringEvent);
  if (progressGain <= 0) return gameState;

  const activeGoal = {
    ...gameState.activeGoal,
    progress: Math.min(definition.target, gameState.activeGoal.progress + progressGain)
  };

  if (activeGoal.progress < definition.target) {
    return {
      ...gameState,
      activeGoal
    };
  }

  return completeLifeGoal(
    {
      ...gameState,
      activeGoal
    },
    definition,
    triggeringEvent
  );
}

function calculateLifeGoalProgress(definition: LifeGoalDefinition, event: GameEvent): number {
  if (event.type === 'childhood') return 0;

  if (definition.progressKind === 'breakthrough') {
    return event.appliedEffects?.境界 === 'advance' || event.effects.境界 === 'advance' ? 1 : 0;
  }

  if (definition.progressKind === 'eventCount') {
    return definition.eventTypes?.includes(event.type) ? 1 : 0;
  }

  const appliedEffects = event.appliedEffects ?? event.effects;
  return (definition.effectKeys ?? []).reduce((sum, key) => {
    const value = appliedEffects[key];
    return typeof value === 'number' && value > 0 ? sum + value : sum;
  }, 0);
}

function completeLifeGoal(
  gameState: GameState,
  definition: LifeGoalDefinition,
  triggeringEvent: GameEvent
): GameState {
  const completedGoals = Array.from(new Set([...gameState.completedGoals, definition.id]));
  const rewardEvent: GameEvent = {
    id: `life-goal-${definition.id}-${Date.now()}`,
    age: gameState.age,
    type: 'daily',
    title: `道途目标：${definition.name}`,
    description: definition.completionText,
    effects: definition.reward,
    result: 'success'
  };
  const progressDelta = calculateCultivationProgressDelta(gameState, rewardEvent, definition.reward);
  const lifespanDelta = calculateLifespanDelta(gameState, rewardEvent, definition.reward);
  const rewardEffects = buildAppliedEffects(definition.reward, progressDelta, lifespanDelta);
  const newAttributes = applyAttributeEffects(gameState, definition.reward);
  const newFamilyWealth = applyFamilyWealthEffects(gameState, definition.reward);
  const requiredProgress = getRequiredCultivationProgress(gameState);
  const events = mergeLifeGoalRewardIntoEvents(
    gameState.events,
    triggeringEvent,
    definition,
    rewardEffects
  );
  const stateAfterReward: GameState = {
    ...gameState,
    attributes: newAttributes,
    familyWealth: newFamilyWealth,
    lifespan: lifespanDelta ? Math.max(1, gameState.lifespan + lifespanDelta) : gameState.lifespan,
    cultivationProgress: clampProgress(gameState.cultivationProgress + progressDelta, requiredProgress),
    events,
    completedGoals
  };

  return {
    ...stateAfterReward,
    activeGoal: createActiveLifeGoal(stateAfterReward)
  };
}

function mergeLifeGoalRewardIntoEvents(
  events: GameEvent[],
  triggeringEvent: GameEvent,
  definition: LifeGoalDefinition,
  rewardEffects: GameEvent['effects']
): GameEvent[] {
  if (events.length === 0) return events;

  const updatedEvents = [...events];
  const eventIndex = updatedEvents.findIndex(event => event.id === triggeringEvent.id);
  const targetIndex = eventIndex >= 0 ? eventIndex : updatedEvents.length - 1;
  const event = updatedEvents[targetIndex];

  updatedEvents[targetIndex] = {
    ...event,
    description: `${event.description}道途目标「${definition.name}」完成，${definition.completionText}`,
    appliedEffects: mergeEffects(event.appliedEffects ?? {}, rewardEffects)
  };

  return updatedEvents;
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

function applyFamilyWealthEffects(gameState: GameState, effects: GameEvent['effects']): number {
  if (typeof effects.家境 !== 'number') return gameState.familyWealth;

  return Math.max(0, Math.round(gameState.familyWealth + effects.家境));
}

function calculateCultivationProgressDelta(
  gameState: GameState,
  event: GameEvent,
  effects: GameEvent['effects']
): number {
  if (isChildhood(gameState) || event.type === 'childhood') {
    return 0;
  }

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
    if (key === '寿命' || key === '境界' || key === '修为' || key === '家境' || typeof value !== 'number') return;
    percentDelta += value > 0 ? 0.25 : -1.2;
  });

  if (event.type === 'disaster' && percentDelta < 0) {
    percentDelta *= Math.max(0.25, 1 - disasterResistance);
  }

  if (percentDelta > 0) {
    percentDelta *= cultivationMultiplier * realmProgressMultiplier * realmProgressPace;
  }

  const negativeProgressCap = event.id.startsWith('breakthrough-failed') ? -45 : -35;
  return toProgressDelta(Math.max(negativeProgressCap, Math.min(getProgressPercentCap(gameState), percentDelta)));
}

function getProgressPercentCap(gameState: GameState): number {
  switch (gameState.currentRealm.level) {
    case 4:
      return 24;
    case 5:
      return 20;
    case 6:
      return 17;
    case 7:
      return 14;
    case 8:
      return 12;
    default:
      return 40;
  }
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
    case 'childhood':
      return 0;
    case 'cultivation':
      return 8;
    case 'combat':
      return 9;
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
  const attributePower = {
    根骨: getAttributePower(attributes.根骨),
    神识: getAttributePower(attributes.神识),
    悟性: getAttributePower(attributes.悟性),
    气运: getAttributePower(attributes.气运),
    颜值: getAttributePower(attributes.颜值),
    家境: getAttributePower(gameState.familyWealth)
  };
  let baseRate = 0.5;

  switch (event.type) {
    case 'childhood':
      baseRate = 1;
      break;
    case 'cultivation':
      baseRate = 0.24
        + (attributePower.根骨 * 0.01)
        + (attributePower.悟性 * 0.007)
        + (attributePower.神识 * 0.006)
        + (attributePower.家境 * 0.0015);
      break;
    case 'combat':
      baseRate = 0.24
        + (attributePower.根骨 * 0.011)
        + (attributePower.神识 * 0.008)
        + (attributePower.气运 * 0.004);
      break;
    case 'encounter':
      baseRate = 0.24
        + (attributePower.气运 * 0.013)
        + (attributePower.家境 * 0.002);
      break;
    case 'social':
      baseRate = 0.24
        + (attributePower.颜值 * 0.012)
        + (attributePower.家境 * 0.002);
      break;
    case 'disaster':
      baseRate = 0.22
        + (attributePower.根骨 * 0.01)
        + (attributePower.神识 * 0.006)
        + (attributePower.家境 * 0.0015)
        + disasterResistance;
      break;
    case 'daily':
      baseRate = 0.36
        + (attributePower.悟性 * 0.007)
        + (attributePower.神识 * 0.003)
        + (attributePower.家境 * 0.0025);
      break;
    case 'resource':
      baseRate = 0.26
        + (attributePower.家境 * 0.009)
        + (attributePower.气运 * 0.004);
      break;
    case 'mind':
      baseRate = 0.28
        + (attributePower.悟性 * 0.007)
        + (attributePower.神识 * 0.008)
        + (attributePower.气运 * 0.003);
      break;
    case 'sect':
      baseRate = 0.27
        + (attributePower.家境 * 0.004)
        + (attributePower.颜值 * 0.005)
        + (attributePower.悟性 * 0.003);
      break;
  }

  baseRate += getEventSpecificModifier(event, gameState.familyWealth);

  return Math.max(0.1, Math.min(0.9, baseRate));
}

function getAttributePower(value: number): number {
  return Math.sqrt(Math.max(0, value));
}

function getEventSpecificModifier(event: GameEvent, familyWealth: number): number {
  const familyPower = getAttributePower(familyWealth);

  switch (event.id) {
    case 'daily-merchant':
    case 'resource-auction':
      return familyPower * 0.0035;
    case 'daily-sect-mission':
    case 'sect-inner-test':
      return familyPower * 0.0025;
    case 'encounter-master':
      return familyPower * 0.0025;
    case 'social-partner':
    case 'social-brother':
      return familyPower * 0.0025;
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

    if (key === '寿命' || key === '修为' || key === '家境') {
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

function resolveEventEffects(event: GameEvent, result: GameEvent['result']): GameEvent['effects'] {
  const resolvedEffects: GameEvent['effects'] = {};

  Object.entries(event.effects).forEach(([key, value]) => {
    if (typeof value !== 'number') {
      (resolvedEffects as Record<string, typeof value>)[key] = value;
      return;
    }

    const resolvedValue = scaleEffectByOutcome(value, result);

    if (resolvedValue !== 0) {
      (resolvedEffects as Record<string, number>)[key] = resolvedValue;
    }
  });

  return resolvedEffects;
}

function scaleEffectByOutcome(value: number, result: GameEvent['result']): number {
  switch (result) {
    case 'great-success':
      return scaleNumericValue(value, value > 0 ? 1.35 : 0.5);
    case 'great-failure':
      return scaleNumericValue(value, value > 0 ? 0.5 : 1.35);
    case 'success':
      return scaleNumericValue(value, value > 0 ? 1.15 : 0.7);
    case 'failure':
      return scaleNumericValue(value, value > 0 ? 0.7 : 1.15);
    case 'neutral':
    default:
      return scaleNumericValue(value, 0.75);
  }
}

function hasNegativeNumericEffect(event: GameEvent): boolean {
  return Object.values(event.effects).some(value => typeof value === 'number' && value < 0);
}

function scaleNumericValue(value: number, factor: number): number {
  const scaledValue = value > 0
    ? Math.floor(value * factor)
    : Math.ceil(value * factor);

  if (scaledValue === 0 && value !== 0 && factor > 0) {
    return value > 0 ? 1 : -1;
  }

  return scaledValue;
}

function canBreakthrough(gameState: GameState): boolean {
  return !isChildhood(gameState)
    && !gameState.pendingPathChoice
    && !gameState.pendingEvent
    && gameState.cultivationProgress >= getRequiredCultivationProgress(gameState);
}

function canAdvanceRealm(gameState: GameState): boolean {
  const { currentRealm, attributes } = gameState;

  if (isChildhood(gameState)) return false;

  const realmIndex = realms.findIndex(r => r.name === currentRealm.name);
  if (realmIndex >= realms.length - 1) return false;

  const requirements = realms[realmIndex + 1].requirements;

  if (!meetsAttributeRequirements(attributes, requirements.attributes)) return false;

  return true;
}

function calculateBreakthroughSuccessRate(
  gameState: GameState,
  nextRealm: GameState['currentRealm']
): number {
  const requirements = Object.entries(nextRealm.requirements.attributes);
  const averageSurplus = requirements.length > 0
    ? requirements.reduce((sum, [key, required]) => {
      const requiredValue = required ?? 1;
      const current = gameState.attributes[key as keyof Attributes];
      return sum + Math.min(0.35, Math.max(0, (current - requiredValue) / requiredValue));
    }, 0) / requirements.length
    : 0;
  const averageDeficit = calculateBreakthroughAverageDeficit(gameState, nextRealm);
  const fortuneBonus = getAttributePower(gameState.attributes.气运) * 0.006;
  const realmPressure = Math.max(0, gameState.currentRealm.level - 3) * 0.02;
  const minimumRate = averageDeficit >= 0.5 ? 0.05 : averageDeficit >= 0.3 ? 0.07 : 0.1;

  return Math.max(
    minimumRate,
    Math.min(0.92, 0.74 + averageSurplus * 0.45 + fortuneBonus - realmPressure - averageDeficit * 0.75)
  );
}

function calculateBreakthroughAverageDeficit(
  gameState: GameState,
  nextRealm: GameState['currentRealm']
): number {
  const requirements = Object.entries(nextRealm.requirements.attributes);

  if (requirements.length === 0) return 0;

  return requirements.reduce((sum, [key, required]) => {
    const requiredValue = required ?? 1;
    const current = gameState.attributes[key as keyof Attributes];
    return sum + Math.min(0.85, Math.max(0, (requiredValue - current) / requiredValue));
  }, 0) / requirements.length;
}

function getBreakthroughFailureProgressPercent(gameState: GameState, averageDeficit: number): number {
  const basePercent = gameState.currentRealm.level >= 6 ? 35 : gameState.currentRealm.level >= 4 ? 30 : 25;
  if (averageDeficit >= 0.5) return Math.min(45, basePercent + 10);
  if (averageDeficit >= 0.3) return Math.min(42, basePercent + 6);
  return basePercent;
}

function getBreakthroughFailureLifespanPercent(gameState: GameState, averageDeficit: number): number {
  const basePercent = Math.min(8, Math.max(1, gameState.currentRealm.level));
  if (averageDeficit >= 0.5) return Math.min(12, basePercent + 4);
  if (averageDeficit >= 0.3) return Math.min(10, basePercent + 2);
  return basePercent;
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

function meetsEventAttributeRequirements(
  gameState: GameState,
  requirements: Partial<Attributes> & { 家境?: number }
): boolean {
  return Object.entries(requirements).every(([key, required]) => {
    if (!required) return true;
    if (key === '家境') return gameState.familyWealth >= required;

    return gameState.attributes[key as keyof Attributes] >= required;
  });
}

function getRequiredCultivationProgress(gameState: GameState): number {
  const realmIndex = realms.findIndex(r => r.name === gameState.currentRealm.name);
  const nextRealm = realmIndex >= 0 ? realms[realmIndex + 1] : undefined;

  return nextRealm?.cultivationRequired ?? 0;
}

function getCultivationYearStep(realmLevel: number): number {
  switch (realmLevel) {
    case 2:
      return 2;
    case 3:
      return 3;
    case 4:
      return 5;
    case 5:
      return 10;
    case 6:
      return 20;
    case 7:
      return 40;
    case 8:
      return 80;
    case 9:
      return 100;
    default:
      return 1;
  }
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

function isChildhood(gameState: GameState): boolean {
  return gameState.currentRealm.name === '幼年期' || gameState.age < QI_CONDENSING_AGE;
}

function getCombinedModifiers(gameState: GameState): GrowthModifiers {
  return mergeModifiers(
    gameState.spiritRoot?.modifiers,
    gameState.talent?.modifiers,
    getCultivationPath(gameState.cultivationPath)?.modifiers
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
  if (gameState.completedGoals.length >= 1) achievements.add('道途初成');
  if (gameState.completedGoals.length >= 5) achievements.add('百炼成途');
  if (gameState.currentRealm.level >= 2) achievements.add('筑基有成');
  if (gameState.currentRealm.level >= 3) achievements.add('金丹大道');
  if (gameState.currentRealm.level >= 4) achievements.add('元婴出窍');
  if (gameState.currentRealm.level >= 5) achievements.add('化神问道');
  if (gameState.currentRealm.level >= 8) achievements.add('大乘在望');
  if (gameState.currentRealm.name === '渡劫期') achievements.add('渡劫之身');
  if (Object.values(gameState.attributes).some(value => value >= 300)) achievements.add('一项通玄');
  if (Object.values(gameState.attributes).every(value => value >= 120)) achievements.add('五维均衡');
  if (gameState.familyWealth >= 200) achievements.add('富甲仙门');
  if (gameState.talent?.rarity === '传说') achievements.add('传说命格');
  if (gameState.spiritRoot?.rarity === '神话') achievements.add('神话灵根');

  return {
    ...gameState,
    achievements: Array.from(achievements)
  };
}
