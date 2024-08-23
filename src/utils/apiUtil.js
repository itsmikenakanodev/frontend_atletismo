const API_URL = "https://atletismonacional.azurewebsites.net/API/Atletismo";

export function getApiUrl(endpoint) {
    return `${API_URL}/${endpoint}`;
  }
  