<template>
  <div class="campeonatos-container">
    <h2>Próximos Eventos</h2>

    <!-- Mostrar mensaje de carga mientras se obtienen los campeonatos -->
    <section v-if="cargando" class="cargando">
      <div class="spinner"></div>
      <p>Cargando...</p>
    </section>

    <!-- Mostrar campeonatos si hay resultados y no está cargando -->
    <div v-if="!cargando && campeonatos.length > 0" class="campeonatos-grid">
      <div v-for="campeonato in campeonatos" :key="campeonato.id" class="campeonato-card">
        <div class="calendar-icon">
          <div class="day">{{ getDay(campeonato.fechaInicio) }}</div>
          <div class="month">{{ getMonth(campeonato.fechaInicio) }}</div>
        </div>
        <div class="campeonato-details">
          <strong class="campeonato-title">{{ campeonato.nombre }}</strong>
          <p class="campeonato-organizador">Organizador: {{ campeonato.organizador }}</p>
          <p class="campeonato-sede">Sede: {{ campeonato.sede }}</p>
          <p class="campeonato-abierta">Fecha máxima de inscripción: {{ formatDate(campeonato.inscripcionFin) }}</p>
        </div>
      </div>
    </div>

    <!-- Mostrar mensaje si no hay campeonatos y ya terminó la carga -->
    <p v-if="!cargando && campeonatos.length === 0" class="no-campeonatos">No hay campeonatos próximos.</p>

    <button @click="verTodosCampeonatos" class="ver-todos-boton">Ver mas campeonatos</button>
  </div>
</template>

<script>
import { consultarCampeonatosFuturosFachada } from "../../Campeonatos/helpers/CampeonatosNacionalHelper";

export default {
  data() {
    return {
      campeonatos: [],
      cargando: true 
    };
  },
  async mounted() {
    try {
      const campeonatos = await consultarCampeonatosFuturosFachada();
      this.campeonatos = this.filtrarProximosCampeonatos(campeonatos);
    } catch (error) {
      console.error("Error obteniendo campeonatos:", error);
    } finally {
      this.cargando = false; // Finaliza el estado de carga
    }
  },
  methods: {
    filtrarProximosCampeonatos(campeonatos) {
      const hoy = new Date(); // Fecha actual
      return campeonatos
        .filter(campeonato => new Date(campeonato.fechaInicio) > hoy) // Filtrar futuros
        .sort((a, b) => new Date(a.fechaInicio) - new Date(b.fechaInicio)) // Ordenar por fecha
        .slice(0, 6); // Tomar los primeros 6
    },
    formatDate(dateString) {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    },
    getDay(dateString) {
      return new Date(dateString).getDate();
    },
    getMonth(dateString) {
      const monthNames = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
      return monthNames[new Date(dateString).getMonth()];
    },
    verTodosCampeonatos() {
      // Redirigir al calendario de campeonatos
      this.$router.push({ name: 'CalendarioPage' });
    }
  }
};
</script>

<style scoped>
.campeonatos-container {
  text-align: center;
  padding: 1rem;
  border-radius: 10px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
  margin: 0 auto;
}

h2 {
  font-size: 1.8rem;
  margin-bottom: 1rem;
  color: #f1f1f1;
}

/* Mensaje de carga con animación */
.cargando {
  font-size: 1rem;
  color: #f1f1f1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px; /* Ajusta la altura según sea necesario */
}

.spinner {
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top: 4px solid #ffffff;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin-bottom: 10px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Grid de campeonatos */
.campeonatos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
  justify-content: center;
}

/* Tarjeta de campeonato */
.campeonato-card {
  display: flex;
  align-items: center;
  background-color: #f1f1f1;
  border-radius: 8px;
  padding: 1rem;
  width: 100%;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease-in-out;
}

.campeonato-card:hover {
  transform: translateY(-5px);
}

/* Icono del calendario */
.calendar-icon {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #2C666E;
  color: white;
  width: 50px;
  height: 50px;
  border-radius: 10px;
  margin-right: 1rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.calendar-icon .day {
  font-size: 1.2rem;
  font-weight: bold;
}

.calendar-icon .month {
  font-size: 0.8rem;
  text-transform: uppercase;
}

/* Detalles del campeonato */
.campeonato-details {
  text-align: left;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.campeonato-title {
  font-size: 1.2rem;
  color: #2C666E;
  margin-bottom: 0.5rem;
}

.campeonato-organizador,
.campeonato-sede,
.campeonato-abierta {
  font-size: 0.9rem;
  color: #333;
  margin-bottom: 0.3rem;
}

/* Mensaje si no hay campeonatos */
.no-campeonatos {
  font-size: 1rem;
  color: #ff4d4f;
}

.ver-todos-boton {
  background-color: #90ddf0;
  color: #0A090C;
  border: none;
  padding: 10px 20px;
  font-size: 1rem;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-top: 10px;
}

.ver-todos-boton:hover {
  background-color: #4b8b92;
}
</style>
