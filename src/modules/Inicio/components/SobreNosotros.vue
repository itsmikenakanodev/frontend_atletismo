<template>
  <div class="contenedorInicio">
    <div class="contenedorImagen">
      <img id="imagenCarousel" src="../assets/anameashede.png" alt="Aname" />
    </div>
    <div class="contenedorTexto">
      <h2>Sobre Nosotros</h2>
      <p>
        En Aname, nos dedicamos a gestionar y organizar registros para competencias 
        atléticas en todo el país. Nuestra plataforma facilita a los atletas inscribirse en 
        eventos según su provincia, garantizando una experiencia de registro rápida 
        y eficiente. Nos comprometemos a ofrecer un servicio seguro, confiable y orientado a 
        las necesidades de nuestros usuarios.
      </p>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style scoped>
.contenedorInicio {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
}

.contenedorTexto {
  display: block;
  width: 60%;
  text-align: justify;
  padding-right: 50px;
}

.contenedorImagen {
  width: 35%;
  display: flex;
  align-items: center;
  justify-content: center;
}

#imagenCarousel {
  padding: 10px;
  width: 100%;
  height: auto;
  max-width: 300px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

p {
  margin-block: 20px;
  font-size: 18px;
}
</style>