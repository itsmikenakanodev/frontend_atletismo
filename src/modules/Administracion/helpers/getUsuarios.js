import axios from "axios";
import { getApiUrl } from "@/utils/apiUtil.js";

// Fachada
export const getUsuariosFachada = async () => {
    return await getUsuariosApi();
};

export const eliminarDocumentoRegistroFachada = async (id) => {
    return await eliminarDocumentoRegistro(id);
};

// Consumir
const getUsuariosApi = async () => {
    const usuario = JSON.parse(localStorage.getItem('userdata'));
    const url = getApiUrl(`usuarios/prov-noreg/${usuario.ciudad}`);
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error("Error obteniendo usuarios:", error);
        throw error;
    }
};

const eliminarDocumentoRegistro = async (id) => {
    const url = getApiUrl(`documentos/${id}`);
    try {
        const response = await axios.delete(url);
        return response.data;
    } catch (error) {
        console.error("Error eliminando documento:", error);
        throw error;
    }
};
