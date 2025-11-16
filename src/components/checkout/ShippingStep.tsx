'use client';

import { useState, useEffect } from 'react';
import { Truck, Store, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from '@/hooks/useTranslation';
import { shippingService } from '@/services';
import ShippingOptions, { ShippingQuoteApiResponse, ShippingOption } from './ShippingOptions';

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
  const [shippingQuoteResponse, setShippingQuoteResponse] = useState<ShippingQuoteApiResponse | null>(null);
  const [selectedShippingOption, setSelectedShippingOption] = useState<ShippingOption | null>(null);
  const [selectedPickupPoint, setSelectedPickupPoint] = useState<number | null>(null);
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
    if (selectedMethod !== 'pickup') {
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

  const calculateShipping = async () => {
    if (!postalCode) {
      setErrors(prev => ({ ...prev, postalCode: t('checkout.zipCodeRequired') }));
      return;
    }

    setCalculatingShipping(true);
    setErrors(prev => ({ ...prev, postalCode: '' }));
    setShippingQuoteResponse(null);
    setSelectedShippingOption(null);
    setShippingCost(null);

    try {
      const response = await shippingService.quote({ postal_code: postalCode });
      setShippingQuoteResponse(response);
      setCalculatingShipping(false);
    } catch (error) {
      console.error('Error calculating shipping:', error);
      setErrors(prev => ({ ...prev, postalCode: 'Error al calcular el envío. Intenta nuevamente.' }));
      setCalculatingShipping(false);
    }
  };

  const handleSelectShippingOption = (option: ShippingOption) => {
    setSelectedShippingOption(option);
    setShippingCost(option.price_incl_tax);
    setSelectedPickupPoint(null); 
    
    const isHomeDelivery = option.pickup_points.length === 0;
    setNeedsAddress(isHomeDelivery);
  };

  const handleContinue = () => {
    if (selectedMethod === 'standard' && !selectedShippingOption) {
      setErrors(prev => ({ ...prev, postalCode: t('checkout.calculateFirst') }));
      return;
    }

    if (selectedShippingOption && selectedShippingOption.pickup_points.length > 0 && !needsAddress) {
      if (!selectedPickupPoint) {
        setErrors(prev => ({ ...prev, pickupPoint: 'Por favor selecciona un punto de retiro' }));
        return;
      }
    }

    if (needsAddress) {
      if (!validateAddress()) {
        return;
      }
    }

    onNext({
      shippingMethod: selectedMethod,
      shippingAddress: needsAddress 
        ? addressData 
        : undefined,
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
          
          {shippingQuoteResponse && (
            <div className="mt-4">
              <ShippingOptions
                response={shippingQuoteResponse}
                onSelect={handleSelectShippingOption}
                selectedOption={selectedShippingOption}
              />
            </div>
          )}

          {selectedShippingOption && shippingCost !== null && (
            <div className="mt-4 p-3 bg-white rounded-lg border border-green-200">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">{t('checkout.selectedOption')}: {selectedShippingOption.carrier} - {selectedShippingOption.service_type}</span>
                <span className="text-lg font-bold text-[#003c6f]">
                  ${shippingCost.toLocaleString('es-AR')}
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {selectedShippingOption && selectedShippingOption.pickup_points.length > 0 && !needsAddress && (
        <div className="space-y-4 pt-4 border-t">
          <div className="flex items-center gap-2 text-[#003c6f] mb-2">
            <Store className="w-5 h-5" />
            <h3 className="font-semibold">Selecciona un punto de retiro</h3>
          </div>

          {errors.pickupPoint && (
            <p className="text-sm text-red-500">{errors.pickupPoint}</p>
          )}

          <div className="space-y-3">
            {selectedShippingOption.pickup_points.map((point) => {
              const isSelected = selectedPickupPoint === point.point_id;
              return (
                <button
                  key={point.point_id}
                  onClick={() => {
                    setSelectedPickupPoint(point.point_id);
                    setErrors(prev => ({ ...prev, pickupPoint: '' }));
                  }}
                  className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                    isSelected
                      ? 'border-[#003c6f] bg-[#003c6f]/5'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-1">{point.description}</h4>
                      <div className="flex items-start gap-1 text-sm text-gray-600 mb-1">
                        <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>
                          {point.location.street} {point.location.street_number}
                          {point.location.street_extras && ` ${point.location.street_extras}`}
                          <br />
                          {point.location.city}, {point.location.state} - CP: {point.location.zipcode}
                        </span>
                      </div>
                      {point.phone && (
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <span>📞 {point.phone}</span>
                        </div>
                      )}
                      {point.open_hours && (
                        <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                          <span>🕐 {point.open_hours}</span>
                        </div>
                      )}
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
        </div>
      )}

      {needsAddress && selectedMethod !== 'pickup' && selectedShippingOption && (
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
