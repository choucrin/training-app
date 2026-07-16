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
