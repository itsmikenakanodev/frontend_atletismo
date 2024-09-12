<template>
    <div class="campeonatos-container">
      <h2>Próximos Eventos</h2>
  
      <!-- Mostrar mensaje de carga mientras se obtienen los campeonatos -->
      <p v-if="cargando" class="cargando">Cargando...</p>
  
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
    </div>
  </template>
  
  <script>
  import { consultarCampeonatosFachada } from "../../Campeonatos/helpers/CampeonatosNacionalHelper";
  
  export default {
    data() {
      return {
        campeonatos: [],
        cargando: true // Estado para controlar el mensaje de carga
      };
    },
    async mounted() {
      try {
        const campeonatos = await consultarCampeonatosFachada();
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
  
  .cargando {
    font-size: 1rem;
    color: #666;
  }
  
  .campeonatos-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1rem;
    justify-content: center;
  }
  
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
  
  .no-campeonatos {
    font-size: 1rem;
    color: #ff4d4f;
  }
  </style>
  