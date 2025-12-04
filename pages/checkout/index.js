import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { ArrowLeft, Lock } from 'lucide-react';
import { useCart } from '../../src/hooks/useCart';
import { useAuth } from '../../src/contexts/AuthContext';
import { CheckoutSteps } from '../../src/components/checkout/CheckoutSteps';
import { OrderSummary } from '../../src/components/checkout/OrderSummary';
import { Button } from '../../src/components/ui/button';
import { useTranslation } from '../../src/hooks/useTranslation';
import { saleService } from '../../src/services/saleService';

export default function CheckoutPage() {
  const router = useRouter();
  const { user } = useAuth();
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
    try {
      setIsLoading(true);
      setIsCheckingOut(true);
      
      const paymentDiscounts = {
        'transfer': { id: 2, percent: 10 },
        'mercadopago': { id: 3, percent: 0 },
        'cash': { id: 1, percent: 0 }
      };
      
      const paymentDiscount = paymentDiscounts[checkoutData.paymentMethod] || paymentDiscounts['mercadopago'];
      
      const products = items.map(item => ({
        product_id: parseInt(item.id),
        variant_id: item.variantId ? parseInt(item.variantId) : null,
        quantity: item.quantity
      }));
      
      const addr = checkoutData.shippingAddress || {};
      
      const salePayload = {
        client_id: user?.client_id || null,
        payment_method: checkoutData.paymentMethod,
        payment_status: 'pending',
        products: products,
        coupon_id: null,
        discount_payment_method_id: paymentDiscount.id,
        payment_method_discount_percent: paymentDiscount.percent,
        coupon_discount_percent: null,
        channel: 'ecommerce',
        comment: checkoutData.comment || addr.comment || '',
        cbu_destination: checkoutData.paymentMethod === 'transfer' ? checkoutData.paymentDetails?.cbuSelected : undefined,
        invoice_number: null,
        shipping_id: checkoutData.shipping_id || null,
        shipping_price: checkoutData.shippingCost || 0,
      };

      if (!user?.client_id) {
        salePayload.shipping_data = {
          client_id: null,
          email: checkoutData.email || addr.email || null,
          first_name: checkoutData.first_name || addr.firstName || null,
          last_name: checkoutData.last_name || addr.lastName || null,
          address: checkoutData.address || addr.address || null,
          apartment: checkoutData.apartment || addr.apartment || null,
          city: checkoutData.city || addr.city || null,
          province: checkoutData.province || addr.province || null,
          postal_code: checkoutData.postal_code || addr.zipCode || null,
          phone: checkoutData.phone || addr.phone || null,
          comment: checkoutData.comment || addr.comment || null,
        };
      }

      const saleResponse = await saleService.create(salePayload);
      
      const finalTotal = items.reduce((sum, item) => sum + (item.precio * item.quantity), 0) + (checkoutData.shippingCost || 0);
      
      const orderData = {
        ...checkoutData,
        items: items,
        subtotal: items.reduce((sum, item) => sum + (item.precio * item.quantity), 0),
        total: finalTotal,
        fecha: new Date().toISOString(),
        estado: 'pendiente',
        saleId: saleResponse?.id,
        saleNumber: saleResponse?.sale_number,
      };

      const orders = JSON.parse(localStorage.getItem('pensagro-orders') || '[]');
      const orderId = saleResponse?.id || Date.now();
      orders.push({ id: orderId, ...orderData });
      localStorage.setItem('pensagro-orders', JSON.stringify(orders));

      clearCart();
      
      window.location.href = `/checkout/confirmacion?orderId=${orderId}`;
    } catch (error) {
      console.error('Error al procesar el pedido:', error);
      
      let errorMessage = 'Hubo un error al procesar tu pedido.';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      alert(errorMessage);
      setIsCheckingOut(false);
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
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Link href="/">
                <Button variant="ghost" size="sm" className="px-2 sm:px-3">
                  <ArrowLeft className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">{t('checkout.backToStore')}</span>
                </Button>
              </Link>
              <div className="hidden sm:block h-6 w-px bg-gray-300" />
              <h1 className="text-base sm:text-xl font-bold text-gray-900">{t('checkout.title')}</h1>
            </div>
            <div className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm text-gray-600">
              <Lock className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden xs:inline sm:inline">{t('checkout.securePay')}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="lg:hidden mb-4">
          <OrderSummary compact shippingCost={shippingCost} />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">
          <div className="lg:col-span-2 order-2 lg:order-1">
            <CheckoutSteps 
              onComplete={handleCheckout} 
              isLoading={isLoading}
              onShippingChange={(data) => setShippingCost(data.shippingCost)}
            />
          </div>

          <div className="hidden lg:block lg:col-span-1 order-1 lg:order-2">
            <div className="lg:sticky lg:top-24">
              <OrderSummary compact shippingCost={shippingCost} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
