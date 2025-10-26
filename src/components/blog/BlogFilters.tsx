import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useTranslation } from '@/hooks/useTranslation';

interface BlogFiltersProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  categories: string[];
}

export function BlogFilters({
  selectedCategory,
  onCategoryChange,
  searchQuery,
  onSearchChange,
  categories,
}: BlogFiltersProps) {
  const { t } = useTranslation();

  return (
    <Card>
      <CardContent>
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder={t('blog.searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm"
            />
          </div>
        </div>

        <div>
          <h3 className="font-medium text-sm text-gray-800 mb-3 uppercase tracking-wide">
            {t('blog.allCategories')}
          </h3>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onCategoryChange('all')}
              className={
                selectedCategory === 'all'
                  ? 'bg-cyan-500 hover:bg-cyan-600 text-white'
                  : 'border-gray-300 hover:border-cyan-500 hover:text-cyan-600'
              }
            >
              {t('blog.allCategories')}
            </Button>
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                size="sm"
                onClick={() => onCategoryChange(category)}
                className={
                  selectedCategory === category
                    ? 'bg-cyan-500 hover:bg-cyan-600 text-white'
                    : 'border-gray-300 hover:border-cyan-500 hover:text-cyan-600'
                }
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
