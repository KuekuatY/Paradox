export type EventType = 'childhood' | 'cultivation' | 'combat' | 'encounter' | 'social' | 'disaster' | 'daily' | 'resource' | 'mind' | 'sect';

export type Rarity = '凡品' | '下品' | '中品' | '上品' | '变异' | '极品' | '神话' | '传说';

export type ItemType = '丹药' | '灵材' | '法器' | '功法' | '杂物';

export type TechniqueGrade = '黄' | '玄' | '地' | '天' | '仙';

export type AttributeEffect = Partial<Attributes> & {
  家境?: number;
};

export type CultivationPathId = 'sword' | 'body' | 'spell' | 'demonic';

export interface CultivationPath {
  id: CultivationPathId;
  name: string;
  description: string;
  focus: string;
  effect: AttributeEffect;
  modifiers: GrowthModifiers;
  build: string[];
}

export type LifeGoalProgressKind = 'effectGain' | 'eventCount' | 'breakthrough';

export interface LifeGoalDefinition {
  id: string;
  name: string;
  description: string;
  progressKind: LifeGoalProgressKind;
  target: number;
  targetLabel: string;
  effectKeys?: Array<keyof Attributes | '家境' | '修为' | '寿命'>;
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
      神识?: number;
      悟性?: number;
      气运?: number;
    };
  };
}

export interface Attributes {
  根骨: number;
  神识: number;
  悟性: number;
  气运: number;
  颜值: number;
}

export interface GameState {
  status: 'idle' | 'creating' | 'playing' | 'ended';
  age: number;
  currentRealm: Realm;
  attributes: Attributes;
  familyWealth: number;
  combatStats: CombatStats;
  inventory: InventoryEntry[];
  techniques: LearnedTechnique[];
  spiritRoot: SpiritRoot | null;
  talent: Talent | null;
  cultivationPath: CultivationPathId | null;
  lifespan: number;
  cultivationProgress: number;
  pendingEvent: GameEvent | null;
  pendingPathChoice: boolean;
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
    attributes?: Partial<Attributes> & { 家境?: number };
    spiritRootIds?: string[];
    talentIds?: string[];
  };
  effects: {
    根骨?: number;
    神识?: number;
    悟性?: number;
    气运?: number;
    颜值?: number;
    家境?: number;
    寿命?: number;
    时间?: number;
    境界?: 'advance' | 'regress';
    修为?: number;
  };
  appliedEffects?: GameEvent['effects'];
  combat?: CombatReport;
  itemRewards?: InventoryReward[];
  itemLosses?: InventoryReward[];
  techniqueRewards?: string[];
  result: 'success' | 'failure' | 'neutral' | 'great-success' | 'great-failure';
  isEnding?: boolean;
  endingType?: 'died' | 'ascended';
}

export interface InventoryItem {
  id: string;
  name: string;
  type: ItemType;
  rarity: Rarity;
  description: string;
  usable: boolean;
  effects?: GameEvent['effects'];
}

export interface InventoryEntry {
  itemId: string;
  quantity: number;
}

export interface InventoryReward {
  itemId: string;
  quantity: number;
}

export interface TechniqueDefinition {
  id: string;
  pathId: CultivationPathId;
  name: string;
  grade: TechniqueGrade;
  description: string;
  minRealmLevel: number;
  maxLevel: number;
  trainCost: {
    修为: number;
    时间: number;
  };
  effectsPerLevel: Partial<Attributes>;
  combatPowerPerLevel: number;
}

export interface LearnedTechnique {
  techniqueId: string;
  level: number;
}

export interface CombatStats {
  victories: number;
  defeats: number;
  injury: number;
  bestStreak: number;
  currentStreak: number;
}

export interface CombatReport {
  enemyName: string;
  enemyRank: string;
  playerPower: number;
  enemyPower: number;
  winRate: number;
  injuryChange: number;
  injuryAfter: number;
  cultivationPercent: number;
  resultText: string;
  styleText: string;
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
  familyWealth: number;
  achievements: string[];
}
