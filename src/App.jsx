import { Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client.supabase';
import { TourProvider } from './context/TourContext';
import { SettingsProvider } from './context/SettingsContext';
import Layout from './Layout';
import Dashboard from './pages/Dashboard';
import Finance from './pages/Finance';
import Habits from './pages/Habits';
import Welcome from './pages/Welcome';
import VisionBoard from '../Pages/visionBoard';
import Profile from '../Pages/Profile';
import Settings from '../Pages/Settings';
import TasksPage from '../Pages/Task';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(null); // null = checking, true/false = result

    useEffect(() => {
        // Check authentication on mount
        const checkAuth = async () => {
            try {
                const session = await base44.auth.getSession();
                setIsAuthenticated(!!session);
            } catch (error) {
                console.error('Auth check failed:', error);
                setIsAuthenticated(false);
            }
        };

        checkAuth();

        // Listen for auth changes
        const { data: { subscription } } = base44.auth.onAuthStateChange((event, session) => {
            console.log('Auth state changed:', event, session ? 'logged in' : 'logged out');
            setIsAuthenticated(!!session);
        });

        return () => subscription?.unsubscribe();
    }, []);

    // Show loading while checking auth
    if (isAuthenticated === null) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-900">
                <div className="text-white text-xl">Loading...</div>
            </div>
        );
    }

    return (
        <SettingsProvider>
            <TourProvider>
                <Routes>
                    <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Welcome />} />

                    {/* Protected Routes */}
                    <Route path="/dashboard" element={isAuthenticated ? <Layout><Dashboard /></Layout> : <Navigate to="/" />} />
                    <Route path="/habits" element={isAuthenticated ? <Layout><Habits /></Layout> : <Navigate to="/" />} />
                    <Route path="/tasks" element={isAuthenticated ? <Layout><TasksPage /></Layout> : <Navigate to="/" />} />
                    <Route path="/finance" element={isAuthenticated ? <Layout><Finance /></Layout> : <Navigate to="/" />} />
                    <Route path="/vision-board" element={isAuthenticated ? <Layout><VisionBoard /></Layout> : <Navigate to="/" />} />
                    <Route path="/profile" element={isAuthenticated ? <Layout><Profile /></Layout> : <Navigate to="/" />} />
                    <Route path="/settings" element={isAuthenticated ? <Layout><Settings /></Layout> : <Navigate to="/" />} />

                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </TourProvider>
        </SettingsProvider>
    );
}


export default App;
