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
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0px 8px 20px rgba(0, 0, 0, 0.2);
  margin: 2rem auto;
  background-color: #ffffff;
}

h2 {
  font-size: 2rem;
  margin-bottom: 1.5rem;
  color: #2C666E;
}

/* Mensaje de carga con animación */
.cargando {
  font-size: 1.2rem;
  color: #2C666E;
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
  background-color: #f9f9f9;
  border-radius: 10px;
  padding: 1.5rem;
  width: 100%;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.15);
  transition: transform 0.3s ease-in-out;
}

.campeonato-card:hover {
  transform: translateY(-8px);
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
  background-color: #4b8b92;
  color: #ffffff;
  border: none;
  padding: 12px 24px;
  font-size: 1.1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
  margin-top: 15px;
}

.ver-todos-boton:hover {
  background-color: #90ddf0;
  transform: scale(1.05);
}
</style>
