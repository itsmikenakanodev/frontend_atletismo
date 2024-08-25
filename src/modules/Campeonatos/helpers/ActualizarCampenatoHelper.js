import axios from "axios";
import { getApiUrl } from "@/utils/apiUtil.js";

// Fachada
export const actualizarCampeonatoFachada = async (id, data) => {
    try {
        const url = getApiUrl(`campeonatos/${id}`);
        const response = await actualizarCampeonatoApi(url, data);
        return response;
    } catch (error) {
        console.error("Error actualizando campeonato:", error);
        throw error; // Re-lanzar el error para que pueda ser manejado en el componente
    }
}

// Consumir
const actualizarCampeonatoApi = async (url, data) => {
    try {
        const response = await axios.put(url, data);
        return response.data;
    } catch (error) {
        console.error("Error en la llamada API para actualizar campeonato:", error);
        throw error; // Re-lanzar el error para que pueda ser manejado en `actualizarCampeonatoFachada`
    }
}
