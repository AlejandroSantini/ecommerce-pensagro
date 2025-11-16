import React, { useState } from 'react';
import type { FC } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { ChevronDown, ChevronUp, MapPin, Phone, Clock, Check } from 'lucide-react';

// Tipo basado en el JSON que compartiste
export interface PickupPoint {
  point_id: number;
  description: string;
  open_hours: string | null;
  phone: string | null;
  location: {
    street: string | null;
    street_number: string | null;
    street_extras: string | null;
    city: string | null;
    state: string | null;
    zipcode: string | null;
    geolocation: {
      lat: number;
      lng: number;
      distance: number;
    };
  };
}

export interface ShippingOption {
  carrier: string;
  service_type: string;
  delivery_days: string;
  estimated_delivery: string | null;
  price_incl_tax: number;
  tags: string[];
  pickup_points: PickupPoint[];
}

export interface ShippingQuoteApiResponse {
  status: boolean;
  postal_code?: string;
  best_price?: number;
  best_carrier?: string;
  options: ShippingOption[];
}

interface Props {
  response: ShippingQuoteApiResponse | null;
  onSelect?: (option: ShippingOption) => void;
  selectedOption?: ShippingOption | null;
}

const formatCurrency = (value: number) => {
  try {
    return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(value);
  } catch {
    return `$${value.toLocaleString('es-AR')}`;
  }
};

const ShippingOptions: FC<Props> = ({ response, onSelect, selectedOption }) => {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState<Record<number, boolean>>({});

  if (!response) return null;

  const isSelected = (opt: ShippingOption) => {
    return selectedOption?.carrier === opt.carrier && 
           selectedOption?.service_type === opt.service_type &&
           selectedOption?.price_incl_tax === opt.price_incl_tax;
  };

  return (
    <div className="space-y-4 mt-4">
      {response.best_carrier && response.best_price && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-800">
            <strong>{t('checkout.bestOption')}:</strong> {response.best_carrier} — {formatCurrency(response.best_price)}
          </p>
        </div>
      )}

      <div className="space-y-3">
        {response.options && response.options.length > 0 ? (
          response.options.map((opt, idx) => {
            const selected = isSelected(opt);
            return (
              <button
                key={`${opt.carrier}-${idx}`}
                onClick={() => onSelect && onSelect(opt)}
                className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                  selected
                    ? 'border-[#003c6f] bg-[#003c6f]/5'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-semibold text-gray-900">{opt.carrier}</h4>
                      {opt.tags && opt.tags.length > 0 && (
                        <div className="flex gap-1">
                          {opt.tags.map((tag) => (
                            <span key={tag} className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-1">{opt.service_type}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {opt.delivery_days} {t('checkout.deliveryDays')}
                      </span>
                      {opt.estimated_delivery && (
                        <span>
                          {t('checkout.estimatedDelivery')}: {new Date(opt.estimated_delivery).toLocaleDateString('es-AR')}
                        </span>
                      )}
                    </div>

                    {opt.pickup_points && opt.pickup_points.length > 0 && (
                      <div className="mt-3">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setExpanded((s) => ({ ...s, [idx]: !s[idx] }));
                          }}
                          className="flex items-center gap-1 text-sm text-[#003c6f] hover:underline"
                        >
                          {expanded[idx] ? (
                            <>
                              <ChevronUp className="w-4 h-4" />
                              {t('checkout.hidePickupPoints')}
                            </>
                          ) : (
                            <>
                              <ChevronDown className="w-4 h-4" />
                              {t('checkout.showPickupPoints')} ({opt.pickup_points.length})
                            </>
                          )}
                        </button>

                        {expanded[idx] && (
                          <div className="mt-3 space-y-2 pl-4 border-l-2 border-gray-200">
                            {opt.pickup_points.slice(0, 3).map((p) => (
                              <div key={p.point_id} className="text-sm">
                                <div className="font-medium text-gray-900">{p.description}</div>
                                <div className="flex items-start gap-1 text-gray-600 text-xs mt-1">
                                  <MapPin className="w-3 h-3 mt-0.5 flex-shrink-0" />
                                  <span>
                                    {p.location.street} {p.location.street_number}, {p.location.city}, {p.location.state}
                                  </span>
                                </div>
                                {p.phone && (
                                  <div className="flex items-center gap-1 text-gray-600 text-xs mt-0.5">
                                    <Phone className="w-3 h-3" />
                                    <span>{p.phone}</span>
                                  </div>
                                )}
                              </div>
                            ))}
                            {opt.pickup_points.length > 3 && (
                              <p className="text-xs text-gray-500 italic">
                                +{opt.pickup_points.length - 3} puntos más disponibles
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <div className="text-xl font-bold text-[#003c6f]">
                      {formatCurrency(opt.price_incl_tax)}
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                      selected ? 'border-[#003c6f] bg-[#003c6f]' : 'border-gray-300'
                    }`}>
                      {selected && <Check className="w-3 h-3 text-white" />}
                    </div>
                  </div>
                </div>
              </button>
            );
          })
        ) : (
          <div className="p-4 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-lg text-center">
            {t('checkout.noShippingOptions')}
          </div>
        )}
      </div>
    </div>
  );
};

export default ShippingOptions;
