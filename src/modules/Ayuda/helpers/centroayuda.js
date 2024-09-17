import axios from "axios";
import { getApiUrl } from "@/utils/apiUtil.js";

// Fachada
export const insertarMensajeFachada = async (mensajeDTO) => {
  try {
    return await insertarMensajeApi(mensajeDTO);
  } catch (error) {
    console.error("Error al insertar el mensaje:", error);
    throw error;
  }
};

export const actualizarMensajeFachada = async (mensajeDTO) => {
  try {
    return await actualizarMensajeApi(mensajeDTO);
  } catch (error) {
    console.error("Error al actualizar el mensaje:", error);
    throw error;
  }
};

export const eliminarMensajeFachada = async (id) => {
  try {
    return await eliminarMensajeApi(id);
  } catch (error) {
    console.error("Error al eliminar el mensaje:", error);
    throw error;
  }
};

export const buscarMensajeFachada = async (id) => {
  try {
    return await buscarMensajeApi(id);
  } catch (error) {
    console.error("Error al buscar el mensaje:", error);
    throw error;
  }
};

export const buscarMensajesPorEmailFachada = async (email) => {
  try {
    return await buscarMensajesPorEmailApi(email);
  } catch (error) {
    console.error("Error al buscar mensajes por email:", error);
    throw error;
  }
};

export const obtenerMensajesFachada = async () => {
  try {
    return await obtenerMensajesApi();
  } catch (error) {
    console.error("Error al obtener los mensajes:", error);
    throw error;
  }
};

// Consumir
const obtenerMensajesApi = async () => {
  const url = getApiUrl('mensajes');
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Error en la llamada API para obtener mensajes:", error);
    throw error;
  }
};

const insertarMensajeApi = async (mensajeDTO) => {
  const url = getApiUrl('mensajes');
  try {
    const response = await axios.post(url, mensajeDTO);
    return response.data;
  } catch (error) {
    console.error("Error en la llamada API para insertar mensaje:", error);
    throw error;
  }
};

const actualizarMensajeApi = async (mensajeDTO) => {
  const url = getApiUrl('mensajes');
  try {
    const response = await axios.put(url, mensajeDTO);
    return response.data;
  } catch (error) {
    console.error("Error en la llamada API para actualizar mensaje:", error);
    throw error;
  }
};

const eliminarMensajeApi = async (id) => {
  const url = getApiUrl(`mensajes/${id}`);
  try {
    const response = await axios.delete(url);
    return response.data;
  } catch (error) {
    console.error("Error en la llamada API para eliminar mensaje:", error);
    throw error;
  }
};

const buscarMensajeApi = async (id) => {
  const url = getApiUrl(`mensajes/${id}`);
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Error en la llamada API para buscar mensaje:", error);
    throw error;
  }
};

const buscarMensajesPorEmailApi = async (email) => {
  const url = getApiUrl(`mensajes/email/${email}`);
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Error en la llamada API para buscar mensajes por email:", error);
    throw error;
  }
};
