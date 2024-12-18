<template>
  <div class="perfil-atleta-container">
    <h2>Perfil de nuestro competidor</h2>
    <div v-if="atleta" class="perfil-atleta">
      <div class="atleta-info">
        <p><strong>Nombre:</strong> {{ atleta.nombres }} {{ atleta.apellidos }}</p>
        <p><strong>Cédula:</strong> {{ atleta.cedula }}</p>
        <p><strong>Email:</strong> {{ atleta.email }}</p>
        <p><strong>Ciudad:</strong> {{ atleta.ciudad }}</p>

        <div v-if="usuario && (usuario.rol.id === 1 || usuario.rol.id === 6)" class="atleta-details">
          <p><strong>Dirección:</strong> {{ atleta.direccion }}</p>
          <p><strong>Teléfono:</strong> {{ atleta.telefono }}</p>
          <p><strong>Fecha de Nacimiento:</strong> {{ formatDate(atleta.fechaNacimiento) }}</p>
          <p><strong>Estado:</strong> {{ atleta.estado ? 'Activo' : 'Inactivo' }}</p>
        </div>
      </div>

      <!-- Sección de selección de vista -->
      <div class="toggle-buttons">
        <div class="dropdown">
          <span class="dropbtn">Ver estadísticas del competidor</span>
          <div class="dropdown-content">
            <button @click="mostrarMejoresMarcas" :class="{ active: mostrarMarcas }">
              <i class="pi pi-trophy"></i> Mejores Marcas
            </button>
            <button @click="mostrarProgreso" :class="{ active: !mostrarMarcas }">
              <i class="pi pi-chart-line"></i> Progreso
            </button>
          </div>
        </div>
      </div>

      <div v-if="mostrarMarcas">
        <div class="mejores-tiempos">
          <h3>Mejores Marcas</h3>
          <table>
            <thead>
              <tr>
                <th>Prueba</th>
                <th>Mejor Marca</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(prueba, index) in pruebas" :key="index">
                <td>{{ prueba }}</td>
                <td>{{ getMejorTiempo(resultados.filter(r => r.nombrePrueba === prueba)) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div v-else>
        <div v-if="resultados.length > 0">
          <div class="progreso">
            <h3>Progreso</h3>
            <div v-for="(prueba, index) in pruebas" :key="index" class="prueba-item">
              <div @click="toggleProgreso(index)" class="prueba-header">
                <h4>{{ prueba }}</h4>
                <i :class="expandedPruebas.includes(index) ? 'pi pi-chevron-up' : 'pi pi-chevron-down'"></i>
              </div>
              <div v-if="expandedPruebas.includes(index)" class="prueba-details">
                <table class="progreso-table">
                  <thead>
                    <tr>
                      <th>Competencia</th>
                      <th>Marca</th>
                      <th>Posición</th>
                      <th>Viento (m/s)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="resultado in resultados.filter(r => r.nombrePrueba === prueba)" :key="resultado.id">
                      <td>{{ resultado.nombreCampeonato }}</td>
                      <td>{{ getMejorTiempo(resultados.filter(r => r.nombrePrueba === prueba)) }}</td>
                      <td>{{ resultado.posicion }}</td>
                      <td>{{ resultado.viento }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <div v-else>
          <p>No se encontraron resultados para este atleta.</p>
        </div>
      </div>

      <!-- Botón Regresar -->
      <button @click="regresar" class="btn-regresar">Regresar</button>
    </div>
    <div v-else>
      <p>Cargando información del atleta...</p>
    </div>
  </div>
</template>

<script>
import { buscarAtletasFachada } from '../helpers/getAtletas';
import { buscarResultadosFachada } from '../helpers/getResultados';

export default {
  name: 'PerfilAtleta',
  data() {
    return {
      atleta: null,
      rol: null,
      resultados: [],
      pruebas: [],
      expandedPruebas: [],
      mostrarMarcas: false,
    };
  },
  async mounted() {
    // Obtener usuario desde localStorage
    const storedUserData = localStorage.getItem('userdata');
    if (storedUserData) {
      this.usuario = JSON.parse(storedUserData);
      this.rol = this.usuario.rol.id; // Asignar el rol del usuario
    } else {
      this.usuario = { rol: { id: null } };
    }

    const cedula = this.$route.params.cedula; // Obtener la cédula del atleta de los parámetros de la ruta
    console.log("Cédula del atleta:", cedula); // Verifica la cédula
    try {
      const atletas = await buscarAtletasFachada({ cedula }); // Llama a la función pasando la cédula
      console.log("Atleta encontrado:", atletas); // Verifica la respuesta de la API
      if (atletas.length > 0) {
        this.atleta = atletas[0]; // Asigna el primer atleta del array
        this.rol = this.atleta.rol; // Asegúrate de que el objeto atleta tenga la propiedad rol

        // Obtener resultados del atleta
        this.resultados = await buscarResultadosFachada(cedula); // Llama a la función para obtener resultados

        // Extraer pruebas de los resultados
        this.pruebas = [...new Set(this.resultados.map(r => r.nombrePrueba))]; // Obtener nombres de pruebas únicas
      } else {
        throw new Error('Atleta no encontrado');
      }
    } catch (error) {
      console.error('Error al obtener el atleta o resultados:', error);
      this.$toast.add({
        severity: 'error',
        summary: 'Error',
        detail: 'No se pudo cargar la información del atleta o resultados.',
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
    },
    getMejorTiempo(historial) {
        if (historial.length === 0) return 'N/A';
        
        // Obtener el criterio de la primera entrada del historial
        const criterio = historial[0].criterioPrueba;

        if (criterio === 'Tiempo') {
            const tiemposEnSegundos = historial.map(h => h.marca); // Ya está en segundos
            const mejorTiempo = Math.min(...tiemposEnSegundos);
            return mejorTiempo.toFixed(2) + ' segundos'; // Devuelve el mejor tiempo en segundos
        } else if (criterio === 'Distancia') {
            const mejorDistancia = Math.max(...historial.map(h => h.distancia));
            return mejorDistancia.toFixed(2) + ' metros'; // Devuelve la mejor distancia
        } else if (criterio === 'Puntos') {
            const mejorPuntos = Math.max(...historial.map(h => h.puntos));
            return mejorPuntos.toFixed(2) + ' puntos'; // Devuelve la mejor puntuación
        }
        
        return 'N/A'; // En caso de que no coincida con ningún criterio
    },
    toggleProgreso(index) {
        if (this.expandedPruebas.includes(index)) {
            this.expandedPruebas = this.expandedPruebas.filter(i => i !== index);
        } else {
            this.expandedPruebas.push(index);
        }
    },
    mostrarMejoresMarcas() {
      this.mostrarMarcas = true; // Mostrar Mejores Marcas
    },
    mostrarProgreso() {
      this.mostrarMarcas = false; // Mostrar Progreso
    },
  },
};
</script>

<style scoped>
.perfil-atleta-container {
  max-width: 1000px; /* Aumentar el ancho máximo de la página */
  margin: 0 auto; /* Centrar la página */
  padding: 20px; /* Espaciado interno */
  background-color: #2c666e; /* Color de fondo */
  border-radius: 8px; /* Bordes redondeados */
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); /* Sombra */
}

h2 {
  text-align: center; /* Centrar el título */
  margin-bottom: 20px; /* Espaciado inferior */
  color: #ffffff;
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

.mejores-tiempos, .progreso {
  margin-top: 20px; /* Espaciado superior */
}

table {
  width: 100%; /* Ancho completo */
  border-collapse: collapse; /* Colapsar bordes */
  margin-bottom: 20px; /* Espaciado inferior */
}

th, td {
  border: 1px solid #ddd; /* Borde de las celdas */
  padding: 12px; /* Aumentar espaciado interno */
  text-align: left; /* Alinear texto a la izquierda */
}

th {
  background-color: #f2f2f2; /* Color de fondo para el encabezado */
}

.progreso {
  margin-top: 20px; /* Espaciado superior */
}

.prueba-item {
  margin-bottom: 10px; /* Espaciado inferior entre pruebas */
  background: #f9f9f9; /* Color de fondo */
  border-radius: 5px; /* Bordes redondeados */
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1); /* Sombra */
}

.prueba-header {
  padding: 10px; /* Espaciado interno */
  cursor: pointer; /* Cambiar cursor al pasar el mouse */
  display: flex; /* Flex para alinear el texto y el icono */
  justify-content: space-between; /* Espacio entre el texto y el icono */
  align-items: center; /* Centrar verticalmente */
}

.prueba-details {
  padding: 10px; /* Espaciado interno */
}

.progreso-table {
  width: 100%; /* Ancho completo */
  border-collapse: collapse; /* Colapsar bordes */
}

th {
  background-color: #4b8b92; /* Color de fondo para el encabezado */
  color: white; /* Color del texto en el encabezado */
  padding: 8px; /* Espaciado interno */
  text-align: left; /* Alinear texto a la izquierda */
}

td {
  border: 1px solid #ddd; /* Borde de las celdas */
  padding: 8px; /* Espaciado interno */
  text-align: left; /* Alinear texto a la izquierda */
}

.toggle-buttons {
  margin-bottom: 20px; /* Espaciado inferior */
  text-align: right; /* Alinear el contenido a la derecha */
}

.dropdown {
  position: relative; /* Posición relativa para el menú desplegable */
  display: inline-block; /* Mostrar en línea */
  width: auto; /* Ancho automático */
}

.dropbtn {
  background-color: #4b8b92; /* Color de fondo */
  color: white; /* Color del texto */
  font-size: 18px; /* Tamaño de fuente */
  font-weight: bold; /* Negrita */
  cursor: pointer; /* Cambiar cursor al pasar el mouse */
  padding: 10px 20px; /* Espaciado interno */
  border: none; /* Sin borde */
  border-radius: 5px; /* Bordes redondeados */
  transition: background-color 0.3s ease; /* Transición suave */
}

.dropbtn:hover {
  background-color: #2c666e; /* Color de fondo al pasar el mouse */
}

.dropdown-content {
  display: none; /* Ocultar el contenido por defecto */
  position: absolute; /* Posición absoluta para el menú desplegable */
  background-color: #ffffff; /* Color de fondo del menú */
  min-width: 150px; /* Ancho mínimo */
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2); /* Sombra */
  z-index: 1; /* Asegurar que esté por encima de otros elementos */
  border-radius: 5px; /* Bordes redondeados */
}

.dropdown:hover .dropdown-content {
  display: block; /* Mostrar el contenido al pasar el mouse */
}

.dropdown-content button {
  color: #2c666e; /* Color del texto */
  padding: 10px; /* Espaciado interno */
  text-align: left; /* Alinear texto a la izquierda */
  border: none; /* Sin borde */
  background: none; /* Sin fondo */
  width: 100%; /* Ancho completo */
  cursor: pointer; /* Cambiar cursor al pasar el mouse */
  display: flex; /* Flex para alinear icono y texto */
  align-items: center; /* Centrar verticalmente */
  transition: background-color 0.3s ease; /* Transición suave */
}

.dropdown-content button:hover {
  background-color: #f2f2f2; /* Color de fondo al pasar el mouse */
}

.active {
  background-color: #4b8b92; /* Color de fondo para el botón activo */
  color: white; /* Color del texto activo */
}

.dropdown-content button i {
  margin-right: 10px; /* Espaciado entre icono y texto */
}
</style>
  