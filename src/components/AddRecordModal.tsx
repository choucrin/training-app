import { Modal } from './Modal';
import { RecordForm } from './RecordForm';
import type { Exercise } from '../types';

interface Props {
  date: string;
  exercises: Exercise[];
  onClose: () => void;
  onSubmit: (input: { date: string; exercise: Exercise; reps: number }) => Promise<void>;
}

export function AddRecordModal({ date, exercises, onClose, onSubmit }: Props) {
  return (
    <Modal title="トレーニングを追加" onClose={onClose}>
      <RecordForm initialDate={date} exercises={exercises} onSubmit={onSubmit} onSubmitted={onClose} />
    </Modal>
  );
}
