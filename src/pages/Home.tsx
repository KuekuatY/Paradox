import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Background from '@/components/layout/Background';

export default function Home() {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate('/game');
  };

  const handleHistory = () => {
    navigate('/history');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      <Background />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center z-10 px-4"
      >
        <motion.h1
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="ink-title text-6xl md:text-8xl font-bold mb-4 tracking-normal"
        >
          修仙人生
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-2xl md:text-3xl text-[#6d5a36] mb-12"
        >
          重开模拟器
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="space-y-4"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleStart}
            className="ink-button-primary w-80 text-xl"
          >
            投胎转世
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleHistory}
            className="ink-button-secondary w-80 text-lg"
          >
            人生记录
          </motion.button>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-12 text-[#4f5d55] text-sm"
        >
          从炼气期到飞升，体验修仙人生
        </motion.p>
      </motion.div>
    </div>
  );
}
