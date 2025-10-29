'use client';

import { useState } from 'react';
import { Check, Truck, CreditCard, Package } from 'lucide-react';
import { ShippingStep } from './ShippingStep';
import { PaymentStep } from './PaymentStep';
import { useTranslation } from '@/hooks/useTranslation';

interface ShippingChangeData {
  shippingCost?: number;
  shippingMethod?: string;
}

interface CheckoutStepsProps {
  onComplete: (data: CheckoutData) => void;
  isLoading?: boolean;
  onShippingChange?: (data: ShippingChangeData) => void;
}

export interface CheckoutData {
  shippingMethod: 'standard' | 'pickup';
  shippingCost?: number;
  shippingAddress?: {
    nombre: string;
    apellido: string;
    direccion: string;
    ciudad: string;
    provincia: string;
    codigoPostal: string;
    telefono: string;
  };
  paymentMethod: 'transfer' | 'mercadopago' | 'cash';
  paymentDetails?: {
    cbuSelected?: string;
    mpPaymentType?: 'credit' | 'debit';
  };
}

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
}

interface PaymentData {
  paymentMethod: 'transfer' | 'mercadopago' | 'cash';
  paymentDetails?: {
    cbuSelected?: string;
    mpPaymentType?: 'credit' | 'debit';
  };
}

export function CheckoutSteps({ onComplete, isLoading = false, onShippingChange }: CheckoutStepsProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [checkoutData, setCheckoutData] = useState<Partial<CheckoutData>>({});
  const { t } = useTranslation();

  const steps = [
    { number: 1, title: t('checkout.steps.shipping'), icon: Truck },
    { number: 2, title: t('checkout.steps.payment'), icon: CreditCard },
    { number: 3, title: t('checkout.steps.confirm'), icon: Package },
  ];

  const handleShippingComplete = (shippingData: ShippingData) => {
    setCheckoutData(prev => ({ ...prev, ...shippingData }));
    if (onShippingChange) {
      onShippingChange(shippingData);
    }
    setCurrentStep(2);
  };

  const handlePaymentComplete = (paymentData: PaymentData) => {
    const finalData = { ...checkoutData, ...paymentData };
    setCheckoutData(finalData);
    onComplete(finalData as CheckoutData);
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="space-y-8">
      <div className="relative">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isCompleted = step.number < currentStep;
            const isCurrent = step.number === currentStep;
            
            return (
              <div key={step.number} className="flex flex-col items-center flex-1">
                <div className="relative flex items-center w-full">
                  {index > 0 && (
                    <div className={`absolute right-1/2 top-5 h-0.5 w-full ${
                      isCompleted ? 'bg-green-500' : 'bg-gray-200'
                    }`} style={{ right: '50%', transform: 'translateX(50%)' }} />
                  )}
                  
                  <div className={`relative z-10 flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all ${
                    isCompleted 
                      ? 'bg-green-500 border-green-500' 
                      : isCurrent 
                        ? 'bg-[#003c6f] border-[#003c6f]' 
                        : 'bg-white border-gray-300'
                  }`}>
                    {isCompleted ? (
                      <Check className="w-5 h-5 text-white" />
                    ) : (
                      <Icon className={`w-5 h-5 ${isCurrent ? 'text-white' : 'text-gray-400'}`} />
                    )}
                  </div>

                  {index < steps.length - 1 && (
                    <div className={`absolute left-1/2 top-5 h-0.5 w-full ${
                      isCompleted ? 'bg-green-500' : 'bg-gray-200'
                    }`} style={{ left: '50%', transform: 'translateX(-50%)' }} />
                  )}
                </div>
                
                <span className={`mt-2 text-xs sm:text-sm font-medium ${
                  isCurrent ? 'text-[#003c6f]' : isCompleted ? 'text-green-600' : 'text-gray-500'
                }`}>
                  {step.title}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-white rounded-lg border p-6">
        {currentStep === 1 && (
          <ShippingStep
            onNext={handleShippingComplete}
            initialData={checkoutData}
          />
        )}
        
        {currentStep === 2 && (
          <PaymentStep
            onNext={handlePaymentComplete}
            onBack={handleBack}
            initialData={checkoutData}
            isLoading={isLoading}
          />
        )}
      </div>
    </div>
  );
}
