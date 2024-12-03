<template>
    <section class="cargando">
      <div class="spinner"></div>
      <p>{{ mensaje }}</p>
    </section>
  </template>
  
  <script>
  export default {
    name: 'LoadingSpinner',
    props: {
      mensaje: {
        type: String,
        default: 'Cargando...'
      }
    }
  }
  </script>
  
  <style scoped>
  .cargando {
    font-size: 1rem;
    color: #000;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 200px; /* Ajusta la altura según sea necesario */
  }
  
  .spinner {
    border: 4px solid rgba(0, 0, 0, 0.1);
    border-radius: 50%;
    border-top: 4px solid #000;
    width: 40px;
    height: 40px;
    animation: spin 1s linear infinite;
    margin-bottom: 10px;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  </style>