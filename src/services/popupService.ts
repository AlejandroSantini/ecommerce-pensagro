import { api } from '@/lib/api';
import type { ApiPopup, ApiPopupsResponse, Popup } from '@/types/popup';

// Función para mapear ApiPopup a Popup
const mapApiPopupToPopup = (apiPopup: ApiPopup): Popup => {
  return {
    id: apiPopup.id,
    contentType: apiPopup.content_type,
    link: apiPopup.link,
    openType: apiPopup.open_type,
    status: apiPopup.status,
    imageUrl: apiPopup.image_url,
    textContent: apiPopup.text_content,
  };
};

export const popupService = {
  // GET /api/popups - Obtener todos los popups activos
  getAll: async (): Promise<Popup[]> => {
    const response = await api.get<ApiPopupsResponse>('/api/popups');
    return response.data.map(mapApiPopupToPopup);
  },

  // GET /api/popups - Obtener solo popups activos
  getActive: async (): Promise<Popup[]> => {
    const popups = await popupService.getAll();
    return popups.filter(popup => popup.status === 'active');
  },
};
