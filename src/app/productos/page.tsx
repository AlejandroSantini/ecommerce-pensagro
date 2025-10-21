'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function ProductosPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      // Si el usuario no está autenticado, redirigir a login
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8">Nuestros Productos</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Esta es una página temporal. Aquí se mostrarían los productos reales */}
        <div className="border rounded-lg p-6 shadow-sm">
          <div className="h-48 bg-gray-200 mb-4 rounded-md flex items-center justify-center">
            <span className="text-gray-500">Imagen del producto</span>
          </div>
          <h2 className="text-xl font-semibold mb-2">Producto 1</h2>
          <p className="text-gray-600 mb-4">Descripción del producto 1</p>
          <div className="flex justify-between items-center">
            <span className="text-lg font-bold">$99.99</span>
            <button 
              className="px-4 py-2 bg-[#2c5f2d] text-white rounded-md hover:bg-[#224a23]"
            >
              Agregar al carrito
            </button>
          </div>
        </div>

        <div className="border rounded-lg p-6 shadow-sm">
          <div className="h-48 bg-gray-200 mb-4 rounded-md flex items-center justify-center">
            <span className="text-gray-500">Imagen del producto</span>
          </div>
          <h2 className="text-xl font-semibold mb-2">Producto 2</h2>
          <p className="text-gray-600 mb-4">Descripción del producto 2</p>
          <div className="flex justify-between items-center">
            <span className="text-lg font-bold">$129.99</span>
            <button 
              className="px-4 py-2 bg-[#2c5f2d] text-white rounded-md hover:bg-[#224a23]"
            >
              Agregar al carrito
            </button>
          </div>
        </div>

        <div className="border rounded-lg p-6 shadow-sm">
          <div className="h-48 bg-gray-200 mb-4 rounded-md flex items-center justify-center">
            <span className="text-gray-500">Imagen del producto</span>
          </div>
          <h2 className="text-xl font-semibold mb-2">Producto 3</h2>
          <p className="text-gray-600 mb-4">Descripción del producto 3</p>
          <div className="flex justify-between items-center">
            <span className="text-lg font-bold">$79.99</span>
            <button 
              className="px-4 py-2 bg-[#2c5f2d] text-white rounded-md hover:bg-[#224a23]"
            >
              Agregar al carrito
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}