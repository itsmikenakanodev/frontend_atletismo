import axios from "axios";
import { getApiUrl } from "@/utils/apiUtil.js";
//Fachada
export const registroCampeonatoPruebaCompetidorFachada = async (cuerpoCPC) => {
  return await registroCampeonatoPruebaCompetidor(cuerpoCPC);
};

//Consumir
const registroCampeonatoPruebaCompetidor = async (cuerpoCPC) => {
  const url = getApiUrl("campeonatosPruebasCompetidores");
  return await axios.post(url, cuerpoCPC).then((r) => r.data);
};
