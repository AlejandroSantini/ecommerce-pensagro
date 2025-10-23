import { Hero } from '@/components/home/Hero';
import { FeatureSection } from '@/components/home/FeatureSection';
import { ProductCarousel } from '@/components/home/ProductCarousel';
import { CategoryGrid } from '@/components/home/CategoryGrid';

// Datos de muestra para productos destacados
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
  },
  {
    id: 5,
    nombre: 'Kit de Análisis de Suelo',
    descripcion: 'Análisis completo para optimizar tus cultivos',
    precio: 4500,
    sku: 'KIT-001',
    stock: 45,
    iva: 21,
    destacado: true,
    activo: true,
    imagen: '/sample/product5.jpg',
    createdAt: '2023-01-01',
    updatedAt: '2023-01-01'
  },
  {
    id: 6,
    nombre: 'Sistema de Riego por Goteo',
    descripcion: 'Sistema eficiente para ahorro de agua',
    precio: 3800,
    sku: 'RIE-001',
    stock: 30,
    iva: 21,
    destacado: true,
    activo: true,
    imagen: '/sample/product6.jpg',
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
  },
  {
    id: 5,
    nombre: 'Herramientas',
    descripcion: 'Equipos y herramientas para el campo',
    slug: 'herramientas',
    activo: true,
    orden: 5,
    createdAt: '2023-01-01',
    updatedAt: '2023-01-01'
  },
  {
    id: 6,
    nombre: 'Sistemas de Riego',
    descripcion: 'Soluciones de irrigación eficientes',
    slug: 'sistemas-riego',
    activo: true,
    orden: 6,
    createdAt: '2023-01-01',
    updatedAt: '2023-01-01'
  }
];

export default function Home() {
  const featuredProducts = SAMPLE_PRODUCTS;
  const categories = SAMPLE_CATEGORIES.filter(cat => cat.activo);

  return (
    <div className="min-h-screen">
      <Hero />
      <FeatureSection />
      
      <div className="py-4 bg-gray-50">
        {featuredProducts.length > 0 && (
          <ProductCarousel 
            title="Productos Destacados" 
            products={featuredProducts.slice(0, 12)} 
          />
        )}
        
        <div className="py-6">
          {categories.length > 0 && (
            <CategoryGrid categories={categories.slice(0, 6)} />
          )}
        </div>
      </div>
    </div>
  );
}
