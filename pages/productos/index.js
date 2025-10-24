import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/hooks/useCart';

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

export default function ProductsPage() {
  const [products] = useState(SAMPLE_PRODUCTS);
  const { addItem } = useCart();

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
      <h1 className="text-3xl font-bold mb-8">Todos los Productos</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
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
    </div>
  );
}
