import React, { createContext, useContext, useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client.supabase';

const SettingsContext = createContext();

export const currencySymbols = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    INR: '₹',
    JPY: '¥',
    CAD: '$',
    AUD: '$'
};

export function SettingsProvider({ children }) {
    const [settings, setSettings] = useState({
        currency: 'INR',
        timezone: 'Asia/Kolkata',
        language: 'en'
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadSettings = async () => {
            try {
                // First try to get from localStorage for immediate display
                const savedCurrency = localStorage.getItem('currency');
                const savedTimezone = localStorage.getItem('timezone');
                const savedLanguage = localStorage.getItem('language');

                if (savedCurrency || savedTimezone || savedLanguage) {
                    setSettings(prev => ({
                        ...prev,
                        currency: savedCurrency || prev.currency,
                        timezone: savedTimezone || prev.timezone,
                        language: savedLanguage || prev.language
                    }));
                }

                // Then try to load from user settings (if logged in)
                const user = await base44.auth.me();
                if (user?.settings) {
                    const newSettings = {
                        currency: user.settings.currency || 'INR',
                        timezone: user.settings.timezone || 'Asia/Kolkata',
                        language: user.settings.language || 'en'
                    };
                    setSettings(newSettings);
                    // Sync to localStorage
                    localStorage.setItem('currency', newSettings.currency);
                    localStorage.setItem('timezone', newSettings.timezone);
                    localStorage.setItem('language', newSettings.language);
                }
            } catch (error) {
                console.log('Using default settings');
            } finally {
                setIsLoading(false);
            }
        };
        loadSettings();
    }, []);

    const updateSettings = (newSettings) => {
        setSettings(prev => ({ ...prev, ...newSettings }));
        // Save to localStorage
        if (newSettings.currency) localStorage.setItem('currency', newSettings.currency);
        if (newSettings.timezone) localStorage.setItem('timezone', newSettings.timezone);
        if (newSettings.language) localStorage.setItem('language', newSettings.language);
    };

    const formatCurrency = (amount) => {
        const num = parseFloat(amount) || 0;
        const locale = settings.currency === 'INR' ? 'en-IN' : 'en-US';
        return new Intl.NumberFormat(locale, {
            style: 'currency',
            currency: settings.currency,
            minimumFractionDigits: 0,
            maximumFractionDigits: 2
        }).format(num);
    };

    return (
        <SettingsContext.Provider value={{
            settings,
            updateSettings,
            formatCurrency,
            currencySymbol: currencySymbols[settings.currency] || '$',
            isLoading
        }}>
            {children}
        </SettingsContext.Provider>
    );
}

export function useSettings() {
    const context = useContext(SettingsContext);
    if (!context) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }
    return context;
}
