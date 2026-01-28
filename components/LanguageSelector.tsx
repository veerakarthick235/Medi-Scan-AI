'use client';

import { Button } from '@/components/ui/button';
import { getAvailableLanguages, type Language } from '@/lib/i18n';
import { useLanguage } from '@/lib/language-context';

export function LanguageSelector() {
  const { language, setLanguage } = useLanguage();
  const languages: Record<Language, string> = {
    en: 'English',
    es: 'Español',
    fr: 'Français',
    pt: 'Português',
    hi: 'हिन्दी',
  };

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
  };

  return (
    <div className="flex gap-2">
      {getAvailableLanguages().map((lang) => (
        <Button
          key={lang}
          onClick={() => handleLanguageChange(lang)}
          variant={language === lang ? 'default' : 'outline'}
          size="sm"
          className="text-xs"
        >
          {languages[lang]}
        </Button>
      ))}
    </div>
  );
}
