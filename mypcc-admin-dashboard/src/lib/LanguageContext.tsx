"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations, Locale, TranslationKey } from './translations';

interface LanguageContextType {
    lang: Locale;
    setLang: (lang: Locale) => void;
    t: (key: TranslationKey, variables?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [lang, setLangState] = useState<Locale>('en');

    useEffect(() => {
        const savedLang = localStorage.getItem('mypcc-lang') as Locale;
        if (savedLang && (savedLang === 'en' || savedLang === 'fr')) {
            setLangState(savedLang);
            if (typeof window !== 'undefined') (window as any).currentLang = savedLang;
        } else {
            if (typeof window !== 'undefined') (window as any).currentLang = 'en';
        }
    }, []);

    const setLang = (newLang: Locale) => {
        setLangState(newLang);
        localStorage.setItem('mypcc-lang', newLang);
        // Keep legacy script in sync
        if (typeof window !== 'undefined') {
            (window as any).currentLang = newLang;
            // Trigger a re-render of ALL legacy components
            try {
                if ((window as any).renderHymns && (window as any).hymns_db) {
                    (window as any).renderHymns((window as any).hymns_db);
                }
            } catch(e) { console.warn('renderHymns failed', e); }
            try {
                if ((window as any).renderDiary) {
                    (window as any).renderDiary(0);
                }
            } catch(e) { console.warn('renderDiary failed', e); }
            try {
                if ((window as any).renderEcho) {
                    (window as any).renderEcho();
                }
            } catch(e) { console.warn('renderEcho failed', e); }
            try {
                if ((window as any).renderDevotional) {
                    (window as any).renderDevotional();
                }
            } catch(e) { console.warn('renderDevotional failed', e); }
        }
    };

    const t = (key: TranslationKey, variables?: Record<string, string | number>) => {
        let text = translations[lang][key] || key;
        
        if (variables) {
            Object.entries(variables).forEach(([k, v]) => {
                text = text.replace(`{${k}}`, String(v));
            });
        }
        
        return text;
    };

    return (
        <LanguageContext.Provider value={{ lang, setLang, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useTranslation() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useTranslation must be used within a LanguageProvider');
    }
    return context;
}
