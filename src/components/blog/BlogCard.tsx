import Link from 'next/link';
import { Clock, User, ArrowRight } from 'lucide-react';
import { Card, CardImage, CardContent } from '@/components/ui/card';
import { useTranslation } from '@/hooks/useTranslation';

interface BlogCardProps {
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

export default function BlogCard({
  id,
  title,
  excerpt,
  author,
  date,
  readTime,
  image,
  category,
  tags,
}: BlogCardProps) {
  const { t } = useTranslation();

  return (
    <Link href={`/news/${id}`} className="block">
      <Card className="group h-full cursor-pointer">
        <div className="absolute top-0 left-0 w-full h-1 bg-[#003c6f] z-10"></div>

        <CardImage>
          <div className="relative aspect-[16/9] overflow-hidden bg-gray-50">
            <img
              src={image}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
            <div className="absolute top-4 left-4">
              <span className="bg-cyan-500 text-white text-sm font-semibold px-3 py-1 rounded-full">
                {category}
              </span>
            </div>
          </div>
        </CardImage>

        <CardContent className="flex flex-col h-full">
          <h3 className="font-medium text-lg text-gray-800 mb-2 group-hover:text-cyan-600 transition-colors line-clamp-2">
            {title}
          </h3>
          
          <p className="text-gray-600 text-sm mb-4 flex-grow line-clamp-3">
            {excerpt}
          </p>

          <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
            <div className="flex items-center gap-1">
              <User className="h-4 w-4" />
              <span>{author}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{readTime}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
              >
                #{tag}
              </span>
            ))}
            {tags.length > 3 && (
              <span className="text-xs text-gray-500 px-2 py-1">
                {tags[tags.length - 1]}
              </span>
            )}
          </div>

          <div className="flex items-center text-cyan-600 font-medium group-hover:gap-2 transition-all">
            <span>{t('blog.readMore')}</span>
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
