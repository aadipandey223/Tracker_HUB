import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { base44 } from '@/api/base44Client.supabase';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import {
  Settings as SettingsIcon, Moon, Sun, DollarSign, Bell,
  Download, Trash2, LogOut, Loader2, Check, AlertTriangle,
  Palette, Globe, Shield, Cake, Key, HelpCircle,
  Info, Languages, Clock, Send, BookOpen
} from 'lucide-react';
import { format } from 'date-fns';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useTour } from '@/context/TourContext';
import { useSettings } from '@/context/SettingsContext';

export default function Settings() {
  const { t, i18n } = useTranslation();
  const { startTour } = useTour();
  const { settings, updateSettings } = useSettings();
  const [darkMode, setDarkMode] = useState(false);
  const [currency, setCurrency] = useState(settings.currency || 'USD');
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [weeklyReport, setWeeklyReport] = useState(false);
  const [habitReminders, setHabitReminders] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [birthDate, setBirthDate] = useState('');
  const [language, setLanguage] = useState(i18n.language || 'en');
  const [timezone, setTimezone] = useState(settings.timezone || 'UTC');
  const [supportMessage, setSupportMessage] = useState('');
  const [isSendingSupport, setIsSendingSupport] = useState(false);
  const [supportSent, setSupportSent] = useState(false);

  const handleLanguageChange = (newLang) => {
    setLanguage(newLang);
    i18n.changeLanguage(newLang);
    localStorage.setItem('language', newLang);
    updateSettings({ language: newLang });
  };

  const handleCurrencyChange = (newCurrency) => {
    setCurrency(newCurrency);
    updateSettings({ currency: newCurrency });
  };

  const handleTimezoneChange = (newTimezone) => {
    setTimezone(newTimezone);
    updateSettings({ timezone: newTimezone });
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    setDarkMode(savedTheme === 'dark');

    const loadSettings = async () => {
      try {
        const user = await base44.auth.me();
        if (user.settings) {
          setCurrency(user.settings.currency || 'USD');
          setEmailNotifications(user.settings.emailNotifications !== false);
          setWeeklyReport(user.settings.weeklyReport || false);
          setHabitReminders(user.settings.habitReminders !== false);
          setBirthDate(user.settings.birthDate || '');
          setLanguage(user.settings.language || 'en');
          setTimezone(user.settings.timezone || 'UTC');
        }
      } catch (error) {
        console.error(error);
      }
    };
    loadSettings();
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

  const saveSettings = async () => {
    setIsSaving(true);
    try {
      await base44.auth.updateMe({
        settings: {
          currency,
          emailNotifications,
          weeklyReport,
          habitReminders,
          birthDate,
          language,
          timezone
        }
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSendSupport = async () => {
    if (!supportMessage.trim()) return;
    setIsSendingSupport(true);
    try {
      const user = await base44.auth.me();
      await base44.integrations.Core.SendEmail({
        to: user.email,
        subject: 'Support Request Received - Tracker Hub',
        body: `Hi ${user.full_name || 'there'},\n\nWe've received your support request:\n\n"${supportMessage}"\n\nOur team will get back to you within 24-48 hours.\n\nBest,\nTracker Hub Team`
      });
      setSupportSent(true);
      setSupportMessage('');
      setTimeout(() => setSupportSent(false), 3000);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSendingSupport(false);
    }
  };

  const handleExportData = async () => {
    setIsExporting(true);
    try {
      const [habits, tasks, transactions, habitLogs, debts] = await Promise.all([
        base44.entities.Habit.list(),
        base44.entities.Task.list(),
        base44.entities.FinanceTransaction.list(),
        base44.entities.HabitLog.list(),
        base44.entities.Debt.list()
      ]);

      const data = { habits, tasks, transactions, habitLogs, debts, exportDate: new Date().toISOString() };
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `tracker-hub-export-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleLogout = () => {
    base44.auth.logout('/Welcome');
  };

  const currencies = [
    { value: 'USD', label: '$ USD', symbol: '$' },
    { value: 'EUR', label: '€ EUR', symbol: '€' },
    { value: 'GBP', label: '£ GBP', symbol: '£' },
    { value: 'INR', label: '₹ INR', symbol: '₹' },
    { value: 'JPY', label: '¥ JPY', symbol: '¥' },
    { value: 'CAD', label: '$ CAD', symbol: '$' },
    { value: 'AUD', label: '$ AUD', symbol: '$' },
  ];

  const languages = [
    { value: 'en', label: 'English' },
    { value: 'es', label: 'Español' },
    { value: 'fr', label: 'Français' },
    { value: 'de', label: 'Deutsch' },
    { value: 'hi', label: 'हिंदी' },
    { value: 'zh', label: '中文' },
  ];

  const timezones = [
    { value: 'UTC', label: 'UTC' },
    { value: 'America/New_York', label: 'Eastern Time (US)' },
    { value: 'America/Los_Angeles', label: 'Pacific Time (US)' },
    { value: 'Europe/London', label: 'London' },
    { value: 'Europe/Paris', label: 'Paris' },
    { value: 'Asia/Kolkata', label: 'India (IST)' },
    { value: 'Asia/Tokyo', label: 'Tokyo' },
    { value: 'Australia/Sydney', label: 'Sydney' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center justify-center gap-3">
          <SettingsIcon className="w-8 h-8 text-orange-500" />
          Settings
        </h1>
        <p className="text-gray-500 dark:text-gray-400">Customize your Tracker Hub experience</p>
      </div>

      {/* Appearance */}
      <Card className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 dark:from-purple-500/20 dark:to-pink-500/20">
          <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
            <Palette className="w-5 h-5 text-purple-500" />
            Appearance
          </CardTitle>
          <CardDescription>Customize how Tracker Hub looks</CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${darkMode ? 'bg-gray-700' : 'bg-orange-100'}`}>
                {darkMode ? <Moon className="w-6 h-6 text-orange-400" /> : <Sun className="w-6 h-6 text-orange-500" />}
              </div>
              <div>
                <Label className="text-base font-medium text-gray-900 dark:text-white">Dark Mode</Label>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {darkMode ? 'Orange-punched dark theme active' : 'Switch to dark theme'}
                </p>
              </div>
            </div>
            <Switch checked={darkMode} onCheckedChange={toggleTheme} />
          </div>
          <Separator className="dark:bg-gray-700" />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Languages className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <Label className="text-base font-medium text-gray-900 dark:text-white">Language</Label>
                <p className="text-sm text-gray-500 dark:text-gray-400">Select your preferred language</p>
              </div>
            </div>
            <Select value={language} onValueChange={handleLanguageChange}>
              <SelectTrigger className="w-32 bg-gray-50 dark:bg-gray-700">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {languages.map(l => (
                  <SelectItem key={l.value} value={l.value}>{l.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Personal Info */}
      <Card className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-pink-500/10 to-rose-500/10 dark:from-pink-500/20 dark:to-rose-500/20">
          <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
            <Cake className="w-5 h-5 text-pink-500" />
            Personal Info
          </CardTitle>
          <CardDescription>We&apos;ll celebrate your special day! 🎉</CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center">
                <Cake className="w-6 h-6 text-pink-500" />
              </div>
              <div>
                <Label className="text-base font-medium text-gray-900 dark:text-white">Birthday</Label>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {birthDate ? `🎂 ${format(new Date(birthDate), 'MMMM d')}` : 'Add your birthday'}
                </p>
              </div>
            </div>
            <Input
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="w-40 bg-gray-50 dark:bg-gray-700"
            />
          </div>
          <Separator className="dark:bg-gray-700" />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                <Clock className="w-6 h-6 text-indigo-500" />
              </div>
              <div>
                <Label className="text-base font-medium text-gray-900 dark:text-white">Timezone</Label>
                <p className="text-sm text-gray-500 dark:text-gray-400">For accurate reminders</p>
              </div>
            </div>
            <Select value={timezone} onValueChange={handleTimezoneChange}>
              <SelectTrigger className="w-44 bg-gray-50 dark:bg-gray-700">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {timezones.map(tz => (
                  <SelectItem key={tz.value} value={tz.value}>{tz.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Finance Settings */}
      <Card className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 dark:from-green-500/20 dark:to-emerald-500/20">
          <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
            <DollarSign className="w-5 h-5 text-green-500" />
            Finance
          </CardTitle>
          <CardDescription>Configure your finance tracker settings</CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <Globe className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <Label className="text-base font-medium text-gray-900 dark:text-white">Default Currency</Label>
                <p className="text-sm text-gray-500 dark:text-gray-400">Used for all financial displays</p>
              </div>
            </div>
            <Select value={currency} onValueChange={handleCurrencyChange}>
              <SelectTrigger className="w-32 bg-gray-50 dark:bg-gray-700">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {currencies.map(c => (
                  <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 dark:from-blue-500/20 dark:to-cyan-500/20">
          <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
            <Bell className="w-5 h-5 text-blue-500" />
            Notifications
          </CardTitle>
          <CardDescription>Manage your notification preferences</CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base font-medium text-gray-900 dark:text-white">Email Notifications</Label>
              <p className="text-sm text-gray-500 dark:text-gray-400">Receive task reminders via email</p>
            </div>
            <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
          </div>
          <Separator className="dark:bg-gray-700" />
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base font-medium text-gray-900 dark:text-white">Weekly Report</Label>
              <p className="text-sm text-gray-500 dark:text-gray-400">Get a summary of your week every Sunday</p>
            </div>
            <Switch checked={weeklyReport} onCheckedChange={setWeeklyReport} />
          </div>
          <Separator className="dark:bg-gray-700" />
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base font-medium text-gray-900 dark:text-white">Habit Reminders</Label>
              <p className="text-sm text-gray-500 dark:text-gray-400">Daily reminder to log your habits</p>
            </div>
            <Switch checked={habitReminders} onCheckedChange={setHabitReminders} />
          </div>
        </CardContent>
      </Card>

      {/* Security */}
      <Card className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-red-500/10 to-orange-500/10 dark:from-red-500/20 dark:to-orange-500/20">
          <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
            <Key className="w-5 h-5 text-red-500" />
            Security
          </CardTitle>
          <CardDescription>Manage your account security</CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <Button
            variant="outline"
            onClick={() => base44.auth.redirectToLogin()}
            className="w-full justify-start h-14 border-gray-200 dark:border-gray-600"
          >
            <Key className="w-5 h-5 mr-3 text-red-500" />
            <div className="text-left">
              <p className="font-medium">Change Password</p>
              <p className="text-xs text-gray-500">Update your account password</p>
            </div>
          </Button>
        </CardContent>
      </Card>

      {/* Save Button */}
      <Button
        onClick={saveSettings}
        disabled={isSaving}
        className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 h-12 text-lg"
      >
        {isSaving ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Saving...
          </>
        ) : saved ? (
          <>
            <Check className="w-5 h-5 mr-2" />
            Saved!
          </>
        ) : (
          'Save Settings'
        )}
      </Button>

      {/* Data Management */}
      <Card className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-orange-500/10 to-red-500/10 dark:from-orange-500/20 dark:to-red-500/20">
          <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
            <Shield className="w-5 h-5 text-orange-500" />
            Data Management
          </CardTitle>
          <CardDescription>Export or manage your data</CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <Button
            variant="outline"
            onClick={handleExportData}
            disabled={isExporting}
            className="w-full justify-start h-14 border-gray-200 dark:border-gray-600"
          >
            {isExporting ? (
              <Loader2 className="w-5 h-5 mr-3 animate-spin" />
            ) : (
              <Download className="w-5 h-5 mr-3 text-blue-500" />
            )}
            <div className="text-left">
              <p className="font-medium">Export All Data</p>
              <p className="text-xs text-gray-500">Download your habits, tasks, and finances</p>
            </div>
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start h-14 border-red-200 dark:border-red-900 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                <Trash2 className="w-5 h-5 mr-3" />
                <div className="text-left">
                  <p className="font-medium">Clear All Data</p>
                  <p className="text-xs text-red-400">Permanently delete all your data</p>
                </div>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="dark:bg-gray-800 dark:border-gray-700">
              <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center gap-2 text-red-600">
                  <AlertTriangle className="w-5 h-5" />
                  Are you absolutely sure?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete all your habits, tasks, transactions, and other data.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="dark:bg-gray-700 dark:border-gray-600">Cancel</AlertDialogCancel>
                <AlertDialogAction className="bg-red-600 hover:bg-red-700">
                  Delete Everything
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>

      {/* Help & Support */}
      <Card className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-cyan-500/10 to-teal-500/10 dark:from-cyan-500/20 dark:to-teal-500/20">
          <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
            <HelpCircle className="w-5 h-5 text-cyan-500" />
            Help & Support
          </CardTitle>
          <CardDescription>Get help or send us feedback</CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <Button
            variant="outline"
            onClick={startTour}
            className="w-full justify-start h-12 mb-4 border-cyan-200 dark:border-cyan-800 text-cyan-600 hover:bg-cyan-50 dark:hover:bg-cyan-900/20"
          >
            <BookOpen className="w-5 h-5 mr-3" />
            <span className="font-medium">Replay Tutorial</span>
          </Button>

          <div className="space-y-3">
            <Label className="text-gray-700 dark:text-gray-300">Send us a message</Label>
            <Textarea
              placeholder="Describe your issue or share feedback..."
              value={supportMessage}
              onChange={(e) => setSupportMessage(e.target.value)}
              className="bg-gray-50 dark:bg-gray-700 min-h-24"
            />
            <Button
              onClick={handleSendSupport}
              disabled={isSendingSupport || !supportMessage.trim()}
              className="w-full bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600"
            >
              {isSendingSupport ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : supportSent ? (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Message Sent!
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Send Message
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* About */}
      <Card className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-gray-500/10 to-slate-500/10 dark:from-gray-500/20 dark:to-slate-500/20">
          <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
            <Info className="w-5 h-5 text-gray-500" />
            About
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
              <span className="text-white font-bold text-2xl">T</span>
            </div>
            <div>
              <h3 className="font-bold text-lg text-gray-900 dark:text-white">Tracker Hub</h3>
              <p className="text-sm text-gray-500">Version 1.0.0</p>
            </div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Your all-in-one productivity platform for tracking habits, managing tasks, and monitoring finances. Built with ❤️ to help you achieve your goals.
          </p>
          <div className="flex gap-4 mt-4 text-sm">
            <a href="#" className="text-orange-500 hover:underline">Privacy Policy</a>
            <a href="#" className="text-orange-500 hover:underline">Terms of Service</a>
          </div>
        </CardContent>
      </Card>

      {/* Logout */}
      <Button
        variant="outline"
        onClick={handleLogout}
        className="w-full h-14 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
      >
        <LogOut className="w-5 h-5 mr-3 text-gray-500" />
        <span className="font-medium">Log Out</span>
      </Button>
    </div>
  );
}