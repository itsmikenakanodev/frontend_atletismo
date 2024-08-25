import axios from "axios";
import { getApiUrl } from "@/utils/apiUtil.js";

// Fachada
export const guardarDocFachada = async (bodyDoc) => {
  try {
    return await guardarDoc(bodyDoc);
  } catch (error) {
    console.error("Error al guardar el documento:", error);
    throw error;
  }
};

// Consumir
const guardarDoc = async (bodyDoc) => {
  const url = getApiUrl('documentos');
  try {
    const response = await axios.post(url, bodyDoc);
    return response.data;
  } catch (error) {
    console.error("Error en la llamada API para guardar el documento:", error);
    throw error;
  }
};
