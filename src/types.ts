// 'time' の場合、記録には合計秒数を格納する
export type RecordUnit = 'reps' | 'time';

export interface Exercise {
  id: string;
  name: string;
  part: string;
  unit: RecordUnit;
  createdAt: number;
}

export interface TrainingRecord {
  id: string;
  date: string; // YYYY-MM-DD
  exerciseId: string;
  exerciseName: string;
  part: string;
  reps: number;
  unit: RecordUnit;
  createdAt: number;
}
