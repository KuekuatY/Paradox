import type { CultivationPathId, TechniqueDefinition, TechniqueGrade } from '@/types';

export const techniqueGrades: TechniqueGrade[] = ['黄', '玄', '地', '天', '仙'];

export const techniques: TechniqueDefinition[] = [
  {
    id: 'sword-yellow-edge',
    pathId: 'sword',
    name: '青锋引气诀',
    grade: '黄',
    description: '以剑意牵引灵气，重在磨砺根骨与出手锋芒。',
    minRealmLevel: 1,
    maxLevel: 5,
    trainCost: { 修为: 8, 时间: 1 },
    effectsPerLevel: { 根骨: 3, 神识: 1 },
    combatPowerPerLevel: 0.025
  },
  {
    id: 'sword-mystic-rain',
    pathId: 'sword',
    name: '听雨剑经',
    grade: '玄',
    description: '剑势如雨，连绵不绝，适合金丹之后凝练神识与杀伐。',
    minRealmLevel: 3,
    maxLevel: 6,
    trainCost: { 修为: 10, 时间: 1 },
    effectsPerLevel: { 根骨: 4, 神识: 2 },
    combatPowerPerLevel: 0.032
  },
  {
    id: 'sword-earth-cloud',
    pathId: 'sword',
    name: '云海万剑录',
    grade: '地',
    description: '一念起而万剑随，重在元神御剑与大范围压制。',
    minRealmLevel: 5,
    maxLevel: 7,
    trainCost: { 修为: 12, 时间: 2 },
    effectsPerLevel: { 根骨: 5, 神识: 4, 悟性: 1 },
    combatPowerPerLevel: 0.04
  },
  {
    id: 'sword-heaven-star',
    pathId: 'sword',
    name: '星河剑典',
    grade: '天',
    description: '借星河之势铸剑域，合体之后方能承载其锋芒。',
    minRealmLevel: 7,
    maxLevel: 8,
    trainCost: { 修为: 14, 时间: 3 },
    effectsPerLevel: { 根骨: 7, 神识: 5, 气运: 1 },
    combatPowerPerLevel: 0.048
  },
  {
    id: 'sword-immortal-sky',
    pathId: 'sword',
    name: '太上斩天经',
    grade: '仙',
    description: '剑意近道，一剑落而万法开。',
    minRealmLevel: 9,
    maxLevel: 9,
    trainCost: { 修为: 16, 时间: 4 },
    effectsPerLevel: { 根骨: 9, 神识: 7, 气运: 2 },
    combatPowerPerLevel: 0.06
  },

  {
    id: 'body-yellow-bone',
    pathId: 'body',
    name: '锻骨吐纳法',
    grade: '黄',
    description: '以呼吸打磨筋骨，稳扎稳打，最适合炼气筑基。',
    minRealmLevel: 1,
    maxLevel: 5,
    trainCost: { 修为: 7, 时间: 1 },
    effectsPerLevel: { 根骨: 4 },
    combatPowerPerLevel: 0.022
  },
  {
    id: 'body-mystic-furnace',
    pathId: 'body',
    name: '血炉淬身功',
    grade: '玄',
    description: '气血如炉，药力与灵气一并锤入肉身。',
    minRealmLevel: 3,
    maxLevel: 6,
    trainCost: { 修为: 9, 时间: 1 },
    effectsPerLevel: { 根骨: 5, 气运: 1 },
    combatPowerPerLevel: 0.03
  },
  {
    id: 'body-earth-mountain',
    pathId: 'body',
    name: '搬山炼体诀',
    grade: '地',
    description: '身若山岳，神识随气血贯通百骸。',
    minRealmLevel: 5,
    maxLevel: 7,
    trainCost: { 修为: 11, 时间: 2 },
    effectsPerLevel: { 根骨: 7, 神识: 2 },
    combatPowerPerLevel: 0.038
  },
  {
    id: 'body-heaven-golden',
    pathId: 'body',
    name: '金身不灭经',
    grade: '天',
    description: '血肉近乎法器，劫雷难摧，硬撼强敌更占上风。',
    minRealmLevel: 7,
    maxLevel: 8,
    trainCost: { 修为: 13, 时间: 3 },
    effectsPerLevel: { 根骨: 9, 神识: 2, 气运: 1 },
    combatPowerPerLevel: 0.046
  },
  {
    id: 'body-immortal-void',
    pathId: 'body',
    name: '不朽玄躯录',
    grade: '仙',
    description: '肉身自成小天地，举手投足皆有大道回响。',
    minRealmLevel: 9,
    maxLevel: 9,
    trainCost: { 修为: 15, 时间: 4 },
    effectsPerLevel: { 根骨: 11, 神识: 4, 气运: 1 },
    combatPowerPerLevel: 0.058
  },

  {
    id: 'spell-yellow-cloud',
    pathId: 'spell',
    name: '云篆入门篇',
    grade: '黄',
    description: '辨识基础云篆，增长悟性与施法稳定。',
    minRealmLevel: 1,
    maxLevel: 5,
    trainCost: { 修为: 8, 时间: 1 },
    effectsPerLevel: { 悟性: 3, 神识: 1 },
    combatPowerPerLevel: 0.022
  },
  {
    id: 'spell-mystic-light',
    pathId: 'spell',
    name: '玄光万象诀',
    grade: '玄',
    description: '以玄光演化术法变化，适合金丹元婴推演法术。',
    minRealmLevel: 3,
    maxLevel: 6,
    trainCost: { 修为: 10, 时间: 1 },
    effectsPerLevel: { 悟性: 4, 神识: 3 },
    combatPowerPerLevel: 0.032
  },
  {
    id: 'spell-earth-thunder',
    pathId: 'spell',
    name: '九霄雷文经',
    grade: '地',
    description: '以雷文淬炼识海，施法更快也更难被压制。',
    minRealmLevel: 5,
    maxLevel: 7,
    trainCost: { 修为: 12, 时间: 2 },
    effectsPerLevel: { 神识: 5, 悟性: 4 },
    combatPowerPerLevel: 0.04
  },
  {
    id: 'spell-heaven-universe',
    pathId: 'spell',
    name: '乾坤法藏',
    grade: '天',
    description: '万法归藏，合体大乘之间可借此构筑法域。',
    minRealmLevel: 7,
    maxLevel: 8,
    trainCost: { 修为: 14, 时间: 3 },
    effectsPerLevel: { 神识: 6, 悟性: 6, 气运: 1 },
    combatPowerPerLevel: 0.048
  },
  {
    id: 'spell-immortal-origin',
    pathId: 'spell',
    name: '太初万法真解',
    grade: '仙',
    description: '万法溯源，法修渡劫后方可窥见全貌。',
    minRealmLevel: 9,
    maxLevel: 9,
    trainCost: { 修为: 16, 时间: 4 },
    effectsPerLevel: { 神识: 8, 悟性: 8, 气运: 2 },
    combatPowerPerLevel: 0.06
  },

  {
    id: 'demonic-yellow-shadow',
    pathId: 'demonic',
    name: '夺影采气法',
    grade: '黄',
    description: '借偏门法诀夺取机缘，进境快但心神略躁。',
    minRealmLevel: 1,
    maxLevel: 5,
    trainCost: { 修为: 7, 时间: 1 },
    effectsPerLevel: { 气运: 3, 神识: 1 },
    combatPowerPerLevel: 0.026
  },
  {
    id: 'demonic-mystic-blood',
    pathId: 'demonic',
    name: '血煞炼魂诀',
    grade: '玄',
    description: '以血煞磨魂，战斗收益更凶，代价也更明显。',
    minRealmLevel: 3,
    maxLevel: 6,
    trainCost: { 修为: 9, 时间: 2 },
    effectsPerLevel: { 神识: 3, 气运: 3 },
    combatPowerPerLevel: 0.036
  },
  {
    id: 'demonic-earth-ghost',
    pathId: 'demonic',
    name: '幽冥夺命录',
    grade: '地',
    description: '摄魂夺命，化神炼虚之后凶名渐起。',
    minRealmLevel: 5,
    maxLevel: 7,
    trainCost: { 修为: 11, 时间: 3 },
    effectsPerLevel: { 根骨: 3, 神识: 4, 气运: 4 },
    combatPowerPerLevel: 0.045
  },
  {
    id: 'demonic-heaven-tribulation',
    pathId: 'demonic',
    name: '天魔劫火经',
    grade: '天',
    description: '以劫火炼心，越危险越能逼出潜力。',
    minRealmLevel: 7,
    maxLevel: 8,
    trainCost: { 修为: 13, 时间: 4 },
    effectsPerLevel: { 根骨: 4, 神识: 5, 气运: 5 },
    combatPowerPerLevel: 0.054
  },
  {
    id: 'demonic-immortal-chaos',
    pathId: 'demonic',
    name: '混元魔胎真经',
    grade: '仙',
    description: '凶险至极的仙阶邪法，渡劫之后才勉强能压住反噬。',
    minRealmLevel: 9,
    maxLevel: 9,
    trainCost: { 修为: 16, 时间: 5 },
    effectsPerLevel: { 根骨: 5, 神识: 7, 气运: 7 },
    combatPowerPerLevel: 0.066
  }
];

export function getTechnique(techniqueId: string): TechniqueDefinition | undefined {
  return techniques.find(technique => technique.id === techniqueId);
}

export function getBaseTechnique(pathId: CultivationPathId): TechniqueDefinition | undefined {
  return techniques.find(technique => technique.pathId === pathId && technique.grade === '黄');
}

export function getEligibleTechnique(pathId: CultivationPathId, realmLevel: number): TechniqueDefinition | undefined {
  const eligibleTechniques = techniques.filter(technique => {
    return technique.pathId === pathId && realmLevel >= technique.minRealmLevel;
  });

  return eligibleTechniques[eligibleTechniques.length - 1];
}
