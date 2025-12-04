import { useState, useRef, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react';

interface ProductImageCarouselProps {
  images: string[];
  productName: string;
  mainImage?: string;
}

export function ProductImageCarousel({ images, productName, mainImage }: ProductImageCarouselProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [currentX, setCurrentX] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const imageList = images && images.length > 0 ? images : mainImage ? [mainImage] : [];
  const currentImage = imageList[currentImageIndex] || '';
  const hasMultipleImages = imageList.length > 1;

  const goToPrevious = useCallback(() => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? imageList.length - 1 : prev - 1
    );
  }, [imageList.length]);

  const goToNext = useCallback(() => {
    setCurrentImageIndex((prev) =>
      prev === imageList.length - 1 ? 0 : prev + 1
    );
  }, [imageList.length]);

  useEffect(() => {
    if (!isFullscreen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsFullscreen(false);
      } else if (e.key === 'ArrowLeft') {
        goToPrevious();
      } else if (e.key === 'ArrowRight') {
        goToNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isFullscreen, goToPrevious, goToNext]);

  if (imageList.length === 0) {
    return (
      <div className="w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center">
        <img
          src="https://via.placeholder.com/600x600?text=Sin+Imagen"
          alt="Sin imagen disponible"
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!hasMultipleImages) return;
    setIsDragging(true);
    setStartX(e.touches[0].clientX);
    setCurrentX(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !hasMultipleImages) return;
    setCurrentX(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!isDragging || !hasMultipleImages) return;

    const deltaX = startX - currentX;
    const minSwipeDistance = 50; 

    if (Math.abs(deltaX) > minSwipeDistance) {
      if (deltaX > 0) {
        goToNext();
      } else {
        goToPrevious();
      }
    }

    setIsDragging(false);
    setStartX(0);
    setCurrentX(0);
  };

  const dragOffset = isDragging ? currentX - startX : 0;

  return (
    <div className="space-y-4">
      <div
        ref={containerRef}
        className="relative w-full h-96 bg-white rounded-lg overflow-hidden group cursor-grab active:cursor-grabbing"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          transform: isDragging ? `translateX(${dragOffset}px)` : 'translateX(0)',
          transition: isDragging ? 'none' : 'transform 0.3s ease-out'
        }}
      >
        <img
          src={currentImage}
          alt={`${productName} - imagen ${currentImageIndex + 1}`}
          className="w-full h-full object-contain select-none cursor-zoom-in"
          onError={(e) => {
            e.currentTarget.src = 'https://via.placeholder.com/600x600?text=Producto';
          }}
          draggable={false}
          onClick={() => setIsFullscreen(true)}
        />

        {hasMultipleImages && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
              aria-label="Imagen anterior"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={goToNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
              aria-label="Imagen siguiente"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
              {imageList.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImageIndex(idx)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    idx === currentImageIndex
                      ? 'bg-white w-8'
                      : 'bg-white/50 hover:bg-white/75'
                  }`}
                  aria-label={`Ver imagen ${idx + 1}`}
                />
              ))}
            </div>
          </>
        )}

        <button
          onClick={() => setIsFullscreen(true)}
          className="absolute top-3 right-3 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
          aria-label="Ver en pantalla completa"
        >
          <ZoomIn className="w-5 h-5" />
        </button>
      </div>

      {hasMultipleImages && (
        <div className="grid grid-cols-5 gap-2">
          {imageList.slice(0, 5).map((imagen, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentImageIndex(idx)}
              className={`relative h-20 bg-white rounded-lg overflow-hidden border-2 transition-all ${
                idx === currentImageIndex
                  ? 'border-[#003c6f] ring-2 ring-[#003c6f]/20'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <img
                src={imagen}
                alt={`${productName} miniatura ${idx + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = 'https://via.placeholder.com/100x100?text=Img';
                }}
              />
            </button>
          ))}
        </div>
      )}

      {isFullscreen && (
        <div 
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center"
          onClick={() => setIsFullscreen(false)}
        >
          <button
            onClick={() => setIsFullscreen(false)}
            className="absolute top-4 right-4 text-white hover:text-gray-300 p-2 z-50"
            aria-label="Cerrar"
          >
            <X className="w-8 h-8" />
          </button>

          {hasMultipleImages && (
            <div className="absolute top-4 left-4 text-white text-sm bg-black/50 px-3 py-1 rounded-full">
              {currentImageIndex + 1} / {imageList.length}
            </div>
          )}

          <div 
            className="relative max-w-[90vw] max-h-[90vh] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={currentImage}
              alt={`${productName} - imagen ${currentImageIndex + 1}`}
              className="max-w-full max-h-[90vh] object-contain"
              onError={(e) => {
                e.currentTarget.src = 'https://via.placeholder.com/600x600?text=Producto';
              }}
            />
          </div>

          {hasMultipleImages && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); goToPrevious(); }}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition-colors"
                aria-label="Imagen anterior"
              >
                <ChevronLeft className="w-8 h-8" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); goToNext(); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition-colors"
                aria-label="Imagen siguiente"
              >
                <ChevronRight className="w-8 h-8" />
              </button>
            </>
          )}

          {hasMultipleImages && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {imageList.map((img, idx) => (
                <button
                  key={idx}
                  onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(idx); }}
                  className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                    idx === currentImageIndex
                      ? 'border-white'
                      : 'border-transparent opacity-50 hover:opacity-75'
                  }`}
                >
                  <img
                    src={img}
                    alt={`Miniatura ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
