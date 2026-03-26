export interface Addon {
  id: number;
  name: string;
  author?: string;
  version?: string;
  category?: string;
  esoui_link?: string;
  install_date?: string;
  last_updated?: string;
  is_active: boolean;
  personal_notes?: string;
  rating?: number;
}

export interface CreateAddonRequest {
  name: string;
  author?: string;
  version?: string;
  category?: string;
  esoui_link?: string;
  install_date?: string;
  last_updated?: string;
  is_active: boolean;
  personal_notes?: string;
  rating?: number;
}

export interface ApiError {
  detail: string;
}