import axios from "axios";
import { getApiUrl } from "@/utils/apiUtil.js";

// Función para buscar resultados
export const buscarResultadosFachada = async (cedula) => {
    const resultados = await buscarResultadosApi(cedula); // Obtener resultados usando la API
    return convertirTiemposAsegundos(resultados); // Convertir los tiempos a segundos
};

// Función para consumir la API
const buscarResultadosApi = async (cedula) => {
    const url = getApiUrl(`resultados/registrados/${cedula}`);
    
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error("Error buscando resultados:", error);
        throw error; // Re-lanzar el error para que pueda ser manejado en el componente
    }
};

// Función para convertir los tiempos a segundos
export const convertirTiemposAsegundos = (resultados) => {
    return resultados.map(resultado => {
        return {
            ...resultado,
            marca: convertirATiempoEnSegundos(resultado.marca) // Convertir la marca a segundos
        };
    });
};

// Función para convertir el tiempo en formato HH:MM:SS.sss a segundos
const convertirATiempoEnSegundos = (tiempo) => {
    if (!tiempo) return 0; 
    const partes = tiempo.split(':');
    const minutos = parseInt(partes[0]) || 0;
    const segundos = parseInt(partes[1]) || 0;
    const milisegundos = parseInt(partes[2]) || 0;
    return minutos * 60 + segundos + milisegundos / 1000; // Convertir a segundos
};
