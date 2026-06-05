import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/stores/gameStore';
import Background from '@/components/layout/Background';
import StatusPanel, { AchievementPanel, RecentEvents } from '@/components/game/StatusPanel';
import EventDisplay from '@/components/game/EventDisplay';
import TalentDraw from '@/components/game/TalentDraw';
import GameOverModal from '@/components/game/GameOverModal';

export default function Game() {
  const navigate = useNavigate();
  const { gameState, resetGame, canBreakthrough, breakthroughRealm, endGame } = useGameStore();
  const [showGameOver, setShowGameOver] = useState(false);
  const canBreak = canBreakthrough();



  useEffect(() => {
    if (gameState.status === 'ended') {
      setShowGameOver(true);
    }
  }, [gameState.status]);

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
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      <Background />
      
      <div className="flex-1 container mx-auto px-4 py-8 z-10">
        <div className="mx-auto max-w-[1500px]">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <StatusPanel />
              </motion.div>
            </div>

            <div className="lg:col-span-7">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="space-y-6"
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
                      <div className="mt-6 grid gap-4 xl:grid-cols-2">
                        <AchievementPanel achievements={gameState.achievements} />
                        <RecentEvents events={gameState.events} />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>
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
