<template>
  <div>
    <h1 class="titulo">BIENVENIDO</h1>
    <div v-if="!usuario.estado" class="suscrito">
      <CargarArchivo ref="cargarArchivoPago" @uploaded="verificarSubida" />
      <button @click="comprobarPago">Comprobar Pago</button>
    </div>
    <div v-else class="subscription-message">
      <h2>Suscripción Activa</h2>
      <p>Suscripción vigente hasta la fecha:</p>
      <p class="date">{{ formatDate(this.usuario.fechaSuscripcion) }}</p>
    </div>
  </div>
</template>

<script>
import CargarArchivo from '@/modules/Registro/components/CargarArchivo.vue';

export default {
  components: {
    CargarArchivo
  },
  data() {
    return {
      usuario: JSON.parse(localStorage.getItem('userdata')),
      suscrito: false,
      fechaExpiracion: '',
      upload: false
    }
  },
  methods: {
    verificarSubida(uploaded) {
      this.upload = uploaded;
      console.log("upload del socio", this.upload);
    },
    comprobarPago() {
      const usuario = JSON.parse(localStorage.getItem('userdata'));
      if (this.upload) {
        this.$refs.cargarArchivoPago.uploadPagoEvent(usuario);
        console.log(this.upload);
      } else {
        alert('Debe subir el archivo para comprobar el pago!');
      }
    },
    formatDate(isoDate) {
      const date = new Date(isoDate);

      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return date.toLocaleDateString('es-ES', options);
    }
  },
  mounted() {
    console.log("mounted", this.usuario);
  },
}
</script>

<style scoped>
form {
  max-width: 400px;
  margin: 0 auto;
  padding: 1em;
  border: 1px solid #ccc;
  background-color: #07393C;
  border-radius: 1em;
}

.suscrito {
  max-width: 400px;
  margin: 0 auto;
  padding: 1em;
  border: 1px solid #ccc;
  background-color: #07393C;
  border-radius: 1em;
  color: #f0edee;
}

.titulo {
  text-align: center;
  color: #07393C;
  margin-bottom: 1em;
}

.suscrito p {
  margin-bottom: 1em;
}

div {
  margin-bottom: 1em;
}

label {
  margin-bottom: .5em;
  color: #f0edee;
  display: block;
}

input {
  border: 1px solid #CCCCCC;
  padding: .5em;
  font-size: 1em;
  width: 100%;
  background-color: #2c666e;
  color: #90ddf0;
  box-sizing: border-box;
}

button {
  padding: 0.7em;
  color: #fff;
  border: none;
  border-radius: 1em;
  cursor: pointer;
  width: 100%;
  margin-top: 15px;
  margin-bottom: -15px;
  background-color: #90ddf0;
  color: #0A090C;
}

button:hover {
  background-color: #90ddf0;
}

.subscription-message {
  background-color: #90ddf0;
  /* Fondo suave */
  border: 2px solid #2c666e;
  /* Borde */
  border-radius: 10px;
  padding: 20px;
  max-width: 400px;
  margin: 20px auto;
  text-align: center;
  font-family: Arial, sans-serif;
  color: #2c666e;
  /* Color de texto principal */
}

.subscription-message h2 {
  color: #07393c;
  /* Título */
}

.subscription-message p {
  font-size: 16px;
  margin: 10px 0;
}

.subscription-message .date {
  font-weight: bold;
  color: #07393c;
  /* Fecha */
}
</style>