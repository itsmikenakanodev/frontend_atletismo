import axios from "axios";

export const consultarSuscripcionFachada = async (consulta) => {
    return await consultarSuscripcion(consulta)
}

export const eliminarDocumentoSocioFachada = async (consulta) => {
    return await eliminarDocumentoSocio(consulta)
}

const consultarSuscripcion = async (consulta) => {
    const usuario = JSON.parse(localStorage.getItem('userdata'));
    consulta.ciudad = usuario.ciudad;
    const data = axios.post(`https://atletismonacional.azurewebsites.net/API/Atletismo/usuarios/tipoD`,consulta).then(r => r.data);
    return data;
}

const eliminarDocumentoSocio = async (id) => {
    const data = axios.delete(`https://atletismonacional.azurewebsites.net/API/Atletismo/documentos/${id}`).then(r => r.data);
    return data;
}

