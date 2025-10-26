import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardImage, CardContent } from '@/components/ui/card';
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
    nombre: 'Boyero Electrificador PEL 418',
    descripcion: 'Boyero eléctrico de alto rendimiento para cercas de hasta 200km',
    precio: 85000,
    sku: 'BOY-418',
    stock: 15,
    iva: 21,
    destacado: true,
    activo: true,
    imagen: '/mock/pel 418.png',
    categoryId: 2,
    subcategoryId: null,
    isCombo: false,
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
    categoryId: 2,
    subcategoryId: null,
    isCombo: false,
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
    categoryId: 2,
    subcategoryId: null,
    isCombo: false,
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
    categoryId: 1,
    subcategoryId: 17,
    isCombo: false,
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
    categoryId: 1,
    subcategoryId: 12,
    isCombo: false,
    createdAt: '2023-01-01',
    updatedAt: '2023-01-01'
  },
  {
    id: 6,
    nombre: 'Carretel Standard con Alambre',
    descripcion: 'Carretel con alambre conductor incluido para cerca eléctrica',
    precio: 22500,
    sku: 'CARR-002',
    stock: 20,
    iva: 21,
    destacado: false,
    activo: true,
    imagen: '/mock/Carretel_foto_alambre_1.jpg',
    categoryId: 1,
    subcategoryId: 12,
    isCombo: false,
    createdAt: '2023-01-01',
    updatedAt: '2023-01-01'
  },
  {
    id: 7,
    nombre: 'Control Remoto para Boyero',
    descripcion: 'Control remoto inalámbrico para activar/desactivar boyero a distancia',
    precio: 35000,
    sku: 'REM-001',
    stock: 15,
    iva: 21,
    destacado: false,
    activo: true,
    imagen: '/mock/PEL_REMOTE_YELLOW_A_JPG_BLANCO.jpg',
    categoryId: 9,
    subcategoryId: null,
    isCombo: false,
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
    categoryId: 1,
    subcategoryId: 14,
    isCombo: false,
    createdAt: '2023-01-01',
    updatedAt: '2023-01-01'
  },
  {
    id: 9,
    nombre: 'Punta para Varilla',
    descripcion: 'Punta metálica para varillas de cerca eléctrica',
    precio: 2500,
    sku: 'PUN-001',
    stock: 100,
    iva: 21,
    destacado: false,
    activo: true,
    imagen: '/mock/punta varilla.webp',
    categoryId: 1,
    subcategoryId: 17,
    isCombo: false,
    createdAt: '2023-01-01',
    updatedAt: '2023-01-01'
  },
  {
    id: 10,
    nombre: 'Super Kit Jeringa Telescópica',
    descripcion: 'Kit completo de jeringa telescópica para tratamiento veterinario',
    precio: 48000,
    sku: 'JER-001',
    stock: 12,
    iva: 21,
    destacado: true,
    activo: true,
    imagen: '/mock/Super_Kit_Jeringa_Telescopica.jpg',
    categoryId: 6,
    subcategoryId: null,
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
                        <Link href={`/productos/${product.id}`}>
                          Ver Detalles
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
