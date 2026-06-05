import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/stores/gameStore';
import type { AttributeEffect, GrowthModifiers, Rarity, SpiritRoot, Talent } from '@/types';

type DrawStep = 'spiritRoot' | 'talent' | 'selectTalent' | 'ready';

export default function TalentDraw() {
  const { drawSpiritRoot, drawTalentOptions, startNewGame } = useGameStore();
  const [step, setStep] = useState<DrawStep>('spiritRoot');
  const [currentSpiritRoot, setCurrentSpiritRoot] = useState<SpiritRoot | null>(null);
  const [currentTalent, setCurrentTalent] = useState<Talent | null>(null);
  const [talentOptions, setTalentOptions] = useState<Talent[]>([]);
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
      setTalentOptions(drawTalentOptions(3));
      setCurrentTalent(null);
      setStep('selectTalent');
      setIsDrawing(false);
    }, 1200);
  };

  const handleSelectTalent = (talent: Talent) => {
    setCurrentTalent(talent);
    setStep('ready');
  };

  const handleConfirm = () => {
    if (!currentSpiritRoot || !currentTalent) return;

    startNewGame(currentSpiritRoot, currentTalent);
  };

  return (
    <div className="flex flex-col items-center justify-center py-6 sm:py-12">
      <AnimatePresence mode="wait">
        {isDrawing ? (
          <DrawingState key="drawing" label={step === 'spiritRoot' ? '正在观测灵根...' : '正在推演天赋...'} />
        ) : (
          <motion.div
            key={step}
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.94 }}
            className="w-full max-w-3xl px-0 sm:px-4"
          >
            <div className="mb-4 grid grid-cols-2 gap-2 text-center text-sm sm:mb-6 sm:gap-3">
              <StepBadge active={step === 'spiritRoot'} done={!!currentSpiritRoot} label="一观灵根" />
              <StepBadge active={step !== 'spiritRoot' && !currentTalent} done={!!currentTalent} label="二择天赋" />
            </div>

            <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
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
              ) : talentOptions.length > 0 ? (
                <TalentChoicePanel choices={talentOptions} onSelect={handleSelectTalent} />
              ) : (
                <EmptyCard title="天赋未定" description="灵根落定后，再推演此生天赋。" />
              )}
            </div>

            <div className="mt-6 text-center sm:mt-8">
              {step === 'spiritRoot' && (
                <>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleDrawSpiritRoot}
                    className="ink-button-primary w-full px-8 py-4 text-xl sm:w-auto sm:px-12 sm:py-5 sm:text-2xl"
                    animate={{ scale: [1, 1.02, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    抽取灵根
                  </motion.button>
                  <p className="mt-4 text-sm text-[#4f5d55] sm:mt-6 sm:text-base">灵根定其路，天赋定其势</p>
                </>
              )}

              {step === 'talent' && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleDrawTalent}
                  className="ink-button-primary w-full px-8 py-4 text-xl sm:w-auto sm:px-12 sm:py-5 sm:text-2xl"
                >
                  抽取天赋
                </motion.button>
              )}

              {step === 'selectTalent' && (
                <p className="text-sm text-[#4f5d55] sm:text-base">三道命格已现，择其一而定此生。</p>
              )}

              {step === 'ready' && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleConfirm}
                  className="ink-button-primary w-full px-8 py-4 text-xl sm:w-auto sm:px-12 sm:py-5 sm:text-2xl"
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
        className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-[#9a5b2f] bg-[#fff8df]/70 sm:h-32 sm:w-32"
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
        <div className="text-4xl font-bold text-[#9a5b2f] sm:text-5xl">玄</div>
      </motion.div>
      <p className="mt-4 text-lg text-[#45564f] sm:mt-6 sm:text-xl">{label}</p>
    </motion.div>
  );
}

function StepBadge({ active, done, label }: { active: boolean; done: boolean; label: string }) {
  return (
    <div
      className={`rounded-md border px-2 py-2 font-semibold sm:px-4 ${
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
    <div className="min-h-[220px] rounded-lg border border-dashed border-[#738275]/35 bg-[#fff9e8]/35 p-5 text-center sm:min-h-[320px] sm:p-8">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border-2 border-[#738275]/35 text-2xl font-bold text-[#738275] sm:h-16 sm:w-16 sm:text-3xl">
        ?
      </div>
      <h2 className="mb-3 text-xl font-bold text-[#45564f] sm:text-2xl">{title}</h2>
      <p className="ink-muted text-sm sm:text-base">{description}</p>
    </div>
  );
}

function TalentChoicePanel({
  choices,
  onSelect
}: {
  choices: Talent[];
  onSelect: (talent: Talent) => void;
}) {
  return (
    <div className="ink-panel min-h-[260px] rounded-lg p-4 sm:min-h-[320px] sm:p-5">
      <div className="mb-4 text-center">
        <div className="ink-muted mb-1 text-sm">天赋</div>
        <h2 className="text-xl font-bold text-[#45564f] sm:text-2xl">三道命格</h2>
      </div>

      <div className="grid gap-3">
        {choices.map(talent => {
          const rarityColor = getRarityColor(talent.rarity);
          const modifierTexts = formatModifiers(talent.modifiers);

          return (
            <motion.button
              key={talent.id}
              type="button"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelect(talent)}
              className="rounded-md border bg-[#fffdf2]/70 p-3 text-left transition hover:bg-[#f7edd0]/80 sm:p-4"
              style={{ borderColor: `${rarityColor}80` }}
            >
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <span className="text-base font-bold sm:text-lg" style={{ color: rarityColor }}>
                  {talent.name}
                </span>
                <span
                  className="rounded-full px-2 py-0.5 text-xs font-semibold"
                  style={{ backgroundColor: `${rarityColor}20`, color: rarityColor }}
                >
                  {talent.rarity}
                </span>
              </div>
              <p className="mb-3 text-xs leading-relaxed text-[#4f5d55] sm:text-sm">{talent.description}</p>
              <div className="flex flex-wrap gap-2">
                {Object.entries(talent.effect).map(([attr, value]) => (
                  <EffectPill key={attr} label={attr} value={value ?? 0} />
                ))}
                {modifierTexts.map(text => (
                  <span
                    key={text}
                    className="rounded-full border border-[#738275]/25 bg-[#fff9e8]/80 px-2.5 py-1 text-xs font-semibold text-[#45564f] sm:px-3 sm:text-sm"
                  >
                    {text}
                  </span>
                ))}
              </div>
            </motion.button>
          );
        })}
      </div>
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
      className="ink-panel min-h-[260px] rounded-lg border-2 p-5 sm:min-h-[320px] sm:p-7"
      style={{ borderColor: rarityColor }}
    >
      <div className="text-center">
        <div className="ink-muted mb-2 text-sm">{title}</div>
        <div
          className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full border-2 text-2xl font-bold sm:mb-4 sm:h-16 sm:w-16 sm:text-3xl"
          style={{ borderColor: rarityColor, color: rarityColor }}
        >
          {seal}
        </div>
        <h2 className="mb-2 text-2xl font-bold sm:text-3xl" style={{ color: rarityColor }}>
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
        <p className="ink-muted mb-4 min-h-[40px] text-sm sm:mb-6 sm:min-h-[48px] sm:text-base">{description}</p>

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
      className={`rounded-full border px-2.5 py-1 text-xs font-semibold sm:px-3 sm:text-sm ${
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
    '变异': '#4f6f8f',
    '极品': '#7f6a3e',
    '神话': '#9a5b2f',
    '传说': '#a94d37'
  };
  return colors[rarity] || '#9CA3AF';
}
