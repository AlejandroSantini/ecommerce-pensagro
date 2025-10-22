import { notFound } from 'next/navigation';
 
// Define los locales soportados por tu aplicación
const locales = ['en', 'es', 'pt'];
 
// Patrón de segmentos
const pathNameSegmentRegExp = new RegExp(
  `^(/(${locales.join('|')}))?(/.*)?$`
);
 
export function getPathNameSegments(pathname: string) {
  const match = pathname.match(pathNameSegmentRegExp);
  const locale = match?.[2] || '';
  const pathNameWithoutLocale = match?.[3] || pathname;
 
  return { locale, pathNameWithoutLocale };
}
 
export function getLocale(pathname: string) {
  const { locale } = getPathNameSegments(pathname);
  return locale || 'es'; // Idioma predeterminado es español
}
 
export function validateLocale(locale: string) {
  if (!locales.includes(locale)) notFound();
  return locale;
}