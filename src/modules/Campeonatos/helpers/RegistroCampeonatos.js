import axios from "axios";
import { getApiUrl } from "@/utils/apiUtil.js";

// Fachada
export const registroCampeonatosFachada = async (cuerpoCampeonato) => {
  try {
    return await registroCampeonatosApi(cuerpoCampeonato);
  } catch (error) {
    console.error("Error al registrar campeonato:", error);
    throw error;
  }
};

export const actualizarCampeonatosFachada = async (cuerpoCampeonato) => {
  try {
    return await actualizarCampeonatosApi(cuerpoCampeonato);
  } catch (error) {
    console.error("Error al actualizar campeonato:", error);
    throw error;
  }
};

export const consultarAdminsFachada = async () => {
  try {
    return await consultarAdmins();
  } catch (error) {
    console.error("Error al consultar administradores:", error);
    throw error;
  }
};

// Consumir
const registroCampeonatosApi = async (cuerpoCampeonato) => {
  try {
    const url = getApiUrl('campeonatos');
    const response = await axios.post(url, cuerpoCampeonato);
    return response.data;
  } catch (error) {
    console.error("Error en la llamada API para registrar campeonato:", error);
    throw error;
  }
};

const actualizarCampeonatosApi= async (cuerpoCampeonato) => {
  try {
    const url = getApiUrl('campeonatos/');
    const response = await axios.put(url, cuerpoCampeonato);
    return response.data;
  } catch (error) {
    console.error("Error en la llamada API para actualizar campeonato:", error);
    throw error;
  }
};

const consultarAdmins = async () => {
  try {
    const url = getApiUrl('usuarios/admins');
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Error en la llamada API para consultar administradores:", error);
    throw error;
  }
};
