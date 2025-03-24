<template>
  <div class="campeonatos-container">
    <Toast/>
    <!-- Mensaje de carga inicial -->
    <section v-if="!contentReady" class="cargando">
      <div class="spinner"></div>
      <p>Cargando campeonatos, espere un momento...</p>
    </section>

    <!-- Contenido principal -->
    <div v-else>
      <header class="header">
        <h1>Campeonatos Nacionales</h1>
        <p>Explora los campeonatos disponibles por año y mes.</p>
      </header>

      <!-- Filtros por año y mes -->
      <section class="filtros">
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

      <!-- Mensaje de carga al cambiar filtros -->
      <section v-if="loading" class="cargando">
        <div class="spinner"></div>
        <p>Cargando campeonatos del año y mes seleccionado, espere un momento...</p>
      </section>

      <!-- Campeonatos filtrados -->
      <template v-else>
        <section v-if="campeonatos.length > 0" class="campeonatos-grid">
          <div v-for="campeonato in campeonatos" :key="campeonato.id" class="campeonato-card">
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
              <p class="campeonato-fechas">Fechas de inicio - fin del campeonato: {{ formatDate(campeonato.fechaInicio)
                }} -
                {{ formatDate(campeonato.fechaFin) }}</p>

              <div class="campeonato-actions">
                <!-- Botón para mostrar/ocultar tabla de pruebas -->
                <div @click="togglePruebas(campeonato.id)" class="toggle-pruebas-btn">
                  <i
                    :class="{ 'pi pi-chevron-down': !expandedCampeonatos.includes(campeonato.id), 'pi pi-chevron-up': expandedCampeonatos.includes(campeonato.id) }"></i>
                  <span>{{ expandedCampeonatos.includes(campeonato.id) ? ' Ocultar pruebas del campeonato' : ' Mostrar pruebas del campeonato' }}</span>
                </div>

                <div class="botones-acciones">
                  <div class="espaciador"></div>
                  <!-- Botón de inscripción/reportes para rol 5 -->
                  <button class="accion-boton" v-if="usuario && usuario.rol && usuario.rol.id === 5 && getTagValue(campeonato) === 'Inscripciones abiertas'"
                    @click="campeonatoFinalizado(campeonato) ? verReportes(campeonato) : verificarInscripcion(campeonato)">
                    {{ campeonatoFinalizado(campeonato) ? 'Ver Reportes' : (inscritosStatus[campeonato.id] ? 'Inscrito' : 'Inscribirse') }}
                  </button>

                  <!-- Botón de edición -->
                  <button class="accion-boton" v-if="usuario && usuario.rol && usuario.ciudad === campeonato.sede && new Date(campeonato.inscripcionInicio) > new Date() &&
                    (usuario.rol.id === 1 || usuario.rol.id === 6) && !campeonatoFinalizado(campeonato)" @click="mostrarEdicionCampeonato(campeonato.id) ">
                    Editar
                  </button>

                  <!-- Nuevo botón de Ver Reportes para roles 1 y 6 -->
                  <button class="accion-boton"
                    v-if="usuario && usuario.rol && (usuario.rol.id === 1 || usuario.rol.id === 6)"
                    @click="verReportes(campeonato)">
                    Ver Reportes
                  </button>

                  <!-- Botón de ver documentos -->
                  <button class="accion-boton" @click="verDocumentos(campeonato.id)">
                    Ver Documentos
                  </button>

                  <!-- Botón de eliminar campeonato para roles 1 y 6 -->
                  <button class="accion-boton boton-eliminar" 
                    v-if="usuario && usuario.rol && usuario.ciudad === campeonato.sede && (usuario.rol.id === 1) && new Date(campeonato.inscripcionInicio) > new Date()"
                    @click="eliminarCampeonato(campeonato.id)">
                    Eliminar Campeonato
                  </button>
                </div>
              </div>

              <!-- Tabla de pruebas -->
              <div v-if="expandedCampeonatos.includes(campeonato.id)" class="pruebas-list">
                <DataTable v-if="campeonato.pruebas.length > 0" :value="campeonato.pruebas" class="datatable">
                  <Column field="nombre" header="Nombre"></Column>
                  <Column field="descripcion" header="Descripción"></Column>
                  <Column field="tipo" header="Tipo"></Column>

                  <!-- Columna de eliminar visible solo para roles 1 o 6 -->
                  <Column v-if="usuario && (usuario.rol.id === 1 || usuario.rol.id === 6) && new Date(campeonato.inscripcionInicio) > new Date() && usuario.ciudad === campeonato.ciudad" header="Eliminar">
                    <template #body="slotProps">
                      <Button label="Eliminar" icon="pi pi-trash" class="p-button-danger" @click="confirmarEliminacion(slotProps.data, campeonato.id)" />
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

        <!-- Mensaje si no hay campeonatos disponibles -->
        <section v-else class="no-campeonatos">
          <p>No hay campeonatos para el año {{ selectedYear }} y el mes seleccionado.</p>
        </section>
      </template>
    </div>

    <!-- Diálogo de confirmación -->
    <Dialog header="Confirmar Eliminación" v-model:visible="dialogVisible" :modal="true" :style="{ width: '30vw' }">
      <p class="confirm-text">¿Estás seguro de que deseas eliminar la prueba "{{ pruebaAEliminar.nombre }}"?</p>
      <template #footer>
        <Button label="Cancelar" icon="pi pi-times" @click="dialogVisible = false" />
        <Button label="Eliminar" icon="pi pi-check" @click="eliminarPruebaConfirmada" />
      </template>
    </Dialog>
  </div>
</template>


<script>
import { consultarCampeonatosFachadaFiltro } from "../../Campeonatos/helpers/CampeonatosNacionalHelper";
import { eliminarCampeonatoPruebaFachada2 } from "../../Campeonatos/helpers/CampeonatoPruebaHelper";
import { verificarCompetidorFachada } from "@/modules/Campeonatos/helpers/CompetidorHelper";
import { eliminarCampeonatoFachada } from "@/modules/Campeonatos/helpers/EliminarCampeonatoHelper";
import { storage } from "@/modules/Registro/helpers/firebase";

export default {
  
  data() {
    return {
      campeonatos: [],
      selectedYear: new Date().getFullYear(),
      selectedMonth: new Date().getMonth() + 1,
      filteredCampeonatos: [],
      availableYears: [],
      meses: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
      loading: false,
      expandedCampeonatos: [], // Estado para manejar campeonatos expandidos
      usuario: null,
      contentReady: false,
      dialogVisible: false,
      pruebaAEliminar: null,
      campeonatoIdEliminar: null,
      inscritosStatus: {}, // Nuevo objeto para almacenar el estado de inscripción
    };
  },
  async mounted() {
    try {
      // Obtener usuario desde localStorage
      const storedUserData = localStorage.getItem('userdata');
      if (storedUserData) {
        this.usuario = JSON.parse(storedUserData);
      } else {
        this.usuario = { rol: { id: null } };
      }

      await this.obtenerCampeonatos();
      this.availableYears = this.getAvailableYears(2024);

      setTimeout(() => {
        this.contentReady = true;
      }, 500);

    } catch (error) {
      console.error("Error obteniendo campeonatos:", error);
    }
  },
  beforeUnmount() {
    // Eliminar campeonatos del Local Storage antes de que el componente se destruya
    window.addEventListener('beforeunload', () => {
      localStorage.removeItem('campeonatos');
    });
  },
  methods: {
    async obtenerCampeonatos(anio = new Date().getFullYear(), mes = new Date().getMonth() + 1) {
      this.loading = true;
      
      this.campeonatos = await consultarCampeonatosFachadaFiltro(anio, mes);
      
      // Verificar el estado de inscripción para cada campeonato
      if (this.usuario && this.usuario.rol && this.usuario.rol.id === 5) {
        for (const campeonato of this.campeonatos) {
          const queryParams = {
            idCampeonato: campeonato.id,
            idUsuario: this.usuario.id
          }
          const verificado = await verificarCompetidorFachada(queryParams);
          this.inscritosStatus[campeonato.id] = verificado;
        }
      }

      this.loading = false;
    },
    verDocumentos(campeonatoId) {
      this.$router.push({ name: 'documentos', params: { id: campeonatoId } });
    },
    // Método para redirigir a la página de inscripción de competidores
    async mostrarInscripcionCampeonato(campeonatoId) {
      const queryParams = {
        idCampeonato: campeonatoId,
        idUsuario: this.usuario.id
      }
      const verificado = await verificarCompetidorFachada(queryParams)
      if(verificado){
        this.$toast.add({
                    severity: 'info',
                    summary: 'Info',   
                    detail: 'Ya estás inscrito en este campeonato!',
                    life: 3000
                });
        return;
      }
      this.$router.push({ name: 'InscripcionCompetidores', params: { id: campeonatoId } });
    },
    // Método para redirigir a la página de edicion de campeonato
    mostrarEdicionCampeonato(campeonatoId) {
      this.$router.push({ name: 'EdicionCampeonatos', params: { id: campeonatoId } });
    },
    filtrarCampeonatosPorAno(year) {
      this.selectedYear = year;
      this.loading = true;  // Inicia la carga
      this.obtenerCampeonatos(this.selectedYear, this.selectedMonth);  // Llama a la función para obtener los campeonatos
    },

    filtrarCampeonatosPorMes(month) {
      this.selectedMonth = month;
      this.loading = true;  // Inicia la carga
      this.obtenerCampeonatos(this.selectedYear, this.selectedMonth);  // Llama a la función para obtener los campeonatos
    },
    /*filtrarCampeonatos() {
      this.filteredCampeonatos = this.campeonatos.filter(campeonato => {
        const campeonatoFecha = new Date(campeonato.fechaInicio);
        return campeonatoFecha.getFullYear() === this.selectedYear && campeonatoFecha.getMonth() + 1 === this.selectedMonth;
      });

      this.filteredCampeonatos.sort((a, b) => {
        return new Date(a.fechaInicio) - new Date(b.fechaInicio);
      });
    },*/
    /*getAvailableYears(campeonatos) {
      const years = campeonatos.map(campeonato => new Date(campeonato.fechaInicio).getFullYear());
      return [...new Set(years)];
    },*/
    getAvailableYears(startYear) {
      const currentYear = new Date().getFullYear();
      const years = [];

      for (let year = startYear; year <= currentYear; year++) {
        years.push(year);
      }

      return years;
    },
    formatDate(dateString) {
      const date = new Date(dateString);
      // Ajustar la fecha a UTC si es necesario
      const utcDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
      const options = { year: "numeric", month: "long", day: "numeric" };
      return utcDate.toLocaleDateString(undefined, options);
    },
    getDay(dateString) {
      const date = new Date(dateString);
      // Ajustar la fecha a UTC si es necesario
      const utcDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
      return utcDate.getDate();
    },
    getMonth(dateString) {
      const date = new Date(dateString);
      // Ajustar la fecha a UTC si es necesario
      const utcDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
      const monthNames = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
      return monthNames[utcDate.getMonth()];
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

      if (today < InscripcionInicio) {
        return "info"; // Por iniciar inscripciones
      } else if (today >= InscripcionInicio && today <= InscripcionFin) {
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

      if (today < InscripcionInicio) {
        return "Por iniciar Inscripciones";
      } else if (today >= InscripcionInicio && today <= InscripcionFin) {
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
    confirmarEliminacion(prueba, campeonatoId) {
      this.pruebaAEliminar = prueba;
      this.campeonatoIdEliminar = campeonatoId;
      this.dialogVisible = true;
    },
    async eliminarPruebaConfirmada() {
      try {
        await eliminarCampeonatoPruebaFachada2(this.pruebaAEliminar.id, this.campeonatoIdEliminar);
        this.$toast.add({ severity: 'success', summary: 'Éxito', detail: 'Prueba eliminada con éxito', life: 3000 });
        this.dialogVisible = false;
        await this.obtenerCampeonatos();
      } catch (error) {
        console.error("Error eliminando prueba:", error);
        this.$toast.add({ severity: 'error', summary: 'Error', detail: 'Hubo un error al intentar eliminar la prueba', life: 3000 });
      }
    },
    campeonatoFinalizado(campeonato) {
      const today = new Date();
      const fechaFin = new Date(campeonato.fechaFin);
      return today > fechaFin;
    },
    verReportes(campeonato) {
      this.$router.push({
        name: 'ReporteCampeonatoEspecifico',
        params: { id: campeonato.id },
        state: { campeonato: campeonato }
      });
    },
    async deleteUploadedFile(fileUrl) {
            // Extraer el nombre del archivo de la URL
            const fileName = decodeURIComponent(fileUrl.split('/').pop().split('?')[0]); // Obtener solo el nombre del archivo
            console.log("Deleting", fileName)
            const storageRef = storage.ref(`${fileName}`);
            try {
                await storageRef.delete(); // Eliminar el archivo de Firebase Storage
                console.log('Archivo eliminado:', fileName);
            } catch (err) {
                console.error('Error al eliminar el archivo:', err.message);
            }
        },
    async eliminarCampeonato(campeonatoId) {
      try {
        const {documentos} = this.campeonatos.find(c => c.id === campeonatoId ); 
        if(documentos.length > 0 ){
          documentos.forEach(element => {
          this.deleteUploadedFile(element.link);
        });
        }
        
        await eliminarCampeonatoFachada(campeonatoId);
        this.$toast.add({ severity: 'success', summary: 'Éxito', detail: 'Campeonato eliminado con éxito', life: 3000 });
        await this.obtenerCampeonatos(); // Actualizar la lista de campeonatos
      } catch (error) {
        console.error("Error eliminando campeonato:", error);
        this.$toast.add({ severity: 'error', summary: 'Error', detail: 'Hubo un error al intentar eliminar el campeonato', life: 3000 });
      }
    },
    async verificarInscripcion(campeonato) {
      // Primero verifica si hay pruebas
      if (!campeonato.pruebas || campeonato.pruebas.length === 0) {
        this.$toast.add({
          severity: 'info',
          summary: 'Info',   
          detail: 'No es posible inscribirse. El campeonato no tiene pruebas asignadas todavía.',
          life: 3000
        });
        return;
      }

      // Si hay pruebas, verifica si ya está inscrito
      const queryParams = {
        idCampeonato: campeonato.id,
        idUsuario: this.usuario.id
      }
      const verificado = await verificarCompetidorFachada(queryParams)
      this.inscritosStatus[campeonato.id] = verificado;

      if(verificado){
        this.$toast.add({
          severity: 'info',
          summary: 'Info',   
          detail: 'Ya estás inscrito en este campeonato!',
          life: 3000
        });
        return;
      }

      // Si no está inscrito y hay pruebas, procede con la inscripción
      this.$router.push({ name: 'InscripcionCompetidores', params: { id: campeonato.id } });
    },
    async isInscrito(campeonato) {
      const queryParams = {
        idCampeonato: campeonato.id,
        idUsuario: this.usuario.id
      }
      return await verificarCompetidorFachada(queryParams);
    },
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
  transition: all 0.3s ease;
  min-width: 120px;
  /* Aseguramos un ancho mínimo para ambos textos */
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
  flex-direction: column;
  gap: 15px;
  margin-top: 15px;
  width: 100%;
}

/* Contenedor para los botones de acción */
.botones-acciones {
  display: flex;
  gap: 10px;
  align-items: center;
  justify-content: flex-end;
  flex-wrap: wrap;
  width: 100%;
}

/* Espaciador que empuja los botones hacia la derecha */
.espaciador {
  flex-grow: 1;
}

/* Estilo unificado para todos los botones de acción */
.accion-boton {
  background-color: #2c666e;
  color: #ffffff;
  border: none;
  padding: 10px 20px;
  font-size: 1rem;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease;
  height: 40px;
  min-width: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.accion-boton:hover {
  background-color: #ffffff;
  color: #07393c;
  border: 1px solid #07393c;
}

/* Estilo para el botón de toggle pruebas */
.toggle-pruebas-btn {
  background-color: #2c666e;
  color: #ffffff;
  border: none;
  padding: 8px 12px;
  font-size: 0.9rem;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  width: 100%;
  text-align: left;
}

.toggle-pruebas-btn:hover {
  background-color: #4b8b92;
}

/* estilo para tag*/
.info-tags {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;
  padding: 10px;
  min-width: 120px;
  /* Asegura un ancho mínimo consistente */
}

.tag-icon {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}

/* Estilo del calendario */
.calendar-icon {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #f1f1f1;
  color: #2c666e;
  width: 70px;
  height: 70px;
  border-radius: 50%;
  text-align: center;
  padding: 5px;
}

.day {
  font-size: 1.5rem;
  font-weight: bold;
  line-height: 1;
}

.month {
  font-size: 1rem;
  margin-top: 2px;
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
  gap: 20px;
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

.campeonato-info {
  flex: 1;
  display: flex;
  flex-direction: column;
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

/* Asegurarse que el Tag de PrimeVue esté centrado */
:deep(.p-tag) {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  white-space: nowrap;
}

.confirm-text {
  color: black;
}

/* Agrega esto en la sección de estilos */
.boton-eliminar {
  background-color: #d9534f; /* Color rojo */
  color: #ffffff; /* Texto blanco */
  border: none;
  padding: 10px 20px;
  font-size: 1rem;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.boton-eliminar:hover {
  background-color: #c9302c; /* Color rojo más oscuro al pasar el mouse */
}
</style>