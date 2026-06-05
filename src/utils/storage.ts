import type { GameRecord, GameState, SavedGameSlot } from '@/types';

const STORAGE_KEY = 'gameRecords';
const SAVE_SLOT_KEY = 'currentGameSave';
const DEFAULT_STATS = {
  根骨: 0,
  神识: 0,
  悟性: 0,
  气运: 0,
  颜值: 0
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

export function saveGameState(gameState: GameState): void {
  const saveSlot: SavedGameSlot = {
    version: 1,
    savedAt: new Date().toISOString(),
    gameState
  };

  localStorage.setItem(SAVE_SLOT_KEY, JSON.stringify(saveSlot));
}

export function getSavedGame(): SavedGameSlot | null {
  const stored = localStorage.getItem(SAVE_SLOT_KEY);
  if (!stored) return null;

  try {
    const saveSlot = JSON.parse(stored) as Partial<SavedGameSlot>;
    if (!saveSlot || saveSlot.version !== 1 || !saveSlot.gameState) return null;

    const savedAt = typeof saveSlot.savedAt === 'string' && !Number.isNaN(new Date(saveSlot.savedAt).getTime())
      ? saveSlot.savedAt
      : new Date().toISOString();

    return {
      version: 1,
      savedAt,
      gameState: normalizeGameState(saveSlot.gameState)
    };
  } catch {
    localStorage.removeItem(SAVE_SLOT_KEY);
    return null;
  }
}

export function hasSavedGame(): boolean {
  return getSavedGame() !== null;
}

export function clearSavedGame(): void {
  localStorage.removeItem(SAVE_SLOT_KEY);
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
    characterName: normalizeCharacterName(value.characterName),
    finalRealm: typeof value.finalRealm === 'string' ? value.finalRealm : '未知境界',
    age: typeof value.age === 'number' && Number.isFinite(value.age) ? value.age : 0,
    spiritRoot: typeof value.spiritRoot === 'string' ? value.spiritRoot : '',
    talent: typeof value.talent === 'string' ? value.talent : '',
    result: value.result === 'ascended' ? 'ascended' : 'died',
    stats,
    familyWealth: normalizeNumber(value.familyWealth ?? (value.stats as { 家境?: unknown } | undefined)?.家境),
    achievements: Array.isArray(value.achievements)
      ? value.achievements.filter((achievement): achievement is string => typeof achievement === 'string')
      : []
  };
}

function normalizeGameState(gameState: GameState): GameState {
  return {
    ...gameState,
    characterName: normalizeCharacterName(gameState.characterName),
    pendingTribulation: gameState.pendingTribulation ?? null,
    pendingEvent: gameState.pendingEvent ?? null,
    pendingPathChoice: !!gameState.pendingPathChoice,
    events: Array.isArray(gameState.events) ? gameState.events : [],
    achievements: Array.isArray(gameState.achievements) ? gameState.achievements : [],
    completedGoals: Array.isArray(gameState.completedGoals) ? gameState.completedGoals : [],
    inventory: Array.isArray(gameState.inventory) ? gameState.inventory : [],
    techniques: Array.isArray(gameState.techniques) ? gameState.techniques : []
  };
}

function normalizeStats(stats: unknown): GameRecord['stats'] {
  if (!stats || typeof stats !== 'object') return DEFAULT_STATS;

  const value = stats as Partial<GameRecord['stats']>;
  return {
    根骨: normalizeNumber(value.根骨),
    神识: normalizeNumber(value.神识),
    悟性: normalizeNumber(value.悟性),
    气运: normalizeNumber(value.气运),
    颜值: normalizeNumber(value.颜值)
  };
}

function normalizeNumber(value: unknown): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : 0;
}

function normalizeCharacterName(value: unknown): string {
  if (typeof value !== 'string') return '无名';

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed.slice(0, 12) : '无名';
}
