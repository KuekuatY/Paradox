import type { Realm } from '@/types';

export const realms: Realm[] = [
  {
    name: '炼气期',
    level: 1,
    maxAge: 100,
    attributeCap: 20,
    cultivationRequired: 0,
    description: '吸纳灵气，引气入体',
    requirements: {
      minAge: 0,
      attributes: { 根骨: 0 }
    }
  },
  {
    name: '筑基期',
    level: 2,
    maxAge: 200,
    attributeCap: 60,
    cultivationRequired: 100,
    description: '筑就仙基，丹中气旋',
    requirements: {
      minAge: 20,
      attributes: { 根骨: 12, 悟性: 10, 气运: 6 }
    }
  },
  {
    name: '金丹期',
    level: 3,
    maxAge: 300,
    attributeCap: 100,
    cultivationRequired: 150,
    description: '丹成金色，金丹入腹',
    requirements: {
      minAge: 50,
      attributes: { 根骨: 32, 悟性: 28, 气运: 20 }
    }
  },
  {
    name: '元婴期',
    level: 4,
    maxAge: 500,
    attributeCap: 160,
    cultivationRequired: 300,
    description: '孕育元婴，神魂出窍',
    requirements: {
      minAge: 100,
      attributes: { 根骨: 60, 悟性: 52, 气运: 40 }
    }
  },
  {
    name: '化神期',
    level: 5,
    maxAge: 1000,
    attributeCap: 240,
    cultivationRequired: 750,
    description: '元婴化神，神识万里',
    requirements: {
      minAge: 200,
      attributes: { 根骨: 105, 悟性: 92, 气运: 72, 家境: 45 }
    }
  },
  {
    name: '炼虚期',
    level: 6,
    maxAge: 3000,
    attributeCap: 320,
    cultivationRequired: 1800,
    description: '炼化虚妄，身化天地',
    requirements: {
      minAge: 400,
      attributes: { 根骨: 170, 悟性: 150, 气运: 120, 家境: 90 }
    }
  },
  {
    name: '合体期',
    level: 7,
    maxAge: 7000,
    attributeCap: 400,
    cultivationRequired: 4000,
    description: '神魂合体，初窥天道',
    requirements: {
      minAge: 800,
      attributes: { 根骨: 250, 悟性: 225, 气运: 180, 家境: 145 }
    }
  },
  {
    name: '大乘期',
    level: 8,
    maxAge: 15000,
    attributeCap: 460,
    cultivationRequired: 9000,
    description: '功德圆满，只待飞升',
    requirements: {
      minAge: 1500,
      attributes: { 根骨: 335, 悟性: 305, 气运: 250, 家境: 210 }
    }
  },
  {
    name: '渡劫期',
    level: 9,
    maxAge: Infinity,
    attributeCap: 500,
    cultivationRequired: 20000,
    description: '历经天劫，飞升成仙',
    requirements: {
      minAge: 3000,
      attributes: { 根骨: 425, 悟性: 390, 气运: 330, 家境: 280 }
    }
  }
];
