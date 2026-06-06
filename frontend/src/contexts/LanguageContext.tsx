'use client';
import { createContext, useContext, useState } from 'react';
import type { Language } from '@/types';
import T, { TKey } from '@/lib/translations';

interface LanguageContextValue {
  language: Language;
  toggleLanguage: () => void;
  t: (key: TKey) => string;
}

const LanguageContext = createContext<LanguageContextValue>({
  language: 'EN',
  toggleLanguage: () => {},
  t: (key) => T.EN[key],
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('EN');

  const toggleLanguage = () => setLanguage((l) => (l === 'EN' ? 'MM' : 'EN'));

  const t = (key: TKey): string => T[language][key] ?? T.EN[key];

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
