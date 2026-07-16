import { useState } from 'react';
import { Modal } from './Modal';
import type { TrainingRecord } from '../types';
import { formatDateJP } from '../dateUtils';
import { buildExportText, copyText } from '../textExport';

interface Props {
  date: string;
  records: TrainingRecord[];
  onClose: () => void;
  onAddClick: () => void;
  onDelete: (id: string) => Promise<void>;
}

export function DayDetailModal({ date, records, onClose, onAddClick, onDelete }: Props) {
  const [showText, setShowText] = useState(false);
  const [copyStatus, setCopyStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const exportText = buildExportText(date, records);

  async function handleCopy() {
    const ok = await copyText(exportText);
    setCopyStatus(ok ? 'success' : 'error');
    setTimeout(() => setCopyStatus('idle'), 2000);
  }

  return (
    <Modal title={`${formatDateJP(date)} のトレーニング`} onClose={onClose}>
      {records.length === 0 ? (
        <p className="muted">この日のトレーニング記録はまだありません。</p>
      ) : (
        <ul className="record-list">
          {records.map((r) => (
            <li key={r.id}>
              <span>
                {r.exerciseName}
                <span className="record-part">({r.part})</span>
              </span>
              <span className="record-reps">{r.reps}</span>
              <button
                type="button"
                className="btn-icon"
                aria-label={`${r.exerciseName}の記録を削除`}
                onClick={() => onDelete(r.id)}
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="modal-actions">
        <button type="button" className="btn btn-primary" onClick={onAddClick}>
          この日にトレーニングを追加
        </button>
        {records.length > 0 && (
          <button type="button" className="btn" onClick={() => setShowText((v) => !v)}>
            {showText ? 'テキストを閉じる' : 'テキストとして出力'}
          </button>
        )}
      </div>

      {showText && (
        <div className="export-box">
          <pre>{exportText}</pre>
          <button type="button" className="btn btn-primary" onClick={handleCopy}>
            {copyStatus === 'success' ? 'コピーしました' : copyStatus === 'error' ? 'コピーに失敗しました' : 'コピーする'}
          </button>
        </div>
      )}
    </Modal>
  );
}
