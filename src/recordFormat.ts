import type { RecordUnit } from './types';

// unit が 'time' の場合、reps(合計秒数)を "分:秒" 表記に変換する
export function formatRecordValue(reps: number, unit: RecordUnit): string {
  if (unit === 'time') {
    const m = Math.floor(reps / 60);
    const s = reps % 60;
    return `${m}:${String(s).padStart(2, '0')}`;
  }
  return String(reps);
}

// 30秒 = 10回として換算した回数(30秒未満切り捨て)。
// カレンダーの合計・部位別集計など「回数」を計算する箇所で使用する。
export const SECONDS_PER_REPS_UNIT = 30;
export const REPS_PER_SECONDS_UNIT = 10;

export function toEquivalentReps(reps: number, unit: RecordUnit): number {
  if (unit === 'time') {
    return Math.floor(reps / SECONDS_PER_REPS_UNIT) * REPS_PER_SECONDS_UNIT;
  }
  return reps;
}
