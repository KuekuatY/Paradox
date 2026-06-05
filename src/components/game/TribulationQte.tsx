import { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import type { TribulationState } from '@/types';

interface TribulationQteProps {
  tribulation: TribulationState;
  onResolveStrike: (success: boolean) => void;
}

export default function TribulationQte({
  tribulation,
  onResolveStrike
}: TribulationQteProps) {
  const [marker, setMarker] = useState(50);
  const [locked, setLocked] = useState(false);
  const [flashText, setFlashText] = useState<string | null>(null);
  const animationRef = useRef<number | null>(null);
  const timeoutRef = useRef<number | null>(null);
  const strikeIndex = tribulation.strikesResolved + 1;
  const successThreshold = Math.ceil(tribulation.strikesRequired * 0.6);
  const zoneWidth = useMemo(() => {
    return Math.max(12, 27 - tribulation.targetRealmLevel * 1.25 - tribulation.strikesResolved * 0.45);
  }, [tribulation.strikesResolved, tribulation.targetRealmLevel]);
  const zoneStart = (100 - zoneWidth) / 2;
  const zoneEnd = zoneStart + zoneWidth;

  useEffect(() => {
    if (locked) return undefined;

    const startedAt = performance.now();
    const speed = 0.7 + tribulation.targetRealmLevel * 0.08 + tribulation.strikesResolved * 0.06;
    const animate = (now: number) => {
      const elapsed = (now - startedAt) / 1000;
      const nextMarker = (Math.sin(elapsed * Math.PI * 2 * speed) + 1) * 50;
      setMarker(nextMarker);
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [locked, tribulation.strikesResolved, tribulation.targetRealmLevel]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleStrike = () => {
    if (locked) return;

    const success = marker >= zoneStart && marker <= zoneEnd;
    setLocked(true);
    setFlashText(success ? '雷息入体' : '劫雷反噬');
    timeoutRef.current = window.setTimeout(() => {
      setFlashText(null);
      setLocked(false);
      onResolveStrike(success);
    }, 520);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      className="ink-panel rounded-lg p-4 sm:p-6 lg:p-8"
    >
      <div className="mb-5 text-center">
        <motion.div
          animate={{ opacity: [0.75, 1, 0.75], scale: [1, 1.04, 1] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
          className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full border-2 border-[#a94d37] text-2xl font-bold text-[#a94d37] sm:h-16 sm:w-16 sm:text-3xl"
        >
          劫
        </motion.div>
        <h2 className="ink-title text-2xl font-bold sm:text-3xl">天雷临身</h2>
        <p className="mt-2 text-sm font-semibold text-[#6d634d] sm:text-base">
          目标 {tribulation.targetRealmName} · 第 {strikeIndex}/{tribulation.strikesRequired} 道雷
        </p>
      </div>

      <div className="rounded-md border border-[#738275]/25 bg-[#fff9e8]/55 px-3 py-4 sm:px-5 sm:py-5">
        <div className="mb-4 grid grid-cols-3 gap-2 text-center text-xs sm:text-sm">
          <TribulationStat label="已稳住" value={tribulation.successes} tone="good" />
          <TribulationStat label="已失手" value={tribulation.failures} tone="bad" />
          <TribulationStat label="成劫门槛" value={successThreshold} tone="plain" />
        </div>

        <div className="relative h-12 overflow-hidden rounded-md border border-[#738275]/25 bg-[#e8e0c7] shadow-inner">
          <div
            className="absolute inset-y-0 bg-[#e7eddd]/90"
            style={{ left: `${zoneStart}%`, width: `${zoneWidth}%` }}
          />
          <div className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-[#738275]/35" />
          <motion.div
            animate={{ left: `${marker}%` }}
            transition={{ duration: 0.04, ease: 'linear' }}
            className={`absolute top-1/2 h-10 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full ${
              locked
                ? marker >= zoneStart && marker <= zoneEnd
                  ? 'bg-[#355d58]'
                  : 'bg-[#a94d37]'
                : 'bg-[#9a5b2f]'
            } shadow-md`}
          />
        </div>

        <div className="mt-3 min-h-[24px] text-center text-sm font-bold text-[#45564f]">
          {flashText ?? '雷光入定区时凝神'}
        </div>

        <div className="mt-4 flex justify-center">
          <button
            type="button"
            disabled={locked}
            onClick={handleStrike}
            className={`w-full rounded-md border px-6 py-3 text-lg font-bold transition sm:w-auto sm:px-10 ${
              locked
                ? 'border-[#738275]/20 bg-[#eee8d4]/55 text-[#8d947f]'
                : 'border-[#a9823c]/55 bg-[#f0dfad] text-[#7a5426] shadow-md hover:brightness-105'
            }`}
          >
            凝神接雷
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function TribulationStat({
  label,
  value,
  tone
}: {
  label: string;
  value: number;
  tone: 'good' | 'bad' | 'plain';
}) {
  const toneClass = tone === 'good'
    ? 'text-[#355d58]'
    : tone === 'bad'
      ? 'text-[#9d3d2f]'
      : 'text-[#6d634d]';

  return (
    <div className="rounded border border-[#738275]/15 bg-[#fffdf2]/60 px-2 py-2">
      <div className="text-[#66766e]">{label}</div>
      <div className={`mt-1 text-lg font-bold ${toneClass}`}>{value}</div>
    </div>
  );
}
