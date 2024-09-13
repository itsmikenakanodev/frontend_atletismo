<template>
  <div class="contenedor">
    <div class="contenedorInicio">
      <h1>ASOCIACIÓN NACIONAL DE ATLETISMO MÁSTER DEL ECUADOR</h1>
      <p id="bienvenidos">Bienvenidos al sistema de inscripción de atletas a los campeonatos de atletismo máster.</p>
      <img id="imgAtletismo" src="../assets/Atletismo.jpg" alt="" />
    </div>

    <div class="contenedorCampeonatos">
      <ProximosCampeonatos />
      <Campeonatos />
    </div>

    <div>
      <SobreNosotros />
    </div>
  </div>
</template>

<script>
import Campeonatos from "../components/Campeonatos.vue";
import SobreNosotros from "../components/SobreNosotros.vue";
import ProximosCampeonatos from "../components/ProximosCampeonatos.vue"; 

export default {
  components: {
    Campeonatos,
    SobreNosotros,
    ProximosCampeonatos 
  }
};
</script>

<style scoped>
#bienvenidos {
  font-size: 20px;
}

.contenedor {
  background-color: #07393C;
  min-height: 100vh;
  padding: 10px;
}

.contenedorInicio {
  text-align: center;
  border-radius: 20px;
  box-shadow: 5px 5px 5px #2C666E;
  margin: 30px;
  background: linear-gradient(
    0deg,
    rgba(240, 237, 238, 1) 0%,
    rgba(255, 255, 255, 1) 100%
  );
  color: #000000;
}

#imgAtletismo {
  width: 100%;
  border-radius: 20px;
  padding: 5px 10px;
}

.contenedorCampeonatos {
  display: flex;
  flex-direction: row;
  gap: 0.5rem; /* Reducción del espacio entre los componentes */
  margin: 20px 0;
}

.contenedorCampeonatos > * {
  flex: 1; /* Cada componente tomará el mismo espacio disponible */
  padding: 0.5rem; /* Añade un pequeño relleno para separación interna */
}
</style>
