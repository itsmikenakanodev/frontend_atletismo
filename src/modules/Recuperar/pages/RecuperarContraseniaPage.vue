<template>
  <div class="cont-sup">
    <Toast />
    <div class="cont-log">
      <form class="surface-card" @submit.prevent="solicitarCambio">
        <div class="text-center">
          <div class="text-3xl">Recuperar Contraseña</div>
          <span>Por favor ingrese su correo electrónico para solicitar el cambio de contraseña.</span>
        </div>

        <div class="inputs">
          <FloatLabel>
            <InputText id="ipt-email" v-model="email" required />
            <label for="ipt-email">Correo Electrónico</label>
          </FloatLabel>

          <Button 
            type="submit" 
            :label="enviando ? 'Enviando...' : 'Solicitar cambio de contraseña'" 
            :icon="enviando ? '' : 'pi pi-key'" 
            :disabled="enviando"
          />
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { useToast } from 'primevue/usetoast';
import { enviarcorreoFachada } from '../helpers/enviarCorrreo';
import { createApp, h } from 'vue';
import MensajeHtmlTemplate from '../components/MensajeHtml.vue';

export default {
  data() {
    return {
      email: null,
      url: "http://localhost:3000/#/cambio-contrasenia/",
      cuerpoCorreo: {
        destinatario: this.email,
        asunto: "Notificación de cambio de estado",
        cuerpo: "",
        mensajeHtml: ""
      },
      enviando: false
    };
  },
  setup() {
    const toast = useToast();
    return { toast };
  },
  methods: {
    async solicitarCambio() {
      if (this.email) {
        this.enviando = true;
        const mensaje = this.convertirComponenteHtml(MensajeHtmlTemplate, { email: this.email, url: this.url });
        
        this.cuerpoCorreo.mensajeHtml = mensaje;
        this.cuerpoCorreo.destinatario = this.email;
        
        try {
          await enviarcorreoFachada(this.cuerpoCorreo);
          this.toast.add({ severity: 'success', summary: 'Éxito', detail: 'El correo ha sido enviado exitosamente, revise su bandeja de entrada por favor.', life: 3000 });
        } catch (error) {
          this.toast.add({ severity: 'error', summary: 'Error', detail: 'Hubo un error al enviar el correo. Por favor, intente de nuevo.', life: 3000 });
        } finally {
          this.enviando = false;
        }
      } else {
        this.toast.add({ severity: 'warn', summary: 'Advertencia', detail: 'Por favor, ingrese un correo electrónico.', life: 3000 });
      }
    },
    convertirComponenteHtml(componente, propsData) {
      const app = createApp({
        render() {
          return h(componente, propsData);
        }
      });
      const container = document.createElement('div');
      app.mount(container);
      return container.innerHTML;
    }
  }
};
</script>

<style scoped>
#ipt-email {
  width: 100%;
}

.inputs {
  display: flex;
  flex-direction: column;
  margin-bottom: 1.2rem;
  gap: 1.6rem;
}

.cont-sup {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 6rem;
  width: 100%;
}

.cont-log {
  display: flex;
  align-items: center;
  width: fit-content;
  height: 100%;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  border-radius: 0.25rem;
}

.surface-card {
  padding: 3rem;
  flex: 1;
}

.surface-card .text-center {
  text-align: center;
  margin-bottom: 2rem;
}

.surface-card .text-center .text-3xl {
  font-size: 1.875rem;
  font-weight: 500;
  margin-bottom: 1rem;
}

.surface-card .text-center span {
  display: block;
  margin-bottom: 1rem;
}

.surface-card input[type="text"] {
  width: 100%;
  margin-bottom: 1.25rem;
}

.surface-card>div:last-child {
  margin-bottom: 1.5rem;
}

.surface-card button {
  background-color: #2c666e;
  border: none;
  width: 100%;
}

#ipt-email:focus {
  outline: 1px solid #07393c;
}
</style>
