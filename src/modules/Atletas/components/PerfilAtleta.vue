<template>
  <div class="overlay" @click.self="$emit('close')">
    <div class="perfil-atleta">
      <h2>Perfil de Atleta</h2>
      <p><strong>Nombre:</strong> {{ atleta.nombres }} {{ atleta.apellidos }}</p>
      <p><strong>Cédula:</strong> {{ atleta.cedula }}</p>
      <p><strong>Email:</strong> {{ atleta.email }}</p>
      <p><strong>Ciudad:</strong> {{ atleta.ciudad }}</p>

      <!-- Mostrar datos adicionales solo si el rol es 1 o 6 -->
      <div v-if="rol === 1 || rol === 6">
        <p><strong>Dirección:</strong> {{ atleta.direccion }}</p>
        <p><strong>Teléfono:</strong> {{ atleta.telefono }}</p>
        <p><strong>Fecha de Nacimiento:</strong> {{ formatDate(atleta.fechaNacimiento) }}</p>
        <p><strong>Estado:</strong> {{ atleta.estado ? 'Activo' : 'Inactivo' }}</p>
      </div>

      <button @click="$emit('close')">Cerrar</button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    atleta: {
      type: Object,
      required: true
    },
    rol: { // Recibir el rol del usuario como prop
      type: Number,
      required: true
    }
  },
  methods: {
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
  background-color: rgba(0, 0, 0, 0.5); /* Fondo semi-transparente */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999; /* Asegúrate de que esté por encima de otros elementos */
}

.perfil-atleta {
  background: #ffffff; /* Color de fondo blanco */
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  width: 80%;
  max-width: 600px;
  color: #333; /* Color del texto */
}

button {
  background-color: #2c666e;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #4b8b92;
}
</style>
  