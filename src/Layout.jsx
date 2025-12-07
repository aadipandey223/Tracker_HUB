import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Moon, Sun, Home, Target, CheckSquare, DollarSign, LogOut, Sparkles, User, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client.supabase';
import { Toaster } from '@/components/ui/sonner';
import TourGuide from './components/tour/TourGuide';
import WelcomeModal from './components/tour/WelcomeModal';

export default function Layout({ children }) {
  const { t } = useTranslation();
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

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

  const handleLogout = async () => {
    try {
      await base44.auth.logout('/');
    } catch (error) {
      console.error('Logout failed:', error);
      // Force redirect anyway
      navigate('/');
    }
  };

  // Mobile navigation items
  const mobileNavItems = [
    { path: '/dashboard', icon: Home, label: t('nav.dashboard') },
    { path: '/habits', icon: Target, label: t('nav.habits') },
    { path: '/tasks', icon: CheckSquare, label: t('nav.tasks') },
    { path: '/finance', icon: DollarSign, label: t('nav.finance') },
    { path: '/vision-board', icon: Sparkles, label: t('nav.visionBoard') },
  ];

  const isActivePath = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-orange-800 transition-colors duration-500 relative pb-20 md:pb-0">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0 opacity-0 dark:opacity-100 transition-opacity duration-500">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-00/20 rounded-full blur-3xl" />
      </div>

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

              <nav id="sidebar-nav" className="hidden md:flex items-center space-x-1">
                <Link to={createPageUrl('Dashboard')}>
                  <Button variant="ghost" className="gap-2">
                    <Home className="w-4 h-4" />
                    {t('nav.dashboard')}
                  </Button>
                </Link>
                <Link to={createPageUrl('Habits')}>
                  <Button variant="ghost" className="gap-2">
                    <Target className="w-4 h-4" />
                    {t('nav.habits')}
                  </Button>
                </Link>
                <Link to={createPageUrl('Tasks')}>
                  <Button variant="ghost" className="gap-2">
                    <CheckSquare className="w-4 h-4" />
                    {t('nav.tasks')}
                  </Button>
                </Link>
                <Link to={createPageUrl('Finance')}>
                  <Button variant="ghost" className="gap-2">
                    <DollarSign className="w-4 h-4" />
                    {t('nav.finance')}
                  </Button>
                </Link>
                <Link to={createPageUrl('vision-board')}>
                  <Button variant="ghost" className="gap-2">
                    <Sparkles className="w-4 h-4" />
                    {t('nav.visionBoard')}
                  </Button>
                </Link>
              </nav>
            </div>

            <div className="flex items-center gap-2">
              <Link to={createPageUrl('profile')}>
                <Button variant="ghost" size="icon" className="rounded-full" title="Profile">
                  <User className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                </Button>
              </Link>
              <Link to={createPageUrl('settings')}>
                <Button variant="ghost" size="icon" className="rounded-full" title="Settings">
                  <Settings className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                </Button>
              </Link>
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
                onClick={handleLogout}
                className="rounded-full"
                title="Logout"
              >
                <LogOut className="h-5 w-5 text-gray-700 dark:text-gray-300" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10">
        {children}
      </main>

      {/* Footer - Hidden on mobile to prevent overlap with bottom nav */}
      <footer className="hidden md:block mt-20 py-8 border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-600 dark:text-gray-400">
          <p>© 2025 Tracker Hub. Build better habits, manage tasks, and track your finances.</p>
        </div>
      </footer>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border-t border-gray-200 dark:border-gray-700 safe-area-pb">
        <div className="flex items-center justify-around h-16 px-2">
          {mobileNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = isActivePath(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center justify-center flex-1 h-full py-2 px-1 transition-all duration-200 ${isActive
                    ? 'text-orange-600 dark:text-orange-500'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
              >
                <div className={`relative ${isActive ? 'scale-110' : ''} transition-transform duration-200`}>
                  <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.5]'}`} />
                  {isActive && (
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-orange-500" />
                  )}
                </div>
                <span className={`text-[10px] mt-1 font-medium truncate max-w-[60px] ${isActive ? 'font-semibold' : ''}`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>

      <Toaster theme={darkMode ? 'dark' : 'light'} />
      <TourGuide />
      <WelcomeModal />
    </div>
  );
}

