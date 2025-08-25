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
        <div class="dropdown" v-if="resultados.length > 0">
          <span class="dropbtn">
            <i class="pi pi-filter"></i>
            Ver estadísticas del competidor
          </span>
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

      <div v-if="mostrarMarcas && resultados.length">
        <div class="mejores-tiempos">
          <h3>Mejores Marcas</h3>
          <div class="card">
            <DataTable :value="pruebas" tableStyle="min-width: 50rem" paginator :rows="5"
              :rowsPerPageOptions="[5, 10, 20]">
              <Column field="nombre" header="Prueba" sortable>
                <template #body="slotProps">
                  {{ slotProps.data }}
                </template>
              </Column>
              <Column field="mejorMarca" header="Mejor Marca" sortable>
                <template #body="slotProps">
                  {{ getMejorTiempo(resultados.filter(r => r.nombrePrueba === slotProps.data)) }}
                </template>
              </Column>
            </DataTable>
          </div>
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
                <div class="card">
                  <DataTable :value="resultados.filter(r => r.nombrePrueba === prueba)" 
                    tableStyle="min-width: 50rem" paginator :rows="5"
                    :rowsPerPageOptions="[5, 10, 20]">
                    <Column field="nombreCampeonato" header="Competencia" sortable></Column>
                    <Column field="marca" header="Marca" sortable>
                      <template #body="slotProps">
                        <span v-if="slotProps.data.criterioPrueba === 'Tiempo'">{{ slotProps.data.marca.toFixed(2) }} segundos</span>
                        <span v-else-if="slotProps.data.criterioPrueba === 'Distancia'">{{ slotProps.data.distancia }} metros</span>
                        <span v-else-if="slotProps.data.criterioPrueba === 'Puntos'">{{ slotProps.data.puntaje }} puntos</span>
                        <span v-else>N/A</span>
                      </template>
                    </Column>
                    <Column field="posicion" header="Posición" sortable></Column>
                    <Column field="viento" header="Viento (m/s)" sortable>
                      <template #body="slotProps">
                        <span v-if="slotProps.data.criterioPrueba === 'Tiempo'">{{ slotProps.data.viento }}</span>
                        <span v-else>No aplica</span>
                      </template>
                    </Column>
                  </DataTable>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-else>
          <p>No se encontraron resultados para este atleta.</p>
          {{ showToast() }}
        </div>
      </div>

      <!-- Botón Regresar -->
      <button @click="regresar" class="btn-regresar">
        <i class="pi pi-arrow-left"></i> Regresar
      </button>
    </div>
    <div v-else>
      <LoadingSpinner mensaje="Cargando información del atleta..." class="spinner-blanco" />
    </div>
  </div>
</template>

<script>
import { buscarAtletasFachada } from '../helpers/getAtletas';
import { buscarResultadosFachada } from '../helpers/getResultados';
import LoadingSpinner from '../../../components/LoadingSpinner.vue';

export default {
  name: 'PerfilAtleta',
  components: {
    LoadingSpinner,
  },
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
    } else {
      this.usuario = {}; // Asegurarse de que usuario sea un objeto vacío si no hay datos
    }

    const cedula = this.$route.params.cedula; // Obtener la cédula del atleta de los parámetros de la ruta
    console.log("Cédula del atleta:", cedula); // Verifica la cédula
    try {
      const atletas = await buscarAtletasFachada({ cedula }); // Llama a la función pasando la cédula
      console.log("Atleta encontrado:", atletas); // Verifica la respuesta de la API
      if (atletas.length > 0) {
        this.atleta = atletas[0]; // Asigna el primer atleta del array
        // Obtener resultados del atleta
        this.resultados = await buscarResultadosFachada(cedula); // Llama a la función para obtener resultados
        
        // Imprimir los resultados obtenidos
        console.log("Resultados del atleta:", this.resultados); // Agregado para imprimir resultados

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
            const mejoresSinViento = historial.filter(h => h.viento === 0 && h.marca === mejorTiempo);
            return mejoresSinViento.length > 0 ? mejoresSinViento[0].marca.toFixed(2) + ' segundos' : mejorTiempo.toFixed(2) + ' segundos'; // Devuelve el mejor tiempo en segundos
        } else if (criterio === 'Distancia') {
            const distancias = historial.map(h => h.distancia);
            const mejorDistancia = Math.max(...distancias);
            const mejoresSinViento = historial.filter(h => h.viento === 0 && h.distancia === mejorDistancia);
            return mejoresSinViento.length > 0 ? mejoresSinViento[0].distancia.toFixed(2) + ' metros' : mejorDistancia.toFixed(2) + ' metros';
        } else if (criterio === 'Puntos') {
            const puntajes = historial.map(h => h.puntaje);
            const mejorPuntos = Math.max(...puntajes);
            const mejoresSinViento = historial.filter(h => h.viento === 0 && h.puntaje === mejorPuntos);
            return mejoresSinViento.length > 0 ? mejoresSinViento[0].puntaje.toFixed(2) + ' puntos' : mejorPuntos + ' puntos';
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
      this.resultados.forEach(resultado => {
          // Asegúrate de que se llame a getMejorTiempo con el historial correcto
          const mejorTiempo = this.getMejorTiempo(this.resultados.filter(r => r.nombrePrueba === resultado.nombrePrueba));
          console.log(`Mejor tiempo para ${resultado.nombrePrueba}: ${mejorTiempo}`);
      });
    },
    mostrarProgreso() {
      this.mostrarMarcas = false; // Mostrar Progreso
    },
    showToast() {
      this.$toast.add({
        severity: 'error',
        summary: 'Error',
        detail: 'No se encontraron resultados para este atleta.',
        life: 3000
      });
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
   /* Ancho completo */
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

.spinner-blanco {
  color: white; /* Cambiar el color del texto a blanco */
}

/* Estilos para las tablas de PrimeVue */
.card {
  margin: 10px;
}
</style>
  