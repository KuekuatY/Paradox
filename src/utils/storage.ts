import type { GameRecord } from '@/types';

const STORAGE_KEY = 'gameRecords';
const DEFAULT_STATS = {
  根骨: 0,
  悟性: 0,
  气运: 0,
  颜值: 0,
  家境: 0
};

export function saveGameRecord(record: GameRecord): void {
  const records = getGameRecords();
  records.unshift(record);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records.slice(0, 10)));
}

export function getGameRecords(): GameRecord[] {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];

  try {
    const records = JSON.parse(stored);
    if (!Array.isArray(records)) return [];

    return records
      .map(normalizeGameRecord)
      .filter((record): record is GameRecord => record !== null);
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return [];
  }
}

export function clearGameRecords(): void {
  localStorage.removeItem(STORAGE_KEY);
}

function normalizeGameRecord(record: unknown): GameRecord | null {
  if (!record || typeof record !== 'object') return null;

  const value = record as Partial<GameRecord>;
  const stats = normalizeStats(value.stats);
  const date = typeof value.date === 'string' && !Number.isNaN(new Date(value.date).getTime())
    ? value.date
    : new Date().toISOString();

  return {
    id: typeof value.id === 'string' ? value.id : Date.now().toString(),
    date,
    finalRealm: typeof value.finalRealm === 'string' ? value.finalRealm : '未知境界',
    age: typeof value.age === 'number' && Number.isFinite(value.age) ? value.age : 0,
    spiritRoot: typeof value.spiritRoot === 'string' ? value.spiritRoot : '',
    talent: typeof value.talent === 'string' ? value.talent : '',
    result: value.result === 'ascended' ? 'ascended' : 'died',
    stats,
    achievements: Array.isArray(value.achievements)
      ? value.achievements.filter((achievement): achievement is string => typeof achievement === 'string')
      : []
  };
}

function normalizeStats(stats: unknown): GameRecord['stats'] {
  if (!stats || typeof stats !== 'object') return DEFAULT_STATS;

  const value = stats as Partial<GameRecord['stats']>;
  return {
    根骨: normalizeNumber(value.根骨),
    悟性: normalizeNumber(value.悟性),
    气运: normalizeNumber(value.气运),
    颜值: normalizeNumber(value.颜值),
    家境: normalizeNumber(value.家境)
  };
}

function normalizeNumber(value: unknown): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : 0;
}
