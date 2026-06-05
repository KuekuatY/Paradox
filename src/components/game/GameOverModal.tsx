import { motion } from 'framer-motion';
import { useGameStore } from '@/stores/gameStore';
import { achievementCatalog, getAchievementInfo } from '@/data/achievements';

interface GameOverModalProps {
  onRestart: () => void;
  onGoHome: () => void;
}

export default function GameOverModal({ onRestart, onGoHome }: GameOverModalProps) {
  const { gameState } = useGameStore();
  
  const isAscended = gameState.currentRealm.name === '渡劫期' && gameState.age >= 5000;
  const isMeditationEnd = gameState.endReason === 'meditation';
  
  const getEvaluation = () => {
    const { currentRealm, attributes } = gameState;
    const realmLevel = currentRealm.level;
    const avgAttr = (attributes.根骨 + attributes.悟性 + attributes.气运) / 3;
    
    if (isAscended) return { text: '神话', color: '#9a5b2f', icon: '仙' };
    if (realmLevel >= 7 && avgAttr >= 520) return { text: '传奇', color: '#9a5b2f', icon: '玄' };
    if (realmLevel >= 5 && avgAttr >= 300) return { text: '天骄', color: '#7f3f2e', icon: '魁' };
    if (realmLevel >= 3 && avgAttr >= 120) return { text: '强者', color: '#355d58', icon: '道' };
    if (realmLevel >= 2) return { text: '普通', color: '#5f7c64', icon: '修' };
    return { text: '废柴', color: '#6f746d', icon: '凡' };
  };

  const evaluation = getEvaluation();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[#17201d]/60 p-3 backdrop-blur-sm sm:p-4"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="ink-panel my-auto max-h-[calc(100vh-1.5rem)] w-full max-w-lg overflow-y-auto rounded-lg p-4 sm:max-h-[calc(100vh-2rem)] sm:p-8"
      >
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring' }}
            className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full border-2 border-[#a94d37] text-4xl font-bold text-[#a94d37] sm:h-24 sm:w-24 sm:text-5xl"
          >
            {isAscended ? '仙' : isMeditationEnd ? '寂' : '终'}
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="ink-title mb-2 text-3xl font-bold sm:text-4xl"
          >
            {isAscended ? '飞升成仙' : isMeditationEnd ? '散功坐化' : '寿元耗尽'}
          </motion.h2>

          <p className="mb-2 text-lg font-semibold text-[#45564f] sm:text-xl">
            {gameState.characterName || '无名'}
          </p>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-5 text-xl font-bold sm:mb-6 sm:text-2xl"
            style={{ color: evaluation.color }}
          >
            {evaluation.icon} {evaluation.text}修仙者
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-5 grid grid-cols-2 gap-3 sm:mb-6 sm:gap-4"
          >
            <div className="rounded-lg border border-[#738275]/25 bg-[#fff9e8]/60 p-3 sm:p-4">
              <p className="ink-muted text-sm">最终境界</p>
              <p className="text-lg font-bold text-[#355d58] sm:text-xl">{gameState.currentRealm.name}</p>
            </div>
            <div className="rounded-lg border border-[#738275]/25 bg-[#fff9e8]/60 p-3 sm:p-4">
              <p className="ink-muted text-sm">存活年龄</p>
              <p className="text-lg font-bold text-[#9a5b2f] sm:text-xl">{gameState.age} 岁</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mb-5 rounded-lg border border-[#738275]/25 bg-[#fff9e8]/60 p-3 sm:mb-6 sm:p-4"
          >
            <p className="ink-muted text-sm mb-2">最终属性</p>
            <div className="grid grid-cols-5 gap-2">
              <span className="text-center">
                <p className="text-base font-bold text-[#355d58] sm:text-lg">{gameState.attributes.根骨}</p>
                <p className="ink-muted text-xs">根骨</p>
              </span>
              <span className="text-center">
                <p className="text-base font-bold text-[#355d58] sm:text-lg">{gameState.attributes.神识}</p>
                <p className="ink-muted text-xs">神识</p>
              </span>
              <span className="text-center">
                <p className="text-base font-bold text-[#355d58] sm:text-lg">{gameState.attributes.悟性}</p>
                <p className="ink-muted text-xs">悟性</p>
              </span>
              <span className="text-center">
                <p className="text-base font-bold text-[#5f7c64] sm:text-lg">{gameState.attributes.气运}</p>
                <p className="ink-muted text-xs">气运</p>
              </span>
              <span className="text-center">
                <p className="text-base font-bold text-[#9a5b2f] sm:text-lg">{gameState.attributes.颜值}</p>
                <p className="ink-muted text-xs">颜值</p>
              </span>
            </div>
            <div className="mt-3 rounded border border-[#738275]/20 bg-[#fffdf2]/55 px-3 py-2 text-center">
              <p className="text-base font-bold text-[#9a5b2f] sm:text-lg">{gameState.familyWealth}</p>
              <p className="ink-muted text-xs">家境</p>
            </div>
          </motion.div>

          {(gameState.spiritRoot || gameState.talent) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mb-5 grid grid-cols-2 gap-3 sm:mb-6 sm:gap-4"
            >
              <div>
                <p className="ink-muted text-sm">灵根</p>
                <p className="text-base text-[#355d58] sm:text-lg">{gameState.spiritRoot?.name || '无'}</p>
              </div>
              <div>
                <p className="ink-muted text-sm">天赋</p>
                <p className="text-base text-[#9a5b2f] sm:text-lg">{gameState.talent?.name || '无'}</p>
              </div>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55 }}
            className="mb-5 rounded-lg border border-[#738275]/25 bg-[#fff9e8]/60 p-3 text-left sm:mb-6 sm:p-4"
          >
            <div className="mb-3 flex items-center justify-between">
              <p className="ink-muted text-sm">本世成就</p>
              <p className="text-sm font-semibold text-[#9a5b2f]">
                {gameState.achievements.length}/{achievementCatalog.length}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {gameState.achievements.length > 0 ? (
                gameState.achievements.map(id => {
                  const achievement = getAchievementInfo(id);

                  return (
                    <span
                      key={id}
                      title={achievement.description}
                      className="rounded-full border border-[#a9823c]/30 bg-[#f0dfad]/55 px-3 py-1 text-xs font-semibold text-[#6f4d24]"
                    >
                      {achievement.name}
                    </span>
                  );
                })
              ) : (
                <span className="text-sm text-[#66766e]">未解锁成就</span>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col gap-3 sm:flex-row sm:gap-4"
          >
            <button
              onClick={onRestart}
              className="ink-button-primary flex-1"
            >
              再修一世
            </button>
            <button
              onClick={onGoHome}
              className="ink-button-secondary flex-1"
            >
              返回主页
            </button>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}
