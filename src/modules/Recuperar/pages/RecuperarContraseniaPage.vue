<template>
    <div class="cont-sup">
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
  
            <Button @click="enviarCorreo()" type="submit" label="Solicitar cambio de contraseña"  icon="pi pi-key"></Button>
          </div>
        </form>
      </div>
    </div>
  </template>
  
  <script>
  import { enviarcorreoFachada } from '../helpers/enviarCorrreo';
  import { createApp, h } from 'vue';
  import MensajeHtmlTemplate from '../components/MensajeHtml.vue';

  export default {
    data() {
      return {
        email: null,
        url: "http://localhost:3000/#/cambio-contrasenia/",
        cuerpoCorreo:{
        destinatario:this.email,
        asunto:"Notificación de cambio de estado",
        cuerpo:"",
        mensajeHtml:""
      }
      };
    },
    methods: {
      
      async enviarCorreo(){     
        const mensaje = this.convertirComponenteHtml(MensajeHtmlTemplate, { email: this.email, url:this.url});
        
        //this.cuerpoCorreo.cuerpo="Has solicitado un cambio de contraseña: " + this.url +"/"+this.email;
        this.cuerpoCorreo.mensajeHtml=mensaje;
        this.cuerpoCorreo.destinatario= this.email;
        await enviarcorreoFachada(this.cuerpoCorreo);

      alert("El correo ha sido enviado exitosamente");

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
    },
    },
  };
  </script>
  
  <style>
  input#ipt-email.p-inputtext.p-component {
    width: 100%;
  }
  
  input#ipt-email.p-inputtext.p-component:focus {
    outline: 1px solid #07393c;
  }
  </style>
  
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
  