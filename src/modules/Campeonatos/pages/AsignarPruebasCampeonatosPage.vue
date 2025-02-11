<template>
  <div class="register-container">
    <Toast />
    <h2>Asignar Pruebas al Campeonato</h2>
    <h3>Seleccione el campeonato al que desea asignar las pruebas</h3>
    <div class="flex flex-column">
      <Dropdown v-model="selectedCampeonato" optionLabel="nombre" :options="campeonatos" class="mt-3 mb-3"
        placeholder="Seleccione el campeonato" @change="obtenerPruebasIngresadas" />
    </div>

    <DataTable v-if="selectedCampeonato"
      :value="pruebasCampeonato ? pruebas.filter(prueba => !pruebasCampeonato.some(pruebaCampeonato => pruebaCampeonato.id === prueba.id)) : pruebas"
      selectionMode="multiple" v-model:selection="selectedPrueba" paginator showGridlines :rows="5"
      :rowsPerPageOptions="[5, 10, 20, 50]" tableStyle="min-width: 50rem">
      <Column selectionMode="multiple" headerStyle="width: 3rem;"></Column>
      <Column field="nombre" header="Nombre" sortable></Column>
      <Column field="tipo" header="Tipo" sortable></Column>
      <Column field="criterio" header="Criterio" sortable></Column>
    </DataTable>

    <div class="flex flex-column" v-if="selectedCampeonato">
      <h2>Pruebas Actuales del Campeonato </h2>
      <DataTable v-if=" pruebasCampeonato && pruebasCampeonato.length>0" :value="pruebasCampeonato" paginator showGridlines :rows="5" :rowsPerPageOptions="[5, 10, 20, 50]"
        tableStyle="min-width: 50rem">
        <Column field="nombre" header="Nombre" sortable></Column>
        <Column field="tipo" header="Tipo" sortable></Column>
        <Column field="criterio" header="Criterio" sortable></Column>
      </DataTable>
      <Message v-else severity="info" :closable="false">
        El campeonato aún no tiene pruebas asignadas.
      </Message>
    </div>

    <div class="centerElement mt-3">
      <Button @click="asignarPruebas" :disabled="isSubmitting">Finalizar registro</Button>
    </div>
  </div>
</template>

<script>
import { obtenerPruebasFachada } from '@/modules/Campeonatos/helpers/ObtenerPruebasHelper.js';
import { obtenerCampeonatosAsignablesFachada } from '@/modules/Campeonatos/helpers/ObtenerCampeonatosHelper.js';
import { registroCampeonatoPruebaFachada } from '@/modules/Campeonatos/helpers/CampeonatoPruebaHelper';

export default {
  mounted() {
    this.listarPruebas();
    this.listarCampeonatos();
  },
  methods: {
    async listarPruebas() {
      try {
        this.pruebas = await obtenerPruebasFachada();
        console.log('Pruebas obtenidas:', this.pruebas);
      } catch (error) {
        console.error('Error al obtener las pruebas:', error);
      }
    },
    async listarCampeonatos() {
      try {
        this.campeonatos = await obtenerCampeonatosAsignablesFachada(this.usuario.ciudad);
        console.log('Campeonatos obtenidos:', this.campeonatos);
      } catch (error) {
        console.error('Error al obtener los campeonatos:', error);
      }
    },
    async asignarPruebas() {
      if (this.isSubmitting) return;
      this.isSubmitting = true;

      if (!this.selectedCampeonato || !this.selectedPrueba.length) {
        this.$toast.add({ severity: 'warn', summary: 'Advertencia', detail: 'Debe seleccionar un campeonato y al menos una prueba', life: 3000 });
        this.isSubmitting = false;
        return;
      }

      console.log('id campeonato: ', this.selectedCampeonato.id);
      try {
        for (const prueba of this.selectedPrueba) {
          const cuerpoCPC = {
            campeonato: { id: this.selectedCampeonato.id },
            prueba: { id: prueba.id }
          };

          console.log('Datos a enviar:', JSON.stringify(cuerpoCPC));

          await registroCampeonatoPruebaFachada(cuerpoCPC);
        }

        this.$toast.add({ severity: 'info', summary: 'Info', detail: 'Pruebas asignadas al campeonato', life: 3000 });
        
        setTimeout(() => {
          this.$toast.add({ severity: 'success', summary: 'Éxito', detail: 'Las pruebas han sido asignadas correctamente', life: 3000 });
          this.$router.push('/calendarios');
        }, 3000);

      } catch (error) {
        console.error('Error al registrar las pruebas:', error);
        this.$toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo asignar las pruebas al campeonato', life: 3000 });
      } finally {
        this.isSubmitting = false;
      }
    },
    obtenerPruebasIngresadas() {
      this.pruebasCampeonato = this.selectedCampeonato.pruebas;
      console.log("Pruebas del campeonato:", this.pruebasCampeonato);
    }
  },
  data() {
    return {
      usuario: JSON.parse(localStorage.getItem('userdata')),
      pruebas: [],
      pruebasCampeonato: null,
      selectedPrueba: [],
      campeonatos: [],
      selectedCampeonato: null,
      isSubmitting: false
    };
  },
};
</script>


<style scoped>
.register-container {
  display: block;
  max-width: 900px;
  margin: auto;
  margin-top: 5vh;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  background-color: #07393C;
  color: #f0edee;
  font-size: 16px;
}

h2 {
  margin-bottom: 20px;
  text-align: center;
  font-size: 24px;
}

.centerElement {
  display: flex;
  justify-content: center;
}

button {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50%;
  padding: 12px;
  margin-top: 15px;
  margin-bottom: -15px;
  background-color: #90ddf0;
  color: #0A090C;
  border: none;
  font-size: 18px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #07393c;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50%;
  padding: 12px;
  margin-top: 15px;
  margin-bottom: -15px;
  background-color: #ffffff;
  color: #0A090C;
  border: none;
  font-size: 18px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.row-disabled {
  pointer-events: none;
  /* Desactiva la interacción */
  opacity: 0.5;
  /* Reduce la opacidad para indicar que está deshabilitado */
}
</style>
