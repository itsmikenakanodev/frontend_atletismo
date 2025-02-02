import axios from "axios";
import { getApiUrl } from "@/utils/apiUtil.js";

// Fachada
export const obtenerCampeonatosAsignablesFachada = async (ciudad) => {
  try {
    return await obtenerCampeonatosAsignablesApi(ciudad);
  } catch (error) {
    console.error("Error obteniendo campeonatos:", error);
    throw error;
  }
};

export const obtenerCampeonatosFachada = async (ciudad) => {
  try {
    return await obtenerCampeonatosApi(ciudad);
  } catch (error) {
    console.error("Error obteniendo campeonatos:", error);
    throw error;
  }
};

export const obtenerCampeonatoFachada = async (id) => {
  try {
    return await obtenerCampeonato(id);
  } catch (error) {
    console.error("Error obteniendo campeonato:", error);
    throw error;
  }
};

export const obtenerCampeonatosSinPruebasFachada = async (anio, mes) => {
  try {
    console.log("Fachada recibió parámetros - año:", anio, "mes:", mes); // Para depuración
    return await obtenerCampeonatosSinPruebas(anio, mes);
  } catch (error) {
    console.error("Error obteniendo campeonatos sin pruebas:", error);
    throw error;
  }
};

// Consumir
const obtenerCampeonatosAsignablesApi = async (ciudad) => {
  try {
    const url = getApiUrl(`campeonatos/campeonatos-para-asignar-pruebas/${ciudad}`);
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Error en la llamada API para obtener campeonatos:", error);
    throw error;
  }
};

const obtenerCampeonatosApi = async (ciudad) => {
  try {
    const url = getApiUrl(`campeonatos/dto/${ciudad}`);
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Error en la llamada API para obtener campeonatos:", error);
    throw error;
  }
};

const obtenerCampeonato = async (id) => {
  try {
    const url = getApiUrl(`campeonatos/dtoid/${id}`);
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Error en la llamada API para obtener campeonato:", error);
    throw error;
  }
};

const obtenerCampeonatosSinPruebas = async (anio, mes) => {
  try {
    // Validar que los parámetros no sean undefined
    if (!anio || !mes) {
      console.error('Año o mes no definidos:', { anio, mes });
      throw new Error('Año y mes son requeridos');
    }

    const url = getApiUrl(`campeonatos/campeonatos-sin-pruebas`);
    console.log('URL de la petición:', url + `?anio=${anio}&mes=${mes}`);
    
    const response = await axios.get(url + `?anio=${anio}&mes=${mes}`);
    return response.data;
  } catch (error) {
    console.error("Error en la llamada API para obtener campeonatos sin pruebas:", error);
    throw error;
  }
};
