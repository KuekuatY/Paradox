import type { EventChoice } from '@/types';

const eventChoiceSets: Record<string, EventChoice[]> = {
  'disaster-resource-theft': [
    {
      id: 'track-thief',
      label: '追查到底',
      description: '耗费时间追索线索，若成则能挽回损失。',
      outcome: '你沿着残留气息一路追查，虽耽误修行，却没有让这笔账轻易过去。',
      successModifier: 0.08,
      positiveScale: 1.05,
      negativeScale: 1.2,
      effects: { 气运: 3, 修为: -2 }
    },
    {
      id: 'cut-loss',
      label: '此事作罢',
      description: '收拾残局，少受牵连，但损失难免。',
      outcome: '你止住怒气，先稳住洞府和心神，把损失压到能承受的范围内。',
      successModifier: 0.12,
      positiveScale: 0.75,
      negativeScale: 0.45,
      effects: { 神识: 1, 悟性: 2 }
    },
    {
      id: 'ask-sect',
      label: '求助宗门',
      description: '用人情换来执事介入，消耗家底但更稳。',
      outcome: '你请宗门执事出面查办，事情处理得更体面，也欠下一点人情。',
      successModifier: 0.16,
      positiveScale: 0.85,
      negativeScale: 0.65,
      effects: { 家境: -2, 颜值: 2 }
    }
  ],
  'sect-etiquette': [
    {
      id: 'accept-advice',
      label: '听从意见',
      description: '收束言行，名声更稳，但略耽误修行。',
      outcome: '你认真听取长辈教诲，举止更合宗门规矩。',
      successModifier: 0.08,
      positiveScale: 1.12,
      negativeScale: 0.9,
      effects: { 颜值: 2, 修为: -1 }
    },
    {
      id: 'stay-wild',
      label: '我行我素',
      description: '保留本真，少受拘束，却不讨长辈喜欢。',
      outcome: '你没有刻意迎合规矩，心中倒是更清楚自己想走什么路。',
      successModifier: -0.04,
      positiveScale: 0.55,
      negativeScale: 1.05,
      effects: { 悟性: 2, 气运: 1, 颜值: -1 }
    },
    {
      id: 'make-friends',
      label: '借机结交',
      description: '把课业当成人情场，收益更偏资源。',
      outcome: '你顺势与同门寒暄往来，课业之外也多了几分人脉。',
      successModifier: 0.04,
      positiveScale: 0.85,
      negativeScale: 0.9,
      effects: { 颜值: 2, 家境: 1, 修为: -2 }
    }
  ],
  'resource-auction': [
    {
      id: 'raise-bid',
      label: '高价竞拍',
      description: '压上更多灵石，丹药收益更高但家底吃紧。',
      outcome: '你几次加价压过旁人，终于把丹药收入囊中。',
      successModifier: 0.1,
      positiveScale: 1.18,
      negativeScale: 1.25,
      effects: { 家境: -3, 颜值: 1 }
    },
    {
      id: 'wait-price',
      label: '谨慎观望',
      description: '少冒风险，可能错失最好的丹药。',
      outcome: '你没有盲目抬价，只在合适时机出手。',
      successModifier: 0.04,
      positiveScale: 0.72,
      negativeScale: 0.55,
      effects: { 悟性: 2 }
    },
    {
      id: 'meet-seller',
      label: '结交卖家',
      description: '把买卖做成人情，短期收益普通，后续资源更稳。',
      outcome: '你没有只盯着丹药，而是与卖家攀谈，留下一条往来门路。',
      successModifier: 0.02,
      positiveScale: 0.85,
      negativeScale: 0.8,
      effects: { 家境: 1, 气运: 2, 修为: -1 }
    }
  ],
  'social-rival': [
    {
      id: 'back-down',
      label: '暂且退让',
      description: '少惹麻烦，但名声会吃些亏。',
      outcome: '你把怒气压下去，没有让争执继续扩大。',
      successModifier: 0.12,
      positiveScale: 0.65,
      negativeScale: 0.55,
      effects: { 颜值: -1, 神识: 1, 悟性: 2 }
    },
    {
      id: 'face-rival',
      label: '正面回应',
      description: '维护声名，风险和收益都更高。',
      outcome: '你当面回应对方挑衅，场面一时剑拔弩张。',
      successModifier: -0.02,
      positiveScale: 1.15,
      negativeScale: 1.25,
      effects: { 颜值: 2, 修为: -2 }
    },
    {
      id: 'mediate',
      label: '请人调停',
      description: '花些人情化解矛盾，较为稳妥。',
      outcome: '你请熟识同道从中说和，保住体面，也付出了一点代价。',
      successModifier: 0.1,
      positiveScale: 0.9,
      negativeScale: 0.7,
      effects: { 家境: -2, 气运: 1 }
    }
  ],
  'cultivation-overstrain': [
    {
      id: 'push-on',
      label: '继续闭关',
      description: '强行冲进度，寿元和根骨承压。',
      outcome: '你硬撑着继续运转周天，把疲惫都压进经脉深处。',
      successModifier: -0.04,
      positiveScale: 1.28,
      negativeScale: 1.25,
      effects: { 修为: 4, 根骨: -1 }
    },
    {
      id: 'rest',
      label: '暂缓休养',
      description: '修为慢一点，换来身体恢复。',
      outcome: '你停下闭关，转而调息养神，让气血慢慢回稳。',
      successModifier: 0.1,
      positiveScale: 0.55,
      negativeScale: 0.45,
      effects: { 寿命: 1, 神识: 1, 悟性: 1 }
    },
    {
      id: 'buy-medicine',
      label: '寻药调理',
      description: '消耗家底，兼顾进度和伤势。',
      outcome: '你买来温养经脉的药材，勉强把闭关损耗压了下去。',
      successModifier: 0.08,
      positiveScale: 0.9,
      negativeScale: 0.55,
      effects: { 家境: -3, 根骨: 2 }
    }
  ],
  'encounter-lost-child': [
    {
      id: 'escort-home',
      label: '送其下山',
      description: '耽误修行，换取善缘和名声。',
      outcome: '你亲自护送孩童下山，凡尘中的感激也成了微弱善缘。',
      successModifier: 0.08,
      positiveScale: 1.05,
      negativeScale: 0.85,
      effects: { 颜值: 2, 修为: -2 }
    },
    {
      id: 'teach-method',
      label: '传授吐纳',
      description: '多花心神，也可能结下一段师徒缘。',
      outcome: '你教了孩童几句粗浅吐纳法，不知将来会生出怎样的因果。',
      successModifier: 0,
      positiveScale: 0.9,
      negativeScale: 0.9,
      effects: { 气运: 3, 神识: 1, 悟性: 1, 修为: -3 }
    },
    {
      id: 'point-road',
      label: '指路离开',
      description: '不多插手，修行损失最小。',
      outcome: '你指明下山方向，没有让此事牵扯太深。',
      successModifier: 0.02,
      positiveScale: 0.6,
      negativeScale: 0.55,
      effects: { 修为: 1 }
    }
  ],
  'mind-vanity': [
    {
      id: 'self-reflect',
      label: '闭门自省',
      description: '压下浮名，心境恢复更稳。',
      outcome: '你闭门数日，把外界称赞一层层从心里剥开。',
      successModifier: 0.12,
      positiveScale: 0.7,
      negativeScale: 0.45,
      effects: { 神识: 1, 悟性: 2, 修为: -1 }
    },
    {
      id: 'ride-fame',
      label: '借势扬名',
      description: '把名声转成资源，但心境风险更大。',
      outcome: '你顺着名声结交同道，热闹之中也更难守住清净。',
      successModifier: -0.04,
      positiveScale: 1.15,
      negativeScale: 1.25,
      effects: { 颜值: 3, 家境: 1 }
    },
    {
      id: 'ignore-talk',
      label: '不予理会',
      description: '不主动处理，影响较平均。',
      outcome: '你照旧修行，不刻意迎合，也不刻意躲避。',
      successModifier: 0.02,
      positiveScale: 0.8,
      negativeScale: 0.8,
      effects: { 气运: 1 }
    }
  ]
};

export function getSpecificEventChoices(eventId: string): EventChoice[] | undefined {
  return eventChoiceSets[eventId];
}

export function hasSpecificEventChoices(eventId: string): boolean {
  return eventId in eventChoiceSets;
}
