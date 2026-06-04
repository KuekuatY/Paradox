export function randomSelect<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function calculateSuccessRate(
  baseRate: number,
  modifier: number
): number {
  const rate = baseRate + modifier * 0.05;
  return Math.max(0.1, Math.min(0.95, rate));
}
