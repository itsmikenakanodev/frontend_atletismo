import axios from "axios";

const API_URL = " https://atletismonacional.azurewebsites.net/API/Atletismo/campeonatos/dto";

// Crear un campeonato
export const crearCampeonatoFachada = async (bodyCampeonato) => {
  return await crearCampeonato(bodyCampeonato);
};

const crearCampeonato = async (bodyCampeonato) => {
  try {
    const response = await axios.post(API_URL, bodyCampeonato);
    return response.data;
  } catch (error) {
    console.error("Error creando campeonato:", error);
    throw error;
  }
};

// Obtener un campeonato por ID
export const obtenerCampeonatoFachada = async (idCampeonato) => {
  return await obtenerCampeonato(idCampeonato);
};

const obtenerCampeonato = async (idCampeonato) => {
  try {
    const response = await axios.get(`${API_URL}/${idCampeonato}`);
    return response.data;
  } catch (error) {
    console.error("Error obteniendo campeonato:", error);
    throw error;
  }
};

// Obtener todos los campeonatos
export const obtenerTodosLosCampeonatosFachada = async () => {
  return await obtenerTodosLosCampeonatos();
};

const obtenerTodosLosCampeonatos = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("Error obteniendo todos los campeonatos:", error);
    throw error;
  }
};

// Actualizar un campeonato
export const actualizarCampeonatoFachada = async (
  idCampeonato,
  bodyCampeonatoActualizado
) => {
  return await actualizarCampeonato(idCampeonato, bodyCampeonatoActualizado);
};

const actualizarCampeonato = async (
  idCampeonato,
  bodyCampeonatoActualizado
) => {
  try {
    const response = await axios.put(
      `${API_URL}/${idCampeonato}`,
      bodyCampeonatoActualizado
    );
    return response.data;
  } catch (error) {
    console.error("Error actualizando campeonato:", error);
    throw error;
  }
};

// Eliminar un campeonato
export const eliminarCampeonatoFachada = async (idCampeonato) => {
  return await eliminarCampeonato(idCampeonato);
};

const eliminarCampeonato = async () => {
  try {
    const response = await axios.delete(`${API_URL}/${idCampeonato}`);
    return response.data;
  } catch (error) {
    console.error("Error eliminando campeonato:", error);
    throw error;
  }
};
