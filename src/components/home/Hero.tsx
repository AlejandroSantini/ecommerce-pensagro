'use client';

import { Link } from '@/lib/navigation';
import { useTranslations } from 'next-intl';

export function Hero() {
  const t = useTranslations('home.hero');
  
  return (
    <section className="relative bg-[#f8f9fa] overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-[#003c6f]/90 to-transparent z-10" />
      
      <div className="h-96 md:h-[500px] bg-gray-200 flex items-center">
        {/* Aquí iría la imagen de fondo */}
        <span className="hidden">Background Image</span>
      </div>
      
      <div className="absolute inset-0 z-20 flex items-center">
        <div className="container mx-auto px-6">
          <div className="max-w-lg text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {t('title')}
            </h1>
            <p className="text-lg mb-8 text-white/90">
              {t('description')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                href="/products"
                className="px-6 py-3 bg-white text-[#003c6f] font-medium rounded-md hover:bg-gray-100 transition-colors text-center"
              >
                {t('viewProducts')}
              </Link>
              <Link 
                href="/about"
                className="px-6 py-3 bg-transparent border border-white text-white font-medium rounded-md hover:bg-white/10 transition-colors text-center"
              >
                {t('learnMore')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}