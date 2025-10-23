'use client';

import Image from 'next/image';
import { Tag } from 'lucide-react';
import { useState } from 'react';
import type { Category } from '@/types/category';

interface CategoryCardProps {
  category: Category;
}

export function CategoryCard({ category }: CategoryCardProps) {
  const [imageError, setImageError] = useState(false);
  
  return (
    <div className="flex flex-col h-full bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
      <div className="aspect-[16/9] bg-gray-50 relative">
        {category.imagen && !imageError ? (
          <Image 
            src={category.imagen} 
            alt={category.nombre} 
            fill
            className="object-cover"
            onError={() => setImageError(true)}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Tag size={32} className="text-gray-300" />
          </div>
        )}
        
        <div className="absolute top-0 left-0 w-full h-1 bg-[#003c6f]"></div>
      </div>
      
      <div className="p-5 flex-grow">
        <h3 className="font-medium text-lg text-gray-800 mb-2">{category.nombre}</h3>
        {category.descripcion && (
          <p className="text-gray-600 text-sm line-clamp-2">{category.descripcion}</p>
        )}
      </div>
    </div>
  );
}