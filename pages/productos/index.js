import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Filter } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { ProductFilters } from '@/components/productos/ProductFilters';

// Categorías con subcategorías - Sector Agro
const CATEGORIES = [
  {
    id: 1,
    nombre: 'Cercas Eléctrificadas',
    subcategorias: [
      { id: 11, nombre: 'Aisladores' },
      { id: 12, nombre: 'Carreteles' },
      { id: 13, nombre: 'Hilos, cintas y cuerdas eléctricas' },
      { id: 14, nombre: 'Manijas mango aislante/conector' },
      { id: 15, nombre: 'Medición y control' },
      { id: 16, nombre: 'Redes eléctricas plásticas' },
      { id: 17, nombre: 'Varillas y postes' },
    ]
  },
  {
    id: 2,
    nombre: 'Boyeros Eléctricos',
    subcategorias: []
  },
  {
    id: 3,
    nombre: 'Sistema de Pesaje',
    subcategorias: []
  },
  {
    id: 4,
    nombre: 'Identificación',
    subcategorias: []
  },
  {
    id: 5,
    nombre: 'Tranqueras y Velas Automáticas',
    subcategorias: []
  },
  {
    id: 6,
    nombre: 'Sanidad y Tratamiento',
    subcategorias: []
  },
  {
    id: 7,
    nombre: 'Bebederos',
    subcategorias: []
  },
  {
    id: 8,
    nombre: 'Libros',
    subcategorias: []
  },
  {
    id: 9,
    nombre: 'Accesorios y Repuestos',
    subcategorias: []
  },
];

// Datos de muestra con categorías del sector agro
const SAMPLE_PRODUCTS = [
  {
    id: 1,
    nombre: 'Boyero Electrificador 200km',
    descripcion: 'Boyero eléctrico de alto rendimiento para cercas de hasta 200km',
    precio: 85000,
    sku: 'BOY-200',
    stock: 15,
    iva: 21,
    destacado: true,
    activo: true,
    imagen: '/sample/product1.jpg',
    categoryId: 2,
    subcategoryId: null,
    isCombo: false,
    createdAt: '2023-01-01',
    updatedAt: '2023-01-01'
  },
  {
    id: 2,
    nombre: 'Aisladores Plásticos x100',
    descripcion: 'Pack de 100 aisladores plásticos para cerca eléctrica',
    precio: 12500,
    sku: 'AISL-100',
    stock: 50,
    iva: 21,
    destacado: false,
    activo: true,
    imagen: '/sample/product2.jpg',
    categoryId: 1,
    subcategoryId: 11,
    isCombo: false,
    createdAt: '2023-01-01',
    updatedAt: '2023-01-01'
  },
  {
    id: 3,
    nombre: 'Balanza Digital Ganadera 3000kg',
    descripcion: 'Sistema de pesaje digital con plataforma de 3000kg de capacidad',
    precio: 450000,
    sku: 'BAL-3000',
    stock: 8,
    iva: 21,
    destacado: true,
    activo: true,
    imagen: '/sample/product3.jpg',
    categoryId: 3,
    subcategoryId: null,
    isCombo: false,
    createdAt: '2023-01-01',
    updatedAt: '2023-01-01'
  },
  {
    id: 4,
    nombre: 'Combo Cerca Completa',
    descripcion: 'Incluye: Boyero 100km, 500m cable, 50 aisladores, varillas y conectores',
    precio: 125000,
    sku: 'COMBO-001',
    stock: 12,
    iva: 21,
    destacado: true,
    activo: true,
    imagen: '/sample/product4.jpg',
    categoryId: 1,
    subcategoryId: null,
    isCombo: true,
    createdAt: '2023-01-01',
    updatedAt: '2023-01-01'
  },
  {
    id: 5,
    nombre: 'Caravanas de Identificación x100',
    descripcion: 'Caravanas plásticas numeradas para identificación animal',
    precio: 8500,
    sku: 'CAR-100',
    stock: 80,
    iva: 21,
    destacado: false,
    activo: true,
    imagen: '/sample/product1.jpg',
    categoryId: 4,
    subcategoryId: null,
    isCombo: false,
    createdAt: '2023-01-01',
    updatedAt: '2023-01-01'
  },
  {
    id: 6,
    nombre: 'Hilo Conductor 500m',
    descripcion: 'Hilo conductor de alta resistencia para cerca eléctrica',
    precio: 18500,
    sku: 'HILO-500',
    stock: 35,
    iva: 21,
    destacado: false,
    activo: true,
    imagen: '/sample/product2.jpg',
    categoryId: 1,
    subcategoryId: 13,
    isCombo: false,
    createdAt: '2023-01-01',
    updatedAt: '2023-01-01'
  },
  {
    id: 7,
    nombre: 'Bebedero Automático 80L',
    descripcion: 'Bebedero automático de flotante para bovinos',
    precio: 35000,
    sku: 'BEB-80',
    stock: 20,
    iva: 21,
    destacado: false,
    activo: true,
    imagen: '/sample/product3.jpg',
    categoryId: 7,
    subcategoryId: null,
    isCombo: false,
    createdAt: '2023-01-01',
    updatedAt: '2023-01-01'
  },
  {
    id: 8,
    nombre: 'Combo Sistema de Pesaje',
    descripcion: 'Balanza 1500kg + Jaula + Cepo + Indicador digital',
    precio: 680000,
    sku: 'COMBO-002',
    stock: 5,
    iva: 21,
    destacado: true,
    activo: true,
    imagen: '/sample/product4.jpg',
    categoryId: 3,
    subcategoryId: null,
    isCombo: true,
    createdAt: '2023-01-01',
    updatedAt: '2023-01-01'
  },
  {
    id: 9,
    nombre: 'Varillas para Cerca x25',
    descripcion: 'Pack de 25 varillas plásticas para sostén de cerca eléctrica',
    precio: 22000,
    sku: 'VAR-25',
    stock: 40,
    iva: 21,
    destacado: false,
    activo: true,
    imagen: '/sample/product1.jpg',
    categoryId: 1,
    subcategoryId: 17,
    isCombo: false,
    createdAt: '2023-01-01',
    updatedAt: '2023-01-01'
  },
  {
    id: 10,
    nombre: 'Carretel Portátil para Cerca',
    descripcion: 'Carretel portátil para enrollar y transportar cable de cerca',
    precio: 15500,
    sku: 'CARR-001',
    stock: 25,
    iva: 21,
    destacado: false,
    activo: true,
    imagen: '/sample/product2.jpg',
    categoryId: 1,
    subcategoryId: 12,
    isCombo: false,
    createdAt: '2023-01-01',
    updatedAt: '2023-01-01'
  },
];

export default function ProductsPage() {
  const [products] = useState(SAMPLE_PRODUCTS);
  const { addItem } = useCart();
  
  // Estados de filtros
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedSubcategories, setSelectedSubcategories] = useState([]);
  const [showCombos, setShowCombos] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detectar tamaño de pantalla
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Filtrar productos
  const filteredProducts = products.filter((product) => {
    // Filtro de combos
    if (showCombos && !product.isCombo) return false;
    
    // Filtro de categorías - Si hay categorías seleccionadas, el producto debe estar en alguna
    if (selectedCategories.length > 0) {
      const productMatchesCategory = selectedCategories.includes(product.categoryId);
      
      // Si no está en las categorías seleccionadas, verificar subcategorías
      if (!productMatchesCategory && selectedSubcategories.length === 0) {
        return false;
      }
    }
    
    // Filtro de subcategorías - Si hay subcategorías seleccionadas, el producto debe estar en alguna
    if (selectedSubcategories.length > 0) {
      if (!selectedSubcategories.includes(product.subcategoryId)) {
        return false;
      }
    }
    
    return true;
  });

  const handleClearFilters = () => {
    setSelectedCategories([]);
    setSelectedSubcategories([]);
    setShowCombos(false);
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
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Todos los Productos</h1>
          <p className="text-gray-600">
            {filteredProducts.length} {filteredProducts.length === 1 ? 'producto' : 'productos'} 
            {(selectedCategories.length > 0 || selectedSubcategories.length > 0 || showCombos) && ' encontrados'}
          </p>
        </div>
        
        {/* Botón flotante para mobile - solo visible en pantallas pequeñas */}
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
      
      {/* Layout con filtros */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filtros - Sidebar izquierdo (desktop) o Drawer (mobile) */}
        <div className="lg:col-span-1">
          <div className="hidden lg:block">
            <ProductFilters
              categories={CATEGORIES}
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
          
          {/* Mobile Drawer */}
          <ProductFilters
            categories={CATEGORIES}
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

        {/* Grid de productos */}
        <div className="lg:col-span-3">
          {filteredProducts.length === 0 ? (
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
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow flex flex-col">
                  <div className="aspect-square bg-gray-100 relative">
                    <img
                      src={product.imagen}
                      alt={product.nombre}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/300x300?text=Producto';
                      }}
                    />
                    {product.destacado && (
                      <span className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 px-2 py-1 rounded text-xs font-semibold">
                        Destacado
                      </span>
                    )}
                    {product.isCombo && (
                      <span className="absolute top-2 left-2 bg-[#003c6f] text-white px-2 py-1 rounded text-xs font-semibold">
                        Combo
                      </span>
                    )}
                  </div>
                  
                  <div className="p-4 flex flex-col flex-grow">
                    <h3 className="font-semibold text-lg mb-2 line-clamp-2">{product.nombre}</h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.descripcion}</p>
                    
                    <div className="mb-3">
                      <span className="text-2xl font-bold text-green-600">
                        ${product.precio.toLocaleString('es-AR')}
                      </span>
                    </div>
                    
                    <div className="mt-auto grid grid-cols-2 gap-2">
                      <Button 
                        variant="outline" 
                        className="border-[#003c6f] text-[#003c6f] hover:bg-[#003c6f] hover:text-white"
                        onClick={() => handleAddToCart(product)}
                      >
                        <ShoppingCart className="h-4 w-4 mr-1" />
                        Agregar
                      </Button>
                      <Button asChild className="bg-[#003c6f] hover:bg-[#002b50]">
                        <Link href={`/productos/${product.id}`}>
                          Ver Detalles
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
