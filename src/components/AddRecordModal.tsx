import { useState } from 'react';
import { Modal } from './Modal';
import type { Exercise } from '../types';

interface Props {
  date: string;
  exercises: Exercise[];
  onClose: () => void;
  onSubmit: (input: { date: string; exercise: Exercise; reps: number }) => Promise<void>;
}

export function AddRecordModal({ date, exercises, onClose, onSubmit }: Props) {
  const [selectedDate, setSelectedDate] = useState(date);
  const [exerciseId, setExerciseId] = useState(exercises[0]?.id ?? '');
  const [reps, setReps] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const groupedByPart = new Map<string, Exercise[]>();
  for (const ex of exercises) {
    const list = groupedByPart.get(ex.part) ?? [];
    list.push(ex);
    groupedByPart.set(ex.part, list);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const exercise = exercises.find((ex) => ex.id === exerciseId);
    const repsNum = Number(reps);
    if (!exercise || !repsNum || repsNum <= 0) return;
    setSubmitting(true);
    try {
      await onSubmit({ date: selectedDate, exercise, reps: repsNum });
      onClose();
    } finally {
      setSubmitting(false);
    }
  }

  if (exercises.length === 0) {
    return (
      <Modal title="トレーニングを追加" onClose={onClose}>
        <p className="muted">
          先に「トレーニング管理」からトレーニング内容を登録してください。
        </p>
      </Modal>
    );
  }

  return (
    <Modal title="トレーニングを追加" onClose={onClose}>
      <form onSubmit={handleSubmit} className="form-grid">
        <label>
          日付
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            required
          />
        </label>
        <label>
          トレーニング
          <select value={exerciseId} onChange={(e) => setExerciseId(e.target.value)}>
            {Array.from(groupedByPart.entries()).map(([part, list]) => (
              <optgroup key={part} label={part}>
                {list.map((ex) => (
                  <option key={ex.id} value={ex.id}>
                    {ex.name}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </label>
        <label>
          回数
          <input
            type="number"
            inputMode="numeric"
            min={1}
            value={reps}
            onChange={(e) => setReps(e.target.value)}
            placeholder="例: 10"
            required
          />
        </label>
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          追加する
        </button>
      </form>
    </Modal>
  );
}
