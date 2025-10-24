import { Truck, ShieldCheck, CreditCard, LifeBuoy } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

export function FeatureSection() {
  const { t } = useTranslation();
  
  const features = [
    {
      icon: <Truck className="h-10 w-10 text-[#003c6f]" />,
      titleKey: 'home.features.shipping.title',
      descriptionKey: 'home.features.shipping.description',
    },
    {
      icon: <ShieldCheck className="h-10 w-10 text-[#003c6f]" />,
      titleKey: 'home.features.quality.title',
      descriptionKey: 'home.features.quality.description',
    },
    {
      icon: <CreditCard className="h-10 w-10 text-[#003c6f]" />,
      titleKey: 'home.features.payment.title',
      descriptionKey: 'home.features.payment.description',
    },
    {
      icon: <LifeBuoy className="h-10 w-10 text-[#003c6f]" />,
      titleKey: 'home.features.support.title',
      descriptionKey: 'home.features.support.description',
    },
  ];

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
          {t('home.features.sectionTitle')}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="flex flex-col items-center text-center p-6 border border-gray-100 rounded-lg hover:shadow-md transition-shadow"
            >
              <div className="mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">
                {t(feature.titleKey)}
              </h3>
              <p className="text-gray-600">
                {t(feature.descriptionKey)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}