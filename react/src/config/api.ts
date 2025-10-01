const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";

export const API_ENDPOINTS = {
  USERS: `${API_BASE_URL}/users`,
  IMAGES: `${API_BASE_URL}/images`,
  PALETTES: `${API_BASE_URL}/palettes`,
  PROGRESS: `${API_BASE_URL}/progress`,
} as const;

export { API_BASE_URL };
