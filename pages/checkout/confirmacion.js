import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { CheckCircle2, Package, Truck, MapPin, Mail, Phone } from 'lucide-react';
import { Button } from '../../src/components/ui/button';

export default function ConfirmacionPage() {
  const router = useRouter();
  const { orderId } = router.query;
  const [order, setOrder] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && orderId) {
      const orders = JSON.parse(localStorage.getItem('pensagro-orders') || '[]');
      const foundOrder = orders.find(o => o.id === parseInt(orderId));
      
      if (foundOrder) {
        setOrder(foundOrder);
      } else {
        router.push('/');
      }
    }
  }, [mounted, orderId, router]);

  if (!mounted || !order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#003c6f]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="bg-white rounded-lg shadow-sm p-8 mb-8 text-center">
          <div className="mb-6">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle2 className="h-10 w-10 text-green-600" />
            </div>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            ¡Pedido Confirmado!
          </h1>
          <p className="text-gray-600 mb-6">
            Tu pedido ha sido recibido y está siendo procesado.
          </p>
          
          <div className="bg-gray-50 rounded-lg p-4 inline-block">
            <p className="text-sm text-gray-600">Número de pedido</p>
            <p className="text-2xl font-bold text-[#003c6f]">#{order.id}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <div className="flex items-center space-x-2 mb-6">
            <Package className="h-5 w-5 text-gray-700" />
            <h2 className="text-xl font-semibold text-gray-900">Detalles del Pedido</h2>
          </div>

          <div className="space-y-4 mb-6 pb-6 border-b">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center space-x-4">
                <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border bg-gray-50">
                  {item.imagen && (
                    <img
                      src={item.imagen}
                      alt={item.nombre}
                      className="h-full w-full object-cover"
                    />
                  )}
                  <div className="absolute -top-2 -right-2 bg-[#003c6f] text-white text-xs font-semibold rounded-full h-6 w-6 flex items-center justify-center">
                    {item.quantity}
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-gray-900">{item.nombre}</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    ${item.precio.toFixed(2)} x {item.quantity}
                  </p>
                </div>
                <div className="text-sm font-semibold text-gray-900">
                  ${(item.precio * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center text-lg font-semibold">
            <span className="text-gray-900">Total</span>
            <span className="text-[#003c6f]">${order.total.toFixed(2)}</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <div className="flex items-center space-x-2 mb-6">
            <Truck className="h-5 w-5 text-gray-700" />
            <h2 className="text-xl font-semibold text-gray-900">Información de Envío</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {order.nombre} {order.apellido}
                </p>
                <p className="text-sm text-gray-600">{order.direccion}</p>
                <p className="text-sm text-gray-600">
                  {order.ciudad}, {order.provincia} {order.codigoPostal}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Mail className="h-5 w-5 text-gray-400" />
              <p className="text-sm text-gray-600">{order.email}</p>
            </div>

            <div className="flex items-center space-x-3">
              <Phone className="h-5 w-5 text-gray-400" />
              <p className="text-sm text-gray-600">{order.telefono}</p>
            </div>

            {order.notas && (
              <div className="mt-4 pt-4 border-t">
                <p className="text-sm font-medium text-gray-900 mb-1">Notas adicionales:</p>
                <p className="text-sm text-gray-600">{order.notas}</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h3 className="font-semibold text-gray-900 mb-3">¿Qué sigue?</h3>
          <ol className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start">
              <span className="font-semibold mr-2">1.</span>
              <span>Recibirás un email de confirmación con los detalles de tu pedido.</span>
            </li>
            <li className="flex items-start">
              <span className="font-semibold mr-2">2.</span>
              <span>Te notificaremos cuando tu pedido sea enviado con el número de seguimiento.</span>
            </li>
            <li className="flex items-start">
              <span className="font-semibold mr-2">3.</span>
              <span>Tu pedido llegará en 3-5 días hábiles.</span>
            </li>
          </ol>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/" className="flex-1">
            <Button 
              variant="outline" 
              className="w-full"
              size="lg"
            >
              Volver al inicio
            </Button>
          </Link>
          <Link href="/productos" className="flex-1">
            <Button 
              className="w-full bg-[#003c6f] hover:bg-[#002b50]"
              size="lg"
            >
              Seguir comprando
            </Button>
          </Link>
        </div>

        <div className="mt-8 text-center text-sm text-gray-600">
          <p>¿Necesitas ayuda con tu pedido?</p>
          <p className="mt-1">
            Contáctanos en{' '}
            <a href="mailto:ventas@pensagro.com" className="text-[#003c6f] hover:underline">
              ventas@pensagro.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
