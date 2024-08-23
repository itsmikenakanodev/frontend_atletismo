
import axios from 'axios';
export const recuperarContraseniaFachada = async (correo, password) => {
    return await recuperarContrasenia(correo, password);
}


const apiUrl = 'https://atletismonacional.azurewebsites.net/API/Atletismo';

const recuperarContrasenia = async (correo, password) => {
    const data = await axios.put(`https://atletismonacional.azurewebsites.net/API/Atletismo/auth/recuperarPass`, null, {
        params: { correo, password }
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