<template>
    <div class="contact-us">
      <h2>Contáctanos</h2>
      <form @submit.prevent="enviarMensaje">
        <div class="form-group">
          <label for="email">Correo Electrónico</label>
          <input
            id="email"
            v-model="correo"
            type="email"
            :disabled="isRol5"
            required
          />
        </div>
        <div class="form-group">
          <label for="mensaje">Mensaje</label>
          <textarea
            id="mensaje"
            v-model="mensaje"
            rows="5"
            required
          ></textarea>
        </div>
        <button type="submit">Enviar</button>
      </form>
    </div>
  </template>
  
  <script>
  import { useToast } from 'primevue/usetoast';
  import { enviarcorreoFachada } from "../helpers/enviarCorrreo";
  
  export default {
    data() {
      return {
        correo: "",
        mensaje: "",
        isRol5: false
      };
    },
    async created() {
      const usuario = JSON.parse(localStorage.getItem('userdata'));
      if (usuario && (usuario.rol.id === 5 || usuario.rol.id === null)) {
        this.isRol5 = true;
        this.correo = usuario.email || "";
      }
    },
    methods: {
      async enviarMensaje() {
        const toast = useToast();
        try {
          await enviarcorreoFachada({
            email: this.correo,
            message: this.mensaje
          });
          toast.add({
            severity: "success",
            summary: "Éxito",
            detail: "Tu mensaje ha sido enviado correctamente."
          });
          this.correo = "";
          this.mensaje = "";
        } catch (error) {
          toast.add({
            severity: "error",
            summary: "Error",
            detail: "No se pudo enviar el mensaje. Inténtalo nuevamente más tarde."
          });
        }
      }
    }
  };
  </script>
  
  <style scoped>
  .contact-us {
    max-width: 600px;
    margin: 0 auto;
    padding: 1rem;
  }
  
  .form-group {
    margin-bottom: 1rem;
  }
  
  input, textarea {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
  
  button {
    padding: 0.5rem 1rem;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  
  button:hover {
    background-color: #0056b3;
  }
  </style>
  