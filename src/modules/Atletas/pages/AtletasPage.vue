<template>
    <div>
      <h1>Atletas</h1>
      
      <div class="search-bar">
        <InputText v-model="searchQuery" placeholder="Buscar por cédula o apellido" />
        <Button 
          :label="loading ? 'Cargando...' : 'Buscar'" 
          icon="pi pi-search" 
          @click="searchAtletas" 
          :disabled="loading"
        />
      </div>
  
      <DataTable :value="atletas" :paginator="true" :rows="10" class="atletas-table" v-if="atletas.length > 0">
        <Column field="nombres" header="Nombre" />
        <Column field="apellidos" header="Apellido" />
        <Column field="cedula" header="Cédula" />
        <Column field="email" header="Email" />
        <Column header="Perfil" class="perfil-column">
          <template #body="{ data }">
            <Button label="Ver" icon="pi pi-eye" @click="showPerfil(data)" />
          </template>
        </Column>
      </DataTable>
  
      <p v-else-if="searched && atletas.length === 0">
        No se encontraron atletas que cumplan con los criterios de búsqueda.
      </p>
  
      <!-- Componente de Perfil Atleta -->
      <PerfilAtleta
        :visible="perfilVisible"
        :atleta="selectedAtleta"
        @update:visible="perfilVisible = $event"
      />
    </div>
  </template>
  
  <script>
  import { buscarAtletasFachada } from '../helpers/getAtletas';
  import PerfilAtleta from '../components/PerfilAtleta.vue';
  
  export default {
    components: {
      PerfilAtleta
    },
    data() {
      return {
        searchQuery: '',
        atletas: [],
        perfilVisible: false,
        selectedAtleta: null,
        searched: false,  // Bandera para controlar si se ha realizado una búsqueda
        loading: false    // Bandera para controlar el estado de carga del botón
      };
    },
    methods: {
      async searchAtletas() {
        this.searched = true;
        this.loading = true;  // Marca que la búsqueda está en progreso
  
        try {
          if (!this.searchQuery) {
            this.atletas = [];
            return;
          }
  
          const searchParams = {
            cedula: this.searchQuery.match(/^\d+$/) ? this.searchQuery : undefined,
            apellidos: isNaN(this.searchQuery) ? this.searchQuery : undefined
          };
  
          this.atletas = await buscarAtletasFachada(searchParams);
        } catch (error) {
          console.error("Error al buscar atletas:", error);
          this.atletas = [];
        } finally {
          this.loading = false;  // Marca que la búsqueda ha terminado
        }
      },
      showPerfil(atleta) {
        this.selectedAtleta = atleta;
        this.perfilVisible = true;
      }
    }
  };
  </script>
  
  <style scoped>
  .search-bar {
    display: flex;
    gap: 1rem;
    margin-bottom: 1rem;
  }
  
  .atletas-table .p-datatable-thead > tr > th {
    text-align: center;
  }
  
  .perfil-column .p-button {
    display: block;
    margin: 0 auto;
  }
  
  p {
    text-align: center;
    font-style: italic;
    color: #666;
  }
  </style>
  