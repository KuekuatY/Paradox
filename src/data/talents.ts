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
    id: 'slow-mind',
    name: '拙心凡骨',
    description: '开悟比旁人慢些，但心性踏实，不容易被小劫吓退。',
    rarity: '凡品',
    effect: { 根骨: 3, 悟性: -2 },
    modifiers: { 灾劫抗性: 0.06, 事件权重: { daily: 1.18, mind: 0.9 } },
    probability: 0.12
  },
  {
    id: 'mountain-child',
    name: '山野出身',
    description: '自幼在山林中奔走，身体底子不错，资源却十分有限。',
    rarity: '凡品',
    effect: { 根骨: 6, 家境: -3 },
    modifiers: { 事件权重: { cultivation: 1.08, resource: 0.9 } },
    probability: 0.12
  },
  {
    id: 'thin-fate',
    name: '薄命之相',
    description: '命数稍薄，早年多有磕绊，却也更容易体会生死之间的清醒。',
    rarity: '凡品',
    effect: { 气运: -3, 神识: 3, 悟性: 4 },
    modifiers: { 寿命倍率: 0.94, 事件权重: { mind: 1.2, disaster: 1.08 } },
    probability: 0.09
  },
  {
    id: 'village-school',
    name: '乡塾小才',
    description: '你幼时在乡塾里算是聪慧，见识有限，却有不错的读书底子。',
    rarity: '凡品',
    effect: { 悟性: 4, 神识: 1, 家境: -1 },
    modifiers: { 事件权重: { mind: 1.1, sect: 0.95 } },
    probability: 0.09
  },
  {
    id: 'quiet-child',
    name: '少言寡语',
    description: '你不爱热闹，常独自琢磨事情，社交慢热但心神更稳。',
    rarity: '凡品',
    effect: { 神识: 4, 颜值: -1 },
    modifiers: { 灾劫抗性: 0.04, 事件权重: { mind: 1.12, social: 0.88 } },
    probability: 0.085
  },
  {
    id: 'stubborn-bones',
    name: '倔骨难折',
    description: '天资普通，却有一股不服输的倔劲，受挫后更能咬牙撑住。',
    rarity: '凡品',
    effect: { 根骨: 4, 气运: -1 },
    modifiers: { 灾劫抗性: 0.05, 事件权重: { disaster: 0.95, daily: 1.08 } },
    probability: 0.085
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
    id: 'poor-ascetic',
    name: '寒门苦修',
    description: '家底单薄，但你早早懂得把每一点资源都用在刀刃上。',
    rarity: '下品',
    effect: { 根骨: 5, 神识: 2, 悟性: 3, 家境: -3 },
    modifiers: { 属性倍率: 1.04, 事件权重: { daily: 1.25, resource: 0.85 } },
    probability: 0.1
  },
  {
    id: 'herb-apprentice',
    name: '药童出身',
    description: '曾在药庐打杂，认得草木药性，也知道如何慢慢调养身体。',
    rarity: '下品',
    effect: { 根骨: 4, 悟性: 4 },
    modifiers: { 寿命倍率: 1.05, 事件权重: { resource: 1.12, daily: 1.08 } },
    probability: 0.09
  },
  {
    id: 'market-runner',
    name: '坊市耳目',
    description: '你熟悉坊市门路，懂得讨价还价，也更容易听见机缘风声。',
    rarity: '下品',
    effect: { 家境: 3, 气运: 3 },
    modifiers: { 事件权重: { resource: 1.25, encounter: 1.08 } },
    probability: 0.09
  },
  {
    id: 'clear-face',
    name: '眉目清朗',
    description: '容貌不算惊艳，却让人觉得干净亲近，往来时更少阻力。',
    rarity: '下品',
    effect: { 颜值: 8, 气运: 2 },
    modifiers: { 事件权重: { social: 1.25 } },
    probability: 0.09
  },
  {
    id: 'old-injury',
    name: '旧伤未愈',
    description: '早年伤病留下暗疾，逼得你格外重视淬体与养生。',
    rarity: '下品',
    effect: { 根骨: -2, 悟性: 4 },
    modifiers: { 寿命倍率: 0.96, 事件权重: { cultivation: 1.12, daily: 1.1 } },
    probability: 0.07
  },
  {
    id: 'spirit-field-helper',
    name: '灵田帮工',
    description: '你曾在灵田里打下手，懂些灵草照料与踏实劳作的门道。',
    rarity: '下品',
    effect: { 根骨: 3, 悟性: 3, 家境: 2 },
    modifiers: { 事件权重: { resource: 1.18, daily: 1.12 } },
    probability: 0.085
  },
  {
    id: 'wandering-feet',
    name: '游方脚力',
    description: '你走过不少山路，身体耐劳，也更容易撞见路上的小机缘。',
    rarity: '下品',
    effect: { 根骨: 5, 气运: 3 },
    modifiers: { 事件权重: { encounter: 1.15, daily: 1.08 } },
    probability: 0.08
  },
  {
    id: 'beast-friend',
    name: '兽语亲近',
    description: '寻常灵兽不太排斥你，山野中的危险有时会变成机会。',
    rarity: '下品',
    effect: { 气运: 5, 颜值: 2 },
    modifiers: { 事件权重: { encounter: 1.18, combat: 0.95 } },
    probability: 0.075
  },
  {
    id: 'broken-temple-script',
    name: '破庙残经',
    description: '你年少时在破庙中见过半篇残经，至今仍记得几句。',
    rarity: '下品',
    effect: { 神识: 3, 悟性: 5 },
    modifiers: { 事件权重: { mind: 1.16, encounter: 1.05 } },
    probability: 0.075
  },

  {
    id: 'scholar',
    name: '书香门第',
    description: '自幼读书明理，悟性和家境稍胜常人。',
    rarity: '中品',
    effect: { 神识: 6, 悟性: 10, 家境: 4 },
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
    id: 'talisman-talent',
    name: '符箓奇才',
    description: '你对符纹走势格外敏感，常能从细小笔画里看见天地秩序。',
    rarity: '中品',
    effect: { 神识: 6, 悟性: 10, 家境: 2 },
    modifiers: { 修为倍率: 1.05, 事件权重: { mind: 1.2, resource: 1.08 } },
    probability: 0.08
  },
  {
    id: 'alchemy-sense',
    name: '丹香入命',
    description: '你天生亲近药火，调养肉身与换取资源都更有门路。',
    rarity: '中品',
    effect: { 根骨: 8, 神识: 3, 悟性: 5, 家境: 2 },
    modifiers: { 寿命倍率: 1.06, 事件权重: { resource: 1.22, daily: 1.08 } },
    probability: 0.08
  },
  {
    id: 'wandering-hero',
    name: '侠名初显',
    description: '你爱管闲事，也因此得罪人、结善缘，名声来得很早。',
    rarity: '中品',
    effect: { 颜值: 8, 气运: 8 },
    modifiers: { 事件权重: { social: 1.25, encounter: 1.18, disaster: 1.05 } },
    probability: 0.075
  },
  {
    id: 'dream-reader',
    name: '山河入梦',
    description: '你常梦见山川星斗，醒来后对天地灵机多一分亲近。',
    rarity: '中品',
    effect: { 神识: 8, 悟性: 6, 气运: 7 },
    modifiers: { 修为倍率: 1.06, 事件权重: { mind: 1.28, encounter: 1.08 } },
    probability: 0.075
  },
  {
    id: 'patient-breath',
    name: '龟息有成',
    description: '你呼吸绵长，耐得住寂寞，寿元与闭关收益都略胜常人。',
    rarity: '中品',
    effect: { 根骨: 7, 神识: 4, 悟性: 3 },
    modifiers: { 寿命倍率: 1.08, 修为倍率: 1.04, 事件权重: { daily: 1.16 } },
    probability: 0.07
  },
  {
    id: 'formation-initiate',
    name: '阵道启蒙',
    description: '你对方位、灵线与阵纹颇有直觉，布置洞府时更得心应手。',
    rarity: '中品',
    effect: { 神识: 7, 悟性: 8, 家境: 1 },
    modifiers: { 灾劫抗性: 0.06, 事件权重: { sect: 1.12, resource: 1.1 } },
    probability: 0.07
  },
  {
    id: 'weapon-fire',
    name: '器火亲和',
    description: '你亲近炉火与金石，炼器、战斗与资源机缘都略有门路。',
    rarity: '中品',
    effect: { 根骨: 7, 神识: 5, 家境: 2 },
    modifiers: { 事件权重: { resource: 1.18, combat: 1.08 } },
    probability: 0.065
  },
  {
    id: 'wind-listener',
    name: '听风辨机',
    description: '你能从细微风声和人声里听出局势变化，趋吉避凶更敏锐。',
    rarity: '中品',
    effect: { 神识: 7, 气运: 9 },
    modifiers: { 灾劫抗性: 0.08, 事件权重: { encounter: 1.2, disaster: 0.92 } },
    probability: 0.065
  },
  {
    id: 'clear-voice',
    name: '清音入心',
    description: '你的声音清越平和，论道、交友与宗门往来更容易让人信服。',
    rarity: '中品',
    effect: { 颜值: 10, 神识: 4, 悟性: 4 },
    modifiers: { 事件权重: { social: 1.28, sect: 1.12 } },
    probability: 0.06
  },
  {
    id: 'merchant-kin',
    name: '商贾旧识',
    description: '你与几家坊市商贾有旧，资源周转更顺，但也更常卷入买卖纠葛。',
    rarity: '中品',
    effect: { 家境: 7, 气运: 4 },
    modifiers: { 事件权重: { resource: 1.35, social: 1.08, disaster: 1.04 } },
    probability: 0.06
  },

  {
    id: 'rich-clan',
    name: '仙门嫡传',
    description: '出身修仙大族，资源不缺，代价是因果牵连更多。',
    rarity: '上品',
    effect: { 家境: 10, 气运: 8 },
    modifiers: { 属性倍率: 1.08, 事件权重: { resource: 1.6, social: 1.15, disaster: 1.08 } },
    probability: 0.08
  },
  {
    id: 'calm-heart',
    name: '道心澄明',
    description: '心境澄澈，不易为外物所扰，心境事件收益更高。',
    rarity: '上品',
    effect: { 神识: 14, 悟性: 14, 气运: 8 },
    modifiers: { 灾劫抗性: 0.12, 事件权重: { mind: 1.6, disaster: 0.9 } },
    probability: 0.06
  },
  {
    id: 'early-wisdom',
    name: '灵台早慧',
    description: '你很早便能理解复杂道理，修炼时常有举一反三之感。',
    rarity: '上品',
    effect: { 神识: 10, 悟性: 16, 气运: 5 },
    modifiers: { 修为倍率: 1.12, 事件权重: { mind: 1.35, sect: 1.1 } },
    probability: 0.055
  },
  {
    id: 'silver-tongue',
    name: '长袖善舞',
    description: '你擅长周旋人情，宗门、坊市与同道之间都更容易打开局面。',
    rarity: '上品',
    effect: { 颜值: 14, 家境: 6 },
    modifiers: { 事件权重: { social: 1.55, resource: 1.2, sect: 1.18 } },
    probability: 0.055
  },
  {
    id: 'tribulation-survivor',
    name: '百劫余生',
    description: '你几次从险境中活下来，身体和心志都被劫数磨得更硬。',
    rarity: '上品',
    effect: { 根骨: 14, 气运: 6 },
    modifiers: { 灾劫抗性: 0.18, 事件权重: { disaster: 0.82, cultivation: 1.12 } },
    probability: 0.05
  },
  {
    id: 'moonlit-beauty',
    name: '月华照骨',
    description: '你气质清寒，如月照山泉，社交善缘与心境修行都更顺。',
    rarity: '上品',
    effect: { 颜值: 18, 神识: 5, 悟性: 5 },
    modifiers: { 事件权重: { social: 1.38, mind: 1.22 } },
    probability: 0.045
  },
  {
    id: 'spirit-eye',
    name: '天生灵眼',
    description: '你能看见常人忽略的灵机流向，寻宝、避劫和悟法都占些便宜。',
    rarity: '上品',
    effect: { 神识: 15, 悟性: 8, 气运: 8 },
    modifiers: { 灾劫抗性: 0.1, 事件权重: { encounter: 1.35, mind: 1.2 } },
    probability: 0.045
  },
  {
    id: 'thunder-affinity',
    name: '雷息入骨',
    description: '你天生能承受雷息淬体，战斗与渡劫都更敢硬接。',
    rarity: '上品',
    effect: { 根骨: 15, 神识: 6, 气运: 4 },
    modifiers: { 灾劫抗性: 0.16, 事件权重: { combat: 1.2, disaster: 0.88 } },
    probability: 0.04
  },
  {
    id: 'sect-orphan',
    name: '宗门遗孤',
    description: '你身世牵着旧日宗门因果，资源与麻烦都会更早找上门。',
    rarity: '上品',
    effect: { 家境: 5, 神识: 8, 气运: 8 },
    modifiers: { 事件权重: { sect: 1.45, encounter: 1.12, disaster: 1.08 } },
    probability: 0.04
  },
  {
    id: 'jade-balance',
    name: '玉衡命格',
    description: '命盘如秤，五维成长更均衡，偏科时也更容易补齐短板。',
    rarity: '上品',
    effect: { 根骨: 7, 神识: 7, 悟性: 7, 气运: 7, 颜值: 4 },
    modifiers: { 属性倍率: 1.08, 事件权重: { daily: 1.12, mind: 1.08 } },
    probability: 0.038
  },

  {
    id: 'sword-body',
    name: '天生剑体',
    description: '身与剑意相合，修炼杀伐之道极快，劫数也更凌厉。',
    rarity: '极品',
    effect: { 根骨: 18, 神识: 8, 悟性: 10 },
    modifiers: { 修为倍率: 1.18, 属性倍率: 1.1, 事件权重: { cultivation: 1.25, disaster: 1.12 } },
    probability: 0.05
  },
  {
    id: 'born-alchemist',
    name: '天生丹体',
    description: '药性入体不伤根本，丹药、药浴与寿元收益都更容易化开。',
    rarity: '极品',
    effect: { 根骨: 18, 神识: 6, 悟性: 10, 家境: 3 },
    modifiers: { 寿命倍率: 1.14, 属性倍率: 1.08, 事件权重: { resource: 1.35, daily: 1.12 } },
    probability: 0.04
  },
  {
    id: 'starry-eyes',
    name: '星眸照命',
    description: '你眼中似有星辉流转，常能提前感到机缘与危险的方向。',
    rarity: '极品',
    effect: { 神识: 10, 气运: 20, 颜值: 12 },
    modifiers: { 灾劫抗性: 0.1, 事件权重: { encounter: 1.45, social: 1.22, disaster: 0.9 } },
    probability: 0.038
  },
  {
    id: 'innocent-heart',
    name: '赤子道心',
    description: '你待人待己都少有杂念，因此常能在复杂局面中守住本心。',
    rarity: '极品',
    effect: { 神识: 14, 悟性: 12, 气运: 12 },
    modifiers: { 修为倍率: 1.12, 灾劫抗性: 0.14, 事件权重: { mind: 1.55, social: 1.12 } },
    probability: 0.035
  },
  {
    id: 'mystic-yin-body',
    name: '玄阴道体',
    description: '你体内阴华自生，心神清寒，悟法与养神皆有异禀。',
    rarity: '极品',
    effect: { 神识: 18, 悟性: 14, 颜值: 10 },
    modifiers: { 修为倍率: 1.1, 事件权重: { mind: 1.5, social: 1.12 } },
    probability: 0.032
  },
  {
    id: 'thunder-battle-bone',
    name: '雷霆战骨',
    description: '筋骨中似有雷声，越到战斗和灾劫之中越能激发潜力。',
    rarity: '极品',
    effect: { 根骨: 20, 神识: 8, 气运: 8 },
    modifiers: { 灾劫抗性: 0.16, 属性倍率: 1.08, 事件权重: { combat: 1.35, disaster: 0.9 } },
    probability: 0.03
  },
  {
    id: 'creation-medicine-heart',
    name: '造化药心',
    description: '你对药性与生机有近乎本能的理解，丹药和灵材收益更易化开。',
    rarity: '极品',
    effect: { 根骨: 12, 神识: 10, 悟性: 14, 家境: 4 },
    modifiers: { 寿命倍率: 1.16, 属性倍率: 1.08, 事件权重: { resource: 1.45, daily: 1.1 } },
    probability: 0.028
  },

  {
    id: 'myriad-methods',
    name: '万法归藏',
    description: '你似乎能把不同法门纳入一炉，越到后期越显出惊人潜力。',
    rarity: '神话',
    effect: { 根骨: 14, 神识: 14, 悟性: 14, 气运: 10 },
    modifiers: { 修为倍率: 1.22, 属性倍率: 1.16, 事件权重: { cultivation: 1.32, mind: 1.25, encounter: 1.18 } },
    probability: 0.018
  },
  {
    id: 'taishang-heart',
    name: '太上忘情',
    description: '你的心神常在高远处俯瞰万事，悟道极快，人情却稍显疏离。',
    rarity: '神话',
    effect: { 神识: 22, 悟性: 18, 气运: 8, 颜值: -4 },
    modifiers: { 修为倍率: 1.25, 灾劫抗性: 0.16, 事件权重: { mind: 1.8, social: 0.75 } },
    probability: 0.014
  },
  {
    id: 'innate-dao-womb',
    name: '先天道胎',
    description: '你像是天生为修道而来，五维根基与后续成长都极为顺滑。',
    rarity: '神话',
    effect: { 根骨: 18, 神识: 18, 悟性: 18, 气运: 14, 颜值: 8 },
    modifiers: { 修为倍率: 1.18, 属性倍率: 1.18, 灾劫抗性: 0.12, 事件权重: { cultivation: 1.28, mind: 1.25 } },
    probability: 0.012
  },
  {
    id: 'karma-free',
    name: '因果不染',
    description: '许多因果落到你身上都会变轻，灾劫少些，机缘也更干净。',
    rarity: '神话',
    effect: { 神识: 18, 气运: 20, 悟性: 10 },
    modifiers: { 灾劫抗性: 0.22, 寿命倍率: 1.08, 事件权重: { disaster: 0.75, encounter: 1.22 } },
    probability: 0.01
  },

  {
    id: 'reincarnated',
    name: '转世仙人',
    description: '旧日道果未尽，修炼更快，突破门槛也更容易越过。',
    rarity: '传说',
    effect: { 根骨: 22, 神识: 22, 悟性: 20, 气运: 14 },
    modifiers: { 修为倍率: 1.35, 属性倍率: 1.12, 寿命倍率: 1.12, 灾劫抗性: 0.12 },
    probability: 0.018
  },
  {
    id: 'destined-one',
    name: '天命主角',
    description: '天道似乎格外偏爱你，机缘、贵人和绝境逢生都会更频繁。',
    rarity: '传说',
    effect: { 根骨: 20, 神识: 20, 悟性: 18, 气运: 28, 颜值: 14, 家境: 6 },
    modifiers: {
      修为倍率: 1.2,
      属性倍率: 1.15,
      寿命倍率: 1.08,
      灾劫抗性: 0.18,
      事件权重: { encounter: 1.75, social: 1.35, resource: 1.25, disaster: 0.85 }
    },
    probability: 0.012
  },
  {
    id: 'chaos-old-dream',
    name: '混沌旧梦',
    description: '你梦里常有天地未分之景，醒来后仍带着一点不可言说的旧识。',
    rarity: '传说',
    effect: { 根骨: 24, 神识: 24, 悟性: 24, 气运: 18, 颜值: 8 },
    modifiers: {
      修为倍率: 1.28,
      属性倍率: 1.18,
      寿命倍率: 1.1,
      灾劫抗性: 0.14,
      事件权重: { mind: 1.5, encounter: 1.45, cultivation: 1.25, disaster: 0.92 }
    },
    probability: 0.008
  }
];
