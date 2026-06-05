import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '@/stores/gameStore';
import type { EventChoice } from '@/types';

interface EventDisplayProps {
  canBreakthrough: boolean;
  onBreakthrough: () => void;
  onContinue: () => void;
  onMeditationEnd: () => void;
  showBreakthroughControls?: boolean;
}

export default function EventDisplay({
  canBreakthrough,
  onBreakthrough,
  onContinue,
  onMeditationEnd,
  showBreakthroughControls = true
}: EventDisplayProps) {
  const { gameState, chooseEventOption, getCurrentEventChoices, useBreakthroughPreparation } = useGameStore();
  const [displayedText, setDisplayedText] = useState('');
  const [isConfirmingMeditationEnd, setIsConfirmingMeditationEnd] = useState(false);
  
  const currentEvent = gameState.pendingEvent ?? gameState.events[gameState.events.length - 1];
  const isPendingChoice = !!gameState.pendingEvent;
  const effectEntries = !isPendingChoice && currentEvent?.appliedEffects
    ? Object.entries(currentEvent.appliedEffects).filter(([, value]) => value !== undefined)
    : [];

  useEffect(() => {
    setIsConfirmingMeditationEnd(false);

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

  const handleContinue = () => {
    setIsConfirmingMeditationEnd(false);
    onContinue();
  };

  const handleMeditationEndClick = () => {
    if (!isConfirmingMeditationEnd) {
      setIsConfirmingMeditationEnd(true);
      return;
    }

    onMeditationEnd();
  };

  const getEventIcon = (type: string) => {
    const icons: Record<string, string> = {
      'childhood': '幼',
      'cultivation': '修',
      'encounter': '缘',
      'social': '交',
      'disaster': '劫',
      'daily': '常',
      'resource': '财',
      'mind': '心',
      'sect': '宗'
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
    if (isPendingChoice) {
      return '待抉择';
    }

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
      className="ink-panel rounded-lg p-4 sm:p-6 lg:p-8"
    >
      <div className="mb-4 text-center sm:mb-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full border-2 border-[#a94d37] text-2xl font-bold text-[#a94d37] sm:mb-4 sm:h-16 sm:w-16 sm:text-3xl"
        >
          {getEventIcon(currentEvent?.type || '')}
        </motion.div>
        
        <h2 className="ink-title mb-2 text-xl font-bold sm:text-2xl">
          第 {gameState.age} 年
        </h2>
        
        <motion.p
          key={currentEvent?.title}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-lg font-semibold text-[#9a5b2f] sm:text-xl"
        >
          {currentEvent?.title || '初入仙途'}
        </motion.p>
      </div>

      <motion.div
        className={`scroll-container mb-4 rounded-lg border p-4 sm:mb-6 sm:p-6 ${getEventColor(currentEvent?.result || '')}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <p className="min-h-[72px] text-base font-semibold leading-relaxed text-stone-950 sm:min-h-[80px] sm:text-lg">
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
          <span className={`rounded-full px-3 py-1 text-sm font-semibold ${
            isPendingChoice ? 'bg-[#eef2e7] text-[#45564f]' :
            currentEvent?.result === 'success' ? 'bg-[#e7eddd] text-[#355d58]' :
            currentEvent?.result === 'failure' ? 'bg-[#f2d9d2] text-[#9d3d2f]' :
            'bg-[#eee8d4] text-[#6d634d]'
          }`}>
            {getResultText(currentEvent?.result || '')}
          </span>
        </div>
      </motion.div>

      {isPendingChoice ? (
        <EventChoices
          choices={getCurrentEventChoices()}
          onChoose={chooseEventOption}
        />
      ) : (
        <>
          {showBreakthroughControls && (
            <PreparationPanel
              canUse={!isPendingChoice}
              familyWealth={gameState.attributes.家境}
              shouldPrepare={gameState.cultivationProgress > 0 && !canBreakthrough}
              onPrepare={useBreakthroughPreparation}
            />
          )}
          <div className="flex flex-col justify-center gap-3 sm:flex-row sm:flex-wrap">
            {showBreakthroughControls && canBreakthrough && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onBreakthrough}
                className="w-full rounded-md border border-[#a9823c]/45 bg-[#f0dfad] px-6 py-3 text-lg font-bold text-[#7a5426] shadow-lg transition-all hover:brightness-105 sm:w-auto sm:px-8 sm:text-xl"
              >
                突破瓶颈
              </motion.button>
            )}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleContinue}
            className="ink-button-primary w-full text-lg sm:w-auto sm:text-xl"
          >
            继续修仙
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleMeditationEndClick}
            className={`w-full text-lg sm:w-auto sm:text-xl ${
              isConfirmingMeditationEnd
                ? 'rounded-md border border-[#a94d37]/45 bg-[#f2d9d2] px-6 py-3 font-bold text-[#9d3d2f] shadow-md transition-all hover:brightness-105'
                : 'ink-button-secondary'
            }`}
          >
            {isConfirmingMeditationEnd ? '确认散功' : '散功坐化'}
          </motion.button>
            {isConfirmingMeditationEnd && (
              <motion.button
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsConfirmingMeditationEnd(false)}
                className="w-full rounded-md border border-[#738275]/35 bg-[#fff9e8]/70 px-6 py-3 text-lg font-bold text-[#45564f] transition-all hover:bg-[#fffdf2] sm:w-auto sm:text-xl"
              >
                取消
              </motion.button>
            )}
          </div>
          {isConfirmingMeditationEnd && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 text-center text-sm font-semibold text-[#9d3d2f]"
            >
              散去一身修为，此世将就此结束。
            </motion.p>
          )}
        </>
      )}
    </motion.div>
  );
}

function EventChoices({
  choices,
  onChoose
}: {
  choices: EventChoice[];
  onChoose: (choiceId: string) => void;
}) {
  return (
    <div className="grid gap-3 md:grid-cols-3">
      {choices.map(choice => (
        <motion.button
          key={choice.id}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => onChoose(choice.id)}
          className="rounded-md border border-[#738275]/30 bg-[#fff9e8]/70 px-4 py-3 text-left transition-all hover:border-[#9a5b2f]/45 hover:bg-[#fffdf2] sm:py-4"
        >
          <div className="font-bold text-[#355d58]">{choice.label}</div>
          <div className="mt-1 text-sm text-[#66766e]">{choice.description}</div>
        </motion.button>
      ))}
    </div>
  );
}

export function PreparationPanel({
  canUse,
  familyWealth,
  shouldPrepare,
  onPrepare
}: {
  canUse: boolean;
  familyWealth: number;
  shouldPrepare: boolean;
  onPrepare: (actionId: string) => void;
}) {
  const actions = [
    { id: 'stabilize', label: '稳固根基', cost: 6 },
    { id: 'elixir', label: '购置丹药', cost: 18 },
    { id: 'master', label: '请教高人', cost: 16 },
    { id: 'ward', label: '布置护阵', cost: 12 }
  ];

  return (
    <div className="mb-4 rounded-md border border-[#738275]/25 bg-[#fff9e8]/45 px-3 py-3 sm:mb-5 sm:px-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2 text-sm">
        <span className="font-semibold text-[#45564f]">突破准备</span>
        <span className={shouldPrepare ? 'text-[#9a5b2f]' : 'text-[#66766e]'}>
          家境可用于补短板
        </span>
      </div>
      <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
        {actions.map(action => {
          const disabled = !canUse || familyWealth < action.cost;
          return (
            <button
              key={action.id}
              disabled={disabled}
              onClick={() => onPrepare(action.id)}
              className={`min-h-[48px] rounded border px-2 py-2 text-xs font-semibold transition-all sm:px-3 sm:text-sm ${
                disabled
                  ? 'border-[#738275]/15 bg-[#eee8d4]/45 text-[#8d947f]'
                  : 'border-[#738275]/30 bg-[#fffdf2]/70 text-[#355d58] hover:border-[#9a5b2f]/45'
              }`}
            >
              {action.label}
              <span className="block text-xs font-normal">家境 {action.cost}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
