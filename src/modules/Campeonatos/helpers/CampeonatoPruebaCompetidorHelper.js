import axios from "axios";
import { getApiUrl } from "@/utils/apiUtil.js";

// Fachada
export const registroCampeonatoPruebaCompetidorFachada = async (cuerpoCPC) => {
  try {
    const url = getApiUrl("competidores");
    const response = await registroCampeonatoPruebaCompetidor(url, cuerpoCPC);
    return response;
  } catch (error) {
    console.error("Error registrando campeonato prueba competidor:", error);
    throw error; // Re-lanzar el error para que pueda ser manejado en el componente
  }
};

// Consumir
const registroCampeonatoPruebaCompetidor = async (url, cuerpoCPC) => {
  try {
    const response = await axios.post(url, cuerpoCPC);
    return response.data;
  } catch (error) {
    console.error("Error en la llamada API para registrar campeonato prueba competidor:", error);
    throw error; // Re-lanzar el error para que pueda ser manejado en `registroCampeonatoPruebaCompetidorFachada`
  }
};

export const registroPruebasCompetidorFachada = async (cuerpoCPC) => {
  try {
    const url = getApiUrl("resultados");
    const response = await registroPruebasCompetidor(url, cuerpoCPC);
    return response;
  } catch (error) {
    console.error("Error registrando campeonato prueba competidor:", error);
    throw error; // Re-lanzar el error para que pueda ser manejado en el componente
  }
};

// Consumir
const registroPruebasCompetidor = async (url, cuerpoCPC) => {
  try {
    const response = await axios.post(url, cuerpoCPC);
    return response.data;
  } catch (error) {
    console.error("Error en la llamada API para registrar campeonato prueba competidor:", error);
    throw error; // Re-lanzar el error para que pueda ser manejado en `registroCampeonatoPruebaCompetidorFachada`
  }
};
