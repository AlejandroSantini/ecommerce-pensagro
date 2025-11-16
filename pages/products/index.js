import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardImage, CardContent } from '@/components/ui/card';
import { Pagination } from '@/components/ui/pagination';
import { ShoppingCart, Filter, Loader2 } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { ProductFilters } from '@/components/products/ProductFilters';
import { productService } from '@/services/productService';
import { categoryService } from '@/services/categoryService';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addItem } = useCart();
  
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedSubcategories, setSelectedSubcategories] = useState([]);
  const [showCombos, setShowCombos] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categoriesData = await categoryService.getAll();
        setCategories(categoriesData);
      } catch (err) {
        console.error('Error loading categories:', err);
        setCategories([]);
      }
    };

    loadCategories();
  }, []);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const filters = {
          destacado: undefined, // Cargar todos los productos
          activo: true,
          categoria: selectedCategories.length > 0 ? selectedCategories[0] : undefined,
          page: pagination.currentPage,
          limit: 6 // 6 productos por página para probar paginación
        };
        
        const response = await productService.getAll(filters);
        setProducts(response.products);
        setPagination(response.pagination);
      } catch (err) {
        console.error('Error loading products:', err);
        setError('Error al cargar los productos. Intente nuevamente.');
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [selectedCategories, pagination.currentPage]);

  const filteredProducts = products.filter((product) => {
    if (showCombos && !product.isCombo) return false;
    
    if (selectedCategories.length > 0) {
      const productCategoryIds = product.categories?.map(cat => cat.id) || [];
      const hasMatchingCategory = selectedCategories.some(catId => productCategoryIds.includes(catId));
      
      if (!hasMatchingCategory && selectedSubcategories.length === 0) {
        return false;
      }
    }
    
    if (selectedSubcategories.length > 0) {
      const productSubcategoryIds = product.subcategories?.map(sub => sub.id) || [];
      const hasMatchingSubcategory = selectedSubcategories.some(subId => productSubcategoryIds.includes(subId));
      
      if (!hasMatchingSubcategory) {
        return false;
      }
    }
    
    return true;
  });

  const handlePageChange = (page) => {
    setPagination(prev => ({ ...prev, currentPage: page }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleClearFilters = () => {
    setSelectedCategories([]);
    setSelectedSubcategories([]);
    setShowCombos(false);
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const handleAddToCart = (product) => {
    addItem({
      id: product.id,
      nombre: product.nombre,
      precio: product.precio,
      imagen: product.imagen,
      stock: product.stock
    }, 1);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Todos los Productos</h1>
          <p className="text-gray-600">
            {pagination.totalItems} {pagination.totalItems === 1 ? 'producto' : 'productos'} 
            {(selectedCategories.length > 0 || selectedSubcategories.length > 0 || showCombos) && ' encontrados'}
          </p>
        </div>
        
        {isMobile && (
          <Button
            onClick={() => setMobileFiltersOpen(true)}
            className="lg:hidden fixed bottom-6 right-6 z-30 h-14 w-14 rounded-full shadow-lg bg-[#003c6f] hover:bg-[#002b50]"
            size="icon"
          >
            <Filter className="h-6 w-6" />
          </Button>
        )}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <div className="hidden lg:block">
            <ProductFilters
              categories={categories}
              selectedCategories={selectedCategories}
              selectedSubcategories={selectedSubcategories}
              showCombos={showCombos}
              onCategoriesChange={setSelectedCategories}
              onSubcategoriesChange={setSelectedSubcategories}
              onCombosChange={setShowCombos}
              onClearFilters={handleClearFilters}
              isMobile={false}
            />
          </div>
          
          <ProductFilters
            categories={categories}
            selectedCategories={selectedCategories}
            selectedSubcategories={selectedSubcategories}
            showCombos={showCombos}
            onCategoriesChange={setSelectedCategories}
            onSubcategoriesChange={setSelectedSubcategories}
            onCombosChange={setShowCombos}
            onClearFilters={handleClearFilters}
            isMobile={true}
            isOpen={mobileFiltersOpen}
            onClose={() => setMobileFiltersOpen(false)}
          />
        </div>

        <div className="lg:col-span-3">
          {loading ? (
            <div className="text-center py-12">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-[#003c6f]" />
              <p className="text-gray-600">Cargando productos...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12 bg-red-50 rounded-lg border border-red-200">
              <div className="text-red-400 mb-4">
                <ShoppingCart className="h-16 w-16 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-red-700 mb-2">Error al cargar productos</h3>
              <p className="text-red-600 mb-4">{error}</p>
              <Button
                onClick={() => window.location.reload()}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Reintentar
              </Button>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <ShoppingCart className="h-16 w-16 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                No se encontraron productos
              </h3>
              <p className="text-gray-500 mb-4">
                Intenta con otros filtros
              </p>
              <Button
                onClick={handleClearFilters}
                variant="outline"
                className="border-[#003c6f] text-[#003c6f]"
              >
                Limpiar filtros
              </Button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <Card key={product.id} className="flex flex-col h-full">
                    <CardImage className="aspect-[4/3]">
                      <img
                        src={product.imagen}
                        alt={product.nombre}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/300x300?text=Producto';
                        }}
                      />
                      {product.destacado && (
                        <span className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 px-2 py-1 rounded text-xs font-semibold z-10">
                          Destacado
                        </span>
                      )}
                      {product.isCombo && (
                        <span className="absolute top-2 left-2 bg-[#003c6f] text-white px-2 py-1 rounded text-xs font-semibold z-10">
                          Combo
                        </span>
                      )}
                      {/* Blue top line */}
                      <div className="absolute top-0 left-0 w-full h-1 bg-[#003c6f]"></div>
                    </CardImage>
                    
                    <CardContent className="flex flex-col flex-grow">
                      <h3 className="font-medium text-lg text-gray-800 mb-2 line-clamp-2">{product.nombre}</h3>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2 flex-grow">{product.descripcion}</p>
                      
                      <div className="mb-3">
                        <span className="text-2xl font-bold text-green-600">
                          ${product.precio.toLocaleString('es-AR')}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <Button 
                          variant="outline" 
                          className="border-[#003c6f] text-[#003c6f] hover:bg-[#003c6f] hover:text-white"
                          onClick={() => handleAddToCart(product)}
                        >
                          <ShoppingCart className="h-4 w-4 mr-1" />
                          Agregar
                        </Button>
                        <Button asChild className="bg-[#003c6f] hover:bg-[#002b50]">
                          <Link href={`/products/${product.id}`}>
                            Ver Detalles
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              {/* Pagination - Always show */}
              <div className="mt-8 flex justify-center">
                <Pagination
                  currentPage={pagination.currentPage}
                  totalPages={pagination.totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
