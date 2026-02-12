import { NavLink } from 'react-router-dom';
import { FiHome, FiGrid, FiPlusCircle, FiBarChart2 } from 'react-icons/fi';

const sidebarLinks = [
  { icon: FiHome, label: 'Home', path: '/' },
  { icon: FiGrid, label: 'Dashboard', path: '/dashboard' },
  { icon: FiPlusCircle, label: 'New Plan', path: '/dashboard/new' },
  { icon: FiBarChart2, label: 'Progress', path: '/dashboard' },
];

export default function Sidebar() {
  return (
    <aside
      className="glass"
      style={{
        width: '240px',
        minHeight: 'calc(100vh - 64px)',
        padding: '24px 16px',
        borderRadius: 0,
        borderTop: 'none',
        borderBottom: 'none',
        borderLeft: 'none',
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
        position: 'sticky',
        top: '64px',
      }}
    >
      <div style={{ marginBottom: '16px', padding: '0 12px' }}>
        <p
          style={{
            fontSize: '11px',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            color: 'var(--text-muted)',
          }}
        >
          Navigation
        </p>
      </div>

      {sidebarLinks.map((link) => {
        const Icon = link.icon;
        return (
          <NavLink
            key={link.path + link.label}
            to={link.path}
            end={link.path === '/'}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '10px 12px',
              borderRadius: '10px',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: isActive ? 600 : 500,
              color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
              background: isActive ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
              transition: 'all 0.2s',
            })}
          >
            <Icon size={18} />
            {link.label}
          </NavLink>
        );
      })}

      {/* Decorative section at bottom */}
      <div style={{ marginTop: 'auto', padding: '16px 12px' }}>
        <div
          style={{
            padding: '16px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(6, 182, 212, 0.1))',
            border: '1px solid rgba(99, 102, 241, 0.2)',
          }}
        >
          <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
            🚀 Pro Tip
          </p>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.5 }}>
            Add your HF API token in .env.local for AI-powered plans!
          </p>
        </div>
      </div>
    </aside>
  );
}
