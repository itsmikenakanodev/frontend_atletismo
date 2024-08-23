import axios from 'axios';
export const actualizarEstadoFachada = async (id, nuevoEstado) => {
    return await actualizarEstado(id, nuevoEstado);
}

const actualizarEstado = async (id, nuevoEstado) => {
    const data = await axios.put(` https://atletismonacional.azurewebsites.net/API/Atletismo/competidores/cambiarEstado/${id}`, null, {
        params: { nuevoEstado }
    }).then(r => r.data)
    .catch(error => {
        if (error.response && error.response.status === 400) {
            return false;
        } else {
            throw error; 
        }
    });
    return data;
}