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
  const [minutes, setMinutes] = useState('');
  const [seconds, setSeconds] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const selectedExercise = exercises.find((ex) => ex.id === exerciseId);
  // 記録方法は選択したトレーニングの登録内容に応じて自動的に切り替わる
  const unit = selectedExercise?.unit ?? 'reps';

  const groupedByPart = new Map<string, Exercise[]>();
  for (const ex of exercises) {
    const list = groupedByPart.get(ex.part) ?? [];
    list.push(ex);
    groupedByPart.set(ex.part, list);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedExercise) return;

    let value: number;
    if (unit === 'time') {
      value = (Number(minutes) || 0) * 60 + (Number(seconds) || 0);
    } else {
      value = Number(reps);
    }
    if (!value || value <= 0) return;

    setSubmitting(true);
    try {
      await onSubmit({ date: selectedDate, exercise: selectedExercise, reps: value });
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
        {unit === 'reps' ? (
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
        ) : (
          <label>
            時間(分:秒)
            <div className="time-input-row">
              <input
                type="number"
                inputMode="numeric"
                min={0}
                value={minutes}
                onChange={(e) => setMinutes(e.target.value)}
                placeholder="分"
                aria-label="分"
              />
              <span>:</span>
              <input
                type="number"
                inputMode="numeric"
                min={0}
                max={59}
                value={seconds}
                onChange={(e) => setSeconds(e.target.value)}
                placeholder="秒"
                aria-label="秒"
              />
            </div>
          </label>
        )}
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          追加する
        </button>
      </form>
    </Modal>
  );
}
