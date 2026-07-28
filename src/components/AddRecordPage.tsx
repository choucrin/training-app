import { RecordForm } from './RecordForm';
import { todayString } from '../dateUtils';
import type { Exercise } from '../types';

interface Props {
  exercises: Exercise[];
  onSubmit: (input: { date: string; exercise: Exercise; reps: number }) => Promise<void>;
}

export function AddRecordPage({ exercises, onSubmit }: Props) {
  return (
    <div className="panel">
      <h2>トレーニングを記録</h2>
      <RecordForm initialDate={todayString()} exercises={exercises} onSubmit={onSubmit} />
    </div>
  );
}
