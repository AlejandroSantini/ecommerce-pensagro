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
  shippingMethod: 'standard' | 'pickup' | 'coordinate';
  shippingCost?: number;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  province?: string;
  zipCode?: string;
  notas?: string;
  shippingAddress?: {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    province: string;
    zipCode: string;
    floor?: string;
    apartment?: string;
    phone: string;
  };
  // legacy/snake_case fields expected by backend or external consumers
  client_id?: number;
  first_name?: string;
  last_name?: string;
  postal_code?: string;
  apartment?: string;
  comment?: string;
}

interface ShippingStepProps {
  onNext: (data: ShippingData) => void;
  initialData?: Partial<ShippingData>;
}

export function ShippingStep({ onNext, initialData }: ShippingStepProps) {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [selectedMethod, setSelectedMethod] = useState<'standard' | 'pickup' | 'coordinate'>(
    (initialData?.shippingMethod as 'standard' | 'pickup' | 'coordinate') || 'standard'
  );
  const [needsAddress, setNeedsAddress] = useState(false);
  const [postalCode, setPostalCode] = useState('');
  const [shippingCost, setShippingCost] = useState<number | null>(null);
  const [calculatingShipping, setCalculatingShipping] = useState(false);
  const [shippingQuoteResponse, setShippingQuoteResponse] = useState<ShippingQuoteApiResponse | null>(null);
  const [selectedShippingOption, setSelectedShippingOption] = useState<ShippingOption | null>(null);
  const [selectedPickupPoint, setSelectedPickupPoint] = useState<number | null>(null);
  const [addressData, setAddressData] = useState({
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    province: '',
    zipCode: '',
    phone: '',
    floor: '',
    apartment: '',
    comment: '',
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
    {
      id: 'coordinate',
      name: t('checkout.coordinateDelivery'),
      description: t('checkout.coordinateDeliveryDescription'),
      price: null,
      icon: MapPin,
    },
  ];

  useEffect(() => {
    if (selectedMethod !== 'pickup') {
      setNeedsAddress(true);
    } else {
      setNeedsAddress(false);
    }
  }, [selectedMethod, user]);

  // Initialize form from any provided initialData (supports both camelCase and snake_case/legacy keys)
  useEffect(() => {
    if (!initialData) return;
    const raw = initialData as unknown as Record<string, unknown>;
    const src = (initialData.shippingAddress as unknown) as Record<string, unknown> | undefined;

    setAddressData(prev => ({
      firstName: (src?.['firstName'] as string) ?? (raw['first_name'] as string) ?? (raw['firstName'] as string) ?? prev.firstName,
      lastName: (src?.['lastName'] as string) ?? (raw['last_name'] as string) ?? (raw['lastName'] as string) ?? prev.lastName,
      address: (src?.['address'] as string) ?? (raw['address'] as string) ?? prev.address,
      city: (src?.['city'] as string) ?? (raw['city'] as string) ?? (raw['ciudad'] as string) ?? prev.city,
      province: (src?.['province'] as string) ?? (raw['province'] as string) ?? (raw['provincia'] as string) ?? prev.province,
      zipCode: (src?.['zipCode'] as string) ?? (raw['postal_code'] as string) ?? (raw['zipCode'] as string) ?? (raw['codigoPostal'] as string) ?? prev.zipCode,
      phone: (src?.['phone'] as string) ?? (raw['phone'] as string) ?? prev.phone,
      floor: (src?.['floor'] as string) ?? prev.floor,
      apartment: (src?.['apartment'] as string) ?? (raw['apartment'] as string) ?? prev.apartment,
      comment: (src?.['comment'] as string) ?? (raw['comment'] as string) ?? (raw['notas'] as string) ?? prev.comment,
    }));

    const postal = (raw['postal_code'] as string) ?? (raw['zipCode'] as string) ?? '';
    if (postal) setPostalCode(postal);

    if (initialData.shippingCost !== undefined) {
      setShippingCost(initialData.shippingCost as number);
    }

    if (initialData.shippingMethod) {
      setSelectedMethod(initialData.shippingMethod as 'standard' | 'pickup');
    }
  }, [initialData]);

  const validateAddress = () => {
    const newErrors: Record<string, string> = {};
    
    if (!addressData.firstName) newErrors.firstName = t('checkout.firstNameRequired');
    if (!addressData.lastName) newErrors.lastName = t('checkout.lastNameRequired');
    if (!addressData.address) newErrors.address = t('checkout.addressRequired');
    if (!addressData.city) newErrors.city = t('checkout.cityRequired');
    if (!addressData.province) newErrors.province = t('checkout.provinceRequired');
    if (!addressData.zipCode) newErrors.zipCode = t('checkout.zipCodeRequired');
    if (!addressData.phone) newErrors.phone = t('checkout.phoneRequired');

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
      shippingAddress: needsAddress ? addressData : undefined,
      shippingCost: selectedMethod === 'standard' ? (shippingCost ?? undefined) : 0,
      client_id: user ? Number(user.id) : undefined,
      first_name: addressData.firstName,
      last_name: addressData.lastName,
      address: addressData.address,
      apartment: addressData.apartment,
      city: addressData.city,
      province: addressData.province,
      postal_code: addressData.zipCode,
      phone: addressData.phone,
      comment: addressData.comment,
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
              onClick={() => setSelectedMethod(method.id as 'standard' | 'pickup' | 'coordinate')}
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
              <Label htmlFor="firstName">{t('checkout.firstNameRequired')}</Label>
              <Input
                id="firstName"
                value={addressData.firstName}
                onChange={(e) => handleChange('firstName', e.target.value)}
                placeholder={t('checkout.firstNamePlaceholder')}
                className={errors.firstName ? 'border-red-500' : ''}
              />
              {errors.firstName && <p className="text-sm text-red-500">{errors.firstName}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">{t('checkout.lastNameRequired')}</Label>
              <Input
                id="lastName"
                value={addressData.lastName}
                onChange={(e) => handleChange('lastName', e.target.value)}
                placeholder={t('checkout.lastNamePlaceholder')}
                className={errors.lastName ? 'border-red-500' : ''}
              />
              {errors.lastName && <p className="text-sm text-red-500">{errors.lastName}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">{t('checkout.addressRequired')}</Label>
            <Input
              id="address"
              value={addressData.address}
              onChange={(e) => handleChange('address', e.target.value)}
              placeholder={t('checkout.addressPlaceholder')}
              className={errors.address ? 'border-red-500' : ''}
            />
            {errors.address && <p className="text-sm text-red-500">{errors.address}</p>}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="floor">{t('checkout.floor')}</Label>
              <Input
                id="floor"
                value={addressData.floor}
                onChange={(e) => handleChange('floor', e.target.value)}
                placeholder={t('checkout.floorPlaceholder')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="apartment">{t('checkout.apartment')}</Label>
              <Input
                id="apartment"
                value={addressData.apartment}
                onChange={(e) => handleChange('apartment', e.target.value)}
                placeholder={t('checkout.apartmentPlaceholder')}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">{t('checkout.cityRequired')}</Label>
              <Input
                id="city"
                value={addressData.city}
                onChange={(e) => handleChange('city', e.target.value)}
                placeholder={t('checkout.cityPlaceholder')}
                className={errors.city ? 'border-red-500' : ''}
              />
              {errors.city && <p className="text-sm text-red-500">{errors.city}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="province">{t('checkout.provinceRequired')}</Label>
              <Input
                id="province"
                value={addressData.province}
                onChange={(e) => handleChange('province', e.target.value)}
                placeholder={t('checkout.provincePlaceholder')}
                className={errors.province ? 'border-red-500' : ''}
              />
              {errors.province && <p className="text-sm text-red-500">{errors.province}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="zipCode">{t('checkout.zipCodeRequired')}</Label>
              <Input
                id="zipCode"
                value={addressData.zipCode}
                onChange={(e) => handleChange('zipCode', e.target.value)}
                placeholder={t('checkout.zipCodePlaceholder')}
                className={errors.zipCode ? 'border-red-500' : ''}
              />
              {errors.zipCode && <p className="text-sm text-red-500">{errors.zipCode}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">{t('checkout.phoneRequired')}</Label>
            <Input
              id="phone"
              type="tel"
              value={addressData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              placeholder={t('checkout.phonePlaceholder')}
              className={errors.phone ? 'border-red-500' : ''}
            />
            {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="comment">{t('checkout.comment') ?? 'Comentarios'}</Label>
            <textarea
              id="comment"
              value={addressData.comment}
              onChange={(e) => handleChange('comment', e.target.value)}
              placeholder={t('checkout.commentPlaceholder') ?? ''}
              className="w-full rounded-md border border-gray-200 p-2 text-sm"
              rows={3}
            />
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
