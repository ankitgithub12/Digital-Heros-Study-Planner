import { motion } from 'framer-motion';

const variants = {
  primary: 'gradient-btn',
  secondary: 'secondary-btn',
  outline: 'outline-btn',
  ghost: 'ghost-btn',
  danger: 'danger-btn',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  className = '',
  onClick,
  type = 'button',
  ...props
}) {
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-7 py-3.5 text-base',
  };

  const baseStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    fontWeight: 600,
    borderRadius: 'var(--radius)',
    cursor: disabled || isLoading ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    transition: 'all 0.2s ease',
    fontFamily: 'var(--font-sans)',
    border: 'none',
    position: 'relative',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
  };

  const variantStyles = {
    primary: {
      background: 'linear-gradient(135deg, var(--primary), var(--accent))',
      color: 'white',
    },
    secondary: {
      background: 'var(--bg-card)',
      color: 'var(--text-primary)',
      border: '1px solid var(--border)',
    },
    outline: {
      background: 'transparent',
      color: 'var(--primary)',
      border: '1px solid var(--primary)',
    },
    ghost: {
      background: 'transparent',
      color: 'var(--text-secondary)',
    },
    danger: {
      background: 'var(--danger)',
      color: 'white',
    },
  };

  const sizeStyles = {
    sm: { padding: '6px 12px', fontSize: '13px' },
    md: { padding: '10px 20px', fontSize: '14px' },
    lg: { padding: '14px 28px', fontSize: '16px' },
  };

  return (
    <motion.button
      whileHover={!disabled && !isLoading ? { scale: 1.02, y: -1 } : {}}
      whileTap={!disabled && !isLoading ? { scale: 0.98 } : {}}
      style={{ ...baseStyle, ...variantStyles[variant], ...sizeStyles[size] }}
      onClick={onClick}
      disabled={disabled || isLoading}
      type={type}
      className={className}
      {...props}
    >
      {isLoading && (
        <svg
          style={{ width: 16, height: 16, animation: 'spin 1s linear infinite' }}
          viewBox="0 0 24 24"
          fill="none"
        >
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.3" />
          <path
            d="M12 2a10 10 0 0 1 10 10"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
      )}
      {children}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </motion.button>
  );
}
