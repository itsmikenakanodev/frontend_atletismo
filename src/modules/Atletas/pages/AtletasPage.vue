<template>
  <div>
    <h1>Atletas</h1>

    <div class="search-bar">
      <InputText v-model="searchQuery" placeholder="Buscar por cédula o apellido" />
      <Button :label="'Buscar'" icon="pi pi-search" @click="searchAtletas" :disabled="!searchQuery || (searchQuery === searchedQuery) " />
    </div>

    <LoadingSpinner v-if="loading" mensaje="Cargando atletas..." />

    <div v-if="searched && !loading && !atletas.length">
      <p>No se encontraron atletas que cumplan con los criterios de búsqueda.</p>
    </div>

    <DataTable v-if="!loading && searched && paginatedAtletas.length" :value="paginatedAtletas" :rows="10"
      class="atletas-table" @page="onPageChange">
      <Column field="nombres" header="Nombre" />
      <Column field="apellidos" header="Apellido" />
      <Column field="cedula" header="Cédula" />
      <Column field="email" header="Email" />
      <Column header="Perfil" class="perfil-column">
        <template #body="{ data }">
          <Button label="Ver" icon="pi pi-eye" @click="verPerfil(data.cedula)" />
        </template>
      </Column>
    </DataTable>

    <div class="pagination-buttons" v-if="atletas.length">
      <Button label="Anterior" icon="pi pi-chevron-left" @click="previousPage" :disabled="currentPage === 0" />
      <Button label="Siguiente" icon="pi pi-chevron-right" @click="nextPage"
        :disabled="isNextDisabled || paginatedAtletas.length <10" />
    </div>
    <Toast />
  </div>
</template>

<script>
import { buscarAtletasFachada } from '../helpers/getAtletas';
import LoadingSpinner from '../../../components/LoadingSpinner.vue';

export default {
  components: {
    LoadingSpinner,
  },
  data() {
    return {
      searchQuery: '',
      atletas: [],
      searched: false,
      loading: false,
      currentPage: 0,
      totalAtletas: 0,
      isNextDisabled: false,
      hasCheckedNextDisabled: false,
      searchedQuery: '',
    };
  },
  computed: {
    paginatedAtletas() {
      const start = this.currentPage * 10;
      return this.atletas.slice(start, start + 10);
    }
  },
  methods: {
    async searchAtletas() {
      console.log("Search atletas ",this.hasCheckedNextDisabled)
      this.searched = true;
      this.loading = true;

      await new Promise(resolve => setTimeout(resolve, 2000));

      try {
        if (!this.searchQuery) {
          this.atletas = [];
          this.totalAtletas = 0;
          this.isNextDisabled = false;
          this.hasCheckedNextDisabled = false;
          return;
        } else if (this.searchQuery !== this.searchedQuery) {
          this.atletas = [];
          this.totalAtletas = 0;
          this.isNextDisabled = false;
          this.hasCheckedNextDisabled = false;
          this.searchedQuery = this.searchQuery
        }else if (this.searchedQuery === this.searchQuery && this.hasCheckedNextDisabled ===true){
          return;
        }

        const searchParams = {
          cedula: this.searchQuery.match(/^\d+$/) ? this.searchQuery : undefined,
          apellidos: isNaN(this.searchQuery) ? this.searchQuery : undefined,
          size: 10,
          page: this.currentPage
        };

        const lista = await buscarAtletasFachada(searchParams);


        if (lista && lista.length > 0) {
          this.atletas = [...this.atletas, ...lista];
          this.totalAtletas = this.atletas.length;
          this.isNextDisabled = false;
          if(lista.length <10) {
            this.isNextDisabled = true;
            this.hasCheckedNextDisabled = true;
          }
        } else {
          this.isNextDisabled = true;
          this.hasCheckedNextDisabled = true;

          if (!this.hasCheckedNextDisabled) {
            this.$toast.add({
              severity: 'error',
              summary: 'Error',
              detail: 'No se encontraron más coincidencias.',
              life: 2000
            });
          }

        }

      } catch (error) {
        if (error.response.status === 404) {
          this.$toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se encontraron más coincidencias.',
            life: 2000
          });
          this.isNextDisabled = true;
          this.hasCheckedNextDisabled = true;

        } else {
          this.$toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al buscar atletas',
            life: 2000
          });
        }
      } finally {
        this.loading = false;
      }
    },
    verPerfil(cedula) {
      this.$router.push({ name: 'PerfilAtleta', params: { cedula } });
    },
    onPageChange(event) {
      this.currentPage = event.page;
    },
    nextPage() {
      this.currentPage++;
      if(!this.hasCheckedNextDisabled){
        this.searchAtletas();
      }
    },
    previousPage() {
      if (this.currentPage > 0) {
        this.currentPage--;
        this.isNextDisabled = false;
      }
    },
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

.atletas-table .p-datatable-thead>tr>th {
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

.pagination-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
}
</style>