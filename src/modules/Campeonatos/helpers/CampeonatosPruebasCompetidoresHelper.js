import axios from "axios";
import { getApiUrl  } from "@/utils/apiUtil.js"
    //Fachada
export const obtenerCampeonatosPruebasCompetidoresFachada= async()=>{
    return await obtenerCampeonatosPruebasCompetidoresApi()
}

export const obtenerCompetidoresDadoCampeonatoyPruebaFachada= async(campeonatoId, pruebaId)=>{
    return await obtenerCompetidoresDadoCampeonatoyPrueba(campeonatoId, pruebaId)
}


//Consumir
const obtenerCampeonatosPruebasCompetidoresApi= async ()=>{
    const url=getApiUrl(`campeonatosPruebasCompetidores`)
    return await axios.get(url).then(r => r.data)
   
}

const obtenerCompetidoresDadoCampeonatoyPrueba= async (campeonatoId, pruebaId)=>{
    const url=getApiUrl(`campeonatosPruebasCompetidores/competidores/${campeonatoId}/${pruebaId}`)
    return await axios.get(url).then(r => r.data)
   
}