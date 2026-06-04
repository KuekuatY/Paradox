export interface AchievementInfo {
  id: string;
  name: string;
  description: string;
}

export const achievementCatalog: AchievementInfo[] = [
  { id: '初入仙途', name: '初入仙途', description: '踏上第一世修仙路。' },
  { id: '初历世事', name: '初历世事', description: '经历一次修仙事件。' },
  { id: '三十年风雨', name: '三十年风雨', description: '经历三十次世事流转。' },
  { id: '道途初成', name: '道途初成', description: '完成一个道途目标。' },
  { id: '百炼成途', name: '百炼成途', description: '完成五个道途目标。' },
  { id: '筑基有成', name: '筑基有成', description: '突破至筑基期。' },
  { id: '金丹大道', name: '金丹大道', description: '突破至金丹期。' },
  { id: '元婴出窍', name: '元婴出窍', description: '突破至元婴期。' },
  { id: '化神问道', name: '化神问道', description: '突破至化神期。' },
  { id: '大乘在望', name: '大乘在望', description: '突破至大乘期。' },
  { id: '渡劫之身', name: '渡劫之身', description: '抵达渡劫期。' },
  { id: '一项通玄', name: '一项通玄', description: '任一五维属性达到三百。' },
  { id: '五维均衡', name: '五维均衡', description: '五维属性都达到一百二十。' },
  { id: '富甲仙门', name: '富甲仙门', description: '家境达到二百。' },
  { id: '传说命格', name: '传说命格', description: '抽得传说天赋。' },
  { id: '神话灵根', name: '神话灵根', description: '抽得神话灵根。' }
];

export function getAchievementInfo(id: string): AchievementInfo {
  return achievementCatalog.find(achievement => achievement.id === id) ?? {
    id,
    name: id,
    description: '未记录的机缘。'
  };
}
