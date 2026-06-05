import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Background from '@/components/layout/Background';
import { hasSavedGame } from '@/utils/storage';
import { useGameStore } from '@/stores/gameStore';

export default function Home() {
  const navigate = useNavigate();
  const hasSave = hasSavedGame();

  const handleStart = () => {
    navigate('/game');
  };

  const handleContinue = () => {
    const loaded = useGameStore.getState().loadSavedGame();
    if (loaded) {
      navigate('/game');
    }
  };

  const handleHistory = () => {
    navigate('/history');
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-x-hidden px-4 py-8">
      <Background />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="z-10 w-full max-w-md text-center"
      >
        <motion.h1
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="ink-title mb-4 text-4xl font-bold tracking-normal sm:text-6xl md:text-8xl"
        >
          问道轮回
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mb-8 text-xl text-[#6d5a36] sm:mb-12 sm:text-2xl md:text-3xl"
        >
          一念入世
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="space-y-3 sm:space-y-4"
        >
          {hasSave && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleContinue}
              className="ink-button-primary w-full text-lg sm:w-80 sm:text-xl"
            >
              继续存档
            </motion.button>
          )}

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleStart}
            className="ink-button-primary w-full text-lg sm:w-80 sm:text-xl"
          >
            投胎转世
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleHistory}
            className="ink-button-secondary w-full text-base sm:w-80 sm:text-lg"
          >
            人生记录
          </motion.button>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-8 text-sm text-[#4f5d55] sm:mt-12"
        >
          从炼气期到飞升，体验一世仙途
        </motion.p>
      </motion.div>
    </div>
  );
}
