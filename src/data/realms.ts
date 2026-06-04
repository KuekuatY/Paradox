import type { Realm } from '@/types';

export const realms: Realm[] = [
  {
    name: '炼气期',
    level: 1,
    maxAge: 100,
    cultivationRequired: 0,
    description: '吸纳灵气，引气入体',
    requirements: {
      minAge: 0,
      attributes: { 根骨: 1 }
    }
  },
  {
    name: '筑基期',
    level: 2,
    maxAge: 200,
    cultivationRequired: 100,
    description: '筑就仙基，丹中气旋',
    requirements: {
      minAge: 20,
      attributes: { 根骨: 3, 悟性: 3, 气运: 2 }
    }
  },
  {
    name: '金丹期',
    level: 3,
    maxAge: 300,
    cultivationRequired: 150,
    description: '丹成金色，金丹入腹',
    requirements: {
      minAge: 50,
      attributes: { 根骨: 5, 悟性: 4, 气运: 3 }
    }
  },
  {
    name: '元婴期',
    level: 4,
    maxAge: 500,
    cultivationRequired: 300,
    description: '孕育元婴，神魂出窍',
    requirements: {
      minAge: 100,
      attributes: { 根骨: 7, 悟性: 6, 气运: 4 }
    }
  },
  {
    name: '化神期',
    level: 5,
    maxAge: 1000,
    cultivationRequired: 750,
    description: '元婴化神，神识万里',
    requirements: {
      minAge: 200,
      attributes: { 根骨: 8, 悟性: 7, 气运: 5, 家境: 5 }
    }
  },
  {
    name: '炼虚期',
    level: 6,
    maxAge: 3000,
    cultivationRequired: 1800,
    description: '炼化虚妄，身化天地',
    requirements: {
      minAge: 400,
      attributes: { 根骨: 9, 悟性: 8, 气运: 6, 家境: 6 }
    }
  },
  {
    name: '合体期',
    level: 7,
    maxAge: 7000,
    cultivationRequired: 4000,
    description: '神魂合体，初窥天道',
    requirements: {
      minAge: 800,
      attributes: { 根骨: 9, 悟性: 9, 气运: 8, 家境: 7 }
    }
  },
  {
    name: '大乘期',
    level: 8,
    maxAge: 15000,
    cultivationRequired: 9000,
    description: '功德圆满，只待飞升',
    requirements: {
      minAge: 1500,
      attributes: { 根骨: 10, 悟性: 10, 气运: 9, 家境: 8 }
    }
  },
  {
    name: '渡劫期',
    level: 9,
    maxAge: Infinity,
    cultivationRequired: 20000,
    description: '历经天劫，飞升成仙',
    requirements: {
      minAge: 3000,
      attributes: { 根骨: 10, 悟性: 10, 气运: 10, 家境: 9 }
    }
  }
];
