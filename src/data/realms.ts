import type { Realm } from '@/types';

export const realms: Realm[] = [
  {
    name: '幼年期',
    level: 0,
    maxAge: 100,
    attributeCap: 40,
    cultivationRequired: 0,
    description: '蒙昧未开，静待引气入体',
    requirements: {
      minAge: 0,
      attributes: {}
    }
  },
  {
    name: '炼气期',
    level: 1,
    maxAge: 100,
    attributeCap: 40,
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
    attributeCap: 120,
    cultivationRequired: 100,
    description: '筑就仙基，丹中气旋',
    requirements: {
      minAge: 20,
      attributes: { 根骨: 36, 悟性: 32, 气运: 24 }
    }
  },
  {
    name: '金丹期',
    level: 3,
    maxAge: 300,
    attributeCap: 210,
    cultivationRequired: 150,
    description: '丹成金色，金丹入腹',
    requirements: {
      minAge: 50,
      attributes: { 根骨: 68, 悟性: 58, 气运: 42 }
    }
  },
  {
    name: '元婴期',
    level: 4,
    maxAge: 500,
    attributeCap: 310,
    cultivationRequired: 300,
    description: '孕育元婴，神魂出窍',
    requirements: {
      minAge: 100,
      attributes: { 根骨: 125, 悟性: 110, 气运: 82 }
    }
  },
  {
    name: '化神期',
    level: 5,
    maxAge: 1000,
    attributeCap: 420,
    cultivationRequired: 750,
    description: '元婴化神，神识万里',
    requirements: {
      minAge: 200,
      attributes: { 根骨: 215, 悟性: 190, 神识: 170, 气运: 145 }
    }
  },
  {
    name: '炼虚期',
    level: 6,
    maxAge: 3000,
    attributeCap: 540,
    cultivationRequired: 1800,
    description: '炼化虚妄，身化天地',
    requirements: {
      minAge: 400,
      attributes: { 根骨: 320, 悟性: 285, 神识: 260, 气运: 220 }
    }
  },
  {
    name: '合体期',
    level: 7,
    maxAge: 7000,
    attributeCap: 660,
    cultivationRequired: 4000,
    description: '神魂合体，初窥天道',
    requirements: {
      minAge: 800,
      attributes: { 根骨: 440, 悟性: 390, 神识: 360, 气运: 315 }
    }
  },
  {
    name: '大乘期',
    level: 8,
    maxAge: 15000,
    attributeCap: 740,
    cultivationRequired: 9000,
    description: '功德圆满，只待飞升',
    requirements: {
      minAge: 1500,
      attributes: { 根骨: 575, 悟性: 515, 神识: 480, 气运: 425 }
    }
  },
  {
    name: '渡劫期',
    level: 9,
    maxAge: 50000,
    attributeCap: 800,
    cultivationRequired: 20000,
    description: '历经天劫，飞升成仙',
    requirements: {
      minAge: 3000,
      attributes: { 根骨: 690, 悟性: 625, 神识: 600, 气运: 535 }
    }
  }
];
