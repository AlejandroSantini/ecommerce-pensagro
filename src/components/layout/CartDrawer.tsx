// CartDrawer.tsx
// Drawer del carrito inspirado en Patagonia

'use client';

import { ShoppingCart, X, Minus, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useCart } from '@/hooks/useCart';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { useTranslation } from '@/hooks/useTranslation';

interface CartDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CartDrawer({ open, onOpenChange }: CartDrawerProps) {
  const items = useCart((state) => state.items);
  const removeItem = useCart((state) => state.removeItem);
  const updateQuantity = useCart((state) => state.updateQuantity);
  const clearCart = useCart((state) => state.clearCart);
  const getTotal = useCart((state) => state.getTotal);
  const { t } = useTranslation();
  
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const total = getTotal();

  return (
    <>
      {open && (
        <div 
          className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm"
          onClick={() => onOpenChange(false)}
        />
      )}
      
      <div
        className={`fixed right-0 top-0 z-[70] h-full w-full max-w-md transform bg-white shadow-2xl transition-transform duration-300 ease-in-out ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex h-full flex-col">
          <div className="flex h-15 items-center justify-between border-b px-6">
            <div className="flex items-center space-x-2">
              <ShoppingCart className="h-5 w-5" />
              <h2 className="text-lg font-semibold">{t('cart.title')}</h2>
            </div>
            <button
              onClick={() => onOpenChange(false)}
              className="rounded-md p-2 hover:bg-gray-100 transition-colors"
              aria-label="Close cart"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-4">
            {items.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center text-center">
                <ShoppingCart className="h-12 w-12 text-gray-300 mb-4" />
                <p className="text-gray-500">{t('cart.empty')}</p>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex space-x-4 border-b pb-4">
                    <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border bg-gray-100">
                      {item.imagen && (
                        <img
                          src={item.imagen}
                          alt={item.nombre}
                          className="h-full w-full object-cover"
                        />
                      )}
                    </div>
                    <div className="flex flex-1 flex-col">
                      <div className="flex justify-between">
                        <h3 className="text-sm font-medium">{item.nombre}</h3>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-gray-400 hover:text-red-500"
                          aria-label="Remove item"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <p className="mt-1 text-sm text-gray-500">
                        ${item.precio.toFixed(2)}
                      </p>
                      <div className="mt-2 flex items-center space-x-2">
                        <button
                          onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                          className="rounded-md border p-1 hover:bg-gray-100"
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-8 text-center text-sm">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="rounded-md border p-1 hover:bg-gray-100"
                          disabled={item.quantity >= item.stock}
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {items.length > 0 && (
            <div className="border-t px-6 py-4 space-y-4">
              <div className="flex items-center justify-between text-lg font-semibold">
                <span>{t('cart.total')}</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <Link href="/checkout" onClick={() => onOpenChange(false)}>
                <Button 
                  className="w-full bg-[#003c6f] hover:bg-[#002e54] text-white"
                  size="lg"
                >
                  {t('cart.checkout')}
                </Button>
              </Link>
              <button
                onClick={clearCart}
                className="w-full text-sm text-gray-500 hover:text-red-500 transition-colors"
              >
                {t('cart.continueShopping')}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
