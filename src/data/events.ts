import type { GameEvent } from '@/types';

export const childhoodEvents: GameEvent[] = [
  {
    id: 'childhood-reading',
    age: 0,
    type: 'childhood',
    title: '蒙学识字',
    description: '你在灯下跟着长辈认字，许多道经还看不懂，却先学会了静心。',
    weight: 1,
    effects: { 悟性: 2 },
    result: 'success'
  },
  {
    id: 'childhood-mountain-run',
    age: 0,
    type: 'childhood',
    title: '山径奔跑',
    description: '你常在山路间追风奔跑，摔过许多跤，筋骨也一点点结实起来。',
    weight: 1,
    effects: { 根骨: 2 },
    result: 'success'
  },
  {
    id: 'childhood-family-ledger',
    age: 0,
    type: 'childhood',
    title: '帮看账册',
    description: '家中大人让你帮忙核对账册，琐碎数字里藏着一点处世门道。',
    weight: 0.85,
    effects: { 家境: 1, 悟性: 1 },
    result: 'success'
  },
  {
    id: 'childhood-neighbor-kindness',
    age: 0,
    type: 'childhood',
    title: '邻里善缘',
    description: '你帮邻人送药递信，小小善举被人记在心里。',
    weight: 0.9,
    effects: { 气运: 2, 颜值: 1 },
    result: 'success'
  },
  {
    id: 'childhood-river-reflection',
    age: 0,
    type: 'childhood',
    title: '溪边照影',
    description: '你在溪边整理衣冠，虽还年幼，举止间已有几分清朗。',
    weight: 0.8,
    effects: { 颜值: 2 },
    result: 'success'
  },
  {
    id: 'childhood-herb-gathering',
    age: 0,
    type: 'childhood',
    title: '采药认草',
    description: '你跟着药师辨认草木，认错几回之后，终于记住了药性的细微差别。',
    weight: 0.85,
    effects: { 悟性: 1, 根骨: 1 },
    result: 'success'
  },
  {
    id: 'childhood-small-illness',
    age: 0,
    type: 'childhood',
    title: '幼时小病',
    description: '一场小病让你卧床数日，病愈后反倒更懂得爱惜身体。',
    weight: 0.65,
    effects: { 根骨: -1, 悟性: 1 },
    result: 'neutral'
  },
  {
    id: 'childhood-lost-and-found',
    age: 0,
    type: 'childhood',
    title: '迷路归家',
    description: '你在山脚迷了路，最后凭着一点直觉寻回家门。',
    weight: 0.7,
    effects: { 气运: 2 },
    result: 'success'
  },
  {
    id: 'childhood-family-change',
    age: 0,
    type: 'childhood',
    title: '家中变故',
    description: '家中生意起落不定，你早早见过人情冷暖。',
    weight: 0.55,
    effects: { 家境: -1, 悟性: 1 },
    result: 'neutral'
  },
  {
    id: 'childhood-elder-praise',
    age: 0,
    type: 'childhood',
    title: '长辈称许',
    description: '族中长辈夸你心性沉稳，愿意多照拂几分。',
    weight: 0.55,
    effects: { 家境: 1, 神识: 1, 气运: 1, 颜值: 1 },
    result: 'success'
  },
  {
    id: 'childhood-bamboo-sword',
    age: 0,
    type: 'childhood',
    title: '竹剑嬉戏',
    description: '你削了一柄竹剑，在院中反复挥舞，招式稚嫩，却练出一点胆气。',
    weight: 0.85,
    effects: { 根骨: 1, 神识: 1 },
    result: 'success'
  },
  {
    id: 'childhood-listen-thunder',
    age: 0,
    type: 'childhood',
    title: '檐下听雷',
    description: '夏夜雷声滚过山脊，你没有害怕，反而静静听见心神深处的回响。',
    weight: 0.7,
    effects: { 神识: 2 },
    result: 'success'
  },
  {
    id: 'childhood-clay-altar',
    age: 0,
    type: 'childhood',
    title: '泥坛祈愿',
    description: '你用泥土垒了小小祭坛，认真许下愿望，童心竟也牵来一缕善缘。',
    weight: 0.65,
    effects: { 气运: 1, 悟性: 1 },
    result: 'success'
  }
];

export const earlyEvents: GameEvent[] = [
  {
    id: 'cultivation-meridian-flow',
    age: 0,
    type: 'cultivation',
    title: '周天顺行',
    description: '一夜吐纳之后，经脉中的灵气自成小周天，修炼进境比往日顺畅许多。',
    weight: 1.2,
    effects: { 修为: 8, 根骨: 3 },
    result: 'success'
  },
  {
    id: 'cultivation-bottleneck-loose',
    age: 0,
    type: 'cultivation',
    title: '瓶颈松动',
    description: '灵气在经脉中流转圆融，境界瓶颈出现一丝可贵的裂隙。',
    weight: 0.9,
    effects: { 修为: 14, 根骨: 2 },
    result: 'success'
  },
  {
    id: 'cultivation-body-tempering',
    age: 0,
    type: 'cultivation',
    title: '淬体炼骨',
    description: '你以灵气反复冲刷筋骨，过程苦涩漫长，却让肉身根基更能承载灵机。',
    weight: 1.15,
    effects: { 根骨: 5, 修为: 5 },
    result: 'success'
  },
  {
    id: 'cultivation-spirit-rain',
    age: 0,
    type: 'cultivation',
    title: '夜逢灵雨',
    description: '山中灵雨落了半夜，你借天地清气洗练肉身，根基更稳。',
    weight: 0.8,
    effects: { 根骨: 5, 修为: 10 },
    result: 'success'
  },
  {
    id: 'cultivation-enlightenment',
    age: 0,
    type: 'cultivation',
    title: '一念顿悟',
    description: '你忽然看懂了功法中反复困扰自己的几句隐语，心中豁然开朗。',
    weight: 0.65,
    effects: { 神识: 3, 悟性: 5, 修为: 12 },
    result: 'success'
  },
  {
    id: 'cultivation-fire-root-spark',
    age: 0,
    type: 'cultivation',
    title: '丹火初炽',
    description: '体内火行灵机一振，修炼速度骤然拔高，但气血也被烧得躁动。',
    weight: 0.45,
    conditions: {
      spiritRootIds: [
        'fire-root',
        'dual-wood-fire-root',
        'dual-fire-earth-root',
        'dual-water-fire-root',
        'dual-fire-metal-root',
        'tiandao-root',
        'chaos-root'
      ]
    },
    effects: { 修为: 16, 根骨: 5, 寿命: -1 },
    result: 'success'
  },
  {
    id: 'cultivation-water-root-calm',
    age: 0,
    type: 'cultivation',
    title: '水月入怀',
    description: '水行灵息化作清凉月影，洗去杂念，让你对道法有了新的体会。',
    weight: 0.45,
    conditions: {
      spiritRootIds: [
        'water-root',
        'dual-water-wood-root',
        'dual-metal-water-root',
        'dual-earth-water-root',
        'dual-water-fire-root',
        'ice-root',
        'tiandao-root',
        'chaos-root'
      ]
    },
    effects: { 神识: 4, 悟性: 5, 修为: 12 },
    result: 'success'
  },
  {
    id: 'cultivation-wood-root-renewal',
    age: 0,
    type: 'cultivation',
    title: '草木回春',
    description: '你在林间静坐，草木生机与灵息互相牵引，连旧伤都淡了几分。',
    weight: 0.45,
    conditions: {
      spiritRootIds: [
        'wood-root',
        'dual-water-wood-root',
        'dual-wood-fire-root',
        'dual-wood-earth-root',
        'dual-metal-wood-root',
        'tiandao-root',
        'chaos-root'
      ]
    },
    effects: { 根骨: 4, 寿命: 1, 修为: 9 },
    result: 'success'
  },
  {
    id: 'cultivation-metal-root-edge',
    age: 0,
    type: 'cultivation',
    title: '金气淬锋',
    description: '金行灵机在经脉中凝成锋芒，淬骨如磨剑，痛楚之后根基更锐。',
    weight: 0.45,
    conditions: {
      spiritRootIds: [
        'metal-root',
        'dual-earth-metal-root',
        'dual-metal-water-root',
        'dual-fire-metal-root',
        'dual-metal-wood-root',
        'sword-root',
        'tiandao-root',
        'chaos-root'
      ]
    },
    effects: { 根骨: 5, 修为: 10 },
    result: 'success'
  },
  {
    id: 'cultivation-earth-root-foundation',
    age: 0,
    type: 'cultivation',
    title: '厚土载身',
    description: '土行灵机沉入丹田，像一方稳固台基，连修行资源也更容易积攒。',
    weight: 0.45,
    conditions: {
      spiritRootIds: [
        'earth-root',
        'dual-fire-earth-root',
        'dual-earth-metal-root',
        'dual-wood-earth-root',
        'dual-earth-water-root',
        'tiandao-root',
        'chaos-root'
      ]
    },
    effects: { 根骨: 5, 家境: 1, 修为: 7 },
    result: 'success'
  },
  {
    id: 'cultivation-mutated-root-resonance',
    age: 0,
    type: 'cultivation',
    title: '异灵共鸣',
    description: '异种灵机忽然与天地相应，剑鸣、雷光、风息或寒霜在心神中一闪而过。',
    weight: 0.35,
    conditions: { spiritRootIds: ['sword-root', 'thunder-root', 'wind-root', 'ice-root'] },
    effects: { 神识: 3, 悟性: 4, 气运: 4, 修为: 12 },
    result: 'success'
  },
  {
    id: 'cultivation-mixed-root-balance',
    age: 0,
    type: 'cultivation',
    title: '五气调和',
    description: '驳杂灵机没有拖住你，反而在耐心梳理后形成了稳固的内息。',
    weight: 0.5,
    conditions: { spiritRootIds: ['three-mixed-root', 'four-mixed-root', 'five-mixed-root'] },
    effects: { 根骨: 4, 神识: 2, 悟性: 2, 修为: 7 },
    result: 'success'
  },
  {
    id: 'cultivation-wrong-method',
    age: 0,
    type: 'cultivation',
    title: '功法错解',
    description: '你把功法中一处关窍理解偏了，数月苦修反而让灵息滞涩。',
    weight: 0.8,
    effects: { 神识: -2, 悟性: -3, 修为: -7 },
    result: 'failure'
  },
  {
    id: 'cultivation-overstrain',
    age: 0,
    type: 'cultivation',
    title: '闭关过久',
    description: '连续闭关让你精神枯竭，修为虽有所得，身体却难免受损。',
    weight: 0.65,
    effects: { 修为: 8, 寿命: -2 },
    result: 'neutral'
  },
  {
    id: 'cultivation-marrow-washing',
    age: 0,
    type: 'cultivation',
    title: '洗髓小成',
    description: '你用数月时间调整呼吸与药浴，体内杂质渐渐排出，根骨有了实打实的进益。',
    weight: 0.85,
    conditions: { minRealmLevel: 2 },
    effects: { 根骨: 6, 气运: 2, 修为: 6, 家境: -2 },
    result: 'success'
  },
  {
    id: 'cultivation-breath-counting',
    age: 0,
    type: 'cultivation',
    title: '数息入定',
    description: '你一呼一吸数过千遍，杂念渐少，灵息也不再四处散乱。',
    weight: 0.95,
    effects: { 神识: 4, 悟性: 2, 修为: 6 },
    result: 'success'
  },
  {
    id: 'cultivation-meridian-knot',
    age: 0,
    type: 'cultivation',
    title: '经脉郁结',
    description: '一段灵气卡在关窍之间，反复冲开无果，连心神都被磨得焦躁。',
    weight: 0.6,
    effects: { 神识: -2, 修为: -6, 寿命: -1 },
    result: 'failure'
  },
  {
    id: 'cultivation-star-chart',
    age: 0,
    type: 'cultivation',
    title: '观星参诀',
    description: '你对照星图推演功法脉络，许多原本散乱的术理渐渐归位。',
    weight: 0.45,
    conditions: { minRealmLevel: 3 },
    effects: { 神识: 4, 悟性: 6, 修为: 9 },
    result: 'success'
  },
  {
    id: 'cultivation-thunder-root-quench',
    age: 0,
    type: 'cultivation',
    title: '雷息锻脉',
    description: '雷行灵机在经脉里炸开细碎电光，痛得彻骨，却把根基锤炼得更硬。',
    weight: 0.35,
    conditions: { spiritRootIds: ['thunder-root', 'tiandao-root', 'chaos-root'] },
    effects: { 根骨: 6, 神识: 3, 修为: 11, 寿命: -1 },
    result: 'success'
  },
  {
    id: 'cultivation-void-tide',
    age: 0,
    type: 'cultivation',
    title: '虚潮洗神',
    description: '入夜之后虚空潮声隐隐，你以神识相迎，几乎被卷入无边空寂。',
    weight: 0.3,
    conditions: { minRealmLevel: 5 },
    effects: { 神识: 7, 悟性: 4, 修为: 15, 寿命: -1 },
    result: 'success'
  },

  {
    id: 'combat-beast-hunt',
    age: 0,
    type: 'combat',
    title: '猎杀妖兽',
    description: '山中妖兽扰人清修，你提气入林，与其周旋半日后终于寻到破绽。',
    weight: 0.85,
    effects: { 根骨: 4, 神识: 2, 家境: 1, 修为: 14 },
    result: 'success'
  },
  {
    id: 'combat-caravan-escort',
    age: 0,
    type: 'combat',
    title: '护送商队',
    description: '坊市商队请你随行护送，一路妖影窥伺，正好磨炼实战手段。',
    weight: 0.7,
    conditions: { attributes: { 家境: 12 } },
    effects: { 家境: 2, 颜值: 2, 修为: 12 },
    result: 'success'
  },
  {
    id: 'combat-arena-duel',
    age: 0,
    type: 'combat',
    title: '同门斗法',
    description: '宗门擂台上，你与同门切磋斗法，胜负之外，更重要的是看清自身短板。',
    weight: 0.75,
    conditions: { minRealmLevel: 2 },
    effects: { 根骨: 3, 神识: 3, 颜值: 2, 修为: 13 },
    result: 'success'
  },
  {
    id: 'combat-demonic-cultivator',
    age: 0,
    type: 'combat',
    title: '斩除邪修',
    description: '邪修伏于荒庙，以血法害人。你趁其法阵未成，强行破局。',
    weight: 0.55,
    conditions: { minRealmLevel: 2 },
    effects: { 神识: 3, 气运: 3, 家境: 2, 修为: 16 },
    result: 'success'
  },
  {
    id: 'combat-sword-contest',
    age: 0,
    type: 'combat',
    title: '剑意相争',
    description: '你遇到一名剑意凌厉的修士，对方邀你试剑，锋芒相撞间灵机大开。',
    weight: 0.45,
    conditions: { spiritRootIds: ['sword-root', 'metal-root', 'tiandao-root', 'chaos-root'] },
    effects: { 根骨: 5, 神识: 2, 修为: 16 },
    result: 'success'
  },
  {
    id: 'combat-ancient-beast',
    age: 0,
    type: 'combat',
    title: '古兽遗种',
    description: '秘境深处伏着一头古兽遗种，气血如炉。你几乎拼尽全力才从爪下脱身。',
    weight: 0.35,
    conditions: { minRealmLevel: 4 },
    effects: { 根骨: 7, 神识: 5, 修为: 18, 寿命: -1 },
    result: 'success'
  },
  {
    id: 'combat-ambush',
    age: 0,
    type: 'combat',
    title: '半路遇伏',
    description: '归途中杀机骤起，数道术法封住退路，你被迫仓促应战。',
    weight: 0.45,
    conditions: { minRealmLevel: 2 },
    effects: { 寿命: -2, 修为: -10, 家境: -3 },
    result: 'failure'
  },
  {
    id: 'combat-heart-devil',
    age: 0,
    type: 'combat',
    title: '心魔交锋',
    description: '战至酣处，心魔趁血气翻涌而起，你不得不在识海中再斗一场。',
    weight: 0.35,
    conditions: { minRealmLevel: 3 },
    effects: { 神识: -5, 悟性: -2, 修为: -8, 寿命: -1 },
    result: 'failure'
  },
  {
    id: 'combat-bandit-camp',
    age: 0,
    type: 'combat',
    title: '清剿山匪',
    description: '山匪借修士名头盘踞险道，你接下悬赏，趁夜破开寨门。',
    weight: 0.75,
    effects: { 根骨: 2, 家境: 2, 修为: 10 },
    result: 'success'
  },
  {
    id: 'combat-mine-fiend',
    age: 0,
    type: 'combat',
    title: '矿洞妖影',
    description: '灵矿深处有妖影出没，矿工不敢下井，你提灯入洞，听见爪声贴壁而来。',
    weight: 0.55,
    conditions: { minRealmLevel: 2 },
    effects: { 根骨: 3, 神识: 3, 家境: 2, 修为: 13 },
    result: 'success'
  },
  {
    id: 'combat-ghost-market-raid',
    age: 0,
    type: 'combat',
    title: '夜市缉凶',
    description: '鬼市散场时有人夺宝遁走，你循着残香追入长街阴影。',
    weight: 0.45,
    conditions: { minRealmLevel: 3 },
    effects: { 神识: 4, 气运: 2, 家境: 2, 修为: 14 },
    result: 'success'
  },
  {
    id: 'combat-tribulation-beast',
    age: 0,
    type: 'combat',
    title: '劫兽窥关',
    description: '一头沾染雷劫气息的异兽盯上你的洞府，若不击退，闭关必受其扰。',
    weight: 0.3,
    conditions: { minRealmLevel: 5 },
    effects: { 根骨: 6, 神识: 5, 气运: 3, 修为: 18, 寿命: -1 },
    result: 'success'
  },

  {
    id: 'encounter-secret-manual',
    age: 0,
    type: 'encounter',
    title: '残卷秘笈',
    description: '你在山洞石缝中发现半卷古旧功法，虽然残缺，却字字有灵。',
    weight: 0.8,
    effects: { 悟性: 5, 气运: 1, 修为: 7 },
    result: 'success'
  },
  {
    id: 'encounter-master',
    age: 0,
    type: 'encounter',
    title: '高人指路',
    description: '云游高人见你还算诚恳，点破了你修炼中最大的误区。',
    weight: 0.65,
    effects: { 根骨: 6, 悟性: 3, 修为: 9 },
    result: 'success'
  },
  {
    id: 'encounter-treasure',
    age: 0,
    type: 'encounter',
    title: '古修遗迹',
    description: '荒山深处露出一角石门，你从古修遗迹中带回了灵材与旧闻。',
    weight: 0.55,
    effects: { 气运: 5, 家境: 2, 修为: 6 },
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
    effects: { 气运: 4, 颜值: 3, 修为: 5 },
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
    effects: { 神识: 4, 悟性: 5, 气运: 3, 修为: 12 },
    result: 'success'
  },
  {
    id: 'encounter-lost-child',
    age: 0,
    type: 'encounter',
    title: '山路救人',
    description: '你救下误入深山的孩童，虽耽误修炼，却为自己积下一点善缘。',
    weight: 0.8,
    effects: { 气运: 3, 颜值: 3, 修为: -2 },
    result: 'neutral'
  },
  {
    id: 'encounter-beauty-repute',
    age: 0,
    type: 'encounter',
    title: '清名远扬',
    description: '你行事端正，被路过修士记下一段佳话，外人提起你时也多了几分好感。',
    weight: 0.7,
    effects: { 颜值: 5, 气运: 1 },
    result: 'success'
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
    id: 'encounter-hidden-spring',
    age: 0,
    type: 'encounter',
    title: '幽泉洗尘',
    description: '你在石壁后发现一眼幽泉，泉水清寒，能洗去经脉里的细小浊气。',
    weight: 0.6,
    effects: { 根骨: 4, 神识: 2, 修为: 6 },
    result: 'success'
  },
  {
    id: 'encounter-starry-ferry',
    age: 0,
    type: 'encounter',
    title: '星河渡舟',
    description: '夜半河上飘来无人小舟，你登舟片刻，仿佛看见漫天星斗倒流。',
    weight: 0.38,
    conditions: { attributes: { 气运: 28 } },
    effects: { 气运: 4, 悟性: 4, 修为: 8 },
    result: 'success'
  },
  {
    id: 'encounter-merchant-legacy',
    age: 0,
    type: 'encounter',
    title: '故商遗赠',
    description: '一位曾受你照拂的老商人托人送来遗物，匣中灵石不多，情义却重。',
    weight: 0.5,
    conditions: { attributes: { 颜值: 18 } },
    effects: { 家境: 2, 气运: 2, 颜值: 1 },
    result: 'success'
  },
  {
    id: 'encounter-ruined-altar',
    age: 0,
    type: 'encounter',
    title: '荒坛低语',
    description: '废弃祭坛下传来若有若无的低语，像是在许诺机缘，也像是在索取代价。',
    weight: 0.42,
    conditions: { minRealmLevel: 2 },
    effects: { 神识: 5, 气运: 3, 修为: 8, 寿命: -1 },
    result: 'neutral'
  },

  {
    id: 'social-partner',
    age: 0,
    type: 'social',
    title: '遇见知己',
    description: '修仙路上难得遇到志同道合之人，一番长谈后心境舒展。',
    weight: 0.9,
    effects: { 气运: 3, 颜值: 3, 修为: 3 },
    result: 'success'
  },
  {
    id: 'social-brother',
    age: 0,
    type: 'social',
    title: '结义同修',
    description: '几位同道与你结义相扶，往后行走坊市与宗门都多了照应。',
    weight: 0.7,
    effects: { 气运: 2, 颜值: 3, 家境: 1 },
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
    effects: { 家境: 2, 气运: 2, 颜值: 4 },
    result: 'success'
  },
  {
    id: 'social-tea-gathering',
    age: 0,
    type: 'social',
    title: '茶会论道',
    description: '你在小茶会上从容应答，谈吐与气度都给同道留下了不错印象。',
    weight: 0.9,
    effects: { 颜值: 4, 神识: 1, 悟性: 2, 修为: 2 },
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
    effects: { 气运: 5, 修为: 8, 寿命: 1 },
    result: 'success'
  },
  {
    id: 'social-old-friend',
    age: 0,
    type: 'social',
    title: '故友来访',
    description: '多年未见的故友带酒登门，两人谈起旧事，也交换了近来的修行见闻。',
    weight: 0.75,
    effects: { 神识: 2, 颜值: 2, 修为: 3 },
    result: 'success'
  },
  {
    id: 'social-debt-of-gratitude',
    age: 0,
    type: 'social',
    title: '人情回响',
    description: '昔日一句援手如今有了回音，有人替你引荐了一条不错的门路。',
    weight: 0.55,
    conditions: { attributes: { 气运: 18 } },
    effects: { 家境: 1, 气运: 2, 颜值: 2 },
    result: 'success'
  },
  {
    id: 'social-misread-intent',
    age: 0,
    type: 'social',
    title: '会错人意',
    description: '一次本该简单的寒暄被人误解，场面尴尬，你也平白添了些口舌。',
    weight: 0.55,
    effects: { 颜值: -3, 气运: -1, 修为: -2 },
    result: 'failure'
  },

  {
    id: 'disaster-beast-attack',
    age: 0,
    type: 'disaster',
    title: '妖兽袭山',
    description: '妖兽趁夜袭来，你拼命突围，身上留下了难以轻易消去的伤痕。',
    weight: 0.75,
    effects: { 寿命: -3, 根骨: -4, 修为: -6 },
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
    effects: { 神识: -4, 悟性: -4, 修为: -10, 寿命: -2 },
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
    effects: { 寿命: -6, 根骨: -6, 修为: -12 },
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
    effects: { 寿命: -4, 根骨: -3, 神识: -2, 悟性: -1 },
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
    effects: { 寿命: -3, 神识: -3, 悟性: -3, 修为: -8 },
    result: 'failure'
  },
  {
    id: 'disaster-meridian-backlash',
    age: 0,
    type: 'disaster',
    title: '灵气逆冲',
    description: '闭关时灵气忽然逆冲上行，几处经脉如被针火同时刺穿。',
    weight: 0.6,
    effects: { 根骨: -3, 神识: -2, 修为: -8, 寿命: -2 },
    result: 'failure'
  },
  {
    id: 'disaster-spirit-stone-collapse',
    age: 0,
    type: 'disaster',
    title: '灵矿塌陷',
    description: '你投下资源的灵矿忽然塌陷，账面亏损之外，还牵出不少麻烦。',
    weight: 0.42,
    conditions: { attributes: { 家境: 18 } },
    effects: { 家境: -7, 气运: -2, 修为: -3 },
    result: 'failure'
  },
  {
    id: 'disaster-beauty-jealousy',
    age: 0,
    type: 'disaster',
    title: '风评招妒',
    description: '你的清名惹来旁人嫉恨，几句恶言传开，连合作都变得迟疑。',
    weight: 0.4,
    conditions: { attributes: { 颜值: 35 } },
    effects: { 颜值: -4, 气运: -3, 家境: -2 },
    result: 'failure'
  },
  {
    id: 'disaster-old-wound',
    age: 0,
    type: 'disaster',
    title: '旧伤复发',
    description: '多年前留下的暗伤在阴雨夜复发，你不得不提前结束闭关。',
    weight: 0.45,
    conditions: { minRealmLevel: 3 },
    effects: { 寿命: -3, 根骨: -3, 修为: -9 },
    result: 'failure'
  },

  {
    id: 'daily-meditation',
    age: 0,
    type: 'daily',
    title: '静室打坐',
    description: '这一年没有大事，你安静打坐，慢慢把零散灵气归入丹田。',
    weight: 1.4,
    effects: { 修为: 6, 悟性: 1, 根骨: 2 },
    result: 'success'
  },
  {
    id: 'daily-morning-exercise',
    age: 0,
    type: 'daily',
    title: '晨起练形',
    description: '你每日天未亮便在山前练形，动作看似朴拙，却一点点打磨筋骨。',
    weight: 1.2,
    effects: { 根骨: 4, 修为: 3 },
    result: 'success'
  },
  {
    id: 'daily-merchant',
    age: 0,
    type: 'daily',
    title: '坊市淘宝',
    description: '你在坊市角落淘到一件不起眼的小物，细看才知并非凡品。',
    weight: 1,
    effects: { 家境: 1, 气运: 2 },
    result: 'success'
  },
  {
    id: 'daily-elixir',
    age: 0,
    type: 'daily',
    title: '炉火微明',
    description: '你守着丹炉反复试错，终于炼出一炉可用的丹药。',
    weight: 0.8,
    effects: { 神识: 2, 悟性: 3, 家境: 1, 修为: 4 },
    result: 'success'
  },
  {
    id: 'daily-visit-family',
    age: 0,
    type: 'daily',
    title: '回望凡尘',
    description: '你回到旧日故乡，凡尘牵挂让心神柔软，也让脚步慢了半拍。',
    weight: 0.7,
    effects: { 颜值: 3, 气运: 1, 修为: -2 },
    result: 'neutral'
  },
  {
    id: 'daily-grooming',
    age: 0,
    type: 'daily',
    title: '整肃仪容',
    description: '你整理衣冠、收敛浮躁，虽不是什么大机缘，却让气质更清朗。',
    weight: 1,
    effects: { 颜值: 4 },
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
    effects: { 寿命: -1, 修为: -3 },
    result: 'failure'
  },
  {
    id: 'daily-clean-altar',
    age: 0,
    type: 'daily',
    title: '洒扫香案',
    description: '你把洞府香案擦拭干净，换上清水与新香，心境也跟着清爽几分。',
    weight: 1,
    effects: { 神识: 1, 气运: 1, 修为: 2 },
    result: 'neutral'
  },
  {
    id: 'daily-letter-home',
    age: 0,
    type: 'daily',
    title: '寄信归家',
    description: '你写信问候旧日亲友，凡尘牵挂未必拖累修行，也能让人心安定。',
    weight: 0.75,
    effects: { 家境: 1, 颜值: 2, 修为: -1 },
    result: 'neutral'
  },
  {
    id: 'daily-market-rain',
    age: 0,
    type: 'daily',
    title: '雨中坊市',
    description: '细雨里坊市人少，你慢慢逛过摊位，竟发现几样合用的小物。',
    weight: 0.75,
    effects: { 家境: 1, 悟性: 1, 气运: 1 },
    result: 'success'
  },

  {
    id: 'resource-spirit-stone-vein',
    age: 0,
    type: 'resource',
    title: '发现灵脉',
    description: '你在荒岭下发现一条细小灵脉，虽不能独占，却足够换来许多资源。',
    weight: 0.55,
    effects: { 家境: 2, 气运: 2, 修为: 5 },
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
    effects: { 家境: -4, 根骨: 6, 神识: 1, 气运: 1, 修为: 8 },
    result: 'success'
  },
  {
    id: 'resource-tempering-medicine',
    age: 0,
    type: 'resource',
    title: '购得淬骨药',
    description: '你花去一笔灵石换来淬骨药材，药性猛烈，但确实能补足肉身短板。',
    weight: 0.75,
    conditions: { attributes: { 家境: 12 } },
    effects: { 家境: -3, 根骨: 6, 颜值: 1 },
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
    id: 'resource-market-errand',
    age: 0,
    type: 'resource',
    title: '坊市跑腿',
    description: '你替坊市掌柜送了几趟货，事情琐碎，却换来一笔踏实的灵石进账。',
    weight: 0.85,
    effects: { 家境: 2, 修为: -1 },
    result: 'success'
  },
  {
    id: 'resource-cave-herbs',
    age: 0,
    type: 'resource',
    title: '洞府药圃',
    description: '洞府边缘的药圃终于长成一批灵草，品相不高，但足以贴补日常修行。',
    weight: 0.75,
    conditions: { minRealmLevel: 2 },
    effects: { 家境: 2, 根骨: 2 },
    result: 'success'
  },
  {
    id: 'resource-ledger-clear',
    age: 0,
    type: 'resource',
    title: '旧账理清',
    description: '你翻检往来账册，追回几笔被拖欠的灵石，人情往来反倒更清楚了。',
    weight: 0.65,
    conditions: { attributes: { 悟性: 18 } },
    effects: { 家境: 2, 神识: 1, 悟性: 1 },
    result: 'success'
  },
  {
    id: 'resource-patron',
    age: 0,
    type: 'resource',
    title: '贵人资助',
    description: '有人看重你的潜力，愿意供给一批修炼资源，只求日后结个善缘。',
    weight: 0.35,
    conditions: { attributes: { 气运: 30 } },
    effects: { 家境: 2, 修为: 7 },
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
    effects: { 神识: 4, 悟性: 4, 家境: 2, 气运: 1, 修为: 12 },
    result: 'success'
  },
  {
    id: 'resource-spirit-field-harvest',
    age: 0,
    type: 'resource',
    title: '灵田收成',
    description: '租来的小片灵田终于有了收成，虽称不上暴富，也够支撑一段清修。',
    weight: 0.75,
    effects: { 家境: 2, 根骨: 1, 修为: 3 },
    result: 'success'
  },
  {
    id: 'resource-alchemy-contract',
    age: 0,
    type: 'resource',
    title: '丹房短契',
    description: '丹房缺人照看火候，你接下一纸短契，辛苦几月换来丹药分润。',
    weight: 0.6,
    conditions: { attributes: { 神识: 18 } },
    effects: { 家境: 2, 神识: 2, 修为: 4 },
    result: 'success'
  },
  {
    id: 'resource-mine-share',
    age: 0,
    type: 'resource',
    title: '灵矿分润',
    description: '你入股的小矿脉出了几块好料，分到手的灵石让修行安排宽裕许多。',
    weight: 0.4,
    conditions: { attributes: { 家境: 28 }, minRealmLevel: 2 },
    effects: { 家境: 4, 气运: 2, 修为: 5 },
    result: 'success'
  },
  {
    id: 'resource-failed-investment',
    age: 0,
    type: 'resource',
    title: '投错门路',
    description: '你轻信一桩看似稳妥的买卖，等回过神来，对方早已卷走灵石。',
    weight: 0.5,
    conditions: { attributes: { 家境: 15 } },
    effects: { 家境: -6, 悟性: 1, 修为: -3 },
    result: 'failure'
  },

  {
    id: 'mind-script-copying',
    age: 0,
    type: 'mind',
    title: '抄经养心',
    description: '你每日抄写道经，笔画从浮躁渐渐落到沉静。',
    weight: 0.9,
    effects: { 神识: 3, 悟性: 4, 修为: 4 },
    result: 'success'
  },
  {
    id: 'mind-dao-heart-clear',
    age: 0,
    type: 'mind',
    title: '道心澄明',
    description: '一场纷争后，你没有随怒意走偏，反而看清了自己的修行所求。',
    weight: 0.65,
    effects: { 神识: 3, 悟性: 4, 气运: 2, 修为: 6 },
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
    effects: { 神识: 5, 悟性: 5, 修为: 12 },
    result: 'success'
  },
  {
    id: 'mind-vanity',
    age: 0,
    type: 'mind',
    title: '名声所累',
    description: '外界称赞让你心中生出浮气，几次修炼都难以真正入定。',
    weight: 0.55,
    effects: { 神识: -2, 悟性: -3, 修为: -6 },
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
    effects: { 神识: 4, 悟性: 4, 修为: 9, 寿命: 1 },
    result: 'success'
  },
  {
    id: 'mind-sutra-debate',
    age: 0,
    type: 'mind',
    title: '经义辩难',
    description: '你与同道围绕一句经义争论到深夜，言辞往复间反而照见盲点。',
    weight: 0.65,
    effects: { 神识: 3, 悟性: 4, 修为: 4 },
    result: 'success'
  },
  {
    id: 'mind-old-vow',
    age: 0,
    type: 'mind',
    title: '旧誓在心',
    description: '你想起踏上修仙路时许下的誓愿，躁动心绪慢慢沉回原处。',
    weight: 0.55,
    effects: { 神识: 2, 气运: 2, 修为: 5 },
    result: 'success'
  },
  {
    id: 'mind-nightmare-script',
    age: 0,
    type: 'mind',
    title: '梦魇残文',
    description: '梦里反复出现一篇残缺经文，醒来后你头痛欲裂，却记住了几处玄妙。',
    weight: 0.42,
    conditions: { minRealmLevel: 3 },
    effects: { 神识: -2, 悟性: 5, 修为: 6, 寿命: -1 },
    result: 'neutral'
  },

  {
    id: 'sect-mission',
    age: 0,
    type: 'sect',
    title: '宗门任务',
    description: '你接下宗门任务，奔走数月后换回了丹药、灵石和一点评价。',
    weight: 0.9,
    effects: { 家境: 1, 气运: 2, 修为: 4 },
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
    effects: { 根骨: 5, 家境: 2, 神识: 1, 气运: 1, 修为: 8 },
    result: 'success'
  },
  {
    id: 'sect-etiquette',
    age: 0,
    type: 'sect',
    title: '礼仪课业',
    description: '宗门长辈教你收束言行与仪态，繁琐归繁琐，却让你更容易被人接纳。',
    weight: 0.75,
    effects: { 颜值: 5 },
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
    effects: { 神识: 4, 悟性: 5, 修为: 6 },
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
    effects: { 家境: 2, 修为: 9 },
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
    effects: { 气运: 5, 家境: 2, 神识: 2, 修为: 12 },
    result: 'success'
  },
  {
    id: 'sect-outer-help',
    age: 0,
    type: 'sect',
    title: '外门助役',
    description: '你帮外门弟子处理杂务，事情琐碎，却让宗门上下对你多了几分好感。',
    weight: 0.75,
    effects: { 颜值: 2, 家境: 1, 修为: 2 },
    result: 'success'
  },
  {
    id: 'sect-elder-private-lesson',
    age: 0,
    type: 'sect',
    title: '长老小课',
    description: '长老临时开了一场小课，只讲破境时最容易被忽略的细节。',
    weight: 0.45,
    conditions: { attributes: { 悟性: 25 }, minRealmLevel: 2 },
    effects: { 悟性: 4, 神识: 3, 修为: 7 },
    result: 'success'
  },
  {
    id: 'sect-refined-register',
    age: 0,
    type: 'sect',
    title: '名册进阶',
    description: '你的名字被挪入更高一档的宗门名册，月例资源也随之略有提升。',
    weight: 0.4,
    conditions: { attributes: { 根骨: 35, 气运: 25 }, minRealmLevel: 2 },
    effects: { 家境: 2, 颜值: 2, 修为: 6 },
    result: 'success'
  },
  {
    id: 'sect-mission-failure',
    age: 0,
    type: 'sect',
    title: '任务失手',
    description: '一次宗门任务出了纰漏，你虽无大错，却不得不承担一部分责罚。',
    weight: 0.55,
    conditions: { minRealmLevel: 2 },
    effects: { 家境: -3, 颜值: -2, 修为: -5 },
    result: 'failure'
  }
];

type PhaseId = 'mid' | 'late';

interface PhaseEventGroup {
  type: GameEvent['type'];
  titles: string[];
}

type PhaseEventDetailEntry = [
  title: string,
  description: string,
  effects: GameEvent['effects'],
  weight?: number,
  result?: GameEvent['result']
];

const midEventGroups: PhaseEventGroup[] = [
  {
    type: 'cultivation',
    titles: ['婴火温养', '神识游宫', '灵台映月', '元婴听潮', '虚室生白', '紫府开窗', '法相初摹', '玄窍回音', '星息入脉', '玉液还丹', '道胎轻鸣', '丹田生莲', '云篆入骨', '灵息归藏']
  },
  {
    type: 'encounter',
    titles: ['旧仙碑文', '月下灵舟', '古镜照魂', '洞天裂隙', '异香引路', '残阵藏珍', '白鹿衔芝', '云端棋局', '前贤留问', '沉湖玉匣']
  },
  {
    type: 'social',
    titles: ['元婴论交', '道侣问心', '宗外结盟', '旧敌和解', '名门拜帖', '云台清谈', '同道相邀', '远客赠礼']
  },
  {
    type: 'disaster',
    titles: ['婴火失控', '识海裂痛', '洞府走水', '灵债追索', '邪念缠身', '秘境塌陷', '旧怨伏杀', '丹毒入脉']
  },
  {
    type: 'daily',
    titles: ['温炉养息', '山门巡行', '静室观云', '灵茶入喉', '打理洞府', '祭炼小器', '檐下听雨', '晨钟醒神', '松间慢行', '雪夜抄经']
  },
  {
    type: 'resource',
    titles: ['灵脉分润', '丹阁赊药', '药圃扩建', '珍材易手', '矿契入账', '坊市暗拍', '灵舟跑商', '古器抵押', '洞府租契', '宗门赏赐']
  },
  {
    type: 'mind',
    titles: ['照见本心', '梦游紫府', '旧愿重燃', '心魔问答', '经义忽通', '观劫悟生', '静坐忘身', '灵台扫尘', '一念澄澈', '听雪明道']
  },
  {
    type: 'sect',
    titles: ['内殿议事', '长老点拨', '护法差遣', '秘库借阅', '宗门嘉奖', '执事考评', '法会讲席', '山门护阵', '同门推举', '客卿邀约']
  }
];

const midEventDetails = createPhaseEventDetails([
  ['婴火温养', '你将元婴火候收在丹田三寸处，慢慢烘去杂气。火势不能太猛，稍急便会灼伤经络。', { 修为: 13, 根骨: 10, 神识: 5 }, 1.02],
  ['神识游宫', '神识沿十二重灵宫巡行，所过之处旧日暗伤与杂念一并显形。', { 修为: 10, 神识: 13, 悟性: 5 }, 0.96],
  ['灵台映月', '你在静夜观月，灵台中浮出一轮清辉，许多纷杂念头都被照得分明。', { 修为: 11, 悟性: 11, 神识: 7 }, 0.92],
  ['元婴听潮', '闭关时耳边忽有潮声，元婴随潮汐吐纳，进退之间更懂得蓄势。', { 修为: 15, 根骨: 7, 气运: 6 }, 0.9],
  ['虚室生白', '静室空无一物，却在黎明前浮出一点白光。你守住那点光，心神慢慢沉稳下来。', { 修为: 9, 神识: 10, 悟性: 9 }, 0.88],
  ['紫府开窗', '紫府似有小窗洞开，外界灵机如细雨入室。你趁机重排周天次序。', { 修为: 14, 悟性: 14, 根骨: 4 }, 0.86],
  ['法相初摹', '你照着功法里的古图摹写法相轮廓，虽未成形，却让肉身与神识有了新的牵引。', { 修为: 12, 根骨: 11, 神识: 8 }, 0.84],
  ['玄窍回音', '一处久未开启的玄窍忽然回响，你顺着回音调息，找到此前漏掉的细微窍门。', { 修为: 10, 悟性: 12, 气运: 6 }, 0.82],
  ['星息入脉', '夜半星光落入经脉，灵气运行多了几分寒意，也多了几分锋利。', { 修为: 16, 根骨: 9, 神识: 7 }, 0.8],
  ['玉液还丹', '炉中玉液药性温润，你以元婴牵引药气回丹，补足一段亏空。', { 修为: 12, 根骨: 8, 家境: -2, 寿命: 1 }, 0.78],
  ['道胎轻鸣', '丹田深处似有道胎轻鸣，声音极细，却让你确认了下一段修行方向。', { 修为: 17, 悟性: 10, 气运: 8 }, 0.76],
  ['丹田生莲', '灵机在丹田结成莲影，花开一瞬便散入四肢百骸。', { 修为: 14, 根骨: 12, 气运: 5 }, 0.78],
  ['云篆入骨', '一枚云篆在梦中落入骨缝，你醒后按其笔意调息，筋骨更能承载灵压。', { 修为: 11, 根骨: 15, 悟性: 4 }, 0.74],
  ['灵息归藏', '你收束外放灵息，将浮躁的修为压回根基深处，进度慢些却更扎实。', { 修为: 8, 根骨: 8, 神识: 8, 悟性: 6 }, 0.9],

  ['旧仙碑文', '荒岭石碑半埋土中，碑文并非功法，却记录着一位古修失败的缘由。', { 修为: 7, 悟性: 11, 气运: 9 }, 0.62],
  ['月下灵舟', '月夜湖面有无主灵舟靠岸，舟舱里只剩一盏不灭青灯和几行航迹。', { 修为: 8, 气运: 13, 家境: 2 }, 0.6],
  ['古镜照魂', '古镜照不出容貌，只照出识海阴影。你忍着不适看完镜中变化。', { 修为: 6, 神识: 12, 悟性: 6, 气运: 4 }, 0.58],
  ['洞天裂隙', '山壁裂开一线洞天风，你只来得及探入半身，便被涌出的灵压推回。', { 修为: 12, 气运: 14, 根骨: 4 }, 0.56],
  ['异香引路', '一缕异香绕过山坳，似药似花。你循香而行，在枯木根下找到残留灵机。', { 修为: 7, 气运: 10, 根骨: 5, 家境: 1 }, 0.6],
  ['残阵藏珍', '废弃阵盘仍在微弱运转，阵心藏着珍材，但每一步都要踩准旧阵纹。', { 修为: 8, 悟性: 8, 气运: 8, 家境: 3 }, 0.54],
  ['白鹿衔芝', '白鹿衔着灵芝在林间停步，像是在试探你是否会强夺。你放缓气息，等它主动靠近。', { 修为: 6, 气运: 15, 颜值: 4, 寿命: 1 }, 0.52],
  ['云端棋局', '云端忽现残局，每落一子都牵动周遭灵气。你看懂三手，便不敢再贪。', { 修为: 9, 悟性: 13, 神识: 6 }, 0.5],
  ['前贤留问', '洞府墙上刻着前贤留问，问题看似简单，却逼你重新审视自己的道途。', { 修为: 5, 悟性: 10, 神识: 8, 气运: 5 }, 0.48],
  ['沉湖玉匣', '湖底玉匣被水草缠住，匣中不是宝物，而是一封写给后来人的劝诫。', { 修为: 8, 气运: 11, 家境: 2, 神识: 4 }, 0.5],

  ['元婴论交', '几位元婴修士围炉论道，话语温和，暗处却都在试探彼此根脚。', { 颜值: 8, 神识: 6, 家境: 2, 修为: 6 }, 0.56],
  ['道侣问心', '道侣问你若大道与旧情相冲该如何取舍。你没有立刻回答，而是认真想了一夜。', { 颜值: 10, 悟性: 7, 气运: 4, 修为: 4 }, 0.54],
  ['宗外结盟', '外宗递来结盟书，条件诱人，却也把你推到几方势力的视线里。', { 家境: 4, 颜值: 7, 气运: 5, 修为: 5 }, 0.52],
  ['旧敌和解', '旧敌带着赔礼登门，言辞低伏。你看得出他并非全无算计，却也未必不能化敌为用。', { 颜值: 9, 悟性: 6, 气运: 6 }, 0.5],
  ['名门拜帖', '名门世家送来拜帖，请你赴宴。席间每一句寒暄都像一枚轻轻落下的棋子。', { 颜值: 12, 家境: 3, 神识: 4 }, 0.48],
  ['云台清谈', '云台清谈不许动手，只以见识与气度分高下。你几次开口，都引来同道侧目。', { 颜值: 10, 悟性: 8, 修为: 4 }, 0.5],
  ['同道相邀', '一位同道邀你共探小秘境，报酬不高，却能拓宽人脉和见闻。', { 气运: 8, 颜值: 6, 家境: 2, 修为: 7 }, 0.46],
  ['远客赠礼', '远方客卿送来薄礼，礼轻却附着一段善意因果。', { 家境: 3, 气运: 8, 颜值: 5 }, 0.44],

  ['婴火失控', '婴火忽然冲出丹田，沿经脉逆烧。你强行镇压，仍被灼得气息虚浮。', { 寿命: -4, 根骨: -4, 修为: -8 }, 0.52],
  ['识海裂痛', '识海像被细针划开，旧日记忆与杂念一并涌出，神识难以收束。', { 寿命: -3, 神识: -5, 悟性: -2, 修为: -7 }, 0.5],
  ['洞府走水', '护炉童子一时失手，丹火烧穿禁制。你救下主炉，却损了不少资粮。', { 家境: -4, 根骨: -2, 修为: -6 }, 0.48],
  ['灵债追索', '早年欠下的人情债忽然被人追索，对方并不凶狠，却句句占理。', { 家境: -5, 颜值: -3, 修为: -5 }, 0.46],
  ['邪念缠身', '一缕邪念借梦境缠上元婴，白日醒来仍有阴冷余味。', { 寿命: -3, 神识: -4, 气运: -3, 修为: -8 }, 0.44],
  ['秘境塌陷', '秘境出口提前崩塌，你带着半数收获冲出裂缝，衣袍上满是碎石焦痕。', { 寿命: -5, 根骨: -3, 家境: -2, 修为: -7 }, 0.42],
  ['旧怨伏杀', '旧怨之人趁你外出布下伏杀。你虽逃脱，却不得不重新审视身边线索。', { 根骨: -4, 神识: -3, 颜值: -2, 修为: -6 }, 0.4],
  ['丹毒入脉', '一炉急用丹药药性不净，丹毒入脉后，你花了数日才压住反噬。', { 寿命: -4, 根骨: -3, 悟性: -2, 修为: -5 }, 0.44],

  ['温炉养息', '你守着小炉慢煮灵药，不急着吞服，只借药香温养气息。', { 修为: 6, 根骨: 5, 神识: 3 }, 0.9, 'neutral'],
  ['山门巡行', '你沿山门巡行一圈，顺手修补几处松动禁制，也听见不少同门闲谈。', { 修为: 5, 颜值: 4, 神识: 4 }, 0.86, 'neutral'],
  ['静室观云', '静室窗外云影缓慢游移，你随云影调息，心中躁气一点点沉下去。', { 修为: 5, 悟性: 5, 神识: 4 }, 0.84, 'neutral'],
  ['灵茶入喉', '一盏灵茶入口微苦，回甘时却让经脉里的滞涩松开几分。', { 修为: 7, 根骨: 4, 家境: -1 }, 0.82, 'neutral'],
  ['打理洞府', '你清点洞府阵旗与药圃，把杂乱多年的角落重新理顺。', { 家境: 2, 神识: 3, 修为: 4 }, 0.8, 'neutral'],
  ['祭炼小器', '你取出一件小法器反复祭炼，法器未必强大，却让手感更稳。', { 修为: 6, 悟性: 4, 根骨: 3, 家境: -1 }, 0.78, 'neutral'],
  ['檐下听雨', '雨声连绵，你在檐下听到灵气落地的细响，心境意外安宁。', { 神识: 5, 气运: 4, 修为: 4 }, 0.86, 'neutral'],
  ['晨钟醒神', '晨钟响彻山门，震散一夜昏沉。你借钟声重整识海。', { 神识: 6, 悟性: 3, 修为: 5 }, 0.82, 'neutral'],
  ['松间慢行', '你没有闭关，只在松间慢行半日。脚步慢下来后，许多事反而想通了。', { 悟性: 5, 气运: 4, 修为: 3 }, 0.8, 'neutral'],
  ['雪夜抄经', '雪夜清冷，你抄完半卷古经，指尖冻僵，心里却亮了一些。', { 悟性: 6, 神识: 4, 修为: 4 }, 0.78, 'neutral'],

  ['灵脉分润', '宗门重新划分灵脉份额，你分到一条细支脉，虽不惊人，却胜在长久。', { 家境: 4, 修为: 9, 根骨: 4 }, 0.66],
  ['丹阁赊药', '丹阁愿意赊给你一批温养丹药，但账册上的利息写得很清楚。', { 修为: 12, 根骨: 6, 家境: -3 }, 0.62],
  ['药圃扩建', '你把洞府后的药圃扩出两畦，灵土不够，只能先用阵法慢慢养。', { 家境: 3, 气运: 6, 根骨: 4, 修为: 6 }, 0.6],
  ['珍材易手', '坊市里有人急售珍材，你看出其中一味被低估，果断换下。', { 家境: 4, 悟性: 6, 气运: 5 }, 0.58],
  ['矿契入账', '一纸小矿契送到手中，每月分润不多，却能补上功法修炼的消耗。', { 家境: 5, 修为: 7, 神识: 3 }, 0.56],
  ['坊市暗拍', '暗拍会上灯光昏暗，卖家只报来历不报真名。你必须判断哪些是真货，哪些是饵。', { 家境: 4, 气运: 8, 悟性: 5 }, 0.54],
  ['灵舟跑商', '你随灵舟跑了一趟远市，路上风浪不小，账本却终于好看许多。', { 家境: 5, 气运: 5, 颜值: 3, 修为: 5 }, 0.52],
  ['古器抵押', '一件古器暂押在你手中，灵性微弱却来历可疑。你决定先封存观察。', { 家境: 4, 神识: 6, 气运: 4 }, 0.5],
  ['洞府租契', '你将闲置洞府租给外来修士，收得灵石，也多了几分人情往来。', { 家境: 6, 颜值: 4, 修为: 4 }, 0.52],
  ['宗门赏赐', '你完成一桩旧案后，宗门补发赏赐，虽不算厚重，却来得正是时候。', { 家境: 4, 修为: 10, 颜值: 5 }, 0.58],

  ['照见本心', '你在水镜前坐了一夜，镜中没有异象，只有自己不愿承认的犹豫。', { 神识: 11, 悟性: 7, 修为: 6 }, 0.72],
  ['梦游紫府', '梦中紫府辽阔如城，你沿空街行走，醒来仍记得几处门径。', { 神识: 13, 气运: 5, 修为: 7 }, 0.7],
  ['旧愿重燃', '年少时的一个愿望忽然浮上心头，它并未拖累你，反而提醒你为何修行。', { 悟性: 9, 气运: 7, 颜值: 3, 修为: 5 }, 0.68],
  ['心魔问答', '心魔没有动手，只问了三个问题。你答得不算漂亮，却没有逃避。', { 神识: 12, 悟性: 8, 修为: 5 }, 0.64],
  ['经义忽通', '旧经里一句看似平常的注解忽然贯通上下文，许多功法细节都变得顺眼。', { 悟性: 14, 神识: 5, 修为: 8 }, 0.66],
  ['观劫悟生', '远处有人渡劫失败，雷光散尽后山野重归寂静。你在震动中悟到生灭无常。', { 悟性: 10, 神识: 8, 寿命: 1, 修为: 6 }, 0.62],
  ['静坐忘身', '久坐之后，你短暂忘却身形，只剩一线清明守住灵台。', { 神识: 14, 根骨: 3, 修为: 7 }, 0.6],
  ['灵台扫尘', '你逐念清理灵台尘垢，每扫去一念，元婴便轻上一分。', { 神识: 10, 悟性: 6, 气运: 5, 修为: 6 }, 0.62],
  ['一念澄澈', '纷乱之事忽然归于一念，你不再纠缠枝节，修行也随之顺了。', { 悟性: 12, 气运: 8, 修为: 8 }, 0.58],
  ['听雪明道', '雪落无声，你却像听见天地换气。寒意里，道心更清。', { 神识: 9, 悟性: 9, 气运: 4, 修为: 5 }, 0.6],

  ['内殿议事', '内殿议事牵涉数条灵脉归属，你发言不多，却把关键利害说清了。', { 颜值: 5, 神识: 7, 家境: 3, 修为: 6 }, 0.68],
  ['长老点拨', '长老没有讲大道理，只指出你功法里一个常被忽略的细节。', { 悟性: 8, 神识: 6, 修为: 8 }, 0.66],
  ['护法差遣', '宗门派你为同门闭关护法，表面清闲，实则要时刻防备灵压外泄。', { 神识: 8, 根骨: 5, 颜值: 4, 修为: 7 }, 0.64],
  ['秘库借阅', '你获得半日秘库借阅权，时间太短，只能在几卷旧册中迅速取舍。', { 悟性: 10, 神识: 5, 家境: -1, 修为: 6 }, 0.62],
  ['宗门嘉奖', '一纸嘉奖贴在山门榜上，奖励不算夸张，却让许多人重新认识了你。', { 颜值: 9, 家境: 3, 气运: 4, 修为: 5 }, 0.6],
  ['执事考评', '执事考评不看一时勇武，更看你这几年是否稳住了自己的位置。', { 颜值: 6, 悟性: 5, 家境: 2, 修为: 6 }, 0.58],
  ['法会讲席', '法会上你被请去讲一段心得，讲给别人听时，自己也重新理顺了脉络。', { 颜值: 7, 悟性: 7, 神识: 4, 修为: 5 }, 0.56],
  ['山门护阵', '护山大阵需要重新校准，你负责其中一段阵脚，半日里不敢有丝毫分神。', { 神识: 9, 根骨: 4, 家境: 2, 修为: 7 }, 0.58],
  ['同门推举', '同门推举你执掌一项事务，权责随之而来，修行也多了些牵绊。', { 颜值: 8, 家境: 3, 气运: 4, 修为: 4 }, 0.54],
  ['客卿邀约', '外宗客卿席位送到案前，你暂不应下，却借机看清了自己的分量。', { 家境: 4, 颜值: 6, 悟性: 5, 修为: 5 }, 0.52]
]);

const lateEventGroups: PhaseEventGroup[] = [
  {
    type: 'cultivation',
    titles: ['合体归元', '天人一息', '大乘观空', '雷池洗骨', '星河入体', '法域重塑', '万象归藏', '道纹自生', '虚天炼魄', '劫前静坐']
  },
  {
    type: 'encounter',
    titles: ['天外残星', '上古道场', '仙人遗问', '九霄风眼', '龙眠古泽', '不周碎石', '天门倒影', '玄黄古井', '归墟潮声']
  },
  {
    type: 'social',
    titles: ['诸宗会盟', '大能论道', '旧友证道', '天骄来拜', '道侣共劫', '门人托付', '故人归尘']
  },
  {
    type: 'disaster',
    titles: ['天机反噬', '劫云早现', '法域崩角', '道伤复燃', '天魔窥梦', '气运倒卷', '寿火摇曳']
  },
  {
    type: 'daily',
    titles: ['云海闭目', '劫前焚香', '观霞养神', '扫坛定心', '夜读仙箓', '听风入定', '守炉一夜']
  },
  {
    type: 'resource',
    titles: ['仙材入库', '大宗供奉', '古宝重炼', '星砂成器', '雷竹收获', '洞天税契', '天阶丹成', '护劫阵材']
  },
  {
    type: 'mind',
    titles: ['大梦千年', '忘我观劫', '道心映天', '一念万里', '斩念留真', '听雷悟命', '心灯不灭', '天门自问']
  },
  {
    type: 'sect',
    titles: ['太上议席', '宗门托孤', '护山大阵', '飞升观礼', '道统传承']
  }
];

const lateEventDetails = createPhaseEventDetails([
  ['合体归元', '你将法身、元婴与肉身重新归于一息，任何细微错位都会在经脉深处放大成震荡。', { 修为: 20, 根骨: 18, 神识: 10 }, 0.92],
  ['天人一息', '闭关数月后，你短暂与天地同呼吸。那一息极轻，却让大道纹理贴近了许多。', { 修为: 18, 悟性: 18, 气运: 8 }, 0.88],
  ['大乘观空', '你观想万物皆空，却不能让心也空掉。虚无边缘，仍需留下一点自我。', { 修为: 16, 神识: 20, 悟性: 8 }, 0.84],
  ['雷池洗骨', '你引雷池余电洗炼骨髓，雷光入体时几乎将旧伤与旧我一并劈开。', { 修为: 22, 根骨: 22, 寿命: -1 }, 0.78],
  ['星河入体', '星光如长河倒灌，经脉一夜间亮起万点寒芒，神识也随之铺展。', { 修为: 24, 神识: 14, 气运: 12 }, 0.76],
  ['法域重塑', '你的法域边界出现裂纹，重塑过程缓慢而危险，却能修正早年根基里的偏差。', { 修为: 20, 悟性: 16, 根骨: 10 }, 0.74],
  ['万象归藏', '诸般术法异象被你一一收入体内，不再外显锋芒，只化作更深的底蕴。', { 修为: 18, 神识: 16, 根骨: 12 }, 0.78],
  ['道纹自生', '静坐时皮肤下浮出细小道纹，像天地借你的身躯写下一段注脚。', { 修为: 21, 悟性: 20, 气运: 8 }, 0.72],
  ['虚天炼魄', '你以虚天寒意锤炼神魂，魂魄每凝实一分，寿火便被风吹得摇晃一分。', { 修为: 19, 神识: 22, 寿命: -1 }, 0.7],
  ['劫前静坐', '劫云尚远，你先把一切杂务按下，只在蒲团上数自己的呼吸。', { 修为: 14, 神识: 12, 悟性: 12, 气运: 10 }, 0.9],

  ['天外残星', '一枚天外残星坠在荒原，星壳尚热。你剥开外层焦石，听见里面微弱的天音。', { 修为: 12, 气运: 24, 神识: 8 }, 0.58],
  ['上古道场', '残破道场只剩半座讲坛，坛下却仍压着当年听道者留下的执念。', { 修为: 14, 悟性: 20, 家境: 5 }, 0.56],
  ['仙人遗问', '石壁上留着一句仙人遗问，问题不求答案，只逼你确认自己愿意舍弃什么。', { 悟性: 22, 神识: 12, 气运: 8 }, 0.52],
  ['九霄风眼', '九霄风眼中灵压翻涌，你只取了最外层一缕清风，便险些被卷去半身灵力。', { 修为: 16, 根骨: 12, 气运: 14 }, 0.5],
  ['龙眠古泽', '古泽深处有龙影沉睡，鳞息化作水雾。你不敢惊醒它，只悄悄收走一段泽气。', { 气运: 20, 神识: 10, 寿命: 1 }, 0.48],
  ['不周碎石', '不周碎石沉重得不像凡物，你搬动一寸，体内法力便被压低一寸。', { 根骨: 18, 悟性: 8, 家境: 4, 修为: 10 }, 0.46],
  ['天门倒影', '湖面映出天门倒影，门内没有仙人，只有你未来可能走错的几条路。', { 神识: 18, 悟性: 12, 气运: 8 }, 0.48],
  ['玄黄古井', '古井中浮出玄黄气，气息厚重，似能补命，也似会压住道途。', { 根骨: 14, 气运: 16, 寿命: 1, 修为: 8 }, 0.44],
  ['归墟潮声', '归墟潮声从极远处传来，像万物终点的回响。你只听片刻，心神便沉入深海。', { 神识: 20, 悟性: 10, 修为: 10 }, 0.42],

  ['诸宗会盟', '诸宗会盟上没有一句废话，每一次点头都可能换来一条灵脉，也可能欠下一段因果。', { 家境: 6, 颜值: 14, 神识: 8, 修为: 8 }, 0.52],
  ['大能论道', '几位大能论道时语气平淡，字里行间却足以压得低阶修士不敢抬头。', { 悟性: 16, 颜值: 10, 神识: 8, 修为: 6 }, 0.5],
  ['旧友证道', '旧友先你一步触及大道边缘，喜悦之余，你也看见了自己仍缺的那一块。', { 气运: 12, 悟性: 12, 颜值: 8, 修为: 8 }, 0.48],
  ['天骄来拜', '年轻天骄登门求教，眼里有敬意，也有想要超越你的锋芒。', { 颜值: 16, 悟性: 8, 家境: 4, 修为: 6 }, 0.46],
  ['道侣共劫', '道侣与你推演劫数，二人言语不多，却都知道这一次不能只顾自己。', { 气运: 14, 神识: 10, 颜值: 10, 修为: 7 }, 0.44],
  ['门人托付', '门人把一脉前途托到你案前，信任沉重得像一件法宝。', { 颜值: 12, 家境: 5, 神识: 8, 修为: 5 }, 0.42],
  ['故人归尘', '故人寿尽归尘，临终前只留下一枚旧符。你收起符纸，许久没有说话。', { 悟性: 10, 神识: 12, 气运: 6, 寿命: -1 }, 0.4],

  ['天机反噬', '你窥算劫数时触到天机暗流，指尖鲜血落在卦盘上，卦象却仍不肯明说。', { 寿命: -8, 神识: -8, 气运: -4, 修为: -12 }, 0.38],
  ['劫云早现', '劫云提前压到洞府上空，尚未落雷，威压已让周围灵植尽数低伏。', { 寿命: -7, 根骨: -7, 修为: -14 }, 0.36],
  ['法域崩角', '法域一角突然崩落，像有无形之手从内侧撕开了你的道基。', { 根骨: -8, 神识: -6, 修为: -13 }, 0.34],
  ['道伤复燃', '多年旧道伤在劫前复燃，疼痛并不剧烈，却不断拖慢你的每一次运功。', { 寿命: -6, 根骨: -6, 悟性: -4, 修为: -10 }, 0.36],
  ['天魔窥梦', '天魔不入洞府，只在梦里隔岸看你。它越安静，你越知道麻烦还没结束。', { 神识: -8, 气运: -5, 修为: -11 }, 0.32],
  ['气运倒卷', '原本顺遂的几件事同时生变，像有一只手把你积攒的运势向后扯去。', { 气运: -9, 家境: -4, 修为: -9 }, 0.34],
  ['寿火摇曳', '寿火在夜半忽明忽暗，你以灵药续火，却无法完全抹去那阵寒意。', { 寿命: -9, 神识: -4, 家境: -3, 修为: -8 }, 0.3],

  ['云海闭目', '你在云海边闭目半日，任云气穿过法衣，也任思绪慢慢停下。', { 修为: 8, 神识: 8, 气运: 5 }, 0.82, 'neutral'],
  ['劫前焚香', '你焚起清香，将洞府内外阵旗重新点验一遍，心里终于有了几分定数。', { 神识: 7, 悟性: 6, 修为: 7 }, 0.8, 'neutral'],
  ['观霞养神', '晚霞映入静室，金红光色像一层柔软护罩，短暂遮住劫前阴影。', { 神识: 9, 颜值: 5, 修为: 6 }, 0.78, 'neutral'],
  ['扫坛定心', '你亲手扫净祭坛尘灰，每扫一处，便把一桩杂念放下。', { 悟性: 7, 神识: 6, 气运: 4, 修为: 5 }, 0.76, 'neutral'],
  ['夜读仙箓', '仙箓字迹晦涩，你读得很慢，却在几处残缺处读出了自己的理解。', { 悟性: 9, 神识: 5, 修为: 6 }, 0.74, 'neutral'],
  ['听风入定', '夜风绕过洞府，像在替天地试探你的心境。你随风声入定，醒来已过三日。', { 神识: 10, 气运: 4, 修为: 6 }, 0.72, 'neutral'],
  ['守炉一夜', '丹炉火候不能断，你守了一夜，药力不算惊艳，却让气血回暖。', { 根骨: 7, 家境: -1, 修为: 8 }, 0.76, 'neutral'],

  ['仙材入库', '一批近仙之材入库，灵光刺目，连封匣都需要三重禁制。', { 家境: 8, 修为: 14, 气运: 8 }, 0.52],
  ['大宗供奉', '大宗供奉按期送到，礼数周全，也提醒你已站在许多人利益中央。', { 家境: 9, 颜值: 8, 修为: 10 }, 0.5],
  ['古宝重炼', '古宝灵性将灭，你以自身法力重炼器胎，成败都要消耗不少底蕴。', { 家境: 6, 悟性: 10, 根骨: 8, 修为: 10 }, 0.48],
  ['星砂成器', '星砂在炉中凝成器胚，每一点火候都要用神识反复校准。', { 家境: 7, 神识: 10, 修为: 12 }, 0.46],
  ['雷竹收获', '洞府外的雷竹终于成材，竹节中藏着细碎雷纹，可作护劫阵材。', { 家境: 6, 根骨: 10, 气运: 7, 修为: 8 }, 0.44],
  ['洞天税契', '你掌管的小洞天开始稳定产出，账册厚了，牵扯也随之变深。', { 家境: 10, 颜值: 6, 修为: 8 }, 0.42],
  ['天阶丹成', '丹成时炉盖自行震开，丹香冲上屋梁。你知道这炉药足以改变一段劫前准备。', { 修为: 16, 根骨: 10, 家境: -3, 寿命: 1 }, 0.44],
  ['护劫阵材', '护劫阵材终于凑齐，但每一件材料都要在劫前重新校验灵性。', { 家境: 6, 神识: 8, 气运: 10, 修为: 8 }, 0.46],

  ['大梦千年', '你在梦里过完千年，醒来时洞中香灰未冷，心中却像多了一世记忆。', { 神识: 24, 悟性: 12, 修为: 10 }, 0.62],
  ['忘我观劫', '你观想自身正在渡劫，几次几乎被雷声惊醒，却又强行坐回心湖中央。', { 悟性: 16, 神识: 14, 修为: 9 }, 0.6],
  ['道心映天', '道心在夜空中映出一点清光，光不耀眼，却压住了劫前惊惧。', { 神识: 16, 气运: 12, 修为: 8 }, 0.58],
  ['一念万里', '一念起时，神识仿佛越过万里山河，看见远处同样闭关的人间烟火。', { 神识: 20, 悟性: 8, 气运: 6, 修为: 8 }, 0.56],
  ['斩念留真', '你斩去一段不合时宜的执念，心里空了一块，却也更接近真正想走的路。', { 悟性: 18, 神识: 10, 修为: 7 }, 0.54],
  ['听雷悟命', '远雷滚过天边，你没有避开，而是静听雷声如何落入命数。', { 悟性: 14, 气运: 12, 根骨: 6, 修为: 8 }, 0.52],
  ['心灯不灭', '心灯在风里摇晃许久，终究没有熄灭。你看着那点光，重新稳住道心。', { 神识: 18, 气运: 10, 寿命: 1, 修为: 6 }, 0.5],
  ['天门自问', '天门尚未开启，你却先问自己若真能飞升，是否还有未了之事。', { 悟性: 16, 神识: 12, 颜值: 5, 修为: 7 }, 0.48],

  ['太上议席', '你被请入太上议席，所议之事动辄影响一宗兴衰，连沉默都显得有分量。', { 颜值: 14, 家境: 7, 神识: 8, 修为: 7 }, 0.5],
  ['宗门托孤', '掌门将一批年轻弟子托付给你，托付的不只是人，也是宗门下一段气数。', { 颜值: 12, 气运: 10, 家境: 5, 修为: 6 }, 0.46],
  ['护山大阵', '护山大阵进入劫前校验，你亲自压阵，阵纹每亮一圈都牵动你的神识。', { 神识: 14, 根骨: 8, 家境: 4, 修为: 8 }, 0.48],
  ['飞升观礼', '你旁观一位前辈飞升，仙光落下时万人俯首，你却看见光背后的沉重代价。', { 悟性: 14, 气运: 10, 颜值: 8, 修为: 7 }, 0.44],
  ['道统传承', '宗门请你留下道统真解，你写得很慢，因为每一句都可能影响后来人的路。', { 悟性: 12, 神识: 12, 颜值: 10, 家境: 4 }, 0.42]
]);

const midCombatEvents: GameEvent[] = [
  {
    id: 'mid-combat-infant-fire-demon',
    age: 0,
    type: 'combat',
    title: '婴火斗妖',
    description: '山腹妖王吞食地火，妖躯坚硬如铁。你必须以元婴真火熔开甲壳，才能逼出它腹中的妖核。',
    weight: 0.72,
    effects: { 修为: 14, 根骨: 14, 神识: 5 },
    result: 'success'
  },
  {
    id: 'mid-combat-break-demon-array',
    age: 0,
    type: 'combat',
    title: '破阵伏魔',
    description: '残阵里困着一缕魔念，阵纹每转一圈都会换一种杀法。蛮力难以奏效，只能边拆阵眼边压住心神。',
    weight: 0.68,
    effects: { 修为: 12, 神识: 13, 悟性: 8 },
    result: 'success'
  },
  {
    id: 'mid-combat-night-demon-king',
    age: 0,
    type: 'combat',
    title: '夜斩妖王',
    description: '妖王趁月黑袭扰村镇，你赶到时血雾已漫过长街。此战重在速决，拖久了便会牵连更多凡人。',
    weight: 0.64,
    effects: { 修为: 15, 根骨: 12, 气运: 8, 颜值: 4 },
    result: 'success'
  },
  {
    id: 'mid-combat-spirit-boat-raid',
    age: 0,
    type: 'combat',
    title: '灵舟遭袭',
    description: '灵舟穿云时遭散修劫掠，货舱、护阵和乘客同时告急。你要在护人、护财和追敌之间快速取舍。',
    weight: 0.7,
    effects: { 修为: 13, 根骨: 7, 气运: 10, 家境: 2 },
    result: 'success'
  },
  {
    id: 'mid-combat-secret-realm-guardian',
    age: 0,
    type: 'combat',
    title: '秘境护法',
    description: '同道破禁取宝时引来秘境守灵，你临时护法，既要挡住守灵冲撞，也不能让禁制反噬队伍。',
    weight: 0.66,
    effects: { 修为: 16, 神识: 12, 气运: 7, 家境: 1 },
    result: 'success'
  },
  {
    id: 'mid-combat-canyon-rival',
    age: 0,
    type: 'combat',
    title: '峡谷斗修',
    description: '狭谷中遇到旧敌，退路被落石截断。双方都不敢全力毁山，只能在方寸地势里抢占先机。',
    weight: 0.62,
    effects: { 修为: 14, 根骨: 10, 悟性: 8, 神识: 5 },
    result: 'success'
  },
  {
    id: 'mid-combat-capture-banner',
    age: 0,
    type: 'combat',
    title: '夺旗演武',
    description: '宗门大比改作夺旗演武，胜负不只看杀伤，更看调度、声望与临场判断。',
    weight: 0.74,
    effects: { 修为: 11, 神识: 8, 颜值: 10, 气运: 4 },
    result: 'success'
  },
  {
    id: 'mid-combat-thunder-marsh-breakout',
    age: 0,
    type: 'combat',
    title: '雷泽突围',
    description: '雷泽骤然涨潮，电蛇、泥蛟和迷雾一同封路。你每前进一步，都要拿根骨硬接雷息。',
    weight: 0.58,
    effects: { 修为: 18, 根骨: 15, 气运: 7, 寿命: -1 },
    result: 'success'
  },
  {
    id: 'mid-combat-demon-cave-purge',
    age: 0,
    type: 'combat',
    title: '魔窟清剿',
    description: '魔窟深处有邪修炼魂，入口狭窄而回音混乱。你要先断供血祭，再压住洞中怨念。',
    weight: 0.6,
    effects: { 修为: 17, 神识: 14, 根骨: 6, 气运: 5 },
    result: 'success'
  },
  {
    id: 'mid-combat-ruined-city-watch',
    age: 0,
    type: 'combat',
    title: '荒城守夜',
    description: '荒城夜半阴兵巡街，你受托守住城心古井。若被阴兵踏破井口，整片遗址都会沉入死气。',
    weight: 0.64,
    effects: { 修为: 13, 神识: 11, 气运: 9, 悟性: 4 },
    result: 'success'
  }
];

const lateCombatEvents: GameEvent[] = [
  {
    id: 'late-combat-law-domain-duel',
    age: 0,
    type: 'combat',
    title: '法域争锋',
    description: '两座法域在云海上相撞，山河虚影彼此碾压。此战不拼一招一式，而拼谁的道更能撑住天地回声。',
    weight: 0.58,
    effects: { 修为: 20, 神识: 18, 悟性: 10 },
    result: 'success'
  },
  {
    id: 'late-combat-heavenly-demon-gate',
    age: 0,
    type: 'combat',
    title: '天魔叩关',
    description: '天魔不从山门来，而从心关叩入。它借你最熟悉的声音说话，每一句都像旧日执念。',
    weight: 0.52,
    effects: { 修为: 18, 神识: 22, 气运: 8 },
    result: 'success'
  },
  {
    id: 'late-combat-great-demon-siege',
    age: 0,
    type: 'combat',
    title: '大妖围山',
    description: '数头大妖围住宗门山脉，外门阵旗一面面熄灭。你必须在护山与斩首之间作出取舍。',
    weight: 0.54,
    effects: { 修为: 23, 根骨: 20, 颜值: 8 },
    result: 'success'
  },
  {
    id: 'late-combat-star-sea-array',
    age: 0,
    type: 'combat',
    title: '星海斗阵',
    description: '星海残阵悬在夜空，敌我每一次出手都会改写星位。你要读阵，也要在阵中活下来。',
    weight: 0.5,
    effects: { 修为: 19, 悟性: 18, 神识: 12 },
    result: 'success'
  },
  {
    id: 'late-combat-king-court-lord',
    age: 0,
    type: 'combat',
    title: '斩王庭主',
    description: '妖族王庭主亲自出手，血脉威压铺天盖地。此战若胜，边境数十年可得安宁。',
    weight: 0.46,
    effects: { 修为: 26, 根骨: 22, 气运: 10 },
    result: 'success'
  },
  {
    id: 'late-combat-tribulation-guardian',
    age: 0,
    type: 'combat',
    title: '劫前护道',
    description: '故人闭死关前请你护道，暗处却有数道气机逼近。你守的不只是洞府，也是一次可能改命的破关。',
    weight: 0.56,
    effects: { 修为: 18, 神识: 14, 气运: 14, 颜值: 6 },
    result: 'success'
  },
  {
    id: 'late-combat-cloud-sea-decisive',
    age: 0,
    type: 'combat',
    title: '云海决战',
    description: '云海之上，旧怨与新仇终于合成一战。脚下云浪翻滚，退一步便是道心蒙尘。',
    weight: 0.48,
    effects: { 修为: 24, 根骨: 16, 神识: 12, 气运: 8 },
    result: 'success'
  },
  {
    id: 'late-combat-boundary-pursuit',
    age: 0,
    type: 'combat',
    title: '破界追袭',
    description: '敌手撕开界缝遁逃，你若追入其中，便要承受乱流切身；若不追，后患难除。',
    weight: 0.44,
    effects: { 修为: 27, 神识: 18, 气运: 10, 寿命: -1 },
    result: 'success'
  },
  {
    id: 'late-combat-thunder-prison-brawl',
    age: 0,
    type: 'combat',
    title: '雷狱搏杀',
    description: '雷狱中锁着一尊古老凶影，锁链断开的瞬间，万道雷光同时照亮你的法身。',
    weight: 0.42,
    effects: { 修为: 30, 根骨: 24, 神识: 12, 寿命: -2 },
    result: 'success'
  }
];

export const midEvents: GameEvent[] = [...createPhaseEvents('mid', midEventGroups), ...midCombatEvents];
export const lateEvents: GameEvent[] = [...createPhaseEvents('late', lateEventGroups), ...lateCombatEvents];
export const events = earlyEvents;

function createPhaseEvents(phase: PhaseId, groups: PhaseEventGroup[]): GameEvent[] {
  return groups.flatMap(group => group.titles.map((title, index) => {
    const typeIndex = index + 1;
    const detail = phase === 'mid'
      ? midEventDetails[title]
      : phase === 'late'
        ? lateEventDetails[title]
        : undefined;
    return {
      id: `${phase}-${group.type}-${typeIndex}`,
      age: 0,
      type: group.type,
      title,
      description: detail?.description ?? getPhaseEventDescription(phase, group.type, title),
      weight: detail?.weight ?? getPhaseEventWeight(group.type, index),
      effects: detail?.effects ?? getPhaseEventEffects(phase, group.type, index),
      result: detail?.result ?? (group.type === 'disaster' ? 'failure' : group.type === 'daily' ? 'neutral' : 'success')
    };
  }));
}

function createPhaseEventDetails(entries: PhaseEventDetailEntry[]): Record<string, {
  description: string;
  effects: GameEvent['effects'];
  weight?: number;
  result?: GameEvent['result'];
}> {
  return Object.fromEntries(entries.map(([title, description, effects, weight, result]) => [
    title,
    { description, effects, weight, result }
  ]));
}

function getPhaseEventDescription(phase: PhaseId, type: GameEvent['type'], title: string): string {
  const stageText = phase === 'late' ? '高境界' : '元婴之后';
  const descriptions: Partial<Record<GameEvent['type'], string>> = {
    cultivation: `${stageText}修行渐入玄微，${title}让你从灵机深处打磨根基。`,
    combat: `${stageText}的争斗不再只是胜负，${title}逼你在生死之间印证道法。`,
    encounter: `${title}牵出一段难得机缘，天地旧痕在你眼前微微发亮。`,
    social: `${title}让人情与道途交错，声名、因果和资源都随之流转。`,
    disaster: `${title}骤然临身，修为越高，反噬越深，稍有不慎便会伤及根本。`,
    daily: `${title}看似寻常，却在漫长修行中积累成扎实底蕴。`,
    resource: `${title}带来一批更高阶的修行资粮，足以支撑一段清修。`,
    mind: `${title}触动道心，许多旧日执念在高境界中重新显影。`,
    sect: `${title}使你更深卷入宗门道统，得失都不再局限于一人一事。`
  };

  return descriptions[type] ?? `${title}改变了这一段修行。`;
}

function getPhaseEventWeight(type: GameEvent['type'], index: number): number {
  const baseWeight: Partial<Record<GameEvent['type'], number>> = {
    cultivation: 1,
    combat: 0.72,
    encounter: 0.62,
    social: 0.56,
    disaster: 0.52,
    daily: 0.9,
    resource: 0.66,
    mind: 0.72,
    sect: 0.68
  };

  return Math.max(0.25, (baseWeight[type] ?? 0.6) - (index % 4) * 0.04);
}

function getPhaseEventEffects(phase: PhaseId, type: GameEvent['type'], index: number): GameEvent['effects'] {
  const late = phase === 'late';
  const attr = late ? 16 + (index % 5) * 4 : 8 + (index % 5) * 3;
  const minor = late ? 8 + (index % 4) * 2 : 4 + (index % 4) * 2;
  const progress = late ? 16 + (index % 5) * 4 : 9 + (index % 5) * 3;
  const wealth = late ? 4 + (index % 3) * 2 : 2 + (index % 3);

  switch (type) {
    case 'cultivation':
      return index % 3 === 0
        ? { 修为: progress, 根骨: attr, 神识: minor }
        : index % 3 === 1
          ? { 修为: progress, 悟性: attr, 气运: minor }
          : { 修为: progress, 神识: attr, 根骨: minor };
    case 'combat':
      return { 修为: progress + 3, 根骨: attr, 神识: minor, 气运: minor };
    case 'encounter':
      return { 修为: progress, 气运: attr, 悟性: minor, 家境: wealth };
    case 'social':
      return { 颜值: attr, 气运: minor, 家境: wealth, 修为: Math.max(4, progress - 5) };
    case 'disaster':
      return late
        ? { 寿命: -(7 + index % 5), 根骨: -minor, 神识: -minor, 修为: -(12 + index % 5) }
        : { 寿命: -(3 + index % 4), 根骨: -Math.ceil(minor / 2), 神识: -Math.ceil(minor / 2), 修为: -(7 + index % 4) };
    case 'daily':
      return { 修为: Math.max(5, progress - 4), 根骨: minor, 悟性: minor, 神识: Math.ceil(minor / 2) };
    case 'resource':
      return { 家境: wealth + 1, 根骨: minor, 气运: minor, 修为: progress };
    case 'mind':
      return { 神识: attr, 悟性: minor, 气运: minor, 修为: progress };
    case 'sect':
      return { 家境: wealth, 悟性: minor, 神识: minor, 颜值: minor, 修为: progress };
    default:
      return { 修为: progress };
  }
}
