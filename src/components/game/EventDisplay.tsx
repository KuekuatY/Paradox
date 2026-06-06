import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '@/stores/gameStore';
import { cultivationPaths } from '@/data/cultivationPaths';
import { getItem } from '@/data/items';
import { getTechnique } from '@/data/techniques';
import type { CombatReport, CultivationPath, EventChoice, InventoryEntry, InventoryReward, YearActionId } from '@/types';

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
  const {
    gameState,
    chooseCultivationPath,
    chooseEventOption,
    getCurrentEventChoices,
    selectYearAction
  } = useGameStore();
  const [displayedText, setDisplayedText] = useState('');
  const [isConfirmingMeditationEnd, setIsConfirmingMeditationEnd] = useState(false);
  
  const currentEvent = gameState.pendingEvent ?? gameState.events[gameState.events.length - 1];
  const isPendingChoice = !!gameState.pendingEvent;
  const effectEntries = !isPendingChoice && currentEvent?.appliedEffects
    ? Object.entries(currentEvent.appliedEffects).filter(([, value]) => value !== undefined && value !== 0)
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
      'combat': '战',
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
      case 'great-success':
        return 'border-[#7f9a78]/35';
      case 'great-failure':
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
      case 'great-success':
        return '大成功';
      case 'great-failure':
        return '大失败';
      default:
        return '普通';
    }
  };

  const formatEffect = (key: string, value: string | number) => {
    if (key === '境界') {
      return value === 'advance' ? '境界突破' : '境界跌落';
    }

    if (key === '时间' && typeof value === 'number') {
      return `耗时 ${value} 年`;
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

        {!isPendingChoice && currentEvent?.combat && (
          <CombatReportPanel report={currentEvent.combat} />
        )}

        {!isPendingChoice && currentEvent?.itemRewards && currentEvent.itemRewards.length > 0 && (
          <ItemRewardPanel rewards={currentEvent.itemRewards} />
        )}

        {!isPendingChoice && currentEvent?.itemLosses && currentEvent.itemLosses.length > 0 && (
          <ItemLossPanel losses={currentEvent.itemLosses} />
        )}

        {!isPendingChoice && currentEvent?.techniqueRewards && currentEvent.techniqueRewards.length > 0 && (
          <TechniqueRewardPanel techniqueIds={currentEvent.techniqueRewards} />
        )}
        
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
            currentEvent?.result === 'great-success' ? 'bg-[#e8d49a] text-[#7a5426]' :
            currentEvent?.result === 'great-failure' ? 'bg-[#e6b8ae] text-[#8f2f24]' :
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
      ) : gameState.pendingPathChoice ? (
        <PathChoices onChoose={chooseCultivationPath} />
      ) : (
        <>
          {showBreakthroughControls && canBreakthrough && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 rounded-md border border-[#a9823c]/45 bg-[#f0dfad]/70 px-4 py-3 text-center shadow-sm"
            >
              <div className="text-sm font-semibold text-[#7a5426] sm:text-base">
                修为已满，可以尝试突破
              </div>
            </motion.div>
          )}
          <YearActionPanel
            activeAction={gameState.selectedYearAction}
            onSelect={selectYearAction}
          />
          <div className="flex flex-col justify-center gap-3 sm:flex-row sm:flex-wrap">
            {showBreakthroughControls && canBreakthrough && (
              <motion.button
                animate={{
                  boxShadow: [
                    '0 8px 20px rgba(122, 84, 38, 0.18)',
                    '0 10px 28px rgba(169, 130, 60, 0.36)',
                    '0 8px 20px rgba(122, 84, 38, 0.18)'
                  ]
                }}
                transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onBreakthrough}
                className="w-full rounded-md border border-[#a9823c]/70 bg-[#f0dfad] px-6 py-3 text-lg font-bold text-[#7a5426] transition-all hover:brightness-105 sm:w-auto sm:px-8 sm:text-xl"
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

function YearActionPanel({
  activeAction,
  onSelect
}: {
  activeAction: YearActionId;
  onSelect: (actionId: YearActionId) => void;
}) {
  const { gameState } = useGameStore();
  const actions: Array<{ id: YearActionId; label: string; hint: string }> = [
    { id: 'cultivate', label: '修炼', hint: '主涨修为' },
    { id: 'adventure', label: '历练', hint: '触发事件' },
    { id: 'seclusion', label: '闭关', hint: '悟性神识' },
    { id: 'life-skill', label: '百艺', hint: '材料熟练' },
    { id: 'recuperate', label: '调养', hint: '恢复伤势' }
  ];

  return (
    <div className="mb-4 rounded-md border border-[#738275]/25 bg-[#fff9e8]/45 px-3 py-3">
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="font-semibold text-[#45564f]">本年安排</span>
        <span className="text-xs text-[#66766e]">影响下一次继续修仙</span>
      </div>
      <div className="grid grid-cols-2 gap-2 min-[420px]:grid-cols-5">
        {actions.map(action => {
          const isActive = activeAction === action.id;

          return (
            <button
              key={action.id}
              type="button"
              onClick={() => onSelect(action.id)}
              className={`min-h-[48px] rounded border px-2 py-2 text-xs font-bold transition ${
                isActive
                  ? 'border-[#355d58]/45 bg-[#355d58] text-[#fff9e8]'
                  : 'border-[#738275]/25 bg-[#fffdf2]/65 text-[#59645f] hover:border-[#9a5b2f]/45'
              }`}
            >
              {action.label}
              <span className={`block text-[11px] font-normal ${isActive ? 'text-[#eef3df]' : 'text-[#66766e]'}`}>
                {getPathActionHint(gameState.cultivationPath, action.id) ?? action.hint}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function getPathActionHint(pathId: string | null, actionId: YearActionId): string | null {
  const hints: Record<string, Partial<Record<YearActionId, string>>> = {
    sword: {
      adventure: '剑修加成',
      cultivate: '剑意磨身'
    },
    body: {
      cultivate: '体修加成',
      recuperate: '恢复更强'
    },
    spell: {
      seclusion: '法修加成',
      'life-skill': '百艺略强'
    },
    demonic: {
      adventure: '高收益高怨',
      cultivate: '速成有损'
    }
  };

  return pathId ? hints[pathId]?.[actionId] ?? null : null;
}

function TechniqueRewardPanel({ techniqueIds }: { techniqueIds: string[] }) {
  return (
    <div className="mt-3 flex flex-wrap items-center gap-2 rounded-md border border-[#738275]/25 bg-[#e7eddd]/55 px-3 py-2">
      <span className="text-xs font-semibold text-[#355d58]">功法</span>
      {techniqueIds.map(techniqueId => {
        const technique = getTechnique(techniqueId);
        if (!technique) return null;

        return (
          <span
            key={techniqueId}
            className="rounded-full bg-[#fffdf2]/75 px-3 py-1 text-xs font-bold text-[#355d58]"
          >
            《{technique.name}》 · {technique.grade}阶
          </span>
        );
      })}
    </div>
  );
}

function ItemRewardPanel({ rewards }: { rewards: InventoryReward[] }) {
  return (
    <div className="mt-3 flex flex-wrap items-center gap-2 rounded-md border border-[#a9823c]/25 bg-[#f0dfad]/35 px-3 py-2">
      <span className="text-xs font-semibold text-[#7a5426]">储物戒</span>
      {rewards.map(reward => {
        const item = getItem(reward.itemId);
        if (!item) return null;

        return (
          <span
            key={reward.itemId}
            className="rounded-full bg-[#fffdf2]/75 px-3 py-1 text-xs font-bold text-[#355d58]"
          >
            {item.name} x{reward.quantity}
          </span>
        );
      })}
    </div>
  );
}

function ItemLossPanel({ losses }: { losses: InventoryReward[] }) {
  return (
    <div className="mt-3 flex flex-wrap items-center gap-2 rounded-md border border-[#b98678]/25 bg-[#f2d9d2]/45 px-3 py-2">
      <span className="text-xs font-semibold text-[#9d3d2f]">储物戒遗失</span>
      {losses.map(loss => {
        const item = getItem(loss.itemId);
        if (!item) return null;

        return (
          <span
            key={loss.itemId}
            className="rounded-full bg-[#fffdf2]/75 px-3 py-1 text-xs font-bold text-[#9d3d2f]"
          >
            {item.name} x{loss.quantity}
          </span>
        );
      })}
    </div>
  );
}

function CombatReportPanel({ report }: { report: CombatReport }) {
  const playerPercent = Math.min(100, Math.round(report.playerPower / Math.max(1, report.enemyPower) * 50));
  const enemyPercent = Math.min(100, Math.round(report.enemyPower / Math.max(1, report.playerPower) * 50));
  const injuryTone = report.injuryAfter >= 70
    ? 'text-[#9d3d2f]'
    : report.injuryAfter >= 35
      ? 'text-[#9a5b2f]'
      : 'text-[#355d58]';

  return (
    <div className="mt-4 rounded-md border border-[#738275]/25 bg-[#fffdf2]/65 px-3 py-3">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div>
          <div className="text-xs font-semibold text-[#66766e]">战斗</div>
          <div className="text-sm font-bold text-[#355d58]">
            {report.enemyName} · {report.enemyRank}
          </div>
        </div>
        <div className="rounded-full bg-[#e7eddd] px-3 py-1 text-xs font-bold text-[#355d58]">
          胜率 {report.winRate}%
        </div>
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        <CombatPowerBar label="我方战力" value={report.playerPower} percent={playerPercent} tone="player" />
        <CombatPowerBar label="敌方战力" value={report.enemyPower} percent={enemyPercent} tone="enemy" />
      </div>
      <div className="mt-3 grid grid-cols-1 gap-2 text-xs min-[420px]:grid-cols-3">
        <div className="rounded border border-[#738275]/15 bg-[#fff9e8]/60 px-2 py-2">
          <span className="block text-[#66766e]">战法</span>
          <span className="font-semibold text-[#45564f]">{report.styleText}</span>
        </div>
        <div className="rounded border border-[#738275]/15 bg-[#fff9e8]/60 px-2 py-2">
          <span className="block text-[#66766e]">修为收益</span>
          <span className={report.cultivationPercent >= 0 ? 'font-semibold text-[#355d58]' : 'font-semibold text-[#9d3d2f]'}>
            {report.cultivationPercent > 0 ? '+' : ''}{report.cultivationPercent}%
          </span>
        </div>
        <div className="rounded border border-[#738275]/15 bg-[#fff9e8]/60 px-2 py-2">
          <span className="block text-[#66766e]">伤势</span>
          <span className={`font-semibold ${injuryTone}`}>
            +{report.injuryChange} · {report.injuryAfter}/100
          </span>
        </div>
      </div>
    </div>
  );
}

function CombatPowerBar({
  label,
  value,
  percent,
  tone
}: {
  label: string;
  value: number;
  percent: number;
  tone: 'player' | 'enemy';
}) {
  return (
    <div>
      <div className="mb-1 flex justify-between text-xs">
        <span className="text-[#66766e]">{label}</span>
        <span className="font-semibold text-[#263832]">{value}</span>
      </div>
      <div className="relative h-2 overflow-hidden rounded-full bg-[#c8c2a9]">
        <div
          className={`absolute inset-y-0 left-0 rounded-full ${
            tone === 'player' ? 'bg-[#355d58]' : 'bg-[#9a5b2f]'
          }`}
          style={{ width: `${Math.max(8, percent)}%` }}
        />
      </div>
    </div>
  );
}

function PathChoices({ onChoose }: { onChoose: (pathId: CultivationPath['id']) => void }) {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      {cultivationPaths.map(path => (
        <motion.button
          key={path.id}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onChoose(path.id)}
          className="rounded-md border border-[#738275]/30 bg-[#fff9e8]/70 px-4 py-3 text-left transition-all hover:border-[#355d58]/55 hover:bg-[#eef3df] sm:py-4"
        >
          <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
            <span className="text-lg font-bold text-[#355d58]">{path.name}</span>
            <span className="rounded-full bg-[#e7eddd] px-2 py-1 text-xs font-semibold text-[#355d58]">
              {path.focus}
            </span>
          </div>
          <p className="text-sm leading-relaxed text-[#66766e]">{path.description}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {Object.entries(path.effect).map(([key, value]) => (
              <span
                key={key}
                className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                  (value ?? 0) >= 0
                    ? 'bg-[#e7eddd] text-[#355d58]'
                    : 'bg-[#f2d9d2] text-[#9d3d2f]'
                }`}
              >
                {key} {(value ?? 0) > 0 ? '+' : ''}{value}
              </span>
            ))}
            {path.build.map(item => (
              <span
                key={item}
                className="rounded-full border border-[#738275]/25 bg-[#fffdf2]/70 px-2.5 py-1 text-xs font-semibold text-[#6d634d]"
              >
                {item}
              </span>
            ))}
          </div>
        </motion.button>
      ))}
    </div>
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
  inventory,
  realmLevel,
  shouldPrepare,
  onPrepare
}: {
  canUse: boolean;
  familyWealth: number;
  inventory: InventoryEntry[];
  realmLevel: number;
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
          家境 {familyWealth} · 可补短板
        </span>
      </div>
      <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
        {actions.map(action => {
          const cost = getPreparationCost(action.cost, realmLevel);
          const itemCost = getPreparationItemLabel(action.id, inventory);
          const disabled = !canUse || (!itemCost && familyWealth < cost);
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
              <span className="block text-xs font-normal">{itemCost ?? `家境 ${cost}`}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function getPreparationItemLabel(actionId: string, inventory: InventoryEntry[]): string | null {
  const candidates: Record<string, string[]> = {
    stabilize: ['minor-array-plate', 'soul-settling-orb', 'old-manual-page'],
    elixir: ['tribulation-pill', 'dragon-blood-pill', 'bone-tempering-pill', 'qi-gathering-pill'],
    master: ['old-manual-page', 'mystic-manual-fragment', 'immortal-talisman-page'],
    ward: ['tribulation-ward', 'protection-talisman', 'minor-ward', 'minor-array-plate']
  };
  const itemId = candidates[actionId]?.find(candidateId => {
    const entry = inventory.find(item => item.itemId === candidateId);
    return (entry?.quantity ?? 0) > 0;
  });
  const item = itemId ? getItem(itemId) : undefined;

  return item ? `消耗 ${item.name}` : null;
}

function getPreparationCost(baseCost: number, realmLevel: number): number {
  if (realmLevel >= 7) return Math.ceil(baseCost * 4);
  if (realmLevel >= 5) return Math.ceil(baseCost * 2.5);
  if (realmLevel >= 3) return Math.ceil(baseCost * 1.5);
  return baseCost;
}
