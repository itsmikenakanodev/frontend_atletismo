import axios from 'axios';
import { getApiUrl } from "@/utils/apiUtil.js";

// Fachada
export const actualizarEstadoFachada = async (id, nuevoEstado) => {
    return await actualizarEstado(id, nuevoEstado);
};

// Consumir
const actualizarEstado = async (id, nuevoEstado) => {
    const url = getApiUrl(`competidores/cambiarEstado/${id}`); // Usa getApiUrl para construir la URL
    try {
        const data = await axios.put(url, null, {
            params: { nuevoEstado }
        }).then(r => r.data)
        .catch(error => {
            if (error.response && error.response.status === 400) {
                return false;
            } else {
                throw error;
            }
        });
        return data;
    } catch (error) {
        console.log(error);
    }
};
