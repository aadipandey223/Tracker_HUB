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
    DollarSign,
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
                                    <SelectTrigger className="w-32">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="en">English</SelectItem>
                                        <SelectItem value="es">Español</SelectItem>
                                        <SelectItem value="fr">Français</SelectItem>
                                        <SelectItem value="de">Deutsch</SelectItem>
                                        <SelectItem value="hi">हिन्दी</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium">Currency</p>
                                    <p className="text-sm text-gray-500">Choose your preferred currency</p>
                                </div>
                                <Select value={currency} onValueChange={handleCurrencyChange}>
                                    <SelectTrigger className="w-32">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="INR">₹ INR</SelectItem>
                                        <SelectItem value="USD">$ USD</SelectItem>
                                        <SelectItem value="EUR">€ EUR</SelectItem>
                                        <SelectItem value="GBP">£ GBP</SelectItem>
                                        <SelectItem value="JPY">¥ JPY</SelectItem>
                                        <SelectItem value="CAD">$ CAD</SelectItem>
                                        <SelectItem value="AUD">$ AUD</SelectItem>
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
                            <Button variant="outline" className="w-full justify-between p-4 h-auto">
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
                            <Button variant="outline" className="w-full justify-between p-4 h-auto">
                                <div className="flex items-center">
                                    <DollarSign className="w-5 h-5 mr-3 text-green-500" />
                                    <div className="text-left">
                                        <p className="font-medium">Export Data</p>
                                        <p className="text-xs text-gray-500">Download all your data</p>
                                    </div>
                                </div>
                                <ChevronRight className="w-4 h-4 text-gray-400" />
                            </Button>
                            
                            <Button variant="outline" className="w-full justify-between p-4 h-auto">
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