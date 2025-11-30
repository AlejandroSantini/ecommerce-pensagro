import { useRef } from 'react';
import { ChevronLeft, ChevronRight, Clock, User, ArrowRight } from 'lucide-react';
import { Card, CardImage, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { useTranslation } from '@/hooks/useTranslation';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  readTime: string;
  image: string;
  category: string;
  tags: string[];
}

interface BlogCarouselProps {
  posts: BlogPost[];
}

export function BlogCarousel({ posts }: BlogCarouselProps) {
  const { t } = useTranslation();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 350;
      const newScrollLeft = direction === 'left' 
        ? scrollContainerRef.current.scrollLeft - scrollAmount
        : scrollContainerRef.current.scrollLeft + scrollAmount;
      
      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">{t('home.blog.title')}</h2>
            <p className="text-gray-600 mt-2">{t('home.blog.subtitle')}</p>
          </div>
          
          <Link 
            href="/news" 
            className="hidden md:flex items-center text-[#003c6f] hover:text-[#002b50] font-medium transition-colors"
          >
            {t('home.blog.viewAll')}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>

        <div className="relative px-0 md:px-14">
          <button
            onClick={() => scroll('left')}
            className="hidden md:flex absolute -left-2 top-1/2 -translate-y-1/2 z-10 bg-white hover:bg-gray-50 rounded-full p-3 shadow-lg border border-gray-200 transition-all"
            aria-label="Previous"
          >
            <ChevronLeft className="h-6 w-6 text-gray-600" />
          </button>
          
          <button
            onClick={() => scroll('right')}
            className="hidden md:flex absolute -right-2 top-1/2 -translate-y-1/2 z-10 bg-white hover:bg-gray-50 rounded-full p-3 shadow-lg border border-gray-200 transition-all"
            aria-label="Next"
          >
            <ChevronRight className="h-6 w-6 text-gray-600" />
          </button>

          <div 
            ref={scrollContainerRef}
            className="flex gap-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory scroll-smooth pb-4"
          >
            {posts.map((post) => (
              <Link 
                key={post.id} 
                href={`/news/${post.id}`}
                className="flex-none w-[85%] sm:w-[45%] lg:w-[calc(33.333%-1rem)] snap-center"
              >
                <Card className="group h-full cursor-pointer overflow-hidden border-t-4 border-t-[#003c6f]">
                  <CardImage>
                    <div className="relative aspect-[16/9] overflow-hidden bg-gray-50">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="bg-cyan-500 text-white text-sm font-semibold px-3 py-1 rounded-full">
                          {post.category}
                        </span>
                      </div>
                    </div>
                  </CardImage>

                  <CardContent className="flex flex-col">
                    <h3 className="font-medium text-lg text-gray-800 mb-2 group-hover:text-cyan-600 transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {post.excerpt}
                    </p>

                    <div className="flex items-center gap-4 text-sm text-gray-500 mt-auto">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{post.readTime}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        <span className="truncate">{post.author}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* View All Link - Mobile Only */}
        <div className="md:hidden mt-6 text-center">
          <Link 
            href="/news" 
            className="inline-flex items-center text-[#003c6f] hover:text-[#002b50] font-medium transition-colors"
          >
            {t('home.blog.viewAll')}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
