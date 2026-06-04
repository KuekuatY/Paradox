import type { Talent } from '@/types';

export const talents: Talent[] = [
  {
    id: 'ordinary',
    name: '平凡之资',
    description: '没有显赫出身，也无惊世异象，一切只能靠岁月打磨。',
    rarity: '凡品',
    effect: {},
    modifiers: { 事件权重: { daily: 1.15 } },
    probability: 0.16
  },
  {
    id: 'hard-worker',
    name: '勤能补拙',
    description: '资质不算惊艳，却极能吃苦，闭关修炼更有所得。',
    rarity: '下品',
    effect: { 根骨: 4 },
    modifiers: { 修为倍率: 1.08, 事件权重: { daily: 1.2, cultivation: 1.1 } },
    probability: 0.13
  },
  {
    id: 'scholar',
    name: '书香门第',
    description: '自幼读书明理，悟性和家境稍胜常人。',
    rarity: '中品',
    effect: { 悟性: 10, 家境: 8 },
    modifiers: { 事件权重: { mind: 1.2, sect: 1.1 } },
    probability: 0.11
  },
  {
    id: 'fortunate',
    name: '福缘深厚',
    description: '常有无心插柳之喜，奇遇与贵人更容易靠近。',
    rarity: '中品',
    effect: { 气运: 12 },
    modifiers: { 事件权重: { encounter: 1.45, disaster: 0.9 } },
    probability: 0.1
  },
  {
    id: 'beautiful',
    name: '仙姿玉骨',
    description: '仪容出众，待人接物更容易赢得善意。',
    rarity: '中品',
    effect: { 颜值: 16 },
    modifiers: { 事件权重: { social: 1.55, sect: 1.1 } },
    probability: 0.09
  },
  {
    id: 'rich-clan',
    name: '仙门嫡传',
    description: '出身修仙大族，资源不缺，代价是因果牵连更多。',
    rarity: '上品',
    effect: { 家境: 24, 气运: 8 },
    modifiers: { 属性倍率: 1.08, 事件权重: { resource: 1.6, social: 1.15, disaster: 1.08 } },
    probability: 0.08
  },
  {
    id: 'sword-body',
    name: '天生剑体',
    description: '身与剑意相合，修炼杀伐之道极快，劫数也更凌厉。',
    rarity: '极品',
    effect: { 根骨: 22, 悟性: 12 },
    modifiers: { 修为倍率: 1.18, 属性倍率: 1.1, 事件权重: { cultivation: 1.25, disaster: 1.12 } },
    probability: 0.05
  },
  {
    id: 'calm-heart',
    name: '道心澄明',
    description: '心境澄澈，不易为外物所扰，心境事件收益更高。',
    rarity: '上品',
    effect: { 悟性: 18, 气运: 8 },
    modifiers: { 灾劫抗性: 0.12, 事件权重: { mind: 1.6, disaster: 0.9 } },
    probability: 0.06
  },
  {
    id: 'reincarnated',
    name: '转世仙人',
    description: '旧日道果未尽，修炼更快，突破门槛也更容易越过。',
    rarity: '传说',
    effect: { 根骨: 28, 悟性: 28, 气运: 18 },
    modifiers: { 修为倍率: 1.35, 属性倍率: 1.12, 寿命倍率: 1.12, 灾劫抗性: 0.12 },
    probability: 0.018
  },
  {
    id: 'destined-one',
    name: '天命主角',
    description: '天道似乎格外偏爱你，机缘、贵人和绝境逢生都会更频繁。',
    rarity: '传说',
    effect: { 根骨: 24, 悟性: 24, 气运: 36, 颜值: 18, 家境: 18 },
    modifiers: {
      修为倍率: 1.2,
      属性倍率: 1.15,
      寿命倍率: 1.08,
      灾劫抗性: 0.18,
      事件权重: { encounter: 1.75, social: 1.35, resource: 1.25, disaster: 0.85 }
    },
    probability: 0.012
  }
];
