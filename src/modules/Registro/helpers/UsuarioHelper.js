import axios from "axios";

export const guardarUsuarioFachada = async (bodyUsuario) => {
    return await guardarUsuario(bodyUsuario)
}

const guardarUsuario = async (bodyUsuario) => {
    const data = axios.post(`https://atletismonacional.azurewebsites.net/API/Atletismo/auth/registro`, bodyUsuario).then(r => r.data);
    return data;
}

