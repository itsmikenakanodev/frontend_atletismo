<template>
  <div>
    <h1 >Campeonatos {{ provincia }}</h1>
    <TablaCampeonatos />
  </div>
</template>
<script>
import TablaCampeonatos from "../components/TablaCampeonatos.vue";
export default {
  components: {
    TablaCampeonatos,
  },

  data() {
    return {
      provincia: "Provincia ..."
    };
  },
};
</script>
<style></style>
