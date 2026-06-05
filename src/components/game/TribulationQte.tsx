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
  const markerRef = useRef(50);
  const strikeIndex = tribulation.strikesResolved + 1;
  const successThreshold = Math.ceil(tribulation.strikesRequired * 0.6);
  const zoneWidth = useMemo(() => {
    return Math.max(16, 33 - tribulation.targetRealmLevel * 1.1 - tribulation.strikesResolved * 0.35);
  }, [tribulation.strikesResolved, tribulation.targetRealmLevel]);
  const zoneStart = (100 - zoneWidth) / 2;
  const zoneEnd = zoneStart + zoneWidth;
  const strikePips = Array.from({ length: tribulation.strikesRequired }, (_, index) => {
    if (index < tribulation.successes) return 'success';
    if (index < tribulation.successes + tribulation.failures) return 'failure';
    if (index === tribulation.strikesResolved) return 'current';
    return 'pending';
  });

  useEffect(() => {
    if (locked) return undefined;

    const startedAt = performance.now();
    const speed = 0.28 + tribulation.targetRealmLevel * 0.03 + tribulation.strikesResolved * 0.02;
    const animate = (now: number) => {
      const elapsed = (now - startedAt) / 1000;
      const nextMarker = (Math.sin(elapsed * Math.PI * 2 * speed) + 1) * 50;
      markerRef.current = nextMarker;
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
    markerRef.current = 50;
    setMarker(50);
    setLocked(false);
    setFlashText(null);
  }, [tribulation.strikesResolved]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleStrike = () => {
    if (locked) return;

    if (animationRef.current !== null) {
      cancelAnimationFrame(animationRef.current);
    }

    const capturedMarker = markerRef.current;
    const success = capturedMarker >= zoneStart && capturedMarker <= zoneEnd;
    setMarker(capturedMarker);
    setLocked(true);
    setFlashText(success ? '雷息入体' : '劫雷反噬');
    timeoutRef.current = window.setTimeout(() => {
      setFlashText(null);
      onResolveStrike(success);
    }, 520);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      className="ink-panel-dark relative overflow-hidden rounded-lg p-4 text-[#fff9e8] sm:p-6 lg:p-8"
    >
      <div className="pointer-events-none absolute inset-0 opacity-70">
        <div className="absolute left-0 right-0 top-0 h-24 bg-gradient-to-b from-[#141d1b] to-transparent" />
        <div className="absolute -left-12 top-8 h-16 w-1/2 rotate-[-10deg] bg-[#fff9e8]/5 blur-sm" />
        <div className="absolute right-[-18%] top-16 h-20 w-2/3 rotate-[12deg] bg-[#b49a4b]/10 blur-sm" />
        <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-[#141d1b]/75 to-transparent" />
      </div>

      <div className="relative mb-5 text-center">
        <motion.div
          animate={{ opacity: [0.75, 1, 0.75], scale: [1, 1.05, 1] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
          className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full border-2 border-[#d1b36a]/80 bg-[#192521]/80 text-3xl font-bold text-[#f0dfad] shadow-[0_0_28px_rgba(209,179,106,0.26)] sm:h-20 sm:w-20 sm:text-4xl"
        >
          劫
        </motion.div>
        <h2 className="text-2xl font-bold text-[#fff9e8] sm:text-3xl">天雷临身</h2>
        <p className="mt-2 text-sm font-semibold text-[#d7c491] sm:text-base">
          目标 {tribulation.targetRealmName} · 第 {strikeIndex}/{tribulation.strikesRequired} 道雷
        </p>
      </div>

      <div className="relative rounded-md border border-[#d1b36a]/30 bg-[#17231f]/78 px-3 py-4 shadow-[inset_0_1px_0_rgba(255,249,232,0.08)] sm:px-5 sm:py-5">
        <div className="mb-4 flex justify-center gap-1.5">
          {strikePips.map((state, index) => (
            <span
              key={`${state}-${index}`}
              className={`h-2.5 w-2.5 rounded-full border ${
                state === 'success'
                  ? 'border-[#d1b36a] bg-[#d1b36a]'
                  : state === 'failure'
                    ? 'border-[#b98678] bg-[#a94d37]'
                    : state === 'current'
                      ? 'border-[#f0dfad] bg-[#fff9e8] shadow-[0_0_14px_rgba(240,223,173,0.72)]'
                      : 'border-[#d1b36a]/35 bg-[#fff9e8]/10'
              }`}
            />
          ))}
        </div>

        <div className="mb-4 grid grid-cols-3 gap-2 text-center text-xs sm:text-sm">
          <TribulationStat label="已稳住" value={tribulation.successes} tone="good" />
          <TribulationStat label="已失手" value={tribulation.failures} tone="bad" />
          <TribulationStat label="成劫门槛" value={successThreshold} tone="plain" />
        </div>

        <div className="relative h-16 overflow-hidden rounded-md border border-[#d1b36a]/30 bg-[#111b18] shadow-inner">
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,249,232,0.05)_1px,transparent_1px)] bg-[length:10%_100%]" />
          <div className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-[#d1b36a]/30" />
          <div
            className="absolute inset-y-1 rounded-sm border border-[#d1b36a]/55 bg-[#d1b36a]/20 shadow-[0_0_22px_rgba(209,179,106,0.24)]"
            style={{ left: `${zoneStart}%`, width: `${zoneWidth}%` }}
          />
          <div className="absolute left-[18%] top-0 h-full w-px rotate-12 bg-[#fff9e8]/10" />
          <div className="absolute left-[72%] top-0 h-full w-px -rotate-12 bg-[#fff9e8]/10" />
          <motion.div
            animate={{ left: `${marker}%` }}
            transition={{ duration: locked ? 0 : 0.04, ease: 'linear' }}
            className={`absolute top-1/2 h-14 w-4 -translate-x-1/2 -translate-y-1/2 rounded-sm ${
              locked
                ? marker >= zoneStart && marker <= zoneEnd
                  ? 'bg-[#d1b36a]'
                  : 'bg-[#a94d37]'
                : 'bg-[#f0dfad]'
            } shadow-[0_0_24px_rgba(240,223,173,0.42)]`}
          >
            <span className="absolute left-1/2 top-[-8px] h-8 w-px -translate-x-1/2 rotate-12 bg-current" />
            <span className="absolute bottom-[-8px] left-1/2 h-8 w-px -translate-x-1/2 -rotate-12 bg-current" />
          </motion.div>
        </div>

        <div className={`mt-3 min-h-[24px] text-center text-sm font-bold ${
          flashText === '劫雷反噬' ? 'text-[#f0b0a4]' : 'text-[#f0dfad]'
        }`}>
          {flashText ?? '雷光入定区时凝神'}
        </div>

        <div className="mt-4 flex justify-center">
          <button
            type="button"
            disabled={locked}
            onClick={handleStrike}
            className={`w-full rounded-md border px-6 py-3 text-lg font-bold transition sm:w-auto sm:px-10 ${
              locked
                ? 'border-[#738275]/25 bg-[#263832]/70 text-[#8d947f]'
                : 'border-[#d1b36a]/60 bg-[#f0dfad] text-[#263832] shadow-[0_12px_26px_rgba(20,28,25,0.28)] hover:brightness-105'
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
    ? 'text-[#9fca9a]'
    : tone === 'bad'
      ? 'text-[#f0b0a4]'
      : 'text-[#f0dfad]';

  return (
    <div className="rounded border border-[#d1b36a]/20 bg-[#fff9e8]/8 px-2 py-2">
      <div className="text-[#b7bcae]">{label}</div>
      <div className={`mt-1 text-lg font-bold ${toneClass}`}>{value}</div>
    </div>
  );
}
