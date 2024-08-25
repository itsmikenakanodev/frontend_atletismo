import axios from "axios";
import { getApiUrl } from "@/utils/apiUtil.js";

// Definir la URL base
const url = getApiUrl("auth/registro"); 

// Fachada
export const guardarUsuarioFachada = async (bodyUsuario) => {
  try {
    return await guardarUsuario(bodyUsuario);
  } catch (error) {
    console.error("Error al guardar el usuario:", error);
    throw error;
  }
};

// Consumir
const guardarUsuario = async (bodyUsuario) => {
  try {
    const response = await axios.post(url, bodyUsuario);
    return response.data;
  } catch (error) {
    console.error("Error en la llamada API para guardar el usuario:", error);
    throw error;
  }
};
