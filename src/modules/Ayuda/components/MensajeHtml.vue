<template>
  <div>
    <div style="max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px; background-color: #f9f9f9;">
      <h3 style="color: #333;">Respuesta a su solicitud</h3>
      <p>Estimado usuario,</p>
      <p>Hemos recibido su solicitud y este es el mensaje de respuesta del administrador:</p>
      <p style="padding: 10px; background-color: #fff; border: 1px solid #e0e0e0; border-radius: 5px;">{{ respuesta }}</p>
      <p>Si necesita más ayuda, no dude en contactarnos.</p>
      <p>Saludos cordiales,<br>El equipo de soporte</p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    respuesta: {
      type: String,
      required: true
    }
  }
};
</script>

<style scoped>
p {
  margin: 10px 0;
}

a {
  color: #1a73e8;
  text-decoration: none;
}
</style>
