import axios from "axios";
import { getApiUrl } from "@/utils/apiUtil.js";

// Fachada
export const enviarcorreoFachada = async (cuerpoCorreo) => {
  try {
    return await enviarCorreoApi(cuerpoCorreo);
  } catch (error) {
    console.error("Error al enviar el correo:", error);
    throw error;
  }
};

// Consumir
const enviarCorreoApi = async (cuerpoCorreo) => {
  const url = getApiUrl('emails/sendNotif');
  try {
    const response = await axios.post(url, cuerpoCorreo);
    return response.data;
  } catch (error) {
    console.error("Error en la llamada API para enviar correo:", error);
    throw error;
  }
};
