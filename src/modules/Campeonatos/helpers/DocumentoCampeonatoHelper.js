import axios from "axios";
import { getApiUrl } from "@/utils/apiUtil.js";

// Fachada
export const guardarDocCampeonatosFachada = async (cuerpoCampeonato) => {
  try {
    return await guardarDocCampeonatosApi(cuerpoCampeonato);
  } catch (error) {
    console.error("Error al registrar documento del campeonato:", error);
    throw error;
  }
};

export const eliminarDocCampeonatosFachada = async (id) => {
    try {
      return await eliminarDocCampeonatosApi(id);
    } catch (error) {
      console.error("Error al eliminar documento del campeonato:", error);
      throw error;
    }
  };

// Consumir
const guardarDocCampeonatosApi = async (cuerpoCampeonato) => {
  try {
    const url = getApiUrl('documentos/campeonatos');
    const response = await axios.post(url, cuerpoCampeonato);
    return response.data;
  } catch (error) {
    console.error("Error en la llamada API para guardar documento en el campeonato:", error);
    throw error;
  }
};

const eliminarDocCampeonatosApi = async (idCampeonato) => {
    try {
      const url = getApiUrl('documentos/campeonatos');
      const response = await axios.delete(url+`/${idCampeonato}`);
      return response.data;
    } catch (error) {
      console.error("Error en la llamada API para eliminar documento del campeonato:", error);
      throw error;
    }
  };


