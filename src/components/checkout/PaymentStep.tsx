'use client';

import { useState } from 'react';
import { Building2, Wallet, Banknote, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/hooks/useTranslation';

interface PaymentData {
  paymentMethod: 'transfer' | 'mercadopago' | 'cash';
  paymentDetails?: {
    cbuSelected?: string;
    mpPaymentType?: 'credit' | 'debit';
  };
}

interface PaymentStepProps {
  onNext: (data: PaymentData) => void;
  onBack: () => void;
  initialData?: Partial<PaymentData>;
  isLoading?: boolean;
}

export function PaymentStep({ onNext, onBack, initialData, isLoading = false }: PaymentStepProps) {
  const { t } = useTranslation();
  const [selectedMethod, setSelectedMethod] = useState<'transfer' | 'mercadopago' | 'cash'>(
    initialData?.paymentMethod || 'mercadopago'
  );
  const [selectedCBU, setSelectedCBU] = useState<string>('');

  const paymentMethods = [
    {
      id: 'transfer',
      name: t('checkout.bankTransfer'),
      description: t('checkout.bankTransferDescription'),
      icon: Building2,
      discount: null,
    },
    {
      id: 'mercadopago',
      name: t('checkout.mercadoPago'),
      description: t('checkout.mercadoPagoDescription'),
      icon: Wallet,
      discount: null,
    },
    {
      id: 'cash',
      name: t('checkout.cash'),
      description: t('checkout.cashDescription'),
      icon: Banknote,
      discount: null,
    },
  ];

  const cbuOptions = [
    { id: 'cbu1', bank: 'Banco Galicia', cbu: '0070999830000012345678', alias: 'PENSAGRO.VENTAS' },
    { id: 'cbu2', bank: 'Banco Santander', cbu: '0720999820000087654321', alias: 'PENSAGRO.PAGOS' },
  ];

  const handleContinue = () => {
    const paymentData: PaymentData = {
      paymentMethod: selectedMethod,
      paymentDetails: {},
    };

    if (selectedMethod === 'transfer') {
      paymentData.paymentDetails!.cbuSelected = selectedCBU;
    }

    onNext(paymentData);
  };

  const canContinue = () => {
    if (selectedMethod === 'transfer') {
      return selectedCBU !== '';
    }
    return true;
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">{t('checkout.paymentMethod')}</h2>
        <p className="text-sm sm:text-base text-gray-600">{t('checkout.paymentMethodDescription')}</p>
      </div>

      <div className="space-y-2 sm:space-y-3">
        {paymentMethods.map((method) => {
          const Icon = method.icon;
          const isSelected = selectedMethod === method.id;
          
          return (
            <button
              key={method.id}
              onClick={() => setSelectedMethod(method.id as 'transfer' | 'mercadopago' | 'cash')}
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
                    {method.discount && (
                      <span className="text-xs sm:text-sm font-semibold text-green-600">
                        {method.discount}
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

      {selectedMethod === 'transfer' && (
        <div className="space-y-2 sm:space-y-3 pt-3 sm:pt-4 border-t">
          <h3 className="font-semibold text-sm sm:text-base text-gray-900 mb-2">{t('checkout.selectAccount')}</h3>
          {cbuOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => setSelectedCBU(option.cbu)}
              className={`w-full p-3 sm:p-4 rounded-lg border-2 transition-all text-left ${
                selectedCBU === option.cbu
                  ? 'border-[#003c6f] bg-[#003c6f]/5'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <div className="font-semibold text-sm sm:text-base text-gray-900">{option.bank}</div>
                  <div className="text-xs sm:text-sm text-gray-600 mt-1 break-all">CBU: {option.cbu}</div>
                  <div className="text-xs sm:text-sm text-[#003c6f] font-medium mt-1">Alias: {option.alias}</div>
                </div>
                {selectedCBU === option.cbu && (
                  <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-[#003c6f] flex-shrink-0" />
                )}
              </div>
            </button>
          ))}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4 mt-3 sm:mt-4">
            <p className="text-xs sm:text-sm text-blue-800">
              <strong>Importante:</strong> {t('checkout.transferImportant')}
            </p>
          </div>
        </div>
      )}

      {selectedMethod === 'cash' && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 sm:p-4">
          <p className="text-xs sm:text-sm text-amber-800">
            <strong>Nota:</strong> {t('checkout.cashNote')}
          </p>
        </div>
      )}

      {selectedMethod === 'mercadopago' && (
        <div className="pt-3 sm:pt-4 border-t">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 sm:p-4">
            <p className="text-xs sm:text-sm text-gray-700">
              {t('checkout.mpRedirect')}
            </p>
          </div>
        </div>
      )}

      <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3 pt-4">
        <Button
          onClick={onBack}
          variant="outline"
          className="w-full sm:flex-1 border-[#003c6f] text-[#003c6f] hover:bg-[#003c6f]/10"
          size="lg"
          disabled={isLoading}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> {t('checkout.back')}
        </Button>
        <Button
          onClick={handleContinue}
          className="w-full sm:flex-1 bg-[#003c6f] hover:bg-[#002b50] text-white"
          size="lg"
          disabled={isLoading || !canContinue()}
        >
          {isLoading ? t('checkout.processing') : t('checkout.confirmOrder')}
        </Button>
      </div>
    </div>
  );
}
