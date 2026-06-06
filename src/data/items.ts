import type { InventoryItem } from '@/types';

export const items: InventoryItem[] = [
  {
    id: 'qi-gathering-pill',
    name: '聚气丹',
    type: '丹药',
    rarity: '凡品',
    description: '温和聚拢灵气，适合低阶修士补足一段修炼进度。',
    usable: true,
    effects: { 修为: 8 }
  },
  {
    id: 'bone-tempering-pill',
    name: '淬骨丹',
    type: '丹药',
    rarity: '下品',
    description: '药力入骨，能稳步补强根基。',
    usable: true,
    effects: { 根骨: 5, 寿命: -1 }
  },
  {
    id: 'soul-nourishing-pill',
    name: '养神丹',
    type: '丹药',
    rarity: '中品',
    description: '滋养识海，适合神识受损或突破前温养心神。',
    usable: true,
    effects: { 神识: 6, 悟性: 2 }
  },
  {
    id: 'fortune-talisman',
    name: '转运符',
    type: '法器',
    rarity: '中品',
    description: '一次性护符，焚符后可微调气机。',
    usable: true,
    effects: { 气运: 6, 家境: -1 }
  },
  {
    id: 'spirit-herb',
    name: '灵草',
    type: '灵材',
    rarity: '凡品',
    description: '常见灵材，可入药，也可在坊市换取资源。',
    usable: false
  },
  {
    id: 'beast-core',
    name: '妖核',
    type: '灵材',
    rarity: '下品',
    description: '妖兽体内凝成的灵机核心，炼丹炼器都用得上。',
    usable: false
  },
  {
    id: 'blood-jade',
    name: '血玉',
    type: '灵材',
    rarity: '中品',
    description: '邪修与古兽身上偶见的血色玉髓，灵气浓而躁。',
    usable: false
  },
  {
    id: 'old-manual-page',
    name: '残篇经页',
    type: '功法',
    rarity: '中品',
    description: '残缺旧经页，单页难成体系，但能带来一点悟法方向。',
    usable: true,
    effects: { 悟性: 5, 神识: 2, 修为: 3 }
  },
  {
    id: 'spirit-stone-pouch',
    name: '灵石袋',
    type: '杂物',
    rarity: '凡品',
    description: '零散灵石，可直接补贴修行家底。',
    usable: true,
    effects: { 家境: 4 }
  },
  {
    id: 'ancient-scale',
    name: '古兽鳞',
    type: '灵材',
    rarity: '上品',
    description: '古兽遗种脱落的坚鳞，触之仍有蛮荒气血。',
    usable: false
  },
  {
    id: 'mystic-spirit-pill',
    name: '玄灵丹',
    type: '丹药',
    rarity: '中品',
    description: '中阶修士常备的凝灵丹药，可补进度，也能略稳神识。',
    usable: true,
    effects: { 修为: 12, 神识: 3 }
  },
  {
    id: 'dragon-blood-pill',
    name: '蛟血淬体丹',
    type: '丹药',
    rarity: '上品',
    description: '以蛟血炼成的淬体丹，药性刚猛，服下后气血翻涌。',
    usable: true,
    effects: { 根骨: 8, 修为: 4, 寿命: -1 }
  },
  {
    id: 'soul-settling-orb',
    name: '定魂珠',
    type: '法器',
    rarity: '上品',
    description: '可短暂镇住识海波澜，适合突破前稳住心神。',
    usable: true,
    effects: { 神识: 10, 气运: 2 }
  },
  {
    id: 'mystic-manual-fragment',
    name: '玄阶残卷',
    type: '功法',
    rarity: '上品',
    description: '残缺的玄阶功法注解，虽不能独立成书，却能启发修行。',
    usable: true,
    effects: { 悟性: 9, 神识: 3, 修为: 5 }
  },
  {
    id: 'purple-crystal-marrow',
    name: '紫晶灵髓',
    type: '灵材',
    rarity: '上品',
    description: '中阶秘境中凝成的灵髓，光色温润，可作丹器主材。',
    usable: false
  },
  {
    id: 'thunder-beast-core',
    name: '雷纹妖丹',
    type: '灵材',
    rarity: '上品',
    description: '妖丹表面有细密雷纹，内里灵机躁动，适合炼制护劫之物。',
    usable: false
  },
  {
    id: 'nether-bone',
    name: '幽冥骨',
    type: '灵材',
    rarity: '中品',
    description: '阴气沉重的骨材，常见于魔窟与荒城遗址。',
    usable: false
  },
  {
    id: 'star-spirit-stone',
    name: '星纹灵石',
    type: '杂物',
    rarity: '上品',
    description: '带有星纹的高阶灵石，可直接补贴洞府和人情往来。',
    usable: true,
    effects: { 家境: 8, 气运: 1 }
  },
  {
    id: 'tribulation-pill',
    name: '渡劫丹',
    type: '丹药',
    rarity: '极品',
    description: '劫前才舍得动用的高阶丹药，能补根基，也能续住一口寿火。',
    usable: true,
    effects: { 修为: 16, 根骨: 8, 寿命: 1 }
  },
  {
    id: 'heaven-soul-jade',
    name: '天魂玉',
    type: '法器',
    rarity: '极品',
    description: '温养神魂的高阶玉器，握之如有清光照入识海。',
    usable: true,
    effects: { 神识: 14, 悟性: 4 }
  },
  {
    id: 'immortal-talisman-page',
    name: '仙箓残页',
    type: '功法',
    rarity: '极品',
    description: '疑似仙箓残页，符意残缺，却足以让高阶修士反复参悟。',
    usable: true,
    effects: { 悟性: 14, 神识: 6, 修为: 8 }
  },
  {
    id: 'tribulation-ward',
    name: '护劫符',
    type: '法器',
    rarity: '极品',
    description: '专为劫前护身绘制的符箓，能临时调整气机，但代价不轻。',
    usable: true,
    effects: { 气运: 12, 家境: -2 }
  },
  {
    id: 'outer-star-sand',
    name: '天外星砂',
    type: '灵材',
    rarity: '极品',
    description: '天外残星磨出的星砂，细看有星河流动。',
    usable: false
  },
  {
    id: 'xuanhuang-marrow',
    name: '玄黄道髓',
    type: '灵材',
    rarity: '神话',
    description: '玄黄气凝成的道髓，沉重而温润，足以压住一方阵眼。',
    usable: false
  },
  {
    id: 'tribulation-crystal',
    name: '劫雷晶',
    type: '灵材',
    rarity: '极品',
    description: '雷狱与劫云中偶然凝成的晶体，内藏细小雷音。',
    usable: false
  },
  {
    id: 'ancient-immortal-scale',
    name: '古仙鳞',
    type: '灵材',
    rarity: '神话',
    description: '传闻沾过仙光的古鳞，触之可见朦胧天门影。',
    usable: false
  }
];

export function getItem(itemId: string): InventoryItem | undefined {
  return items.find(item => item.id === itemId);
}
