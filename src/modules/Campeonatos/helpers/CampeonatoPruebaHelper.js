import axios from "axios";
import { getApiUrl } from "@/utils/apiUtil.js";

// Crear (POST)
export const registroCampeonatoPruebaFachada = async (cuerpoCP) => {
  try {
    const url = getApiUrl("campeonatosPruebas");
    const response = await registroCampeonatoPrueba(url, cuerpoCP);
    return response;
  } catch (error) {
    console.error("Error registrando campeonato prueba:", error);
    throw error;
  }
};

const registroCampeonatoPrueba = async (url, cuerpoCP) => {
  try {
    const response = await axios.post(url, cuerpoCP);
    return response.data;
  } catch (error) {
    console.error("Error en la llamada API para registrar campeonato prueba:", error);
    throw error;
  }
};

// Leer por ID (GET)
export const obtenerCampeonatoPruebaFachada = async (id) => {
  try {
    const url = getApiUrl(`campeonatosPruebas/${id}`);
    const response = await obtenerCampeonatoPrueba(url);
    return response;
  } catch (error) {
    console.error("Error obteniendo campeonato prueba:", error);
    throw error;
  }
};

const obtenerCampeonatoPrueba = async (url) => {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Error en la llamada API para obtener campeonato prueba:", error);
    throw error;
  }
};

// Actualizar (PUT)
export const actualizarCampeonatoPruebaFachada = async (id, cuerpoCP) => {
  try {
    const url = getApiUrl(`campeonatosPruebas/${id}`);
    const response = await actualizarCampeonatoPrueba(url, cuerpoCP);
    return response;
  } catch (error) {
    console.error("Error actualizando campeonato prueba:", error);
    throw error;
  }
};

const actualizarCampeonatoPrueba = async (url, cuerpoCP) => {
  try {
    const response = await axios.put(url, cuerpoCP);
    return response.data;
  } catch (error) {
    console.error("Error en la llamada API para actualizar campeonato prueba:", error);
    throw error;
  }
};

// Eliminar (DELETE)
export const eliminarCampeonatoPruebaFachada = async (id) => {
  try {
    const url = getApiUrl(`campeonatosPruebas/${id}`);
    const response = await eliminarCampeonatoPrueba(url);
    return response;
  } catch (error) {
    console.error("Error eliminando campeonato prueba:", error);
    throw error;
  }
};

const eliminarCampeonatoPrueba = async (url) => {
  try {
    const response = await axios.delete(url);
    return response.data;
  } catch (error) {
    console.error("Error en la llamada API para eliminar campeonato prueba:", error);
    throw error;
  }
};

// Obtener todos (GET)
export const obtenerTodosCampeonatosPruebasFachada = async () => {
  try {
    const url = getApiUrl("campeonatosPruebas");
    const response = await obtenerTodosCampeonatosPruebas(url);
    return response;
  } catch (error) {
    console.error("Error obteniendo todos los campeonatos pruebas:", error);
    throw error;
  }
};

const obtenerTodosCampeonatosPruebas = async (url) => {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Error en la llamada API para obtener todos los campeonatos pruebas:", error);
    throw error;
  }
};

// Eliminar (DELETE) - por campeonatoId y pruebaId
export const eliminarCampeonatoPruebaFachada2 = async (campeonatoId, pruebaId) => {
  try {
    const url = getApiUrl(`campeonatosPruebas/${pruebaId}/${campeonatoId}`); // Construir URL con ambos IDs
    const response = await eliminarCampeonatoPrueba2(url);
    return response;
  } catch (error) {
    console.error("Error eliminando campeonato prueba:", error);
    throw error;
  }
};

const eliminarCampeonatoPrueba2 = async (url) => {
  try {
    const response = await axios.delete(url);
    return response.data;
  } catch (error) {
    console.error("Error en la llamada API para eliminar campeonato prueba:", error);
    throw error;
  }
};
