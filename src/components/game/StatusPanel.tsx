import { motion } from 'framer-motion';
import { useGameStore } from '@/stores/gameStore';
import { realms } from '@/data/realms';
import type { Attributes } from '@/types';

export default function StatusPanel() {
  const { gameState } = useGameStore();
  const { currentRealm, age, lifespan, attributes, talent, cultivationProgress } = gameState;
  
  const lifespanPercent = lifespan === Infinity ? 100 : (age / lifespan) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="ink-panel rounded-lg p-6"
    >
      <div className="text-center mb-6">
        <div className="text-sm text-[#66766e] mb-2">当前境界</div>
        <motion.div
          key={currentRealm.name}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="ink-title text-3xl font-bold"
        >
          {currentRealm.name}
        </motion.div>
        <p className="ink-muted text-xs mt-1">{currentRealm.description}</p>
      </div>

      {talent && (
        <div className="text-center border-b border-[#738275]/30 pb-4 mb-4">
          <div className="ink-muted text-xs">天赋</div>
          <div className="text-lg font-semibold" style={{ color: getRarityColor(talent.rarity) }}>
            {talent.name}
          </div>
          <p className="ink-muted text-xs mt-1">{talent.description}</p>
        </div>
      )}

      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm">
          <span className="ink-muted">年龄</span>
          <span className="font-semibold text-[#263832]">{age} 岁</span>
        </div>
        <div className="relative h-2 bg-[#c8c2a9] rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${lifespanPercent}%` }}
            transition={{ duration: 0.5 }}
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#5f7c64] via-[#b49a4b] to-[#9b4b35]"
          />
        </div>
        <div className="ink-muted text-xs text-right">
          寿命: {lifespan === Infinity ? '无尽' : `${lifespan} 年`}
        </div>
      </div>

      <CultivationProgress
        currentRealmName={currentRealm.name}
        progress={cultivationProgress}
      />

      <BreakthroughRequirements
        currentRealmName={currentRealm.name}
        attributes={attributes}
      />

      <div className="space-y-3">
        <div className="ink-muted text-xs mb-2">属性</div>
        {Object.entries(attributes).map(([key, value]) => (
          <AttributeBar key={key} name={key} value={value} />
        ))}
      </div>
    </motion.div>
  );
}

function CultivationProgress({
  currentRealmName,
  progress
}: {
  currentRealmName: string;
  progress: number;
}) {
  const realmIndex = realms.findIndex(realm => realm.name === currentRealmName);
  const nextRealm = realmIndex >= 0 ? realms[realmIndex + 1] : undefined;
  const requiredProgress = nextRealm?.cultivationRequired ?? 0;
  const progressPercent = requiredProgress > 0
    ? Math.round(Math.min(100, progress / requiredProgress * 100))
    : 100;

  return (
    <div className="mb-3 rounded-md border border-[#738275]/25 bg-[#fff9e8]/45 px-4 py-3">
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="ink-muted">修炼进度</span>
        <span className="font-semibold text-[#263832]">
          {requiredProgress > 0 ? `${progress}/${requiredProgress}` : '圆满'}
        </span>
      </div>
      <div className="relative h-2 rounded-full bg-[#c8c2a9]">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-[#355d58] to-[#9a8a54]"
        />
      </div>
      <div className="mt-1 text-right text-xs text-[#66766e]">
        {nextRealm ? `距 ${nextRealm.name} ${progressPercent}%` : '大道圆满'}
      </div>
    </div>
  );
}

function BreakthroughRequirements({
  currentRealmName,
  attributes
}: {
  currentRealmName: string;
  attributes: Attributes;
}) {
  const realmIndex = realms.findIndex(realm => realm.name === currentRealmName);
  const nextRealm = realmIndex >= 0 ? realms[realmIndex + 1] : undefined;

  if (!nextRealm) {
    return (
      <div className="mb-5 rounded-md border border-[#738275]/25 bg-[#fff9e8]/45 px-4 py-3 text-center">
        <div className="text-xs text-[#66766e]">突破门槛</div>
        <div className="mt-1 font-bold text-[#9a5b2f]">大道圆满</div>
      </div>
    );
  }

  const requirementItems = getRequirementItems(nextRealm, attributes);

  return (
    <div className="mb-5 rounded-md border border-[#738275]/25 bg-[#fff9e8]/45 px-4 py-3">
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="ink-muted">突破门槛</span>
        <span className="font-semibold text-[#263832]">{nextRealm.name}</span>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2">
        {requirementItems.map(item => (
          <div
            key={item.name}
            className="flex items-center justify-between rounded border border-[#738275]/20 bg-[#fffdf2]/50 px-2 py-1 text-xs"
          >
            <span className="ink-muted">{item.name}</span>
            <span className={item.met ? 'font-semibold text-[#355d58]' : 'font-semibold text-[#9a5b2f]'}>
              {item.current}/{item.required}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function getRequirementItems(
  nextRealm: (typeof realms)[number],
  attributes: Attributes
) {
  return Object.entries(nextRealm.requirements.attributes).map(([name, required]) => {
    const attrName = name as keyof Attributes;
    const current = attributes[attrName];
    const requiredValue = required ?? 1;

    return {
      name,
      current,
      required: requiredValue,
      met: current >= requiredValue
    };
  });
}

function AttributeBar({ name, value }: { name: string; value: number }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="ink-muted">{name}</span>
        <span className="font-semibold text-[#263832]">{value}</span>
      </div>
      <div className="relative h-1.5 bg-[#c8c2a9] rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value * 10}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#355d58] to-[#88a876]"
        />
      </div>
    </div>
  );
}

function getRarityColor(rarity: string): string {
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
}
