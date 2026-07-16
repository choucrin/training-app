import { useState } from 'react';
import type { Exercise, RecordUnit } from '../types';

interface Props {
  exercises: Exercise[];
  parts: string[];
  onAdd: (name: string, part: string, unit: RecordUnit) => Promise<void>;
  onUpdate: (id: string, input: { name: string; part: string; unit: RecordUnit }) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

const NEW_PART_VALUE = '__new__';

export function ExerciseManager({ exercises, parts, onAdd, onUpdate, onDelete }: Props) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [selectedPart, setSelectedPart] = useState(parts[0] ?? NEW_PART_VALUE);
  const [newPart, setNewPart] = useState('');
  const [unit, setUnit] = useState<RecordUnit>('reps');
  const [submitting, setSubmitting] = useState(false);

  const isNewPart = selectedPart === NEW_PART_VALUE;
  const isEditing = editingId !== null;

  function resetForm() {
    setEditingId(null);
    setName('');
    setSelectedPart(parts[0] ?? NEW_PART_VALUE);
    setNewPart('');
    setUnit('reps');
  }

  function startEdit(ex: Exercise) {
    setEditingId(ex.id);
    setName(ex.name);
    setSelectedPart(ex.part);
    setNewPart('');
    setUnit(ex.unit);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmedName = name.trim();
    const part = isNewPart ? newPart.trim() : selectedPart;
    if (!trimmedName || !part) return;
    setSubmitting(true);
    try {
      if (editingId) {
        await onUpdate(editingId, { name: trimmedName, part, unit });
      } else {
        await onAdd(trimmedName, part, unit);
      }
      resetForm();
    } finally {
      setSubmitting(false);
    }
  }

  const groupedByPart = new Map<string, Exercise[]>();
  for (const ex of exercises) {
    const list = groupedByPart.get(ex.part) ?? [];
    list.push(ex);
    groupedByPart.set(ex.part, list);
  }

  return (
    <div className="panel">
      <h2>{isEditing ? 'トレーニングを編集' : 'トレーニングの登録'}</h2>
      <form onSubmit={handleSubmit} className="form-grid">
        <label>
          トレーニング名
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="例: ベンチプレス"
            required
          />
        </label>
        <label>
          トレーニング部位
          <select value={selectedPart} onChange={(e) => setSelectedPart(e.target.value)}>
            {parts.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
            <option value={NEW_PART_VALUE}>+ 新しい部位を追加</option>
          </select>
        </label>
        {isNewPart && (
          <label>
            新しい部位名
            <input
              type="text"
              value={newPart}
              onChange={(e) => setNewPart(e.target.value)}
              placeholder="例: 前腕"
              required
            />
          </label>
        )}
        <label>
          記録方式
          <select value={unit} onChange={(e) => setUnit(e.target.value as RecordUnit)}>
            <option value="reps">回数</option>
            <option value="time">時間(分:秒)</option>
          </select>
        </label>
        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {isEditing ? '更新する' : '登録する'}
          </button>
          {isEditing && (
            <button type="button" className="btn" onClick={resetForm}>
              キャンセル
            </button>
          )}
        </div>
      </form>

      <h2>登録済みのトレーニング</h2>
      {groupedByPart.size === 0 && <p className="muted">まだ登録されたトレーニングはありません。</p>}
      {Array.from(groupedByPart.entries()).map(([part, list]) => (
        <div key={part} className="exercise-group">
          <h3>{part}</h3>
          <ul className="exercise-list">
            {list.map((ex) => (
              <li key={ex.id}>
                <span>
                  {ex.name}
                  <span className="record-part">({ex.unit === 'time' ? '時間' : '回数'})</span>
                </span>
                <span className="exercise-list-actions">
                  <button
                    type="button"
                    className="btn-icon"
                    aria-label={`${ex.name}を編集`}
                    onClick={() => startEdit(ex)}
                  >
                    ✎
                  </button>
                  <button
                    type="button"
                    className="btn-icon"
                    aria-label={`${ex.name}を削除`}
                    onClick={() => onDelete(ex.id)}
                  >
                    ✕
                  </button>
                </span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
