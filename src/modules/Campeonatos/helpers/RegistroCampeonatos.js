import axios from "axios";
import { getApiUrl  } from "@/utils/apiUtil.js"
//Fachada
export const registroCampeonatosFachada= async(cuerpoCampeonato)=>{
    return await registroCampeonatosApi(cuerpoCampeonato);
}

export const consultarAdminsFachada= async()=>{
    return await consultarAdmins();
}



//Consumir
const registroCampeonatosApi= async (cuerpoCampeonato)=>{
    const url=getApiUrl('campeonatos');
    return await axios.post(url,cuerpoCampeonato).then(r => r.data);
   
}

const consultarAdmins= async ()=>{
    const url=getApiUrl('usuarios/admins');
    return await axios.get(url).then(r => r.data).catch(e => {
        console.error(e)
        this.$toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo consultar los administradores', life: 3000 });
    });
   
}
    