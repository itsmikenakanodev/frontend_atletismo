<template>
  <div class="subscription-container">
    <h2>¡Felicidades!</h2>
    <p>Te has suscrito por un año. La fecha de expiración de tu suscripción es: {{ fechaExpiracion }}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      fechaExpiracion: ''
    }
  },
  methods: {
    calcularFechaExpiracion() {
      let fecha = new Date();
      fecha.setFullYear(fecha.getFullYear() + 1);
      return fecha.toLocaleDateString();
    },
    guardarSuscripcion() {
      this.fechaExpiracion = this.calcularFechaExpiracion();
    }
  },
  created() {
    this.guardarSuscripcion();
  }
}
</script>

<style scoped>
.subscription-container {
  max-width: 400px;
  margin: 0 auto;
  padding: 1em;
  border: 1px solid #ccc;
  background-color: #07393C;
  border-radius: 1em;
  color: #f0edee;
}

h2 {
  color: #f0edee;
}

p {
  color: #90ddf0;
}

button {
  padding: 0.7em;
  border: none;
  border-radius: 1em;
  cursor: pointer;
  width: 100%;
  margin-top: 15px;
  background-color: #90ddf0;
  color: #0A090C;
}

button:hover {
  background-color: #90ddf0;
}
</style>
