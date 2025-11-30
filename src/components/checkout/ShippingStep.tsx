'use client';

import { useState, useEffect } from 'react';
import { Truck, Store, MapPin, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from '@/hooks/useTranslation';
import { shippingService } from '@/services';
import ShippingOptions, { ShippingQuoteApiResponse, ShippingOption } from './ShippingOptions';
import { AddressStep } from './AddressStep';

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
  shipping_id?: number;
}

interface ShippingStepProps {
  onNext: (data: ShippingData) => void;
  initialData?: Partial<ShippingData>;
}

export function ShippingStep({ onNext, initialData }: ShippingStepProps) {
  const { user } = useAuth();
  const { t } = useTranslation();
  
  // Control de pasos internos
  const [currentStep, setCurrentStep] = useState<'method' | 'shipping-cost' | 'address'>('method');
  
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
    {
      id: 'coordinate',
      name: t('checkout.coordinateDelivery'),
      description: t('checkout.coordinateDeliveryDescription'),
      price: null,
      icon: MapPin,
    },
  ];

  useEffect(() => {
    // Solo pickup no necesita dirección
    // standard y coordinate necesitan dirección
    if (selectedMethod === 'pickup') {
      setNeedsAddress(false);
    } else if (selectedMethod === 'coordinate') {
      // Coordinar siempre necesita dirección
      setNeedsAddress(true);
    }
    // Para standard, needsAddress se setea en handleSelectShippingOption
  }, [selectedMethod]);

  // Initialize form from any provided initialData
  useEffect(() => {
    if (!initialData) return;
    const raw = initialData as unknown as Record<string, unknown>;

    const postal = (raw['postal_code'] as string) ?? (raw['zipCode'] as string) ?? '';
    if (postal) setPostalCode(postal);

    if (initialData.shippingCost !== undefined) {
      setShippingCost(initialData.shippingCost as number);
    }

    if (initialData.shippingMethod) {
      setSelectedMethod(initialData.shippingMethod as 'standard' | 'pickup' | 'coordinate');
    }
  }, [initialData]);

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

  // Handler para cuando AddressStep completa
  const handleAddressComplete = (data: { addressData: { firstName: string; lastName: string; address: string; city: string; province: string; zipCode: string; phone: string; floor: string; apartment: string; comment: string }; selectedAddressId: number | null }) => {
    const payload: ShippingData = {
      shippingMethod: selectedMethod,
      shippingAddress: data.addressData,
      shippingCost: selectedMethod === 'standard' ? (shippingCost ?? undefined) : 0,
      client_id: user ? Number(user.id) : undefined,
    };

    if (data.selectedAddressId) {
      payload.shipping_id = data.selectedAddressId;
    } else {
      payload.first_name = data.addressData.firstName;
      payload.last_name = data.addressData.lastName;
      payload.address = data.addressData.address;
      payload.apartment = data.addressData.apartment;
      payload.city = data.addressData.city;
      payload.province = data.addressData.province;
      payload.postal_code = data.addressData.zipCode;
      payload.phone = data.addressData.phone;
      payload.comment = data.addressData.comment;
    }

    onNext(payload);
  };

  // Handler para pickup (sin dirección)
  const handlePickupContinue = () => {
    const payload: ShippingData = {
      shippingMethod: 'pickup',
      shippingCost: 0,
      client_id: user ? Number(user.id) : undefined,
    };
    onNext(payload);
  };

  // Handler para punto de retiro (sin dirección de domicilio)
  const handlePickupPointContinue = () => {
    if (!selectedPickupPoint) {
      setErrors(prev => ({ ...prev, pickupPoint: 'Por favor selecciona un punto de retiro' }));
      return;
    }

    const payload: ShippingData = {
      shippingMethod: 'standard',
      shippingCost: shippingCost ?? 0,
      client_id: user ? Number(user.id) : undefined,
    };
    onNext(payload);
  };

  // Handler para continuar al siguiente paso interno
  const handleNextStep = () => {
    if (currentStep === 'method') {
      if (selectedMethod === 'pickup') {
        // Pickup va directo al final
        handlePickupContinue();
      } else if (selectedMethod === 'standard') {
        // Standard necesita calcular costo primero
        setCurrentStep('shipping-cost');
      } else if (selectedMethod === 'coordinate') {
        // Coordinate va directo a direcciones
        setCurrentStep('address');
      }
    } else if (currentStep === 'shipping-cost') {
      // Después de calcular costo, ir a direcciones
      setCurrentStep('address');
    }
  };

  // Handler para volver al paso anterior
  const handlePrevStep = () => {
    if (currentStep === 'address') {
      if (selectedMethod === 'standard') {
        setCurrentStep('shipping-cost');
      } else {
        setCurrentStep('method');
      }
    } else if (currentStep === 'shipping-cost') {
      setCurrentStep('method');
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* PASO 1: Selección de método de envío */}
      {currentStep === 'method' && (
        <>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">{t('checkout.shippingMethod')}</h2>
            <p className="text-sm sm:text-base text-gray-600">{t('checkout.shippingMethodDescription')}</p>
          </div>

          <div className="space-y-2 sm:space-y-3">
            {shippingMethods.map((method) => {
              const Icon = method.icon;
              const isSelected = selectedMethod === method.id;
              
              return (
                <button
                  key={method.id}
                  onClick={() => setSelectedMethod(method.id as 'standard' | 'pickup' | 'coordinate')}
                  className={`w-full p-3 sm:p-4 rounded-lg border-2 transition-all text-left ${
                    isSelected
                      ? 'border-[#003c6f] bg-[#003c6f]/5'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start gap-2 sm:gap-4">
                    <div className={`p-2 sm:p-3 rounded-lg ${
                      isSelected ? 'bg-[#003c6f] text-white' : 'bg-gray-100 text-gray-600'
                    }`}>
                      <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5 sm:mb-1">
                        <h3 className="font-semibold text-sm sm:text-base text-gray-900">{method.name}</h3>
                        {method.price && (
                          <span className={`font-semibold text-xs sm:text-sm ${
                            method.price === 'Gratis' ? 'text-green-600' : 'text-gray-900'
                          }`}>
                            {method.price}
                          </span>
                        )}
                      </div>
                      <p className="text-xs sm:text-sm text-gray-600">{method.description}</p>
                    </div>
                    <div className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-1 ${
                      isSelected ? 'border-[#003c6f]' : 'border-gray-300'
                    }`}>
                      {isSelected && <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-[#003c6f]" />}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Botón para continuar al siguiente paso */}
          <div className="pt-4">
            <Button
              onClick={handleNextStep}
              className="w-full bg-[#003c6f] hover:bg-[#002b50] text-white"
              size="lg"
            >
              {selectedMethod === 'pickup' ? t('checkout.confirmPickup') : t('checkout.continue')}
            </Button>
          </div>
        </>
      )}

      {/* PASO 2: Calcular costo de envío (solo para standard) */}
      {currentStep === 'shipping-cost' && selectedMethod === 'standard' && (
        <>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">{t('checkout.calculateShippingCost')}</h2>
            <p className="text-sm sm:text-base text-gray-600">{t('checkout.enterPostalCode')}</p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
            <h3 className="font-semibold text-sm sm:text-base text-gray-900 mb-2 sm:mb-3">{t('checkout.calculateShipping')}</h3>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
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
                  className={`text-sm sm:text-base ${errors.postalCode ? 'border-red-500' : ''}`}
                  maxLength={4}
                />
                {errors.postalCode && <p className="text-xs sm:text-sm text-red-500 mt-1">{errors.postalCode}</p>}
              </div>
              <Button
                onClick={calculateShipping}
                disabled={calculatingShipping}
                className="bg-[#003c6f] hover:bg-[#002b50] text-white text-sm sm:text-base w-full sm:w-auto"
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
              <div className="mt-3 sm:mt-4 p-2 sm:p-3 bg-white rounded-lg border border-green-200">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-0">
                  <span className="text-xs sm:text-sm text-gray-700">{t('checkout.selectedOption')}: {selectedShippingOption.carrier} - {selectedShippingOption.service_type}</span>
                  <span className="text-base sm:text-lg font-bold text-[#003c6f]">
                    ${shippingCost.toLocaleString('es-AR')}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Puntos de retiro si la opción seleccionada los tiene */}
          {selectedShippingOption && selectedShippingOption.pickup_points.length > 0 && !needsAddress && (
            <div className="space-y-3 sm:space-y-4 bg-white border border-gray-200 rounded-lg p-3 sm:p-4">
              <div className="flex items-center gap-2 text-[#003c6f] mb-2">
                <Store className="w-4 h-4 sm:w-5 sm:h-5" />
                <h3 className="font-semibold text-sm sm:text-base">Selecciona un punto de retiro</h3>
              </div>

              {errors.pickupPoint && (
                <p className="text-xs sm:text-sm text-red-500">{errors.pickupPoint}</p>
              )}

              <div className="space-y-2 sm:space-y-3">
                {selectedShippingOption.pickup_points.map((point) => {
                  const isSelected = selectedPickupPoint === point.point_id;
                  return (
                    <button
                      key={point.point_id}
                      onClick={() => {
                        setSelectedPickupPoint(point.point_id);
                        setErrors(prev => ({ ...prev, pickupPoint: '' }));
                      }}
                      className={`w-full p-3 sm:p-4 rounded-lg border-2 transition-all text-left ${
                        isSelected
                          ? 'border-[#003c6f] bg-[#003c6f]/5'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-start gap-2 sm:gap-4">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-sm sm:text-base text-gray-900 mb-1">{point.description}</h4>
                          <div className="flex items-start gap-1 text-xs sm:text-sm text-gray-600 mb-1">
                            <MapPin className="w-3 h-3 sm:w-4 sm:h-4 mt-0.5 flex-shrink-0" />
                            <span>
                              {point.location.street} {point.location.street_number}
                              {point.location.street_extras && ` ${point.location.street_extras}`}
                              <br />
                              {point.location.city}, {point.location.state} - CP: {point.location.zipcode}
                            </span>
                          </div>
                          {point.phone && (
                            <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-600">
                              <span>📞 {point.phone}</span>
                            </div>
                          )}
                          {point.open_hours && (
                            <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-600 mt-1">
                              <span>🕐 {point.open_hours}</span>
                            </div>
                          )}
                        </div>
                        <div className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-1 ${
                          isSelected ? 'border-[#003c6f]' : 'border-gray-300'
                        }`}>
                          {isSelected && <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-[#003c6f]" />}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Botones de navegación */}
          <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3 pt-4">
            <Button
              onClick={handlePrevStep}
              variant="outline"
              className="w-full sm:flex-1 border-[#003c6f] text-[#003c6f] hover:bg-[#003c6f]/10"
              size="lg"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> {t('checkout.back')}
            </Button>
            <Button
              onClick={() => {
                if (!selectedShippingOption) {
                  setErrors(prev => ({ ...prev, postalCode: t('checkout.calculateFirst') }));
                  return;
                }
                // Si es punto de retiro y no se seleccionó uno
                if (selectedShippingOption.pickup_points.length > 0 && !needsAddress && !selectedPickupPoint) {
                  setErrors(prev => ({ ...prev, pickupPoint: t('checkout.selectPickupPoint') }));
                  return;
                }
                // Si necesita dirección, ir al paso de dirección
                if (needsAddress) {
                  setCurrentStep('address');
                } else {
                  // Si es punto de retiro, finalizar
                  handlePickupPointContinue();
                }
              }}
              className="w-full sm:flex-1 bg-[#003c6f] hover:bg-[#002b50] text-white"
              size="lg"
              disabled={!selectedShippingOption}
            >
              {selectedShippingOption && !needsAddress ? t('checkout.confirmPickupPoint') : t('checkout.continue')}
            </Button>
          </div>
        </>
      )}

      {/* PASO 3: Dirección de envío (componente separado) */}
      {currentStep === 'address' && (
        <AddressStep
          onNext={handleAddressComplete}
          onBack={handlePrevStep}
          shippingMethod={selectedMethod}
          shippingInfo={selectedMethod === 'standard' && selectedShippingOption && shippingCost !== null ? {
            carrier: selectedShippingOption.carrier,
            serviceType: selectedShippingOption.service_type,
            cost: shippingCost,
          } : undefined}
        />
      )}
    </div>
  );
}
