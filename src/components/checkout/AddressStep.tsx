'use client';

import { useState, useEffect } from 'react';
import { MapPin, ArrowLeft } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from '@/hooks/useTranslation';
import { useProvinces } from '@/hooks/useProvinces';
import { shippingService } from '@/services';
import type { ShippingAddress } from '@/types';

// Schema de validación con Zod
const addressSchema = z.object({
  firstName: z.string().min(1, 'required'),
  lastName: z.string().min(1, 'required'),
  address: z.string().min(1, 'required'),
  city: z.string().min(1, 'required'),
  province: z.string().min(1, 'required'),
  zipCode: z.string().min(1, 'required'),
  phone: z.string().min(1, 'required'),
  floor: z.string().optional(),
  apartment: z.string().optional(),
  comment: z.string().optional(),
});

type AddressFormData = z.infer<typeof addressSchema>;

interface AddressData {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  province: string;
  zipCode: string;
  phone: string;
  floor: string;
  apartment: string;
  comment: string;
}

interface AddressStepProps {
  onNext: (data: { addressData: AddressData; selectedAddressId: number | null }) => void;
  onBack: () => void;
  shippingMethod: 'standard' | 'pickup' | 'coordinate';
  shippingInfo?: {
    carrier: string;
    serviceType: string;
    cost: number;
  };
  initialAddressData?: Partial<AddressData>;
  initialSelectedAddressId?: number | null;
}

export function AddressStep({ 
  onNext, 
  onBack, 
  shippingMethod, 
  shippingInfo,
  initialAddressData,
  initialSelectedAddressId 
}: AddressStepProps) {
  const { user } = useAuth();
  const { t } = useTranslation();
  const { provinces, loading: loadingProvinces } = useProvinces();
  
  const [savedAddresses, setSavedAddresses] = useState<ShippingAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(initialSelectedAddressId || null);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [loadingAddresses, setLoadingAddresses] = useState(true); // Empieza en true para usuarios logueados
  const [hasLoadedAddresses, setHasLoadedAddresses] = useState(false); // Si ya terminó la carga inicial
  const [generalError, setGeneralError] = useState<string | null>(null);

  // React Hook Form con Zod
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors }
  } = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      firstName: initialAddressData?.firstName || '',
      lastName: initialAddressData?.lastName || '',
      address: initialAddressData?.address || '',
      city: initialAddressData?.city || '',
      province: initialAddressData?.province || '',
      zipCode: initialAddressData?.zipCode || '',
      phone: initialAddressData?.phone || '',
      floor: initialAddressData?.floor || '',
      apartment: initialAddressData?.apartment || '',
      comment: initialAddressData?.comment || '',
    }
  });

  // Watch all form values for addressData
  const addressData = watch();

  useEffect(() => {
    const loadAddresses = async () => {
      if (!user?.client_id) {
        setLoadingAddresses(false);
        setHasLoadedAddresses(true);
        return;
      }
      
      setLoadingAddresses(true);
      try {
        const addresses = await shippingService.getByClient(user.client_id);
        setSavedAddresses(addresses);
      } catch (error) {
        console.error('Error loading addresses:', error);
      } finally {
        setLoadingAddresses(false);
        setHasLoadedAddresses(true);
      }
    };

    loadAddresses();
  }, [user]);

  const handleSaveAddress = async () => {
    // Trigger validation first
    await handleSubmit(() => {})();
    if (Object.keys(errors).length > 0) return;
    
    if (!user?.client_id) {
      alert('Debes estar logueado para guardar una dirección');
      return;
    }
    
    setLoadingAddresses(true);
    try {
      const newAddress = await shippingService.create({
        client_id: user.client_id,
        first_name: addressData.firstName,
        last_name: addressData.lastName,
        address: addressData.address,
        apartment: addressData.apartment || undefined,
        city: addressData.city,
        province: addressData.province,
        postal_code: addressData.zipCode,
        phone: addressData.phone,
        comment: addressData.comment || undefined,
      });
      
      setSavedAddresses(prev => [...prev, newAddress]);
      setSelectedAddressId(newAddress.id);
      setShowNewAddressForm(false);
      
      // Limpiar formulario
      reset({
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
    } catch (error) {
      console.error('Error al guardar la dirección:', error);
      alert('Error al guardar la dirección. Inténtalo de nuevo.');
    } finally {
      setLoadingAddresses(false);
    }
  };

  const onFormSubmit = (data: AddressFormData) => {
    onNext({ 
      addressData: {
        ...data,
        floor: data.floor || '',
        apartment: data.apartment || '',
        comment: data.comment || '',
      }, 
      selectedAddressId 
    });
  };

  const handleContinue = () => {
    // Si hay direcciones guardadas y no está en modo formulario, necesita seleccionar una
    if (user && savedAddresses.length > 0 && !showNewAddressForm && !selectedAddressId) {
      setGeneralError('Por favor selecciona una dirección');
      return;
    }

    // Si está en modo formulario o no tiene direcciones, validar el formulario
    if (!user || savedAddresses.length === 0 || showNewAddressForm) {
      handleSubmit(onFormSubmit)();
      return;
    }

    // Si tiene dirección seleccionada, continuar con esos datos
    onNext({ 
      addressData: {
        firstName: addressData.firstName || '',
        lastName: addressData.lastName || '',
        address: addressData.address || '',
        city: addressData.city || '',
        province: addressData.province || '',
        zipCode: addressData.zipCode || '',
        phone: addressData.phone || '',
        floor: addressData.floor || '',
        apartment: addressData.apartment || '',
        comment: addressData.comment || '',
      }, 
      selectedAddressId 
    });
  };

  const canContinue = () => {
    if (user && savedAddresses.length > 0 && !showNewAddressForm) {
      return !!selectedAddressId;
    }
    return true;
  };

  const handleSelectAddress = (address: ShippingAddress) => {
    setSelectedAddressId(address.id);
    setValue('firstName', address.first_name);
    setValue('lastName', address.last_name);
    setValue('address', address.address);
    setValue('city', address.city);
    setValue('province', address.province);
    setValue('zipCode', address.postal_code);
    setValue('phone', address.phone);
    setValue('floor', '');
    setValue('apartment', address.apartment || '');
    setValue('comment', address.comment || '');
    setGeneralError(null);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">
          {shippingMethod === 'coordinate' ? 'Dirección para coordinar entrega' : 'Dirección de envío'}
        </h2>
        <p className="text-sm sm:text-base text-gray-600">
          {shippingMethod === 'coordinate' 
            ? 'Ingresa tu dirección y nos pondremos en contacto para coordinar la entrega.'
            : 'Selecciona una dirección guardada o ingresa una nueva.'}
        </p>
      </div>

      {/* Resumen de envío seleccionado (solo para standard) */}
      {shippingMethod === 'standard' && shippingInfo && (
        <div className="p-2 sm:p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-0">
            <span className="text-xs sm:text-sm text-gray-700">
              <strong>Envío:</strong> {shippingInfo.carrier} - {shippingInfo.serviceType}
            </span>
            <span className="text-base sm:text-lg font-bold text-[#003c6f]">
              ${shippingInfo.cost.toLocaleString('es-AR')}
            </span>
          </div>
        </div>
      )}

      <div className="space-y-3 sm:space-y-4 bg-white border border-gray-200 rounded-lg p-3 sm:p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
          <div className="flex items-center gap-2 text-[#003c6f]">
            <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
            <h3 className="font-semibold text-sm sm:text-base text-gray-900">
              {user && savedAddresses.length > 0 ? 'Direcciones guardadas' : 'Nueva dirección'}
            </h3>
          </div>
          {user && savedAddresses.length > 0 && !showNewAddressForm && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowNewAddressForm(true)}
              className="text-[#003c6f] border-[#003c6f] hover:bg-[#003c6f]/5 text-xs sm:text-sm w-full sm:w-auto"
            >
              + Nueva dirección
            </Button>
          )}
        </div>
        
        {generalError && (
          <p className="text-sm text-red-500">{generalError}</p>
        )}

        {/* Loading state - solo mientras carga y tiene usuario */}
        {user && loadingAddresses && savedAddresses.length === 0 && (
          <div className="text-center py-4 text-gray-500">
            Cargando direcciones...
          </div>
        )}

        {/* Direcciones guardadas */}
        {user && savedAddresses.length > 0 && !showNewAddressForm && (
          <div className="grid grid-cols-1 gap-3">
            {savedAddresses.map((address) => {
              const isSelected = selectedAddressId === address.id;
              return (
                <button
                  key={address.id}
                  onClick={() => handleSelectAddress(address)}
                  className={`w-full p-3 sm:p-4 rounded-lg border-2 transition-all text-left ${
                    isSelected
                      ? 'border-[#003c6f] bg-[#003c6f]/5'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start gap-2 sm:gap-4">
                    <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 mt-1 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm sm:text-base text-gray-900 mb-1">
                        {address.first_name} {address.last_name}
                      </h4>
                      <p className="text-xs sm:text-sm text-gray-600 truncate">
                        {address.address}
                        {address.apartment && ` - ${address.apartment}`}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-600">
                        {address.city}, {address.province} - CP: {address.postal_code}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-500 mt-1">
                        📞 {address.phone}
                      </p>
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
        )}

        {/* Formulario de nueva dirección */}
        {/* Mostrar si: no hay usuario, o (ya cargó y no hay direcciones), o está en modo nueva dirección */}
        {(!user || (hasLoadedAddresses && savedAddresses.length === 0) || showNewAddressForm) && (
          <div className="space-y-4">
            {showNewAddressForm && user && savedAddresses.length > 0 && (
              <div className="flex items-center justify-between pb-2 border-b">
                <h4 className="font-medium text-gray-900">Nueva dirección</h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowNewAddressForm(false);
                    reset();
                  }}
                  className="text-gray-600 hover:text-gray-900"
                >
                  Cancelar
                </Button>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="space-y-1 sm:space-y-2">
                <Label htmlFor="addr-firstName" className="text-sm">{t('checkout.firstNameRequired')}</Label>
                <Input
                  id="addr-firstName"
                  {...register('firstName')}
                  placeholder={t('checkout.firstNamePlaceholder')}
                  className={`text-sm sm:text-base ${errors.firstName ? 'border-red-500' : ''}`}
                />
              </div>

              <div className="space-y-1 sm:space-y-2">
                <Label htmlFor="addr-lastName" className="text-sm">{t('checkout.lastNameRequired')}</Label>
                <Input
                  id="addr-lastName"
                  {...register('lastName')}
                  placeholder={t('checkout.lastNamePlaceholder')}
                  className={`text-sm sm:text-base ${errors.lastName ? 'border-red-500' : ''}`}
                />
              </div>
            </div>

            <div className="space-y-1 sm:space-y-2">
              <Label htmlFor="addr-address" className="text-sm">{t('checkout.addressRequired')}</Label>
              <Input
                id="addr-address"
                {...register('address')}
                placeholder={t('checkout.addressPlaceholder')}
                className={`text-sm sm:text-base ${errors.address ? 'border-red-500' : ''}`}
              />
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="space-y-1 sm:space-y-2">
                <Label htmlFor="addr-floor" className="text-sm">{t('checkout.floor')}</Label>
                <Input
                  id="addr-floor"
                  {...register('floor')}
                  placeholder={t('checkout.floorPlaceholder')}
                  className="text-sm sm:text-base"
                />
              </div>

              <div className="space-y-1 sm:space-y-2">
                <Label htmlFor="addr-apartment" className="text-sm">{t('checkout.apartment')}</Label>
                <Input
                  id="addr-apartment"
                  {...register('apartment')}
                  placeholder={t('checkout.apartmentPlaceholder')}
                  className="text-sm sm:text-base"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              <div className="space-y-1 sm:space-y-2">
                <Label htmlFor="addr-city" className="text-sm">{t('checkout.cityRequired')}</Label>
                <Input
                  id="addr-city"
                  {...register('city')}
                  placeholder={t('checkout.cityPlaceholder')}
                  className={`text-sm sm:text-base ${errors.city ? 'border-red-500' : ''}`}
                />
              </div>

              <div className="space-y-1 sm:space-y-2">
                <Label htmlFor="addr-province" className="text-sm">{t('checkout.provinceRequired')}</Label>
                <select
                  id="addr-province"
                  {...register('province')}
                  disabled={loadingProvinces}
                  className={`w-full h-10 px-3 py-2 text-sm sm:text-base rounded-md border bg-white ${errors.province ? 'border-red-500' : 'border-input'} focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50`}
                >
                  <option value="">
                    {loadingProvinces ? 'Cargando...' : t('checkout.selectProvince')}
                  </option>
                  {provinces.map((province) => (
                    <option key={province.value} value={province.label}>
                      {province.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1 sm:space-y-2">
                <Label htmlFor="addr-zipCode" className="text-sm">{t('checkout.zipCodeRequired')}</Label>
                <Input
                  id="addr-zipCode"
                  {...register('zipCode')}
                  placeholder={t('checkout.zipCodePlaceholder')}
                  className={`text-sm sm:text-base ${errors.zipCode ? 'border-red-500' : ''}`}
                />
              </div>
            </div>

            <div className="space-y-1 sm:space-y-2">
              <Label htmlFor="addr-phone" className="text-sm">{t('checkout.phoneRequired')}</Label>
              <Input
                id="addr-phone"
                type="tel"
                {...register('phone')}
                placeholder={t('checkout.phonePlaceholder')}
                className={`text-sm sm:text-base ${errors.phone ? 'border-red-500' : ''}`}
              />
            </div>

            <div className="space-y-1 sm:space-y-2">
              <Label htmlFor="addr-comment" className="text-sm">
                {shippingMethod === 'coordinate' ? 'Comentarios / Indicaciones de entrega' : t('checkout.comment') ?? 'Comentarios'}
              </Label>
              <textarea
                id="addr-comment"
                {...register('comment')}
                placeholder={shippingMethod === 'coordinate' ? 'Indicaciones especiales para la entrega, horarios preferidos, etc.' : t('checkout.commentPlaceholder') ?? ''}
                className="w-full rounded-md border border-gray-200 p-2 text-xs sm:text-sm"
                rows={2}
              />
            </div>

            {/* Botón para guardar dirección si está logueado */}
            {user?.client_id && (
              <div className="pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleSaveAddress}
                  disabled={loadingAddresses}
                  className="w-full bg-[#003c6f] hover:bg-[#002b50] text-white"
                >
                  {loadingAddresses ? 'Guardando...' : 'Guardar dirección'}
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Botones de navegación */}
      <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3 pt-4">
        <Button
          onClick={onBack}
          variant="outline"
          className="w-full sm:flex-1 border-[#003c6f] text-[#003c6f] hover:bg-[#003c6f]/10"
          size="lg"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> {t('checkout.back')}
        </Button>
        <Button
          onClick={handleContinue}
          className="w-full sm:flex-1 bg-[#003c6f] hover:bg-[#002b50] text-white"
          size="lg"
          disabled={loadingAddresses || !canContinue()}
        >
          {loadingAddresses ? t('checkout.saving') : 
            shippingMethod === 'coordinate' ? t('checkout.confirmDelivery') :
            t('checkout.continueToPayment')
          }
        </Button>
      </div>
    </div>
  );
}
