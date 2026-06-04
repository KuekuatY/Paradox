export type EventType = 'cultivation' | 'encounter' | 'social' | 'disaster' | 'daily' | 'resource' | 'mind' | 'sect';

export type Rarity = '凡品' | '下品' | '中品' | '上品' | '极品' | '神话' | '传说';

export type AttributeEffect = Partial<Attributes>;

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
  lifespan: number;
  cultivationProgress: number;
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
