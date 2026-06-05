import type { LifeGoalDefinition } from '@/types';

export const lifeGoals: LifeGoalDefinition[] = [
  {
    id: 'forge-foundation',
    name: '打磨根基',
    description: '以筋骨承载灵机，优先补足突破所需的根基。',
    progressKind: 'effectGain',
    target: 22,
    targetLabel: '根骨提升',
    effectKeys: ['根骨'],
    maxRealmLevel: 3,
    reward: { 根骨: 6, 修为: 5 },
    completionText: '肉身根基愈发稳固，日后冲关少了几分虚浮。'
  },
  {
    id: 'read-scriptures',
    name: '参悟道法',
    description: '把心思放在功法与经卷上，积累悟法根基。',
    progressKind: 'effectGain',
    target: 22,
    targetLabel: '悟性提升',
    effectKeys: ['悟性'],
    reward: { 悟性: 6, 修为: 5 },
    completionText: '经卷中的晦涩句子渐渐有了脉络。'
  },
  {
    id: 'gather-fortune',
    name: '积攒资源',
    description: '经营洞府、坊市与宗门关系，为后续突破储备资源。',
    progressKind: 'effectGain',
    target: 18,
    targetLabel: '家境提升',
    effectKeys: ['家境'],
    reward: { 家境: 8, 气运: 2 },
    completionText: '手中资源宽裕许多，许多难事也有了转圜余地。'
  },
  {
    id: 'seek-fortune',
    name: '寻觅机缘',
    description: '多见山河与人情，从偶然里积累气运。',
    progressKind: 'effectGain',
    target: 20,
    targetLabel: '气运提升',
    effectKeys: ['气运'],
    reward: { 气运: 7, 修为: 4 },
    completionText: '几段善缘在暗处汇拢，像是替你铺出一条窄路。'
  },
  {
    id: 'build-reputation',
    name: '经营名望',
    description: '在宗门与同道之间留下好名声，提升外界助力。',
    progressKind: 'effectGain',
    target: 18,
    targetLabel: '颜值提升',
    effectKeys: ['颜值'],
    reward: { 颜值: 7, 家境: 4 },
    completionText: '你的名声慢慢传开，来往时少了许多冷眼。'
  },
  {
    id: 'weather-hardship',
    name: '历劫砺身',
    description: '灾劫并非全是坏事，能撑过去便是磨砺。',
    progressKind: 'eventCount',
    target: 2,
    targetLabel: '经历灾劫',
    eventTypes: ['disaster'],
    minRealmLevel: 2,
    reward: { 根骨: 7, 气运: 4, 寿命: 1 },
    completionText: '苦厄退去后，肉身与心气都更沉得住。'
  },
  {
    id: 'sect-standing',
    name: '立足宗门',
    description: '承接宗门事务，换取更稳定的资源与人脉。',
    progressKind: 'eventCount',
    target: 3,
    targetLabel: '宗门事务',
    eventTypes: ['sect'],
    minRealmLevel: 2,
    reward: { 家境: 10, 颜值: 4 },
    completionText: '宗门中终于有了你的一席位置。'
  },
  {
    id: 'prepare-breakthrough',
    name: '冲关筹备',
    description: '围绕下一次突破调整修行，不让瓶颈卡住太久。',
    progressKind: 'effectGain',
    target: 36,
    targetLabel: '修为积累',
    effectKeys: ['修为'],
    minRealmLevel: 3,
    reward: { 根骨: 5, 悟性: 5, 气运: 4 },
    completionText: '瓶颈前的准备更扎实了，心中也少了几分慌乱。'
  },
  {
    id: 'cross-realm',
    name: '破境立身',
    description: '以一次真正的突破证明此世道途。',
    progressKind: 'breakthrough',
    target: 1,
    targetLabel: '完成突破',
    minRealmLevel: 2,
    reward: { 气运: 8, 修为: 6 },
    completionText: '破境后的余韵尚在，新的道途也随之展开。'
  }
];

export function getLifeGoalDefinition(id: string): LifeGoalDefinition | undefined {
  return lifeGoals.find(goal => goal.id === id);
}
