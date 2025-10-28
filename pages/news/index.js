import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import BlogCard from '@/components/blog/BlogCard';
import { BlogFilters } from '@/components/blog/BlogFilters';
import { useTranslation } from '@/hooks/useTranslation';

const BLOG_POSTS = [
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
  },
  {
    id: 'manejo-sanitario-eficiente',
    title: 'Manejo sanitario eficiente: protocolos y herramientas esenciales',
    excerpt: 'Un programa sanitario eficiente es la base de una ganadería rentable. Conoce los protocolos esenciales y las herramientas que facilitan el trabajo.',
    author: 'Dr. Carlos Mendoza',
    date: '20 de Diciembre, 2024',
    readTime: '12 min',
    image: '/mock/carrretel%20con%20manija.png',
    category: 'Destacado',
    tags: ['sanidad', 'protocolos', 'jeringas', '+1'],
  },
  {
    id: 'pastoreo-rotativo',
    title: 'Pastoreo rotativo: maximiza tus pasturas naturales',
    excerpt: 'El pastoreo rotativo bien implementado puede aumentar la carga animal hasta un 40% mientras mejora la salud del suelo. Descubre cómo aplicarlo.',
    author: 'Ing. Agr. Roberto Silva',
    date: '15 de Diciembre, 2024',
    readTime: '9 min',
    image: '/mock/Carretel_foto_alambre_1.jpg',
    category: 'Destacado',
    tags: ['pastoreo rotativo', 'pasturas', 'productividad', '+1'],
  },
];

const CATEGORIES = ['Instalación', 'Destacado'];

export default function NewsPage() {
  const { t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPosts = BLOG_POSTS.filter((post) => {
    const matchesCategory =
      selectedCategory === 'all' || post.category === selectedCategory;
    const matchesSearch =
      searchQuery === '' ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="relative h-[300px] bg-gradient-to-r from-[#003c6f] to-[#005a9c] overflow-hidden">
        <div className="absolute inset-0 bg-[url('/mock/pel\ 418.png')] bg-cover bg-center opacity-10" />
        <div className="relative container mx-auto px-4 h-full flex flex-col justify-center items-center text-center text-white">
          <div className="flex items-center justify-center mb-4">
            <Sparkles className="h-8 w-8 mr-2" />
            <h1 className="text-5xl md:text-6xl font-bold">{t('blog.title')}</h1>
          </div>
          <p className="text-xl md:text-2xl max-w-3xl">
            {t('blog.subtitle')}
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <BlogFilters
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            categories={CATEGORIES}
          />

          <div className="mb-6">
            <p className="text-gray-600">
              <span className="font-semibold">{filteredPosts.length}</span>{' '}
              {filteredPosts.length === 1 ? t('blog.resultsSingle') : t('blog.resultsPlural')}
            </p>
          </div>

          {filteredPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post) => (
                <BlogCard key={post.id} {...post} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg">
                {t('blog.noResults')}
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
