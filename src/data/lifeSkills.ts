import type { GameEvent } from '@/types';

export type LifeSkillId = 'alchemy' | 'crafting' | 'talisman' | 'array' | 'fishing' | 'spirit-field';

export interface LifeSkillDefinition {
  id: LifeSkillId;
  name: string;
  description: string;
  focus: string;
  eventType: GameEvent['type'];
  minRealmLevel: number;
  timeCost: number;
  familyWealthCost: number;
  effects: GameEvent['effects'];
}

export const lifeSkills: LifeSkillDefinition[] = [
  {
    id: 'alchemy',
    name: '炼丹',
    description: '开炉炼药，把灵草丹方转成可直接服用的丹药。',
    focus: '修为、丹药、悟性',
    eventType: 'resource',
    minRealmLevel: 1,
    timeCost: 1,
    familyWealthCost: 3,
    effects: { 修为: 6, 悟性: 2 }
  },
  {
    id: 'crafting',
    name: '炼器',
    description: '熔炼金石与兽材，打造护身小器，也磨炼根骨手感。',
    focus: '根骨、法器、家境',
    eventType: 'resource',
    minRealmLevel: 1,
    timeCost: 1,
    familyWealthCost: 4,
    effects: { 根骨: 3, 家境: 1 }
  },
  {
    id: 'talisman',
    name: '画符',
    description: '以朱砂灵墨承载气机，符成可护身，也能调运。',
    focus: '气运、符箓、神识',
    eventType: 'mind',
    minRealmLevel: 1,
    timeCost: 1,
    familyWealthCost: 2,
    effects: { 气运: 4, 神识: 1 }
  },
  {
    id: 'array',
    name: '阵法',
    description: '推演阵纹与方位，强化洞府护持和突破准备。',
    focus: '神识、悟性、护阵',
    eventType: 'mind',
    minRealmLevel: 2,
    timeCost: 2,
    familyWealthCost: 5,
    effects: { 神识: 4, 悟性: 3, 家境: -1 }
  },
  {
    id: 'fishing',
    name: '钓鱼',
    description: '临水垂钓，等鱼也等机缘，偶尔能钓出奇物。',
    focus: '气运、寿元、灵材',
    eventType: 'daily',
    minRealmLevel: 1,
    timeCost: 1,
    familyWealthCost: 0,
    effects: { 气运: 3, 寿命: 1 }
  },
  {
    id: 'spirit-field',
    name: '灵田',
    description: '打理灵田药圃，用耐心换来稳定灵材和家底。',
    focus: '家境、灵材、根骨',
    eventType: 'resource',
    minRealmLevel: 1,
    timeCost: 1,
    familyWealthCost: 2,
    effects: { 家境: 3, 根骨: 1 }
  }
];

export function getLifeSkill(skillId: LifeSkillId): LifeSkillDefinition | undefined {
  return lifeSkills.find(skill => skill.id === skillId);
}
