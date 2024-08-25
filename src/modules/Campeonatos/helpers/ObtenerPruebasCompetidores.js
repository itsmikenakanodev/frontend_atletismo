import axios from "axios";
import { getApiUrl } from "@/utils/apiUtil.js";

// Fachada
export const obtenerCampeonatosPruebasFachada = async () => {
  try {
    return await obtenerCampeonatosPruebasApi();
  } catch (error) {
    console.error("Error al obtener campeonatos y pruebas:", error);
    throw error; 
  }
};

// Consumir
const obtenerCampeonatosPruebasApi = async () => {
  try {
    const url = getApiUrl("competidoresPruebas");
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Error en la llamada API para obtener campeonatos y pruebas:", error);
    throw error; 
  }
};
