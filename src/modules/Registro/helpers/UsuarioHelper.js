import axios from "axios";
import { getApiUrl } from "@/utils/apiUtil.js";

const url = getApiUrl("auth/registro"); 

export const guardarUsuarioFachada = async (bodyUsuario) => {
    return await guardarUsuario(bodyUsuario)
}

const guardarUsuario = async (bodyUsuario) => {
    const data = axios.post(url, bodyUsuario).then(r => r.data);
    return data;
}

