import { useMemo } from 'react';
import { getDaysInMonth, getFirstDayOfMonth, formatDateKey, isToday } from '../utils/dateHelpers';
import { getWeatherInfo } from '../hooks/useWeather';

export default function MonthStrip({ selectedDate, onSelectDate, events, weather }) {
  const year = selectedDate.getFullYear();
  const month = selectedDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);

  const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const DAY_NAMES = ['S','M','T','W','T','F','S'];

  const days = useMemo(() => {
    return Array.from({ length: daysInMonth }, (_, i) => {
      const date = new Date(year, month, i + 1);
      const key = formatDateKey(date);
      const hasEvents = events && events[key] && events[key].length > 0;
      const dayOfWeek = date.getDay();

      // Find weather for this day
      let dayWeather = null;
      if (weather?.daily) {
        const wDay = weather.daily.find(d => d.date === key);
        if (wDay) dayWeather = wDay;
      }

      return { day: i + 1, date, key, hasEvents, dayOfWeek, weather: dayWeather };
    });
  }, [year, month, daysInMonth, events, weather]);

  const selectedKey = formatDateKey(selectedDate);

  const prevMonth = () => {
    const d = new Date(year, month - 1, 1);
    onSelectDate(d);
  };

  const nextMonth = () => {
    const d = new Date(year, month + 1, 1);
    onSelectDate(d);
  };

  return (
    <div className="select-none" style={{ background: 'var(--bg)', borderBottom: '1px solid #e8e8e8' }}>
      {/* Month header */}
      <div className="flex items-center justify-between px-4 py-2">
        <button
          onClick={prevMonth}
          className="w-8 h-8 flex items-center justify-center rounded-full active:bg-gray-100 transition-colors"
          style={{ color: 'var(--primary)' }}
        >
          <svg width="8" height="14" viewBox="0 0 8 14" fill="none">
            <path d="M7 1L1 7l6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
          {MONTH_NAMES[month]} {year}
        </span>

        <button
          onClick={nextMonth}
          className="w-8 h-8 flex items-center justify-center rounded-full active:bg-gray-100 transition-colors"
          style={{ color: 'var(--primary)' }}
        >
          <svg width="8" height="14" viewBox="0 0 8 14" fill="none">
            <path d="M1 1l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      {/* Day labels */}
      <div className="grid grid-cols-7 px-2 pb-1">
        {DAY_NAMES.map((d, i) => (
          <div key={i} className="text-center text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
            {d}
          </div>
        ))}
      </div>

      {/* Days grid — scrollable horizontal rows */}
      <div className="overflow-x-auto no-scrollbar">
        <div className="grid grid-cols-7 px-2 pb-2" style={{ minWidth: 0 }}>
          {/* Empty cells for first week */}
          {Array.from({ length: new Date(year, month, 1).getDay() }, (_, i) => (
            <div key={`empty-${i}`} />
          ))}

          {days.map(({ day, date, key, hasEvents, dayOfWeek, weather: dw }) => {
            const selected = key === selectedKey;
            const today = isToday(date);

            return (
              <button
                key={key}
                onClick={() => onSelectDate(date)}
                className="flex flex-col items-center py-1 rounded-xl transition-all duration-150 active:scale-95"
                style={{
                  background: selected ? 'var(--primary)' : 'transparent',
                }}
              >
                {/* Weather icon for future days */}
                {dw && !today && (
                  <span className="text-xs leading-none mb-0.5">{dw.icon}</span>
                )}
                {(!dw || today) && <div className="h-4" />}

                {/* Day number */}
                <span
                  className="text-sm font-medium leading-none"
                  style={{
                    color: selected ? '#fff' : today ? 'var(--primary)' : 'var(--text-primary)',
                    fontWeight: today ? '700' : '500',
                  }}
                >
                  {day}
                </span>

                {/* Event dot */}
                <div
                  className="day-dot mt-0.5"
                  style={{
                    background: hasEvents
                      ? selected ? 'rgba(255,255,255,0.8)' : 'var(--primary)'
                      : 'transparent',
                  }}
                />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
