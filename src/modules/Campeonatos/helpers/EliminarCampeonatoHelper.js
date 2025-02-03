import axios from "axios";
import { getApiUrl } from "@/utils/apiUtil.js";

// Fachada
export const eliminarCampeonatoFachada = async (id) => {
    try {
        const url = getApiUrl(`campeonatos/${id}`);
        const response = await eliminarCampeonatoApi(url);
        return response;
    } catch (error) {
        console.error("Error eliminando campeonato:", error);
        throw error; // Re-lanzar el error para que pueda ser manejado en el componente
    }
}

// Consumir
const eliminarCampeonatoApi = async (url) => {
    try {
        const response = await axios.delete(url);
        return response.data;
    } catch (error) {
        console.error("Error en la llamada API para eliminar campeonato:", error);
        throw error; // Re-lanzar el error para que pueda ser manejado en `eliminarCampeonatoFachada`
    }
}
