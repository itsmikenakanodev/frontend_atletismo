import axios from "axios";
import { getApiUrl } from "@/utils/apiUtil.js";

// Fachada
export const recuperarContraseniaFachada = async (correo, password) => {
  try {
    return await recuperarContrasenia(correo, password);
  } catch (error) {
    console.error("Error al recuperar la contraseña:", error);
    throw error;
  }
};

// Consumir
const recuperarContrasenia = async (correo, password) => {
  const url = getApiUrl('auth/recuperarPass');
  try {
    const response = await axios.put(url, null, {
      params: { correo, password }
    });
    return response.data;
  } catch (error) {
    console.error("Error en la llamada API para recuperar contraseña:", error);
    if (error.response && error.response.status === 400) {
      return false;
    } else {
      throw error; 
    }
  }
};
