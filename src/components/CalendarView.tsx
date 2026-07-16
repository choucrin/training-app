import { buildMonthGrid, formatDate, isSameMonth, todayString } from '../dateUtils';
import { WEEKDAY_LABELS, WEEKDAY_PARTS } from '../constants';
import { getIntensityLevel } from '../colorScale';

interface Props {
  year: number;
  month: number; // 0-11
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
  totalsByDate,
  onPrevMonth,
  onNextMonth,
  onToday,
  onSelectDate,
  onAddForDate,
}: Props) {
  const days = buildMonthGrid(year, month);
  const today = todayString();

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
            </div>
          );
        })}
      </div>
    </div>
  );
}
