import type { GameEvent } from '@/types';

export const events: GameEvent[] = [
  {
    id: 'cultivation-meridian-flow',
    age: 0,
    type: 'cultivation',
    title: '周天顺行',
    description: '一夜吐纳之后，经脉中的灵气自成小周天，修炼进境比往日顺畅许多。',
    weight: 1.2,
    effects: { 修为: 8, 根骨: 2 },
    result: 'success'
  },
  {
    id: 'cultivation-bottleneck-loose',
    age: 0,
    type: 'cultivation',
    title: '瓶颈松动',
    description: '灵气在经脉中流转圆融，境界瓶颈出现一丝可贵的裂隙。',
    weight: 0.9,
    effects: { 修为: 14 },
    result: 'success'
  },
  {
    id: 'cultivation-spirit-rain',
    age: 0,
    type: 'cultivation',
    title: '夜逢灵雨',
    description: '山中灵雨落了半夜，你借天地清气洗练肉身，根基更稳。',
    weight: 0.8,
    effects: { 根骨: 3, 修为: 10 },
    result: 'success'
  },
  {
    id: 'cultivation-enlightenment',
    age: 0,
    type: 'cultivation',
    title: '一念顿悟',
    description: '你忽然看懂了功法中反复困扰自己的几句隐语，心中豁然开朗。',
    weight: 0.65,
    effects: { 悟性: 4, 修为: 12 },
    result: 'success'
  },
  {
    id: 'cultivation-fire-root-spark',
    age: 0,
    type: 'cultivation',
    title: '丹火初炽',
    description: '体内火行灵机一振，修炼速度骤然拔高，但气血也被烧得躁动。',
    weight: 0.45,
    conditions: { spiritRootIds: ['fire-root', 'heaven-root', 'chaos-root'] },
    effects: { 修为: 18, 根骨: 3, 寿命: -2 },
    result: 'success'
  },
  {
    id: 'cultivation-water-root-calm',
    age: 0,
    type: 'cultivation',
    title: '水月入怀',
    description: '水行灵息化作清凉月影，洗去杂念，让你对道法有了新的体会。',
    weight: 0.45,
    conditions: { spiritRootIds: ['water-root', 'chaos-root'] },
    effects: { 悟性: 4, 修为: 12 },
    result: 'success'
  },
  {
    id: 'cultivation-wood-root-renewal',
    age: 0,
    type: 'cultivation',
    title: '草木回春',
    description: '你在林间静坐，草木生机与灵息互相牵引，连旧伤都淡了几分。',
    weight: 0.45,
    conditions: { spiritRootIds: ['wood-root', 'chaos-root'] },
    effects: { 根骨: 2, 寿命: 3, 修为: 9 },
    result: 'success'
  },
  {
    id: 'cultivation-mixed-root-balance',
    age: 0,
    type: 'cultivation',
    title: '五气调和',
    description: '驳杂灵机没有拖住你，反而在耐心梳理后形成了稳固的内息。',
    weight: 0.5,
    conditions: { spiritRootIds: ['mixed-root'] },
    effects: { 根骨: 2, 悟性: 2, 修为: 7 },
    result: 'success'
  },
  {
    id: 'cultivation-wrong-method',
    age: 0,
    type: 'cultivation',
    title: '功法错解',
    description: '你把功法中一处关窍理解偏了，数月苦修反而让灵息滞涩。',
    weight: 0.8,
    effects: { 悟性: -3, 修为: -7 },
    result: 'failure'
  },
  {
    id: 'cultivation-overstrain',
    age: 0,
    type: 'cultivation',
    title: '闭关过久',
    description: '连续闭关让你精神枯竭，修为虽有所得，身体却难免受损。',
    weight: 0.65,
    effects: { 修为: 9, 寿命: -4 },
    result: 'neutral'
  },

  {
    id: 'encounter-secret-manual',
    age: 0,
    type: 'encounter',
    title: '残卷秘笈',
    description: '你在山洞石缝中发现半卷古旧功法，虽然残缺，却字字有灵。',
    weight: 0.8,
    effects: { 悟性: 4, 修为: 7 },
    result: 'success'
  },
  {
    id: 'encounter-master',
    age: 0,
    type: 'encounter',
    title: '高人指路',
    description: '云游高人见你还算诚恳，点破了你修炼中最大的误区。',
    weight: 0.65,
    effects: { 根骨: 3, 悟性: 3, 修为: 9 },
    result: 'success'
  },
  {
    id: 'encounter-treasure',
    age: 0,
    type: 'encounter',
    title: '古修遗迹',
    description: '荒山深处露出一角石门，你从古修遗迹中带回了灵材与旧闻。',
    weight: 0.55,
    effects: { 气运: 5, 家境: 5, 修为: 6 },
    result: 'success'
  },
  {
    id: 'encounter-spirit-beast',
    age: 0,
    type: 'encounter',
    title: '灵兽认主',
    description: '一只灵兽幼崽主动靠近你，似乎认定你身上有它愿意追随的气机。',
    weight: 0.55,
    conditions: { attributes: { 气运: 20 } },
    effects: { 气运: 4, 颜值: 2, 修为: 5 },
    result: 'success'
  },
  {
    id: 'encounter-immortal-cave',
    age: 0,
    type: 'encounter',
    title: '仙府一梦',
    description: '你误入云雾中的旧仙府，醒来时只记得一道玄奥符纹。',
    weight: 0.35,
    conditions: { minRealmLevel: 3 },
    effects: { 悟性: 6, 气运: 3, 修为: 12 },
    result: 'success'
  },
  {
    id: 'encounter-lost-child',
    age: 0,
    type: 'encounter',
    title: '山路救人',
    description: '你救下误入深山的孩童，虽耽误修炼，却为自己积下一点善缘。',
    weight: 0.8,
    effects: { 气运: 3, 修为: -2 },
    result: 'neutral'
  },
  {
    id: 'encounter-false-map',
    age: 0,
    type: 'encounter',
    title: '假藏宝图',
    description: '所谓秘境地图不过是坊市骗局，你费了不少时日才看清真相。',
    weight: 0.55,
    effects: { 家境: -4, 修为: -5 },
    result: 'failure'
  },

  {
    id: 'social-partner',
    age: 0,
    type: 'social',
    title: '遇见知己',
    description: '修仙路上难得遇到志同道合之人，一番长谈后心境舒展。',
    weight: 0.9,
    effects: { 气运: 3, 颜值: 2, 修为: 3 },
    result: 'success'
  },
  {
    id: 'social-brother',
    age: 0,
    type: 'social',
    title: '结义同修',
    description: '几位同道与你结义相扶，往后行走坊市与宗门都多了照应。',
    weight: 0.7,
    effects: { 气运: 2, 家境: 4 },
    result: 'success'
  },
  {
    id: 'social-rival',
    age: 0,
    type: 'social',
    title: '结下仇怨',
    description: '一次争执演变成梁子，对方不肯善罢甘休，你的名声也受了牵连。',
    weight: 0.7,
    effects: { 气运: -4, 颜值: -2 },
    result: 'failure'
  },
  {
    id: 'social-clan-banquet',
    age: 0,
    type: 'social',
    title: '世家法会',
    description: '你受邀参加世家法会，席间资源往来、人情暗线都悄然改变。',
    weight: 0.55,
    conditions: { attributes: { 家境: 25 } },
    effects: { 家境: 5, 气运: 2 },
    result: 'success'
  },
  {
    id: 'social-rumor',
    age: 0,
    type: 'social',
    title: '流言四起',
    description: '坊间突然传出关于你的闲话，虽然不致命，却让很多合作变得别扭。',
    weight: 0.65,
    effects: { 颜值: -3, 家境: -2 },
    result: 'failure'
  },
  {
    id: 'social-dao-companion',
    age: 0,
    type: 'social',
    title: '道侣相伴',
    description: '你遇到愿意并肩修行的人，彼此扶持，孤独的长路多了一分暖意。',
    weight: 0.35,
    conditions: { attributes: { 颜值: 35 }, minRealmLevel: 2 },
    effects: { 气运: 5, 修为: 8, 寿命: 3 },
    result: 'success'
  },

  {
    id: 'disaster-beast-attack',
    age: 0,
    type: 'disaster',
    title: '妖兽袭山',
    description: '妖兽趁夜袭来，你拼命突围，身上留下了难以轻易消去的伤痕。',
    weight: 0.75,
    effects: { 寿命: -8, 根骨: -4, 修为: -6 },
    result: 'failure'
  },
  {
    id: 'disaster-heart-demon',
    age: 0,
    type: 'disaster',
    title: '心魔暗生',
    description: '多年执念趁虚而入，你一时分不清幻象与本心。',
    weight: 0.65,
    conditions: { minRealmLevel: 2 },
    effects: { 悟性: -5, 修为: -10, 寿命: -5 },
    result: 'failure'
  },
  {
    id: 'disaster-heaven-tribulation',
    age: 0,
    type: 'disaster',
    title: '天雷惊梦',
    description: '天机异动，一道劫雷落在洞府附近，余威仍震得你气血翻涌。',
    weight: 0.45,
    conditions: { minRealmLevel: 4 },
    effects: { 寿命: -18, 根骨: -6, 修为: -12 },
    result: 'failure'
  },
  {
    id: 'disaster-resource-theft',
    age: 0,
    type: 'disaster',
    title: '灵材被盗',
    description: '积攒许久的灵材被人盗走，追查无果，只能咽下这口闷气。',
    weight: 0.75,
    effects: { 家境: -7, 气运: -2 },
    result: 'failure'
  },
  {
    id: 'disaster-poison-mist',
    age: 0,
    type: 'disaster',
    title: '瘴雾入体',
    description: '山谷瘴雾来得突然，你虽逃了出来，却被毒息侵入经脉。',
    weight: 0.65,
    effects: { 寿命: -10, 根骨: -3, 悟性: -2 },
    result: 'failure'
  },
  {
    id: 'disaster-clan-karma',
    age: 0,
    type: 'disaster',
    title: '家族旧债',
    description: '先辈留下的因果找上门来，一场谈判后，你付出了不小代价。',
    weight: 0.45,
    conditions: { attributes: { 家境: 35 } },
    effects: { 家境: -10, 气运: -3, 修为: -4 },
    result: 'failure'
  },
  {
    id: 'disaster-sword-body-killing',
    age: 0,
    type: 'disaster',
    title: '杀意反噬',
    description: '剑意太盛，反噬心神，你不得不花很久压住体内锋芒。',
    weight: 0.35,
    conditions: { talentIds: ['sword-body'] },
    effects: { 寿命: -8, 悟性: -4, 修为: -8 },
    result: 'failure'
  },

  {
    id: 'daily-meditation',
    age: 0,
    type: 'daily',
    title: '静室打坐',
    description: '这一年没有大事，你安静打坐，慢慢把零散灵气归入丹田。',
    weight: 1.4,
    effects: { 修为: 6, 悟性: 1 },
    result: 'success'
  },
  {
    id: 'daily-merchant',
    age: 0,
    type: 'daily',
    title: '坊市淘宝',
    description: '你在坊市角落淘到一件不起眼的小物，细看才知并非凡品。',
    weight: 1,
    effects: { 家境: 3, 气运: 2 },
    result: 'success'
  },
  {
    id: 'daily-elixir',
    age: 0,
    type: 'daily',
    title: '炉火微明',
    description: '你守着丹炉反复试错，终于炼出一炉可用的丹药。',
    weight: 0.8,
    effects: { 悟性: 3, 家境: 2, 修为: 4 },
    result: 'success'
  },
  {
    id: 'daily-visit-family',
    age: 0,
    type: 'daily',
    title: '回望凡尘',
    description: '你回到旧日故乡，凡尘牵挂让心神柔软，也让脚步慢了半拍。',
    weight: 0.7,
    effects: { 颜值: 2, 气运: 1, 修为: -2 },
    result: 'neutral'
  },
  {
    id: 'daily-repair-cave',
    age: 0,
    type: 'daily',
    title: '修缮洞府',
    description: '你重新布置洞府，灵气流向更稳，闭关时少了许多杂扰。',
    weight: 0.75,
    effects: { 家境: -2, 修为: 7 },
    result: 'neutral'
  },
  {
    id: 'daily-small-illness',
    age: 0,
    type: 'daily',
    title: '小病缠身',
    description: '寒湿之气入体，你虽不至于伤筋动骨，却被拖慢了修炼。',
    weight: 0.7,
    effects: { 寿命: -3, 修为: -3 },
    result: 'failure'
  },

  {
    id: 'resource-spirit-stone-vein',
    age: 0,
    type: 'resource',
    title: '发现灵脉',
    description: '你在荒岭下发现一条细小灵脉，虽不能独占，却足够换来许多资源。',
    weight: 0.55,
    effects: { 家境: 8, 气运: 2, 修为: 5 },
    result: 'success'
  },
  {
    id: 'resource-auction',
    age: 0,
    type: 'resource',
    title: '拍得灵丹',
    description: '坊市拍卖会上，你用积攒的灵石换来一枚品相不错的灵丹。',
    weight: 0.55,
    conditions: { attributes: { 家境: 20 } },
    effects: { 家境: -4, 根骨: 4, 修为: 8 },
    result: 'success'
  },
  {
    id: 'resource-debt',
    age: 0,
    type: 'resource',
    title: '灵石周转',
    description: '短缺的灵石让修行安排变得紧绷，你不得不压缩一些闭关时间。',
    weight: 0.65,
    effects: { 家境: -5, 修为: -4 },
    result: 'failure'
  },
  {
    id: 'resource-patron',
    age: 0,
    type: 'resource',
    title: '贵人资助',
    description: '有人看重你的潜力，愿意供给一批修炼资源，只求日后结个善缘。',
    weight: 0.35,
    conditions: { attributes: { 气运: 30 } },
    effects: { 家境: 7, 修为: 7 },
    result: 'success'
  },
  {
    id: 'resource-chaos-root-artifact',
    age: 0,
    type: 'resource',
    title: '万法残器',
    description: '一件无人能催动的旧器在你手中忽然发亮，混沌灵机与它遥相呼应。',
    weight: 0.28,
    conditions: { spiritRootIds: ['chaos-root'] },
    effects: { 悟性: 5, 家境: 6, 修为: 12 },
    result: 'success'
  },

  {
    id: 'mind-script-copying',
    age: 0,
    type: 'mind',
    title: '抄经养心',
    description: '你每日抄写道经，笔画从浮躁渐渐落到沉静。',
    weight: 0.9,
    effects: { 悟性: 3, 修为: 4 },
    result: 'success'
  },
  {
    id: 'mind-dao-heart-clear',
    age: 0,
    type: 'mind',
    title: '道心澄明',
    description: '一场纷争后，你没有随怒意走偏，反而看清了自己的修行所求。',
    weight: 0.65,
    effects: { 悟性: 4, 气运: 2, 修为: 6 },
    result: 'success'
  },
  {
    id: 'mind-dream-old-life',
    age: 0,
    type: 'mind',
    title: '梦见前尘',
    description: '梦中似有旧日修行痕迹浮现，醒来后你对大道多了一点熟悉感。',
    weight: 0.35,
    conditions: { talentIds: ['reincarnated'] },
    effects: { 悟性: 6, 修为: 12 },
    result: 'success'
  },
  {
    id: 'mind-vanity',
    age: 0,
    type: 'mind',
    title: '名声所累',
    description: '外界称赞让你心中生出浮气，几次修炼都难以真正入定。',
    weight: 0.55,
    effects: { 悟性: -3, 修为: -6 },
    result: 'failure'
  },
  {
    id: 'mind-calm-heart-tide',
    age: 0,
    type: 'mind',
    title: '心湖无波',
    description: '你以澄明道心观照万念，杂念如潮来去，却不能动摇根本。',
    weight: 0.35,
    conditions: { talentIds: ['calm-heart'] },
    effects: { 悟性: 5, 修为: 9, 寿命: 2 },
    result: 'success'
  },

  {
    id: 'sect-mission',
    age: 0,
    type: 'sect',
    title: '宗门任务',
    description: '你接下宗门任务，奔走数月后换回了丹药、灵石和一点评价。',
    weight: 0.9,
    effects: { 家境: 4, 气运: 2, 修为: 4 },
    result: 'success'
  },
  {
    id: 'sect-inner-test',
    age: 0,
    type: 'sect',
    title: '内门考校',
    description: '宗门考校中，你以扎实根基赢得长老点头，修行资源也随之增加。',
    weight: 0.55,
    conditions: { attributes: { 根骨: 25, 悟性: 20 } },
    effects: { 家境: 5, 修为: 8 },
    result: 'success'
  },
  {
    id: 'sect-library',
    age: 0,
    type: 'sect',
    title: '藏经阁夜读',
    description: '你获准入藏经阁翻阅旧卷，许多零碎见闻终于串成一线。',
    weight: 0.65,
    conditions: { minRealmLevel: 2 },
    effects: { 悟性: 5, 修为: 6 },
    result: 'success'
  },
  {
    id: 'sect-faction-strife',
    age: 0,
    type: 'sect',
    title: '派系纷争',
    description: '宗门派系暗潮翻涌，你被卷入其中，不得不耗费心力周旋。',
    weight: 0.6,
    conditions: { minRealmLevel: 2 },
    effects: { 家境: -4, 气运: -3, 修为: -4 },
    result: 'failure'
  },
  {
    id: 'sect-clan-privilege',
    age: 0,
    type: 'sect',
    title: '嫡传门路',
    description: '家族旧识替你打通了一层关节，宗门资源分配时你得了先机。',
    weight: 0.35,
    conditions: { talentIds: ['rich-clan'] },
    effects: { 家境: 6, 修为: 9 },
    result: 'success'
  },
  {
    id: 'sect-heavenly-favor',
    age: 0,
    type: 'sect',
    title: '众望所归',
    description: '几场机缘之后，宗门上下都觉得你前途不可限量，愿意向你倾斜资源。',
    weight: 0.25,
    conditions: { talentIds: ['destined-one'], minRealmLevel: 3 },
    effects: { 气运: 5, 家境: 6, 修为: 12 },
    result: 'success'
  }
];
