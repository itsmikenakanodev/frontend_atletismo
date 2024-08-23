<template>
  <div class="cont-sup">
    <div class="cont-log">
      <form class="surface-card" @submit.prevent="cambiarContrasenia">
        <div class="text-center">
          <div class="text-3xl">Cambio de Contraseña</div>
          <span>Ingrese y confirme su nueva contraseña.</span>
        </div>

        <div class="inputs">
          <FloatLabel>
            <Password id="ipt-new-pass" v-model="newPassword" inputId="new-password" :feedback="false" toggleMask required />
            <label for="new-password">Nueva Contraseña</label>
          </FloatLabel>
          
          <FloatLabel>
            <Password id="ipt-confirm-pass" v-model="confirmPassword" inputId="confirm-password" :feedback="false" toggleMask required />
            <label for="confirm-password">Confirmar Nueva Contraseña</label>
          </FloatLabel>

          <Button type="submit" label="Cambiar Contraseña" icon="pi pi-check"></Button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import router from '@/router';
import { recuperarContraseniaFachada } from '../helpers/recuperar';

export default {

  data() {
    return {
      newPassword: null,
      confirmPassword: null,
      correo: this.$route.params.correo,
    };
  },
  methods: {
  async  cambiarContrasenia() {
      if (this.newPassword !== this.confirmPassword) {
        alert('Las contraseñas no coinciden. Por favor, inténtelo de nuevo.');
        return;
      } 
    let confirmarCambio = await recuperarContraseniaFachada(this.correo, this.newPassword) 

      if(confirmarCambio){

      alert('Su contraseña ha sido cambiada exitosamente.');
      this.redirigirAVerLogin();

      }else{
        alert('Su contraseña no se pudo cambiar')
      }
    },

    async redirigirAVerLogin() {
            const ruta = `/login`;
            await router.push({ path: ruta });
        }
  },
};
</script>

<style>
input#new-password.p-inputtext.p-component,
input#confirm-password.p-inputtext.p-component {
  width: 150%;
  
}

input#new-password.p-inputtext.p-component:focus,
input#confirm-password.p-inputtext.p-component:focus {
  outline: 1px solid #07393c;
  
}
</style>

<style scoped>
#new-password,
#confirm-password {
  width: 100%;
  
}

.inputs {
  display: flex;
  flex-direction: column;
  margin-bottom: 1.2rem;
  gap: 1.6rem;
  align-items: center;
}

.cont-sup {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 4.5rem;
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

#new-password:focus,
#confirm-password:focus {
  outline: 1px solid #07393c;
}
</style>
