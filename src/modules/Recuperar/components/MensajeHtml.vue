<template>
  <div>
    <div style="max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px; background-color: #f9f9f9;">
      <h3 style="color: #333;">Has solicitado un cambio de contraseña para el usuario con email:</h3>
      <span style="display: block; margin: 10px 0; padding: 10px; background-color: #fff; border: 1px solid #e0e0e0; border-radius: 5px; word-wrap: break-word;">{{ email }}</span>
      <p>Ingrese al siguiente enlace para restablecer su contraseña:</p>
      <div style="display: block; margin: 10px 0; padding: 10px; background-color: #fff; border: 1px solid #e0e0e0; border-radius: 5px; word-wrap: break-word;">
        <a :href="url" style="color: #1a73e8; text-decoration: none;">{{ url + email}}</a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
props:{
    email: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true
    }
}
}
</script>

<style>

</style>