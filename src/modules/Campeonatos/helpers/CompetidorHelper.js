import axios from "axios";
import { getApiUrl  } from "@/utils/apiUtil.js"
//Fachada
export const registroCompetidorFachada= async(cuerpoCompetidor)=>{
    return await registroCompetidor(cuerpoCompetidor);
}


//Consumir
const registroCompetidor= async (cuerpoCompetidor)=>{
    const url=getApiUrl('competidores/id');
    return await axios.post(url,cuerpoCompetidor).then(r => r.data);
}