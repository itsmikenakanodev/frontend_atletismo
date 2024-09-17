<template>
  <div class="card">
    <Toast />

    <!-- Mensaje de carga mientras se obtienen los mensajes -->
    <section v-if="cargando" class="cargando">
      <div class="spinner"></div>
      <p>Cargando mensajes...</p>
    </section>

    <!-- Mostrar mensajes si hay resultados y no está cargando -->
    <DataTable v-else :value="mensajes" tableStyle="min-width: 50rem" paginator :rows="5" :rowsPerPageOptions="[5, 10, 20, 50]">
      <Column field="email" header="Correo Electrónico" sortable></Column>
      <Column field="mensaje" header="Mensaje" sortable></Column>
      <Column field="fechaEnvio" header="Fecha de Envío" sortable>
        <template #body="slotProps">
          <span>{{ new Date(slotProps.data.fechaEnvio).toLocaleString() }}</span>
        </template>
      </Column>
      <Column header="Acción">
        <template #body="slotProps">
          <Button label="Responder" icon="pi pi-pencil" @click="verDetalles(slotProps.data)" />
        </template>
      </Column>
    </DataTable>

    <!-- Mostrar mensaje si no hay mensajes y ya terminó la carga -->
    <p v-if="!cargando && mensajes.length === 0" class="no-mensajes">No hay mensajes de ayuda.</p>

    <Dialog v-model:visible="mensajeVisible" :modal="true" :style="{ width: '75vw' }">
      <div class="dialog-content">
        <h3>Detalles del Mensaje</h3>
        <p><strong>Correo:</strong> {{ mensajeCorreo }}</p>
        <p><strong>Mensaje Original:</strong></p>
        <pre>{{ mensajeTexto }}</pre>
        <div class="form-group">
          <label for="respuesta">Tu Respuesta</label>
          <textarea
            id="respuesta"
            v-model="respuesta"
            rows="10"
            required
          ></textarea>
        </div>
        <button @click="enviarRespuesta" :disabled="enviando">
          {{ enviando ? 'Enviando...' : 'Enviar Respuesta' }}
        </button>
      </div>
    </Dialog>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useToast } from 'primevue/usetoast';
import { obtenerMensajesFachada, eliminarMensajeFachada } from '../helpers/centroayuda'; // Asegúrate de la ruta correcta
import { enviarcorreoFachada } from '../helpers/enviarCorrreo'; // Asegúrate de la ruta correcta

export default {
  setup() {
    const toast = useToast(); // Usa useToast en setup

    const mensajes = ref([]);
    const cargando = ref(true); // Estado de carga
    const mensajeVisible = ref(false);
    const mensajeCorreo = ref("");
    const mensajeTexto = ref("");
    const respuesta = ref("");
    const mensajeId = ref(null);
    const enviando = ref(false);

    const obtenerMensajes = async () => {
      try {
        mensajes.value = await obtenerMensajesFachada();
      } catch (error) {
        console.error("Error al obtener los mensajes:", error);
        toast.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudieron cargar los mensajes.',
          life: 3000
        });
      } finally {
        cargando.value = false; // Finaliza el estado de carga
      }
    };

    const verDetalles = (data) => {
      mensajeVisible.value = true;
      mensajeCorreo.value = data.email;
      mensajeTexto.value = data.mensaje;
      mensajeId.value = data.id;
    };

    const enviarRespuesta = async () => {
      if (!respuesta.value.trim()) {
        toast.add({
          severity: 'warn',
          summary: 'Advertencia',
          detail: 'Por favor, ingrese una respuesta antes de enviar.',
          life: 3000
        });
        return;
      }

      enviando.value = true; // Mostrar "Enviando..." y deshabilitar el botón

      const mensajeHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px; background-color: #ffffff;">
          <header style="border-bottom: 2px solid #1a73e8; padding-bottom: 10px; margin-bottom: 20px;">
            <h2 style="color: #1a73e8;">Respuesta a su Solicitud</h2>
          </header>
          <section style="margin-bottom: 20px;">
            <p style="font-size: 16px; color: #333333;">Hola,</p>
            <p style="font-size: 16px; color: #333333;">Hemos recibido su solicitud y aquí está nuestra respuesta:</p>
            <div style="background-color: #f4f4f4; padding: 10px; border: 1px solid #e0e0e0; border-radius: 5px; margin-bottom: 20px;">
              <p style="margin: 0;"><strong>Correo Electrónico:</strong> ${mensajeCorreo.value}</p>
              <p style="margin: 0;"><strong>Mensaje Original:</strong></p>
              <p style="margin: 0;">${mensajeTexto.value}</p>
            </div>
          </section>
          <section>
            <p style="font-size: 16px; color: #333333;">A continuación, encontrará nuestra respuesta:</p>
            <div style="background-color: #e9f5ff; padding: 10px; border: 1px solid #b3d9ff; border-radius: 5px;">
              <p style="margin: 0; font-size: 16px; color: #004080;">${respuesta.value}</p>
            </div>
          </section>
          <footer style="border-top: 2px solid #e0e0e0; padding-top: 10px; margin-top: 20px;">
            <p style="font-size: 14px; color: #777777; text-align: center;">Este es un mensaje automático. Por favor, no responda a este correo.</p>
          </footer>
        </div>
      `;

      try {
        await enviarcorreoFachada({
          destinatario: mensajeCorreo.value,
          asunto: 'Respuesta a su solicitud',
          mensajeHtml // Incluye el HTML de la respuesta
        });

        // Eliminar el mensaje del usuario
        await eliminarMensajeFachada(mensajeId.value);

        toast.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Respuesta enviada y mensaje eliminado correctamente.',
          life: 3000
        });
        respuesta.value = "";
        mensajeVisible.value = false;
        await obtenerMensajes();
      } catch (error) {
        toast.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo enviar la respuesta. Inténtalo nuevamente más tarde.',
          life: 3000
        });
      } finally {
        enviando.value = false; // Restablecer el estado de carga
      }
    };

    onMounted(() => {
      obtenerMensajes();
    });

    return {
      mensajes,
      cargando,
      mensajeVisible,
      mensajeCorreo,
      mensajeTexto,
      respuesta,
      mensajeId,
      enviando,
      verDetalles,
      enviarRespuesta
    };
  }
};
</script>

<style scoped>
.card {
  margin: 10px;
}

/* Mensaje de carga con animación */
.cargando {
  font-size: 1rem;
  color: black;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px; /* Ajusta la altura según sea necesario */
}

.spinner {
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top: 4px solid #2C666E;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin-bottom: 10px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Mensaje si no hay mensajes */
.no-mensajes {
  font-size: 1rem;
  color: #ff4d4f;
}

/* Resto de estilos */
.dialog-content {
  padding: 1rem;
}

.form-group {
  margin-bottom: 1rem;
}

textarea {
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

button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}
</style>