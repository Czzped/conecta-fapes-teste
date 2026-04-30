import { createContext, useContext, useState, ReactNode, useEffect, useMemo, useCallback } from 'react';
import { translations, Languages } from '@/locales/translations';

interface LanguageContextType {
  language: Languages;
  setLanguage: (lang: Languages) => void;
  t: (key: string) => string;
}

// Create context with undefined initial value
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Languages>('pt');

  useEffect(() => {
    // Load saved language from localStorage
    const savedLanguage = localStorage.getItem('language') as Languages;
    if (savedLanguage && ['pt', 'en', 'es'].includes(savedLanguage)) {
      setLanguage(savedLanguage);
    }
  }, []);

  const handleSetLanguage = useCallback((lang: Languages) => {
    console.log('🌐 Changing language to:', lang);
    setLanguage(lang);
    localStorage.setItem('language', lang);
  }, []);

  const t = useCallback((key: string): string => {
    const keys = key.split('.');
    let value: any = translations[language];
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return key; // Return key if translation not found
      }
    }
    
    return typeof value === 'string' ? value : key;
  }, [language]);

  const contextValue = useMemo(
    () => ({ language, setLanguage: handleSetLanguage, t }),
    [language, handleSetLanguage, t]
  );

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    // Return default values if provider is not available (e.g., in isolated component previews)
    return {
      language: 'pt' as Languages,
      setLanguage: () => {},
      t: (key: string) => {
        // Simple fallback translation function
        const keys = key.split('.');
        let value: any = translations['pt'];
        for (const k of keys) {
          if (value && typeof value === 'object' && k in value) {
            value = value[k];
          } else {
            return key;
          }
        }
        return typeof value === 'string' ? value : key;
      },
    };
  }
  return context;
}