import { getRequestConfig } from 'next-intl/server';
 
export default getRequestConfig(async ({ locale }) => {
  // Asegúrate de que el locale es uno de los soportados
  if (!['en', 'es', 'pt'].includes(locale)) {
    locale = 'es'; // Predeterminado a español si no es compatible
  }
  
  // Importar dinámicamente el archivo de mensajes para el locale
  return {
    messages: (
      await import(`../../messages/${locale}.json`)
    ).default
  };
});