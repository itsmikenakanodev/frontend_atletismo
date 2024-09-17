<template>
  <div class="contact-us">
    <Toast /> <!-- Asegúrate de que el componente Toast esté aquí -->
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
import { ref } from 'vue';
import { useToast } from 'primevue/usetoast'; // Importa useToast
import { insertarMensajeFachada } from "../helpers/centroayuda"; // Asegúrate de que la función esté importada

export default {
  setup() {
    const toast = useToast(); // Usa useToast en setup

    const correo = ref('');
    const mensaje = ref('');
    const isRol5 = ref(false);

    // Método para enviar mensaje
    const enviarMensaje = async () => {
      try {
        await insertarMensajeFachada({
          email: correo.value,
          mensaje: mensaje.value,
          fechaEnvio: new Date().toISOString() // Asume que esta propiedad es necesaria
        });
        toast.add({
          severity: "success",
          summary: "Éxito",
          detail: "Tu mensaje ha sido enviado correctamente.",
          life: 3000
        });
        correo.value = "";
        mensaje.value = "";
      } catch (error) {
        console.error("Error al enviar el mensaje:", error); // Agrega esto para detalles del error
        toast.add({
          severity: "error",
          summary: "Error",
          detail: "No se pudo enviar el mensaje. Inténtalo nuevamente más tarde.",
          life: 3000
        });
      }
    };

    return {
      correo,
      mensaje,
      isRol5,
      enviarMensaje,
      toast // Devuelve toast para asegurarte de que esté disponible
    };
  },
  async created() {
    const usuario = JSON.parse(localStorage.getItem('userdata'));
    if (usuario && (usuario.rol.id === 5 || usuario.rol.id === null)) {
      this.isRol5 = true;
      this.correo = usuario.email || "";
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
