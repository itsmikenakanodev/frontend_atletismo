import axios from "axios";
import { getApiUrl  } from "@/utils/apiUtil.js"
    //Fachada
export const obtenerCampeonatosFachada= async(ciudad)=>{
    return await obtenerCampeonatosApi(ciudad)
}

export const obtenerCampeonatoFachada= async(id)=>{
    return await obtenerCampeonato(id);
}

export const obtenerCampeonatosSinPruebasFachada= async()=>{
    return await obtenerCampeonatosSinPruebas();
}


//Consumir
const obtenerCampeonatosApi= async (ciudad)=>{
    const url=getApiUrl(`campeonatos/dto/${ciudad}`)
    return await axios.get(url).then(r => r.data)
   
}

const obtenerCampeonato= async (id)=>{
    const url=getApiUrl(`campeonatos/dtoid/${id}`)
    return await axios.get(url).then(r => r.data)
}

//Consumir
const obtenerCampeonatosSinPruebas= async ()=>{
    const url=getApiUrl(`campeonatos/dto/ligero`)
    return await axios.get(url).then(r => r.data)
   
}