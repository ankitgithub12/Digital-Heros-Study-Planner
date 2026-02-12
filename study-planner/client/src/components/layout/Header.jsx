import { Link, useLocation } from 'react-router-dom';
import { FiSun, FiMoon, FiMenu, FiX } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useDarkMode } from '../../hooks/useDarkMode';

export default function Header() {
  const { isDark, toggleTheme } = useDarkMode();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isHome = location.pathname === '/';

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'New Plan', path: '/dashboard/new' },
  ];

  return (
    <header
      className="glass"
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        padding: '0 24px',
        borderRadius: 0,
        borderTop: 'none',
        borderLeft: 'none',
        borderRight: 'none',
      }}
    >
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '64px',
        }}
      >
        {/* Logo */}
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, var(--primary), var(--accent))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px',
            }}
          >
            📚
          </div>
          <span
            style={{
              fontSize: '20px',
              fontWeight: 800,
              letterSpacing: '-0.02em',
            }}
            className="gradient-text"
          >
            StudyFlow AI
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
          className="desktop-nav"
        >
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 500,
                textDecoration: 'none',
                color: location.pathname === link.path ? 'var(--primary)' : 'var(--text-secondary)',
                background:
                  location.pathname === link.path ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
                transition: 'all 0.2s',
              }}
            >
              {link.label}
            </Link>
          ))}

          {/* Theme Toggle */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleTheme}
            style={{
              background: 'var(--bg-primary)',
              border: '1px solid var(--border)',
              borderRadius: '10px',
              padding: '8px',
              cursor: 'pointer',
              color: 'var(--text-secondary)',
              display: 'flex',
              alignItems: 'center',
              marginLeft: '8px',
            }}
          >
            {isDark ? <FiSun size={18} /> : <FiMoon size={18} />}
          </motion.button>
        </nav>

        {/* Mobile Menu Button */}
        <div
          className="mobile-nav-btn"
          style={{ display: 'none' }}
        >
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setMobileOpen(!mobileOpen)}
            style={{
              background: 'var(--bg-primary)',
              border: '1px solid var(--border)',
              borderRadius: '10px',
              padding: '8px',
              cursor: 'pointer',
              color: 'var(--text-secondary)',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {mobileOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </motion.button>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{
              overflow: 'hidden',
              borderTop: '1px solid var(--border)',
              padding: '12px 0',
            }}
          >
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileOpen(false)}
                style={{
                  display: 'block',
                  padding: '10px 16px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 500,
                  textDecoration: 'none',
                  color:
                    location.pathname === link.path
                      ? 'var(--primary)'
                      : 'var(--text-secondary)',
                  background:
                    location.pathname === link.path
                      ? 'rgba(99, 102, 241, 0.1)'
                      : 'transparent',
                }}
              >
                {link.label}
              </Link>
            ))}
            <button
              onClick={toggleTheme}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                width: '100%',
                padding: '10px 16px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--text-secondary)',
                fontSize: '14px',
                fontWeight: 500,
              }}
            >
              {isDark ? <FiSun size={16} /> : <FiMoon size={16} />}
              {isDark ? 'Light Mode' : 'Dark Mode'}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-nav-btn { display: flex !important; }
        }
      `}</style>
    </header>
  );
}
