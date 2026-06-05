import { motion } from 'framer-motion';
import { useGameStore } from '@/stores/gameStore';
import { realms } from '@/data/realms';
import { cultivationStrategies } from '@/data/strategies';
import { achievementCatalog, getAchievementInfo } from '@/data/achievements';
import { getLifeGoalDefinition } from '@/data/lifeGoals';
import type { ActiveLifeGoal, Attributes, CultivationStrategyId, GameEvent, Realm } from '@/types';

interface StatusPanelProps {
  showLifeGoal?: boolean;
  showStrategy?: boolean;
}

export default function StatusPanel({
  showLifeGoal = true,
  showStrategy = true
}: StatusPanelProps = {}) {
  const { gameState, setStrategy } = useGameStore();
  const { currentRealm, age, lifespan, attributes, spiritRoot, talent, cultivationProgress } = gameState;
  
  const lifespanPercent = lifespan === Infinity ? 100 : (age / lifespan) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="ink-panel rounded-lg p-3 sm:p-5"
    >
      <div className="grid gap-3 sm:gap-4 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
        <div>
          <CurrentRealmSummary currentRealm={currentRealm} />

          <div className="mb-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="ink-muted">年龄</span>
              <span className="font-semibold text-[#263832]">{age} 岁</span>
            </div>
            <div className="relative h-2 overflow-hidden rounded-full bg-[#c8c2a9]">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${lifespanPercent}%` }}
                transition={{ duration: 0.5 }}
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#5f7c64] via-[#b49a4b] to-[#9b4b35]"
              />
            </div>
            <div className="ink-muted text-right text-xs">
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

          <div className="mt-3 sm:mt-4">
            <AttributePanel attributes={attributes} cap={currentRealm.attributeCap} />
          </div>
        </div>

        <div className="space-y-3 sm:space-y-4">
          {(spiritRoot || talent) && (
            <div className="grid grid-cols-1 gap-3">
              {spiritRoot && (
                <FateSummary
                  label="灵根"
                  name={spiritRoot.name}
                  rarity={spiritRoot.rarity}
                  description={spiritRoot.description}
                />
              )}
              {talent && (
                <FateSummary
                  label="天赋"
                  name={talent.name}
                  rarity={talent.rarity}
                  description={talent.description}
                />
              )}
            </div>
          )}

          {showLifeGoal && gameState.status === 'playing' && (
            <LifeGoalPanel
              activeGoal={gameState.activeGoal}
              completedCount={gameState.completedGoals.length}
            />
          )}

          {showStrategy && gameState.status === 'playing' && (
            <StrategyPanel
              selectedStrategy={gameState.strategy}
              onSelect={setStrategy}
            />
          )}
        </div>
      </div>
    </motion.div>
  );
}

export function CurrentRealmSummary({ currentRealm }: { currentRealm: Realm }) {
  return (
    <div className="mb-4 text-center sm:mb-5">
      <div className="mb-2 text-sm text-[#66766e]">当前境界</div>
      <motion.div
        key={currentRealm.name}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="ink-title text-2xl font-bold sm:text-3xl"
      >
        {currentRealm.name}
      </motion.div>
      <p className="ink-muted mt-1 text-xs">{currentRealm.description}</p>
    </div>
  );
}

export function FateSummary({
  label,
  name,
  rarity,
  description
}: {
  label: string;
  name: string;
  rarity: string;
  description: string;
}) {
  return (
    <div className="rounded-md border border-[#738275]/20 bg-[#fff9e8]/45 px-3 py-2 text-center">
      <div className="ink-muted text-xs">{label}</div>
      <div className="text-sm font-semibold sm:text-base" style={{ color: getRarityColor(rarity) }}>
        {name}
      </div>
      <p className="ink-muted mt-1 text-xs leading-relaxed">{description}</p>
    </div>
  );
}

export function CultivationProgress({
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
    <div className="mb-3 rounded-md border border-[#738275]/25 bg-[#fff9e8]/45 px-3 py-3 sm:px-4">
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

export function BreakthroughRequirements({
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
      <div className="rounded-md border border-[#738275]/25 bg-[#fff9e8]/45 px-3 py-3 text-center sm:px-4">
        <div className="text-xs text-[#66766e]">突破门槛</div>
        <div className="mt-1 font-bold text-[#9a5b2f]">大道圆满</div>
      </div>
    );
  }

  const requirementItems = getRequirementItems(nextRealm, attributes);

  return (
    <div className="rounded-md border border-[#738275]/25 bg-[#fff9e8]/45 px-3 py-3 sm:px-4">
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="ink-muted">突破门槛</span>
        <span className="font-semibold text-[#263832]">{nextRealm.name}</span>
      </div>
      <div className="mt-3 grid grid-cols-1 gap-2 min-[420px]:grid-cols-2">
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

export function StrategyPanel({
  selectedStrategy,
  onSelect
}: {
  selectedStrategy: CultivationStrategyId;
  onSelect: (strategyId: CultivationStrategyId) => void;
}) {
  const selected = cultivationStrategies.find(strategy => strategy.id === selectedStrategy) ?? cultivationStrategies[0];

  return (
    <div className="rounded-md border border-[#738275]/25 bg-[#fff9e8]/45 px-3 py-3 sm:px-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2 text-sm">
        <span className="font-semibold text-[#45564f]">修炼策略</span>
        <span className="text-xs text-[#66766e]">当前偏向 {selected.focus}</span>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {cultivationStrategies.map(strategy => {
          const isSelected = strategy.id === selectedStrategy;

          return (
            <button
              key={strategy.id}
              onClick={() => onSelect(strategy.id)}
              className={`min-h-[44px] rounded border px-2 py-2 text-left text-xs transition-all sm:min-h-[46px] sm:text-sm ${
                isSelected
                  ? 'border-[#355d58]/55 bg-[#e7eddd] text-[#263832]'
                  : 'border-[#738275]/20 bg-[#fffdf2]/55 text-[#59645f] hover:border-[#9a5b2f]/40'
              }`}
            >
              <span className="block font-semibold leading-tight">{strategy.name}</span>
              <span className="block text-xs leading-tight opacity-80">{strategy.focus}</span>
            </button>
          );
        })}
      </div>
      <p className="mt-3 text-xs leading-relaxed text-[#66766e]">
        {selected.description}
      </p>
    </div>
  );
}

export function LifeGoalPanel({
  activeGoal,
  completedCount
}: {
  activeGoal: ActiveLifeGoal | null;
  completedCount: number;
}) {
  const definition = activeGoal ? getLifeGoalDefinition(activeGoal.id) : undefined;

  if (!activeGoal || !definition) {
    return (
      <div className="rounded-md border border-[#738275]/25 bg-[#fff9e8]/45 px-3 py-3 text-sm text-[#66766e] sm:px-4">
        道途目标将在入世后显现。
      </div>
    );
  }

  const progressPercent = Math.min(100, Math.round(activeGoal.progress / definition.target * 100));
  const rewardEntries = Object.entries(definition.reward).filter(([, value]) => value !== undefined);

  return (
    <div className="rounded-md border border-[#738275]/25 bg-[#fff9e8]/45 px-3 py-3 sm:px-4">
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="font-semibold text-[#45564f]">道途目标</span>
        <span className="text-xs text-[#66766e]">已成 {completedCount}</span>
      </div>
      <div className="flex flex-col gap-2 min-[420px]:flex-row min-[420px]:items-start min-[420px]:justify-between">
        <div>
          <div className="font-bold text-[#355d58]">{definition.name}</div>
          <p className="mt-1 text-xs leading-relaxed text-[#66766e]">{definition.description}</p>
        </div>
        <div className="shrink-0 rounded border border-[#738275]/20 bg-[#fffdf2]/60 px-2 py-1 text-xs font-semibold text-[#6d634d]">
          {definition.targetLabel}
        </div>
      </div>
      <div className="mt-3">
        <div className="mb-1 flex items-center justify-between text-xs">
          <span className="ink-muted">进度</span>
          <span className="font-semibold text-[#263832]">
            {activeGoal.progress}/{definition.target}
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
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {rewardEntries.map(([key, value]) => (
          <span
            key={key}
            className="rounded-full bg-[#e7eddd] px-2 py-1 text-xs font-semibold text-[#355d58]"
          >
            {key} {typeof value === 'number' && value > 0 ? '+' : ''}{String(value)}
          </span>
        ))}
      </div>
    </div>
  );
}

export function AchievementPanel({ achievements }: { achievements: string[] }) {
  const unlocked = new Set(achievements);
  const visibleAchievements = achievementCatalog.slice(0, 8);

  return (
    <div className="rounded-md border border-[#738275]/25 bg-[#fff9e8]/45 px-3 py-3 sm:px-4">
      <div className="mb-3 flex items-center justify-between text-sm">
        <span className="font-semibold text-[#45564f]">成就</span>
        <span className="text-xs text-[#66766e]">
          {achievements.length}/{achievementCatalog.length}
        </span>
      </div>
      <div className="grid grid-cols-1 gap-2 min-[420px]:grid-cols-2">
        {visibleAchievements.map(achievement => {
          const isUnlocked = unlocked.has(achievement.id);

          return (
            <div
              key={achievement.id}
              title={achievement.description}
              className={`rounded border px-2 py-2 text-xs ${
                isUnlocked
                  ? 'border-[#a9823c]/35 bg-[#f0dfad]/55 text-[#6f4d24]'
                  : 'border-[#738275]/15 bg-[#eee8d4]/40 text-[#8d947f]'
              }`}
            >
              <span className="block truncate font-semibold">
                {isUnlocked ? achievement.name : '未解锁'}
              </span>
              <span className="block truncate opacity-75">
                {isUnlocked ? achievement.description : achievement.name}
              </span>
            </div>
          );
        })}
      </div>
      {achievements.length > visibleAchievements.length && (
        <div className="mt-2 text-right text-xs text-[#66766e]">
          另有 {achievements.length - visibleAchievements.length} 项已解锁
        </div>
      )}
      {achievements.length > 0 && (
        <div className="mt-2 text-xs text-[#66766e]">
          最近：{getAchievementInfo(achievements[achievements.length - 1]).name}
        </div>
      )}
    </div>
  );
}

export function RecentEvents({ events }: { events: GameEvent[] }) {
  const recentEvents = events.slice(-4).reverse();

  return (
    <div className="rounded-md border border-[#738275]/25 bg-[#fff9e8]/45 px-3 py-3 sm:px-4">
      <div className="mb-3 flex items-center justify-between text-sm">
        <span className="font-semibold text-[#45564f]">最近年表</span>
        <span className="text-xs text-[#66766e]">{events.length} 事</span>
      </div>
      {recentEvents.length === 0 ? (
        <div className="rounded border border-[#738275]/15 bg-[#fffdf2]/50 px-3 py-3 text-sm text-[#66766e]">
          此世年表尚未落笔。
        </div>
      ) : (
        <div className="space-y-2">
          {recentEvents.map(event => (
            <div
              key={`${event.id}-${event.age}`}
              className="rounded border border-[#738275]/15 bg-[#fffdf2]/50 px-3 py-2"
            >
              <div className="flex items-center justify-between gap-2 text-xs">
                <span className="font-semibold text-[#355d58]">第 {event.age} 年</span>
                <span className={getEventResultClass(event.result)}>{getEventResultText(event.result)}</span>
              </div>
              <div className="mt-1 truncate text-sm font-semibold text-[#45564f]">{event.title}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function getEventResultText(result: GameEvent['result']): string {
  if (result === 'success') return '成';
  if (result === 'failure') return '折';
  return '平';
}

function getEventResultClass(result: GameEvent['result']): string {
  if (result === 'success') return 'font-semibold text-[#355d58]';
  if (result === 'failure') return 'font-semibold text-[#9d3d2f]';
  return 'font-semibold text-[#6d634d]';
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

export function AttributePanel({ attributes, cap }: { attributes: Attributes; cap: number }) {
  return (
    <div className="rounded-md border border-[#738275]/25 bg-[#fff9e8]/45 px-3 py-3 sm:px-4">
      <div className="mb-3 flex items-center justify-between text-xs">
        <span className="font-semibold text-[#45564f]">五维属性</span>
        <span className="text-[#66766e]">当前上限 {cap}</span>
      </div>
      <div className="space-y-2.5 sm:space-y-3">
        {Object.entries(attributes).map(([key, value]) => (
          <AttributeBar key={key} name={key} value={value} cap={cap} />
        ))}
      </div>
    </div>
  );
}

function AttributeBar({ name, value, cap }: { name: string; value: number; cap: number }) {
  const percent = Math.min(100, value / cap * 100);

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="ink-muted">{name}</span>
        <span className="font-semibold text-[#263832]">{value}/{cap}</span>
      </div>
      <div className="relative h-1.5 bg-[#c8c2a9] rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
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
    '变异': '#4f6f8f',
    '极品': '#7f6a3e',
    '神话': '#9a5b2f',
    '传说': '#a94d37'
  };
  return colors[rarity] || '#9CA3AF';
}
