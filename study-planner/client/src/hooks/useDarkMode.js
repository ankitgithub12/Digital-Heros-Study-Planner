import { useTheme } from '../context/ThemeContext';

export function useDarkMode() {
  const { theme, toggleTheme } = useTheme();
  return { isDark: theme === 'dark', toggleTheme };
}
