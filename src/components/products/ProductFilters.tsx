'use client';

import { useState } from 'react';
import { ChevronDown, X, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/hooks/useTranslation';

interface Category {
  id: number;
  nombre: string;
  subcategorias?: Category[];
}

interface ProductFiltersProps {
  categories: Category[];
  selectedCategories: number[];
  selectedSubcategories: number[];
  showCombos: boolean;
  onCategoriesChange: (categoryIds: number[]) => void;
  onSubcategoriesChange: (subcategoryIds: number[]) => void;
  onCombosChange: (show: boolean) => void;
  onClearFilters: () => void;
  isMobile?: boolean;
  isOpen?: boolean;
  onClose?: () => void;
}

export function ProductFilters({
  categories,
  selectedCategories,
  selectedSubcategories,
  showCombos,
  onCategoriesChange,
  onSubcategoriesChange,
  onCombosChange,
  onClearFilters,
  isMobile = false,
  isOpen = false,
  onClose,
}: ProductFiltersProps) {
  const { t } = useTranslation();
  const [expandedCategories, setExpandedCategories] = useState<number[]>(selectedCategories);

  const toggleCategoryExpansion = (categoryId: number) => {
    setExpandedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleCategoryToggle = (categoryId: number) => {
    const isSelected = selectedCategories.includes(categoryId);
    const category = categories.find(c => c.id === categoryId);
    
    if (isSelected) {
      onCategoriesChange(selectedCategories.filter(id => id !== categoryId));
      if (category?.subcategorias) {
        const subcategoryIds = category.subcategorias.map(s => s.id);
        onSubcategoriesChange(selectedSubcategories.filter(id => !subcategoryIds.includes(id)));
      }
    } else {
      onCategoriesChange([...selectedCategories, categoryId]);
      if (category?.subcategorias && category.subcategorias.length > 0) {
        if (!expandedCategories.includes(categoryId)) {
          setExpandedCategories([...expandedCategories, categoryId]);
        }
      }
    }
  };

  const handleSubcategoryToggle = (categoryId: number, subcategoryId: number) => {
    const isSelected = selectedSubcategories.includes(subcategoryId);
    
    if (isSelected) {
      onSubcategoriesChange(selectedSubcategories.filter(id => id !== subcategoryId));
    } else {
      if (!selectedCategories.includes(categoryId)) {
        onCategoriesChange([...selectedCategories, categoryId]);
      }
      onSubcategoriesChange([...selectedSubcategories, subcategoryId]);
    }
  };

  const hasActiveFilters = selectedCategories.length > 0 || selectedSubcategories.length > 0 || showCombos;
  
  const selectedCategoryObjs = categories.filter(c => 
    selectedCategories.includes(c.id) && 
    !c.subcategorias?.some(s => selectedSubcategories.includes(s.id))
  );
  const selectedSubcategoryObjs = categories.flatMap(c => 
    c.subcategorias?.filter(s => selectedSubcategories.includes(s.id)) || []
  );

  const FilterContent = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-[#003c6f]/10 rounded-lg">
            <Filter className="h-5 w-5 text-[#003c6f]" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">{t('products.filters')}</h2>
            {hasActiveFilters && (
              <p className="text-xs text-gray-500">{
                (showCombos ? 1 : 0) + 
                selectedCategories.length + 
                selectedSubcategories.length
              } {t('filters.active')}</p>
            )}
          </div>
        </div>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="text-xs text-gray-500 hover:text-[#003c6f] h-8"
          >
            {t('filters.clearAll')}
          </Button>
        )}
      </div>

      <div>
        <button
          onClick={() => onCombosChange(!showCombos)}
          className={`w-full group relative overflow-hidden rounded-xl p-4 transition-all duration-300 text-left ${
            showCombos
              ? 'bg-gradient-to-br from-[#003c6f] to-[#004d8f] text-white shadow-lg scale-[1.02]'
              : 'bg-gradient-to-br from-gray-50 to-gray-100 text-gray-700 hover:from-gray-100 hover:to-gray-200'
          }`}
        >
          <div className="flex items-center justify-between relative z-10">
            <div>
              <div className="font-semibold">{t('filters.combos')}</div>
              <div className={`text-xs ${showCombos ? 'text-white/80' : 'text-gray-500'}`}>
                {t('filters.combosDescription')}
              </div>
            </div>
            {showCombos && (
              <div className="h-2 w-2 rounded-full bg-white animate-pulse flex-shrink-0" />
            )}
          </div>
        </button>
      </div>

      {/* Separador */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-white px-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
            {t('nav.categories')}
          </span>
        </div>
      </div>

      <div className="space-y-2">
        {categories.map((category) => {
          const isExpanded = expandedCategories.includes(category.id);
          const isSelected = selectedCategories.includes(category.id);
          const hasSubcategories = category.subcategorias && category.subcategorias.length > 0;
          const hasSelectedSubcategories = hasSubcategories && 
            category.subcategorias!.some(s => selectedSubcategories.includes(s.id));

          return (
            <div key={category.id} className="space-y-1">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCategoryToggle(category.id)}
                  className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                    isSelected
                      ? 'bg-[#003c6f] border-[#003c6f]'
                      : 'border-gray-300 hover:border-[#003c6f]'
                  }`}
                >
                  {isSelected && (
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>

                <button
                  onClick={() => hasSubcategories ? toggleCategoryExpansion(category.id) : handleCategoryToggle(category.id)}
                  className={`flex-1 group flex items-center justify-between p-3 rounded-xl transition-all duration-200 text-left ${
                    isSelected || hasSelectedSubcategories
                      ? 'bg-[#003c6f]/5 text-[#003c6f]'
                      : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <span className="font-medium text-sm">{category.nombre}</span>
                  {hasSubcategories && (
                    <ChevronDown className={`h-4 w-4 transition-transform duration-200 flex-shrink-0 ${
                      isExpanded ? 'rotate-180' : ''
                    }`} />
                  )}
                </button>
              </div>

              {hasSubcategories && isExpanded && (
                <div className="ml-7 pl-4 border-l-2 border-gray-100 space-y-1 pt-1">
                  {category.subcategorias!.map((subcategory) => {
                    const isSubSelected = selectedSubcategories.includes(subcategory.id);
                    return (
                      <div key={subcategory.id} className="flex items-center gap-2">
                        <button
                          onClick={() => handleSubcategoryToggle(category.id, subcategory.id)}
                          className={`flex-shrink-0 w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${
                            isSubSelected
                              ? 'bg-[#003c6f] border-[#003c6f]'
                              : 'border-gray-300 hover:border-[#003c6f]'
                          }`}
                        >
                          {isSubSelected && (
                            <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </button>

                        <button
                          onClick={() => handleSubcategoryToggle(category.id, subcategory.id)}
                          className={`flex-1 text-left px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                            isSubSelected
                              ? 'bg-[#003c6f] text-white font-medium shadow-sm'
                              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                          }`}
                        >
                          {subcategory.nombre}
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {hasActiveFilters && (
        <div className="pt-4 border-t border-gray-100">
          <div className="text-xs font-medium text-gray-500 mb-3">{t('filters.applied').toUpperCase()}</div>
          <div className="flex flex-wrap gap-2">
            {showCombos && (
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium bg-gradient-to-r from-[#003c6f] to-[#004d8f] text-white">
                {t('filters.combos')}
                <button
                  onClick={() => onCombosChange(false)}
                  className="ml-1 hover:bg-white/20 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            )}
            {selectedCategoryObjs.map(category => (
              <div key={category.id} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                {category.nombre}
                <button
                  onClick={() => handleCategoryToggle(category.id)}
                  className="ml-1 hover:bg-gray-200 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
            {selectedSubcategoryObjs.map(subcategory => (
              <div key={subcategory.id} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                {subcategory.nombre}
                <button
                  onClick={() => {
                    const category = categories.find(c => 
                      c.subcategorias?.some(s => s.id === subcategory.id)
                    );
                    if (category) {
                      handleSubcategoryToggle(category.id, subcategory.id);
                    }
                  }}
                  className="ml-1 hover:bg-gray-200 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  // Desktop version
  if (!isMobile) {
    return (
      <div className="bg-white rounded-2xl p-6 lg:sticky lg:top-6">
        <FilterContent />
      </div>
    );
  }

  // Mobile version - Drawer
  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />
      )}
      
      {/* Drawer */}
      <div
        className={`fixed inset-y-0 left-0 z-[70] w-full max-w-sm bg-white shadow-2xl transform transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-full flex-col">
          {/* Drawer Header */}
          <div className="flex h-15 items-center justify-between px-6 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-[#003c6f] rounded-xl">
                <Filter className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">{t('products.filters')}</h2>
                {hasActiveFilters && (
                  <p className="text-xs text-gray-500">
                    {(showCombos ? 1 : 0) + selectedCategories.length + selectedSubcategories.length} {t('filters.active')}
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="rounded-xl p-2 hover:bg-gray-100 transition-colors"
              aria-label="Cerrar filtros"
            >
              <X className="h-5 w-5 text-gray-600" />
            </button>
          </div>

          {/* Drawer Content */}
          <div className="flex-1 overflow-y-auto px-6 py-6">
            <FilterContent />
          </div>

          {/* Drawer Footer */}
          <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">
            <Button
              onClick={onClose}
              className="w-full bg-gradient-to-r from-[#003c6f] to-[#004d8f] hover:from-[#002b50] hover:to-[#003c6f] text-white shadow-lg"
              size="lg"
            >
              {t('filters.viewProducts')}
              {hasActiveFilters && (
                <span className="ml-2 px-2 py-0.5 bg-white/20 rounded-full text-xs">
                  {(showCombos ? 1 : 0) + selectedCategories.length + selectedSubcategories.length}
                </span>
              )}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
