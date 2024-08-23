import axios from "axios";
import { getApiUrl } from "@/utils/apiUtil.js";
//Fachada
export const registrarPruebaFachada = async (cuerpoPrueba) => {
  return await registrarPrueba(cuerpoPrueba);
};

//Consumir
const registrarPrueba = async (cuerpoPrueba) => {
  const url = getApiUrl("pruebas");
  try {
    return await axios.post(url, cuerpoPrueba).then((r) => r.data);
  } catch (error) {
    console.log(error);
  }
};
