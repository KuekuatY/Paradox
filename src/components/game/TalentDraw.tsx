import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/stores/gameStore';
import type { Talent } from '@/types';

export default function TalentDraw() {
  const { drawTalent, startNewGame } = useGameStore();
  const [showTalent, setShowTalent] = useState(false);
  const [currentTalent, setCurrentTalent] = useState<Talent | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const handleDraw = () => {
    setIsDrawing(true);
    
    setTimeout(() => {
      const talent = drawTalent();
      setCurrentTalent(talent);
      setShowTalent(true);
      setIsDrawing(false);
    }, 1500);
  };

  const handleConfirm = () => {
    if (!currentTalent) return;

    setShowTalent(false);
    startNewGame(currentTalent);
  };

  const getRarityColor = (rarity: string): string => {
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
  };

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <AnimatePresence mode="wait">
        {!showTalent && !isDrawing && (
          <motion.div
            key="draw-button"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleDraw}
              className="ink-button-primary px-12 py-5 text-2xl"
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              抽取天赋
            </motion.button>
            <p className="mt-6 text-[#4f5d55]">命运由天定，天赋靠机缘</p>
          </motion.div>
        )}

        {isDrawing && (
          <motion.div
            key="drawing"
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
              <div className="text-5xl font-bold text-[#9a5b2f]">命</div>
            </motion.div>
            <p className="mt-6 text-xl text-[#45564f]">正在抽取天赋...</p>
          </motion.div>
        )}

        {showTalent && currentTalent && (
          <motion.div
            key="talent-card"
            initial={{ scale: 0, rotate: -180, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            exit={{ scale: 0, rotate: 180, opacity: 0 }}
            className="ink-panel rounded-lg p-8 border-2 max-w-md w-full mx-4"
            style={{ borderColor: getRarityColor(currentTalent.rarity) }}
          >
            <div className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring' }}
                className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border-2 text-3xl font-bold"
                style={{
                  borderColor: getRarityColor(currentTalent.rarity),
                  color: getRarityColor(currentTalent.rarity)
                }}
              >
                灵
              </motion.div>
              
              <motion.h2
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-3xl font-bold mb-2"
                style={{ color: getRarityColor(currentTalent.rarity) }}
              >
                {currentTalent.name}
              </motion.h2>
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-sm px-4 py-2 rounded-full inline-block mb-4"
                style={{ 
                  backgroundColor: `${getRarityColor(currentTalent.rarity)}20`,
                  color: getRarityColor(currentTalent.rarity)
                }}
              >
                {currentTalent.rarity}
              </motion.div>
              
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="ink-muted mb-6"
              >
                {currentTalent.description}
              </motion.p>
              
              {Object.keys(currentTalent.effect).length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="mb-6"
                >
                  <p className="ink-muted text-sm mb-2">天赋效果:</p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {Object.entries(currentTalent.effect).map(([attr, value]) => (
                      <span
                        key={attr}
                        className={`rounded-full border px-3 py-1 text-sm font-semibold ${
                          value > 0
                            ? 'border-[#7f9a78]/45 bg-[#eef3df]/80 text-[#46694f]'
                            : 'border-[#b98678]/45 bg-[#f4e2d8]/80 text-[#9a4c35]'
                        }`}
                      >
                        {attr} {value > 0 ? '+' : ''}{value}
                      </span>
                    ))}
                  </div>
                </motion.div>
              )}
              
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleConfirm}
                className="ink-button-primary text-lg"
              >
                踏入修仙路
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
