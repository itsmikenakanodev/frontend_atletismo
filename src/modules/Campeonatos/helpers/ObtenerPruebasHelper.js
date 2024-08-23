import axios from "axios";
import { getApiUrl  } from "@/utils/apiUtil.js"
//Fachada
export const obtenerPruebasFachada= async()=>{
    return await obtenerPruebasApi()
}

export const obtenerPruebasDadoCampeonatoFachada= async(campeonatoId)=>{
    return await obtenerPruebasDadoCampeonato(campeonatoId)
}

//Consumir
const obtenerPruebasApi= async ()=>{
    const url=getApiUrl('pruebas')
    return await axios.get(url).then(r => r.data)
   
}

const obtenerPruebasDadoCampeonato= async (campeonatoId)=>{
    const url=getApiUrl(`campeonatosPruebas/${campeonatoId}/campeonato`)
    return await axios.get(url).then(r => r.data)
   
}