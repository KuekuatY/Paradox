import type { SpiritRoot } from '@/types';

export const spiritRoots: SpiritRoot[] = [
  {
    id: 'five-mixed-root',
    name: '五系杂灵根',
    description: '金木水火土五气俱全却彼此牵扯，修炼缓慢，但根基厚实，不易被小劫折断。',
    rarity: '下品',
    effect: { 根骨: 10, 悟性: 8, 气运: 5 },
    modifiers: {
      修为倍率: 0.82,
      灾劫抗性: 0.1,
      事件权重: { daily: 1.18, disaster: 0.9 }
    },
    probability: 0.16
  },
  {
    id: 'three-mixed-root',
    name: '三系杂灵根',
    description: '三系灵机同在一身，虽不纯粹，却比五系更容易梳理出修行脉络。',
    rarity: '凡品',
    effect: { 根骨: 12, 悟性: 9, 气运: 7 },
    modifiers: {
      修为倍率: 0.94,
      灾劫抗性: 0.04,
      事件权重: { daily: 1.1, cultivation: 1.05 }
    },
    probability: 0.12
  },
  {
    id: 'four-mixed-root',
    name: '四系杂灵根',
    description: '四系灵气驳杂难驯，胜在底盘宽，若肯耐心打磨，也能走得稳当。',
    rarity: '凡品',
    effect: { 根骨: 11, 悟性: 8, 气运: 8 },
    modifiers: {
      修为倍率: 0.9,
      灾劫抗性: 0.07,
      事件权重: { daily: 1.14, disaster: 0.94 }
    },
    probability: 0.13
  },
  {
    id: 'dual-water-wood-root',
    name: '木水灵根',
    description: '水生木，生机绵长，道心与肉身都能被灵息慢慢滋养。',
    rarity: '中品',
    effect: { 根骨: 15, 悟性: 15, 气运: 12 },
    modifiers: {
      修为倍率: 1.07,
      寿命倍率: 1.05,
      事件权重: { mind: 1.12, daily: 1.08 }
    },
    probability: 0.045
  },
  {
    id: 'dual-wood-fire-root',
    name: '木火灵根',
    description: '木助火势，灵机升腾迅捷，悟法时常有豁然贯通之感。',
    rarity: '中品',
    effect: { 根骨: 16, 悟性: 14, 气运: 9 },
    modifiers: {
      修为倍率: 1.1,
      属性倍率: 1.03,
      事件权重: { cultivation: 1.14, mind: 1.08 }
    },
    probability: 0.045
  },
  {
    id: 'dual-fire-earth-root',
    name: '火土灵根',
    description: '火生土，气血炽热而根基厚重，冲修为时更有后劲。',
    rarity: '中品',
    effect: { 根骨: 18, 悟性: 11, 气运: 8 },
    modifiers: {
      修为倍率: 1.12,
      灾劫抗性: -0.01,
      事件权重: { cultivation: 1.18 }
    },
    probability: 0.045
  },
  {
    id: 'dual-earth-metal-root',
    name: '土金灵根',
    description: '土生金，筋骨沉稳而锋芒内敛，资源经营也更容易见成效。',
    rarity: '中品',
    effect: { 根骨: 20, 悟性: 10, 家境: 4 },
    modifiers: {
      修为倍率: 1.08,
      灾劫抗性: 0.03,
      事件权重: { resource: 1.12, cultivation: 1.08 }
    },
    probability: 0.045
  },
  {
    id: 'dual-metal-water-root',
    name: '金水灵根',
    description: '金生水，锋锐之气化作清寒灵息，悟性与心境较为出色。',
    rarity: '中品',
    effect: { 根骨: 14, 悟性: 16, 气运: 10 },
    modifiers: {
      修为倍率: 1.08,
      事件权重: { mind: 1.16, cultivation: 1.08 }
    },
    probability: 0.045
  },
  {
    id: 'dual-wood-earth-root',
    name: '木土灵根',
    description: '木克土，生发与沉凝互相牵制，根骨尚可，悟法却常有滞涩。',
    rarity: '中品',
    effect: { 根骨: 18, 悟性: 8, 家境: 2 },
    modifiers: {
      修为倍率: 0.98,
      灾劫抗性: 0.05,
      事件权重: { daily: 1.08, resource: 1.06 }
    },
    probability: 0.045
  },
  {
    id: 'dual-earth-water-root',
    name: '土水灵根',
    description: '土克水，灵息流转不算顺畅，好在根基稳，遇事更能守住底线。',
    rarity: '中品',
    effect: { 根骨: 16, 悟性: 9, 气运: 8, 家境: 3 },
    modifiers: {
      修为倍率: 0.96,
      灾劫抗性: 0.06,
      事件权重: { daily: 1.1, disaster: 0.95 }
    },
    probability: 0.045
  },
  {
    id: 'dual-water-fire-root',
    name: '水火灵根',
    description: '水火相冲，修行起伏明显；若能调和，灵机爆发也极为惊人。',
    rarity: '中品',
    effect: { 根骨: 14, 悟性: 13, 气运: 7 },
    modifiers: {
      修为倍率: 1.02,
      事件权重: { cultivation: 1.16, disaster: 1.08 }
    },
    probability: 0.045
  },
  {
    id: 'dual-fire-metal-root',
    name: '火金灵根',
    description: '火克金，锋芒常被燥烈之气逼出，进境不慢，但小劫也更容易被引动。',
    rarity: '中品',
    effect: { 根骨: 17, 悟性: 9, 气运: 6 },
    modifiers: {
      修为倍率: 1.05,
      灾劫抗性: -0.02,
      事件权重: { cultivation: 1.18, disaster: 1.1 }
    },
    probability: 0.045
  },
  {
    id: 'dual-metal-wood-root',
    name: '金木灵根',
    description: '金克木，锐气与生机彼此消磨，胜在能从反复拉扯中磨出韧性。',
    rarity: '中品',
    effect: { 根骨: 15, 悟性: 11, 气运: 8 },
    modifiers: {
      修为倍率: 0.98,
      属性倍率: 1.03,
      事件权重: { cultivation: 1.1, mind: 1.08 }
    },
    probability: 0.045
  },
  {
    id: 'metal-root',
    name: '金灵根',
    description: '金行灵机锋锐凝练，适合淬炼筋骨与攻伐之道。',
    rarity: '上品',
    effect: { 根骨: 24, 悟性: 14, 气运: 11 },
    modifiers: {
      修为倍率: 1.16,
      灾劫抗性: 0.04,
      事件权重: { cultivation: 1.24, disaster: 0.96 }
    },
    probability: 0.035
  },
  {
    id: 'wood-root',
    name: '木灵根',
    description: '木行灵机亲近生发，寿元绵长，根基成长更平顺。',
    rarity: '上品',
    effect: { 根骨: 19, 悟性: 17, 气运: 14 },
    modifiers: {
      修为倍率: 1.1,
      寿命倍率: 1.1,
      灾劫抗性: 0.08,
      事件权重: { daily: 1.1, disaster: 0.9 }
    },
    probability: 0.035
  },
  {
    id: 'water-root',
    name: '水灵根',
    description: '水行灵息绵密圆融，善避锋芒，心境与机缘都较顺。',
    rarity: '上品',
    effect: { 根骨: 18, 悟性: 20, 气运: 18 },
    modifiers: {
      修为倍率: 1.1,
      灾劫抗性: 0.1,
      事件权重: { mind: 1.25, encounter: 1.12 }
    },
    probability: 0.035
  },
  {
    id: 'fire-root',
    name: '火灵根',
    description: '火行灵机炽烈迅猛，修炼进境快，但躁烈之气需要压制。',
    rarity: '上品',
    effect: { 根骨: 26, 悟性: 15, 气运: 11 },
    modifiers: {
      修为倍率: 1.24,
      灾劫抗性: -0.02,
      事件权重: { cultivation: 1.35, disaster: 1.06 }
    },
    probability: 0.035
  },
  {
    id: 'earth-root',
    name: '土灵根',
    description: '土行灵机厚重载物，肉身与资源根底都更稳。',
    rarity: '上品',
    effect: { 根骨: 28, 悟性: 12, 气运: 12, 家境: 5 },
    modifiers: {
      修为倍率: 1.08,
      灾劫抗性: 0.12,
      事件权重: { resource: 1.18, disaster: 0.9 }
    },
    probability: 0.035
  },
  {
    id: 'sword-root',
    name: '剑灵根',
    description: '灵机化剑，锋芒直指瓶颈，攻伐修行极快，也更容易招来争斗与劫数。',
    rarity: '变异',
    effect: { 根骨: 30, 悟性: 18, 气运: 10 },
    modifiers: {
      修为倍率: 1.28,
      属性倍率: 1.08,
      灾劫抗性: -0.04,
      事件权重: { cultivation: 1.32, social: 1.1, disaster: 1.12 }
    },
    probability: 0.018
  },
  {
    id: 'thunder-root',
    name: '雷灵根',
    description: '雷霆入命，破障极猛，逢劫时也更容易与天威相撞。',
    rarity: '变异',
    effect: { 根骨: 28, 悟性: 20, 气运: 16 },
    modifiers: {
      修为倍率: 1.32,
      灾劫抗性: -0.06,
      事件权重: { cultivation: 1.35, disaster: 1.18 }
    },
    probability: 0.018
  },
  {
    id: 'wind-root',
    name: '风灵根',
    description: '风行无定，身心皆轻，游历、奇遇与人情场更容易打开局面。',
    rarity: '变异',
    effect: { 根骨: 20, 悟性: 22, 气运: 22 },
    modifiers: {
      修为倍率: 1.18,
      事件权重: { encounter: 1.35, social: 1.2, cultivation: 1.08 }
    },
    probability: 0.018
  },
  {
    id: 'ice-root',
    name: '冰灵根',
    description: '冰寒灵息澄净心神，悟法沉静，遇险时也更能保全自身。',
    rarity: '变异',
    effect: { 根骨: 22, 悟性: 24, 气运: 14 },
    modifiers: {
      修为倍率: 1.16,
      灾劫抗性: 0.08,
      事件权重: { mind: 1.28, disaster: 0.9 }
    },
    probability: 0.018
  },
  {
    id: 'tiandao-root',
    name: '天道灵根',
    description: '天道垂青，灵机近乎自成法度，修行一日千里，也更容易触动天机。',
    rarity: '极品',
    effect: { 根骨: 30, 悟性: 28, 气运: 20 },
    modifiers: {
      修为倍率: 1.55,
      属性倍率: 1.1,
      灾劫抗性: -0.08,
      事件权重: { cultivation: 1.5, encounter: 1.18, disaster: 1.18 }
    },
    probability: 0.025
  },
  {
    id: 'chaos-root',
    name: '混沌灵根',
    description: '传说中可纳万法的灵根，万象归一，几乎无路不通。',
    rarity: '神话',
    effect: { 根骨: 34, 悟性: 30, 气运: 24, 家境: 8 },
    modifiers: {
      修为倍率: 1.8,
      属性倍率: 1.15,
      寿命倍率: 1.1,
      灾劫抗性: 0.08,
      事件权重: { cultivation: 1.5, encounter: 1.35, mind: 1.25 }
    },
    probability: 0.008
  }
];
