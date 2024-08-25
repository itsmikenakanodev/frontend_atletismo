import axios from "axios";
import { getApiUrl } from "@/utils/apiUtil.js";

// Fachada
export const registroCompetidorFachada = async (cuerpoCompetidor) => {
  try {
    return await registroCompetidor(cuerpoCompetidor);
  } catch (error) {
    console.error("Error registrando competidor:", error);
    throw error;
  }
};

// Consumir
const registroCompetidor = async (cuerpoCompetidor) => {
  try {
    const url = getApiUrl('competidores/id'); // Ajusta la ruta si es necesario
    const response = await axios.post(url, cuerpoCompetidor);
    return response.data;
  } catch (error) {
    console.error("Error en la llamada API para registrar competidor:", error);
    throw error;
  }
};
