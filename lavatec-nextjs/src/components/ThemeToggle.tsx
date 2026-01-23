import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { MdDarkMode, MdLightMode, MdComputer } from 'react-icons/md';

interface ThemeToggleProps {
  showLabel?: boolean;
  variant?: 'icon' | 'button' | 'dropdown';
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ showLabel = false, variant = 'icon' }) => {
  const { theme, setTheme, isDark, toggleTheme } = useTheme();

  if (variant === 'dropdown') {
    return (
      <div className="relative group">
        <button
          className="theme-toggle flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors duration-200"
          aria-label="Theme settings"
        >
          {isDark ? (
            <MdDarkMode className="w-5 h-5 text-yellow-400" />
          ) : (
            <MdLightMode className="w-5 h-5 text-amber-500" />
          )}
          {showLabel && (
            <span className="text-sm text-slate-600 dark:text-slate-300">
              {theme === 'system' ? 'Sistema' : isDark ? 'Escuro' : 'Claro'}
            </span>
          )}
        </button>
        <div className="absolute right-0 mt-2 w-40 py-2 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
          <button
            onClick={() => setTheme('light')}
            className={`w-full flex items-center gap-3 px-4 py-2 text-left text-sm hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors ${
              theme === 'light' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-700 dark:text-slate-300'
            }`}
          >
            <MdLightMode className="w-4 h-4" />
            Claro
          </button>
          <button
            onClick={() => setTheme('dark')}
            className={`w-full flex items-center gap-3 px-4 py-2 text-left text-sm hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors ${
              theme === 'dark' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-700 dark:text-slate-300'
            }`}
          >
            <MdDarkMode className="w-4 h-4" />
            Escuro
          </button>
          <button
            onClick={() => setTheme('system')}
            className={`w-full flex items-center gap-3 px-4 py-2 text-left text-sm hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors ${
              theme === 'system' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-700 dark:text-slate-300'
            }`}
          >
            <MdComputer className="w-4 h-4" />
            Sistema
          </button>
        </div>
      </div>
    );
  }

  if (variant === 'button') {
    return (
      <button
        onClick={toggleTheme}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors duration-200"
        aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        {isDark ? (
          <>
            <MdLightMode className="w-5 h-5 text-amber-400" />
            {showLabel && <span className="text-sm text-slate-700 dark:text-slate-200">Modo Claro</span>}
          </>
        ) : (
          <>
            <MdDarkMode className="w-5 h-5 text-slate-600" />
            {showLabel && <span className="text-sm text-slate-700 dark:text-slate-200">Modo Escuro</span>}
          </>
        )}
      </button>
    );
  }

  // Default: icon variant
  return (
    <button
      onClick={toggleTheme}
      className="theme-toggle p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors duration-200"
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Mudar para modo claro' : 'Mudar para modo escuro'}
    >
      {isDark ? (
        <MdLightMode className="w-5 h-5 text-yellow-400" />
      ) : (
        <MdDarkMode className="w-5 h-5 text-slate-600" />
      )}
    </button>
  );
};

export default ThemeToggle;
