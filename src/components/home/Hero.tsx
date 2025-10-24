import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/hooks/useTranslation';

export function Hero() {
  const { t } = useTranslation();

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
              {t('home.hero.title')}
            </h1>
            <p className="text-lg mb-8 text-white/90">
              {t('home.hero.description')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" variant="default" className="bg-white text-[#003c6f] hover:bg-gray-100">
                <Link href="/productos">
                  {t('home.hero.viewProducts')}
                </Link>
              </Button>
              <Button asChild size="lg" variant="secondary" className="bg-white/20 backdrop-blur-sm text-white border-white/40 hover:bg-white/30">
                <Link href="/nosotros">
                  {t('home.hero.learnMore')}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}