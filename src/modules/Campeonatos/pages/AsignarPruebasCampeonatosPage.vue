<template>
  <div class="register-container">
    <Toast/>
    <h2>Asignar Pruebas al Campeonato</h2>
    <h3>Seleccione el campeonato al que desea asignar las pruebas</h3>
    <div class="flex flex-column">
      <Dropdown v-model="selectedCampeonato" optionLabel="nombre" :options="campeonatos"  class="mt-3 mb-3" placeholder="Seleccione el campeonato">
     
    </Dropdown>
    </div>
    
    <DataTable v-model:selection="selectedPrueba" :value="pruebas" paginator showGridlines :rows="5"
      :rowsPerPageOptions="[5, 10, 20, 50]" tableStyle="min-width: 50rem">
      <Column selectionMode="multiple" headerStyle="width: 3rem;"></Column>
      <Column field="nombre" header="Nombre" sortable></Column>
      <Column field="tipo" header="Tipo" sortable></Column>
    </DataTable>
    <div class="centerElement mt-3">
      <Button @click="asignarPruebas" >Finalizar registro</Button>
    </div>
  </div>
</template>

<script>
import { obtenerPruebasFachada } from '@/modules/Campeonatos/helpers/ObtenerPruebasHelper.js'
import { obtenerCampeonatosFachada } from '@/modules/Campeonatos/helpers/ObtenerCampeonatosHelper.js'
import { actualizarCampeonatoFachada } from '@/modules/Campeonatos/helpers/ActualizarCampenatoHelper.js'
import { isProxy, toRaw } from 'vue';

export default {
  mounted() {
    this.listarPruebas()
    this.listarCampeonatos()
  },
  methods: {
 
    async listarPruebas() {
      await obtenerPruebasFachada().then(r => {
        this.pruebas = r
      })
    },
    async listarCampeonatos() {
      await obtenerCampeonatosFachada(this.usuario.ciudad).then(r => {
        this.campeonatos = r
      })
    },
    async asignarPruebas() {

      //this.selectedCampeonato.pruebas = this.selectedPrueba;

      await actualizarCampeonatoFachada(this.selectedCampeonato.id,this.selectedPrueba).then(r => {
        this.$toast.add({ severity: 'info', summary: 'Info', detail: 'Campeonato actualizado', life: 3000 });
        console.log(r)
      }).catch(e => {
        console.error(e)
        this.$toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo actualizar el campeonato', life: 3000 });
      })
    },
  },
  data() {

    return {
      usuario: JSON.parse(localStorage.getItem('userdata')),
      pruebas:null,
      selectedPrueba: null,
      campeonatos:null,
      selectedCampeonato:null,
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
</style>