<template>
  <div class="contact-us">
    <Toast /> <!-- Asegúrate de que el componente Toast esté aquí -->
    <h2>Contáctanos</h2>
    <form @submit.prevent="enviarMensaje" class="contact-form">
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
      <button v-if="correo && mensaje" type="submit" :disabled="enviando">Enviar</button>
      <p v-if="enviando">Enviando mensaje...</p> <!-- Mensaje de envío -->
    </form>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useToast } from 'primevue/usetoast'; // Importa useToast
import { insertarMensajeFachada } from "../helpers/centroayuda"; // Asegúrate de que la función esté importada
import { useRouter } from 'vue-router'; // Importa useRouter

export default {
  setup() {
    const toast = useToast(); // Usa useToast en setup
    const router = useRouter(); // Usa useRouter para la redirección

    const correo = ref('');
    const mensaje = ref('');
    const isRol5 = ref(false);
    const enviando = ref(false); // Estado para controlar el envío

    // Método para enviar mensaje
    const enviarMensaje = async () => {
      enviando.value = true; // Cambiar el estado a enviando
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
        
        // Esperar 3 segundos antes de redirigir
        setTimeout(() => {
          router.push('/'); // Redirigir a la pantalla de inicio
        }, 1300);
      } catch (error) {
        console.error("Error al enviar el mensaje:", error); // Agrega esto para detalles del error
        toast.add({
          severity: "error",
          summary: "Error",
          detail: "No se pudo enviar el mensaje. Inténtalo nuevamente más tarde.",
          life: 3000
        });
      } finally {
        enviando.value = false; // Restablecer el estado después de enviar
      }
    };

    return {
      correo,
      mensaje,
      isRol5,
      enviarMensaje,
      enviando, // Devuelve el estado de enviando
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
  padding: 2rem;
  background-color: #4e9197; /* Fondo claro para el formulario */
  border-radius: 8px; /* Bordes redondeados */
  box-shadow: 0 2px 10px #2c666e; /* Sombra sutil */
}

h2 {
  text-align: center;
  margin-bottom: 1.5rem; /* Espacio debajo del título */
}

.contact-form {
  display: flex;
  flex-direction: column; /* Coloca los elementos en columna */
}

.form-group {
  margin-bottom: 1.5rem; /* Espacio entre los grupos de formulario */
}

input, textarea {
  width: 100%;
  padding: 0.75rem; /* Aumentar el padding */
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem; /* Aumentar el tamaño de la fuente */
}

button {
  padding: 0.75rem 1.5rem; /* Aumentar el padding del botón */
  background-color: #2c666e;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem; /* Aumentar el tamaño de la fuente */
}

button:hover {
  background-color: #07393C;
}
</style>
