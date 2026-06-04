import { motion } from 'framer-motion';
import { useMemo } from 'react';
import inkLandscape from '@/assets/ink-landscape.png';

export default function Background() {
  const particles = useMemo(() => Array.from({ length: 18 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 10,
    duration: 10 + Math.random() * 8,
    size: 16 + Math.random() * 34
  })), []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${inkLandscape})` }}
      />
      <div className="absolute inset-0 bg-[#f8f0dc]/20" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,250,232,0.18),rgba(40,47,42,0.18)_72%,rgba(24,31,30,0.38))]" />
      
      {particles.map(particle => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-slate-700/10 blur-md"
          style={{
            left: `${particle.x}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            bottom: '-10vh',
          }}
          animate={{
            y: ['0vh', '-95vh'],
            x: ['0px', '22px', '-16px'],
            opacity: [0, 0.24, 0.14, 0],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />
      ))}

      <motion.div
        className="absolute left-[8%] top-[14%] h-28 w-28 rounded-full border border-[#b99a52]/30 bg-[#d7b45d]/20 blur-[1px]"
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute right-[10%] top-[8%] h-20 w-44 rounded-full border border-[#38534b]/15 bg-white/15 blur-md"
        animate={{ x: [0, -18, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      />
      <motion.div
        className="absolute bottom-[12%] left-[35%] h-16 w-40 rounded-full border border-[#8f7240]/15 bg-[#f8edcf]/25 blur-lg"
        animate={{ x: [0, 20, 0], y: [0, -12, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
      />
    </div>
  );
}
