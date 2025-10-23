import { Truck, ShieldCheck, CreditCard, LifeBuoy } from 'lucide-react';

export function FeatureSection() {
  const features = [
    {
      icon: <Truck className="h-10 w-10 text-[#003c6f]" />,
      title: 'Envíos a Todo el País',
      description: 'Entrega rápida y segura en toda Argentina',
    },
    {
      icon: <ShieldCheck className="h-10 w-10 text-[#003c6f]" />,
      title: 'Compra Segura',
      description: 'Tus datos siempre protegidos',
    },
    {
      icon: <CreditCard className="h-10 w-10 text-[#003c6f]" />,
      title: 'Múltiples Formas de Pago',
      description: 'Tarjetas, transferencias y más',
    },
    {
      icon: <LifeBuoy className="h-10 w-10 text-[#003c6f]" />,
      title: 'Soporte 24/7',
      description: 'Estamos para ayudarte siempre que lo necesites',
    },
  ];

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
          ¿Por Qué Elegirnos?
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
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}