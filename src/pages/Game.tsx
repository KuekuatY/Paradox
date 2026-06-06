import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/stores/gameStore';
import { lifeSkills, type LifeSkillId } from '@/data/lifeSkills';
import { getItem } from '@/data/items';
import Background from '@/components/layout/Background';
import {
  AchievementPanel,
  AttributePanel,
  BreakthroughRequirements,
  CombatStatsPanel,
  CultivationProgress,
  CultivationPathPanel,
  CurrentRealmSummary,
  FateSummary,
  InventoryPanel,
  LifeGoalPanel,
  RecentEvents,
  TechniquePanel
} from '@/components/game/StatusPanel';
import EventDisplay, { PreparationPanel } from '@/components/game/EventDisplay';
import TalentDraw from '@/components/game/TalentDraw';
import GameOverModal from '@/components/game/GameOverModal';
import TribulationQte from '@/components/game/TribulationQte';

type MobileTab = 'event' | 'status' | 'goal' | 'technique' | 'skills' | 'inventory' | 'breakthrough' | 'records';

const gameTabs: Array<{ id: MobileTab; label: string }> = [
  { id: 'event', label: '修行' },
  { id: 'status', label: '状态' },
  { id: 'goal', label: '道途' },
  { id: 'technique', label: '功法' },
  { id: 'skills', label: '百艺' },
  { id: 'inventory', label: '储物' },
  { id: 'breakthrough', label: '突破' },
  { id: 'records', label: '成就' }
];

export default function Game() {
  const navigate = useNavigate();
  const {
    gameState,
    resetGame,
    canBreakthrough,
    breakthroughRealm,
    resolveTribulationStrike,
    saveCurrentGame,
    endGame,
    useBreakthroughPreparation,
    practiceLifeSkill
  } = useGameStore();
  const [showGameOver, setShowGameOver] = useState(false);
  const [mobileTab, setMobileTab] = useState<MobileTab>('event');
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);
  const canBreak = canBreakthrough();

  useEffect(() => {
    if (gameState.status === 'ended') {
      setShowGameOver(true);
    }
  }, [gameState.status]);

  useEffect(() => {
    if (gameState.status === 'idle' || gameState.pendingEvent || gameState.pendingTribulation) {
      setMobileTab('event');
    }
  }, [gameState.status, gameState.pendingEvent, gameState.pendingTribulation]);

  const handleContinue = () => {
    const { advanceAge } = useGameStore.getState();
    advanceAge();
  };

  const handleRestart = () => {
    setShowGameOver(false);
    resetGame();
  };

  const handleBreakthrough = () => {
    breakthroughRealm();
  };

  const handleMeditationEnd = () => {
    endGame('died', 'meditation');
  };

  const handleSaveGame = () => {
    saveCurrentGame();
    setLastSavedAt(new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }));
  };

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="relative flex min-h-screen flex-col overflow-x-hidden">
      <Background />
      
      <div className="container z-10 mx-auto flex-1 px-3 py-4 sm:px-4 sm:py-6 lg:py-8">
        <div className="mx-auto max-w-[1500px]">
          <div className="hidden lg:block">
            <AnimatePresence mode="wait">
              {gameState.status === 'idle' ? (
                <motion.div
                  key="desktop-talent-draw"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  className="mx-auto max-w-3xl"
                >
                  <TalentDraw />
                </motion.div>
              ) : (
                <motion.div
                  key="desktop-game"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  className="grid grid-cols-[220px_minmax(0,1fr)] gap-6"
                >
                  <DesktopGameNav activeTab={mobileTab} onSelect={setMobileTab} />
                  <div className="min-w-0">
                    <GameTabContent
                      activeTab={mobileTab}
                      canBreakthrough={canBreak}
                      lastSavedAt={lastSavedAt}
                      onBreakthrough={handleBreakthrough}
                      onContinue={handleContinue}
                      onMeditationEnd={handleMeditationEnd}
                      onPrepare={useBreakthroughPreparation}
                      onPracticeLifeSkill={practiceLifeSkill}
                      onResolveTribulationStrike={resolveTribulationStrike}
                      onSave={handleSaveGame}
                      onSelectTab={setMobileTab}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="lg:hidden">
            <AnimatePresence mode="wait">
              {gameState.status === 'idle' ? (
                <motion.div
                  key="mobile-talent-draw"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                >
                  <TalentDraw />
                </motion.div>
              ) : (
                <motion.div
                  key="mobile-game"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  className="space-y-3 pt-14"
                >
                  <MobileGameNav activeTab={mobileTab} onSelect={setMobileTab} />

                  <GameTabContent
                    activeTab={mobileTab}
                    canBreakthrough={canBreak}
                    lastSavedAt={lastSavedAt}
                    onBreakthrough={handleBreakthrough}
                    onContinue={handleContinue}
                    onMeditationEnd={handleMeditationEnd}
                    onPrepare={useBreakthroughPreparation}
                    onPracticeLifeSkill={practiceLifeSkill}
                    onResolveTribulationStrike={resolveTribulationStrike}
                    onSave={handleSaveGame}
                    onSelectTab={setMobileTab}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showGameOver && (
          <GameOverModal
            onRestart={handleRestart}
            onGoHome={handleGoHome}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function SaveGamePanel({
  characterName,
  lastSavedAt,
  onSave
}: {
  characterName: string;
  lastSavedAt: string | null;
  onSave: () => void;
}) {
  return (
    <div className="rounded-md border border-[#738275]/25 bg-[#fff9e8]/45 px-3 py-3 sm:px-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2 text-sm">
        <span className="font-semibold text-[#45564f]">存档</span>
        <span className="text-xs text-[#66766e]">{characterName || '无名'}</span>
      </div>
      <button
        type="button"
        onClick={onSave}
        className="w-full rounded-md border border-[#738275]/30 bg-[#eef3df] px-4 py-2 text-sm font-bold text-[#355d58] transition hover:border-[#9a5b2f]/45 hover:bg-[#fffdf2]"
      >
        保存进度
      </button>
      <div className="mt-2 min-h-[18px] text-right text-xs text-[#66766e]">
        {lastSavedAt ? `已保存 ${lastSavedAt}` : '尚未保存'}
      </div>
    </div>
  );
}

function DesktopGameNav({
  activeTab,
  onSelect
}: {
  activeTab: MobileTab;
  onSelect: (tab: MobileTab) => void;
}) {
  return (
    <aside className="sticky top-8 h-fit rounded-lg border border-[#738275]/25 bg-[#fff9e8]/80 p-3 shadow-md backdrop-blur">
      <div className="mb-3 px-2 text-xs font-semibold text-[#66766e]">问道轮回</div>
      <div className="space-y-1.5">
        {gameTabs.map(tab => {
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onSelect(tab.id)}
              className={`flex min-h-[42px] w-full items-center rounded-md px-3 text-left text-sm font-bold transition ${
                isActive
                  ? 'bg-[#355d58] text-[#fff9e8] shadow-sm'
                  : 'text-[#59645f] hover:bg-[#eef3df]'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </aside>
  );
}

function GameTabContent({
  activeTab,
  canBreakthrough,
  lastSavedAt,
  onBreakthrough,
  onContinue,
  onMeditationEnd,
  onPrepare,
  onPracticeLifeSkill,
  onResolveTribulationStrike,
  onSave,
  onSelectTab
}: {
  activeTab: MobileTab;
  canBreakthrough: boolean;
  lastSavedAt: string | null;
  onBreakthrough: () => void;
  onContinue: () => void;
  onMeditationEnd: () => void;
  onPrepare: (actionId: string) => void;
  onPracticeLifeSkill: (skillId: LifeSkillId) => void;
  onResolveTribulationStrike: (success: boolean) => void;
  onSave: () => void;
  onSelectTab: (tab: MobileTab) => void;
}) {
  const { gameState } = useGameStore();

  return (
    <AnimatePresence mode="wait">
      {activeTab === 'event' && (
        <motion.div
          key="tab-event"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="space-y-3"
        >
          <MobileCultivationPanel
            canBreakthrough={canBreakthrough}
            onGoBreakthrough={() => onSelectTab('breakthrough')}
          />
          {gameState.pendingTribulation ? (
            <TribulationQte
              tribulation={gameState.pendingTribulation}
              onResolveStrike={onResolveTribulationStrike}
            />
          ) : (
            <EventDisplay
              canBreakthrough={canBreakthrough}
              onBreakthrough={onBreakthrough}
              onContinue={onContinue}
              onMeditationEnd={onMeditationEnd}
              showBreakthroughControls={false}
            />
          )}
        </motion.div>
      )}

      {activeTab === 'status' && (
        <motion.div
          key="tab-status"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="space-y-3"
        >
          <SaveGamePanel
            characterName={gameState.characterName}
            lastSavedAt={lastSavedAt}
            onSave={onSave}
          />
          <MobileStatusPanel />
        </motion.div>
      )}

      {activeTab === 'goal' && (
        <motion.div
          key="tab-goal"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="space-y-3"
        >
          <LifeGoalPanel
            activeGoal={gameState.activeGoal}
            completedCount={gameState.completedGoals.length}
          />
          <RecentEvents events={gameState.events} />
        </motion.div>
      )}

      {activeTab === 'breakthrough' && (
        <motion.div
          key="tab-breakthrough"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
        >
          <MobileBreakthroughPanel
            canBreakthrough={canBreakthrough}
            onBreakthrough={onBreakthrough}
            onPrepare={onPrepare}
          />
        </motion.div>
      )}

      {activeTab === 'technique' && (
        <motion.div
          key="tab-technique"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
        >
          <TechniquePanel gameState={gameState} />
        </motion.div>
      )}

      {activeTab === 'skills' && (
        <motion.div
          key="tab-skills"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
        >
          <LifeSkillPanel
            canUse={!gameState.pendingEvent && !gameState.pendingPathChoice && !gameState.pendingTribulation}
            onPractice={onPracticeLifeSkill}
          />
        </motion.div>
      )}

      {activeTab === 'inventory' && (
        <motion.div
          key="tab-inventory"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
        >
          <InventoryPanel
            inventory={gameState.inventory}
            canUse={!gameState.pendingEvent && !gameState.pendingPathChoice && !gameState.pendingTribulation}
          />
        </motion.div>
      )}

      {activeTab === 'records' && (
        <motion.div
          key="tab-records"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
        >
          <AchievementPanel achievements={gameState.achievements} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function MobileGameNav({
  activeTab,
  onSelect
}: {
  activeTab: MobileTab;
  onSelect: (tab: MobileTab) => void;
}) {
  return (
    <div className="fixed left-3 right-3 top-3 z-30 rounded-md border border-[#738275]/25 bg-[#fff9e8]/90 p-1 shadow-md backdrop-blur">
      <div className="grid grid-cols-4 gap-1">
        {gameTabs.map(tab => {
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onSelect(tab.id)}
              className={`min-h-[40px] rounded px-1 text-xs font-semibold transition min-[390px]:text-sm ${
                isActive
                  ? 'bg-[#355d58] text-[#fff9e8] shadow-sm'
                  : 'text-[#59645f] hover:bg-[#eef3df]'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function LifeSkillPanel({
  canUse,
  onPractice
}: {
  canUse: boolean;
  onPractice: (skillId: LifeSkillId) => void;
}) {
  const { gameState } = useGameStore();

  const getDisabledReason = (skill: (typeof lifeSkills)[number]) => {
    if (!canUse) return '需先处理当前事项';
    if (gameState.currentRealm.level < skill.minRealmLevel) return `需达${getRealmNameByLevel(skill.minRealmLevel)}`;
    if (gameState.familyWealth < skill.familyWealthCost) return '家境不足';
    if (gameState.age >= gameState.lifespan - skill.timeCost) return '寿元不足';
    return '';
  };

  return (
    <div className="ink-panel rounded-lg p-4 sm:p-5">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 className="ink-title text-xl font-bold">百艺</h2>
          <p className="mt-1 text-sm text-[#66766e]">炼器、炼丹、画符、阵法、钓鱼、灵田</p>
        </div>
        <div className="rounded-md border border-[#738275]/25 bg-[#fff9e8]/55 px-3 py-2 text-right text-xs text-[#66766e]">
          <div>年龄 {gameState.age} 岁</div>
          <div>家境 {gameState.familyWealth}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
        {lifeSkills.map(skill => {
          const disabledReason = getDisabledReason(skill);
          const isDisabled = disabledReason !== '';
          const progress = gameState.lifeSkills.find(item => item.skillId === skill.id) ?? { level: 1, exp: 0 };
          const visibleRecipes = skill.recipes.filter(recipe => gameState.currentRealm.level >= recipe.minRealmLevel);

          return (
            <div
              key={skill.id}
              className="rounded-md border border-[#738275]/25 bg-[#fff9e8]/45 p-4 shadow-sm"
            >
              <div className="mb-3 flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-bold text-[#263832]">{skill.name}</h3>
                  <p className="mt-1 text-xs font-semibold text-[#7a5426]">{skill.focus}</p>
                  <p className="mt-1 text-xs text-[#66766e]">
                    {progress.level} 阶 · 熟练 {progress.exp % 100}/100
                  </p>
                </div>
                <span className="shrink-0 rounded border border-[#738275]/25 bg-[#eef3df] px-2 py-1 text-xs font-semibold text-[#45564f]">
                  {getRealmNameByLevel(skill.minRealmLevel)}可习
                </span>
              </div>

              <p className="min-h-[44px] text-sm leading-relaxed text-[#59645f]">{skill.description}</p>

              <div className="mt-3 flex flex-wrap gap-2 text-xs">
                <span className="rounded bg-[#eee8d4] px-2 py-1 text-[#6d634d]">耗时 {skill.timeCost} 年</span>
                <span className="rounded bg-[#eee8d4] px-2 py-1 text-[#6d634d]">家境 {skill.familyWealthCost}</span>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {Object.entries(skill.effects)
                  .filter(([, value]) => value !== undefined && value !== 0)
                  .map(([key, value]) => (
                    <span
                      key={key}
                      className={`rounded px-2 py-1 text-xs font-semibold ${
                        typeof value === 'number' && value < 0
                          ? 'bg-[#f2d9d2] text-[#9d3d2f]'
                          : 'bg-[#e7eddd] text-[#355d58]'
                      }`}
                    >
                      {key} {typeof value === 'number' && value > 0 ? '+' : ''}{value}
                    </span>
                  ))}
              </div>

              {visibleRecipes.length > 0 && (
                <div className="mt-3 space-y-1.5 rounded border border-[#738275]/15 bg-[#fffdf2]/55 px-2 py-2">
                  {visibleRecipes.slice(0, 2).map(recipe => {
                    const locked = progress.level < recipe.minSkillLevel;
                    const affordable = recipe.costs.every(cost => getInventoryQuantity(gameState.inventory, cost.itemId) >= cost.quantity);

                    return (
                      <div key={recipe.id} className="text-xs leading-relaxed">
                        <div className={`font-semibold ${locked ? 'text-[#8d947f]' : affordable ? 'text-[#355d58]' : 'text-[#9a5b2f]'}`}>
                          {recipe.name}
                        </div>
                        <div className="text-[#66766e]">
                          {locked ? `${recipe.minSkillLevel} 阶解锁` : formatRecipeCosts(recipe.costs)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              <button
                type="button"
                disabled={isDisabled}
                onClick={() => onPractice(skill.id)}
                className={`mt-4 w-full rounded-md border px-4 py-2 text-sm font-bold transition ${
                  isDisabled
                    ? 'border-[#738275]/20 bg-[#eee8d4]/55 text-[#8d947f]'
                    : 'border-[#738275]/35 bg-[#355d58] text-[#fff9e8] shadow-sm hover:bg-[#416f68]'
                }`}
              >
                {isDisabled ? disabledReason : '修习'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function getInventoryQuantity(inventory: Array<{ itemId: string; quantity: number }>, itemId: string): number {
  return inventory.find(item => item.itemId === itemId)?.quantity ?? 0;
}

function formatRecipeCosts(costs: Array<{ itemId: string; quantity: number }>): string {
  if (costs.length === 0) return '无需材料';

  return costs
    .map(cost => `${getItem(cost.itemId)?.name ?? cost.itemId}x${cost.quantity}`)
    .join(' · ');
}

function MobileCultivationPanel({
  canBreakthrough,
  onGoBreakthrough
}: {
  canBreakthrough: boolean;
  onGoBreakthrough: () => void;
}) {
  const { gameState } = useGameStore();
  const { age, lifespan } = gameState;
  const lifespanPercent = lifespan === Infinity ? 100 : Math.min(100, age / lifespan * 100);

  return (
    <div className="ink-panel rounded-lg p-4">
      <CurrentRealmSummary currentRealm={gameState.currentRealm} characterName={gameState.characterName} />
      <div className="mb-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="ink-muted">年龄</span>
          <span className="font-semibold text-[#263832]">{age} 岁</span>
        </div>
        <div className="relative h-2 overflow-hidden rounded-full bg-[#c8c2a9]">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${lifespanPercent}%` }}
            transition={{ duration: 0.5 }}
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#5f7c64] via-[#b49a4b] to-[#9b4b35]"
          />
        </div>
        <div className="ink-muted text-right text-xs">
          寿元: {lifespan === Infinity ? '无尽' : `${lifespan} 年`}
        </div>
      </div>
      <CultivationProgress
        currentRealmName={gameState.currentRealm.name}
        progress={gameState.cultivationProgress}
      />
      {canBreakthrough && (
        <motion.button
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          type="button"
          onClick={onGoBreakthrough}
          className="mt-3 w-full rounded-md border border-[#a9823c]/60 bg-[#f0dfad] px-4 py-3 text-sm font-bold text-[#7a5426] shadow-md transition hover:brightness-105"
        >
          修为圆满，前往突破
        </motion.button>
      )}
    </div>
  );
}

function getRealmNameByLevel(level: number): string {
  if (level <= 1) return '炼气';
  if (level === 2) return '筑基';
  if (level === 3) return '金丹';
  if (level === 4) return '元婴';
  if (level === 5) return '化神';
  if (level === 6) return '炼虚';
  if (level === 7) return '合体';
  if (level === 8) return '大乘';
  return '渡劫';
}

function MobileStatusPanel() {
  const { gameState } = useGameStore();
  const { spiritRoot, talent, cultivationPath, attributes, currentRealm } = gameState;

  return (
    <div className="ink-panel space-y-3 rounded-lg p-4">
      {(spiritRoot || talent || cultivationPath) && (
        <div className="grid grid-cols-1 gap-3">
          {spiritRoot && (
            <FateSummary
              label="灵根"
              name={spiritRoot.name}
              rarity={spiritRoot.rarity}
              description={spiritRoot.description}
            />
          )}
          {talent && (
            <FateSummary
              label="天赋"
              name={talent.name}
              rarity={talent.rarity}
              description={talent.description}
            />
          )}
          {cultivationPath && (
            <CultivationPathPanel pathId={cultivationPath} />
          )}
        </div>
      )}
      {currentRealm.name !== '幼年期' && (
        <CombatStatsPanel combatStats={gameState.combatStats} />
      )}
      {gameState.rival?.active && (
        <RivalPanel name={gameState.rival.name} enmity={gameState.rival.enmity} defeats={gameState.rival.defeats} />
      )}
      <AttributePanel attributes={attributes} cap={currentRealm.attributeCap} />
    </div>
  );
}

function RivalPanel({
  name,
  enmity,
  defeats
}: {
  name: string;
  enmity: number;
  defeats: number;
}) {
  return (
    <div className="rounded-md border border-[#9a5b2f]/25 bg-[#fff9e8]/45 px-3 py-3 sm:px-4">
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="font-semibold text-[#45564f]">宿敌</span>
        <span className="text-xs font-semibold text-[#9a5b2f]">仇怨 {enmity}</span>
      </div>
      <div className="text-sm font-bold text-[#263832]">{name}</div>
      <div className="mt-1 text-xs text-[#66766e]">已击退 {defeats} 次，历练时可能寻仇。</div>
    </div>
  );
}

function MobileBreakthroughPanel({
  canBreakthrough,
  onBreakthrough,
  onPrepare
}: {
  canBreakthrough: boolean;
  onBreakthrough: () => void;
  onPrepare: (actionId: string) => void;
}) {
  const { gameState, getBreakthroughSuccessChance } = useGameStore();
  const isBlockedByChoice = !!gameState.pendingEvent || gameState.pendingPathChoice || !!gameState.pendingTribulation;
  const breakthroughChance = getBreakthroughSuccessChance();

  return (
    <div className="ink-panel space-y-3 rounded-lg p-4">
      <BreakthroughRequirements
        currentRealmName={gameState.currentRealm.name}
        attributes={gameState.attributes}
      />
      <BreakthroughPrepSummary
        preparation={gameState.breakthroughPreparation}
        chance={breakthroughChance}
      />
      <PreparationPanel
        canUse={!isBlockedByChoice}
        familyWealth={gameState.familyWealth}
        inventory={gameState.inventory}
        realmLevel={gameState.currentRealm.level}
        shouldPrepare={gameState.cultivationProgress > 0 && !canBreakthrough}
        onPrepare={onPrepare}
      />
      <div className="rounded-md border border-[#738275]/25 bg-[#fff9e8]/45 px-3 py-3 text-center">
        <div className="mb-3 text-sm font-semibold text-[#45564f]">突破瓶颈</div>
        <button
          type="button"
          disabled={!canBreakthrough}
          onClick={onBreakthrough}
          className={`w-full rounded-md px-6 py-3 text-lg font-bold transition ${
            canBreakthrough
              ? 'border border-[#a9823c]/45 bg-[#f0dfad] text-[#7a5426] shadow-lg hover:brightness-105'
              : 'border border-[#738275]/20 bg-[#eee8d4]/55 text-[#8d947f]'
          }`}
        >
          突破瓶颈
        </button>
        <p className="mt-3 text-xs leading-relaxed text-[#66766e]">
          {gameState.pendingPathChoice
            ? '需先在修行页立定流派，方可继续筹备突破。'
            : gameState.pendingTribulation
            ? '天雷正在临身，需先完成渡劫。'
            : isBlockedByChoice
            ? '需先处理当前抉择，方可闭关冲境。'
            : canBreakthrough
              ? '修为圆满，门槛已足，可以尝试突破。'
              : '修炼进度圆满且突破门槛满足后，便可在此突破。'}
        </p>
      </div>
    </div>
  );
}

function BreakthroughPrepSummary({
  preparation,
  chance
}: {
  preparation: { elixir: number; artifact: number; talisman: number; array: number };
  chance: number | null;
}) {
  const total = preparation.elixir + preparation.artifact + preparation.talisman + preparation.array;
  const chanceText = chance === null ? '--' : `${Math.round(chance * 100)}%`;

  return (
    <div className="rounded-md border border-[#738275]/25 bg-[#fff9e8]/45 px-3 py-3 text-xs text-[#66766e]">
      <div className="mb-2 flex items-center justify-between">
        <span className="font-semibold text-[#45564f]">准备加成</span>
        <span>成功率约 {chanceText}</span>
      </div>
      <div className="grid grid-cols-4 gap-2 text-center">
        <span>丹 {preparation.elixir}</span>
        <span>器 {preparation.artifact}</span>
        <span>符 {preparation.talisman}</span>
        <span>阵 {preparation.array}</span>
      </div>
      <div className="mt-2 text-right">共 {total} 层，突破后清空</div>
    </div>
  );
}
