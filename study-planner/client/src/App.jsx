import { Outlet, useLocation } from 'react-router-dom';
import Header from './components/layout/Header';
import { Toaster } from 'react-hot-toast';

export default function App() {
  const location = useLocation();

  return (
    <>
      <Header />
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'var(--bg-card)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border)',
            borderRadius: '12px',
            fontSize: '14px',
            fontFamily: 'var(--font-sans)',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.2)',
          },
          success: {
            iconTheme: { primary: '#10b981', secondary: 'white' },
          },
          error: {
            iconTheme: { primary: '#ef4444', secondary: 'white' },
          },
        }}
      />
    </>
  );
}
