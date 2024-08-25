import axios from "axios";
import { getApiUrl } from "@/utils/apiUtil.js";

// Fachada
export const obtenerUsuarioFachada = async (bodyUsuario) => {
  try {
    return await obtenerUsuario(bodyUsuario);
  } catch (error) {
    console.error("Error al obtener usuario:", error);
    throw error;
  }
};

// Consumir
const obtenerUsuario = async (bodyUsuario) => {
  const url = getApiUrl("auth/login"); 
  try {
    const response = await axios.post(url, {
      email: bodyUsuario.email,
      password: bodyUsuario.password,
    });
    return response.data;
  } catch (error) {
    console.error("Error en la llamada API para obtener usuario:", error);
    throw error;
  }
};
