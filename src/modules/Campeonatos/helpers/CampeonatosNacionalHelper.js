import axios from "axios";
import { getApiUrl } from "@/utils/apiUtil.js";

// Fachada
export const consultarCampeonatosFachada = async () => {
  try {
    const data = await consultarCampeonato();
    return data;
  } catch (error) {
    console.error("Error consultando campeonatos:", error);
    throw error; // Re-lanzar el error para que pueda ser manejado en el componente
  }
};

export const consultarCampeonatosFachadaFiltro = async (anio, mes) => {
  try {
    const data = await consultarCampeonatoFiltro(anio, mes);
    return data;
  } catch (error) {
    console.error("Error consultando campeonatos:", error);
    throw error; // Re-lanzar el error para que pueda ser manejado en el componente
  }
};

// Consumir
const consultarCampeonato = async () => {
  try {
    const url = getApiUrl("campeonatos/dto");
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Error en la llamada API para consultar campeonatos:", error);
    throw error; // Re-lanzar el error para que pueda ser manejado en `consultarCampeonatosFachada`
  }
};

const consultarCampeonatoFiltro = async (anio, mes) => {
  try {
    const url = getApiUrl("campeonatos/campeonatos-con-pruebas");
    const response = await axios.get(url+`?anio=${anio}&mes=${mes}`);
    return response.data;
  } catch (error) {
    console.error("Error en la llamada API para consultar campeonatos por filtro:", error);
    throw error; // Re-lanzar el error para que pueda ser manejado en `consultarCampeonatosFachada`
  }
};
