<template>
    <div class="campeonatos-container">
      <header class="header">
        <h1>Campeonatos Nacionales</h1>
        <p>Explora los campeonatos disponibles por año y encuentra los próximos eventos deportivos.</p>
      </header>
  
      <section class="filtros">
        <label for="year-select" class="label-select">Selecciona el año:</label>
        <select id="year-select" v-model="selectedYear" @change="filtrarCampeonatosPorAno" class="year-select">
          <option v-for="year in availableYears" :key="year" :value="year">
            {{ year }}
          </option>
        </select>
      </section>
  
      <section v-if="filteredCampeonatos.length > 0" class="campeonatos-grid">
        <div v-for="campeonato in filteredCampeonatos" :key="campeonato.id" class="campeonato-card">
          <div class="calendar-icon">
            <div class="day">{{ getDay(campeonato.fechaInicio) }}</div>
            <div class="month">{{ getMonth(campeonato.fechaInicio) }}</div>
          </div>
          <div class="campeonato-info">
            <h3 class="campeonato-title">{{ campeonato.nombre }}</h3>
            <p class="campeonato-organizador">Organizado por: {{ campeonato.organizador }}</p>
            <p class="campeonato-sede">Sede: {{ campeonato.sede }}</p>
            <p class="campeonato-fechas">Fechas: {{ formatDate(campeonato.fechaInicio) }} - {{ formatDate(campeonato.fechaFin) }}</p>
          </div>
        </div>
      </section>
  
      <section v-else class="no-campeonatos">
        <p>No hay campeonatos para el año {{ selectedYear }}.</p>
      </section>
    </div>
  </template>
  
  <script>
  import { consultarCampeonatosFachada } from "../../Campeonatos/helpers/CampeonatosNacionalHelper";
  
  export default {
    data() {
      return {
        campeonatos: [],
        selectedYear: new Date().getFullYear(), // Año actual seleccionado por defecto
        filteredCampeonatos: [],
        availableYears: [], // Lista de años disponibles
      };
    },
    async mounted() {
      try {
        const campeonatos = await consultarCampeonatosFachada();
        this.campeonatos = campeonatos;
        this.availableYears = this.getAvailableYears(campeonatos); // Generar los años disponibles
        this.filtrarCampeonatosPorAno(); // Filtrar campeonatos por el año seleccionado
      } catch (error) {
        console.error("Error obteniendo campeonatos:", error);
      }
    },
    methods: {
      filtrarCampeonatosPorAno() {
        this.filteredCampeonatos = this.campeonatos.filter(campeonato => {
          return new Date(campeonato.fechaInicio).getFullYear() === this.selectedYear;
        });
      },
      getAvailableYears(campeonatos) {
        const years = campeonatos.map(campeonato => new Date(campeonato.fechaInicio).getFullYear());
        return [...new Set(years)]; // Devolver solo los años únicos
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
    },
  };
  </script>
  
  <style scoped>
  /* Estilo general */
  .campeonatos-container {
    font-family: 'Arial', sans-serif;
    background-color: #07393C;
    color: #FFFFFF;
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
    color: #E1E1E1;
  }
  
  .filtros {
    display: flex;
    justify-content: center;
    margin-bottom: 30px;
  }
  
  .label-select {
    font-size: 1.2rem;
    margin-right: 10px;
  }
  
  .year-select {
    padding: 10px;
    font-size: 1rem;
    border-radius: 5px;
    border: 1px solid #ccc;
  }
  
  /* Grid de campeonatos */
  .campeonatos-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 20px;
  }
  
  /* Tarjeta de campeonato */
  .campeonato-card {
    display: flex;
    align-items: center;
    background-color: #2C666E;
    border-radius: 10px;
    padding: 15px;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
  
  .campeonato-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 12px rgba(0, 0, 0, 0.2);
  }
  
  /* Icono de calendario */
  .calendar-icon {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: #f1f1f1;
    color: #2C666E;
    width: 60px;
    height: 60px;
    border-radius: 10px;
    margin-right: 20px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  
  .calendar-icon .day {
    font-size: 1.5rem;
    font-weight: bold;
  }
  
  .calendar-icon .month {
    font-size: 1rem;
    text-transform: uppercase;
  }
  
  /* Información del campeonato */
  .campeonato-info {
    text-align: left;
  }
  
  .campeonato-title {
    font-size: 1.5rem;
    color: #FFFFFF;
    margin-bottom: 0.5rem;
  }
  
  .campeonato-organizador,
  .campeonato-sede,
  .campeonato-fechas {
    font-size: 1rem;
    color: #DDDDDD;
  }
  
  /* Mensaje de campeonatos no disponibles */
  .no-campeonatos {
    text-align: center;
    font-size: 1.5rem;
    color: #ff4d4f;
    margin-top: 50px;
  }
  </style>
  