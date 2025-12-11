import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { base44 } from '@/api/base44Client.supabase';
import { useSettings } from '@/context/SettingsContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
    Settings as SettingsIcon, 
    Moon, 
    Sun, 
    Globe, 
    Bell, 
    Shield, 
    Key, 
    Trash2,
    LogOut,
    Download,
    ChevronRight
} from 'lucide-react';

export default function Settings() {
    const { t, i18n } = useTranslation();
    const { settings, updateSettings } = useSettings();
    const [darkMode, setDarkMode] = useState(
        localStorage.getItem('theme') === 'dark' || 
        (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)
    );
    const [notifications, setNotifications] = useState(
        localStorage.getItem('notifications') !== 'false'
    );
    const [language, setLanguage] = useState(i18n.language);
    const [currency, setCurrency] = useState(settings.currency || 'INR');

    // Sync with settings context
    useEffect(() => {
        setCurrency(settings.currency || 'INR');
    }, [settings.currency]);

    // Helper functions to get display values
    const getLanguageDisplay = (lang) => {
        const languages = {
            'en': '🇺🇸 English',
            'es': '🇪🇸 Español', 
            'fr': '🇫🇷 Français',
            'de': '🇩🇪 Deutsch',
            'hi': '🇮🇳 हिन्दी'
        };
        return languages[lang] || lang;
    };

    const getCurrencyDisplay = (curr) => {
        const currencies = {
            'INR': '₹ INR',
            'USD': '$ USD',
            'EUR': '€ EUR', 
            'GBP': '£ GBP',
            'JPY': '¥ JPY',
            'CAD': '$ CAD',
            'AUD': '$ AUD'
        };
        return currencies[curr] || curr;
    };

    const toggleDarkMode = () => {
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

    const handleLanguageChange = (newLanguage) => {
        setLanguage(newLanguage);
        i18n.changeLanguage(newLanguage);
        updateSettings({ language: newLanguage });
        localStorage.setItem('language', newLanguage);
    };

    const handleCurrencyChange = (newCurrency) => {
        setCurrency(newCurrency);
        updateSettings({ currency: newCurrency });
    };

    const handleNotificationsChange = (enabled) => {
        setNotifications(enabled);
        localStorage.setItem('notifications', enabled.toString());
        if (enabled && 'Notification' in window) {
            Notification.requestPermission();
        }
    };

    const handleLogout = async () => {
        if (confirm('Are you sure you want to log out?')) {
            await base44.auth.logout('/');
        }
    };

    const handleChangePassword = async () => {
        const newPassword = prompt('Enter your new password (minimum 6 characters):');
        if (!newPassword) return;
        
        if (newPassword.length < 6) {
            alert('Password must be at least 6 characters long.');
            return;
        }
        
        try {
            await base44.auth.updateMe({ password: newPassword });
            alert('Password updated successfully!');
        } catch (error) {
            console.error('Error updating password:', error);
            alert('Failed to update password. Please try again.');
        }
    };

    const handleExportData = async () => {
        try {
            const user = await base44.auth.me();
            if (!user) {
                alert('Please log in to export your data.');
                return;
            }

            // Collect all user data
            const [habits, habitLogs, tasks, transactions, debts, categories, monthlyBudgets, mentalStates, visionBoards, visionBoardItems] = await Promise.all([
                base44.entities.Habit.list().catch(() => []),
                base44.entities.HabitLog.list().catch(() => []),
                base44.entities.Task.list().catch(() => []),
                base44.entities.FinanceTransaction.list().catch(() => []),
                base44.entities.Debt.list().catch(() => []),
                base44.entities.Category.list().catch(() => []),
                base44.entities.MonthlyBudget.list().catch(() => []),
                base44.entities.MentalState.list().catch(() => []),
                base44.entities.VisionBoard.list().catch(() => []),
                base44.entities.VisionBoardItem.list().catch(() => [])
            ]);

            // Get finance data from localStorage
            const financeData = {};
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && key.startsWith('finance_data_')) {
                    financeData[key] = localStorage.getItem(key);
                }
            }

            const exportData = {
                user: {
                    id: user.id,
                    email: user.email,
                    created_at: user.created_at,
                    user_metadata: user.user_metadata
                },
                data: {
                    habits,
                    habitLogs,
                    tasks,
                    transactions,
                    debts,
                    categories,
                    monthlyBudgets,
                    mentalStates,
                    visionBoards,
                    visionBoardItems,
                    financeData
                },
                settings: {
                    currency: settings.currency,
                    language: language,
                    theme: localStorage.getItem('theme'),
                    notifications: localStorage.getItem('notifications')
                },
                exportedAt: new Date().toISOString()
            };

            // Create and download file
            const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `tracker-hub-data-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

            alert('Data exported successfully!');
        } catch (error) {
            console.error('Error exporting data:', error);
            alert('Failed to export data. Please try again.');
        }
    };

    const handleClearCache = () => {
        if (confirm('This will clear all local data including offline finance data. Are you sure?')) {
            try {
                // Clear localStorage
                const keysToKeep = ['theme', 'language', 'currency', 'notifications'];
                const keysToRemove = [];
                
                for (let i = 0; i < localStorage.length; i++) {
                    const key = localStorage.key(i);
                    if (key && !keysToKeep.includes(key)) {
                        keysToRemove.push(key);
                    }
                }
                
                keysToRemove.forEach(key => localStorage.removeItem(key));
                
                // Clear sessionStorage
                sessionStorage.clear();
                
                // Clear cache if available
                if ('caches' in window) {
                    caches.keys().then(names => {
                        names.forEach(name => {
                            caches.delete(name);
                        });
                    });
                }
                
                alert('Cache cleared successfully! Please refresh the page.');
            } catch (error) {
                console.error('Error clearing cache:', error);
                alert('Failed to clear cache. Please try again.');
            }
        }
    };

    const handleDeleteAccount = async () => {
        if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
            if (confirm('This will permanently delete all your data. Are you absolutely sure?')) {
                alert('Account deletion is not implemented yet. Please contact support.');
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        Settings
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Customize your app experience and manage your account
                    </p>
                </div>

                <div className="space-y-6">
                    {/* Appearance */}
                    <Card className="bg-white dark:bg-gray-800">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                {darkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                                Appearance
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium">Dark Mode</p>
                                    <p className="text-sm text-gray-500">Toggle between light and dark themes</p>
                                </div>
                                <Switch
                                    checked={darkMode}
                                    onCheckedChange={toggleDarkMode}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Language & Region */}
                    <Card className="bg-white dark:bg-gray-800">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Globe className="w-5 h-5" />
                                Language & Region
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium">Language</p>
                                    <p className="text-sm text-gray-500">Choose your preferred language</p>
                                </div>
                                <Select value={language} onValueChange={handleLanguageChange}>
                                    <SelectTrigger className="w-36">
                                        <SelectValue>{getLanguageDisplay(language)}</SelectValue>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="en">🇺🇸 English</SelectItem>
                                        <SelectItem value="es">🇪🇸 Español</SelectItem>
                                        <SelectItem value="fr">🇫🇷 Français</SelectItem>
                                        <SelectItem value="de">🇩🇪 Deutsch</SelectItem>
                                        <SelectItem value="hi">🇮🇳 हिन्दी</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium">Currency</p>
                                    <p className="text-sm text-gray-500">Choose your preferred currency</p>
                                </div>
                                <Select value={currency} onValueChange={handleCurrencyChange}>
                                    <SelectTrigger className="w-36">
                                        <SelectValue>{getCurrencyDisplay(currency)}</SelectValue>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="INR">₹ Indian Rupee (INR)</SelectItem>
                                        <SelectItem value="USD">$ US Dollar (USD)</SelectItem>
                                        <SelectItem value="EUR">€ Euro (EUR)</SelectItem>
                                        <SelectItem value="GBP">£ British Pound (GBP)</SelectItem>
                                        <SelectItem value="JPY">¥ Japanese Yen (JPY)</SelectItem>
                                        <SelectItem value="CAD">$ Canadian Dollar (CAD)</SelectItem>
                                        <SelectItem value="AUD">$ Australian Dollar (AUD)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Notifications */}
                    <Card className="bg-white dark:bg-gray-800">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Bell className="w-5 h-5" />
                                Notifications
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium">Push Notifications</p>
                                    <p className="text-sm text-gray-500">Receive notifications for important updates</p>
                                </div>
                                <Switch
                                    checked={notifications}
                                    onCheckedChange={handleNotificationsChange}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Security */}
                    <Card className="bg-white dark:bg-gray-800">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Shield className="w-5 h-5" />
                                Security
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Button 
                                variant="outline" 
                                className="w-full justify-between p-4 h-auto"
                                onClick={handleChangePassword}
                            >
                                <div className="flex items-center">
                                    <Key className="w-5 h-5 mr-3 text-red-500" />
                                    <div className="text-left">
                                        <p className="font-medium">Change Password</p>
                                        <p className="text-xs text-gray-500">Update your account password</p>
                                    </div>
                                </div>
                                <ChevronRight className="w-4 h-4 text-gray-400" />
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Data & Privacy */}
                    <Card className="bg-white dark:bg-gray-800">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Shield className="w-5 h-5" />
                                Data & Privacy
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Button 
                                variant="outline" 
                                className="w-full justify-between p-4 h-auto"
                                onClick={handleExportData}
                            >
                                <div className="flex items-center">
                                    <Download className="w-5 h-5 mr-3 text-green-500" />
                                    <div className="text-left">
                                        <p className="font-medium">Export Data</p>
                                        <p className="text-xs text-gray-500">Download all your data</p>
                                    </div>
                                </div>
                                <ChevronRight className="w-4 h-4 text-gray-400" />
                            </Button>
                            
                            <Button 
                                variant="outline" 
                                className="w-full justify-between p-4 h-auto"
                                onClick={handleClearCache}
                            >
                                <div className="flex items-center">
                                    <Trash2 className="w-5 h-5 mr-3 text-orange-500" />
                                    <div className="text-left">
                                        <p className="font-medium">Clear Cache</p>
                                        <p className="text-xs text-gray-500">Clear local storage and cache</p>
                                    </div>
                                </div>
                                <ChevronRight className="w-4 h-4 text-gray-400" />
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Account Actions */}
                    <Card className="bg-white dark:bg-gray-800">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <SettingsIcon className="w-5 h-5" />
                                Account
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Button 
                                variant="outline" 
                                className="w-full justify-between p-4 h-auto"
                                onClick={handleLogout}
                            >
                                <div className="flex items-center">
                                    <LogOut className="w-5 h-5 mr-3 text-blue-500" />
                                    <div className="text-left">
                                        <p className="font-medium">Log Out</p>
                                        <p className="text-xs text-gray-500">Sign out of your account</p>
                                    </div>
                                </div>
                                <ChevronRight className="w-4 h-4 text-gray-400" />
                            </Button>

                            <Button 
                                variant="outline" 
                                className="w-full justify-between p-4 h-auto text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/10"
                                onClick={handleDeleteAccount}
                            >
                                <div className="flex items-center">
                                    <Trash2 className="w-5 h-5 mr-3 text-red-500" />
                                    <div className="text-left">
                                        <p className="font-medium">Delete Account</p>
                                        <p className="text-xs text-gray-500">Permanently delete your account and data</p>
                                    </div>
                                </div>
                                <ChevronRight className="w-4 h-4 text-gray-400" />
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}