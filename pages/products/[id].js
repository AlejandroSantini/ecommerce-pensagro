import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { useCart } from '@/hooks/useCart';
import { useTranslation } from '@/hooks/useTranslation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Minus, Plus, Loader2 } from 'lucide-react';
import { ProductCarousel } from '@/components/home/ProductCarousel';
import { ProductImageCarousel } from '@/components/products/ProductImageCarousel';
import { productService } from '@/services/productService';

export default function ProductDetail() {
  const router = useRouter();
  const { id } = router.query;
  const { addItem } = useCart();
  const { t } = useTranslation();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProduct = async () => {
      if (!id || typeof id !== 'string') return;
      
      try {
        setLoading(true);
        setError(null);
        
        // Cargar el producto desde la API
        const productData = await productService.getById(parseInt(id));
        setProduct(productData);
        
        // Cargar productos relacionados
        if (productData.related_products && productData.related_products.length > 0) {
          // Si el producto tiene productos relacionados definidos, usar esos
          const relatedIds = productData.related_products.map(rp => rp.id);
          const relatedPromises = relatedIds.map(relatedId => productService.getById(relatedId));
          const relatedProductsData = await Promise.allSettled(relatedPromises);
          
          const validRelatedProducts = relatedProductsData
            .filter(result => result.status === 'fulfilled')
            .map(result => result.value)
            .slice(0, 6); // Limitar a 6 productos relacionados
          
          setRelatedProducts(validRelatedProducts);
        } else {
          // Si no tiene productos relacionados, obtener productos similares
          const allProducts = await productService.getAll({ activo: true });
          const similar = allProducts
            .filter(p => p.id !== parseInt(id))
            .slice(0, 6);
          setRelatedProducts(similar);
        }
      } catch (err) {
        console.error('Error loading product:', err);
        setError('Error al cargar el producto');
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-[#003c6f]" />
          <p className="text-gray-600">{t('productDetail.loading')}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center bg-red-50 p-8 rounded-lg border border-red-200 max-w-md">
          <div className="text-red-400 mb-4">
            <ArrowLeft className="h-16 w-16 mx-auto" />
          </div>
          <h2 className="text-xl font-semibold text-red-700 mb-2">Error al cargar producto</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <div className="space-x-4">
            <Button
              onClick={() => router.back()}
              variant="outline"
              className="border-red-600 text-red-600 hover:bg-red-50"
            >
              Volver
            </Button>
            <Button
              onClick={() => window.location.reload()}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Reintentar
            </Button>
          </div>
        </div>
      </div>
    );
  }

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
        <ProductImageCarousel 
          images={product.imagenes || []}
          productName={product.nombre}
          mainImage={product.imagen}
        />

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
