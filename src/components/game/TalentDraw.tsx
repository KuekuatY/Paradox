import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/stores/gameStore';
import type { AttributeEffect, GrowthModifiers, Rarity, SpiritRoot, Talent } from '@/types';

type DrawStep = 'spiritRoot' | 'talent' | 'ready';

export default function TalentDraw() {
  const { drawSpiritRoot, drawTalent, startNewGame } = useGameStore();
  const [step, setStep] = useState<DrawStep>('spiritRoot');
  const [currentSpiritRoot, setCurrentSpiritRoot] = useState<SpiritRoot | null>(null);
  const [currentTalent, setCurrentTalent] = useState<Talent | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const handleDrawSpiritRoot = () => {
    setIsDrawing(true);

    setTimeout(() => {
      setCurrentSpiritRoot(drawSpiritRoot());
      setStep('talent');
      setIsDrawing(false);
    }, 1200);
  };

  const handleDrawTalent = () => {
    setIsDrawing(true);

    setTimeout(() => {
      setCurrentTalent(drawTalent());
      setStep('ready');
      setIsDrawing(false);
    }, 1200);
  };

  const handleConfirm = () => {
    if (!currentSpiritRoot || !currentTalent) return;

    startNewGame(currentSpiritRoot, currentTalent);
  };

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <AnimatePresence mode="wait">
        {isDrawing ? (
          <DrawingState key="drawing" label={step === 'spiritRoot' ? '正在观测灵根...' : '正在推演天赋...'} />
        ) : (
          <motion.div
            key={step}
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.94 }}
            className="w-full max-w-3xl px-4"
          >
            <div className="mb-6 grid grid-cols-2 gap-3 text-center text-sm">
              <StepBadge active={step === 'spiritRoot'} done={!!currentSpiritRoot} label="一观灵根" />
              <StepBadge active={step !== 'spiritRoot'} done={!!currentTalent} label="二定天赋" />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {currentSpiritRoot ? (
                <FateCard
                  title="灵根"
                  name={currentSpiritRoot.name}
                  rarity={currentSpiritRoot.rarity}
                  description={currentSpiritRoot.description}
                  effects={currentSpiritRoot.effect}
                  modifiers={currentSpiritRoot.modifiers}
                  seal="根"
                />
              ) : (
                <EmptyCard title="灵根未定" description="先观灵根，决定修炼底盘。" />
              )}

              {currentTalent ? (
                <FateCard
                  title="天赋"
                  name={currentTalent.name}
                  rarity={currentTalent.rarity}
                  description={currentTalent.description}
                  effects={currentTalent.effect}
                  modifiers={currentTalent.modifiers}
                  seal="命"
                />
              ) : (
                <EmptyCard title="天赋未定" description="灵根落定后，再推演此生天赋。" />
              )}
            </div>

            <div className="mt-8 text-center">
              {step === 'spiritRoot' && (
                <>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleDrawSpiritRoot}
                    className="ink-button-primary px-12 py-5 text-2xl"
                    animate={{ scale: [1, 1.02, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    抽取灵根
                  </motion.button>
                  <p className="mt-6 text-[#4f5d55]">灵根定其路，天赋定其势</p>
                </>
              )}

              {step === 'talent' && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleDrawTalent}
                  className="ink-button-primary px-12 py-5 text-2xl"
                >
                  抽取天赋
                </motion.button>
              )}

              {step === 'ready' && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleConfirm}
                  className="ink-button-primary px-12 py-5 text-2xl"
                >
                  踏入修仙路
                </motion.button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function DrawingState({ label }: { label: string }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center"
    >
      <motion.div
        className="flex h-32 w-32 items-center justify-center rounded-full border-4 border-[#9a5b2f] bg-[#fff8df]/70"
        animate={{
          scale: [1, 1.1, 1],
          rotate: [0, 360],
          opacity: [0.5, 1, 0.5]
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'linear'
        }}
      >
        <div className="text-5xl font-bold text-[#9a5b2f]">玄</div>
      </motion.div>
      <p className="mt-6 text-xl text-[#45564f]">{label}</p>
    </motion.div>
  );
}

function StepBadge({ active, done, label }: { active: boolean; done: boolean; label: string }) {
  return (
    <div
      className={`rounded-md border px-4 py-2 font-semibold ${
        active
          ? 'border-[#9a5b2f]/50 bg-[#f0dfad]/45 text-[#7a5426]'
          : done
            ? 'border-[#7f9a78]/40 bg-[#eef3df]/70 text-[#46694f]'
            : 'border-[#738275]/25 bg-[#fff9e8]/45 text-[#66766e]'
      }`}
    >
      {label}
    </div>
  );
}

function EmptyCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="min-h-[320px] rounded-lg border border-dashed border-[#738275]/35 bg-[#fff9e8]/35 p-8 text-center">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border-2 border-[#738275]/35 text-3xl font-bold text-[#738275]">
        ?
      </div>
      <h2 className="mb-3 text-2xl font-bold text-[#45564f]">{title}</h2>
      <p className="ink-muted">{description}</p>
    </div>
  );
}

function FateCard({
  title,
  name,
  rarity,
  description,
  effects,
  modifiers,
  seal
}: {
  title: string;
  name: string;
  rarity: Rarity;
  description: string;
  effects: AttributeEffect;
  modifiers?: GrowthModifiers;
  seal: string;
}) {
  const rarityColor = getRarityColor(rarity);
  const modifierTexts = formatModifiers(modifiers);

  return (
    <motion.div
      initial={{ scale: 0.96, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="ink-panel min-h-[320px] rounded-lg border-2 p-7"
      style={{ borderColor: rarityColor }}
    >
      <div className="text-center">
        <div className="ink-muted mb-2 text-sm">{title}</div>
        <div
          className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border-2 text-3xl font-bold"
          style={{ borderColor: rarityColor, color: rarityColor }}
        >
          {seal}
        </div>
        <h2 className="mb-2 text-3xl font-bold" style={{ color: rarityColor }}>
          {name}
        </h2>
        <div
          className="mb-4 inline-block rounded-full px-4 py-2 text-sm"
          style={{
            backgroundColor: `${rarityColor}20`,
            color: rarityColor
          }}
        >
          {rarity}
        </div>
        <p className="ink-muted mb-6 min-h-[48px]">{description}</p>

        {Object.keys(effects).length > 0 && (
          <div className="mb-4">
            <p className="ink-muted mb-2 text-sm">{title}效果</p>
            <div className="flex flex-wrap justify-center gap-2">
              {Object.entries(effects).map(([attr, value]) => (
                <EffectPill key={attr} label={attr} value={value ?? 0} />
              ))}
            </div>
          </div>
        )}

        {modifierTexts.length > 0 && (
          <div>
            <p className="ink-muted mb-2 text-sm">持续影响</p>
            <div className="flex flex-wrap justify-center gap-2">
              {modifierTexts.map(text => (
                <span
                  key={text}
                  className="rounded-full border border-[#738275]/25 bg-[#fffdf2]/70 px-3 py-1 text-sm font-semibold text-[#45564f]"
                >
                  {text}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

function EffectPill({ label, value }: { label: string; value: number }) {
  return (
    <span
      className={`rounded-full border px-3 py-1 text-sm font-semibold ${
        value > 0
          ? 'border-[#7f9a78]/45 bg-[#eef3df]/80 text-[#46694f]'
          : 'border-[#b98678]/45 bg-[#f4e2d8]/80 text-[#9a4c35]'
      }`}
    >
      {label} {value > 0 ? '+' : ''}{value}
    </span>
  );
}

function formatModifiers(modifiers?: GrowthModifiers): string[] {
  if (!modifiers) return [];

  const texts: string[] = [];
  if (modifiers.修为倍率) texts.push(`修为 x${modifiers.修为倍率}`);
  if (modifiers.属性倍率) texts.push(`属性 x${modifiers.属性倍率}`);
  if (modifiers.寿命倍率) texts.push(`寿命 x${modifiers.寿命倍率}`);
  if (modifiers.灾劫抗性) texts.push(`抗劫 ${modifiers.灾劫抗性 > 0 ? '+' : ''}${Math.round(modifiers.灾劫抗性 * 100)}%`);
  if (modifiers.事件权重) texts.push('事件倾向改变');

  return texts;
}

function getRarityColor(rarity: string): string {
  const colors: Record<string, string> = {
    '凡品': '#6f746d',
    '下品': '#59645f',
    '中品': '#5f7c64',
    '上品': '#355d58',
    '极品': '#7f6a3e',
    '神话': '#9a5b2f',
    '传说': '#a94d37'
  };
  return colors[rarity] || '#9CA3AF';
}
