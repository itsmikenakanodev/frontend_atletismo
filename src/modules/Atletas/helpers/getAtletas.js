import axios from "axios";
import { getApiUrl } from "@/utils/apiUtil.js";

// Fachada
export const buscarAtletasFachada = async (searchParams) => {
    return await buscarAtletasApi(searchParams);
    
};

// Consumir
const buscarAtletasApi = async (searchParams) => {
    const { cedula, apellidos,size,  page } = searchParams;
    const url = getApiUrl(`usuarios/buscar`);
    
    try {
        const response = await axios.get(url, {
            params: {
                cedula: cedula || undefined,
                apellido: apellidos || undefined,
                size: size || undefined,
                page: page || undefined
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error buscando atletas:", error);
        throw error;
    }
};
