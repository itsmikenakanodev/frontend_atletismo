const API_URL = import.meta.env.VITE_API_URL;

export function getApiUrl(endpoint) {
    return `${API_URL}/${endpoint}`;
  } 