import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/hooks/useTranslation';

const HERO_IMAGES = [
  {
    src: "/origen-carne-angus-prueba.jpg",
    alt: "Carne Angus",
    title: "Calidad Premium",
    description: "Productos de la más alta calidad para tu ganado"
  },
  {
    src: "/mock/pel%20418.png",
    alt: "Electrificadores",
    title: "Tecnología Avanzada",
    description: "Soluciones innovadoras para el control de ganado"
  },
  {
    src: "/mock/PEL%20S1000%20(F).png",
    alt: "Energía Solar",
    title: "Energía Sostenible",
    description: "Electrificadores solares para máxima eficiencia"
  }
];

export function Hero() {
  const { t } = useTranslation();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === HERO_IMAGES.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const currentImage = HERO_IMAGES[currentImageIndex];

  return (
    <section className="relative bg-[#f8f9fa] overflow-hidden">
      <div className="absolute inset-0 z-0">
        {HERO_IMAGES.map((image, index) => (
          <img
            key={index}
            src={image.src}
            alt={image.alt}
            className={`w-full h-full object-cover transition-opacity duration-1000 ${
              index === currentImageIndex ? 'opacity-100' : 'opacity-0'
            } ${index === 0 ? 'relative' : 'absolute inset-0'}`}
          />
        ))}
      </div>

      <div className="absolute inset-0 bg-gradient-to-r from-[#003c6f] via-[#003c6f]/80 to-transparent z-10" />

      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-30 flex space-x-2">
        {HERO_IMAGES.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentImageIndex(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentImageIndex
                ? 'bg-white scale-125'
                : 'bg-white/50 hover:bg-white/75'
            }`}
            aria-label={`Ir a imagen ${index + 1}`}
          />
        ))}
      </div>

      <div className="relative h-96 md:h-[500px] flex items-center z-20">
        <div className="container mx-auto px-6">
          <div className="max-w-lg text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {currentImage.title}
            </h1>
            <p className="text-lg mb-8 text-white/90">
              {currentImage.description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" variant="default" className="bg-white text-[#003c6f] hover:bg-gray-100">
                <Link href="/products">
                  {t('home.hero.viewProducts')}
                </Link>
              </Button>
              <Button asChild size="lg" variant="secondary" className="bg-white/20 backdrop-blur-sm text-white border-white/40 hover:bg-white/30">
                <Link href="/about">
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