import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ProductImageCarouselProps {
  images: string[];
  productName: string;
  mainImage?: string;
}

export function ProductImageCarousel({ images, productName, mainImage }: ProductImageCarouselProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const imageList = images && images.length > 0 ? images : mainImage ? [mainImage] : [];
  
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

  const currentImage = imageList[currentImageIndex];
  const hasMultipleImages = imageList.length > 1;

  const goToPrevious = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? imageList.length - 1 : prev - 1
    );
  };

  const goToNext = () => {
    setCurrentImageIndex((prev) => 
      prev === imageList.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <div className="space-y-4">
      <div className="relative w-full h-96 bg-white rounded-lg overflow-hidden group">
        <img
          src={currentImage}
          alt={`${productName} - imagen ${currentImageIndex + 1}`}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = 'https://via.placeholder.com/600x600?text=Producto';
          }}
        />
        
        {hasMultipleImages && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Imagen anterior"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={goToNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Imagen siguiente"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
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
    </div>
  );
}
