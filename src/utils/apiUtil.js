const API_URL = "http://localhost:8080/API/Atletismo";

export function getApiUrl(endpoint) {
    return `${API_URL}/${endpoint}`;
  } 