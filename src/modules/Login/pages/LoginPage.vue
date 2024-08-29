<template>
  <div class="cont-sup">
    <Toast />
    <div class="cont-log">
      <form class="surface-card" @submit.prevent="submitForm">
        <div class="text-center">
          <div class="text-3xl">Bienvenido de nuevo</div>
          <span>¡Bienvenido de nuevo! Por favor ingrese sus datos.</span>
        </div>

        <div class="inputs">
          <FloatLabel>
            <InputText id="ipt-mail" v-model="email" required />
            <label for="ipt-mail">Email</label>
          </FloatLabel>

          <FloatLabel>
            <Password id="ipt-pass" v-model="password" inputId="password" :feedback="false" toggleMask required />
            <label for="password">Contraseña</label>
          </FloatLabel>

          <Button 
            type="submit" 
            label="Iniciar sesión" 
            icon="pi pi-user" 
            :disabled="loading"
          />
        </div>

        <div class="links">
          <a id="registro" href="#/registro">Registrarme</a>
          <a id="recuperar" href="#/recuperar">¿Olvidaste la contraseña?</a>
        </div>
      </form>
      <img class="imagen" src="../assets/login-image.png" alt="Imagen" />
    </div>
  </div>
</template>

<script>
import { useToast } from 'primevue/usetoast';
import { obtenerUsuarioFachada } from "../helpers/UsuarioHelper";

export default {
  data() {
    return {
      email: null,
      password: null,
      loading: false,
    };
  },
  setup() {
    const toast = useToast();
    return { toast };
  },
  methods: {
    async submitForm() {
      this.loading = true;
      try {
        const usuario = {
          email: this.email,
          password: this.password,
        };
        const response = await obtenerUsuarioFachada(usuario);
        localStorage.setItem('userdata', JSON.stringify(response));
        this.$router.push("/");
        setTimeout(() => {
          window.location.reload();
        }, 0);
      } catch (error) {
        console.error("Error al enviar la solicitud:", error);
        if (error.response && error.response.status === 404) {
          this.toast.add({ severity: 'warn', summary: 'Advertencia', detail: 'El usuario no está aprobado.', life: 3000 });
        } else if (error.response && error.response.status === 401) {
          this.toast.add({ severity: 'error', summary: 'Error', detail: 'El email o la contraseña son incorrectos', life: 3000 });
        } else {
          this.toast.add({ severity: 'error', summary: 'Error', detail: 'Hubo un problema al iniciar sesión. Inténtalo de nuevo.', life: 3000 });
        }
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
input#password.p-inputtext.p-component.p-password-input {
  width: 100%;
}

input#password.p-inputtext.p-component.p-password-input:focus {
  outline: 1px solid #07393c;
}
</style>

<style scoped>
#ipt-mail,
#ipt-pass {
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
  padding: 1rem;
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

.imagen {
  flex: 1;
  max-width: calc(50%);
  margin: 0;
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

.surface-card .text-center a {
  font-weight: 500;
  color: #3b82f6;
  text-decoration: none;
  cursor: pointer;
}

.surface-card input[type="text"],
.surface-card input[type="password"] {
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

#ipt-mail:focus {
  outline: 1px solid #07393c;
}

#registro, #recuperar {
  color: #07393c;
  margin-right: 1rem;
}

.links {
  display: flex;
  justify-content: space-between;
}

@media (max-width: 900px) {
  .imagen {
    display: none;
  }
}
</style>
