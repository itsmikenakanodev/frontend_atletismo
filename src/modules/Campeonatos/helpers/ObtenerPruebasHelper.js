import axios from "axios";
import { getApiUrl } from "@/utils/apiUtil.js";

// Fachada
export const obtenerPruebasFachada = async () => {
  try {
    return await obtenerPruebasApi();
  } catch (error) {
    console.error("Error al obtener pruebas:", error);
    throw error; 
  }
};

export const obtenerPruebasDadoCampeonatoFachada = async (campeonatoId) => {
  try {
    return await obtenerPruebasDadoCampeonato(campeonatoId);
  } catch (error) {
    console.error(`Error al obtener pruebas para el campeonato ${campeonatoId}:`, error);
    throw error; 
  }
};

// Consumir
const obtenerPruebasApi = async () => {
  try {
    const url = getApiUrl('pruebas');
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Error en la llamada API para obtener pruebas:", error);
    throw error; 
  }
};

const obtenerPruebasDadoCampeonato = async (campeonatoId) => {
  try {
    const url = getApiUrl(`campeonatosPruebas/${campeonatoId}/campeonato`);
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error(`Error en la llamada API para obtener pruebas del campeonato ${campeonatoId}:`, error);
    throw error; 
  }
};
