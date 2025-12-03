import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { useCart } from '@/hooks/useCart';
import { useCartDrawer } from '@/hooks/useCartDrawer';
import { useTranslation } from '@/hooks/useTranslation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Minus, Plus, Loader2, Check, ShoppingCart } from 'lucide-react';
import { ProductCarousel } from '@/components/home/ProductCarousel';
import { ProductImageCarousel } from '@/components/products/ProductImageCarousel';
import { VariantCard } from '@/components/products/VariantCard';
import { productService } from '@/services/productService';

export default function ProductDetail() {
  const router = useRouter();
  const { id } = router.query;
  const { addItem } = useCart();
  const { openCart } = useCartDrawer();
  const { t } = useTranslation();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariantId, setSelectedVariantId] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [addingToCart, setAddingToCart] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    const loadProduct = async () => {
      if (!id || typeof id !== 'string') return;
      
      try {
        setLoading(true);
        setError(null);
        
        // Cargar el producto desde la API
        const productData = await productService.getById(parseInt(id));
        setProduct(productData);
        const variants = productData.variants || productData.variantes;
        if (variants && variants.length > 0) {
          setSelectedVariantId(variants[0].id);
        }
        
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
    if (product && !addingToCart) {
      setAddingToCart(true);
      
      const variants = product.variants || product.variantes || [];
      const variant = variants.find(v => String(v.id) === String(selectedVariantId));
      const price = variant?.price_retail_usd ? Number(variant.price_retail_usd) : product.precio;

      addItem({
        id: product.id,
        nombre: product.nombre,
        precio: price,
        imagen: product.imagen,
        variantId: variant?.id ? String(variant.id) : undefined,
        variantName: variant?.name || variant?.nombre || undefined,
      }, quantity);

      setTimeout(() => {
        setAddingToCart(false);
        setAddedToCart(true);
        openCart();
        
        setTimeout(() => {
          setAddedToCart(false);
        }, 2000);
      }, 500);
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
            {(product.variants || product.variantes) && (product.variants || product.variantes).length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4">{t('productDetail.selectVariant') ?? 'Selecciona una variante'}</h3>
                
                {(product.variants || product.variantes).length <= 4 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {(product.variants || product.variantes).map((v) => {
                      const variantPrice = v.price_retail_usd ? Number(v.price_retail_usd) : product.precio;
                      const variantStock = v.quantity ?? product.stock;
                      const isSelected = String(selectedVariantId) === String(v.id);
                      const isOutOfStock = variantStock <= 0;

                      return (
                        <VariantCard
                          key={v.id}
                          variant={v}
                          variantPrice={variantPrice}
                          isSelected={isSelected}
                          onSelect={() => {
                            if (!isOutOfStock) {
                              setSelectedVariantId(v.id);
                            }
                          }}
                        />
                      );
                    })}
                  </div>
                ) : (
                  <div className="relative">
                    <div className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide">
                      {(product.variants || product.variantes).map((v) => {
                        const variantPrice = v.price_retail_usd ? Number(v.price_retail_usd) : product.precio;
                        const variantStock = v.quantity ?? product.stock;
                        const isSelected = String(selectedVariantId) === String(v.id);
                        const isOutOfStock = variantStock <= 0;

                        return (
                          <div key={v.id} className="flex-shrink-0 w-full sm:w-80 snap-start">
                            <VariantCard
                              variant={v}
                              variantPrice={variantPrice}
                              isSelected={isSelected}
                              onSelect={() => {
                                if (!isOutOfStock) {
                                  setSelectedVariantId(v.id);
                                }
                              }}
                            />
                          </div>
                        );
                      })}
                    </div>
                    <div className="text-xs text-gray-500 mt-2 text-center sm:hidden">
                      {t('productDetail.scrollHint') ?? 'Desliza para ver más variantes'}
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="space-y-4">
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
                className={`w-full font-semibold py-3 rounded-lg transition-all duration-300 ${
                  addedToCart 
                    ? 'bg-green-500 hover:bg-green-600' 
                    : 'bg-[#003c6f] hover:bg-[#002b50]'
                } text-white`}
                size="lg"
                disabled={product.stock === 0 || addingToCart}
              >
                {addingToCart ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                    {t('productDetail.adding') || 'Agregando...'}
                  </>
                ) : addedToCart ? (
                  <>
                    <Check className="h-5 w-5 mr-2" />
                    {t('productDetail.added') || '¡Agregado!'}
                  </>
                ) : (
                  <>
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    {product.stock > 0 ? t('productDetail.addToCart') : t('productDetail.outOfStock')}
                  </>
                )}
              </Button>
            </div>
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
