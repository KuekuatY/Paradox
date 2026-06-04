import type { GameRecord } from '@/types';

const STORAGE_KEY = 'gameRecords';

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
    return Array.isArray(records) ? records : [];
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return [];
  }
}

export function clearGameRecords(): void {
  localStorage.removeItem(STORAGE_KEY);
}
