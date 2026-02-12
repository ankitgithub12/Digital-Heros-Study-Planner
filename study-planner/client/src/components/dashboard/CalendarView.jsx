import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isSameDay, parseISO } from 'date-fns';

export default function CalendarView({ plan, selectedDate, onSelectDate }) {
  const scheduleDates = useMemo(() => {
    if (!plan?.schedule) return {};
    const map = {};
    plan.schedule.forEach((day, index) => {
      map[day.date] = { ...day, dayIndex: index };
    });
    return map;
  }, [plan]);

  const today = new Date();
  const currentMonth = selectedDate ? parseISO(selectedDate) : today;
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startDay = getDay(monthStart);

  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div>
      {/* Month Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: '16px',
        }}
      >
        <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' }}>
          {format(currentMonth, 'MMMM yyyy')}
        </h3>
      </div>

      {/* Weekday Headers */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: '4px',
          marginBottom: '8px',
        }}
      >
        {weekdays.map((d) => (
          <div
            key={d}
            style={{
              textAlign: 'center',
              fontSize: '11px',
              fontWeight: 700,
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              padding: '4px 0',
            }}
          >
            {d}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: '4px',
        }}
      >
        {/* Empty cells for offset */}
        {Array.from({ length: startDay }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}

        {days.map((day) => {
          const dateStr = format(day, 'yyyy-MM-dd');
          const scheduleDay = scheduleDates[dateStr];
          const isToday = isSameDay(day, today);
          const isSelected = selectedDate === dateStr;
          const hasSchedule = !!scheduleDay;
          const completedTasks = scheduleDay
            ? (plan.completedTasks || []).filter((t) =>
              t.startsWith(`${scheduleDay.dayIndex}-`)
            ).length
            : 0;
          const totalTasks = scheduleDay?.tasks?.length || 0;
          const isComplete = totalTasks > 0 && completedTasks === totalTasks;

          return (
            <motion.button
              key={dateStr}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onSelectDate?.(dateStr)}
              style={{
                width: '100%',
                aspectRatio: '1',
                borderRadius: '10px',
                border: isSelected
                  ? '2px solid var(--primary)'
                  : isToday
                    ? '2px solid var(--accent)'
                    : '1px solid transparent',
                background: isComplete
                  ? 'rgba(16, 185, 129, 0.15)'
                  : isSelected
                    ? 'rgba(99, 102, 241, 0.1)'
                    : hasSchedule
                      ? 'rgba(99, 102, 241, 0.05)'
                      : 'transparent',
                cursor: hasSchedule ? 'pointer' : 'default',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '2px',
                fontSize: '13px',
                fontWeight: isToday || isSelected ? 700 : 500,
                color: isSelected
                  ? 'var(--primary)'
                  : isToday
                    ? 'var(--accent)'
                    : hasSchedule
                      ? 'var(--text-primary)'
                      : 'var(--text-muted)',
                fontFamily: 'var(--font-sans)',
                position: 'relative',
              }}
            >
              {format(day, 'd')}
              {hasSchedule && (
                <div
                  style={{
                    width: '4px',
                    height: '4px',
                    borderRadius: '50%',
                    background: isComplete ? 'var(--success)' : 'var(--primary)',
                  }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
