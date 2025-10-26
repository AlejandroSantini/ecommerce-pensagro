'use client';

import { useState, useEffect } from 'react';
import { X, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTranslation } from '@/hooks/useTranslation';

export function WelcomeModal() {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    // Verificar si el modal ya fue mostrado en esta sesión
    const hasSeenModal = sessionStorage.getItem('welcomeModalSeen');
    
    if (!hasSeenModal) {
      // Mostrar el modal después de 1 segundo
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem('welcomeModalSeen', 'true');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) return;

    setIsSubmitting(true);

    // Simular envío (aquí conectarías con tu backend o servicio de email)
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      
      // Guardar email en localStorage (opcional)
      localStorage.setItem('subscribedEmail', email);
      
      // Cerrar modal después de 2 segundos
      setTimeout(() => {
        handleClose();
      }, 2000);
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] transition-opacity"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
        <div 
          className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full overflow-hidden animate-in zoom-in-95 duration-300"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="grid md:grid-cols-2">
            {/* Imagen lateral */}
            <div className="hidden md:block relative h-full min-h-[400px]">
              <img
                src="/origen-carne-angus-prueba.jpg"
                alt="Ganadería"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#003c6f]/80 via-[#003c6f]/40 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <p className="text-sm font-medium mb-1">{t('home.welcomeModal.experience')}</p>
                <h3 className="text-2xl font-bold">{t('home.welcomeModal.tagline')}</h3>
              </div>
            </div>

            {/* Contenido */}
            <div className="p-8 md:p-10 relative">
              {/* Botón cerrar */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Cerrar"
              >
                <X className="h-6 w-6" />
              </button>

              {!isSubmitted ? (
                <>
                  <div className="mb-6">
                    <h2 className="text-3xl font-bold text-[#003c6f] mb-3">
                      {t('home.welcomeModal.title')}
                    </h2>
                    <p className="text-gray-600 leading-relaxed">
                      {t('home.welcomeModal.description').split('{discount}')[0]}
                      <span className="font-semibold text-[#003c6f]">{t('home.welcomeModal.discountAmount')}</span>
                      {t('home.welcomeModal.description').split('{discount}')[1]}
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        {t('home.welcomeModal.emailLabel')}
                      </label>
                      <div className="relative">
                        <Input
                          id="email"
                          type="email"
                          placeholder={t('home.welcomeModal.emailPlaceholder')}
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          className="pr-10 h-12"
                          disabled={isSubmitting}
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          <Send className="h-5 w-5 text-gray-400" />
                        </div>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full h-12 bg-[#003c6f] hover:bg-[#002b50] text-white font-semibold"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <span className="flex items-center justify-center">
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          {t('home.welcomeModal.submitting')}
                        </span>
                      ) : (
                        t('home.welcomeModal.submitButton')
                      )}
                    </Button>
                  </form>

                  <p className="text-xs text-gray-500 mt-4 text-center">
                    {t('home.welcomeModal.privacy')}
                  </p>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{t('home.welcomeModal.success.title')}</h3>
                  <p className="text-gray-600 text-center">
                    {t('home.welcomeModal.success.message')}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
