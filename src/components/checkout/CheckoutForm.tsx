'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface CheckoutFormData {
  // Información de contacto
  email: string;
  telefono: string;
  
  // Información de envío
  nombre: string;
  apellido: string;
  direccion: string;
  ciudad: string;
  provincia: string;
  codigoPostal: string;
  notas?: string;
}

interface CheckoutFormProps {
  onSubmit: (data: CheckoutFormData) => void;
  isLoading?: boolean;
}

export function CheckoutForm({ onSubmit, isLoading = false }: CheckoutFormProps) {
  const [formData, setFormData] = useState<CheckoutFormData>({
    email: '',
    telefono: '',
    nombre: '',
    apellido: '',
    direccion: '',
    ciudad: '',
    provincia: '',
    codigoPostal: '',
    notas: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof CheckoutFormData, string>>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof CheckoutFormData, string>> = {};

    // Validar email
    if (!formData.email) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El email no es válido';
    }

    // Validar teléfono
    if (!formData.telefono) {
      newErrors.telefono = 'El teléfono es requerido';
    }

    // Validar campos de envío
    if (!formData.nombre) newErrors.nombre = 'El nombre es requerido';
    if (!formData.apellido) newErrors.apellido = 'El apellido es requerido';
    if (!formData.direccion) newErrors.direccion = 'La dirección es requerida';
    if (!formData.ciudad) newErrors.ciudad = 'La ciudad es requerida';
    if (!formData.provincia) newErrors.provincia = 'La provincia es requerida';
    if (!formData.codigoPostal) newErrors.codigoPostal = 'El código postal es requerido';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleChange = (field: keyof CheckoutFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Limpiar error al escribir
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Información de Contacto */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">Información de Contacto</h2>
        
        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            placeholder="tu@email.com"
            className={errors.email ? 'border-red-500' : ''}
          />
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="telefono">Teléfono *</Label>
          <Input
            id="telefono"
            type="tel"
            value={formData.telefono}
            onChange={(e) => handleChange('telefono', e.target.value)}
            placeholder="+54 9 11 1234-5678"
            className={errors.telefono ? 'border-red-500' : ''}
          />
          {errors.telefono && (
            <p className="text-sm text-red-500">{errors.telefono}</p>
          )}
        </div>
      </div>

      {/* Información de Envío */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">Dirección de Envío</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="nombre">Nombre *</Label>
            <Input
              id="nombre"
              type="text"
              value={formData.nombre}
              onChange={(e) => handleChange('nombre', e.target.value)}
              placeholder="Juan"
              className={errors.nombre ? 'border-red-500' : ''}
            />
            {errors.nombre && (
              <p className="text-sm text-red-500">{errors.nombre}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="apellido">Apellido *</Label>
            <Input
              id="apellido"
              type="text"
              value={formData.apellido}
              onChange={(e) => handleChange('apellido', e.target.value)}
              placeholder="Pérez"
              className={errors.apellido ? 'border-red-500' : ''}
            />
            {errors.apellido && (
              <p className="text-sm text-red-500">{errors.apellido}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="direccion">Dirección *</Label>
          <Input
            id="direccion"
            type="text"
            value={formData.direccion}
            onChange={(e) => handleChange('direccion', e.target.value)}
            placeholder="Av. Corrientes 1234"
            className={errors.direccion ? 'border-red-500' : ''}
          />
          {errors.direccion && (
            <p className="text-sm text-red-500">{errors.direccion}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="ciudad">Ciudad *</Label>
            <Input
              id="ciudad"
              type="text"
              value={formData.ciudad}
              onChange={(e) => handleChange('ciudad', e.target.value)}
              placeholder="Buenos Aires"
              className={errors.ciudad ? 'border-red-500' : ''}
            />
            {errors.ciudad && (
              <p className="text-sm text-red-500">{errors.ciudad}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="provincia">Provincia *</Label>
            <Input
              id="provincia"
              type="text"
              value={formData.provincia}
              onChange={(e) => handleChange('provincia', e.target.value)}
              placeholder="CABA"
              className={errors.provincia ? 'border-red-500' : ''}
            />
            {errors.provincia && (
              <p className="text-sm text-red-500">{errors.provincia}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="codigoPostal">Código Postal *</Label>
            <Input
              id="codigoPostal"
              type="text"
              value={formData.codigoPostal}
              onChange={(e) => handleChange('codigoPostal', e.target.value)}
              placeholder="1234"
              className={errors.codigoPostal ? 'border-red-500' : ''}
            />
            {errors.codigoPostal && (
              <p className="text-sm text-red-500">{errors.codigoPostal}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="notas">Notas adicionales (opcional)</Label>
          <textarea
            id="notas"
            value={formData.notas}
            onChange={(e) => handleChange('notas', e.target.value)}
            placeholder="Información adicional sobre tu pedido..."
            className="w-full min-h-[100px] px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#003c6f] focus:border-transparent resize-none"
          />
        </div>
      </div>

      {/* Botón de envío */}
      <div className="pt-4">
        <Button
          type="submit"
          className="w-full bg-[#003c6f] hover:bg-[#002b50] text-white"
          size="lg"
          disabled={isLoading}
        >
          {isLoading ? 'Procesando...' : 'Continuar al Pago'}
        </Button>
        <p className="mt-2 text-xs text-gray-500 text-center">
          * Campos requeridos
        </p>
      </div>
    </form>
  );
}
