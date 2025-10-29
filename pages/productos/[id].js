import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { useCart } from '@/hooks/useCart';
import { useTranslation } from '@/hooks/useTranslation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Minus, Plus } from 'lucide-react';
import { ProductCarousel } from '@/components/home/ProductCarousel';

// Datos de muestra - Sincronizados con la página de productos
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

export default function ProductDetail() {
  const router = useRouter();
  const { id } = router.query;
  const { addItem } = useCart();
  const { t } = useTranslation();
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{t('productDetail.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
              <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-8 flex items-center gap-2 hover:bg-gray-100"
        >
          <ArrowLeft className="w-4 h-4" />
          {t('productDetail.back')}
        </Button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="w-full h-96 bg-white rounded-lg overflow-hidden flex items-center justify-center">
          <img
            src={product.imagen}
            alt={product.nombre}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/600x600?text=Producto';
            }}
          />
        </div>

        <div>
          <h1 className="text-3xl font-bold mb-4">{product.nombre}</h1>
          
          {product.destacado && (
            <span className="inline-block bg-yellow-400 text-yellow-900 px-3 py-1 rounded text-sm font-semibold mb-4">
              {t('productDetail.featured')}
            </span>
          )}

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
              <label className="text-sm font-medium">{t('productDetail.quantity')}:</label>
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
              {product.stock > 0 ? t('productDetail.addToCart') : t('productDetail.outOfStock')}
            </Button>
          </div>

        </div>
      </div>

      <div className="mt-8 bg-white p-6 rounded-lg border">
        <h2 className="text-2xl font-bold mb-4">{t('productDetail.description')}</h2>
        <p className="text-gray-700 leading-relaxed">{product.descripcion}</p>
        <div className="border-t pt-6 mt-6">
          <h3 className="font-semibold mb-2">{t('productDetail.additionalInfo')}</h3>
          <ul className="space-y-1 text-sm text-gray-600">
            <li>• {t('productDetail.estimatedDelivery')}</li>
            <li>• {t('productDetail.qualityGuarantee')}</li>
            <li>• {t('productDetail.technicalSupport')}</li>
          </ul>
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <div className="mt-16 border-t pt-12">
          <ProductCarousel 
            title={t('productDetail.related')}
            products={relatedProducts} 
          />
        </div>
      )}
    </div>
  );
}
