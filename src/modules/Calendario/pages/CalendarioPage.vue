<template>
  <div class="campeonatos-container">
    <header class="header">
      <h1>Campeonatos Nacionales</h1>
      <p>Explora los campeonatos disponibles por año y mes.</p>
    </header>

    <!-- Mensaje de carga -->
    <section v-if="loading" class="cargando">
      <div class="spinner"></div>
      <p>Cargando campeonatos</p>
    </section>

    <!-- Filtros por año y mes -->
    <section v-else class="filtros">
      <div class="filtro">
        <span class="filtro-text">Año:</span>
        <div class="filtro-opciones filtro-anos">
          <button v-for="year in availableYears" :key="year"
            :class="['filtro-boton', { activo: year === selectedYear }]" @click="filtrarCampeonatosPorAno(year)">
            {{ year }}
          </button>
        </div>
      </div>

      <div class="filtro">
        <span class="filtro-text">Mes:</span>
        <div class="filtro-opciones filtro-meses">
          <button v-for="(mes, index) in meses" :key="index"
            :class="['filtro-boton', { activo: index + 1 === selectedMonth }]"
            @click="filtrarCampeonatosPorMes(index + 1)">
            {{ mes }}
          </button>
        </div>
      </div>
    </section>

    <!-- Campeonatos filtrados -->
    <section v-if="filteredCampeonatos.length > 0 && !loading" class="campeonatos-grid">
      <div v-for="campeonato in filteredCampeonatos" :key="campeonato.id" class="campeonato-card">
        <div class="info-tags">
          <div class="calendar-icon">
            <div class="day">{{ getDay(campeonato.fechaInicio) }}</div>
            <div class="month">{{ getMonth(campeonato.fechaInicio) }}</div>
          </div>
          <div class="tag-icon">
            <Tag :severity="getTagSeverity(campeonato)" :value="getTagValue(campeonato)"></Tag>
          </div>
        </div>
        <div class="campeonato-info">
          <h3 class="campeonato-title">{{ campeonato.nombre }}</h3>
          <p class="campeonato-organizador">Organizado por: {{ campeonato.organizador }}</p>
          <p class="campeonato-sede">Sede: {{ campeonato.sede }}</p>
          <p class="campeonato-fechas">Plazo de inscripción: {{ formatDate(campeonato.inscripcionInicio) }} - 
            {{ formatDate(campeonato.inscripcionFin) }}</p>
          <p class="campeonato-fechas">Fechas de inicio - fin del campeonato: {{ formatDate(campeonato.fechaInicio) }} -
            {{ formatDate(campeonato.fechaFin) }}</p>

          <div class="campeonato-actions">
            <!-- Botón para mostrar/ocultar tabla de pruebas -->
            <div @click="togglePruebas(campeonato.id)" class="toggle-pruebas-btn">
              <i
                :class="{ 'pi pi-chevron-down': !expandedCampeonatos.includes(campeonato.id), 'pi pi-chevron-up': expandedCampeonatos.includes(campeonato.id) }"></i>
              <span>{{ expandedCampeonatos.includes(campeonato.id) ? ' Ocultar pruebas del campeonato' : ' Mostrar pruebas del campeonato' }}</span>
            </div>

            <!-- Botón de inscripción solo para usuarios con rol 5 -->
            <button class="inscribirse-boton" v-if="usuario && usuario.rol && usuario.rol.id === 5"
              @click="mostrarInscripcionCampeonato(campeonato.id)">
              Inscribirse
            </button>
            <!-- Botón de edicion solo para usuarios con rol 1 y 6 -->
            <button class="editar-boton" v-if="usuario && usuario.rol && (usuario.rol.id === 1 || usuario.rol.id === 6)"
              @click="mostrarEdicionCampeonato(campeonato.id)">
              Editar
            </button>
            <!-- Agrega este botón justo antes del cierre de la sección -->
            <button class="ver-documentos-boton" @click="verDocumentos(campeonato.id)">Ver Documentos</button>

          </div>

 <!-- Tabla de pruebas -->
 <div v-if="expandedCampeonatos.includes(campeonato.id)" class="pruebas-list">
            <DataTable v-if="campeonato.pruebas.length > 0" :value="campeonato.pruebas" class="datatable">
              <Column field="nombre" header="Nombre"></Column>
              <Column field="descripcion" header="Descripción"></Column>
              <Column field="tipo" header="Tipo"></Column>
              
              <!-- Columna de eliminar visible solo para roles 1 o 6 -->
              <Column v-if="usuario && (usuario.rol.id === 1 || usuario.rol.id === 6)" header="Eliminar">
                <template #body="slotProps">
                  <Button label="Eliminar" icon="pi pi-trash" class="p-button-danger" 
                    @click="eliminarPrueba(slotProps.data, campeonato.id)" />
                </template>
              </Column>
            </DataTable>

            <div v-if="campeonato.pruebas.length === 0" class="no-pruebas">
              <p>Sin detalle de las pruebas que tendrá esta competencia.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section v-else-if="!loading" class="no-campeonatos">
      <p>No hay campeonatos para el año {{ selectedYear }} y el mes seleccionado.</p>
    </section>
  </div>
</template>


<script>
import { consultarCampeonatosFachada } from "../../Campeonatos/helpers/CampeonatosNacionalHelper";
import { eliminarCampeonatoPruebaFachada2 } from "../../Campeonatos/helpers/CampeonatoPruebaHelper";

export default {
  data() {
    return {
      campeonatos: [],
      selectedYear: new Date().getFullYear(),
      selectedMonth: new Date().getMonth() + 1,
      filteredCampeonatos: [],
      availableYears: [],
      meses: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
      loading: true,
      expandedCampeonatos: [], // Estado para manejar campeonatos expandidos
      usuario: null,
    };
  },
  async mounted() {
    try {
      // Obtener usuario desde localStorage
      const storedUserData = localStorage.getItem('userdata');
      if (storedUserData) {
        this.usuario = JSON.parse(storedUserData);
      } else {
        // Manejo de cuando no hay datos de usuario en localStorage
        this.usuario = { rol: { id: null } };
      }

      let campeonatos = localStorage.getItem('campeonatos');

      if (campeonatos) {
        // Si existen, parsear y usar los campeonatos guardados
        console.log("Campeonatos obtenidos desde Local Storage");
        campeonatos = JSON.parse(campeonatos);
      } else {
        // Si no existen, consultar a la fachada
        console.log("Campeonatos obtenidos desde LA API");
        campeonatos = await consultarCampeonatosFachada();
        // Guardar campeonatos en Local Storage para futuras consultas
        localStorage.setItem('campeonatos', JSON.stringify(campeonatos));
      }

      //const campeonatos = await consultarCampeonatosFachada();
      this.campeonatos = campeonatos;
      this.availableYears = this.getAvailableYears(campeonatos);
      this.filtrarCampeonatos();
    } catch (error) {
      console.error("Error obteniendo campeonatos:", error);
    } finally {
      this.loading = false;
    }
  },
  beforeUnmount() {
    // Eliminar campeonatos del Local Storage antes de que el componente se destruya
    window.addEventListener('beforeunload', () => {
      localStorage.removeItem('campeonatos');
    });
  },
  methods: {
    verDocumentos(campeonatoId) {
      this.$router.push({ name: 'documentos', params: { id: campeonatoId } });
    },
    // Método para redirigir a la página de inscripción de competidores
    mostrarInscripcionCampeonato(campeonatoId) {
      this.$router.push({ name: 'InscripcionCompetidores', params: { id: campeonatoId } });
    },
    // Método para redirigir a la página de edicion de campeonato
    mostrarEdicionCampeonato(campeonatoId) {
      this.$router.push({ name: 'EdicionCampeonatos', params: { id: campeonatoId } });
    },
    filtrarCampeonatosPorAno(year) {
      this.selectedYear = year;
      this.filtrarCampeonatos();
    },
    filtrarCampeonatosPorMes(month) {
      this.selectedMonth = month;
      this.filtrarCampeonatos();
    },
    filtrarCampeonatos() {
      this.filteredCampeonatos = this.campeonatos.filter(campeonato => {
        const campeonatoFecha = new Date(campeonato.fechaInicio);
        return campeonatoFecha.getFullYear() === this.selectedYear && campeonatoFecha.getMonth() + 1 === this.selectedMonth;
      });

      this.filteredCampeonatos.sort((a, b) => {
        return new Date(a.fechaInicio) - new Date(b.fechaInicio);
      });
    },
    getAvailableYears(campeonatos) {
      const years = campeonatos.map(campeonato => new Date(campeonato.fechaInicio).getFullYear());
      return [...new Set(years)];
    },
    formatDate(dateString) {
      const options = { year: "numeric", month: "long", day: "numeric" };
      return new Date(dateString).toLocaleDateString(undefined, options);
    },
    getDay(dateString) {
      return new Date(dateString).getDate();
    },
    getMonth(dateString) {
      const monthNames = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
      return monthNames[new Date(dateString).getMonth()];
    },
    togglePruebas(campeonatoId) {
      if (this.expandedCampeonatos.includes(campeonatoId)) {
        this.expandedCampeonatos = this.expandedCampeonatos.filter(id => id !== campeonatoId);
      } else {
        this.expandedCampeonatos.push(campeonatoId);
      }
    },
    getTagSeverity(campeonato) {
      const today = new Date();
      const fechaInicio = new Date(campeonato.fechaInicio);
      const fechaFin = new Date(campeonato.fechaFin);
      const InscripcionInicio = new Date(campeonato.inscripcionInicio);
      const InscripcionFin = new Date(campeonato.inscripcionFin);
      
      if(today < InscripcionInicio) {
        return "info"; // Por iniciar inscripciones
      } else if(today >= InscripcionInicio && today <= InscripcionFin) {
        return "warning"; // Inscripciones abiertas
      }

      if (today < fechaInicio) {
        return "info"; // Por iniciar
      } else if (today >= fechaInicio && today <= fechaFin) {
        return "warning"; // En progreso
      } else {
        return "success"; // Finalizado
      }
    },
    getTagValue(campeonato) {
      const today = new Date();
      const fechaInicio = new Date(campeonato.fechaInicio);
      const fechaFin = new Date(campeonato.fechaFin);
      
      const InscripcionInicio = new Date(campeonato.inscripcionInicio);
      const InscripcionFin = new Date(campeonato.inscripcionFin);
      
      if(today < InscripcionInicio) {
        return "Por iniciar Inscripciones"; 
      } else if(today >= InscripcionInicio && today <= InscripcionFin) {
        return "Inscripciones abiertas"; 
      }

      if (today < fechaInicio) {
        return "Por iniciar";
      } else if (today >= fechaInicio && today <= fechaFin) {
        return "En progreso";
      } else {
        return "Finalizado";
      }
    },
    eliminarPrueba(prueba, campeonatoId) {
      // Confirmación antes de eliminar
      if (confirm(`¿Estás seguro de que quieres eliminar la prueba "${prueba.nombre}" del campeonato?`)) {
        // Lógica de eliminación usando el helper
        eliminarCampeonatoPruebaFachada2(prueba.id, campeonatoId)
          .then(() => {
            // Aquí puedes realizar la actualización de la lista de pruebas del campeonato después de la eliminación
            const campeonato = this.filteredCampeonatos.find(c => c.id === campeonatoId);
            if (campeonato) {
              campeonato.pruebas = campeonato.pruebas.filter(p => p.id !== prueba.id);
            }
            alert("Prueba eliminada con éxito.");
          })
          .catch(error => {
            console.error("Error eliminando prueba:", error);
            alert("Hubo un error al intentar eliminar la prueba.");
          });
      }
  }
  }
};
</script>


<style scoped>
/* Estilo de los botones de prueba */
.prueba-button,
.toggle-pruebas-btn {
  background-color: #2c666e;
  color: #ffffff;
  border: none;
  padding: 8px 12px;
  font-size: 0.9rem;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-bottom: 10px;
  display: block;
  width: 100%;
  text-align: left;
}

.prueba-button:hover,
.toggle-pruebas-btn:hover {
  background-color: #4b8b92;
}

/* Estilo de los botones de inscripción */
.inscribirse-boton {
  background-color: #2c666e;
  color: #ffffff;
  border: none;
  padding: 10px 20px;
  font-size: 1rem;
  margin-bottom: 10px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.inscribirse-boton {
  background-color: #2c666e;
  color: #ffffff;
  border: none;
  padding: 10px 20px;
  font-size: 1rem;
  margin-bottom: 10px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.inscribirse-boton:hover {
  background-color: #ffffff;
  color: #07393c;
}


.editar-boton {
  background-color: #F0EDEE;
  color: #0A090C;
  border: #0A090C 2px solid;
  padding: 10px 20px;
  font-size: 1rem;
  font-weight: bold;
  margin-bottom: 10px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.editar-boton:hover {
  background-color: #0A090C;
  color: #F0EDEE;
  border: #F0EDEE 2px solid;
}

/* Contenedor para acciones del campeonato */
.campeonato-actions {
  display: flex;
  gap: 10px;
  /* Espacio entre los botones */
  align-items: center;
  justify-content: flex-start;
  /* Alinea los botones a la izquierda */
}

/* Estilo para detalles de la prueba */
.prueba-detalle {
  margin-top: 10px;
  padding: 10px;
  background-color: #07393c;
  border: 1px solid #ddd;
  border-radius: 5px;
}

/* estilo para tag*/
.info-tags {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 5px;
}

.tag-icon {
  margin : 5px;
}

/* Estilo general */
.campeonatos-container {
  font-family: "Arial", sans-serif;
  background-color: #07393c;
  color: #ffffff;
  padding: 20px;
  border-radius: 10px;
  max-width: 1200px;
  margin: 0 auto;
}

header {
  text-align: center;
  margin-bottom: 30px;
}

h1 {
  font-size: 2.5rem;
  margin-bottom: 10px;
  color: #f1f1f1;
}

p {
  font-size: 1.1rem;
  color: #e1e1e1;
}

/* Contenedor de filtros */
.filtros {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 30px;
  align-items: center;
}

/* Estilo de los filtros */
.filtro {
  display: flex;
  align-items: center;
  gap: 10px;
}

.filtro-text {
  font-size: 1.2rem;
  color: #f1f1f1;
}

.filtro-opciones {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.filtro-boton {
  background-color: #2c666e;
  color: #ffffff;
  border: none;
  padding: 10px 15px;
  font-size: 1rem;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.filtro-boton:hover {
  background-color: #4b8b92;
}

.filtro-boton.activo {
  background-color: #f1f1f1;
  color: #2c666e;
  font-weight: bold;
}

/* Mensaje de carga */
.cargando {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
  /* Ajusta la altura según sea necesario */
}

.spinner {
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top: 4px solid #ffffff;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

/* Campeonatos */
.campeonatos-grid {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.campeonato-card {
  display: flex;
  align-items: center;
  background-color: #2c666e;
  border-radius: 10px;
  padding: 15px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.campeonato-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 12px rgba(0, 0, 0, 0.2);
}

.calendar-icon {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #f1f1f1;
  color: #2c666e;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  margin-right: 15px;
  text-align: center;
  font-size: 1.2rem;
}

.campeonato-info {
  flex: 1;
}

.campeonato-title {
  font-size: 1.5rem;
  font-weight: bold;
  color: #ffffff;
  margin-bottom: 10px;
}

.campeonato-organizador,
.campeonato-sede,
.campeonato-fechas {
  font-size: 1rem;
  color: #d0d0d0;
}

/* No campeonatos */
.no-campeonatos {
  text-align: center;
  font-size: 1.2rem;
  color: #f1f1f1;
}

/* Estilo para la tabla de pruebas */
.datatable {
  width: 100%;
  margin-top: 10px;
}

.datatable .p-datatable {
  background-color: #2c666e;
}

.datatable .p-datatable-header {
  background-color: #1e4d53;
}

.datatable .p-datatable .p-datatable-thead>tr>th {
  color: #ffffff;
}

.datatable .p-datatable .p-datatable-tbody>tr>td {
  color: #ffffff;
}

.datatable .p-datatable .p-datatable-tbody>tr:nth-child(even) {
  background-color: #4b8b92;
}

.datatable .p-datatable .p-datatable-tbody>tr:nth-child(odd) {
  background-color: #2c666e;
}

.centeredItem {
  text-align: center;
}

/* Estilo del botón "Ver Documentos" */
.ver-documentos-boton {
  background-color: #2c666e;
  color: #ffffff;
  border: none;
  padding: 10px 20px;
  font-size: 1rem;
  margin-top: 20px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.ver-documentos-boton:hover {
  background-color: #4b8b92;
}
</style>
