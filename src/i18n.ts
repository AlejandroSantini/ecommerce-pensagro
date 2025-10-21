import { getRequestConfig } from 'next-intl/server';

export const locales = ['en', 'es', 'pt'];
export const defaultLocale = 'en';

export default getRequestConfig(async () => {
  const locale = defaultLocale;

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default
  };
});
