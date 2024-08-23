import axios from "axios";

export const obtenerUsuarioFachada = async (bodyUsuario) => {
  return await obtenerUsuario(bodyUsuario);
};

const obtenerUsuario = async (bodyUsuario) => {
  const response = await axios.post("https://atletismonacional.azurewebsites.net/API/Atletismo/auth/login", {
    email: bodyUsuario.email,
    password: bodyUsuario.password,
  });
  return response.data;
};
