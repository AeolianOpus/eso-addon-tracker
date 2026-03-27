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
  has_custom_changes: boolean;
  code_line_range?: string;
  original_code?: string;
  modified_code?: string;
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
  has_custom_changes: boolean;
  code_line_range?: string;
  original_code?: string;
  modified_code?: string;
}

export interface ApiError {
  detail: string;
}