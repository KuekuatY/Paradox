import { create } from 'zustand';
import { talents } from '@/data/talents';
import { spiritRoots } from '@/data/spiritRoots';
import { realms } from '@/data/realms';
import { childhoodEvents, earlyEvents, lateEvents, midEvents } from '@/data/events';
import { getCultivationPath } from '@/data/cultivationPaths';
import { lifeGoals, getLifeGoalDefinition } from '@/data/lifeGoals';
import { getSpecificEventChoices, hasSpecificEventChoices } from '@/data/eventChoices';
import { getItem } from '@/data/items';
import { getAvailableTechniqueRewards, getBaseTechnique, getTechnique } from '@/data/techniques';
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
  LifeGoalDefinition,
  CombatReport,
  CombatStats,
  InventoryEntry,
  InventoryReward,
  LearnedTechnique,
  TechniqueDefinition,
  TribulationState
} from '@/types';
import { getSavedGame, hasSavedGame, saveGameRecord, saveGameState } from '@/utils/storage';

interface GameStore {
  gameState: GameState;
  startNewGame: (selectedSpiritRoot?: SpiritRoot, selectedTalent?: Talent, characterName?: string) => void;
  drawSpiritRoot: () => SpiritRoot;
  drawTalent: () => Talent;
  drawTalentOptions: (count?: number) => Talent[];
  chooseCultivationPath: (pathId: CultivationPathId) => void;
  getCurrentEventChoices: () => EventChoice[];
  chooseEventOption: (choiceId: string) => void;
  useInventoryItem: (itemId: string) => void;
  trainTechnique: (techniqueId: string) => void;
  useBreakthroughPreparation: (actionId: string) => void;
  advanceAge: () => void;
  processEvent: () => void;
  checkRealmAdvancement: () => boolean;
  canBreakthrough: () => boolean;
  breakthroughRealm: () => void;
  resolveTribulationStrike: (success: boolean) => void;
  saveCurrentGame: () => void;
  loadSavedGame: () => boolean;
  hasSavedGame: () => boolean;
  checkGameEnd: () => void;
  endGame: (result: 'died' | 'ascended', reason?: GameState['endReason']) => void;
  resetGame: () => void;
}

const ATTRIBUTE_MAX = 9999;
const STARTING_AGE = 0;
const QI_CONDENSING_AGE = 10;
const BASE_ATTRIBUTE_VALUE = 10;
const initialCombatStats: CombatStats = {
  victories: 0,
  defeats: 0,
  injury: 0,
  bestStreak: 0,
  currentStreak: 0
};

const initialState: GameState = {
  status: 'idle',
  characterName: '无名',
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
  combatStats: initialCombatStats,
  inventory: [],
  techniques: [],
  spiritRoot: null,
  talent: null,
  cultivationPath: null,
  lifespan: 100,
  cultivationProgress: 0,
  pendingEvent: null,
  pendingPathChoice: false,
  pendingTribulation: null,
  activeGoal: null,
  completedGoals: [],
  events: [],
  achievements: []
};

export const useGameStore = create<GameStore>((set, get) => ({
  gameState: initialState,

  startNewGame: (selectedSpiritRoot, selectedTalent, characterName) => {
    const spiritRoot = selectedSpiritRoot ?? get().drawSpiritRoot();
    const talent = selectedTalent ?? get().drawTalent();
    const normalizedCharacterName = normalizeCharacterName(characterName);
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
      characterName: normalizedCharacterName,
      age: STARTING_AGE,
      currentRealm: realms[0],
      attributes: initialAttributes,
      familyWealth: initialFamilyWealth,
      combatStats: initialCombatStats,
      inventory: [],
      techniques: [],
      spiritRoot,
      talent,
      cultivationPath: null,
      lifespan: 100,
      cultivationProgress: 0,
      pendingEvent: null,
      pendingPathChoice: false,
      pendingTribulation: null,
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

    const baseTechnique = getBaseTechnique(path.id);
    const techniqueRewards = baseTechnique ? [baseTechnique.id] : [];
    const pathEvent: GameEvent = {
      id: `cultivation-path-${path.id}-${gameState.age}`,
      age: gameState.age,
      type: 'cultivation',
      title: `流派初定：${path.name}`,
      description: `引气入体之后，你立下${path.name}之路。${path.description}${baseTechnique ? `师长授你《${baseTechnique.name}》，作为最初修炼根本。` : ''}`,
      weight: 0,
      effects: path.effect,
      appliedEffects: path.effect,
      ...(techniqueRewards.length > 0 ? { techniqueRewards } : {}),
      result: 'neutral'
    };
    const stateAfterPath: GameState = {
      ...gameState,
      cultivationPath: path.id,
      pendingPathChoice: false,
      techniques: addLearnedTechniques(gameState.techniques, techniqueRewards),
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

  useInventoryItem: (itemId) => {
    const { gameState } = get();
    if (gameState.status !== 'playing' || gameState.pendingEvent || gameState.pendingPathChoice || gameState.pendingTribulation) return;

    const item = getItem(itemId);
    const inventoryEntry = gameState.inventory.find(entry => entry.itemId === itemId);
    if (!item || !item.usable || !item.effects || !inventoryEntry || inventoryEntry.quantity <= 0) return;

    const progressDelta = calculateCultivationProgressDelta(gameState, {
      id: `use-item-${item.id}`,
      age: gameState.age,
      type: 'resource',
      title: `使用${item.name}`,
      description: item.description,
      effects: item.effects,
      result: 'neutral'
    }, item.effects);
    const lifespanDelta = calculateLifespanDelta(gameState, {
      id: `use-item-${item.id}`,
      age: gameState.age,
      type: 'resource',
      title: `使用${item.name}`,
      description: item.description,
      effects: item.effects,
      result: 'neutral'
    }, item.effects);
    const itemEvent: GameEvent = {
      id: `use-item-${item.id}-${Date.now()}`,
      age: gameState.age,
      type: 'resource',
      title: `使用${item.name}`,
      description: `你从储物戒中取出${item.name}，${item.description}`,
      effects: item.effects,
      appliedEffects: buildAppliedEffects(item.effects, progressDelta, lifespanDelta),
      result: 'neutral'
    };
    const stateAfterUse: GameState = {
      ...gameState,
      attributes: applyAttributeEffects(gameState, item.effects),
      familyWealth: applyFamilyWealthEffects(gameState, item.effects),
      lifespan: lifespanDelta ? Math.max(1, gameState.lifespan + lifespanDelta) : gameState.lifespan,
      cultivationProgress: clampProgress(
        gameState.cultivationProgress + progressDelta,
        getRequiredCultivationProgress(gameState)
      ),
      inventory: removeInventoryItem(gameState.inventory, itemId, 1),
      events: [...gameState.events, itemEvent]
    };

    set({
      gameState: unlockAchievements(applyLifeGoalProgress(stateAfterUse, itemEvent))
    });

    get().checkGameEnd();
  },

  trainTechnique: (techniqueId) => {
    const { gameState } = get();
    if (gameState.status !== 'playing' || gameState.pendingEvent || gameState.pendingPathChoice || gameState.pendingTribulation) return;

    const learnedTechnique = gameState.techniques.find(technique => technique.techniqueId === techniqueId);
    const technique = getTechnique(techniqueId);
    if (!learnedTechnique || !technique || learnedTechnique.level >= technique.maxLevel) return;
    if (gameState.currentRealm.level < technique.minRealmLevel) return;

    const cost = getTechniqueTrainingCost(gameState, technique);
    if (gameState.cultivationProgress < cost.progressCost) return;
    if (gameState.age >= gameState.lifespan - cost.timeCost) return;

    const effect = technique.effectsPerLevel;
    const nextLevel = learnedTechnique.level + 1;
    const techniqueEvent: GameEvent = {
      id: `technique-training-${technique.id}-${Date.now()}`,
      age: gameState.age,
      type: 'cultivation',
      title: `修炼${technique.name}`,
      description: `你闭关参悟《${technique.name}》，以修为与时间换取功法精进，功法提升至第 ${nextLevel} 层。`,
      effects: {
        ...effect,
        修为: -technique.trainCost.修为
      },
      appliedEffects: {
        ...effect,
        修为: -cost.progressCost,
        时间: cost.timeCost
      },
      result: 'neutral'
    };
    const stateAfterTraining: GameState = {
      ...gameState,
      age: gameState.age + cost.timeCost,
      attributes: applyAttributeEffects(gameState, effect),
      cultivationProgress: Math.max(0, gameState.cultivationProgress - cost.progressCost),
      techniques: gameState.techniques.map(techniqueState => techniqueState.techniqueId === technique.id
        ? { ...techniqueState, level: nextLevel }
        : techniqueState
      ),
      events: [...gameState.events, techniqueEvent]
    };

    set({
      gameState: unlockAchievements(applyLifeGoalProgress(stateAfterTraining, techniqueEvent))
    });

    get().checkGameEnd();
  },

  useBreakthroughPreparation: (actionId) => {
    const { gameState } = get();
    if (gameState.status !== 'playing' || gameState.pendingEvent || gameState.pendingPathChoice || gameState.pendingTribulation) return;

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
    if (gameState.status !== 'playing' || gameState.pendingEvent || gameState.pendingPathChoice || gameState.pendingTribulation) return;

    const newAge = gameState.age + getCultivationYearStep(gameState.currentRealm.level);
    const agedState: GameState = {
      ...gameState,
      age: newAge,
      combatStats: recoverCombatInjury(gameState.combatStats, gameState.currentRealm.level)
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
    if (gameState.status !== 'playing' || gameState.pendingEvent || gameState.pendingPathChoice || gameState.pendingTribulation) return;
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
    if (gameState.status !== 'playing' || gameState.pendingPathChoice || gameState.pendingTribulation || !canBreakthrough(gameState)) return;

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
        result: 'great-failure'
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

    if (requiresTribulation(nextRealm)) {
      set({
        gameState: {
          ...gameState,
          pendingTribulation: createTribulationState(nextRealm)
        }
      });
      return;
    }

    set({
      gameState: completeBreakthrough(gameState, nextRealm, currentIndex)
    });

    get().checkGameEnd();
  },

  resolveTribulationStrike: (success) => {
    const { gameState } = get();
    const tribulation = gameState.pendingTribulation;
    if (gameState.status !== 'playing' || !tribulation) return;

    const resolvedTribulation: TribulationState = {
      ...tribulation,
      strikesResolved: tribulation.strikesResolved + 1,
      successes: tribulation.successes + (success ? 1 : 0),
      failures: tribulation.failures + (success ? 0 : 1)
    };

    if (resolvedTribulation.strikesResolved < resolvedTribulation.strikesRequired) {
      set({
        gameState: {
          ...gameState,
          pendingTribulation: resolvedTribulation
        }
      });
      return;
    }

    const currentIndex = realms.findIndex(r => r.name === gameState.currentRealm.name);
    const nextRealm = realms[currentIndex + 1];
    if (!nextRealm || nextRealm.name !== resolvedTribulation.targetRealmName) {
      set({
        gameState: {
          ...gameState,
          pendingTribulation: null
        }
      });
      return;
    }

    const passed = resolvedTribulation.successes >= getTribulationSuccessThreshold(resolvedTribulation.strikesRequired);
    const resolvedState = passed
      ? completeTribulationSuccess(gameState, nextRealm, currentIndex, resolvedTribulation)
      : completeTribulationFailure(gameState, resolvedTribulation);

    set({ gameState: resolvedState });
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
        pendingTribulation: null,
        endReason
      }
    });

    saveGameRecord({
      id: Date.now().toString(),
      date: new Date().toISOString(),
      characterName: gameState.characterName,
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
  },

  saveCurrentGame: () => {
    const { gameState } = get();
    if (gameState.status !== 'playing') return;

    saveGameState(gameState);
  },

  loadSavedGame: () => {
    const saveSlot = getSavedGame();
    if (!saveSlot) return false;

    set({
      gameState: normalizeLoadedGameState(saveSlot.gameState)
    });
    return true;
  },

  hasSavedGame: () => {
    return hasSavedGame();
  }
}));

function completeBreakthrough(
  gameState: GameState,
  nextRealm: GameState['currentRealm'],
  currentIndex: number
): GameState {
  const lifespanGain = getRealmLifespanGain(currentIndex);
  const breakthroughEvent: GameEvent = {
    id: `breakthrough-${Date.now()}`,
    age: gameState.age,
    type: 'cultivation',
    title: '突破瓶颈',
    description: `灵机圆满，瓶颈破开，你踏入了${nextRealm.name}。`,
    effects: { 境界: 'advance', 寿命: lifespanGain },
    appliedEffects: { 境界: 'advance', 寿命: lifespanGain },
    result: 'neutral'
  };

  const stateAfterBreakthrough: GameState = {
    ...gameState,
    currentRealm: nextRealm,
    lifespan: addLifespan(gameState.lifespan, lifespanGain),
    cultivationProgress: 0,
    pendingTribulation: null,
    events: [...gameState.events, breakthroughEvent]
  };

  return unlockAchievements(applyLifeGoalProgress(stateAfterBreakthrough, breakthroughEvent));
}

function requiresTribulation(nextRealm: GameState['currentRealm']): boolean {
  return nextRealm.level >= 5 && nextRealm.level <= 9;
}

function createTribulationState(nextRealm: GameState['currentRealm']): TribulationState {
  return {
    targetRealmName: nextRealm.name,
    targetRealmLevel: nextRealm.level,
    strikesRequired: getTribulationStrikeCount(nextRealm.level),
    strikesResolved: 0,
    successes: 0,
    failures: 0
  };
}

function getTribulationStrikeCount(targetRealmLevel: number): number {
  switch (targetRealmLevel) {
    case 5:
      return 1;
    case 6:
      return 3;
    case 7:
      return 5;
    case 8:
      return 7;
    case 9:
      return 9;
    default:
      return 0;
  }
}

function getTribulationSuccessThreshold(strikesRequired: number): number {
  return Math.ceil(strikesRequired * 0.6);
}

function completeTribulationSuccess(
  gameState: GameState,
  nextRealm: GameState['currentRealm'],
  currentIndex: number,
  tribulation: TribulationState
): GameState {
  const lifespanGain = getRealmLifespanGain(currentIndex);
  const rootGain = getTribulationRootGain(tribulation);
  const progressPercent = getTribulationProgressBonusPercent(tribulation);
  const stateAtNewRealm: GameState = {
    ...gameState,
    currentRealm: nextRealm,
    lifespan: addLifespan(gameState.lifespan, lifespanGain),
    cultivationProgress: 0,
    pendingTribulation: null
  };
  const requiredProgress = getRequiredCultivationProgress(stateAtNewRealm);
  const progressGain = Math.trunc(requiredProgress * progressPercent / 100);
  const effects: GameEvent['effects'] = {
    境界: 'advance',
    寿命: lifespanGain,
    根骨: rootGain,
    修为: progressPercent
  };
  const newAttributes = applyAttributeEffects(stateAtNewRealm, effects);
  const appliedEffects: GameEvent['effects'] = {
    境界: 'advance',
    寿命: lifespanGain,
    根骨: newAttributes.根骨 - gameState.attributes.根骨,
    ...(progressGain > 0 ? { 修为: progressGain } : {})
  };
  const tribulationEvent: GameEvent = {
    id: `tribulation-success-${Date.now()}`,
    age: gameState.age,
    type: 'cultivation',
    title: `渡劫功成：${nextRealm.name}`,
    description: `瓶颈破开后，天雷接踵而至。你接下 ${tribulation.successes}/${tribulation.strikesRequired} 道关键雷劫，雷意反炼筋骨，终成${nextRealm.name}。`,
    effects,
    appliedEffects,
    result: 'great-success'
  };
  const stateAfterTribulation: GameState = {
    ...stateAtNewRealm,
    attributes: newAttributes,
    cultivationProgress: clampProgress(progressGain, requiredProgress),
    events: [...gameState.events, tribulationEvent]
  };

  return unlockAchievements(applyLifeGoalProgress(stateAfterTribulation, tribulationEvent));
}

function completeTribulationFailure(
  gameState: GameState,
  tribulation: TribulationState
): GameState {
  const rootLoss = getTribulationRootLoss(tribulation);
  const lifespanLossPercent = getTribulationLifespanLossPercent(tribulation);
  const effects: GameEvent['effects'] = {
    根骨: -rootLoss,
    寿命: -lifespanLossPercent
  };
  const tribulationEvent: GameEvent = {
    id: `tribulation-failed-${Date.now()}`,
    age: gameState.age,
    type: 'disaster',
    title: '渡劫失利',
    description: `瓶颈虽破，雷劫却来得更凶。你只稳住 ${tribulation.successes}/${tribulation.strikesRequired} 道关键雷劫，劫雷反噬，升境功败垂成。`,
    effects,
    result: 'great-failure'
  };
  const lifespanDelta = calculateLifespanDelta(gameState, tribulationEvent, effects);
  const newAttributes = applyAttributeEffects(gameState, effects);
  const resolvedEvent: GameEvent = {
    ...tribulationEvent,
    appliedEffects: {
      根骨: newAttributes.根骨 - gameState.attributes.根骨,
      寿命: lifespanDelta
    }
  };
  const stateAfterTribulation: GameState = {
    ...gameState,
    pendingTribulation: null,
    attributes: newAttributes,
    lifespan: lifespanDelta ? Math.max(1, gameState.lifespan + lifespanDelta) : gameState.lifespan,
    events: [...gameState.events, resolvedEvent]
  };

  return unlockAchievements(applyLifeGoalProgress(stateAfterTribulation, resolvedEvent));
}

function getTribulationRootGain(tribulation: TribulationState): number {
  return Math.max(2, Math.round(tribulation.strikesRequired * 1.2 + tribulation.successes * 0.8));
}

function getTribulationProgressBonusPercent(tribulation: TribulationState): number {
  return Math.min(18, 4 + tribulation.strikesRequired + tribulation.successes);
}

function getTribulationRootLoss(tribulation: TribulationState): number {
  return Math.max(3, Math.round(tribulation.strikesRequired * 1.2 + tribulation.failures));
}

function getTribulationLifespanLossPercent(tribulation: TribulationState): number {
  return Math.min(18, 4 + tribulation.strikesRequired + tribulation.failures);
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

function normalizeCharacterName(characterName: string | undefined): string {
  const trimmed = characterName?.trim() ?? '';
  return trimmed.length > 0 ? trimmed.slice(0, 12) : '无名';
}

function normalizeLoadedGameState(gameState: GameState): GameState {
  return {
    ...gameState,
    status: gameState.status === 'ended' ? 'playing' : gameState.status,
    characterName: normalizeCharacterName(gameState.characterName),
    pendingEvent: gameState.pendingEvent ?? null,
    pendingPathChoice: !!gameState.pendingPathChoice,
    pendingTribulation: gameState.pendingTribulation ?? null,
    combatStats: gameState.combatStats ?? initialCombatStats,
    inventory: Array.isArray(gameState.inventory) ? gameState.inventory : [],
    techniques: Array.isArray(gameState.techniques) ? gameState.techniques : [],
    events: Array.isArray(gameState.events) ? gameState.events : [],
    achievements: Array.isArray(gameState.achievements) ? gameState.achievements : [],
    completedGoals: Array.isArray(gameState.completedGoals) ? gameState.completedGoals : []
  };
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
    result: 'neutral'
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

  const eventPool = getRealmEventPool(gameState);
  const availableEvents = eventPool.filter(event => {
    return event.effects.境界 !== 'advance' && matchesEventConditions(event, gameState);
  });

  return pickWeightedEvent(availableEvents.length > 0 ? availableEvents : eventPool, gameState);
}

function getRealmEventPool(gameState: GameState): GameEvent[] {
  if (gameState.currentRealm.level >= 7) return lateEvents;
  if (gameState.currentRealm.level >= 4) return midEvents;
  return earlyEvents;
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

function shouldOfferEventChoice(_gameState: GameState, event: GameEvent): boolean {
  if (event.type === 'childhood') return false;

  return hasSpecificEventChoices(event.id);
}

function resolveGameEvent(gameState: GameState, event: GameEvent, choice?: EventChoice): GameState {
  if (event.type === 'combat') {
    return resolveCombatEvent(gameState, event, choice);
  }

  const choiceDifferential = choice ? rollChoiceDifferential() : undefined;
  const effectiveChoice = choice && choiceDifferential
    ? applyChoiceDifferential(choice, choiceDifferential)
    : choice;
  const isNeutralEvent = event.result === 'neutral';
  const successRate = isNeutralEvent
    ? 0.5
    : clampRate(calculateEventSuccessRate(event, gameState) + (effectiveChoice?.successModifier ?? 0));
  const result = event.type === 'childhood'
    ? 'neutral'
    : calculateEventOutcome(successRate, isNeutralEvent, getEventOutcomePhase(gameState));
  const resolvedEffects = event.type === 'childhood' ? event.effects : resolveEventEffects(event, result);
  const chosenEffects = effectiveChoice
    ? mergeEffects(
      scaleEventEffectsForChoice(resolvedEffects, effectiveChoice),
      resolveChoiceEffects(gameState, effectiveChoice)
    )
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
  const itemRewards = generateEventItemRewards(event, result);
  const techniqueRewards = generateEventTechniqueRewards(gameState, event, result);
  const newEvent: GameEvent = {
    ...event,
    title: choice ? `${event.title}：${formatChoiceTitle(choice, choiceDifferential)}` : event.title,
    description: choice ? `${event.description}${formatChoiceOutcome(choice, choiceDifferential)}` : event.description,
    appliedEffects,
    ...(itemRewards.length > 0 ? { itemRewards } : {}),
    ...(techniqueRewards.length > 0 ? { techniqueRewards } : {}),
    result
  };
  const stateAfterEvent: GameState = {
    ...gameState,
    pendingEvent: null,
    attributes: newAttributes,
    familyWealth: newFamilyWealth,
    lifespan: newLifespan,
    cultivationProgress: clampProgress(gameState.cultivationProgress + progressDelta, requiredProgress),
    inventory: addInventoryRewards(gameState.inventory, itemRewards),
    techniques: addLearnedTechniques(gameState.techniques, techniqueRewards),
    events: [...gameState.events, newEvent]
  };

  return unlockAchievements(applyLifeGoalProgress(stateAfterEvent, newEvent));
}

interface CombatEncounter {
  enemyName: string;
  enemyRank: string;
  difficulty: number;
  cultivationPercent: number;
  injury: number;
  primary: Array<keyof Attributes>;
  styleText: string;
}

function resolveCombatEvent(gameState: GameState, event: GameEvent, choice?: EventChoice): GameState {
  const choiceDifferential = choice ? rollChoiceDifferential() : undefined;
  const effectiveChoice = choice && choiceDifferential
    ? applyChoiceDifferential(choice, choiceDifferential)
    : choice;
  const combatResult = calculateCombatResult(gameState, event, effectiveChoice);
  const baseEffects = scaleCombatBaseEffects(event.effects, combatResult.rawResult);
  const choiceEffects = effectiveChoice
    ? mergeEffects(
      scaleEventEffectsForChoice(baseEffects, effectiveChoice),
      resolveChoiceEffects(gameState, effectiveChoice)
    )
    : baseEffects;
  const combatEffects = getCombatRewardEffects(combatResult.report, combatResult.rawResult, combatResult.isWin);
  const chosenEffects = mergeEffects(choiceEffects, combatEffects);
  const adjustedEffects = applyAttributeModifiers(gameState, event, chosenEffects);
  const progressDelta = calculateCultivationProgressDelta(gameState, event, adjustedEffects);
  const lifespanDelta = calculateLifespanDelta(gameState, event, adjustedEffects);
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
  const itemRewards = generateCombatItemRewards(event, combatResult.rawResult, combatResult.isWin);
  const itemLosses = generateCombatItemLosses(gameState, combatResult.rawResult, combatResult.isWin);
  const techniqueRewards = combatResult.isWin
    ? generateEventTechniqueRewards(gameState, event, combatResult.rawResult)
    : [];
  const choiceText = choice ? formatChoiceOutcome(choice, choiceDifferential) : '';
  const newEvent: GameEvent = {
    ...event,
    title: choice ? `${event.title}：${formatChoiceTitle(choice, choiceDifferential)}` : event.title,
    description: `${event.description}${choiceText}${combatResult.report.resultText}`,
    appliedEffects,
    combat: combatResult.report,
    ...(itemRewards.length > 0 ? { itemRewards } : {}),
    ...(itemLosses.length > 0 ? { itemLosses } : {}),
    ...(techniqueRewards.length > 0 ? { techniqueRewards } : {}),
    result: combatResult.result
  };
  const stateAfterEvent: GameState = {
    ...gameState,
    pendingEvent: null,
    attributes: newAttributes,
    familyWealth: newFamilyWealth,
    combatStats: updateCombatStats(gameState.combatStats, combatResult.report, combatResult.isWin),
    lifespan: newLifespan,
    cultivationProgress: clampProgress(gameState.cultivationProgress + progressDelta, requiredProgress),
    inventory: removeInventoryRewards(addInventoryRewards(gameState.inventory, itemRewards), itemLosses),
    techniques: addLearnedTechniques(gameState.techniques, techniqueRewards),
    events: [...gameState.events, newEvent]
  };

  return unlockAchievements(applyLifeGoalProgress(stateAfterEvent, newEvent));
}

function calculateCombatResult(
  gameState: GameState,
  event: GameEvent,
  choice?: EventChoice
): {
  result: GameEvent['result'];
  rawResult: GameEvent['result'];
  isWin: boolean;
  report: CombatReport;
} {
  const encounter = getCombatEncounter(event);
  const playerPower = calculatePlayerCombatPower(gameState, encounter);
  const enemyPower = calculateEnemyCombatPower(gameState, encounter);
  const winRate = clampRate(
    0.5 + ((playerPower - enemyPower) / Math.max(1, enemyPower * 2.2)) + (choice?.successModifier ?? 0)
  );
  const roll = Math.random();
  const greatFailureFactor = getCombatGreatFailureFactor(gameState);
  const rawResult = roll <= winRate
    ? roll <= winRate * 0.07 ? 'great-success' : 'success'
    : greatFailureFactor > 0 && roll >= 1 - ((1 - winRate) * greatFailureFactor) ? 'great-failure' : 'failure';
  const result = rawResult === 'great-success' || rawResult === 'great-failure' ? rawResult : 'neutral';
  const isWin = rawResult === 'success' || rawResult === 'great-success';
  const outcomeScale = rawResult === 'great-success'
    ? 1.55
    : rawResult === 'success'
      ? 1
      : rawResult === 'great-failure'
        ? 1.45
        : 1;
  const injuryChange = calculateCombatInjuryChange(gameState, encounter, rawResult, outcomeScale);
  const cultivationPercent = isWin
    ? Math.round(encounter.cultivationPercent * (rawResult === 'great-success' ? 1.45 : 1))
    : -Math.max(3, Math.ceil(encounter.cultivationPercent * (rawResult === 'great-failure' ? 0.65 : 0.35)));
  const injuryAfter = Math.max(0, Math.min(100, gameState.combatStats.injury + injuryChange));
  const report: CombatReport = {
    enemyName: encounter.enemyName,
    enemyRank: encounter.enemyRank,
    playerPower: Math.round(playerPower),
    enemyPower: Math.round(enemyPower),
    winRate: Math.round(winRate * 100),
    injuryChange,
    injuryAfter,
    cultivationPercent,
    resultText: getCombatResultText(rawResult, encounter.enemyName),
    styleText: `${getCombatPathStyle(gameState)} · ${encounter.styleText}`
  };

  return { result, rawResult, isWin, report };
}

function getCombatGreatFailureFactor(gameState: GameState): number {
  if (gameState.currentRealm.level >= 7) return 0;
  if (gameState.currentRealm.level >= 4) return 0.018;
  return 0.04;
}

function getCombatEncounter(event: GameEvent): CombatEncounter {
  const encounters: Record<string, CombatEncounter> = {
    'combat-beast-hunt': {
      enemyName: '山魈妖兽',
      enemyRank: '同阶下位',
      difficulty: 0.88,
      cultivationPercent: 7,
      injury: 5,
      primary: ['根骨', '神识'],
      styleText: '林中缠斗'
    },
    'combat-caravan-escort': {
      enemyName: '劫道散修',
      enemyRank: '同阶',
      difficulty: 0.95,
      cultivationPercent: 7,
      injury: 6,
      primary: ['根骨', '气运'],
      styleText: '护阵反击'
    },
    'combat-arena-duel': {
      enemyName: '同门劲敌',
      enemyRank: '同阶',
      difficulty: 1,
      cultivationPercent: 8,
      injury: 4,
      primary: ['根骨', '神识', '悟性'],
      styleText: '擂台斗法'
    },
    'combat-demonic-cultivator': {
      enemyName: '血法邪修',
      enemyRank: '同阶上位',
      difficulty: 1.12,
      cultivationPercent: 9,
      injury: 8,
      primary: ['根骨', '神识', '气运'],
      styleText: '破阵斩邪'
    },
    'combat-sword-contest': {
      enemyName: '试剑修士',
      enemyRank: '同阶上位',
      difficulty: 1.08,
      cultivationPercent: 10,
      injury: 7,
      primary: ['根骨', '神识'],
      styleText: '剑意对撞'
    },
    'combat-ancient-beast': {
      enemyName: '古兽遗种',
      enemyRank: '越阶强敌',
      difficulty: 1.32,
      cultivationPercent: 12,
      injury: 12,
      primary: ['根骨', '神识', '气运'],
      styleText: '险死搏杀'
    },
    'combat-ambush': {
      enemyName: '伏杀散修',
      enemyRank: '同阶上位',
      difficulty: 1.08,
      cultivationPercent: 8,
      injury: 9,
      primary: ['神识', '气运'],
      styleText: '仓促突围'
    },
    'combat-heart-devil': {
      enemyName: '识海心魔',
      enemyRank: '心劫',
      difficulty: 1.18,
      cultivationPercent: 9,
      injury: 10,
      primary: ['神识', '悟性', '气运'],
      styleText: '心神交锋'
    },
    'combat-bandit-camp': {
      enemyName: '山寨匪首',
      enemyRank: '同阶下位',
      difficulty: 0.9,
      cultivationPercent: 6,
      injury: 5,
      primary: ['根骨', '气运'],
      styleText: '夜袭破寨'
    },
    'combat-mine-fiend': {
      enemyName: '矿洞妖影',
      enemyRank: '同阶',
      difficulty: 1,
      cultivationPercent: 8,
      injury: 7,
      primary: ['根骨', '神识'],
      styleText: '狭洞缠斗'
    },
    'combat-ghost-market-raid': {
      enemyName: '夺宝遁修',
      enemyRank: '同阶上位',
      difficulty: 1.1,
      cultivationPercent: 9,
      injury: 8,
      primary: ['神识', '气运', '悟性'],
      styleText: '长街追袭'
    },
    'combat-tribulation-beast': {
      enemyName: '劫纹异兽',
      enemyRank: '越阶强敌',
      difficulty: 1.28,
      cultivationPercent: 12,
      injury: 12,
      primary: ['根骨', '神识', '气运'],
      styleText: '雷痕鏖战'
    },
    'mid-combat-infant-fire-demon': {
      enemyName: '地火妖王',
      enemyRank: '同阶上位',
      difficulty: 1.1,
      cultivationPercent: 11,
      injury: 8,
      primary: ['根骨', '神识'],
      styleText: '婴火熔甲'
    },
    'mid-combat-break-demon-array': {
      enemyName: '阵中魔念',
      enemyRank: '诡阵心劫',
      difficulty: 1.05,
      cultivationPercent: 9,
      injury: 6,
      primary: ['神识', '悟性'],
      styleText: '拆阵伏魔'
    },
    'mid-combat-night-demon-king': {
      enemyName: '夜行妖王',
      enemyRank: '同阶上位',
      difficulty: 1.14,
      cultivationPercent: 12,
      injury: 9,
      primary: ['根骨', '气运'],
      styleText: '长街速斩'
    },
    'mid-combat-spirit-boat-raid': {
      enemyName: '劫舟散修',
      enemyRank: '同阶',
      difficulty: 0.98,
      cultivationPercent: 9,
      injury: 6,
      primary: ['气运', '根骨'],
      styleText: '云海护舟'
    },
    'mid-combat-secret-realm-guardian': {
      enemyName: '秘境守灵',
      enemyRank: '同阶上位',
      difficulty: 1.08,
      cultivationPercent: 11,
      injury: 7,
      primary: ['神识', '气运'],
      styleText: '禁制护法'
    },
    'mid-combat-canyon-rival': {
      enemyName: '峡谷旧敌',
      enemyRank: '同阶',
      difficulty: 1.02,
      cultivationPercent: 10,
      injury: 7,
      primary: ['根骨', '悟性'],
      styleText: '借势斗修'
    },
    'mid-combat-capture-banner': {
      enemyName: '演武魁首',
      enemyRank: '同阶',
      difficulty: 0.92,
      cultivationPercent: 8,
      injury: 4,
      primary: ['神识', '悟性', '气运'],
      styleText: '夺旗演武'
    },
    'mid-combat-thunder-marsh-breakout': {
      enemyName: '雷泽泥蛟',
      enemyRank: '越阶险境',
      difficulty: 1.22,
      cultivationPercent: 13,
      injury: 11,
      primary: ['根骨', '气运'],
      styleText: '雷泽突围'
    },
    'mid-combat-demon-cave-purge': {
      enemyName: '炼魂邪修',
      enemyRank: '同阶上位',
      difficulty: 1.16,
      cultivationPercent: 12,
      injury: 10,
      primary: ['神识', '根骨'],
      styleText: '断祭清窟'
    },
    'mid-combat-ruined-city-watch': {
      enemyName: '荒城阴兵',
      enemyRank: '群敌围困',
      difficulty: 1.04,
      cultivationPercent: 10,
      injury: 7,
      primary: ['神识', '气运', '悟性'],
      styleText: '守井破阴'
    }
  };

  return encounters[event.id] ?? {
    enemyName: event.title,
    enemyRank: '同阶',
    difficulty: 1,
    cultivationPercent: 8,
    injury: 6,
    primary: ['根骨', '神识'],
    styleText: '正面交锋'
  };
}

function calculatePlayerCombatPower(gameState: GameState, encounter: CombatEncounter): number {
  const { attributes } = gameState;
  const primaryBonus = encounter.primary.reduce((sum, key) => sum + attributes[key] * 0.35, 0);
  const basePower = attributes.根骨 * 1.05
    + attributes.神识 * 0.9
    + attributes.悟性 * 0.35
    + attributes.气运 * 0.45
    + gameState.familyWealth * 0.12
    + primaryBonus
    + gameState.currentRealm.level * 42;
  const injuryPenalty = Math.max(0.62, 1 - gameState.combatStats.injury / 140);
  const spiritRootBonus = getSpiritRootCombatBonus(gameState.spiritRoot?.id);
  const pathMultiplier = getCombatPathPowerMultiplier(gameState, encounter);
  const techniqueMultiplier = getTechniqueCombatMultiplier(gameState);

  return basePower * injuryPenalty * spiritRootBonus * pathMultiplier * techniqueMultiplier;
}

function calculateEnemyCombatPower(gameState: GameState, encounter: CombatEncounter): number {
  const level = Math.max(1, gameState.currentRealm.level);
  return (62 + level * 86 + level * level * 10) * encounter.difficulty;
}

function getSpiritRootCombatBonus(spiritRootId: string | undefined): number {
  switch (spiritRootId) {
    case 'sword-root':
      return 1.1;
    case 'thunder-root':
      return 1.08;
    case 'fire-root':
    case 'dual-wood-fire-root':
    case 'dual-fire-earth-root':
      return 1.05;
    case 'tiandao-root':
      return 1.08;
    case 'chaos-root':
      return 1.12;
    default:
      return 1;
  }
}

function getCombatPathPowerMultiplier(gameState: GameState, encounter: CombatEncounter): number {
  switch (gameState.cultivationPath) {
    case 'sword':
      return encounter.primary.includes('根骨') ? 1.16 : 1.1;
    case 'body':
      return 1.12;
    case 'spell':
      return encounter.primary.includes('神识') || encounter.primary.includes('悟性') ? 1.14 : 1.06;
    case 'demonic':
      return 1.08;
    default:
      return 1;
  }
}

function getTechniqueCombatMultiplier(gameState: GameState): number {
  const bonus = gameState.techniques.reduce((sum, learnedTechnique) => {
    const technique = getTechnique(learnedTechnique.techniqueId);
    if (!technique) return sum;

    return sum + learnedTechnique.level * technique.combatPowerPerLevel;
  }, 0);

  return Math.min(1.85, 1 + bonus);
}

function getCombatPathStyle(gameState: GameState): string {
  switch (gameState.cultivationPath) {
    case 'sword':
      return '剑意抢攻';
    case 'body':
      return '肉身硬撼';
    case 'spell':
      return '术法控场';
    case 'demonic':
      return '夺势掠杀';
    default:
      return '临阵应敌';
  }
}

function calculateCombatInjuryChange(
  gameState: GameState,
  encounter: CombatEncounter,
  result: GameEvent['result'],
  outcomeScale: number
): number {
  const pathMitigation = gameState.cultivationPath === 'body'
    ? 0.68
    : gameState.cultivationPath === 'spell'
      ? 0.9
      : gameState.cultivationPath === 'demonic'
        ? 1.12
        : 1;
  const baseInjury = result === 'great-success'
    ? Math.max(1, Math.round(encounter.injury * 0.25))
    : result === 'success'
      ? Math.max(1, Math.round(encounter.injury * 0.55))
      : Math.round(encounter.injury * outcomeScale);

  return Math.max(1, Math.round(baseInjury * pathMitigation));
}

function scaleCombatBaseEffects(
  effects: GameEvent['effects'],
  result: GameEvent['result']
): GameEvent['effects'] {
  const positiveScale = result === 'great-success'
    ? 1.75
    : result === 'success'
      ? 1
      : result === 'great-failure'
        ? 0.35
        : 1;
  const negativeScale = result === 'great-success'
    ? 0.35
    : result === 'success'
      ? 1
      : result === 'great-failure'
        ? 1.75
        : 1;
  const scaledEffects: GameEvent['effects'] = {};

  Object.entries(effects).forEach(([key, value]) => {
    if (typeof value !== 'number') {
      (scaledEffects as Record<string, typeof value>)[key] = value;
      return;
    }

    const scale = value >= 0 ? positiveScale : negativeScale;
    const scaledValue = value >= 0 ? Math.floor(value * scale) : Math.ceil(value * scale);

    if (scaledValue !== 0) {
      (scaledEffects as Record<string, number>)[key] = scaledValue;
    }
  });

  return scaledEffects;
}

function getCombatRewardEffects(
  report: CombatReport,
  result: GameEvent['result'],
  isWin: boolean
): GameEvent['effects'] {
  const injuryLifespanLoss = Math.max(0, Math.ceil(report.injuryChange / 4));
  const focusGain = result === 'great-success' ? 3 : isWin ? 1 : 0;

  return {
    修为: report.cultivationPercent,
    ...(!isWin && injuryLifespanLoss > 0 ? { 寿命: -injuryLifespanLoss } : {}),
    ...(focusGain > 0 ? { 根骨: focusGain, 神识: Math.max(1, focusGain - 1) } : {})
  };
}

function updateCombatStats(
  combatStats: CombatStats,
  report: CombatReport,
  isWin: boolean
): CombatStats {
  const currentStreak = isWin ? combatStats.currentStreak + 1 : 0;

  return {
    victories: combatStats.victories + (isWin ? 1 : 0),
    defeats: combatStats.defeats + (isWin ? 0 : 1),
    injury: report.injuryAfter,
    currentStreak,
    bestStreak: Math.max(combatStats.bestStreak, currentStreak)
  };
}

function recoverCombatInjury(combatStats: CombatStats, realmLevel: number): CombatStats {
  if (combatStats.injury <= 0) return combatStats;

  const recovery = Math.max(2, Math.min(8, 2 + Math.floor(realmLevel / 2)));
  return {
    ...combatStats,
    injury: Math.max(0, combatStats.injury - recovery)
  };
}

function getCombatResultText(result: GameEvent['result'], enemyName: string): string {
  switch (result) {
    case 'great-success':
      return `你几乎没有给${enemyName}喘息之机，破绽一现便定下胜局。`;
    case 'success':
      return `你与${enemyName}鏖战一场，最终稳住阵脚，赢下这次交锋。`;
    case 'great-failure':
      return `${enemyName}凶势太盛，你判断失误，受创后才勉强脱身。`;
    case 'failure':
      return `这一战未能取胜，你付出代价后退走，伤势也压在经脉里。`;
    default:
      return '这场交锋平平收束。';
  }
}

interface ChoiceDifferential {
  label: string;
  outcome: string;
  successModifier: number;
  positiveScale: number;
  negativeScale: number;
  effectPositiveScale: number;
  effectNegativeScale: number;
}

const choiceDifferentials: ChoiceDifferential[] = [
  {
    label: '顺势',
    outcome: '此举推进得格外顺手，额外收益更明显。',
    successModifier: 0.05,
    positiveScale: 1.18,
    negativeScale: 0.82,
    effectPositiveScale: 1.25,
    effectNegativeScale: 0.75
  },
  {
    label: '平稳',
    outcome: '事情大致按预想推进，没有额外波澜。',
    successModifier: 0,
    positiveScale: 1,
    negativeScale: 1,
    effectPositiveScale: 1,
    effectNegativeScale: 1
  },
  {
    label: '生变',
    outcome: '中途横生枝节，收益被削弱，代价也更重。',
    successModifier: -0.05,
    positiveScale: 0.82,
    negativeScale: 1.18,
    effectPositiveScale: 0.75,
    effectNegativeScale: 1.25
  }
];

function rollChoiceDifferential(): ChoiceDifferential {
  return choiceDifferentials[Math.floor(Math.random() * choiceDifferentials.length)];
}

function applyChoiceDifferential(choice: EventChoice, differential: ChoiceDifferential): EventChoice {
  return {
    ...choice,
    successModifier: (choice.successModifier ?? 0) + differential.successModifier,
    positiveScale: (choice.positiveScale ?? 1) * differential.positiveScale,
    negativeScale: (choice.negativeScale ?? 1) * differential.negativeScale,
    effects: choice.effects
      ? scaleChoiceDifferentialEffects(choice.effects, differential)
      : undefined
  };
}

function scaleChoiceDifferentialEffects(
  effects: GameEvent['effects'],
  differential: ChoiceDifferential
): GameEvent['effects'] {
  const scaledEffects: GameEvent['effects'] = {};

  Object.entries(effects).forEach(([key, value]) => {
    if (typeof value !== 'number') {
      (scaledEffects as Record<string, typeof value>)[key] = value;
      return;
    }

    const scale = value >= 0 ? differential.effectPositiveScale : differential.effectNegativeScale;
    const scaledValue = scaleNumericValue(value, scale);
    if (scaledValue !== 0) {
      (scaledEffects as Record<string, number>)[key] = scaledValue;
    }
  });

  return scaledEffects;
}

function formatChoiceTitle(choice: EventChoice, differential?: ChoiceDifferential): string {
  return differential ? `${choice.label}·${differential.label}` : choice.label;
}

function formatChoiceOutcome(choice: EventChoice, differential?: ChoiceDifferential): string {
  return `你选择${choice.label}，${choice.outcome}${differential?.outcome ?? ''}`;
}

type EventOutcomePhase = 'early' | 'mid' | 'late';

function getEventOutcomePhase(gameState: GameState): EventOutcomePhase {
  if (gameState.currentRealm.level >= 7) return 'late';
  if (gameState.currentRealm.level >= 4) return 'mid';
  return 'early';
}

function calculateEventOutcome(
  successRate: number,
  isNeutralEvent: boolean,
  phase: EventOutcomePhase
): GameEvent['result'] {
  if (isNeutralEvent) return 'neutral';

  const greatSuccessChance = Math.max(0.02, Math.min(0.06, 0.02 + successRate * 0.04));
  const greatFailureChance = phase === 'late'
    ? 0
    : phase === 'mid'
      ? Math.max(0.003, Math.min(0.012, 0.003 + (1 - successRate) * 0.009))
      : Math.max(0.01, Math.min(0.035, 0.01 + (1 - successRate) * 0.025));
  const roll = Math.random();

  if (roll < greatFailureChance) return 'great-failure';
  if (roll < greatFailureChance + greatSuccessChance) return 'great-success';
  return 'neutral';
}

function getEventChoices(event: GameEvent): EventChoice[] {
  const specificChoices = getSpecificEventChoices(event.id);
  return specificChoices ?? [];
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

function addLearnedTechniques(
  currentTechniques: LearnedTechnique[],
  techniqueIds: string[]
): LearnedTechnique[] {
  if (techniqueIds.length === 0) return currentTechniques;

  const knownTechniqueIds = new Set(currentTechniques.map(technique => technique.techniqueId));
  const newTechniques = techniqueIds
    .filter(techniqueId => getTechnique(techniqueId) && !knownTechniqueIds.has(techniqueId))
    .map(techniqueId => ({ techniqueId, level: 0 }));

  return [...currentTechniques, ...newTechniques];
}

function getTechniqueTrainingCost(gameState: GameState, technique: TechniqueDefinition): {
  progressCost: number;
  timeCost: number;
} {
  const progressBase = getTechniqueProgressBase(gameState);
  return {
    progressCost: Math.max(1, Math.floor(progressBase * technique.trainCost.修为 / 100)),
    timeCost: Math.max(1, technique.trainCost.时间)
  };
}

function getTechniqueProgressBase(gameState: GameState): number {
  const requiredProgress = getRequiredCultivationProgress(gameState);
  if (requiredProgress > 0) return requiredProgress;

  return Math.max(100, gameState.currentRealm.cultivationRequired);
}

function addInventoryRewards(
  inventory: InventoryEntry[],
  rewards: InventoryReward[]
): InventoryEntry[] {
  if (rewards.length === 0) return inventory;

  const inventoryMap = new Map(inventory.map(entry => [entry.itemId, entry.quantity]));
  rewards.forEach(reward => {
    if (reward.quantity <= 0 || !getItem(reward.itemId)) return;
    inventoryMap.set(reward.itemId, (inventoryMap.get(reward.itemId) ?? 0) + reward.quantity);
  });

  return Array.from(inventoryMap.entries())
    .map(([itemId, quantity]) => ({ itemId, quantity }))
    .filter(entry => entry.quantity > 0);
}

function removeInventoryItem(
  inventory: InventoryEntry[],
  itemId: string,
  quantity: number
): InventoryEntry[] {
  return inventory
    .map(entry => entry.itemId === itemId
      ? { ...entry, quantity: entry.quantity - quantity }
      : entry
    )
    .filter(entry => entry.quantity > 0);
}

function removeInventoryRewards(
  inventory: InventoryEntry[],
  losses: InventoryReward[]
): InventoryEntry[] {
  if (losses.length === 0) return inventory;

  return losses.reduce((currentInventory, loss) => {
    return removeInventoryItem(currentInventory, loss.itemId, loss.quantity);
  }, inventory);
}

function generateEventItemRewards(event: GameEvent, result: GameEvent['result']): InventoryReward[] {
  if (event.type === 'childhood' || result === 'great-failure' || result === 'failure') return [];

  const chance = result === 'great-success'
    ? 0.85
    : result === 'success'
      ? 0.65
      : 0.22;
  if (Math.random() > chance) return [];

  switch (event.type) {
    case 'encounter':
      return rollOneReward([
        ['old-manual-page', 0.38],
        ['fortune-talisman', 0.22],
        ['spirit-stone-pouch', 0.4]
      ]);
    case 'resource':
      return rollOneReward([
        ['spirit-herb', 0.45],
        ['qi-gathering-pill', 0.2],
        ['spirit-stone-pouch', 0.35]
      ], result === 'great-success' ? 2 : 1);
    case 'sect':
      return rollOneReward([
        ['qi-gathering-pill', 0.4],
        ['bone-tempering-pill', 0.22],
        ['spirit-stone-pouch', 0.38]
      ]);
    default:
      return [];
  }
}

function generateCombatItemRewards(
  event: GameEvent,
  result: GameEvent['result'],
  isWin: boolean
): InventoryReward[] {
  if (!isWin) return [];

  const rewardChance = result === 'great-success' ? 0.82 : 0.48;
  if (Math.random() > rewardChance) return [];

  const quantity = result === 'great-success' ? 2 : 1;
  switch (event.id) {
    case 'combat-beast-hunt':
      return rollOneReward([
        ['beast-core', 0.55],
        ['spirit-herb', 0.3],
        ['bone-tempering-pill', 0.15]
      ], quantity);
    case 'combat-demonic-cultivator':
    case 'combat-heart-devil':
    case 'combat-ghost-market-raid':
      return rollOneReward([
        ['blood-jade', 0.45],
        ['fortune-talisman', 0.25],
        ['soul-nourishing-pill', 0.3]
      ], quantity);
    case 'combat-ancient-beast':
    case 'combat-tribulation-beast':
      return rollOneReward([
        ['ancient-scale', 0.55],
        ['blood-jade', 0.25],
        ['bone-tempering-pill', 0.2]
      ], quantity);
    case 'combat-caravan-escort':
    case 'combat-bandit-camp':
    case 'mid-combat-spirit-boat-raid':
    case 'mid-combat-capture-banner':
      return rollOneReward([
        ['spirit-stone-pouch', 0.55],
        ['qi-gathering-pill', 0.3],
        ['spirit-herb', 0.15]
      ], quantity);
    case 'combat-mine-fiend':
      return rollOneReward([
        ['beast-core', 0.35],
        ['spirit-stone-pouch', 0.35],
        ['spirit-herb', 0.3]
      ], quantity);
    case 'combat-sword-contest':
    case 'combat-arena-duel':
    case 'mid-combat-break-demon-array':
    case 'mid-combat-canyon-rival':
      return rollOneReward([
        ['old-manual-page', 0.35],
        ['bone-tempering-pill', 0.28],
        ['spirit-stone-pouch', 0.37]
      ], quantity);
    case 'mid-combat-infant-fire-demon':
    case 'mid-combat-night-demon-king':
    case 'mid-combat-secret-realm-guardian':
    case 'mid-combat-thunder-marsh-breakout':
      return rollOneReward([
        ['beast-core', 0.36],
        ['ancient-scale', 0.24],
        ['bone-tempering-pill', 0.2],
        ['spirit-herb', 0.2]
      ], quantity);
    case 'mid-combat-demon-cave-purge':
    case 'mid-combat-ruined-city-watch':
      return rollOneReward([
        ['blood-jade', 0.36],
        ['soul-nourishing-pill', 0.28],
        ['fortune-talisman', 0.2],
        ['spirit-stone-pouch', 0.16]
      ], quantity);
    default:
      return rollOneReward([
        ['beast-core', 0.4],
        ['spirit-stone-pouch', 0.35],
        ['qi-gathering-pill', 0.25]
      ], quantity);
  }
}

function generateCombatItemLosses(
  gameState: GameState,
  result: GameEvent['result'],
  isWin: boolean
): InventoryReward[] {
  const isLoss = !isWin || result === 'great-failure';
  if (!isLoss || gameState.inventory.length === 0) return [];

  const availableItems = gameState.inventory.filter(entry => entry.quantity > 0);
  if (availableItems.length === 0) return [];

  const pickedItem = availableItems[Math.floor(Math.random() * availableItems.length)];
  return [{ itemId: pickedItem.itemId, quantity: 1 }];
}

function generateEventTechniqueRewards(
  gameState: GameState,
  event: GameEvent,
  result: GameEvent['result']
): string[] {
  if (!gameState.cultivationPath || event.type === 'childhood') return [];
  if (result === 'failure' || result === 'great-failure') return [];

  const candidates = getAvailableTechniqueRewards(
    gameState.cultivationPath,
    gameState.currentRealm.level,
    gameState.techniques.map(technique => technique.techniqueId)
  );
  if (candidates.length === 0) return [];

  const chance = getTechniqueRewardChance(event, result);
  if (Math.random() > chance) return [];

  return [pickTechniqueReward(candidates).id];
}

function getTechniqueRewardChance(event: GameEvent, result: GameEvent['result']): number {
  const resultChance = result === 'great-success'
    ? 0.24
    : result === 'success'
      ? 0.1
      : 0.018;

  switch (event.type) {
    case 'encounter':
    case 'mind':
      return resultChance + 0.05;
    case 'sect':
    case 'resource':
      return resultChance + 0.035;
    case 'combat':
      return resultChance + 0.03;
    case 'cultivation':
      return resultChance + 0.015;
    default:
      return resultChance;
  }
}

function pickTechniqueReward(candidates: TechniqueDefinition[]): TechniqueDefinition {
  const weightedCandidates = candidates.map(technique => ({
    technique,
    weight: 1 + technique.minRealmLevel * 0.12
  }));
  const totalWeight = weightedCandidates.reduce((sum, item) => sum + item.weight, 0);
  let roll = Math.random() * totalWeight;

  for (const item of weightedCandidates) {
    roll -= item.weight;
    if (roll <= 0) {
      return item.technique;
    }
  }

  return weightedCandidates[0].technique;
}

function rollOneReward(
  candidates: Array<[string, number]>,
  quantity = 1
): InventoryReward[] {
  const totalWeight = candidates.reduce((sum, [, weight]) => sum + weight, 0);
  let roll = Math.random() * totalWeight;

  for (const [itemId, weight] of candidates) {
    roll -= weight;
    if (roll <= 0) {
      return [{ itemId, quantity }];
    }
  }

  return [{ itemId: candidates[0][0], quantity }];
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
    result: 'neutral'
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
    if (key === '寿命' || key === '时间' || key === '境界' || key === '修为' || key === '家境' || typeof value !== 'number') return;
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

    if (key === '寿命' || key === '时间' || key === '修为' || key === '家境') {
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
      return scaleNumericValue(value, value > 0 ? 1.75 : 0.35);
    case 'great-failure':
      return scaleNumericValue(value, value > 0 ? 0.35 : 1.75);
    case 'success':
    case 'failure':
    case 'neutral':
    default:
      return value;
  }
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
  const realmIndex = realms.findIndex(realm => realm.name === gameState.currentRealm.name);
  const hasNextRealm = realmIndex >= 0 && realmIndex < realms.length - 1;

  return !isChildhood(gameState)
    && hasNextRealm
    && !gameState.pendingPathChoice
    && !gameState.pendingEvent
    && !gameState.pendingTribulation
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
