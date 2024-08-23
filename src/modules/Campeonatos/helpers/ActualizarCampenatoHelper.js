import axios from "axios";
import { getApiUrl  } from "@/utils/apiUtil.js"
//Fachada
export const actualizarCampeonatoFachada = async (id, data) => {
    console.log(data)
    const url = getApiUrl(`campeonatos/${id}`)
    return await axios.put(url, data)
}