<template>
  <div class="contenedor">
    <div class="contenedorInicio">
      <h2>Campeonatos Nacionales</h2>
      <select v-model="provinciaSeleccionada" @change="filtrarCampeonatos">
        <option value="">Todas las Provincias</option>
        <option v-for="provincia in provincias" :key="provincia" :value="provincia">{{ provincia }}</option>
      </select>
    </div>
    <div v-if="campeonatosFiltrados.length">
      <Campeonato v-for="(campeonato, index) in campeonatosFiltrados" :key="index" :campeonato="campeonato" />
    </div>
    <div v-else>
      <p>Cargando campeonatos...</p>
    </div>
  </div>
</template>

<script>
import Campeonato from "../components/Campeonato.vue";
import { consultarCampeonatosFachada } from "../helpers/CampeonatosNacionalHelper.js";

export default {
  components: {
    Campeonato,
  },
  data() {
    return {
      campeonatos: [],
      campeonatosFiltrados: [],
      provincias: [
        "Azuay",
        "Bolívar",
        "Cañar",
        "Carchi",
        "Chimborazo",
        "Cotopaxi",
        "El Oro",
        "Esmeraldas",
        "Galápagos",
        "Guayas",
        "Imbabura",
        "Loja",
        "Los Ríos",
        "Manabí",
        "Morona Santiago",
        "Napo",
        "Orellana",
        "Pastaza",
        "Pichincha",
        "Santa Elena",
        "Santo Domingo de los Tsáchilas",
        "Sucumbíos",
        "Tungurahua",
        "Zamora Chinchipe",
      ],
      provinciaSeleccionada: "",
    };
  },
  methods: {
    async consultarCampeonatos() {
      this.campeonatos = await consultarCampeonatosFachada();
      this.filtrarCampeonatos();
      console.log(this.campeonatos);
    },
    filtrarCampeonatos() {
      if (this.provinciaSeleccionada === "") {
        this.campeonatosFiltrados = this.campeonatos;
      } else {
        this.campeonatosFiltrados = this.campeonatos.filter(
          (campeonato) => campeonato.sede === this.provinciaSeleccionada
        );
      }
    },
  },
  mounted() {
    this.consultarCampeonatos();
  },
};
</script>

<style scoped>
.contenedor {
  background-color: #07393c;
  min-height: 100vh;
  padding: 10px;
}
.contenedorInicio {
  align-content: center;
  align-items: center;
  text-align: center;
  border-radius: 20px;
  box-shadow: 5px 5px 5px #2c666e;
  margin: 30px;
  background: linear-gradient(0deg, rgba(240, 237, 238, 1) 0%, rgba(255, 255, 255, 1) 100%);
  color: #000000;
}
select {
  margin-top: 20px;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #2c666e;
}
</style>
