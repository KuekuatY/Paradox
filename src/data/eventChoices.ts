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
  ],
  'encounter-ruined-altar': [
    {
      id: 'read-runes',
      label: '细读坛纹',
      description: '用神识解析祭坛纹路，悟道收益更高，但容易受低语侵扰。',
      outcome: '你强忍耳边低语，一笔一画辨认坛纹，终于看出其中残缺的法意。',
      successModifier: -0.02,
      positiveScale: 1.25,
      negativeScale: 1.15,
      effects: { 悟性: 3, 神识: -1 }
    },
    {
      id: 'offer-incense',
      label: '焚香镇念',
      description: '以香火平稳心神，收益较稳，代价较轻。',
      outcome: '你点燃清香压住杂念，没有贪求祭坛深处的诡异许诺。',
      successModifier: 0.1,
      positiveScale: 0.8,
      negativeScale: 0.55,
      effects: { 气运: 1, 家境: -1 }
    },
    {
      id: 'break-altar',
      label: '破坛离去',
      description: '斩断隐患，可能失去机缘，但能换来心神清明。',
      outcome: '你一掌震碎祭坛，低语随尘土散开，心头反倒轻了一些。',
      successModifier: 0.04,
      positiveScale: 0.45,
      negativeScale: 0.4,
      effects: { 神识: 2, 修为: -2 }
    }
  ],
  'resource-failed-investment': [
    {
      id: 'audit-ledger',
      label: '追查账册',
      description: '花时间查账，可能追回损失，也会拖慢修行。',
      outcome: '你翻遍往来凭据，终于从几处假账里找出线索。',
      successModifier: 0.08,
      positiveScale: 0.85,
      negativeScale: 0.75,
      effects: { 悟性: 2, 修为: -2 }
    },
    {
      id: 'accept-loss',
      label: '认亏止损',
      description: '不再深追，把损失压住，换取心境稳定。',
      outcome: '你把这笔亏损记下，不再让懊恼继续吞掉修行时间。',
      successModifier: 0.12,
      positiveScale: 0.45,
      negativeScale: 0.45,
      effects: { 神识: 1, 气运: 1 }
    },
    {
      id: 'pressure-broker',
      label: '逼问掮客',
      description: '强硬讨债，风险更高，若成则追回更多资源。',
      outcome: '你堵住牵线的掮客，逼他给出一个交代。',
      successModifier: -0.05,
      positiveScale: 1.25,
      negativeScale: 1.3,
      effects: { 颜值: -1, 家境: 1 }
    }
  ],
  'sect-elder-private-lesson': [
    {
      id: 'ask-breakthrough',
      label: '请教破境',
      description: '专注突破细节，修为和悟性收益更高。',
      outcome: '你抓住机会请教破境关窍，长老几句话正点在你的短板上。',
      successModifier: 0.04,
      positiveScale: 1.18,
      negativeScale: 0.9,
      effects: { 悟性: 2 }
    },
    {
      id: 'ask-spirit',
      label: '请教神识',
      description: '转向神识打磨，收益更偏中后期门槛。',
      outcome: '你没有急着问修为，而是追问神识凝练之法。',
      successModifier: 0.02,
      positiveScale: 0.9,
      negativeScale: 0.8,
      effects: { 神识: 3, 修为: -1 }
    },
    {
      id: 'serve-tea',
      label: '奉茶结缘',
      description: '少问法，多结善缘，资源收益更稳。',
      outcome: '你恭敬奉茶，把小课之外的人情也照顾周全。',
      successModifier: 0.08,
      positiveScale: 0.7,
      negativeScale: 0.65,
      effects: { 家境: 1, 颜值: 2 }
    }
  ],
  'sect-mission-failure': [
    {
      id: 'take-blame',
      label: '主动担责',
      description: '名声损失较小，但会承受更多惩戒。',
      outcome: '你主动揽下该担的责任，执事脸色稍缓，责罚却仍免不了。',
      successModifier: 0.08,
      positiveScale: 0.55,
      negativeScale: 0.85,
      effects: { 颜值: 1, 修为: -1 }
    },
    {
      id: 'argue-details',
      label: '据理分辩',
      description: '有机会减轻处罚，也可能惹来更多反感。',
      outcome: '你把任务经过逐条说清，试图证明问题并不全在自己。',
      successModifier: -0.02,
      positiveScale: 1.05,
      negativeScale: 1.2,
      effects: { 悟性: 1, 颜值: -1 }
    },
    {
      id: 'make-amends',
      label: '补交资源',
      description: '用家底补救失误，名声和修行损失都更可控。',
      outcome: '你拿出一笔资源补上缺口，事情总算没有继续扩大。',
      successModifier: 0.12,
      positiveScale: 0.7,
      negativeScale: 0.5,
      effects: { 家境: -2, 气运: 1 }
    }
  ],
  'mid-cultivation-4': [
    {
      id: 'ride-tide',
      label: '顺潮吐纳',
      description: '追求修为进度，收益直接但根基提升较少。',
      outcome: '你顺着潮声吐纳，让元婴随灵潮一涨一落。',
      successModifier: 0,
      positiveScale: 1.15,
      negativeScale: 1,
      effects: { 修为: 3, 根骨: -1 }
    },
    {
      id: 'store-tide',
      label: '藏潮入骨',
      description: '压慢进度，把潮汐灵机沉入根骨。',
      outcome: '你没有急着催动修为，而是把潮汐灵机一寸寸藏入骨中。',
      successModifier: 0.06,
      positiveScale: 0.86,
      negativeScale: 0.75,
      effects: { 根骨: 4, 修为: -2 }
    },
    {
      id: 'listen-source',
      label: '追听潮源',
      description: '更考悟性，成功时会额外牵动气运。',
      outcome: '你试着分辨潮声源头，沿着若有若无的回响追索。',
      successModifier: -0.02,
      positiveScale: 1.04,
      negativeScale: 1,
      effects: { 悟性: 2, 气运: 2 }
    }
  ],
  'mid-encounter-8': [
    {
      id: 'solve-endgame',
      label: '强解残局',
      description: '悟性收益高，但落错一子会扰乱心神。',
      outcome: '你凝神推演残局，落子时云海随之翻动。',
      successModifier: -0.05,
      positiveScale: 1.2,
      negativeScale: 1.22,
      effects: { 悟性: 3, 神识: -1 }
    },
    {
      id: 'stop-third-move',
      label: '三手即止',
      description: '见好就收，降低风险。',
      outcome: '你只看三手便收回神识，没有让棋局继续牵住心神。',
      successModifier: 0.12,
      positiveScale: 0.78,
      negativeScale: 0.55,
      effects: { 神识: 2, 修为: -1 }
    },
    {
      id: 'leave-countermove',
      label: '留下一子',
      description: '把机缘留给后来人，气运更稳。',
      outcome: '你没有独占棋局，而是在云端留下一枚可续之子。',
      successModifier: 0.05,
      positiveScale: 0.9,
      negativeScale: 0.75,
      effects: { 气运: 3, 颜值: 1 }
    }
  ],
  'mid-social-4': [
    {
      id: 'accept-apology',
      label: '收礼和解',
      description: '资源与名声更稳，但旧怨未必全消。',
      outcome: '你收下赔礼，也把话说在明处，不再追究旧事。',
      successModifier: 0.08,
      positiveScale: 0.9,
      negativeScale: 0.7,
      effects: { 家境: 2, 颜值: 1 }
    },
    {
      id: 'test-sincerity',
      label: '试其诚意',
      description: '收益更高，但容易重新激化矛盾。',
      outcome: '你没有立刻点头，而是提出一件需要对方亲自补救的旧事。',
      successModifier: -0.04,
      positiveScale: 1.15,
      negativeScale: 1.18,
      effects: { 悟性: 2, 气运: 1 }
    },
    {
      id: 'keep-distance',
      label: '淡淡揭过',
      description: '不深交，风险和收益都较低。',
      outcome: '你给了对方面子，却没有让他重新走近自己的道途。',
      successModifier: 0.1,
      positiveScale: 0.72,
      negativeScale: 0.55,
      effects: { 神识: 2, 修为: -1 }
    }
  ],
  'mid-disaster-2': [
    {
      id: 'seal-sense',
      label: '封闭五感',
      description: '强行止痛，修为损失较小但伤神。',
      outcome: '你封住五感，把识海裂痛压进最深处。',
      successModifier: 0.04,
      positiveScale: 0.75,
      negativeScale: 0.85,
      effects: { 修为: 2, 神识: -1 }
    },
    {
      id: 'trace-crack',
      label: '追索裂痕',
      description: '借灾修心，风险和悟性收益都更高。',
      outcome: '你忍痛追索裂痕来源，试图在痛楚里看清识海弱点。',
      successModifier: -0.06,
      positiveScale: 1.1,
      negativeScale: 1.28,
      effects: { 悟性: 3, 寿命: -1 }
    },
    {
      id: 'ask-protection',
      label: '求护心丹',
      description: '消耗家底，显著降低灾祸损失。',
      outcome: '你向丹阁求来护心丹，以药力护住识海边缘。',
      successModifier: 0.14,
      positiveScale: 0.65,
      negativeScale: 0.5,
      effects: { 家境: -3, 神识: 1 }
    }
  ],
  'mid-resource-6': [
    {
      id: 'bid-real-treasure',
      label: '押注真货',
      description: '看准目标重金出手，资源收益高。',
      outcome: '你盯住其中一件真货，在众人犹豫时直接落槌。',
      successModifier: -0.03,
      positiveScale: 1.18,
      negativeScale: 1.18,
      effects: { 家境: -3, 气运: 3 }
    },
    {
      id: 'read-sellers',
      label: '观察卖家',
      description: '少买多看，悟性和风险控制更好。',
      outcome: '你没有急着竞价，而是看卖家神色和托价手法。',
      successModifier: 0.1,
      positiveScale: 0.76,
      negativeScale: 0.58,
      effects: { 悟性: 3, 修为: -1 }
    },
    {
      id: 'pool-funds',
      label: '合资竞拍',
      description: '借人脉分摊成本，收益偏家境和名声。',
      outcome: '你临时联合熟识同道合资竞拍，把风险摊薄。',
      successModifier: 0.04,
      positiveScale: 0.95,
      negativeScale: 0.82,
      effects: { 颜值: 2, 家境: 1 }
    }
  ],
  'mid-sect-4': [
    {
      id: 'read-breakthrough-notes',
      label: '翻破境札记',
      description: '偏突破门槛收益，消耗一次秘库机会。',
      outcome: '你直奔破境札记，把前人失败处逐条记下。',
      successModifier: 0.02,
      positiveScale: 1.08,
      negativeScale: 0.95,
      effects: { 悟性: 3, 神识: 1 }
    },
    {
      id: 'copy-array-volume',
      label: '抄阵法残卷',
      description: '偏神识与宗门资源，修为收益略低。',
      outcome: '你抄下一卷阵法残篇，准备回洞府慢慢拆解。',
      successModifier: 0.06,
      positiveScale: 0.9,
      negativeScale: 0.72,
      effects: { 神识: 3, 修为: -1 }
    },
    {
      id: 'search-technique-clue',
      label: '找功法线索',
      description: '更看气运，可能为后续功法获取铺路。',
      outcome: '你在书目夹缝里寻找功法来历，记下几条可追的线索。',
      successModifier: -0.01,
      positiveScale: 1.02,
      negativeScale: 0.95,
      effects: { 气运: 3, 家境: -1 }
    }
  ],
  'late-cultivation-4': [
    {
      id: 'accept-thunder',
      label: '承雷淬骨',
      description: '强吃雷力，根骨收益最高，寿元压力更大。',
      outcome: '你撤去半数护阵，让雷池余电直接劈入骨髓。',
      successModifier: -0.08,
      positiveScale: 1.24,
      negativeScale: 1.3,
      effects: { 根骨: 5, 寿命: -1 }
    },
    {
      id: 'guide-thunder-array',
      label: '以阵引雷',
      description: '消耗资源控雷，风险更低。',
      outcome: '你以阵旗分流雷势，把最凶的一段雷意导入地脉。',
      successModifier: 0.1,
      positiveScale: 0.88,
      negativeScale: 0.58,
      effects: { 家境: -3, 神识: 2 }
    },
    {
      id: 'observe-thunder',
      label: '观雷不入',
      description: '放弃淬骨强度，换取悟性和安全。',
      outcome: '你只在雷池边观摩雷纹，不让身体承受过多雷意。',
      successModifier: 0.14,
      positiveScale: 0.68,
      negativeScale: 0.45,
      effects: { 悟性: 3, 修为: -2 }
    }
  ],
  'late-encounter-3': [
    {
      id: 'answer-with-self',
      label: '以己作答',
      description: '道心收益高，回答错了会伤神。',
      outcome: '你没有套用经义，而是把自己的取舍写在石壁下方。',
      successModifier: -0.04,
      positiveScale: 1.18,
      negativeScale: 1.2,
      effects: { 悟性: 4, 神识: -1 }
    },
    {
      id: 'leave-question',
      label: '留问后人',
      description: '不求独占机缘，气运更稳。',
      outcome: '你没有抹去仙人遗问，只在旁边添了一句自己的疑惑。',
      successModifier: 0.08,
      positiveScale: 0.86,
      negativeScale: 0.68,
      effects: { 气运: 4, 颜值: 1 }
    },
    {
      id: 'seal-question',
      label: '封存遗问',
      description: '用资源封存危险机缘，降低反噬。',
      outcome: '你以禁制封住石壁，免得后来者被此问逼疯心神。',
      successModifier: 0.12,
      positiveScale: 0.72,
      negativeScale: 0.5,
      effects: { 家境: -2, 神识: 2 }
    }
  ],
  'late-disaster-1': [
    {
      id: 'cut-divination',
      label: '斩断卦线',
      description: '立刻止损，收益少但灾损低。',
      outcome: '你一指斩断卦线，不再强行窥看后续天机。',
      successModifier: 0.14,
      positiveScale: 0.62,
      negativeScale: 0.48,
      effects: { 神识: 1, 修为: -1 }
    },
    {
      id: 'force-reading',
      label: '强读天机',
      description: '赌一次关键情报，风险极高。',
      outcome: '你任由鲜血浸透卦盘，强行看完最后一层卦象。',
      successModifier: -0.1,
      positiveScale: 1.28,
      negativeScale: 1.35,
      effects: { 悟性: 4, 寿命: -1 }
    },
    {
      id: 'offer-incense',
      label: '献祭遮因',
      description: '消耗家底与气运，换取较稳处理。',
      outcome: '你献出一批珍材遮掩因果，让反噬从身侧擦过。',
      successModifier: 0.08,
      positiveScale: 0.8,
      negativeScale: 0.62,
      effects: { 家境: -4, 气运: -1 }
    }
  ],
  'late-resource-8': [
    {
      id: 'build-heavy-array',
      label: '重筑护阵',
      description: '资源消耗大，护劫收益最稳。',
      outcome: '你将阵材尽数压入主阵，宁可奢侈，也不在劫前省这一笔。',
      successModifier: 0.08,
      positiveScale: 1.02,
      negativeScale: 0.62,
      effects: { 家境: -4, 气运: 3 }
    },
    {
      id: 'save-core-material',
      label: '留存核心',
      description: '少用珍材，当前收益低，后续资源更宽。',
      outcome: '你只启用必要阵材，把最珍贵的核心材料封存备用。',
      successModifier: 0.04,
      positiveScale: 0.72,
      negativeScale: 0.7,
      effects: { 家境: 2, 修为: -2 }
    },
    {
      id: 'ask-array-master',
      label: '请阵师校验',
      description: '花费人情，神识与稳定性更好。',
      outcome: '你请来阵师逐件校验阵材，连细小裂纹都不放过。',
      successModifier: 0.12,
      positiveScale: 0.86,
      negativeScale: 0.52,
      effects: { 神识: 3, 颜值: 1, 家境: -2 }
    }
  ],
  'late-sect-2': [
    {
      id: 'protect-disciples',
      label: '护住弟子',
      description: '偏名声和气运，修行被牵扯。',
      outcome: '你先为年轻弟子安排退路，再考虑自己的劫前清修。',
      successModifier: 0.08,
      positiveScale: 0.88,
      negativeScale: 0.64,
      effects: { 颜值: 3, 气运: 3, 修为: -2 }
    },
    {
      id: 'set-hard-rules',
      label: '立下严规',
      description: '短期不讨喜，但宗门收益更稳。',
      outcome: '你把规矩写得很冷硬，宁可被埋怨，也不让他们走险路。',
      successModifier: 0.02,
      positiveScale: 1,
      negativeScale: 0.78,
      effects: { 神识: 2, 颜值: -1, 家境: 2 }
    },
    {
      id: 'teach-core-method',
      label: '传核心法',
      description: '以心神换传承，悟性收益更高。',
      outcome: '你拆开自己的修行心得，把最关键的几处讲给他们听。',
      successModifier: -0.02,
      positiveScale: 1.12,
      negativeScale: 1.02,
      effects: { 悟性: 3, 神识: -1 }
    }
  ],
  'late-combat-thunder-prison-brawl': [
    {
      id: 'break-chains',
      label: '断链抢攻',
      description: '主动放开雷狱锁链，收益和风险都极高。',
      outcome: '你斩断半截锁链，趁凶影尚未完全脱困时抢先压上。',
      successModifier: -0.1,
      positiveScale: 1.26,
      negativeScale: 1.35,
      effects: { 修为: 5, 根骨: 2, 寿命: -1 }
    },
    {
      id: 'use-chains',
      label: '借链缚影',
      description: '利用旧锁链控场，风险较低。',
      outcome: '你没有急着近身，而是借雷狱旧锁链重新束住凶影。',
      successModifier: 0.12,
      positiveScale: 0.84,
      negativeScale: 0.55,
      effects: { 神识: 3, 修为: -2 }
    },
    {
      id: 'temper-in-thunder',
      label: '雷中炼身',
      description: '把战斗当淬体，根骨收益更明显。',
      outcome: '你故意踏入雷光最密处，让每一道雷都先落在自己身上。',
      successModifier: -0.04,
      positiveScale: 1.08,
      negativeScale: 1.18,
      effects: { 根骨: 4, 神识: 1 }
    }
  ],
  'mid-combat-break-demon-array': [
    {
      id: 'strike-array-core',
      label: '直破阵眼',
      description: '抢时间破阵，收益更高，但容易被魔念反噬。',
      outcome: '你锁定阵纹逆流处，冒着反噬强行斩入阵眼。',
      successModifier: -0.04,
      positiveScale: 1.18,
      negativeScale: 1.25,
      effects: { 悟性: 3, 神识: -1 }
    },
    {
      id: 'stabilize-soul',
      label: '先稳识海',
      description: '放慢攻势，降低损失，更偏神识收益。',
      outcome: '你先以神识镇住杂念，等阵势露出稳定破绽。',
      successModifier: 0.12,
      positiveScale: 0.82,
      negativeScale: 0.55,
      effects: { 神识: 3, 修为: -2 }
    },
    {
      id: 'borrow-array',
      label: '借阵反困',
      description: '以悟性换打法，成功时收益更全面。',
      outcome: '你没有急着毁阵，而是借残阵纹路反困魔念。',
      successModifier: 0.02,
      positiveScale: 1.05,
      negativeScale: 0.9,
      effects: { 悟性: 2, 气运: 2 }
    }
  ],
  'mid-combat-spirit-boat-raid': [
    {
      id: 'guard-passengers',
      label: '护住乘客',
      description: '优先保人，名声和气运更稳，战利品少一些。',
      outcome: '你守在客舱前，把劫修的术法尽数拦下。',
      successModifier: 0.08,
      positiveScale: 0.82,
      negativeScale: 0.65,
      effects: { 颜值: 3, 气运: 2, 家境: -1 }
    },
    {
      id: 'protect-cargo',
      label: '守住货舱',
      description: '偏向资源收益，但会承受更多正面冲击。',
      outcome: '你将护阵收束到货舱四周，硬接数轮破阵法器。',
      successModifier: -0.02,
      positiveScale: 1.08,
      negativeScale: 1.12,
      effects: { 家境: 2, 根骨: -1 }
    },
    {
      id: 'hunt-raiders',
      label: '追杀劫修',
      description: '放手追敌，修为收益更高，风险也更高。',
      outcome: '你冲出灵舟护阵，在云海里追上领头劫修。',
      successModifier: -0.06,
      positiveScale: 1.22,
      negativeScale: 1.25,
      effects: { 修为: 4, 气运: 1 }
    }
  ],
  'mid-combat-thunder-marsh-breakout': [
    {
      id: 'force-through-thunder',
      label: '硬闯雷潮',
      description: '以根骨硬扛，修为和根骨收益更高。',
      outcome: '你顶着雷潮向前，任电蛇一寸寸淬过筋骨。',
      successModifier: -0.08,
      positiveScale: 1.24,
      negativeScale: 1.3,
      effects: { 根骨: 4, 寿命: -1 }
    },
    {
      id: 'follow-waterline',
      label: '寻水脉退路',
      description: '靠判断绕开雷眼，收益较稳。',
      outcome: '你循着水脉暗流避开雷眼，几次险险绕过泥蛟伏击。',
      successModifier: 0.08,
      positiveScale: 0.9,
      negativeScale: 0.65,
      effects: { 悟性: 2, 气运: 2 }
    },
    {
      id: 'lure-mud-dragon',
      label: '诱蛟撞雷',
      description: '借雷泽杀敌，成功时战利品与气运更好。',
      outcome: '你故意露出破绽，引泥蛟撞进雷眼深处。',
      successModifier: -0.02,
      positiveScale: 1.08,
      negativeScale: 1,
      effects: { 气运: 3, 神识: 1 }
    }
  ],
  'mid-combat-ruined-city-watch': [
    {
      id: 'hold-well-mouth',
      label: '死守古井',
      description: '稳住核心，降低大损失，修为收益偏少。',
      outcome: '你一步不退守在古井旁，将阴兵一批批压回长街。',
      successModifier: 0.1,
      positiveScale: 0.78,
      negativeScale: 0.55,
      effects: { 神识: 3, 修为: -2 }
    },
    {
      id: 'break-yin-banner',
      label: '斩断阴旗',
      description: '主动破局，成功收益高，失败会被围困。',
      outcome: '你越过阴兵阵列，直取城楼上招魂阴旗。',
      successModifier: -0.05,
      positiveScale: 1.18,
      negativeScale: 1.22,
      effects: { 气运: 2, 根骨: 1 }
    },
    {
      id: 'read-city-script',
      label: '解读城纹',
      description: '用悟性寻找旧城禁制，收益更偏心神。',
      outcome: '你边战边读城砖上的旧纹，试着唤醒荒城残存禁制。',
      successModifier: 0.02,
      positiveScale: 0.96,
      negativeScale: 0.8,
      effects: { 悟性: 3, 神识: 1 }
    }
  ]
};

export function getSpecificEventChoices(eventId: string): EventChoice[] | undefined {
  return eventChoiceSets[eventId];
}

export function hasSpecificEventChoices(eventId: string): boolean {
  return eventId in eventChoiceSets;
}
