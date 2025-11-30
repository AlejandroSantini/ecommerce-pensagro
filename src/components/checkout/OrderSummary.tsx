'use client';

import { useCart } from '@/hooks/useCart';
import { useTranslation } from '@/hooks/useTranslation';
import { ShoppingBag, Truck } from 'lucide-react';

interface OrderSummaryProps {
  showTitle?: boolean;
  compact?: boolean;
  shippingCost?: number | null;
}

export function OrderSummary({ showTitle = true, compact = false, shippingCost = null }: OrderSummaryProps) {
  const { t } = useTranslation();
  const items = useCart((state) => state.items);
  const getTotal = useCart((state) => state.getTotal);
  
  const subtotal = getTotal();
  const envio: number = shippingCost !== null ? shippingCost : 0;
  const total = subtotal + envio;

  if (compact) {
    return (
      <div className="bg-white rounded-lg border p-3 sm:p-4 lg:sticky lg:top-24">
        <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">{t('checkout.summary')}</h2>
        
        <div className="space-y-2 mb-3 sm:mb-4 max-h-32 sm:max-h-48 overflow-y-auto">
          {items.map((item) => (
            <div key={item.id} className="flex items-center justify-between text-xs sm:text-sm">
              <div className="flex items-center gap-1 sm:gap-2 flex-1 min-w-0">
                <span className="font-medium text-gray-600">{item.quantity}x</span>
                <span className="text-gray-900 truncate">{item.nombre}</span>
              </div>
              <span className="font-medium text-gray-900 ml-2 whitespace-nowrap">
                ${(item.precio * item.quantity).toLocaleString('es-AR')}
              </span>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-200 my-2 sm:my-3" />

        <div className="space-y-1 sm:space-y-2">
          <div className="flex justify-between text-xs sm:text-sm">
            <span className="text-gray-600">{t('checkout.subtotal')}</span>
            <span className="font-medium text-gray-900">${subtotal.toLocaleString('es-AR')}</span>
          </div>
          
          <div className="flex justify-between text-xs sm:text-sm">
            <span className="text-gray-600">{t('checkout.shipping')}</span>
            {shippingCost === null ? (
              <span className="font-medium text-green-600">{t('checkout.toCalculate')}</span>
            ) : envio === 0 ? (
              <span className="font-medium text-green-600">{t('checkout.free')}</span>
            ) : (
              <span className="font-medium text-gray-900">${envio.toLocaleString('es-AR')}</span>
            )}
          </div>

          <div className="border-t border-gray-200 pt-2 mt-2" />

          <div className="flex justify-between text-sm sm:text-base font-semibold">
            <span className="text-gray-900">{t('checkout.total')}</span>
            <span className="text-[#003c6f]">${total.toLocaleString('es-AR')}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 rounded-lg p-6 lg:sticky lg:top-6 lg:max-h-[calc(100vh-3rem)] lg:overflow-y-auto">
      {showTitle && (
        <div className="flex items-center space-x-2 mb-6">
          <ShoppingBag className="h-5 w-5 text-gray-700" />
          <h2 className="text-xl font-semibold text-gray-900">{t('checkout.orderSummary')}</h2>
        </div>
      )}

      <div className="space-y-4 mb-6">
        {items.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-8">
            {t('checkout.emptyCart')}
          </p>
        ) : (
          items.map((item) => (
            <div key={item.id} className="flex space-x-4">
              <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border bg-white flex items-center justify-center">
                {item.imagen && (
                  <img
                    src={item.imagen}
                    alt={item.nombre}
                    className="w-full h-full object-cover"
                  />
                )}
                <div className="absolute -top-2 -right-2 bg-[#003c6f] text-white text-xs font-semibold rounded-full h-6 w-6 flex items-center justify-center">
                  {item.quantity}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-gray-900 truncate">
                  {item.nombre}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  ${item.precio.toFixed(2)} x {item.quantity}
                </p>
                <p className="text-sm font-semibold text-gray-900 mt-1">
                  ${(item.precio * item.quantity).toFixed(2)}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="border-t border-gray-200 my-6" />

      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">{t('checkout.subtotal')}</span>
          <span className="font-medium text-gray-900">${subtotal.toFixed(2)}</span>
        </div>
        
        <div className="flex justify-between text-sm">
          <div className="flex items-center space-x-1">
            <Truck className="h-4 w-4 text-gray-500" />
            <span className="text-gray-600">{t('checkout.shipping')}</span>
          </div>
          {shippingCost === null ? (
            <span className="font-medium text-green-600">{t('checkout.toCalculate')}</span>
          ) : envio === 0 ? (
            <span className="font-medium text-green-600">{t('checkout.free')}</span>
          ) : (
            <span className="font-medium text-gray-900">${envio.toFixed(2)}</span>
          )}
        </div>

        <div className="border-t border-gray-200 pt-3" />

        <div className="flex justify-between text-lg font-semibold">
          <span className="text-gray-900">{t('checkout.total')}</span>
          <span className="text-[#003c6f]">${total.toFixed(2)}</span>
        </div>
      </div>

      <div className="mt-6 bg-white rounded-md p-4 border border-gray-200">
        <p className="text-xs text-gray-600">
          <span className="font-semibold">{t('checkout.note')}:</span> {t('checkout.paymentNote')}
        </p>
      </div>
    </div>
  );
}
