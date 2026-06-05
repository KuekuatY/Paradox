import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/stores/gameStore';
import Background from '@/components/layout/Background';
import StatusPanel, {
  AchievementPanel,
  LifeGoalPanel,
  RecentEvents,
  StrategyPanel
} from '@/components/game/StatusPanel';
import EventDisplay from '@/components/game/EventDisplay';
import TalentDraw from '@/components/game/TalentDraw';
import GameOverModal from '@/components/game/GameOverModal';

type MobileTab = 'event' | 'status' | 'goal' | 'strategy' | 'records';

export default function Game() {
  const navigate = useNavigate();
  const { gameState, resetGame, canBreakthrough, breakthroughRealm, endGame, setStrategy } = useGameStore();
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
              >
                <StatusPanel />
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
                      >
                        <EventDisplay
                          canBreakthrough={canBreak}
                          onBreakthrough={handleBreakthrough}
                          onContinue={handleContinue}
                          onMeditationEnd={handleMeditationEnd}
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
                        <StatusPanel showLifeGoal={false} showStrategy={false} />
                      </motion.div>
                    )}

                    {mobileTab === 'goal' && (
                      <motion.div
                        key="mobile-goal"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                      >
                        <LifeGoalPanel
                          activeGoal={gameState.activeGoal}
                          completedCount={gameState.completedGoals.length}
                        />
                      </motion.div>
                    )}

                    {mobileTab === 'strategy' && (
                      <motion.div
                        key="mobile-strategy"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                      >
                        <StrategyPanel
                          selectedStrategy={gameState.strategy}
                          onSelect={setStrategy}
                        />
                      </motion.div>
                    )}

                    {mobileTab === 'records' && (
                      <motion.div
                        key="mobile-records"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-3"
                      >
                        <AchievementPanel achievements={gameState.achievements} />
                        <RecentEvents events={gameState.events} />
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
    { id: 'strategy', label: '策略' },
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
