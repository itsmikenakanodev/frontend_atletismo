<template>
    <div v-show="visible" class="overlay" @click.self="hide">
      <div class="perfil-atleta" @click.stop>
        <div class="perfil-header">
          <h4>Perfil del Atleta</h4>
          <Button icon="pi pi-times" class="close-button" @click="hide" />
        </div>
        <div class="perfil-body" v-if="atleta">
          <p><strong>Nombre:</strong> {{ atleta.nombres }} {{ atleta.apellidos }}</p>
          <p><strong>Cédula:</strong> {{ atleta.cedula }}</p>
          <p><strong>Dirección:</strong> {{ atleta.direccion }}</p>
          <p><strong>Ciudad:</strong> {{ atleta.ciudad }}</p>
          <p><strong>Email:</strong> {{ atleta.email }}</p>
          <p><strong>Teléfono:</strong> {{ atleta.telefono }}</p>
          <p><strong>Fecha de Nacimiento:</strong> {{ formatDate(atleta.fechaNacimiento) }}</p>
          <p><strong>Estado:</strong> {{ atleta.estado ? 'Activo' : 'Inactivo' }}</p>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      visible: {
        type: Boolean,
        required: true
      },
      atleta: {
        type: Object,
        required: false,
        default: () => ({})
      }
    },
    methods: {
      hide() {
        this.$emit('update:visible', false);
      },
      formatDate(date) {
        if (!date) return '';
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(date).toLocaleDateString(undefined, options);
      }
    }
  };
  </script>
  
  <style scoped>
  .overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 999;
  }
  
  .perfil-atleta {
    background: #ffffff; /* Color de fondo blanco */
    padding: 2rem;
    border-radius: 8px;
    width: 80%;
    max-width: 600px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    color: #333; /* Color del texto */
  }
  
  .perfil-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    border-bottom: 1px solid #e0e0e0; /* Línea inferior sutil */
    padding-bottom: 0.5rem;
  }
  
  .close-button {
    border: none;
    background: transparent;
    cursor: pointer;
    font-size: 1.5rem;
    color: #007bff; /* Color del icono */
  }
  
  .perfil-body p {
    margin: 0.5rem 0;
    padding: 0.5rem;
    border-bottom: 1px solid #e0e0e0; /* Línea inferior entre campos */
  }
  
  .perfil-body p:last-child {
    border-bottom: none;
  }
  </style>
  