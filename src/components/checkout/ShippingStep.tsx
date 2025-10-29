'use client';

import { useState, useEffect } from 'react';
import { Truck, Store, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from '@/hooks/useTranslation';

interface ShippingData {
  shippingMethod: 'standard' | 'pickup';
  shippingCost?: number;
  nombre?: string;
  apellido?: string;
  email?: string;
  telefono?: string;
  direccion?: string;
  ciudad?: string;
  provincia?: string;
  codigoPostal?: string;
  notas?: string;
  shippingAddress?: {
    nombre: string;
    apellido: string;
    direccion: string;
    ciudad: string;
    provincia: string;
    codigoPostal: string;
    telefono: string;
  };
}

interface ShippingStepProps {
  onNext: (data: ShippingData) => void;
  initialData?: Partial<ShippingData>;
}

export function ShippingStep({ onNext, initialData }: ShippingStepProps) {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [selectedMethod, setSelectedMethod] = useState<'standard' | 'pickup'>(
    initialData?.shippingMethod || 'standard'
  );
  const [needsAddress, setNeedsAddress] = useState(false);
  const [postalCode, setPostalCode] = useState('');
  const [shippingCost, setShippingCost] = useState<number | null>(null);
  const [calculatingShipping, setCalculatingShipping] = useState(false);
  const [addressData, setAddressData] = useState({
    nombre: '',
    apellido: '',
    direccion: '',
    ciudad: '',
    provincia: '',
    codigoPostal: '',
    telefono: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const shippingMethods = [
    {
      id: 'standard',
      name: t('checkout.homeDelivery'),
      description: t('checkout.homeDeliveryDescription'),
      price: null,
      icon: Truck,
    },
    {
      id: 'pickup',
      name: t('checkout.pickup'),
      description: t('checkout.pickupDescription'),
      price: t('checkout.free'),
      icon: Store,
    },
  ];

  useEffect(() => {
    const hasAddress = user?.direccion && user?.ciudad && user?.provincia;
    if (!hasAddress && selectedMethod !== 'pickup') {
      setNeedsAddress(true);
    } else {
      setNeedsAddress(false);
    }
  }, [selectedMethod, user]);

  const validateAddress = () => {
    const newErrors: Record<string, string> = {};
    
    if (!addressData.nombre) newErrors.nombre = t('checkout.firstNameRequired');
    if (!addressData.apellido) newErrors.apellido = t('checkout.lastNameRequired');
    if (!addressData.direccion) newErrors.direccion = t('checkout.addressRequired');
    if (!addressData.ciudad) newErrors.ciudad = t('checkout.cityRequired');
    if (!addressData.provincia) newErrors.provincia = t('checkout.provinceRequired');
    if (!addressData.codigoPostal) newErrors.codigoPostal = t('checkout.zipCodeRequired');
    if (!addressData.telefono) newErrors.telefono = t('checkout.phoneRequired');

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateShipping = () => {
    if (!postalCode) {
      setErrors(prev => ({ ...prev, postalCode: t('checkout.zipCodeRequired') }));
      return;
    }

    setCalculatingShipping(true);
    setErrors(prev => ({ ...prev, postalCode: '' }));

    setTimeout(() => {
      const code = parseInt(postalCode);
      let cost = 0;
      
      if (code >= 1000 && code <= 1499) {
        cost = 2500;
      } else if (code >= 1500 && code <= 1999) {
        cost = 3500;
      } else {
        cost = 5000;
      }

      setShippingCost(cost);
      setCalculatingShipping(false);
    }, 800);
  };

  const handleContinue = () => {
    if (selectedMethod === 'standard' && shippingCost === null) {
      setErrors(prev => ({ ...prev, postalCode: t('checkout.calculateFirst') }));
      return;
    }

    if (needsAddress && selectedMethod !== 'pickup') {
      if (!validateAddress()) {
        return;
      }
    }

    onNext({
      shippingMethod: selectedMethod,
      shippingAddress: needsAddress 
        ? addressData 
        : (user && user.direccion && user.ciudad && user.provincia && user.codigoPostal
            ? {
                nombre: user.nombre || '',
                apellido: user.apellido || '',
                direccion: user.direccion,
                ciudad: user.ciudad,
                provincia: user.provincia,
                codigoPostal: user.codigoPostal,
                telefono: user.telefono || '',
              }
            : undefined),
      shippingCost: selectedMethod === 'standard' ? (shippingCost ?? undefined) : 0,
    });
  };

  const handleChange = (field: string, value: string) => {
    setAddressData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('checkout.shippingMethod')}</h2>
        <p className="text-gray-600">{t('checkout.shippingMethodDescription')}</p>
      </div>

      <div className="space-y-3">
        {shippingMethods.map((method) => {
          const Icon = method.icon;
          const isSelected = selectedMethod === method.id;
          
          return (
            <button
              key={method.id}
              onClick={() => setSelectedMethod(method.id as 'standard' | 'pickup')}
              className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                isSelected
                  ? 'border-[#003c6f] bg-[#003c6f]/5'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-lg ${
                  isSelected ? 'bg-[#003c6f] text-white' : 'bg-gray-100 text-gray-600'
                }`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-gray-900">{method.name}</h3>
                    {method.price && (
                      <span className={`font-semibold ${
                        method.price === 'Gratis' ? 'text-green-600' : 'text-gray-900'
                      }`}>
                        {method.price}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{method.description}</p>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-1 ${
                  isSelected ? 'border-[#003c6f]' : 'border-gray-300'
                }`}>
                  {isSelected && <div className="w-3 h-3 rounded-full bg-[#003c6f]" />}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {selectedMethod === 'standard' && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-gray-900 mb-3">{t('checkout.calculateShipping')}</h3>
          <div className="flex gap-3">
            <div className="flex-1">
              <Input
                type="text"
                placeholder={t('checkout.postalCode')}
                value={postalCode}
                onChange={(e) => {
                  setPostalCode(e.target.value);
                  if (errors.postalCode) {
                    setErrors(prev => ({ ...prev, postalCode: '' }));
                  }
                }}
                className={errors.postalCode ? 'border-red-500' : ''}
                maxLength={4}
              />
              {errors.postalCode && <p className="text-sm text-red-500 mt-1">{errors.postalCode}</p>}
            </div>
            <Button
              onClick={calculateShipping}
              disabled={calculatingShipping}
              className="bg-[#003c6f] hover:bg-[#002b50] text-white"
            >
              {calculatingShipping ? t('checkout.calculating') : t('checkout.calculate')}
            </Button>
          </div>
          
          {shippingCost !== null && (
            <div className="mt-4 p-3 bg-white rounded-lg border border-green-200">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">{t('checkout.shippingCost')}</span>
                <span className="text-lg font-bold text-[#003c6f]">
                  ${shippingCost.toLocaleString('es-AR')}
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {needsAddress && selectedMethod !== 'pickup' && (
        <div className="space-y-4 pt-4 border-t">
          <div className="flex items-center gap-2 text-[#003c6f] mb-2">
            <MapPin className="w-5 h-5" />
            <h3 className="font-semibold">{t('checkout.shippingAddress')}</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nombre">{t('checkout.firstNameRequired')}</Label>
              <Input
                id="nombre"
                value={addressData.nombre}
                onChange={(e) => handleChange('nombre', e.target.value)}
                placeholder={t('checkout.firstNamePlaceholder')}
                className={errors.nombre ? 'border-red-500' : ''}
              />
              {errors.nombre && <p className="text-sm text-red-500">{errors.nombre}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="apellido">{t('checkout.lastNameRequired')}</Label>
              <Input
                id="apellido"
                value={addressData.apellido}
                onChange={(e) => handleChange('apellido', e.target.value)}
                placeholder={t('checkout.lastNamePlaceholder')}
                className={errors.apellido ? 'border-red-500' : ''}
              />
              {errors.apellido && <p className="text-sm text-red-500">{errors.apellido}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="direccion">{t('checkout.addressRequired')}</Label>
            <Input
              id="direccion"
              value={addressData.direccion}
              onChange={(e) => handleChange('direccion', e.target.value)}
              placeholder={t('checkout.addressPlaceholder')}
              className={errors.direccion ? 'border-red-500' : ''}
            />
            {errors.direccion && <p className="text-sm text-red-500">{errors.direccion}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="ciudad">{t('checkout.cityRequired')}</Label>
              <Input
                id="ciudad"
                value={addressData.ciudad}
                onChange={(e) => handleChange('ciudad', e.target.value)}
                placeholder={t('checkout.cityPlaceholder')}
                className={errors.ciudad ? 'border-red-500' : ''}
              />
              {errors.ciudad && <p className="text-sm text-red-500">{errors.ciudad}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="provincia">{t('checkout.provinceRequired')}</Label>
              <Input
                id="provincia"
                value={addressData.provincia}
                onChange={(e) => handleChange('provincia', e.target.value)}
                placeholder={t('checkout.provincePlaceholder')}
                className={errors.provincia ? 'border-red-500' : ''}
              />
              {errors.provincia && <p className="text-sm text-red-500">{errors.provincia}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="codigoPostal">{t('checkout.zipCodeRequired')}</Label>
              <Input
                id="codigoPostal"
                value={addressData.codigoPostal}
                onChange={(e) => handleChange('codigoPostal', e.target.value)}
                placeholder={t('checkout.zipCodePlaceholder')}
                className={errors.codigoPostal ? 'border-red-500' : ''}
              />
              {errors.codigoPostal && <p className="text-sm text-red-500">{errors.codigoPostal}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="telefono">{t('checkout.phoneRequired')}</Label>
            <Input
              id="telefono"
              type="tel"
              value={addressData.telefono}
              onChange={(e) => handleChange('telefono', e.target.value)}
              placeholder={t('checkout.phonePlaceholder')}
              className={errors.telefono ? 'border-red-500' : ''}
            />
            {errors.telefono && <p className="text-sm text-red-500">{errors.telefono}</p>}
          </div>
        </div>
      )}

      <div className="pt-4">
        <Button
          onClick={handleContinue}
          className="w-full bg-[#003c6f] hover:bg-[#002b50] text-white"
          size="lg"
        >
          {t('checkout.continueToPayment')}
        </Button>
      </div>
    </div>
  );
}
