import axios from "axios";
import { getApiUrl } from "@/utils/apiUtil.js";

// Fachada
export const consultarSuscripcionFachada = async (consulta) => {
    return await consultarSuscripcion(consulta);
};

export const eliminarDocumentoSocioFachada = async (id) => {
    return await eliminarDocumentoSocio(id);
};

// Consumir
const consultarSuscripcion = async (consulta) => {
    const usuario = JSON.parse(localStorage.getItem('userdata'));
    consulta.ciudad = usuario.ciudad;
    const url = getApiUrl('usuarios/tipoD');
    try {
        const response = await axios.post(url, consulta);
        return response.data;
    } catch (error) {
        console.error("Error consultando suscripción:", error);
        throw error;
    }
};

const eliminarDocumentoSocio = async (id) => {
    const url = getApiUrl(`documentos/${id}`);
    try {
        const response = await axios.delete(url);
        return response.data;
    } catch (error) {
        console.error("Error eliminando documento socio:", error);
        throw error;
    }
};
