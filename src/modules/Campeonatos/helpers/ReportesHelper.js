import axios from "axios";
import { getApiUrl } from "@/utils/apiUtil.js";

// Fachada
export const obtenerReporteCampeonatoFachada = async (id) => {
    try {
        return await obtenerReporteCampeonato(id);
    } catch (error) {
        console.error("Error al obtener reporte campeonato:", error);
        throw error;
    }
};

export const obtenerReportePruebasCampeonatoFachada = async (id) => {
    try {
        return await obtenerReportePruebasCampeonato(id);
    } catch (error) {
        console.error("Error al obtener reporte de pruebas de campeonato:", error);
        throw error;
    }
};

export const obtenerReporteCompetidoresCampeonatoFachada = async (id) => {
    try {
        return await obtenerReporteCompetidoresCampeonato(id);
    } catch (error) {
        console.error("Error al obtener reporte de pruebas de campeonato:", error);
        throw error;
    }
};

// Consumir
const obtenerReporteCampeonato = async (id) => {
    try {
        const url = getApiUrl(`reportes/campeonatos/${id}`);
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error("Error en la llamada API para obtener reporte campeonato:", error);
        throw error;
    }
};

const obtenerReportePruebasCampeonato = async (id) => {
    try {
        const url = getApiUrl(`reportes/campeonatos/${id}/pruebas`);
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error("Error en la llamada API para obtener reporte de pruebas de campeonato:", error);
        throw error;
    }
};

const obtenerReporteCompetidoresCampeonato = async (id) => {
    try {
        const url = getApiUrl(`reportes/campeonatos/${id}/competidores-detalle`);
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error("Error en la llamada API para obtener reporte de competidores de campeonato:", error);
        throw error;
    }
};

