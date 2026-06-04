import type { SpiritRoot } from '@/types';

export const spiritRoots: SpiritRoot[] = [
  {
    id: 'mixed-root',
    name: '杂灵根',
    description: '灵机驳杂，修炼缓慢，但根基宽厚，较少走偏。',
    rarity: '凡品',
    effect: { 根骨: 8, 悟性: 6, 气运: 4 },
    modifiers: {
      修为倍率: 0.85,
      灾劫抗性: 0.08,
      事件权重: { daily: 1.2, disaster: 0.9 }
    },
    probability: 0.24
  },
  {
    id: 'single-root',
    name: '单灵根',
    description: '灵气归一，修炼顺畅，是修仙路上的稳健资质。',
    rarity: '中品',
    effect: { 根骨: 18, 悟性: 12, 气运: 8 },
    modifiers: {
      修为倍率: 1.12,
      事件权重: { cultivation: 1.2 }
    },
    probability: 0.2
  },
  {
    id: 'wood-root',
    name: '木灵根',
    description: '亲近生机，寿元绵长，遇灾也更易留一线生路。',
    rarity: '中品',
    effect: { 根骨: 14, 悟性: 10, 气运: 12 },
    modifiers: {
      修为倍率: 1.04,
      寿命倍率: 1.12,
      灾劫抗性: 0.12,
      事件权重: { daily: 1.1, disaster: 0.85 }
    },
    probability: 0.16
  },
  {
    id: 'fire-root',
    name: '火灵根',
    description: '灵机炽烈，修炼迅猛，却也更易招来波折。',
    rarity: '上品',
    effect: { 根骨: 22, 悟性: 14, 气运: 8 },
    modifiers: {
      修为倍率: 1.25,
      灾劫抗性: -0.08,
      事件权重: { cultivation: 1.35, disaster: 1.2 }
    },
    probability: 0.14
  },
  {
    id: 'water-root',
    name: '水灵根',
    description: '灵息绵密，善避锋芒，奇遇与心境皆较圆融。',
    rarity: '上品',
    effect: { 根骨: 15, 悟性: 18, 气运: 16 },
    modifiers: {
      修为倍率: 1.08,
      灾劫抗性: 0.1,
      事件权重: { mind: 1.25, encounter: 1.1 }
    },
    probability: 0.14
  },
  {
    id: 'heaven-root',
    name: '天灵根',
    description: '天生近道，修炼一日千里，亦更容易引动天机。',
    rarity: '极品',
    effect: { 根骨: 32, 悟性: 26, 气运: 18 },
    modifiers: {
      修为倍率: 1.55,
      属性倍率: 1.08,
      灾劫抗性: -0.12,
      事件权重: { cultivation: 1.5, disaster: 1.25 }
    },
    probability: 0.06
  },
  {
    id: 'chaos-root',
    name: '混沌灵根',
    description: '传说中可纳万法的灵根，万象归一，几乎无路不通。',
    rarity: '神话',
    effect: { 根骨: 42, 悟性: 38, 气运: 30, 家境: 10 },
    modifiers: {
      修为倍率: 1.8,
      属性倍率: 1.15,
      寿命倍率: 1.1,
      灾劫抗性: 0.08,
      事件权重: { cultivation: 1.5, encounter: 1.35, mind: 1.25 }
    },
    probability: 0.01
  }
];
