import { Hero } from '@/components/home/Hero';
import { FeatureSection } from '@/components/home/FeatureSection';
import { ProductCarousel } from '@/components/home/ProductCarousel';
import { CategoryGrid } from '@/components/home/CategoryGrid';
import { useTranslation } from '@/hooks/useTranslation';

// Datos de muestra para productos destacados
const SAMPLE_PRODUCTS = [
  {
    id: 1,
    nombre: 'Electrificador PEL 86.000W',
    descripcion: 'Electrificador de alto rendimiento para alambrados ganaderos. Ideal para grandes extensiones.',
    precio: 125000,
    sku: 'PEL-86000',
    stock: 15,
    iva: 21,
    destacado: true,
    activo: true,
    imagen: '/sample/product1.jpg',
    createdAt: '2023-01-01',
    updatedAt: '2023-01-01'
  },
  {
    id: 2,
    nombre: 'Varillas Fibra de Vidrio 1.20mts',
    descripcion: 'Varillas de fibra de vidrio 10mm. Resistentes y duraderas para cercados eléctricos.',
    precio: 1200,
    sku: 'VAR-120',
    stock: 200,
    iva: 21,
    destacado: true,
    activo: true,
    imagen: '/sample/product2.jpg',
    createdAt: '2023-01-01',
    updatedAt: '2023-01-01'
  },
  {
    id: 3,
    nombre: 'Control Remoto + Detector Fallas PEL',
    descripcion: 'Control remoto con detector de fallas para electrificadores. Facilita el mantenimiento del alambrado.',
    precio: 45000,
    sku: 'CTRL-PEL',
    stock: 25,
    iva: 21,
    destacado: true,
    activo: true,
    imagen: '/sample/product3.jpg',
    createdAt: '2023-01-01',
    updatedAt: '2023-01-01'
  },
  {
    id: 4,
    nombre: 'Carretel + Junta Carretel PensAgro',
    descripcion: 'Sistema de carretel para alambrados móviles. Rentabilidad y simplicidad sin degradar el suelo.',
    precio: 28000,
    sku: 'CAR-PA',
    stock: 35,
    iva: 21,
    destacado: true,
    activo: true,
    imagen: '/sample/product4.jpg',
    createdAt: '2023-01-01',
    updatedAt: '2023-01-01'
  },
  {
    id: 5,
    nombre: 'Bebedero Plástico para Hacienda',
    descripcion: 'Bebedero resistente para ganado con sistema de flotante. Durabilidad garantizada.',
    precio: 15500,
    sku: 'BEB-001',
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
    nombre: 'Hilo Electro Trenzado 200mts',
    descripcion: 'Hilo de alta conductividad para cercados eléctricos. Resistente a condiciones extremas.',
    precio: 8900,
    sku: 'HIL-200',
    stock: 80,
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
    nombre: 'Electrificadores',
    descripcion: 'Boyeros eléctricos de alta potencia para cercados ganaderos',
    slug: 'electrificadores',
    activo: true,
    orden: 1,
    createdAt: '2023-01-01',
    updatedAt: '2023-01-01'
  },
  {
    id: 2,
    nombre: 'Varillas y Postes',
    descripcion: 'Varillas de fibra de vidrio y postes para alambrados eléctricos',
    slug: 'varillas-postes',
    activo: true,
    orden: 2,
    createdAt: '2023-01-01',
    updatedAt: '2023-01-01'
  },
  {
    id: 3,
    nombre: 'Alambrados Eléctricos',
    descripcion: 'Hilos, cintas y cables conductores para cercados',
    slug: 'alambrados',
    activo: true,
    orden: 3,
    createdAt: '2023-01-01',
    updatedAt: '2023-01-01'
  },
  {
    id: 4,
    nombre: 'Accesorios y Herrajes',
    descripcion: 'Aisladores, tensores, manijas y accesorios para alambrados',
    slug: 'accesorios',
    activo: true,
    orden: 4,
    createdAt: '2023-01-01',
    updatedAt: '2023-01-01'
  },
  {
    id: 5,
    nombre: 'Bebederos y Aguadas',
    descripcion: 'Sistemas de agua para hacienda vacuna, ovina y equina',
    slug: 'bebederos',
    activo: true,
    orden: 5,
    createdAt: '2023-01-01',
    updatedAt: '2023-01-01'
  },
  {
    id: 6,
    nombre: 'Carretes Móviles',
    descripcion: 'Sistemas de alambrado móvil para pastoreo rotativo',
    slug: 'carretes',
    activo: true,
    orden: 6,
    createdAt: '2023-01-01',
    updatedAt: '2023-01-01'
  }
];

export default function Home() {
  const { t } = useTranslation();
  const featuredProducts = SAMPLE_PRODUCTS;
  const categories = SAMPLE_CATEGORIES.filter(cat => cat.activo);

  return (
    <div className="min-h-screen">
      <Hero />
      <FeatureSection />
      
      <div className="py-4 bg-gray-50">
        {featuredProducts.length > 0 && (
          <ProductCarousel 
            title={t('home.featuredProducts.title')} 
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
