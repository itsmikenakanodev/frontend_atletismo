<template>
    <div>
      <h1>Atletas</h1>
      
      <div class="search-bar">
        <InputText v-model="searchQuery" placeholder="Buscar por cédula o apellido" />
        <Button 
          :label="'Buscar'" 
          icon="pi pi-search" 
          @click="searchAtletas" 
          :disabled="!searchQuery"
        />
      </div>

      <LoadingSpinner v-if="loading" mensaje="Cargando atletas..." />

      <div v-if="searched && !loading && !atletas.length">
        <p>No se encontraron atletas que cumplan con los criterios de búsqueda.</p>
      </div>
      
      <DataTable v-if="!loading && searched && atletas.length" :value="atletas" :paginator="true" :rows="10" class="atletas-table">
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

      <PerfilAtleta v-if="perfilVisible" :atleta="selectedAtleta" :rol="usuario.rol.id" @close="perfilVisible = false" />
    </div>
</template>
  
  <script>
  import { buscarAtletasFachada } from '../helpers/getAtletas';
  import PerfilAtleta from '../components/PerfilAtleta.vue';
  import LoadingSpinner from '../../../components/LoadingSpinner.vue';
  
  export default {
    components: {
      PerfilAtleta,
      LoadingSpinner
    },
    data() {
      return {
        searchQuery: '',
        atletas: [],
        searched: false,
        loading: false,
        perfilVisible: false,
        selectedAtleta: null,
        usuario: null,
      };
    },
    methods: {
      async searchAtletas() {
        this.searched = true;
        this.loading = true;

        await new Promise(resolve => setTimeout(resolve, 2000));

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
          this.loading = false;
        }
      },
      showPerfil(atleta) {
        this.selectedAtleta = atleta;
        this.perfilVisible = true;
      }
    },
    mounted() {
      const storedUserData = localStorage.getItem('userdata');
      if (storedUserData) {
        this.usuario = JSON.parse(storedUserData);
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
  