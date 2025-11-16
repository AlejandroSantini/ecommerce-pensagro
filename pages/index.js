import { useState, useEffect } from 'react';
import { Hero } from '@/components/home/Hero';
import { FeatureSection } from '@/components/home/FeatureSection';
import { ProductCarousel } from '@/components/home/ProductCarousel';
import { CategoryGrid } from '@/components/home/CategoryGrid';
import { BlogCarousel } from '@/components/home/BlogCarousel';
import { WelcomeModal } from '@/components/home/WelcomeModal';
import { useTranslation } from '@/hooks/useTranslation';
import { productService } from '@/services/productService';
import { categoryService } from '@/services/categoryService';

// Datos mock solo para el blog
const INITIAL_BLOG_POSTS = [
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
  }
];

export default function Home() {
  const { t } = useTranslation();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [blogPosts] = useState(INITIAL_BLOG_POSTS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        try {
          const productsResponse = await productService.getAll({ destacado: true, activo: true, limit: 12 });
          if (productsResponse.products.length > 0) {
            setFeaturedProducts(productsResponse.products);
          }
        } catch (productError) {
          console.warn('No se pudieron cargar productos:', productError.message);
        }

        try {
          const categoriesData = await categoryService.getAll();
          if (categoriesData.length > 0) {
            setCategories(categoriesData.filter(cat => cat.activo).slice(0, 6));
          }
        } catch (categoryError) {
          console.warn('No se pudieron cargar categorías:', categoryError.message);
        }
      } catch (err) {
        console.error('Error loading home data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <div className="min-h-screen">
      <WelcomeModal />
      <Hero />

      <div className="py-4 bg-gray-50">
        {featuredProducts.length > 0 && (
          <ProductCarousel
            title={t('home.featuredProducts.title')}
            products={featuredProducts}
          />
        )}

        <div className="py-6">
          {categories.length > 0 && (
            <CategoryGrid categories={categories} />
          )}
        </div>
      </div>

      {blogPosts.length > 0 && (
        <BlogCarousel posts={blogPosts} />
      )}

      <FeatureSection />

      {loading && (
        <div className="fixed bottom-4 right-4 bg-[#003c6f] text-white px-4 py-2 rounded-lg shadow-lg">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            <span className="text-sm">Actualizando datos...</span>
          </div>
        </div>
      )}

      {error && (
        <div className="fixed bottom-4 left-4 bg-yellow-500 text-white px-4 py-2 rounded-lg shadow-lg max-w-sm">
          <p className="text-sm">{error}</p>
        </div>
      )}
    </div>
  );
}