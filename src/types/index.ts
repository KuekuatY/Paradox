export interface Talent {
  id: string;
  name: string;
  description: string;
  rarity: '凡品' | '下品' | '中品' | '上品' | '极品' | '神话' | '传说';
  effect: {
    根骨?: number;
    悟性?: number;
    气运?: number;
    颜值?: number;
    家境?: number;
  };
  probability: number;
}

export interface Realm {
  name: string;
  level: number;
  maxAge: number;
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
  type: 'cultivation' | 'encounter' | 'social' | 'disaster' | 'daily';
  title: string;
  description: string;
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
  talent: string;
  result: 'died' | 'ascended';
  stats: Attributes;
  achievements: string[];
}
