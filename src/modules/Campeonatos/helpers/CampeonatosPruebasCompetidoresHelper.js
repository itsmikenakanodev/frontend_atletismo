import axios from "axios";
import { getApiUrl } from "@/utils/apiUtil.js";

// Fachada
export const obtenerCampeonatosPruebasCompetidoresFachada = async () => {
  try {
    return await obtenerCampeonatosPruebasCompetidoresApi();
  } catch (error) {
    console.error("Error obteniendo campeonatos, pruebas y competidores:", error);
    throw error;
  }
};

export const obtenerCompetidoresDadoCampeonatoyPruebaFachada = async (campeonatoId, pruebaId) => {
  try {
    return await obtenerCompetidoresDadoCampeonatoyPrueba(campeonatoId, pruebaId);
  } catch (error) {
    console.error("Error obteniendo competidores dado campeonato y prueba:", error);
    throw error;
  }
};

// Consumir
const obtenerCampeonatosPruebasCompetidoresApi = async () => {
  try {
    const url = getApiUrl('campeonatosPruebasCompetidores');
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Error en la llamada API para obtener campeonatos, pruebas y competidores:", error);
    throw error;
  }
};

const obtenerCompetidoresDadoCampeonatoyPrueba = async (campeonatoId, pruebaId) => {
  try {
    const url = getApiUrl(`campeonatosPruebasCompetidores/competidores/${campeonatoId}/${pruebaId}`);
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Error en la llamada API para obtener competidores dado campeonato y prueba:", error);
    throw error;
  }
};
