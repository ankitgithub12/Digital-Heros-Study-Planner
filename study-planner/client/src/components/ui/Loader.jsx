import { motion } from 'framer-motion';

export default function Loader({ text = 'Generating your study plan...' }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '24px',
        padding: '60px 20px',
      }}
    >
      {/* Animated circles */}
      <div style={{ display: 'flex', gap: '8px' }}>
        {[0, 1, 2, 3].map((i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -16, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              delay: i * 0.15,
              ease: 'easeInOut',
            }}
            style={{
              width: 12,
              height: 12,
              borderRadius: '50%',
              background: `linear-gradient(135deg, var(--primary), var(--accent))`,
            }}
          />
        ))}
      </div>

      {/* AI Processing text */}
      <motion.p
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
        style={{
          color: 'var(--text-secondary)',
          fontSize: '15px',
          fontWeight: 500,
          textAlign: 'center',
        }}
      >
        {text}
      </motion.p>

      {/* Progress steps */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
        {['Analyzing your schedule', 'Optimizing topic distribution', 'Adding revision slots'].map(
          (step, i) => (
            <motion.div
              key={step}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1 + i * 1.5 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '13px',
                color: 'var(--text-muted)',
              }}
            >
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                style={{ display: 'inline-block' }}
              >
                ⚡
              </motion.span>
              {step}
            </motion.div>
          )
        )}
      </div>
    </div>
  );
}

/**
 * Skeleton loading placeholder
 */
export function SkeletonCard() {
  return (
    <div
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius)',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
      }}
    >
      <div className="skeleton" style={{ height: '20px', width: '60%' }} />
      <div className="skeleton" style={{ height: '14px', width: '90%' }} />
      <div className="skeleton" style={{ height: '14px', width: '75%' }} />
      <div className="skeleton" style={{ height: '40px', width: '100%', marginTop: '8px' }} />
    </div>
  );
}
