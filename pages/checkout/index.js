import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { ArrowLeft, Lock } from 'lucide-react';
import { useCart } from '../../src/hooks/useCart';
import { CheckoutForm } from '../../src/components/checkout/CheckoutForm';
import { OrderSummary } from '../../src/components/checkout/OrderSummary';
import { Button } from '../../src/components/ui/button';

export default function CheckoutPage() {
  const router = useRouter();
  const items = useCart((state) => state.items);
  const clearCart = useCart((state) => state.clearCart);
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && items.length === 0) {
      router.push('/');
    }
  }, [mounted, items, router]);

  const handleCheckout = async (formData) => {
    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const orderData = {
        ...formData,
        items: items,
        total: items.reduce((sum, item) => sum + (item.precio * item.quantity), 0),
        fecha: new Date().toISOString(),
        estado: 'pendiente',
      };

      const orders = JSON.parse(localStorage.getItem('pensagro-orders') || '[]');
      const orderId = Date.now();
      orders.push({ id: orderId, ...orderData });
      localStorage.setItem('pensagro-orders', JSON.stringify(orders));

      clearCart();

      // Redirigir a confirmación
      router.push(`/checkout/confirmacion?orderId=${orderId}`);
    } catch (error) {
      console.error('Error al procesar el pedido:', error);
      alert('Hubo un error al procesar tu pedido. Por favor, intenta nuevamente.');
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
    <div className="min-h-screen bg-white">
      {/* Header del checkout */}
      <div className="bg-gray-50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Volver a la tienda
                </Button>
              </Link>
              <div className="hidden sm:block h-6 w-px bg-gray-300" />
              <h1 className="hidden sm:block text-2xl font-bold text-gray-900">Checkout</h1>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Lock className="h-4 w-4" />
              <span>Pago seguro</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          <div className="lg:pr-8">
            <CheckoutForm onSubmit={handleCheckout} isLoading={isLoading} />
          </div>

          <div className="lg:pl-8 border-t lg:border-t-0 lg:border-l pt-8 lg:pt-0">
            <OrderSummary />
          </div>
        </div>
      </div>

      <div className="bg-gray-50 border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-2xl mb-2">🚚</div>
              <h3 className="font-semibold text-gray-900 mb-1">Envío Gratis</h3>
              <p className="text-sm text-gray-600">En todos los pedidos</p>
            </div>
            <div>
              <div className="text-2xl mb-2">🔒</div>
              <h3 className="font-semibold text-gray-900 mb-1">Pago Seguro</h3>
              <p className="text-sm text-gray-600">Con Mercado Pago</p>
            </div>
            <div>
              <div className="text-2xl mb-2">📦</div>
              <h3 className="font-semibold text-gray-900 mb-1">Envío Rápido</h3>
              <p className="text-sm text-gray-600">Recibí en 3-5 días hábiles</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
