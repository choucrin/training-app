import type { TrainingRecord } from './types';
import { formatDateJP } from './dateUtils';

export function buildExportText(dateStr: string, records: TrainingRecord[]): string {
  const lines = [formatDateJP(dateStr)];
  for (const r of records) {
    lines.push(`・${r.exerciseName}(${r.part}) ${r.reps}`);
  }
  return lines.join('\n');
}

export async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    throw new Error('clipboard api unavailable');
  } catch {
    try {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      const ok = document.execCommand('copy');
      document.body.removeChild(textarea);
      return ok;
    } catch {
      return false;
    }
  }
}
