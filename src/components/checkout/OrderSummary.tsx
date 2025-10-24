'use client';

import { useCart } from '@/hooks/useCart';
import { useTranslation } from '@/hooks/useTranslation';
import { ShoppingBag, Truck } from 'lucide-react';

interface OrderSummaryProps {
  showTitle?: boolean;
}

export function OrderSummary({ showTitle = true }: OrderSummaryProps) {
  const { t } = useTranslation();
  const items = useCart((state) => state.items);
  const getTotal = useCart((state) => state.getTotal);
  
  const subtotal = getTotal();
  const envio = 0; // Gratis por ahora, puede ser dinámico
  const total = subtotal + envio;

  return (
    <div className="bg-gray-50 rounded-lg p-6 lg:sticky lg:top-6 lg:max-h-[calc(100vh-3rem)] lg:overflow-y-auto">
      {showTitle && (
        <div className="flex items-center space-x-2 mb-6">
          <ShoppingBag className="h-5 w-5 text-gray-700" />
          <h2 className="text-xl font-semibold text-gray-900">{t('checkout.orderSummary')}</h2>
        </div>
      )}

      {/* Lista de productos */}
      <div className="space-y-4 mb-6">
        {items.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-8">
            {t('checkout.emptyCart')}
          </p>
        ) : (
          items.map((item) => (
            <div key={item.id} className="flex space-x-4">
              <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border bg-white">
                {item.imagen && (
                  <img
                    src={item.imagen}
                    alt={item.nombre}
                    className="h-full w-full object-cover"
                  />
                )}
                {/* Badge de cantidad */}
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

      {/* Divider */}
      <div className="border-t border-gray-200 my-6" />

      {/* Totales */}
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
          <span className="font-medium text-green-600">
            {envio === 0 ? t('checkout.free') : `$${envio.toFixed(2)}`}
          </span>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 pt-3" />

        <div className="flex justify-between text-lg font-semibold">
          <span className="text-gray-900">{t('checkout.total')}</span>
          <span className="text-[#003c6f]">${total.toFixed(2)}</span>
        </div>
      </div>

      {/* Información adicional */}
      <div className="mt-6 bg-white rounded-md p-4 border border-gray-200">
        <p className="text-xs text-gray-600">
          <span className="font-semibold">Nota:</span> {t('checkout.paymentNote')}
        </p>
      </div>
    </div>
  );
}
  );
}
