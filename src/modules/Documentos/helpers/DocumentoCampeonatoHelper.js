import axios from "axios";
import { getApiUrl } from "@/utils/apiUtil.js";

// Fachada
export const obtenerDocumentosPorCampeonatoFachada = async (campeonatoId) => {
  try {
    return await obtenerDocumentosPorCampeonatoApi(campeonatoId);
  } catch (error) {
    console.error("Error al obtener documentos del campeonato:", error);
    throw error;
  }
};

// Consumir
const obtenerDocumentosPorCampeonatoApi = async (campeonatoId) => {
  try {
    const url = getApiUrl(`documentos/campeonatos/campeonato/${campeonatoId}`);
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Error en la llamada API para obtener documentos del campeonato:", error);
    throw error;
  }
};
