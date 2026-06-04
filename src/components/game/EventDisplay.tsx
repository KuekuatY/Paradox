import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '@/stores/gameStore';

interface EventDisplayProps {
  canBreakthrough: boolean;
  onBreakthrough: () => void;
  onContinue: () => void;
  onMeditationEnd: () => void;
}

export default function EventDisplay({
  canBreakthrough,
  onBreakthrough,
  onContinue,
  onMeditationEnd
}: EventDisplayProps) {
  const { gameState } = useGameStore();
  const [displayedText, setDisplayedText] = useState('');
  
  const currentEvent = gameState.events[gameState.events.length - 1];
  const effectEntries = currentEvent?.appliedEffects
    ? Object.entries(currentEvent.appliedEffects).filter(([, value]) => value !== undefined)
    : [];

  useEffect(() => {
    if (!currentEvent) {
      setDisplayedText('命途初定，修仙路即将展开。');
      return;
    }
    
    setDisplayedText('');
    
    const text = currentEvent.description;
    let index = 0;
    
    const timer = setInterval(() => {
      if (index < text.length) {
        setDisplayedText(text.slice(0, index + 1));
        index++;
      } else {
        clearInterval(timer);
      }
    }, 30);

    return () => clearInterval(timer);
  }, [currentEvent]);

  const getEventIcon = (type: string) => {
    const icons: Record<string, string> = {
      'cultivation': '修',
      'encounter': '缘',
      'social': '交',
      'disaster': '劫',
      'daily': '常'
    };
    return icons[type] || '道';
  };

  const getEventColor = (result: string) => {
    switch (result) {
      case 'success':
        return 'border-[#7f9a78]/35';
      case 'failure':
        return 'border-[#b98678]/35';
      default:
        return 'border-[#8d947f]/30';
    }
  };

  const getResultText = (result: string) => {
    switch (result) {
      case 'success':
        return '成功';
      case 'failure':
        return '失败';
      default:
        return '普通';
    }
  };

  const formatEffect = (key: string, value: string | number) => {
    if (key === '境界') {
      return value === 'advance' ? '境界突破' : '境界跌落';
    }

    if (typeof value === 'number') {
      if (!Number.isFinite(value)) {
        return `${key} 无尽`;
      }

      return `${key} ${value > 0 ? '+' : ''}${value}`;
    }

    return `${key} ${value}`;
  };

  const getEffectClass = (value: string | number) => {
    if (typeof value === 'number' && value < 0) {
      return 'bg-[#f2d9d2] text-[#9d3d2f]';
    }

    return 'bg-[#e7eddd] text-[#355d58]';
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="ink-panel rounded-lg p-8"
    >
      <div className="text-center mb-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border-2 border-[#a94d37] text-3xl font-bold text-[#a94d37]"
        >
          {getEventIcon(currentEvent?.type || '')}
        </motion.div>
        
        <h2 className="ink-title text-2xl font-bold mb-2">
          第 {gameState.age} 年
        </h2>
        
          <motion.p
            key={currentEvent?.title}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          className="text-xl text-[#9a5b2f] font-semibold"
          >
          {currentEvent?.title || '初入仙途'}
          </motion.p>
      </div>

      <motion.div
        className={`scroll-container rounded-lg p-6 mb-6 border ${getEventColor(currentEvent?.result || '')}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <p className="text-stone-950 text-lg leading-relaxed min-h-[80px] font-semibold">
          {displayedText}
          <span className="animate-pulse">|</span>
        </p>
        
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          {effectEntries.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-[#6d634d]">本年变化</span>
              {effectEntries.map(([key, value]) => (
                <span
                  key={key}
                  className={`rounded-full px-3 py-1 text-sm font-semibold ${getEffectClass(value)}`}
                >
                  {formatEffect(key, value)}
                </span>
              ))}
            </div>
          )}
          <span className={`text-sm font-semibold px-3 py-1 rounded-full ${
            currentEvent?.result === 'success' ? 'bg-green-100 text-green-700' :
            currentEvent?.result === 'failure' ? 'bg-red-100 text-red-700' :
            'bg-gray-100 text-gray-700'
          }`}>
            {getResultText(currentEvent?.result || '')}
          </span>
        </div>
      </motion.div>

      <div className="flex flex-wrap justify-center gap-3">
        {canBreakthrough && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onBreakthrough}
            className="rounded-md border border-[#a9823c]/45 bg-[#f0dfad] px-8 py-3 text-xl font-bold text-[#7a5426] shadow-lg transition-all hover:brightness-105"
          >
            突破瓶颈
          </motion.button>
        )}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onContinue}
          className="ink-button-primary text-xl"
        >
          继续修仙
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onMeditationEnd}
          className="ink-button-secondary text-xl"
        >
          原地坐化
        </motion.button>
      </div>
    </motion.div>
  );
}
