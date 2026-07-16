export function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function todayString(): string {
  return formatDate(new Date());
}

export function parseDate(dateStr: string): Date {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function getWeekday(dateStr: string): number {
  return parseDate(dateStr).getDay();
}

// 月表示用の日付グリッド(前後月の日も含めた6週42マス)を生成する。
export function buildMonthGrid(year: number, month: number): Date[] {
  const firstDay = new Date(year, month, 1);
  const startOffset = firstDay.getDay();
  const gridStart = new Date(year, month, 1 - startOffset);
  const days: Date[] = [];
  for (let i = 0; i < 42; i++) {
    days.push(new Date(gridStart.getFullYear(), gridStart.getMonth(), gridStart.getDate() + i));
  }
  return days;
}

export function isSameMonth(date: Date, year: number, month: number): boolean {
  return date.getFullYear() === year && date.getMonth() === month;
}

export function formatDateJP(dateStr: string): string {
  const d = parseDate(dateStr);
  return `${d.getMonth() + 1}/${d.getDate()}`;
}
