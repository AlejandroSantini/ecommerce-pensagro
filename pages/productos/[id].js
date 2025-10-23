import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { useCart } from '@/hooks/useCart';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Minus, Plus } from 'lucide-react';

// Datos de muestra
const SAMPLE_PRODUCTS = [
  {
    id: 1,
    nombre: 'Herbicida Premium',
    descripcion: 'Herbicida de alta calidad para control de malezas',
    precio: 2500,
    sku: 'HERB-001',
    stock: 100,
    iva: 21,
    destacado: true,
    activo: true,
    imagen: '/sample/product1.jpg',
    createdAt: '2023-01-01',
    updatedAt: '2023-01-01'
  },
  {
    id: 2,
    nombre: 'Fertilizante Orgánico',
    descripcion: 'Fertilizante 100% orgánico para cultivos sustentables',
    precio: 1800,
    sku: 'FERT-001',
    stock: 150,
    iva: 21,
    destacado: true,
    activo: true,
    imagen: '/sample/product2.jpg',
    createdAt: '2023-01-01',
    updatedAt: '2023-01-01'
  },
  {
    id: 3,
    nombre: 'Semilla de Maíz Híbrido',
    descripcion: 'Semillas de maíz de alto rendimiento',
    precio: 3200,
    sku: 'SEM-001',
    stock: 80,
    iva: 10.5,
    destacado: true,
    activo: true,
    imagen: '/sample/product3.jpg',
    createdAt: '2023-01-01',
    updatedAt: '2023-01-01'
  },
  {
    id: 4,
    nombre: 'Insecticida Biológico',
    descripcion: 'Control de plagas respetuoso con el medio ambiente',
    precio: 2100,
    sku: 'INS-001',
    stock: 120,
    iva: 21,
    destacado: true,
    activo: true,
    imagen: '/sample/product4.jpg',
    createdAt: '2023-01-01',
    updatedAt: '2023-01-01'
  }
];

export default function ProductDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const { addItem } = useCart();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (id) {
      const foundProduct = SAMPLE_PRODUCTS.find(p => p.id === parseInt(id));
      setProduct(foundProduct);
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
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-4xl font-bold text-green-600">
                ${product.precio.toLocaleString('es-AR')}
              </span>
              <span className="text-gray-500">+ IVA {product.iva}%</span>
            </div>
            <p className="text-sm text-gray-600">
              SKU: {product.sku}
            </p>
          </div>

          <div className="mb-6">
            <p className="text-sm text-gray-600 mb-2">
              Stock disponible: <span className="font-semibold">{product.stock} unidades</span>
            </p>
            
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
    </div>
  );
}
