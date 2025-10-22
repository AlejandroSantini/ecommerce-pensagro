import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  // Una lista de todos los locales soportados
  locales: ['en', 'es', 'pt'],
  
  // Usado cuando no hay locale en la URL
  defaultLocale: 'es',
  
  // Habilita la detección automática de idioma
  localeDetection: true,
});

export const config = {
  // Activa el middleware para todas las rutas excepto las que empiezan con:
  // - api (API routes)
  // - _next (Next.js internals)
  // - /_vercel (Vercel internals)
  // - /images, /favicon.ico, otros archivos estáticos
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};