import axios from "axios";
import { getApiUrl } from "@/utils/apiUtil.js"
//Fachada
export const getUsuariosFachada = async () => {
    return await getUsuariosApi()
}

export const eliminarDocumentoRegistroFachada = async (id) => {
    return await eliminarDocumentoRegistro(id)
}

//Consumir
const getUsuariosApi = async () => {
    const usuario = JSON.parse(localStorage.getItem('userdata'));
    const url = getApiUrl(`usuarios/prov-noreg/${usuario.ciudad}`)
    return await axios.get(url).then(r => r.data)

}

const eliminarDocumentoRegistro = async (id) => {
    const data = axios.delete(` https://atletismonacional.azurewebsites.net/API/Atletismo/documentos/${id}`).then(r => r.data);
    return data;
}
