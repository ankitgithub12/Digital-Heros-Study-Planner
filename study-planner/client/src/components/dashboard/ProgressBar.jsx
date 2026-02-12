import { motion } from 'framer-motion';

export default function ProgressBar({ progress = 0, label = 'Overall Progress', showPercentage = true, height = 10 }) {
  const clampedProgress = Math.min(100, Math.max(0, progress));

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '8px',
        }}
      >
        <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>
          {label}
        </span>
        {showPercentage && (
          <span
            className="gradient-text"
            style={{ fontSize: '14px', fontWeight: 700 }}
          >
            {clampedProgress}%
          </span>
        )}
      </div>
      <div
        style={{
          width: '100%',
          height: `${height}px`,
          borderRadius: `${height / 2}px`,
          background: 'var(--border)',
          overflow: 'hidden',
        }}
      >
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${clampedProgress}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
          style={{
            height: '100%',
            borderRadius: `${height / 2}px`,
            background: clampedProgress >= 100
              ? 'linear-gradient(135deg, #10b981, #059669)'
              : 'linear-gradient(135deg, var(--primary), var(--accent))',
          }}
        />
      </div>
    </div>
  );
}
