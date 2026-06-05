import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/stores/gameStore';
import Background from '@/components/layout/Background';
import StatusPanel, {
  AchievementPanel,
  AttributePanel,
  BreakthroughRequirements,
  CultivationProgress,
  CultivationPathPanel,
  CurrentRealmSummary,
  FateSummary,
  LifeGoalPanel,
  RecentEvents
} from '@/components/game/StatusPanel';
import EventDisplay, { PreparationPanel } from '@/components/game/EventDisplay';
import TalentDraw from '@/components/game/TalentDraw';
import GameOverModal from '@/components/game/GameOverModal';

type MobileTab = 'event' | 'status' | 'goal' | 'breakthrough' | 'records';

export default function Game() {
  const navigate = useNavigate();
  const {
    gameState,
    resetGame,
    canBreakthrough,
    breakthroughRealm,
    endGame,
    useBreakthroughPreparation
  } = useGameStore();
  const [showGameOver, setShowGameOver] = useState(false);
  const [mobileTab, setMobileTab] = useState<MobileTab>('event');
  const canBreak = canBreakthrough();

  useEffect(() => {
    if (gameState.status === 'ended') {
      setShowGameOver(true);
    }
  }, [gameState.status]);

  useEffect(() => {
    if (gameState.status === 'idle' || gameState.pendingEvent) {
      setMobileTab('event');
    }
  }, [gameState.status, gameState.pendingEvent]);

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

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="relative flex min-h-screen flex-col overflow-x-hidden">
      <Background />
      
      <div className="container z-10 mx-auto flex-1 px-3 py-4 sm:px-4 sm:py-6 lg:py-8">
        <div className="mx-auto max-w-[1500px]">
          <div className="hidden gap-4 sm:gap-6 lg:grid lg:grid-cols-12">
            <div className="order-2 lg:order-1 lg:col-span-5">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-4"
              >
                <StatusPanel />
                {gameState.status === 'playing' && (
                  <PreparationPanel
                    canUse={!gameState.pendingEvent && !gameState.pendingPathChoice}
                    familyWealth={gameState.familyWealth}
                    realmLevel={gameState.currentRealm.level}
                    shouldPrepare={gameState.cultivationProgress > 0 && !canBreak}
                    onPrepare={useBreakthroughPreparation}
                  />
                )}
              </motion.div>
            </div>

            <div className="order-1 lg:order-2 lg:col-span-7">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="space-y-4 sm:space-y-6"
              >
                <AnimatePresence mode="wait">
                  {gameState.status === 'idle' ? (
                    <motion.div
                      key="talent-draw"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                    >
                      <TalentDraw />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="event-display"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                    >
                      <EventDisplay
                        canBreakthrough={canBreak}
                        onBreakthrough={handleBreakthrough}
                        onContinue={handleContinue}
                        onMeditationEnd={handleMeditationEnd}
                      />
                      <div className="mt-4 grid gap-3 sm:mt-6 sm:gap-4 xl:grid-cols-2">
                        <AchievementPanel achievements={gameState.achievements} />
                        <RecentEvents events={gameState.events} />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>
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

                  <AnimatePresence mode="wait">
                    {mobileTab === 'event' && (
                      <motion.div
                        key="mobile-event"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-3"
                      >
                        <MobileCultivationPanel />
                        <EventDisplay
                          canBreakthrough={canBreak}
                          onBreakthrough={handleBreakthrough}
                          onContinue={handleContinue}
                          onMeditationEnd={handleMeditationEnd}
                          showBreakthroughControls={false}
                        />
                      </motion.div>
                    )}

                    {mobileTab === 'status' && (
                      <motion.div
                        key="mobile-status"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                      >
                        <MobileStatusPanel />
                      </motion.div>
                    )}

                    {mobileTab === 'goal' && (
                      <motion.div
                        key="mobile-goal"
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

                    {mobileTab === 'breakthrough' && (
                      <motion.div
                        key="mobile-breakthrough"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                      >
                        <MobileBreakthroughPanel
                          canBreakthrough={canBreak}
                          onBreakthrough={handleBreakthrough}
                          onPrepare={useBreakthroughPreparation}
                        />
                      </motion.div>
                    )}

                    {mobileTab === 'records' && (
                      <motion.div
                        key="mobile-records"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                      >
                        <AchievementPanel achievements={gameState.achievements} />
                      </motion.div>
                    )}
                  </AnimatePresence>
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

function MobileGameNav({
  activeTab,
  onSelect
}: {
  activeTab: MobileTab;
  onSelect: (tab: MobileTab) => void;
}) {
  const tabs: Array<{ id: MobileTab; label: string }> = [
    { id: 'event', label: '修行' },
    { id: 'status', label: '状态' },
    { id: 'goal', label: '道途' },
    { id: 'breakthrough', label: '突破' },
    { id: 'records', label: '成就' }
  ];

  return (
    <div className="fixed left-3 right-3 top-3 z-30 rounded-md border border-[#738275]/25 bg-[#fff9e8]/90 p-1 shadow-md backdrop-blur">
      <div className="grid grid-cols-5 gap-1">
        {tabs.map(tab => {
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onSelect(tab.id)}
              className={`min-h-[40px] rounded px-1 text-sm font-semibold transition ${
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

function MobileCultivationPanel() {
  const { gameState } = useGameStore();
  const { age, lifespan } = gameState;
  const lifespanPercent = lifespan === Infinity ? 100 : Math.min(100, age / lifespan * 100);

  return (
    <div className="ink-panel rounded-lg p-4">
      <CurrentRealmSummary currentRealm={gameState.currentRealm} />
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
    </div>
  );
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
      <AttributePanel attributes={attributes} cap={currentRealm.attributeCap} />
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
  const { gameState } = useGameStore();
  const isBlockedByChoice = !!gameState.pendingEvent || gameState.pendingPathChoice;

  return (
    <div className="ink-panel space-y-3 rounded-lg p-4">
      <BreakthroughRequirements
        currentRealmName={gameState.currentRealm.name}
        attributes={gameState.attributes}
      />
      <PreparationPanel
        canUse={!isBlockedByChoice}
        familyWealth={gameState.familyWealth}
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
