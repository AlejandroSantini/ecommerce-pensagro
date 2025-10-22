'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { useCart } from "@/hooks/useCart";
import { toast } from 'sonner';

// Definición del tipo de producto para la demo
interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
}

// Componente de tarjeta de producto
interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  t: ReturnType<typeof useTranslations>; // Tipo correcto para las traducciones
}

function ProductCard({ product, onAddToCart, t }: ProductCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow flex flex-col h-full">
      
      <div className="h-44 bg-gray-100 flex items-center justify-center p-4 border-b">
        <span className="text-gray-400">Product image</span>
      </div>
      
      <div className="p-4 flex-grow flex flex-col">
        <div className="mb-2">
          <span className="text-xl font-semibold text-gray-900">${product.price.toLocaleString()}</span>
        </div>
        
        <h2 className="text-sm text-gray-700 mb-3 line-clamp-2 h-10">{product.name}</h2>
        
        <p className="text-xs text-gray-500 mb-4 line-clamp-2">{product.description}</p>
        
        <p className="text-xs text-green-600 font-medium mb-3">{t('freeShipping')}</p>
        
        <div className="flex-grow"></div>
        
        <button 
          className="px-4 py-2 bg-[#003c6f] text-white rounded-md hover:bg-[#002b50] transition-colors w-full mt-auto"
          onClick={() => onAddToCart(product)}
        >
          {t('addToCart')}
        </button>
      </div>
    </div>
  );
}

// Productos de muestra para esta página
const DEMO_PRODUCTS = [
  {
    id: 1,
    name: 'Herbicida Premium',
    description: 'Herbicida de alta calidad para control de malezas',
    price: 2500,
    image: '/sample/product1.jpg'
  },
  {
    id: 2,
    name: 'Fertilizante Orgánico',
    description: 'Fertilizante 100% orgánico para cultivos sustentables',
    price: 1800,
    image: '/sample/product2.jpg'
  },
  {
    id: 3,
    name: 'Semilla de Maíz Híbrido',
    description: 'Semillas de maíz de alto rendimiento',
    price: 3200,
    image: '/sample/product3.jpg'
  },
  {
    id: 4,
    name: 'Insecticida Biológico',
    description: 'Control de plagas respetuoso con el medio ambiente',
    price: 2100,
    image: '/sample/product4.jpg'
  },
  {
    id: 5,
    name: 'Kit de Análisis de Suelo',
    description: 'Análisis completo para optimizar tus cultivos',
    price: 4500,
    image: '/sample/product5.jpg'
  },
  {
    id: 6,
    name: 'Riego por Goteo',
    description: 'Sistema eficiente para ahorro de agua',
    price: 3800,
    image: '/sample/product6.jpg'
  }
];

export default function ProductsPage() {
  const t = useTranslations('products');
  const addToCart = useCart((state) => state.addItem);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProducts = DEMO_PRODUCTS.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddToCart = (product: Product) => {
    addToCart({
      id: product.id,
      nombre: product.name,
      precio: product.price,
      imagen: product.image,
      stock: 100 // Valor predeterminado para los productos de muestra
    });
    
    toast.success(t('addedToCart'));
  };

  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-4">{t('title')}</h1>
      <p className="text-gray-600 mb-8">{t('description')}</p>
      
      <div className="mb-8">
        <input
          type="text"
          placeholder={t('searchPlaceholder')}
          className="w-full md:w-80 px-4 py-2 border rounded-lg"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredProducts.length === 0 ? (
          <p className="col-span-full text-center text-gray-500 py-8">{t('noProducts')}</p>
        ) : (
          filteredProducts.map((product) => (
            <ProductCard 
              key={product.id}
              product={product}
              onAddToCart={handleAddToCart}
              t={t}
            />
          ))
        )}
      </div>
    </div>
  );
}