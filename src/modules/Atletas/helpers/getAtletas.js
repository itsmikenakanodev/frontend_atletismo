import axios from "axios";
import { getApiUrl } from "@/utils/apiUtil.js";

// Fachada
export const buscarAtletasFachada = async (searchParams) => {
    return await buscarAtletasApi(searchParams);
    
};

// Consumir
const buscarAtletasApi = async (searchParams) => {
    const { cedula, apellidos } = searchParams;
    const url = getApiUrl(`usuarios/buscar`);
    
    try {
        const response = await axios.get(url, {
            params: {
                cedula: cedula || undefined,
                apellidos: apellidos || undefined
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error buscando atletas:", error);
        throw error;
    }
};
