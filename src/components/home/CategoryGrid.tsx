'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import type { Category } from '@/types/category';

interface CategoryGridProps {
  categories: Category[];
}

export function CategoryGrid({ categories }: CategoryGridProps) {
  const t = useTranslations('home');
  
  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-6">{t('categories.title')}</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Link 
              key={category.slug}
              href={`/categories/${category.slug}`}
              className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="aspect-[16/9] bg-gray-100 flex items-center justify-center relative">
                {category.imagen ? (
                  <div className="relative w-full h-full">
                    <img 
                      src={category.imagen} 
                      alt={category.nombre} 
                      className="object-cover w-full h-full"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.parentElement!.innerHTML = '<span class="text-gray-400">Sin imagen</span>';
                      }}
                    />
                  </div>
                ) : (
                  <span className="text-gray-400">Sin imagen</span>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              
              <div className="p-6">
                <h3 className="font-semibold text-lg mb-2">{category.nombre}</h3>
                <p className="text-gray-600 text-sm">{category.descripcion || ''}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}