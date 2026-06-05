import type { CultivationPath, CultivationPathId } from '@/types';

export const cultivationPaths: CultivationPath[] = [
  {
    id: 'sword',
    name: '剑修',
    description: '以剑意立身，杀伐凌厉，修为推进快，但劫数与冲突也更容易找上门。',
    focus: '修为 / 根骨',
    effect: { 根骨: 4, 神识: 2, 悟性: 2 },
    modifiers: {
      修为倍率: 1.08,
      灾劫抗性: -0.04,
      事件权重: { cultivation: 1.18, combat: 1.35, encounter: 1.15, disaster: 1.08 }
    },
    build: ['剑意', '杀伐', '速破境']
  },
  {
    id: 'body',
    name: '体修',
    description: '以肉身为炉，打磨筋骨与气血，修为略慢，但属性成长与抗劫更稳。',
    focus: '根骨 / 抗劫',
    effect: { 根骨: 8 },
    modifiers: {
      修为倍率: 0.92,
      属性倍率: 1.1,
      寿命倍率: 1.04,
      灾劫抗性: 0.12,
      事件权重: { combat: 1.18, daily: 1.15, disaster: 0.9 }
    },
    build: ['淬体', '厚血', '稳突破']
  },
  {
    id: 'spell',
    name: '法修',
    description: '以术法与经卷入道，悟性收益更高，心境与宗门事件更容易成为助力。',
    focus: '悟性 / 术法',
    effect: { 神识: 4, 悟性: 8 },
    modifiers: {
      修为倍率: 1.03,
      属性倍率: 1.04,
      事件权重: { mind: 1.35, sect: 1.18, cultivation: 1.08, combat: 0.92 }
    },
    build: ['悟法', '心境', '法术循环']
  },
  {
    id: 'demonic',
    name: '邪修',
    description: '不循常法，重机缘与掠夺，成长上限来得快，但名声、劫数与失衡风险更高。',
    focus: '气运 / 资源',
    effect: { 神识: 2, 气运: 5, 家境: 1, 颜值: -2 },
    modifiers: {
      修为倍率: 1.12,
      属性倍率: 1.02,
      灾劫抗性: -0.1,
      事件权重: { combat: 1.28, resource: 1.3, encounter: 1.18, social: 0.82, disaster: 1.18 }
    },
    build: ['夺机缘', '高风险', '快成型']
  }
];

export function getCultivationPath(id: CultivationPathId | null | undefined): CultivationPath | undefined {
  return cultivationPaths.find(path => path.id === id);
}
