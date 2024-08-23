<template>
  <div  v-if="suscrito">    

    <h1  class="titulo">Ya eres socio</h1>
    <confirmacion  />
  </div>
  <div>
    <form @submit.prevent="guardarSuscripcion" v-if="!suscrito">
      <div>
        <label for="name">Nombre Completo</label>
        <input type="text" id="name" v-model="form.name" required>
      </div>
      <div>
        <label for="email">Correo Electrónico</label>
        <input type="email" id="email" v-model="form.email" required>
      </div>
      <div>
        <label for="cardNumber">Número de Tarjeta</label>
        <input type="text" id="cardNumber" v-model="form.cardNumber" required>
      </div>
      <div>
        <label for="expiryDate">Fecha de Expiración</label>
        <input type="text" id="expiryDate" v-model="form.expiryDate" required>
      </div>
      <div>
        <label for="cvc">CVC</label>
        <input type="text" id="cvc" v-model="form.cvc" required>
      </div>
      <div>
        <button  type="submit">Suscribete</button>
      </div>
    </form>
  </div>
</template>

<script>
import { loadStripe } from '@stripe/stripe-js';
import Confirmacion from './confirmacion.vue';
Confirmacion

export default {
  components: {
    
    Confirmacion
  },
  data() {
    return {
      form: {
        name: '',
        email: '',
        cardNumber: '',
        expiryDate: '',
        cvc: '',
      },
      loading: false,
      suscrito: false,
      fechaExpiracion: ''
    }
  },
  methods: {
    async submitForm() {
      this.loading = true;
      const stripe = await loadStripe('tu-clave-publica-de-stripe');
      const {error } = await stripe.createToken({
        card: {
          number: this.form.cardNumber,
          exp_month: this.form.expiryDate.split('/')[0],
          exp_year: this.form.expiryDate.split('/')[1],
          cvc: this.form.cvc
        }
      });

      if (error) {
        console.error(error);
        this.loading = false;
      } else {
        this.loading = false;
        this.suscrito = true;
        this.fechaExpiracion = this.calcularFechaExpiracion();
        this.$emit('suscripcion-exitosa', this.fechaExpiracion);  
      }
    },

    guardarSuscripcion() {
      this.submitForm();
      this.suscrito=true;
      this.fechaExpiracion = this.calcularFechaExpiracion();

    },

    calcularFechaExpiracion() {
      let fecha = new Date();
      fecha.setFullYear(fecha.getFullYear() + 1);
      return fecha.toLocaleDateString();
    }
  }
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
</style>
