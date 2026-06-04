import type { Talent } from '@/types';

export const talents: Talent[] = [
  {
    id: 'normal-1',
    name: '平凡之资',
    description: '普普通通的修仙资质，没有任何特殊之处',
    rarity: '凡品',
    effect: {},
    probability: 0.15
  },
  {
    id: 'low-1',
    name: '微弱灵根',
    description: '只有微弱的灵根，勉强可以感应灵气',
    rarity: '下品',
    effect: { 根骨: 1 },
    probability: 0.12
  },
  {
    id: 'medium-1',
    name: '普通灵根',
    description: '中规中矩的灵根资质，修炼速度一般',
    rarity: '中品',
    effect: { 根骨: 2, 悟性: 1 },
    probability: 0.08
  },
  {
    id: 'medium-2',
    name: '书香门第',
    description: '出身于读书人家，自幼聪慧',
    rarity: '中品',
    effect: { 悟性: 3, 家境: 2 },
    probability: 0.07
  },
  {
    id: 'high-1',
    name: '上佳灵根',
    description: '优秀的灵根资质，修炼速度较快',
    rarity: '上品',
    effect: { 根骨: 3, 悟性: 2 },
    probability: 0.05
  },
  {
    id: 'high-2',
    name: '天命之人',
    description: '天生受到天道眷顾，气运加身',
    rarity: '上品',
    effect: { 气运: 5 },
    probability: 0.05
  },
  {
    id: 'rare-1',
    name: '天生剑体',
    description: '天生与剑意相通，剑道天赋绝伦',
    rarity: '极品',
    effect: { 根骨: 4, 悟性: 3, 气运: 2 },
    probability: 0.03
  },
  {
    id: 'rare-2',
    name: '仙门嫡传',
    description: '出生于修仙大族的嫡系血脉',
    rarity: '极品',
    effect: { 家境: 5, 根骨: 2, 气运: 2 },
    probability: 0.04
  },
  {
    id: 'mythical-1',
    name: '混沌灵根',
    description: '传说中可容纳万物的混沌灵根',
    rarity: '神话',
    effect: { 根骨: 5, 悟性: 5, 气运: 5 },
    probability: 0.01
  },
  {
    id: 'mythical-2',
    name: '重瞳者',
    description: '天生重瞳，可看透世间一切虚妄',
    rarity: '神话',
    effect: { 悟性: 8, 气运: 3 },
    probability: 0.01
  },
  {
    id: 'legendary-1',
    name: '转世仙人',
    description: '上一世陨落的仙人转世重生',
    rarity: '传说',
    effect: { 根骨: 8, 悟性: 8, 气运: 8 },
    probability: 0.005
  },
  {
    id: 'legendary-2',
    name: '天命主角',
    description: '天道眷顾的主角模板，气运无双',
    rarity: '传说',
    effect: { 根骨: 10, 悟性: 10, 气运: 10, 颜值: 10, 家境: 10 },
    probability: 0.005
  }
];
