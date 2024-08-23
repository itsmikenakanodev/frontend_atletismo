import axios from "axios";
import { getApiUrl  } from "@/utils/apiUtil.js"
//Fachada
export const actualizarEstadoUsuarioFachada= async(id)=>{
    id=parseInt(id)
    return await actualizarEstadoUsuarioApi(id)
}

export const actualizarEstadoSocioUsuarioFachada= async(id)=>{
    id=parseInt(id)
    return await actualizarEstadoSocioUsuarioApi(id)
}

export const eliminarUsuarioFachada= async(id)=>{
    id=parseInt(id)
    return await eliminarUsuarioApi(id)
}

//Consumir
const actualizarEstadoUsuarioApi= async (id)=>{
    const url=getApiUrl('usuarios/estado/'+id)
    return await axios.put(url).then(r => r.data)
   
}

const actualizarEstadoSocioUsuarioApi= async (id)=>{
    const url=getApiUrl('usuarios/estadoSocio/'+id)
    return await axios.put(url).then(r => r.data)
   
}

const eliminarUsuarioApi= async(id)=>{
    const url=getApiUrl('usuarios/'+id)
    return await axios.delete(url).then(r => r.data)
}


