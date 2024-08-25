import axios from "axios";
import { getApiUrl } from "@/utils/apiUtil.js";

// Fachada
export const obtenerUsuarioFachada = async (bodyUsuario) => {
  return await obtenerUsuario(bodyUsuario);
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
    console.log(error);
  }
};
