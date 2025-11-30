'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { popupService } from '@/services';
import type { Popup } from '@/types/popup';

export function WelcomeModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [popup, setPopup] = useState<Popup | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPopup = async () => {
      // Verificar si el modal ya fue mostrado en esta sesión
      const hasSeenModal = sessionStorage.getItem('welcomeModalSeen');
      
      if (hasSeenModal) {
        setIsLoading(false);
        return;
      }

      try {
        const activePopups = await popupService.getActive();
        
        if (activePopups.length > 0) {
          // Tomar el primer popup activo
          setPopup(activePopups[0]);
          
          // Mostrar el modal después de 1 segundo
          setTimeout(() => {
            setIsOpen(true);
          }, 1000);
        }
      } catch (error) {
        console.error('Error fetching popup:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPopup();
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem('welcomeModalSeen', 'true');
  };

  const handleClick = () => {
    if (popup?.link) {
      if (popup.openType === 'new_tab') {
        window.open(popup.link, '_blank');
      } else {
        window.location.href = popup.link;
      }
      handleClose();
    }
  };

  if (!isOpen || !popup || isLoading) return null;

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
          className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden animate-in zoom-in-95 duration-300 relative"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Botón cerrar */}
          <button
            onClick={handleClose}
            className="absolute top-3 right-3 z-10 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg text-gray-600 hover:text-gray-900 transition-all"
            aria-label="Cerrar"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Contenido del popup */}
          {popup.contentType === 'image' && popup.imageUrl ? (
            <div 
              className={popup.link ? 'cursor-pointer' : ''}
              onClick={popup.link ? handleClick : undefined}
            >
              <img
                src={popup.imageUrl}
                alt="Promoción"
                className="w-full h-auto max-h-[80vh] object-contain"
              />
            </div>
          ) : popup.contentType === 'text' && popup.textContent ? (
            <div className="p-8">
              <div 
                className={`prose prose-lg max-w-none ${popup.link ? 'cursor-pointer' : ''}`}
                onClick={popup.link ? handleClick : undefined}
                dangerouslySetInnerHTML={{ __html: popup.textContent }}
              />
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
}
