<template>
  <div>
    <div style="max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px; background-color: #f9f9f9;">
      <h3 style="color: #333;">Has solicitado un cambio de contraseña para el usuario con email:</h3>
      <span style="display: block; margin: 10px 0; padding: 10px; background-color: #fff; border: 1px solid #e0e0e0; border-radius: 5px; word-wrap: break-word;">{{ email }}</span>
      <p>Haga clic en el siguiente botón para restablecer su contraseña:</p>
      <div style="display: block; margin: 10px 0;">
        <a :href="encodedUrl" style="
          display: inline-block;
          padding: 10px 20px;
          background-color: #1a73e8;
          color: #fff;
          text-decoration: none;
          border-radius: 5px;
          font-weight: bold;
          text-align: center;
          transition: background-color 0.3s ease;
        " @mouseover="hover = true" @mouseleave="hover = false">Restablecer contraseña</a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    email: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true
    }
  },
  computed: {
    encodedUrl() {
      return `${this.url}${encodeURIComponent(this.email)}`;
    }
  },
  data() {
    return {
      hover: false
    };
  }
};
</script>

<style scoped>
a:hover {
  background-color: #1558b0;
}
</style>
