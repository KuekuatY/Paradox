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
      className="fixed inset-0 bg-[#17201d]/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="ink-panel rounded-lg p-8 max-w-lg w-full"
      >
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring' }}
            className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full border-2 border-[#a94d37] text-5xl font-bold text-[#a94d37]"
          >
            {isAscended ? '仙' : isMeditationEnd ? '寂' : '终'}
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="ink-title text-4xl font-bold mb-2"
          >
            {isAscended ? '飞升成仙' : isMeditationEnd ? '散功坐化' : '寿元耗尽'}
          </motion.h2>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-2xl font-bold mb-6"
            style={{ color: evaluation.color }}
          >
            {evaluation.icon} {evaluation.text}修仙者
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-2 gap-4 mb-6"
          >
            <div className="rounded-lg border border-[#738275]/25 bg-[#fff9e8]/60 p-4">
              <p className="ink-muted text-sm">最终境界</p>
              <p className="text-xl font-bold text-[#355d58]">{gameState.currentRealm.name}</p>
            </div>
            <div className="rounded-lg border border-[#738275]/25 bg-[#fff9e8]/60 p-4">
              <p className="ink-muted text-sm">存活年龄</p>
              <p className="text-xl font-bold text-[#9a5b2f]">{gameState.age} 岁</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="rounded-lg border border-[#738275]/25 bg-[#fff9e8]/60 p-4 mb-6"
          >
            <p className="ink-muted text-sm mb-2">最终属性</p>
            <div className="flex justify-around">
              <span className="text-center">
                <p className="text-lg font-bold text-[#355d58]">{gameState.attributes.根骨}</p>
                <p className="ink-muted text-xs">根骨</p>
              </span>
              <span className="text-center">
                <p className="text-lg font-bold text-[#355d58]">{gameState.attributes.悟性}</p>
                <p className="ink-muted text-xs">悟性</p>
              </span>
              <span className="text-center">
                <p className="text-lg font-bold text-[#5f7c64]">{gameState.attributes.气运}</p>
                <p className="ink-muted text-xs">气运</p>
              </span>
              <span className="text-center">
                <p className="text-lg font-bold text-[#9a5b2f]">{gameState.attributes.颜值}</p>
                <p className="ink-muted text-xs">颜值</p>
              </span>
              <span className="text-center">
                <p className="text-lg font-bold text-[#9a5b2f]">{gameState.attributes.家境}</p>
                <p className="ink-muted text-xs">家境</p>
              </span>
            </div>
          </motion.div>

          {(gameState.spiritRoot || gameState.talent) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mb-6 grid grid-cols-2 gap-4"
            >
              <div>
                <p className="ink-muted text-sm">灵根</p>
                <p className="text-lg text-[#355d58]">{gameState.spiritRoot?.name || '无'}</p>
              </div>
              <div>
                <p className="ink-muted text-sm">天赋</p>
                <p className="text-lg text-[#9a5b2f]">{gameState.talent?.name || '无'}</p>
              </div>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55 }}
            className="mb-6 rounded-lg border border-[#738275]/25 bg-[#fff9e8]/60 p-4 text-left"
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
            className="flex gap-4"
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
