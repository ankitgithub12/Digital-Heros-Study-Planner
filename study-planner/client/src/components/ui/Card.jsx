import { motion } from 'framer-motion';

export default function Card({ children, className = '', hover = true, style = {}, onClick }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={hover ? { y: -3, boxShadow: '0 12px 40px rgba(99, 102, 241, 0.12)' } : {}}
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius)',
        padding: '24px',
        boxShadow: 'var(--shadow-glow)',
        transition: 'all 0.2s ease',
        cursor: onClick ? 'pointer' : 'default',
        ...style,
      }}
      className={className}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
}
