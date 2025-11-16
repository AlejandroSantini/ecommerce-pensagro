// Popup Types
export interface ApiPopup {
  id: string;
  content_type: 'image' | 'text';
  link: string;
  open_type: 'new_tab' | 'same_tab';
  status: 'active' | 'inactive';
  image_url?: string;
  text_content?: string;
}

export interface ApiPopupsResponse {
  status: boolean;
  data: ApiPopup[];
}

export interface Popup {
  id: string;
  contentType: 'image' | 'text';
  link: string;
  openType: 'new_tab' | 'same_tab';
  status: 'active' | 'inactive';
  imageUrl?: string;
  textContent?: string;
}
