import axios from "axios";
import { getApiUrl } from "@/utils/apiUtil.js";

// Fachada
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

export const obtenerCampeonatosSinPruebasFachada = async () => {
  try {
    return await obtenerCampeonatosSinPruebas();
  } catch (error) {
    console.error("Error obteniendo campeonatos sin pruebas:", error);
    throw error;
  }
};

// Consumir
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

const obtenerCampeonatosSinPruebas = async () => {
  try {
    const url = getApiUrl(`campeonatos/dto/ligero`);
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Error en la llamada API para obtener campeonatos sin pruebas:", error);
    throw error;
  }
};
