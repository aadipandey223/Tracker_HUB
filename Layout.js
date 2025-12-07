import { useState, useEffect } from 'react';
import { Moon, Sun, Home, Target, CheckSquare, DollarSign, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from './utils';
import { useAuth } from './context/AuthContext';
import DataMigrator from './components/DataMigrator';

export default function Layout({ children, currentPageName }) {
  const [darkMode, setDarkMode] = useState(false);
  const { signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldBeDark = savedTheme === 'dark' || (!savedTheme && prefersDark);

    setDarkMode(shouldBeDark);
    if (shouldBeDark) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);

    if (newMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      <style>{`
        :root {
          --color-primary: #ff6b35;
          --color-secondary: #f7931e;
        }
      `}</style>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <Link to={createPageUrl('Dashboard')} className="flex items-center space-x-2 hover:opacity-80 transition">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
                  <span className="text-white font-bold text-xl">T</span>
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
                  Tracker Hub
                </h1>
              </Link>

              <nav className="hidden md:flex items-center space-x-1">
                <Link to={createPageUrl('Dashboard')}>
                  <Button variant="ghost" className="gap-2">
                    <Home className="w-4 h-4" />
                    Dashboard
                  </Button>
                </Link>
                <Link to={createPageUrl('Habits')}>
                  <Button variant="ghost" className="gap-2">
                    <Target className="w-4 h-4" />
                    Habits
                  </Button>
                </Link>
                <Link to={createPageUrl('Tasks')}>
                  <Button variant="ghost" className="gap-2">
                    <CheckSquare className="w-4 h-4" />
                    Tasks
                  </Button>
                </Link>
                <Link to={createPageUrl('Finance')}>
                  <Button variant="ghost" className="gap-2">
                    <DollarSign className="w-4 h-4" />
                    Finance
                  </Button>
                </Link>
              </nav>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="rounded-full"
              >
                {darkMode ? (
                  <Sun className="h-5 w-5 text-orange-500" />
                ) : (
                  <Moon className="h-5 w-5 text-gray-700" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleSignOut}
                className="rounded-full text-gray-500 hover:text-red-500"
                title="Sign Out"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative">
        {children}
      </main>

      {/* Data Migrator Popup */}
      <DataMigrator />

      {/* Footer */}
      <footer className="mt-20 py-8 border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-600 dark:text-gray-400">
          <p>© 2025 Tracker Hub. Build better habits, manage tasks, and track your finances.</p>
        </div>
      </footer>
    </div>
  );
}