import type { Attributes, CultivationPathId, TechniqueDefinition, TechniqueGrade } from '@/types';

export const techniqueGrades: TechniqueGrade[] = ['黄', '玄', '地', '天', '仙'];

type TechniqueSeed = {
  id: string;
  name: string;
  pathId: CultivationPathId;
  grade: TechniqueGrade;
  description: string;
  effectsPerLevel: Partial<Attributes>;
};

const gradeSettings: Record<TechniqueGrade, Pick<TechniqueDefinition, 'minRealmLevel' | 'maxLevel' | 'trainCost' | 'combatPowerPerLevel'>> = {
  黄: { minRealmLevel: 1, maxLevel: 5, trainCost: { 修为: 8, 时间: 1 }, combatPowerPerLevel: 0.024 },
  玄: { minRealmLevel: 3, maxLevel: 6, trainCost: { 修为: 10, 时间: 2 }, combatPowerPerLevel: 0.034 },
  地: { minRealmLevel: 5, maxLevel: 7, trainCost: { 修为: 12, 时间: 4 }, combatPowerPerLevel: 0.044 },
  天: { minRealmLevel: 7, maxLevel: 8, trainCost: { 修为: 14, 时间: 8 }, combatPowerPerLevel: 0.054 },
  仙: { minRealmLevel: 9, maxLevel: 9, trainCost: { 修为: 16, 时间: 16 }, combatPowerPerLevel: 0.068 }
};

const techniqueSeeds: TechniqueSeed[] = [
  // 剑修
  { id: 'sword-yellow-edge', pathId: 'sword', grade: '黄', name: '青锋引气诀', description: '以剑意牵引灵气，重在磨砺根骨与出手锋芒。', effectsPerLevel: { 根骨: 3, 神识: 1 } },
  { id: 'sword-yellow-bamboo', pathId: 'sword', grade: '黄', name: '竹影剑诀', description: '剑路轻灵，借竹影悟出进退之机。', effectsPerLevel: { 根骨: 2, 悟性: 2 } },
  { id: 'sword-yellow-stone', pathId: 'sword', grade: '黄', name: '磨石剑经', description: '反复磨剑磨心，胜在根基扎实。', effectsPerLevel: { 根骨: 4 } },
  { id: 'sword-yellow-wind', pathId: 'sword', grade: '黄', name: '风痕剑谱', description: '剑随风走，出手更快也更会寻隙。', effectsPerLevel: { 根骨: 2, 气运: 1, 神识: 1 } },
  { id: 'sword-mystic-rain', pathId: 'sword', grade: '玄', name: '听雨剑经', description: '剑势如雨，连绵不绝，凝练神识与杀伐。', effectsPerLevel: { 根骨: 4, 神识: 2 } },
  { id: 'sword-mystic-frost', pathId: 'sword', grade: '玄', name: '寒潭剑录', description: '剑意沉入寒潭，出剑前先镇住心神。', effectsPerLevel: { 根骨: 3, 神识: 3 } },
  { id: 'sword-mystic-thunder', pathId: 'sword', grade: '玄', name: '惊雷剑章', description: '以雷声养剑胆，适合正面破敌。', effectsPerLevel: { 根骨: 5, 气运: 1 } },
  { id: 'sword-mystic-shadow', pathId: 'sword', grade: '玄', name: '流影分光剑', description: '剑光化影，神识越稳，剑路越繁。', effectsPerLevel: { 神识: 3, 悟性: 2, 根骨: 1 } },
  { id: 'sword-earth-cloud', pathId: 'sword', grade: '地', name: '云海万剑录', description: '一念起而万剑随，重在元神御剑。', effectsPerLevel: { 根骨: 5, 神识: 4, 悟性: 1 } },
  { id: 'sword-earth-mountain', pathId: 'sword', grade: '地', name: '断岳剑典', description: '剑势厚重，专破强敌护体。', effectsPerLevel: { 根骨: 7, 神识: 2 } },
  { id: 'sword-earth-moon', pathId: 'sword', grade: '地', name: '孤月剑书', description: '月下养剑，剑心越静越能洞见破绽。', effectsPerLevel: { 神识: 5, 悟性: 3 } },
  { id: 'sword-earth-dragon', pathId: 'sword', grade: '地', name: '潜龙剑诀', description: '剑意藏锋，遇强则腾。', effectsPerLevel: { 根骨: 4, 神识: 3, 气运: 2 } },
  { id: 'sword-heaven-star', pathId: 'sword', grade: '天', name: '星河剑典', description: '借星河之势铸剑域，合体之后方能承载其锋芒。', effectsPerLevel: { 根骨: 7, 神识: 5, 气运: 1 } },
  { id: 'sword-heaven-nine', pathId: 'sword', grade: '天', name: '九曜剑图', description: '九曜入剑，剑域变化更繁。', effectsPerLevel: { 根骨: 6, 神识: 6, 悟性: 2 } },
  { id: 'sword-heaven-void', pathId: 'sword', grade: '天', name: '虚空藏剑诀', description: '藏剑于虚，出剑时近乎无迹。', effectsPerLevel: { 神识: 7, 根骨: 4, 气运: 2 } },
  { id: 'sword-heaven-kill', pathId: 'sword', grade: '天', name: '天刑杀剑经', description: '杀伐极重，剑成之日劫数也近。', effectsPerLevel: { 根骨: 8, 神识: 4, 气运: 1 } },
  { id: 'sword-immortal-sky', pathId: 'sword', grade: '仙', name: '太上斩天经', description: '剑意近道，一剑落而万法开。', effectsPerLevel: { 根骨: 9, 神识: 7, 气运: 2 } },
  { id: 'sword-immortal-one', pathId: 'sword', grade: '仙', name: '一剑生灭录', description: '一剑之中含生灭转机。', effectsPerLevel: { 根骨: 8, 神识: 8, 悟性: 3 } },
  { id: 'sword-immortal-taixu', pathId: 'sword', grade: '仙', name: '太虚剑藏', description: '剑藏太虚，神魂可御万象为锋。', effectsPerLevel: { 神识: 10, 根骨: 6, 气运: 2 } },
  { id: 'sword-immortal-dao', pathId: 'sword', grade: '仙', name: '归一道剑真篇', description: '万剑归一，剑道归真。', effectsPerLevel: { 根骨: 9, 神识: 6, 悟性: 4 } },

  // 体修
  { id: 'body-yellow-bone', pathId: 'body', grade: '黄', name: '锻骨吐纳法', description: '以呼吸打磨筋骨，最适合炼气筑基。', effectsPerLevel: { 根骨: 4 } },
  { id: 'body-yellow-iron', pathId: 'body', grade: '黄', name: '铁衣功', description: '皮肉如铁衣，先求不败。', effectsPerLevel: { 根骨: 3, 神识: 1 } },
  { id: 'body-yellow-tiger', pathId: 'body', grade: '黄', name: '伏虎炼形诀', description: '摹虎势炼筋骨，气血更盛。', effectsPerLevel: { 根骨: 3, 气运: 1 } },
  { id: 'body-yellow-breath', pathId: 'body', grade: '黄', name: '长息养身法', description: '吐纳悠长，修身也修耐性。', effectsPerLevel: { 根骨: 2, 悟性: 1, 神识: 1 } },
  { id: 'body-mystic-furnace', pathId: 'body', grade: '玄', name: '血炉淬身功', description: '气血如炉，药力与灵气一并锤入肉身。', effectsPerLevel: { 根骨: 5, 气运: 1 } },
  { id: 'body-mystic-jade', pathId: 'body', grade: '玄', name: '玉骨真诀', description: '骨如玉质，韧而不脆。', effectsPerLevel: { 根骨: 4, 神识: 2 } },
  { id: 'body-mystic-roar', pathId: 'body', grade: '玄', name: '龙象吼身法', description: '以声震脏腑，气血奔流如潮。', effectsPerLevel: { 根骨: 6 } },
  { id: 'body-mystic-stone', pathId: 'body', grade: '玄', name: '磐石镇脉功', description: '镇住经脉浮动，越打越稳。', effectsPerLevel: { 根骨: 4, 气运: 2 } },
  { id: 'body-earth-mountain', pathId: 'body', grade: '地', name: '搬山炼体诀', description: '身若山岳，神识随气血贯通百骸。', effectsPerLevel: { 根骨: 7, 神识: 2 } },
  { id: 'body-earth-gold', pathId: 'body', grade: '地', name: '金刚伏魔功', description: '伏魔先伏己身，肉身更难动摇。', effectsPerLevel: { 根骨: 6, 神识: 3 } },
  { id: 'body-earth-sea', pathId: 'body', grade: '地', name: '沧海炼血经', description: '气血如海，久战不竭。', effectsPerLevel: { 根骨: 6, 气运: 2, 悟性: 1 } },
  { id: 'body-earth-ape', pathId: 'body', grade: '地', name: '通臂神猿录', description: '筋骨贯通，出手沉猛。', effectsPerLevel: { 根骨: 8, 神识: 1 } },
  { id: 'body-heaven-golden', pathId: 'body', grade: '天', name: '金身不灭经', description: '血肉近乎法器，劫雷难摧。', effectsPerLevel: { 根骨: 9, 神识: 2, 气运: 1 } },
  { id: 'body-heaven-star', pathId: 'body', grade: '天', name: '星髓炼形篇', description: '引星髓炼肉身，身躯如藏星光。', effectsPerLevel: { 根骨: 8, 神识: 4, 气运: 1 } },
  { id: 'body-heaven-void', pathId: 'body', grade: '天', name: '虚空玄甲功', description: '以虚空罡气覆体，攻守一体。', effectsPerLevel: { 根骨: 7, 神识: 5 } },
  { id: 'body-heaven-tribulation', pathId: 'body', grade: '天', name: '百劫锻身录', description: '借劫数淬炼，伤痕也成根基。', effectsPerLevel: { 根骨: 10, 气运: 2 } },
  { id: 'body-immortal-void', pathId: 'body', grade: '仙', name: '不朽玄躯录', description: '肉身自成小天地，举手投足皆有大道回响。', effectsPerLevel: { 根骨: 11, 神识: 4, 气运: 1 } },
  { id: 'body-immortal-sun', pathId: 'body', grade: '仙', name: '大日琉璃身', description: '气血如日，琉璃无垢。', effectsPerLevel: { 根骨: 10, 神识: 5, 气运: 2 } },
  { id: 'body-immortal-chaos', pathId: 'body', grade: '仙', name: '混元真身诀', description: '混元入体，万法难侵。', effectsPerLevel: { 根骨: 12, 悟性: 2, 神识: 3 } },
  { id: 'body-immortal-dao', pathId: 'body', grade: '仙', name: '道胎不灭篇', description: '身为道胎，败而不毁。', effectsPerLevel: { 根骨: 11, 神识: 3, 气运: 3 } },

  // 法修
  { id: 'spell-yellow-cloud', pathId: 'spell', grade: '黄', name: '云篆入门篇', description: '辨识基础云篆，增长悟性与施法稳定。', effectsPerLevel: { 悟性: 3, 神识: 1 } },
  { id: 'spell-yellow-water', pathId: 'spell', grade: '黄', name: '水镜术抄', description: '以水镜观术理，心神更清。', effectsPerLevel: { 神识: 2, 悟性: 2 } },
  { id: 'spell-yellow-fire', pathId: 'spell', grade: '黄', name: '小五行火诀', description: '从火行小术入门，明白灵气变化。', effectsPerLevel: { 悟性: 3, 根骨: 1 } },
  { id: 'spell-yellow-script', pathId: 'spell', grade: '黄', name: '符笔养神法', description: '以符笔养神，细处见功夫。', effectsPerLevel: { 神识: 3, 悟性: 1 } },
  { id: 'spell-mystic-light', pathId: 'spell', grade: '玄', name: '玄光万象诀', description: '以玄光演化术法变化，适合金丹元婴推演法术。', effectsPerLevel: { 悟性: 4, 神识: 3 } },
  { id: 'spell-mystic-wind', pathId: 'spell', grade: '玄', name: '乘风御诀', description: '术法借风而动，施法更灵巧。', effectsPerLevel: { 神识: 3, 悟性: 2, 气运: 1 } },
  { id: 'spell-mystic-star', pathId: 'spell', grade: '玄', name: '星盘推演术', description: '借星盘推算术路，悟性更见长。', effectsPerLevel: { 悟性: 5, 神识: 1 } },
  { id: 'spell-mystic-seal', pathId: 'spell', grade: '玄', name: '三才法印', description: '印法定三才，攻守皆稳。', effectsPerLevel: { 神识: 4, 根骨: 1, 悟性: 1 } },
  { id: 'spell-earth-thunder', pathId: 'spell', grade: '地', name: '九霄雷文经', description: '以雷文淬炼识海，施法更快也更难被压制。', effectsPerLevel: { 神识: 5, 悟性: 4 } },
  { id: 'spell-earth-moon', pathId: 'spell', grade: '地', name: '太阴玄章', description: '月华入识海，术法更重变化。', effectsPerLevel: { 神识: 6, 悟性: 2, 气运: 1 } },
  { id: 'spell-earth-fire', pathId: 'spell', grade: '地', name: '离火炼法录', description: '以离火炼去杂念，法力更纯。', effectsPerLevel: { 悟性: 5, 神识: 3, 根骨: 1 } },
  { id: 'spell-earth-river', pathId: 'spell', grade: '地', name: '天河布阵经', description: '以阵势统御法术，越战越顺。', effectsPerLevel: { 神识: 5, 悟性: 3, 气运: 1 } },
  { id: 'spell-heaven-universe', pathId: 'spell', grade: '天', name: '乾坤法藏', description: '万法归藏，合体大乘之间可借此构筑法域。', effectsPerLevel: { 神识: 6, 悟性: 6, 气运: 1 } },
  { id: 'spell-heaven-sky', pathId: 'spell', grade: '天', name: '太清天符经', description: '符法近天，举手成章。', effectsPerLevel: { 神识: 7, 悟性: 5 } },
  { id: 'spell-heaven-dream', pathId: 'spell', grade: '天', name: '梦蝶化法篇', description: '梦中演法，醒后术理自明。', effectsPerLevel: { 悟性: 7, 神识: 4, 气运: 1 } },
  { id: 'spell-heaven-five', pathId: 'spell', grade: '天', name: '五雷正法总纲', description: '五雷归一，正法破邪。', effectsPerLevel: { 神识: 8, 悟性: 3, 根骨: 1 } },
  { id: 'spell-immortal-origin', pathId: 'spell', grade: '仙', name: '太初万法真解', description: '万法溯源，法修渡劫后方可窥见全貌。', effectsPerLevel: { 神识: 8, 悟性: 8, 气运: 2 } },
  { id: 'spell-immortal-book', pathId: 'spell', grade: '仙', name: '无字天书残卷', description: '书中无字，悟得多少全凭道心。', effectsPerLevel: { 悟性: 10, 神识: 6, 气运: 2 } },
  { id: 'spell-immortal-void', pathId: 'spell', grade: '仙', name: '虚皇法典', description: '虚实之间皆可为术。', effectsPerLevel: { 神识: 9, 悟性: 7, 根骨: 1 } },
  { id: 'spell-immortal-dao', pathId: 'spell', grade: '仙', name: '大道衍法录', description: '以一法推万法，以万法证大道。', effectsPerLevel: { 神识: 8, 悟性: 9, 气运: 1 } },

  // 邪修
  { id: 'demonic-yellow-shadow', pathId: 'demonic', grade: '黄', name: '夺影采气法', description: '借偏门法诀夺取机缘，进境快但心神略躁。', effectsPerLevel: { 气运: 3, 神识: 1 } },
  { id: 'demonic-yellow-bone', pathId: 'demonic', grade: '黄', name: '蚀骨炼息诀', description: '以险法炼息，代价不小，收益也快。', effectsPerLevel: { 根骨: 2, 气运: 2 } },
  { id: 'demonic-yellow-ghost', pathId: 'demonic', grade: '黄', name: '小鬼听令术', description: '以杂术扰敌，胜在诡异。', effectsPerLevel: { 神识: 2, 气运: 2 } },
  { id: 'demonic-yellow-poison', pathId: 'demonic', grade: '黄', name: '毒雾藏身法', description: '毒雾遮形，机缘与风险并行。', effectsPerLevel: { 气运: 3, 悟性: 1 } },
  { id: 'demonic-mystic-blood', pathId: 'demonic', grade: '玄', name: '血煞炼魂诀', description: '以血煞磨魂，战斗收益更凶。', effectsPerLevel: { 神识: 3, 气运: 3 } },
  { id: 'demonic-mystic-soul', pathId: 'demonic', grade: '玄', name: '摄魂秘卷', description: '摄人心魄前，先要稳住自身识海。', effectsPerLevel: { 神识: 4, 气运: 2 } },
  { id: 'demonic-mystic-night', pathId: 'demonic', grade: '玄', name: '夜行夺命篇', description: '夜色中夺势，出手更狠。', effectsPerLevel: { 根骨: 3, 气运: 3 } },
  { id: 'demonic-mystic-curse', pathId: 'demonic', grade: '玄', name: '咒印养魔法', description: '咒印入身，悟性越高越能压住反噬。', effectsPerLevel: { 神识: 3, 悟性: 2, 气运: 1 } },
  { id: 'demonic-earth-ghost', pathId: 'demonic', grade: '地', name: '幽冥夺命录', description: '摄魂夺命，化神炼虚之后凶名渐起。', effectsPerLevel: { 根骨: 3, 神识: 4, 气运: 4 } },
  { id: 'demonic-earth-bloodsea', pathId: 'demonic', grade: '地', name: '血海浮屠经', description: '血海浮屠，越战越凶。', effectsPerLevel: { 根骨: 4, 神识: 4, 气运: 3 } },
  { id: 'demonic-earth-boneking', pathId: 'demonic', grade: '地', name: '白骨王庭录', description: '白骨成庭，邪气自成法度。', effectsPerLevel: { 根骨: 5, 神识: 3, 气运: 2 } },
  { id: 'demonic-earth-mirror', pathId: 'demonic', grade: '地', name: '照魂魔镜篇', description: '照见魂魄破绽，也照见自身执念。', effectsPerLevel: { 神识: 6, 悟性: 2, 气运: 1 } },
  { id: 'demonic-heaven-tribulation', pathId: 'demonic', grade: '天', name: '天魔劫火经', description: '以劫火炼心，越危险越能逼出潜力。', effectsPerLevel: { 根骨: 4, 神识: 5, 气运: 5 } },
  { id: 'demonic-heaven-heart', pathId: 'demonic', grade: '天', name: '他化自在经', description: '心魔为用，欲念为刃。', effectsPerLevel: { 神识: 7, 气运: 5 } },
  { id: 'demonic-heaven-moon', pathId: 'demonic', grade: '天', name: '蚀月魔典', description: '吞月华而炼魔性，凶中藏机。', effectsPerLevel: { 根骨: 5, 神识: 4, 气运: 4 } },
  { id: 'demonic-heaven-god', pathId: 'demonic', grade: '天', name: '逆神夺运录', description: '逆神夺运，越界争机。', effectsPerLevel: { 气运: 8, 神识: 4 } },
  { id: 'demonic-immortal-chaos', pathId: 'demonic', grade: '仙', name: '混元魔胎真经', description: '凶险至极的仙阶邪法，渡劫之后才勉强能压住反噬。', effectsPerLevel: { 根骨: 5, 神识: 7, 气运: 7 } },
  { id: 'demonic-immortal-nine', pathId: 'demonic', grade: '仙', name: '九幽不死经', description: '九幽借命，魔性不灭。', effectsPerLevel: { 根骨: 6, 神识: 6, 气运: 7 } },
  { id: 'demonic-immortal-dream', pathId: 'demonic', grade: '仙', name: '大自在梦魔录', description: '梦中成魔，醒时夺道。', effectsPerLevel: { 神识: 9, 悟性: 3, 气运: 6 } },
  { id: 'demonic-immortal-blood', pathId: 'demonic', grade: '仙', name: '血河证道篇', description: '血河尽头，亦可证道。', effectsPerLevel: { 根骨: 7, 神识: 5, 气运: 7 } }
];

export const techniques: TechniqueDefinition[] = techniqueSeeds.map((seed, index) => {
  const settings = gradeSettings[seed.grade];
  const variantBonus = (index % 4) * 0.002;

  return {
    ...seed,
    minRealmLevel: settings.minRealmLevel,
    maxLevel: settings.maxLevel,
    trainCost: settings.trainCost,
    combatPowerPerLevel: settings.combatPowerPerLevel + variantBonus
  };
});

export function getTechnique(techniqueId: string): TechniqueDefinition | undefined {
  return techniques.find(technique => technique.id === techniqueId);
}

export function getBaseTechnique(pathId: CultivationPathId): TechniqueDefinition | undefined {
  return techniques.find(technique => technique.pathId === pathId && technique.grade === '黄');
}

export function getAvailableTechniqueRewards(
  pathId: CultivationPathId,
  realmLevel: number,
  knownTechniqueIds: string[]
): TechniqueDefinition[] {
  const knownSet = new Set(knownTechniqueIds);
  const currentGrade = getTechniqueGradeForRealm(realmLevel);

  return techniques.filter(technique => {
    return technique.pathId === pathId
      && technique.grade === currentGrade
      && !knownSet.has(technique.id);
  });
}

export function getTechniqueGradeForRealm(realmLevel: number): TechniqueGrade {
  if (realmLevel >= 9) return '仙';
  if (realmLevel >= 7) return '天';
  if (realmLevel >= 5) return '地';
  if (realmLevel >= 3) return '玄';
  return '黄';
}
