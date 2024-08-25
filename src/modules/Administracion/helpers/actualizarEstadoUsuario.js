import axios from "axios";
import { getApiUrl } from "@/utils/apiUtil.js";

// Fachada
export const actualizarEstadoUsuarioFachada = async (id) => {
    return await actualizarEstadoUsuarioApi(parseInt(id));
};

export const actualizarEstadoSocioUsuarioFachada = async (id) => {
    return await actualizarEstadoSocioUsuarioApi(parseInt(id));
};

export const eliminarUsuarioFachada = async (id) => {
    return await eliminarUsuarioApi(parseInt(id));
};

// Consumir
const actualizarEstadoUsuarioApi = async (id) => {
    const url = getApiUrl(`usuarios/estado/${id}`);
    try {
        return await axios.put(url).then(r => r.data);
    } catch (error) {
        console.error(error);
        throw error; 
    }
};

const actualizarEstadoSocioUsuarioApi = async (id) => {
    const url = getApiUrl(`usuarios/estadoSocio/${id}`);
    try {
        return await axios.put(url).then(r => r.data);
    } catch (error) {
        console.error(error);
        throw error;
    }
};

const eliminarUsuarioApi = async (id) => {
    const url = getApiUrl(`usuarios/${id}`);
    try {
        return await axios.delete(url).then(r => r.data);
    } catch (error) {
        console.error(error);
        throw error;
    }
};
