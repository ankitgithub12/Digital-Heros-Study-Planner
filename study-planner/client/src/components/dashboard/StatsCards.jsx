import { motion } from 'framer-motion';
import { FiCalendar, FiBook, FiClock, FiZap } from 'react-icons/fi';

const icons = {
  calendar: FiCalendar,
  book: FiBook,
  clock: FiClock,
  streak: FiZap,
};

const gradients = [
  'linear-gradient(135deg, #6366f1, #8b5cf6)',
  'linear-gradient(135deg, #06b6d4, #0891b2)',
  'linear-gradient(135deg, #f59e0b, #d97706)',
  'linear-gradient(135deg, #10b981, #059669)',
];

export default function StatsCards({ stats }) {
  const defaultStats = [
    { label: 'Days Left', value: stats?.daysLeft ?? 0, icon: 'calendar', suffix: '' },
    { label: 'Topics', value: stats?.topics ?? 0, icon: 'book', suffix: '' },
    { label: 'Study Hours', value: stats?.hours ?? 0, icon: 'clock', suffix: 'h' },
    { label: 'Day Streak', value: stats?.streak ?? 0, icon: 'streak', suffix: '🔥' },
  ];

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px',
      }}
    >
      {defaultStats.map((stat, i) => {
        const Icon = icons[stat.icon];
        return (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              padding: '20px 24px',
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              boxShadow: 'var(--shadow-glow)',
            }}
          >
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '14px',
                background: gradients[i],
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                flexShrink: 0,
              }}
            >
              <Icon size={22} />
            </div>
            <div>
              <p
                style={{
                  fontSize: '13px',
                  color: 'var(--text-muted)',
                  fontWeight: 500,
                  marginBottom: '2px',
                }}
              >
                {stat.label}
              </p>
              <p
                style={{
                  fontSize: '24px',
                  fontWeight: 800,
                  color: 'var(--text-primary)',
                  lineHeight: 1,
                }}
              >
                {stat.value}
                {stat.suffix && (
                  <span style={{ fontSize: '14px', marginLeft: '2px' }}>{stat.suffix}</span>
                )}
              </p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
