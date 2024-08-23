import axios from "axios";


export const consultarCampeonatosFachada = async () => {
    return await consultarCampeonato()
}

const consultarCampeonato = async () => {
    const data = axios.get(`https://atletismonacional.azurewebsites.net/API/Atletismo/campeonatos/dto`).then(r => r.data);
    return data;
}

