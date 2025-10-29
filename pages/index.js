import { Hero } from '@/components/home/Hero';
import { FeatureSection } from '@/components/home/FeatureSection';
import { ProductCarousel } from '@/components/home/ProductCarousel';
import { CategoryGrid } from '@/components/home/CategoryGrid';
import { BlogCarousel } from '@/components/home/BlogCarousel';
import { WelcomeModal } from '@/components/home/WelcomeModal';
import { useTranslation } from '@/hooks/useTranslation';

// Datos de muestra para productos destacados
const SAMPLE_PRODUCTS = [
  {
    id: 1,
    nombre: 'Boyero Electrificador PEL 418',
    descripcion: 'Boyero eléctrico de alto rendimiento para cercas de hasta 200km',
    precio: 85000,
    sku: 'BOY-418',
    stock: 15,
    iva: 21,
    destacado: true,
    activo: true,
    imagen: '/mock/pel 418.png',
    createdAt: '2023-01-01',
    updatedAt: '2023-01-01'
  },
  {
    id: 2,
    nombre: 'Boyero Electrificador PEL S1000',
    descripcion: 'Boyero eléctrico solar de alta potencia para cercas extensas',
    precio: 125000,
    sku: 'BOY-S1000',
    stock: 10,
    iva: 21,
    destacado: true,
    activo: true,
    imagen: '/mock/PEL S1000 (F).png',
    createdAt: '2023-01-01',
    updatedAt: '2023-01-01'
  },
  {
    id: 3,
    nombre: 'Boyero Electrificador 86000W',
    descripcion: 'Boyero de máxima potencia para cercas de gran extensión',
    precio: 180000,
    sku: 'BOY-86000',
    stock: 8,
    iva: 21,
    destacado: true,
    activo: true,
    imagen: '/mock/86000 w portada.png',
    createdAt: '2023-01-01',
    updatedAt: '2023-01-01'
  },
  {
    id: 4,
    nombre: 'Varillas Fibra de Vidrio x12',
    descripcion: 'Pack de 12 varillas de fibra de vidrio para sostén de cerca eléctrica',
    precio: 28000,
    sku: 'VAR-12',
    stock: 40,
    iva: 21,
    destacado: false,
    activo: true,
    imagen: '/mock/varillas_12.png',
    createdAt: '2023-01-01',
    updatedAt: '2023-01-01'
  },
  {
    id: 5,
    nombre: 'Carretel Standard con Manija',
    descripcion: 'Carretel portátil para enrollar y transportar cable de cerca',
    precio: 15500,
    sku: 'CARR-001',
    stock: 25,
    iva: 21,
    destacado: false,
    activo: true,
    imagen: '/mock/carrretel con manija.png',
    createdAt: '2023-01-01',
    updatedAt: '2023-01-01'
  },
  {
    id: 6,
    nombre: 'Control Remoto para Boyero',
    descripcion: 'Control remoto inalámbrico para activar/desactivar boyero a distancia',
    precio: 35000,
    sku: 'REM-001',
    stock: 15,
    iva: 21,
    destacado: false,
    activo: true,
    imagen: '/mock/PEL_REMOTE_YELLOW_A_JPG_BLANCO.jpg',
    createdAt: '2023-01-01',
    updatedAt: '2023-01-01'
  },
  {
    id: 7,
    nombre: 'Super Kit Jeringa Telescópica',
    descripcion: 'Kit completo de jeringa telescópica para tratamiento veterinario',
    precio: 48000,
    sku: 'JER-001',
    stock: 12,
    iva: 21,
    destacado: true,
    activo: true,
    imagen: '/mock/Super_Kit_Jeringa_Telescopica.jpg',
    createdAt: '2023-01-01',
    updatedAt: '2023-01-01'
  },
  {
    id: 8,
    nombre: 'Manija Aislante para Cerca',
    descripcion: 'Manija con mango aislante para apertura segura de cerca eléctrica',
    precio: 4500,
    sku: 'MAN-001',
    stock: 50,
    iva: 21,
    destacado: false,
    activo: true,
    imagen: '/mock/manija .jpg',
    createdAt: '2023-01-01',
    updatedAt: '2023-01-01'
  }
];

// Datos de muestra para categorías
const SAMPLE_CATEGORIES = [
  {
    id: 1,
    nombre: 'Boyeros Eléctricos',
    descripcion: 'Electrificadores de alta potencia para cercados ganaderos',
    slug: 'boyeros',
    imagen: '/mock/86000 w portada.png',
    activo: true,
    orden: 1,
    createdAt: '2023-01-01',
    updatedAt: '2023-01-01'
  },
  {
    id: 2,
    nombre: 'Varillas y Postes',
    descripcion: 'Varillas de fibra de vidrio para alambrados eléctricos',
    slug: 'varillas-postes',
    imagen: '/mock/varillas_12.png',
    activo: true,
    orden: 2,
    createdAt: '2023-01-01',
    updatedAt: '2023-01-01'
  },
  {
    id: 3,
    nombre: 'Carretes y Accesorios',
    descripcion: 'Sistemas de carretel para alambrados móviles',
    slug: 'carretes',
    imagen: '/mock/carrretel con manija.png',
    activo: true,
    orden: 3,
    createdAt: '2023-01-01',
    updatedAt: '2023-01-01'
  },
  {
    id: 4,
    nombre: 'Control y Medición',
    descripcion: 'Controles remotos y sistemas de medición para cercas',
    slug: 'control',
    imagen: '/mock/PEL_REMOTE_YELLOW_A_JPG_BLANCO.jpg',
    activo: true,
    orden: 4,
    createdAt: '2023-01-01',
    updatedAt: '2023-01-01'
  },
  {
    id: 5,
    nombre: 'Sanidad y Tratamiento',
    descripcion: 'Equipamiento veterinario y de tratamiento animal',
    slug: 'sanidad',
    imagen: '/mock/Super_Kit_Jeringa_Telescopica.jpg',
    activo: true,
    orden: 5,
    createdAt: '2023-01-01',
    updatedAt: '2023-01-01'
  },
  {
    id: 6,
    nombre: 'Manijas y Conectores',
    descripcion: 'Manijas aislantes y conectores para cercas eléctricas',
    slug: 'manijas',
    imagen: '/mock/manija .jpg',
    activo: true,
    orden: 6,
    createdAt: '2023-01-01',
    updatedAt: '2023-01-01'
  }
];

const SAMPLE_BLOG_POSTS = [
  {
    id: 'guia-cerca-electrica',
    title: 'Guía completa para instalar tu primera cerca eléctrica',
    excerpt: 'Instalar una cerca eléctrica puede parecer complicado, pero con la guía correcta es un proceso sencillo. Aprende paso a paso cómo hacerlo de manera segura y eficiente.',
    author: 'Equipo Pensagro',
    date: '15 de Enero, 2025',
    readTime: '8 min',
    image: '/mock/pel%20418.png',
    category: 'Instalación',
    tags: ['instalación', 'principiantes', 'electrificadores', '+1'],
  },
  {
    id: 'ventajas-electrificadores-solares',
    title: '5 ventajas de usar electrificadores solares en tu campo',
    excerpt: 'La energía solar está revolucionando el agro. Descubre por qué un electrificador solar no solo es una opción ecológica, sino también más rentable y eficiente.',
    author: 'Juan Carlos Rivas',
    date: '10 de Enero, 2025',
    readTime: '6 min',
    image: '/mock/PEL%20S1000%20(F).png',
    category: 'Destacado',
    tags: ['energía solar', 'electrificadores', 'sostenibilidad', '+1'],
  },
  {
    id: 'sistema-pesaje-ganado',
    title: 'Cómo elegir el sistema de pesaje adecuado para tu ganado',
    excerpt: 'Pesar tu ganado es clave para la rentabilidad. Un buen sistema de pesaje te permite tomar decisiones informadas sobre nutrición, salud y ventas.',
    author: 'Equipo Pensagro',
    date: '5 de Enero, 2025',
    readTime: '7 min',
    image: '/mock/86000%20w%20portada.png',
    category: 'Destacado',
    tags: ['pesaje', 'ganado', 'tecnología', '+1'],
  },
  {
    id: 'rentabilidad-cerca-electrica',
    title: 'Cómo calcular la rentabilidad de tu cerca eléctrica',
    excerpt: 'Una cerca eléctrica es una inversión que debe justificarse económicamente. Aprende a calcular el retorno de inversión y optimizar tus costos.',
    author: 'María Elena Rodríguez',
    date: '28 de Diciembre, 2024',
    readTime: '10 min',
    image: '/mock/varillas_12.png',
    category: 'Destacado',
    tags: ['rentabilidad', 'ROI', 'costos', '+1'],
  }
];

export default function Home() {
  const { t } = useTranslation();
  const featuredProducts = SAMPLE_PRODUCTS;
  const categories = SAMPLE_CATEGORIES.filter(cat => cat.activo);
  const blogPosts = SAMPLE_BLOG_POSTS;

  return (
    <div className="min-h-screen">
      <WelcomeModal />
      <Hero />
      
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
      
      {blogPosts.length > 0 && (
        <BlogCarousel posts={blogPosts} />
      )}
      
      <FeatureSection />
    </div>
  );
}
