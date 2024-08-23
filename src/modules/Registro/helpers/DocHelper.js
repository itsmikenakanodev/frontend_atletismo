import axios from "axios";

export const guardarDocFachada = async (bodyDoc) => {
    return await guardarDoc(bodyDoc)
}

const guardarDoc= async (bodyDoc) => {
    const data = axios.post(`https://atletismonacional.azurewebsites.net/API/Atletismo/documentos`, bodyDoc).then(r => r.data);
    return data;
}

