import type { GameEvent } from '@/types';

export const events: GameEvent[] = [
  {
    id: 'cultivation-breakthrough',
    age: 0,
    type: 'cultivation',
    title: '瓶颈松动',
    description: '灵气在经脉中流转顺畅，境界瓶颈似有松动',
    effects: { 修为: 18 },
    result: 'success'
  },
  {
    id: 'cultivation-failure',
    age: 0,
    type: 'cultivation',
    title: '修炼受阻',
    description: '修炼过程中遇到瓶颈，进境缓慢',
    effects: { 悟性: -1, 修为: -6 },
    result: 'failure'
  },
  {
    id: 'cultivation-enlightenment',
    age: 0,
    type: 'cultivation',
    title: '顿悟',
    description: '修炼中突然顿悟，修为大涨',
    effects: { 根骨: 1, 悟性: 1, 修为: 12 },
    result: 'success'
  },
  {
    id: 'encounter-secret-manual',
    age: 0,
    type: 'encounter',
    title: '得到秘笈',
    description: '在山洞中偶然发现一本古老功法秘籍',
    effects: { 悟性: 2, 气运: 1 },
    result: 'success'
  },
  {
    id: 'encounter-master',
    age: 0,
    type: 'encounter',
    title: '拜师学艺',
    description: '遇到一位高人，愿意收你为徒',
    effects: { 根骨: 2, 家境: 1 },
    result: 'success'
  },
  {
    id: 'encounter-treasure',
    age: 0,
    type: 'encounter',
    title: '发现遗迹',
    description: '探索古修士遗迹，获得珍贵宝物',
    effects: { 气运: 3, 家境: 2 },
    result: 'success'
  },
  {
    id: 'encounter-immortal',
    age: 0,
    type: 'encounter',
    title: '仙人指路',
    description: '偶遇仙人指点迷津，受益匪浅',
    effects: { 悟性: 3, 气运: 2 },
    result: 'success'
  },
  {
    id: 'social-rival',
    age: 0,
    type: 'social',
    title: '结下仇怨',
    description: '与人发生冲突，结下不解之仇',
    effects: { 气运: -2 },
    result: 'failure'
  },
  {
    id: 'social-partner',
    age: 0,
    type: 'social',
    title: '遇见知己',
    description: '修仙路上遇到志同道合之人',
    effects: { 气运: 2, 颜值: 1 },
    result: 'success'
  },
  {
    id: 'social-brother',
    age: 0,
    type: 'social',
    title: '结拜兄弟',
    description: '结识志同道合的兄弟，互相扶持',
    effects: { 气运: 1, 家境: 1 },
    result: 'success'
  },
  {
    id: 'disaster-accident',
    age: 0,
    type: 'disaster',
    title: '遭遇意外',
    description: '遭遇妖兽袭击，身受重伤',
    effects: { 寿命: -10, 根骨: -1 },
    result: 'failure'
  },
  {
    id: 'disaster-plague',
    age: 0,
    type: 'disaster',
    title: '我心不明',
    description: '修炼过度导致走火入魔',
    effects: { 寿命: -20, 悟性: -2 },
    result: 'failure'
  },
  {
    id: 'disaster-heaven-tribulation',
    age: 0,
    type: 'disaster',
    title: '天劫降临',
    description: '天劫突然降临，措手不及',
    effects: { 寿命: -30, 根骨: -2 },
    result: 'failure'
  },
  {
    id: 'daily-merchant',
    age: 0,
    type: 'daily',
    title: '坊市淘宝',
    description: '在修仙坊市淘到好东西',
    effects: { 家境: 1, 气运: 1 },
    result: 'success'
  },
  {
    id: 'daily-meditation',
    age: 0,
    type: 'daily',
    title: '闭关修炼',
    description: '安心闭关，修为稳步提升',
    effects: { 根骨: 1, 悟性: 1, 修为: 8 },
    result: 'success'
  },
  {
    id: 'daily-sect-mission',
    age: 0,
    type: 'daily',
    title: '宗门任务',
    description: '完成宗门任务，获得奖励',
    effects: { 家境: 2, 气运: 1 },
    result: 'success'
  },
  {
    id: 'daily-elixir',
    age: 0,
    type: 'daily',
    title: '炼制丹药',
    description: '成功炼制出高品质丹药',
    effects: { 悟性: 2, 家境: 1 },
    result: 'success'
  }
];
