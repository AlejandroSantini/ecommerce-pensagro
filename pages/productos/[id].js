import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { useCart } from '@/hooks/useCart';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Minus, Plus } from 'lucide-react';
import { ProductCarousel } from '@/components/home/ProductCarousel';

// Datos de muestra - Sincronizados con la página de productos
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

export default function ProductDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const { addItem } = useCart();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    if (id) {
      const foundProduct = SAMPLE_PRODUCTS.find(p => p.id === parseInt(id));
      setProduct(foundProduct);
      
      // Obtener productos relacionados (excluyendo el producto actual)
      const related = SAMPLE_PRODUCTS.filter(p => p.id !== parseInt(id));
      setRelatedProducts(related);
    }
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addItem({
        id: product.id,
        nombre: product.nombre,
        precio: product.precio,
        imagen: product.imagen,
        stock: product.stock
      }, quantity);
    }
  };

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-center text-gray-500">Cargando producto...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button
        variant="ghost"
        onClick={() => router.back()}
        className="mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Volver
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Imagen del producto */}
        <div className="bg-gray-100 rounded-lg overflow-hidden aspect-square">
          <img
            src={product.imagen}
            alt={product.nombre}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/600x600?text=Producto';
            }}
          />
        </div>

        {/* Detalles del producto */}
        <div>
          <h1 className="text-3xl font-bold mb-4">{product.nombre}</h1>
          
          {product.destacado && (
            <span className="inline-block bg-yellow-400 text-yellow-900 px-3 py-1 rounded text-sm font-semibold mb-4">
              Producto Destacado
            </span>
          )}

          <p className="text-gray-700 mb-6">{product.descripcion}</p>

          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <div className="mb-2">
              <span className="text-4xl font-bold text-green-600">
                ${product.precio.toLocaleString('es-AR')}
              </span>
            </div>
            <p className="text-sm text-gray-600">
              SKU: {product.sku}
            </p>
          </div>

          <div className="mb-6">
            <div className="flex items-center gap-4 mb-4">
              <label className="text-sm font-medium">Cantidad:</label>
              <div className="flex items-center border rounded-md">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="h-10 w-10"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <input
                  type="number"
                  min="1"
                  max={product.stock}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-16 text-center border-x py-2"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="h-10 w-10"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <Button
              onClick={handleAddToCart}
              className="w-full bg-[#003c6f] hover:bg-[#002b50]"
              size="lg"
              disabled={product.stock === 0}
            >
              {product.stock > 0 ? 'Agregar al Carrito' : 'Sin Stock'}
            </Button>
          </div>

          <div className="border-t pt-6">
            <h3 className="font-semibold mb-2">Información adicional</h3>
            <ul className="space-y-1 text-sm text-gray-600">
              <li>• Entrega estimada: 3-5 días hábiles</li>
              <li>• Garantía de calidad</li>
              <li>• Asesoramiento técnico incluido</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Productos Relacionados */}
      {relatedProducts.length > 0 && (
        <div className="mt-16 border-t pt-12">
          <ProductCarousel 
            title="Productos Relacionados" 
            products={relatedProducts} 
          />
        </div>
      )}
    </div>
  );
}
