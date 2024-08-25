import axios from "axios";
import { getApiUrl } from "@/utils/apiUtil.js";

// Fachada
export const registrarPruebaFachada = async (cuerpoPrueba) => {
  try {
    return await registrarPrueba(cuerpoPrueba);
  } catch (error) {
    console.error("Error al registrar la prueba:", error);
    throw error;
  }
};

// Consumir
const registrarPrueba = async (cuerpoPrueba) => {
  const url = getApiUrl("pruebas");
  try {
    const response = await axios.post(url, cuerpoPrueba);
    return response.data;
  } catch (error) {
    console.error("Error en la llamada API para registrar prueba:", error);
    throw error;
  }
};
