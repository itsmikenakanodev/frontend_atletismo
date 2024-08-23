import axios from "axios";
import { getApiUrl  } from "@/utils/apiUtil.js"
//Fachada
export const obtenerCampeonatosPruebasFachada= async()=>{
    return await obtenerCampeonatosPruebasApi()
}

//Consumir
const obtenerCampeonatosPruebasApi= async ()=>{
    const url=getApiUrl("competidoresPruebas")
    return await axios.get(url).then(r => r.data)
   
}