import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { ArrowLeft, Lock } from 'lucide-react';
import { useCart } from '../../src/hooks/useCart';
import { CheckoutSteps } from '../../src/components/checkout/CheckoutSteps';
import { OrderSummary } from '../../src/components/checkout/OrderSummary';
import { Button } from '../../src/components/ui/button';
import { useTranslation } from '../../src/hooks/useTranslation';

export default function CheckoutPage() {
  const router = useRouter();
  const items = useCart((state) => state.items);
  const clearCart = useCart((state) => state.clearCart);
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [shippingCost, setShippingCost] = useState(null);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && items.length === 0 && !isCheckingOut) {
      router.push('/');
    }
  }, [mounted, items, isCheckingOut, router]);

  const handleCheckout = async (checkoutData) => {
    setIsLoading(true);
    setIsCheckingOut(true); // Indicar que estamos procesando el checkout
    
    try {
      const finalTotal = items.reduce((sum, item) => sum + (item.precio * item.quantity), 0) + (checkoutData.shippingCost || 0);
      
      const orderData = {
        ...checkoutData,
        items: items,
        subtotal: items.reduce((sum, item) => sum + (item.precio * item.quantity), 0),
        total: finalTotal,
        fecha: new Date().toISOString(),
        estado: 'pendiente',
      };

      const orders = JSON.parse(localStorage.getItem('pensagro-orders') || '[]');
      const orderId = Date.now();
      orders.push({ id: orderId, ...orderData });
      localStorage.setItem('pensagro-orders', JSON.stringify(orders));

      // Limpiar el carrito
      clearCart();

      // Redirigir inmediatamente
      window.location.href = `/checkout/confirmacion?orderId=${orderId}`;
    } catch (error) {
      console.error('Error al procesar el pedido:', error);
      alert(t('checkout.errors.processingOrder') || 'Hubo un error al procesar tu pedido. Por favor, intenta nuevamente.');
      setIsCheckingOut(false); // Resetear en caso de error
    } finally {
      setIsLoading(false);
    }
  };

  if (!mounted) {
    return null;
  }

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header del checkout */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  {t('checkout.backToStore')}
                </Button>
              </Link>
              <div className="hidden sm:block h-6 w-px bg-gray-300" />
              <h1 className="hidden sm:block text-xl font-bold text-gray-900">{t('checkout.title')}</h1>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Lock className="h-4 w-4" />
              <span className="hidden sm:inline">{t('checkout.securePay')}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Checkout Steps */}
          <div className="lg:col-span-2">
            <CheckoutSteps 
              onComplete={handleCheckout} 
              isLoading={isLoading}
              onShippingChange={(data) => setShippingCost(data.shippingCost)}
            />
          </div>

          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-24">
              <OrderSummary compact shippingCost={shippingCost} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
