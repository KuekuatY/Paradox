export type EventType = 'cultivation' | 'encounter' | 'social' | 'disaster' | 'daily' | 'resource' | 'mind' | 'sect';

export type Rarity = '凡品' | '下品' | '中品' | '上品' | '变异' | '极品' | '神话' | '传说';

export type AttributeEffect = Partial<Attributes>;

export type CultivationStrategyId = 'balanced' | 'body' | 'insight' | 'roaming' | 'business' | 'seclusion';

export interface CultivationStrategy {
  id: CultivationStrategyId;
  name: string;
  description: string;
  focus: string;
  modifiers: GrowthModifiers;
}

export type LifeGoalProgressKind = 'effectGain' | 'eventCount' | 'breakthrough';

export interface LifeGoalDefinition {
  id: string;
  name: string;
  description: string;
  progressKind: LifeGoalProgressKind;
  target: number;
  targetLabel: string;
  effectKeys?: Array<keyof Attributes | '修为' | '寿命'>;
  eventTypes?: EventType[];
  minRealmLevel?: number;
  maxRealmLevel?: number;
  reward: GameEvent['effects'];
  completionText: string;
}

export interface ActiveLifeGoal {
  id: string;
  progress: number;
}

export interface EventChoice {
  id: string;
  label: string;
  description: string;
  outcome: string;
  successModifier?: number;
  positiveScale?: number;
  negativeScale?: number;
  effects?: GameEvent['effects'];
}

export interface GrowthModifiers {
  修为倍率?: number;
  属性倍率?: number;
  寿命倍率?: number;
  灾劫抗性?: number;
  事件权重?: Partial<Record<EventType, number>>;
}

export interface Talent {
  id: string;
  name: string;
  description: string;
  rarity: Rarity;
  effect: AttributeEffect;
  modifiers?: GrowthModifiers;
  probability: number;
}

export interface SpiritRoot {
  id: string;
  name: string;
  description: string;
  rarity: Rarity;
  effect: AttributeEffect;
  modifiers: GrowthModifiers;
  probability: number;
}

export interface Realm {
  name: string;
  level: number;
  maxAge: number;
  attributeCap: number;
  cultivationRequired: number;
  description: string;
  requirements: {
    minAge: number;
    attributes: {
      根骨?: number;
      悟性?: number;
      气运?: number;
      家境?: number;
    };
  };
}

export interface Attributes {
  根骨: number;
  悟性: number;
  气运: number;
  颜值: number;
  家境: number;
}

export interface GameState {
  status: 'idle' | 'creating' | 'playing' | 'ended';
  age: number;
  currentRealm: Realm;
  attributes: Attributes;
  spiritRoot: SpiritRoot | null;
  talent: Talent | null;
  strategy: CultivationStrategyId;
  lifespan: number;
  cultivationProgress: number;
  pendingEvent: GameEvent | null;
  activeGoal: ActiveLifeGoal | null;
  completedGoals: string[];
  events: GameEvent[];
  achievements: string[];
  endReason?: 'lifespan' | 'meditation' | 'ascended';
}

export interface GameEvent {
  id: string;
  age: number;
  type: EventType;
  title: string;
  description: string;
  weight?: number;
  conditions?: {
    minRealmLevel?: number;
    maxRealmLevel?: number;
    minAge?: number;
    attributes?: Partial<Attributes>;
    spiritRootIds?: string[];
    talentIds?: string[];
  };
  effects: {
    根骨?: number;
    悟性?: number;
    气运?: number;
    颜值?: number;
    家境?: number;
    寿命?: number;
    境界?: 'advance' | 'regress';
    修为?: number;
  };
  appliedEffects?: GameEvent['effects'];
  result: 'success' | 'failure' | 'neutral';
  isEnding?: boolean;
  endingType?: 'died' | 'ascended';
}

export interface GameRecord {
  id: string;
  date: string;
  finalRealm: string;
  age: number;
  spiritRoot?: string;
  talent: string;
  result: 'died' | 'ascended';
  stats: Attributes;
  achievements: string[];
}
