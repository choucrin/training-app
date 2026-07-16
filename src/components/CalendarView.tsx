import { buildMonthGrid, formatDate, isSameMonth, todayString } from '../dateUtils';
import { WEEKDAY_LABELS, WEEKDAY_PARTS } from '../constants';
import { getIntensityLevel } from '../colorScale';
import { useMediaQuery } from '../hooks/useMediaQuery';
import type { TrainingRecord } from '../types';

interface Props {
  year: number;
  month: number; // 0-11
  byDate: Map<string, TrainingRecord[]>;
  totalsByDate: Map<string, number>;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onToday: () => void;
  onSelectDate: (date: string) => void;
  onAddForDate: (date: string) => void;
}

export function CalendarView({
  year,
  month,
  byDate,
  totalsByDate,
  onPrevMonth,
  onNextMonth,
  onToday,
  onSelectDate,
  onAddForDate,
}: Props) {
  const days = buildMonthGrid(year, month);
  const today = todayString();
  const isWide = useMediaQuery('(min-width: 640px)');
  const maxVisible = isWide ? 2 : 1;

  return (
    <div className="panel calendar">
      <div className="calendar-header">
        <button type="button" className="btn" onClick={onPrevMonth} aria-label="前の月">
          ‹
        </button>
        <div className="calendar-title">
          <span>
            {year}年 {month + 1}月
          </span>
          <button type="button" className="btn btn-small" onClick={onToday}>
            今日
          </button>
        </div>
        <button type="button" className="btn" onClick={onNextMonth} aria-label="次の月">
          ›
        </button>
      </div>

      <div className="calendar-grid calendar-weekday-row">
        {WEEKDAY_LABELS.map((label, i) => (
          <div key={label} className={`calendar-weekday weekday-${i}`}>
            <div>{label}</div>
            <div className="weekday-part">{WEEKDAY_PARTS[i] ?? '自由'}</div>
          </div>
        ))}
      </div>

      <div className="calendar-grid">
        {days.map((d) => {
          const dateStr = formatDate(d);
          const inMonth = isSameMonth(d, year, month);
          const total = totalsByDate.get(dateStr) ?? 0;
          const level = getIntensityLevel(total);
          const isToday = dateStr === today;
          // 部位ごとに回数を集計し、回数が多い順に並べる。入りきらない分は「+N」で丸める
          const partTotals = new Map<string, number>();
          for (const r of byDate.get(dateStr) ?? []) {
            partTotals.set(r.part, (partTotals.get(r.part) ?? 0) + r.reps);
          }
          const sortedParts = Array.from(partTotals.entries()).sort((a, b) => b[1] - a[1]);
          const visibleParts = sortedParts.slice(0, maxVisible);
          const hiddenCount = sortedParts.length - visibleParts.length;
          return (
            <div
              key={dateStr}
              className={`calendar-cell level-${level} ${inMonth ? '' : 'outside-month'} ${
                isToday ? 'is-today' : ''
              }`}
              onClick={() => onSelectDate(dateStr)}
            >
              <div className="calendar-cell-top">
                <span className="calendar-date-num">{d.getDate()}</span>
                <button
                  type="button"
                  className="btn-icon calendar-add-btn"
                  aria-label={`${dateStr}にトレーニングを追加`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddForDate(dateStr);
                  }}
                >
                  +
                </button>
              </div>
              {total > 0 && <span className="calendar-total">{total}回</span>}
              {visibleParts.length > 0 && (
                <ul className="calendar-entries">
                  {visibleParts.map(([part, count]) => (
                    <li key={part} className="calendar-entry">
                      {part} {count}
                    </li>
                  ))}
                  {hiddenCount > 0 && <li className="calendar-entry-more">+{hiddenCount}</li>}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
