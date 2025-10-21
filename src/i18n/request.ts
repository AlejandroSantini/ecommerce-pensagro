import { getRequestConfig } from 'next-intl/server';

export const locales = ['es', 'en', 'pt'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'es';

export default getRequestConfig(async ({ locale }) => {
  // Si el locale no es válido, usar el defaultLocale en lugar de notFound()
  const resolvedLocale: Locale = (locale && locales.includes(locale as Locale) ? locale : defaultLocale) as Locale;

  return {
    locale: resolvedLocale,
    messages: (await import(`../../messages/${resolvedLocale}.json`)).default,
  };
});