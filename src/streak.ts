import { formatDate } from './dateUtils';

function addDays(date: Date, delta: number): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + delta);
}

// 今日までの連続トレーニング日数(1回でもトレーニングをした日をカウント)。
// 今日はまだ記録がなくても、昨日までの連続記録は途切れさせない(1日の終わりまで記録できるため)。
export function calculateStreak(totalsByDate: Map<string, number>): number {
  const hasTrained = (d: Date) => (totalsByDate.get(formatDate(d)) ?? 0) > 0;

  let cursor = new Date();
  if (!hasTrained(cursor)) {
    cursor = addDays(cursor, -1);
  }

  let count = 0;
  while (hasTrained(cursor)) {
    count++;
    cursor = addDays(cursor, -1);
  }
  return count;
}
