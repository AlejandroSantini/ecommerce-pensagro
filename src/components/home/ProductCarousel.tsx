import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import type { Product } from '@/types/product';

interface ProductCarouselProps {
  title: string;
  products: Product[];
}

export function ProductCarousel({ title, products }: ProductCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  useEffect(() => {
    const checkScroll = () => {
      const container = containerRef.current;
      if (!container) return;
      
      setCanScrollLeft(container.scrollLeft > 0);
      setCanScrollRight(
        container.scrollLeft < container.scrollWidth - container.clientWidth - 10
      );
    };

    const container = containerRef.current;
    if (container) {
      checkScroll();
      container.addEventListener('scroll', checkScroll);
      window.addEventListener('resize', checkScroll);
      
      return () => {
        container.removeEventListener('scroll', checkScroll);
        window.removeEventListener('resize', checkScroll);
      };
    }
  }, [products]);

  const scroll = (direction: 'left' | 'right') => {
    const container = containerRef.current;
    if (!container) return;
    
    const scrollAmount = container.clientWidth * 0.75;
    container.scrollTo({
      left: container.scrollLeft + (direction === 'right' ? scrollAmount : -scrollAmount),
      behavior: 'smooth',
    });
  };

  if (!products.length) {
    return null;
  }

  return (
    <section className="py-8 relative">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">{title}</h2>
          <Link href="/productos" className="text-sm text-[#003c6f] hover:underline">
            Ver Todo →
          </Link>
        </div>
        
        <div className="relative">
          {canScrollLeft && (
            <Button
              variant="outline"
              size="icon"
              onClick={() => scroll('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 rounded-full shadow-md -ml-3 bg-white"
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
          )}
          
          <div
            ref={containerRef}
            className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide scroll-smooth"
            style={{ scrollbarWidth: 'none' }}
          >
            {products.map(product => (
              <div
                key={product.id}
                className="flex-none w-60 border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="h-36 bg-gray-100 flex items-center justify-center">
                  {product.imagen ? (
                    <div className="relative w-full h-full">
                      <Image 
                        src={product.imagen} 
                        alt={product.nombre} 
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 240px"
                        onError={() => {
                          const imgElement = document.getElementById(`product-img-${product.id}`);
                          if (imgElement) {
                            imgElement.style.display = 'none';
                            const parent = imgElement.parentElement;
                            if (parent) {
                              parent.innerHTML = '<span class="text-gray-400">Sin imagen</span>';
                            }
                          }
                        }}
                        id={`product-img-${product.id}`}
                      />
                    </div>
                  ) : (
                    <span className="text-gray-400">Sin imagen</span>
                  )}
                </div>
                
                <div className="p-4">
                  <h3 className="font-medium text-sm mb-1 line-clamp-2 h-10">{product.nombre}</h3>
                  <p className="text-lg font-semibold mb-2">${product.precio.toLocaleString()}</p>
                  <Button asChild className="w-full bg-[#003c6f] hover:bg-[#002b50]" size="sm">
                    <Link href={`/productos/${product.id}`}>
                      Ver Detalles
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
          
          {canScrollRight && (
            <Button
              variant="outline"
              size="icon"
              onClick={() => scroll('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 rounded-full shadow-md -mr-3 bg-white"
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}