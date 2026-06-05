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
  }
];

export function getItem(itemId: string): InventoryItem | undefined {
  return items.find(item => item.id === itemId);
}
