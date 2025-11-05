import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';

export default function ContactPage() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    mensaje: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simular envío
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({ nombre: '', email: '', mensaje: '' });
      
      setTimeout(() => {
        setIsSubmitted(false);
      }, 5000);
    }, 1000);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white py-16 text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold text-[#003c6f] mb-4">
            {t('contact.title')}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {t('contact.subtitle')}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
          <Card className="flex flex-col h-full">
            <div className="relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-[#003c6f]"></div>
            </div>
            <CardContent className="flex-grow">
              <h2 className="font-medium text-2xl text-gray-800 mb-6">
                {t('contact.ourInfo')}
              </h2>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-cyan-100 rounded-full flex items-center justify-center">
                    <MapPin className="h-6 w-6 text-cyan-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800 mb-2">{t('contact.address')}</h3>
                    <a 
                      href="https://maps.google.com/?q=Cochabamba+3236,+Martínez,+Buenos+Aires,+Argentina"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cyan-600 hover:text-cyan-700 font-medium mb-2 block text-sm"
                    >
                      {t('contact.viewOnMaps')}
                    </a>
                    <p className="text-gray-600 text-sm">
                      Cochabamba 3236, Martínez, Provincia de Buenos Aires, Argentina
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-cyan-100 rounded-full flex items-center justify-center">
                    <Phone className="h-6 w-6 text-cyan-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800 mb-2">{t('contact.phone')}</h3>
                    <a 
                      href="tel:+5491115606-3806"
                      className="text-cyan-600 hover:text-cyan-700 font-medium"
                    >
                      +54 9 11 5606-3806
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-cyan-100 rounded-full flex items-center justify-center">
                    <Mail className="h-6 w-6 text-cyan-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800 mb-2">{t('contact.email')}</h3>
                    <a 
                      href="mailto:ventas@pensagro.com.ar"
                      className="text-cyan-600 hover:text-cyan-700 font-medium text-sm"
                    >
                      ventas@pensagro.com.ar
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-cyan-100 rounded-full flex items-center justify-center">
                    <Clock className="h-6 w-6 text-cyan-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800 mb-2">{t('contact.hours')}</h3>
                    <p className="text-gray-600 text-sm">
                      {t('contact.weekdays')}: 08:00 - 16:00
                    </p>
                    <p className="text-gray-600 text-sm">
                      {t('contact.weekend')}: {t('contact.closed')}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="flex flex-col h-full">
            <div className="relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-[#003c6f]"></div>
            </div>
            <CardContent className="flex-grow">
              <h2 className="font-medium text-2xl text-gray-800 mb-6">
                {t('contact.sendMessage')}
              </h2>

              {isSubmitted && (
                <div className="mb-6 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg text-sm">
                  {t('contact.successMessage')}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="nombre" className="text-gray-800 font-medium mb-2 block text-sm">
                    {t('contact.name')}
                  </Label>
                  <Input
                    id="nombre"
                    name="nombre"
                    type="text"
                    placeholder={t('contact.namePlaceholder')}
                    value={formData.nombre}
                    onChange={handleChange}
                    required
                    className="h-11"
                  />
                </div>

                <div>
                  <Label htmlFor="email" className="text-gray-800 font-medium mb-2 block text-sm">
                    {t('contact.email')}
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder={t('contact.emailPlaceholder')}
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="h-11"
                  />
                </div>

                <div>
                  <Label htmlFor="mensaje" className="text-gray-800 font-medium mb-2 block text-sm">
                    {t('contact.message')}
                  </Label>
                  <textarea
                    id="mensaje"
                    name="mensaje"
                    rows={5}
                    placeholder={t('contact.messagePlaceholder')}
                    value={formData.mensaje}
                    onChange={handleChange}
                    required
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#003c6f] focus:outline-none focus:ring-2 focus:ring-[#003c6f]/20"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-11 bg-[#003c6f] hover:bg-[#002b50] text-white font-medium"
                >
                  {isSubmitting ? t('contact.sending') : t('contact.sendButton')}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="mt-16 max-w-6xl mx-auto">
          <Card>
            <CardContent className="p-3">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3287.8616066!2d-58.5133!3d-34.4939!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95bcb0c8c0c0c0c0%3A0x0!2sCochabamba%203236%2C%20Mart%C3%ADnez%2C%20Buenos%20Aires!5e0!3m2!1ses!2sar!4v1234567890"
                width="100%"
                height="450"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="rounded"
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
