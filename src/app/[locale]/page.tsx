import { Suspense } from 'react';
import { getTranslations } from 'next-intl/server';

import { productService } from '@/services/productService';
import { categoryService } from '@/services/categoryService';

import { Hero } from '@/components/home/Hero';
import { FeatureSection } from '@/components/home/FeatureSection';
import { ProductCarousel } from '@/components/home/ProductCarousel';
import { CategoryGrid } from '@/components/home/CategoryGrid';

// Datos de muestra para productos
const SAMPLE_PRODUCTS = [
  {
    id: 1,
    nombre: 'Herbicida Premium',
    descripcion: 'Herbicida de alta calidad para control de malezas',
    precio: 2500,
    sku: 'HERB-001',
    stock: 100,
    iva: 21,
    destacado: true,
    activo: true,
    imagen: '/sample/product1.jpg',
    createdAt: '2023-01-01',
    updatedAt: '2023-01-01'
  },
  {
    id: 2,
    nombre: 'Fertilizante Orgánico',
    descripcion: 'Fertilizante 100% orgánico para cultivos sustentables',
    precio: 1800,
    sku: 'FERT-001',
    stock: 150,
    iva: 21,
    destacado: true,
    activo: true,
    imagen: '/sample/product2.jpg',
    createdAt: '2023-01-01',
    updatedAt: '2023-01-01'
  },
  {
    id: 3,
    nombre: 'Semilla de Maíz Híbrido',
    descripcion: 'Semillas de maíz de alto rendimiento',
    precio: 3200,
    sku: 'SEM-001',
    stock: 80,
    iva: 10.5,
    destacado: true,
    activo: true,
    imagen: '/sample/product3.jpg',
    createdAt: '2023-01-01',
    updatedAt: '2023-01-01'
  },
  {
    id: 4,
    nombre: 'Insecticida Biológico',
    descripcion: 'Control de plagas respetuoso con el medio ambiente',
    precio: 2100,
    sku: 'INS-001',
    stock: 120,
    iva: 21,
    destacado: true,
    activo: true,
    imagen: '/sample/product4.jpg',
    createdAt: '2023-01-01',
    updatedAt: '2023-01-01'
  }
];

// Datos de muestra para categorías
const SAMPLE_CATEGORIES = [
  {
    id: 1,
    nombre: 'Herbicidas',
    descripcion: 'Productos para el control de malezas',
    slug: 'herbicidas',
    activo: true,
    orden: 1,
    createdAt: '2023-01-01',
    updatedAt: '2023-01-01'
  },
  {
    id: 2,
    nombre: 'Fertilizantes',
    descripcion: 'Nutrientes para tus cultivos',
    slug: 'fertilizantes',
    activo: true,
    orden: 2,
    createdAt: '2023-01-01',
    updatedAt: '2023-01-01'
  },
  {
    id: 3,
    nombre: 'Semillas',
    descripcion: 'Semillas de alta calidad para diferentes cultivos',
    slug: 'semillas',
    activo: true,
    orden: 3,
    createdAt: '2023-01-01',
    updatedAt: '2023-01-01'
  },
  {
    id: 4,
    nombre: 'Insecticidas',
    descripcion: 'Control de plagas para tus cultivos',
    slug: 'insecticidas',
    activo: true,
    orden: 4,
    createdAt: '2023-01-01',
    updatedAt: '2023-01-01'
  }
];

async function HomePage() {
  const t = await getTranslations('home');
  
  // Intentar obtener datos de la API, usar datos de muestra si falla
  let featuredProducts;
  let categories;
  
  try {
    // Obtener productos destacados
    featuredProducts = await productService.getAll({ 
      destacado: true,
      activo: true
    });
    
    // Obtener categorías
    categories = await categoryService.getAll();
  } catch (error) {
    console.error('Error fetching data from API:', error);
    // Usar datos de muestra en caso de error
    featuredProducts = SAMPLE_PRODUCTS;
    categories = SAMPLE_CATEGORIES;
  }
  
  // Filtrar solo categorías activas
  const activeCategories = categories.filter(cat => cat.activo);

  return (
    <div className="min-h-screen">
      <Hero />
      <FeatureSection />
      
      <div className="py-4 bg-gray-50">
        <ProductCarousel 
          title={t('featuredProducts.title')} 
          products={featuredProducts.slice(0, 12)} 
        />
        
        <div className="py-6">
          <CategoryGrid categories={activeCategories.slice(0, 6)} />
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomePage />
    </Suspense>
  );
}