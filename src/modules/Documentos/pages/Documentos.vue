<template>
    <div class="documentos-container">
      <div class="header">
        <h1>Documentos del Campeonato</h1>
      </div>
  
      <!-- Mensaje de carga mientras se obtienen los documentos -->
      <section v-if="loading" class="loading">
        <div class="spinner"></div>
        <p>Cargando...</p>
      </section>
  
      <!-- Mostrar documentos si hay resultados y no está cargando -->
      <DataTable v-if="!loading && documentos.length" :value="documentos" class="p-datatable-customers">
        <Column field="nombre" header="Nombre" sortable></Column>
        <Column header="Acción">
          <template #body="{ data }">
            <a :href="data.link" target="_blank" class="documento-boton">Ver Documento</a>
          </template>
        </Column>
      </DataTable>
  
      <!-- Mostrar mensaje si no hay documentos y ya terminó la carga -->
      <p v-else-if="!loading && !documentos.length" class="no-documentos">
        No hay documentos disponibles para este campeonato.
      </p>
    </div>
  </template>
  
  <script>
  import { obtenerDocumentosPorCampeonatoFachada } from "../helpers/DocumentoCampeonatoHelper";
  import DataTable from 'primevue/datatable';
  import Column from 'primevue/column';
  
  export default {
    name: "DocumentosCampeonato",
    components: {
      DataTable,
      Column
    },
    data() {
      return {
        documentos: [],
        loading: true  // Variable para manejar el estado de carga
      };
    },
    async created() {
      try {
        const campeonatoId = this.$route.params.id;
        this.documentos = await obtenerDocumentosPorCampeonatoFachada(campeonatoId);
      } catch (error) {
        console.error("Error al cargar los documentos:", error);
      } finally {
        this.loading = false;  // Cambia el estado de carga a false cuando termine la carga
      }
    }
  };
  </script>
  
  <style scoped>
  /* Estilo del contenedor de documentos */
  .documentos-container {
    font-family: "Arial", sans-serif;
    background-color: #f9f9f9;
    color: #333;
    padding: 20px;
    border-radius: 10px;
    max-width: 800px;
    margin: 0 auto;
  }
  
  /* Estilo del encabezado */
  .header {
    text-align: center;
    margin-bottom: 20px;
  }
  
  .header h1 {
    font-size: 2rem;
    margin-bottom: 10px;
  }
  
  .header p {
    font-size: 1.1rem;
    color: #666;
  }
  
  /* Mensaje de carga con animación */
  .loading {
    font-size: 1rem;
    color: black;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 200px; /* Ajusta la altura según sea necesario */
  }
  
  .spinner {
    border: 4px solid rgba(0, 0, 0, 0.1);
    border-radius: 50%;
    border-top: 4px solid #2c666e;
    width: 40px;
    height: 40px;
    animation: spin 1s linear infinite;
    margin-bottom: 10px;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  /* Estilo de la tabla de documentos */
  .p-datatable-customers .p-datatable-thead > tr > th {
    text-align: center;
  }
  
  .p-datatable-customers .p-datatable-tbody > tr > td {
    text-align: center;
  }
  
  /* Estilo del botón de documento */
  .documento-boton {
    display: inline-block;
    padding: 10px 15px;
    font-size: 1rem;
    color: #fff;
    background-color: #2c666e;
    border-radius: 8px;
    text-decoration: none;
    text-align: center;
    transition: background-color 0.3s ease, transform 0.2s ease;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  
  .documento-boton:hover {
    background-color: #4b8b92;
    transform: scale(1.05);
  }
  
  .documento-boton:active {
    background-color: #4b8b92;
  }
  
  /* Mensaje si no hay documentos */
  .no-documentos {
    text-align: center;
    font-size: 1.2rem;
    color: #666;
  }
  </style>
  