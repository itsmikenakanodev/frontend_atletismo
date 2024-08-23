import axios from "axios";
import { getApiUrl  } from "@/utils/apiUtil.js"
//Fachada
export const enviarcorreoFachada= async(cuerpoCorreo)=>{
    return await enviarcorreoApi(cuerpoCorreo)
}

//Consumir
const enviarcorreoApi= async (cuerpoCorreo)=>{
    const url=getApiUrl('emails/sendNotif')
    return await axios.post('https://proyectocloudbackend.onrender.com/API/Atletismo/emails/sendNotif', cuerpoCorreo).then(r => r.data)
   
}
