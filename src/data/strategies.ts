import type { CultivationStrategy } from '@/types';

export const cultivationStrategies: CultivationStrategy[] = [
  {
    id: 'balanced',
    name: '顺其自然',
    description: '不偏不倚，修为、属性与风险都保持平稳。',
    focus: '均衡',
    modifiers: {}
  },
  {
    id: 'body',
    name: '淬体筑基',
    description: '重视肉身和根骨，修为进度略慢，但更容易扛过灾劫。',
    focus: '根骨',
    modifiers: {
      修为倍率: 0.92,
      属性倍率: 1.08,
      灾劫抗性: 0.08,
      事件权重: { cultivation: 1.18, disaster: 0.92 }
    }
  },
  {
    id: 'insight',
    name: '静心悟道',
    description: '把时间交给经卷和心境，悟性成长更快。',
    focus: '悟性',
    modifiers: {
      修为倍率: 0.96,
      属性倍率: 1.05,
      事件权重: { mind: 1.45, daily: 1.1 }
    }
  },
  {
    id: 'roaming',
    name: '出山游历',
    description: '行走山河，结缘见人，气运与颜值机会更多，风险也略高。',
    focus: '气运/颜值',
    modifiers: {
      修为倍率: 0.9,
      事件权重: { encounter: 1.35, social: 1.3, disaster: 1.08 }
    }
  },
  {
    id: 'business',
    name: '经营洞府',
    description: '经营资源和宗门关系，家境更容易起势，修为稍慢。',
    focus: '家境',
    modifiers: {
      修为倍率: 0.88,
      事件权重: { resource: 1.45, sect: 1.2, daily: 1.08 }
    }
  },
  {
    id: 'seclusion',
    name: '闭关冲境',
    description: '追求修为进度，属性成长较少，遇灾时也更难周旋。',
    focus: '修为',
    modifiers: {
      修为倍率: 1.18,
      灾劫抗性: -0.05,
      事件权重: { cultivation: 1.35, social: 0.75, disaster: 1.08 }
    }
  }
];

export function getCultivationStrategy(id: string): CultivationStrategy {
  return cultivationStrategies.find(strategy => strategy.id === id) ?? cultivationStrategies[0];
}
