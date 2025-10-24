import { useRouter } from 'next/router';
import { useMemo } from 'react';
import es from '../../messages/es.json';
import en from '../../messages/en.json';
import pt from '../../messages/pt.json';

const messages: Record<string, any> = {
  es,
  en,
  pt,
};

export function useTranslation() {
  const router = useRouter();
  const locale = router.locale || 'es';

  const t = useMemo(() => {
    const translations = messages[locale] || messages.es;

    return (key: string, params?: Record<string, any>): string => {
      const keys = key.split('.');
      let value: any = translations;

      for (const k of keys) {
        value = value?.[k];
        if (value === undefined) {
          console.warn(`Translation key not found: ${key}`);
          return key;
        }
      }

      if (typeof value !== 'string') {
        console.warn(`Translation value is not a string: ${key}`);
        return key;
      }

      // Replace parameters like {year}, {count}, etc.
      if (params) {
        return value.replace(/\{(\w+)\}/g, (match: string, paramKey: string) => {
          return params[paramKey]?.toString() || match;
        });
      }

      return value;
    };
  }, [locale]);

  return { t, locale };
}
