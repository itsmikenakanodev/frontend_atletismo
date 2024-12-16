<template>
  <div class="perfil-atleta-container">
    <h2>Perfil de Atleta</h2>
    <div v-if="atleta" class="perfil-atleta">
      <div class="atleta-info">
        <p><strong>Nombre:</strong> {{ atleta.nombres }} {{ atleta.apellidos }}</p>
        <p><strong>Cédula:</strong> {{ atleta.cedula }}</p>
        <p><strong>Email:</strong> {{ atleta.email }}</p>
        <p><strong>Ciudad:</strong> {{ atleta.ciudad }}</p>

        <div v-if="rol === 1 || rol === 6" class="atleta-details">
          <p><strong>Dirección:</strong> {{ atleta.direccion }}</p>
          <p><strong>Teléfono:</strong> {{ atleta.telefono }}</p>
          <p><strong>Fecha de Nacimiento:</strong> {{ formatDate(atleta.fechaNacimiento) }}</p>
          <p><strong>Estado:</strong> {{ atleta.estado ? 'Activo' : 'Inactivo' }}</p>
        </div>
      </div>
      <button @click="regresar" class="btn-regresar">Regresar</button>
    </div>
    <div v-else>
      <p>Cargando información del atleta...</p>
    </div>
  </div>
</template>

<script>
import { buscarAtletasFachada } from '../helpers/getAtletas';

export default {
  name: 'PerfilAtleta',
  data() {
    return {
      atleta: null,
      rol: null,
    };
  },
  async mounted() {
    const cedula = this.$route.params.cedula; // Obtener la cédula del atleta de los parámetros de la ruta
    console.log("Cédula del atleta:", cedula); // Verifica la cédula
    try {
      const atletas = await buscarAtletasFachada({ cedula }); // Llama a la función pasando la cédula
      console.log("Atleta encontrado:", atletas); // Verifica la respuesta de la API
      if (atletas.length > 0) {
        this.atleta = atletas[0]; // Asigna el primer atleta del array
        this.rol = this.atleta.rol; // Asegúrate de que el objeto atleta tenga la propiedad rol
      } else {
        throw new Error('Atleta no encontrado');
      }
    } catch (error) {
      console.error('Error al obtener el atleta:', error);
      this.$toast.add({
        severity: 'error',
        summary: 'Error',
        detail: 'No se pudo cargar la información del atleta.',
        life: 3000
      });
    }
  },
  methods: {
    formatDate(date) {
      return new Date(date).toLocaleDateString(); // Ejemplo de formato
    },
    regresar() {
      this.$router.push({ name: 'AtletasPage' }); // Navegar a la página de Atletas
    }
  },
};
</script>

<style scoped>
.perfil-atleta-container {
  max-width: 800px; /* Ancho máximo de la página */
  margin: 0 auto; /* Centrar la página */
  padding: 20px; /* Espaciado interno */
  background-color: #f9f9f9; /* Color de fondo */
  border-radius: 8px; /* Bordes redondeados */
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); /* Sombra */
}

h2 {
  text-align: center; /* Centrar el título */
  margin-bottom: 20px; /* Espaciado inferior */
}

.perfil-atleta {
  background: #ffffff; /* Color de fondo blanco */
  padding: 20px; /* Espaciado interno */
  border-radius: 8px; /* Bordes redondeados */
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); /* Sombra */
}

.atleta-info {
  margin-bottom: 20px; /* Espaciado inferior */
}

.atleta-details {
  margin-top: 20px; /* Espaciado superior */
}

.btn-regresar {
  display: block; /* Hacer que el botón ocupe todo el ancho */
  width: 100%; /* Ancho completo */
  padding: 10px; /* Espaciado interno */
  background-color: #2c666e; /* Color de fondo */
  color: white; /* Color del texto */
  border: none; /* Sin borde */
  border-radius: 5px; /* Bordes redondeados */
  cursor: pointer; /* Cambiar cursor al pasar el mouse */
  transition: background-color 0.3s ease; /* Transición suave */
}

.btn-regresar:hover {
  background-color: #4b8b92; /* Color de fondo al pasar el mouse */
}
</style>
  