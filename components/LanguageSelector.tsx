'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { getAvailableLanguages, setLanguage, type Language } from '@/lib/i18n';

export function LanguageSelector() {
  const [currentLang, setCurrentLang] = useState<Language>('en');
  const languages: Record<Language, string> = {
    en: 'English',
    es: 'Español',
    fr: 'Français',
    pt: 'Português',
    hi: 'हिन्दी',
  };

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    setCurrentLang(lang);
    // Trigger a re-render by dispatching a custom event
    window.dispatchEvent(new CustomEvent('languageChanged', { detail: lang }));
  };

  return (
    <div className="flex gap-2">
      {getAvailableLanguages().map((lang) => (
        <Button
          key={lang}
          onClick={() => handleLanguageChange(lang)}
          variant={currentLang === lang ? 'default' : 'outline'}
          size="sm"
          className="text-xs"
        >
          {languages[lang]}
        </Button>
      ))}
    </div>
  );
}
