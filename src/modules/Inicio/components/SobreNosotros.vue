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
p {
  margin-block: 40px;
  font-size: 20px;
}

.contenedorInicio {
  display: flex;
  flex-direction: row;
}

.contenedorTexto {
  display: block;
  width: 65%;
  text-align: justify;
  padding-right: 70px;
}

.contenedorImagen {
  width: 35%;
  display: flex;
  align-items: center;
  justify-content: center;
}

#imagenCarousel {
  padding: 10px 10px;
  width: 50%;
  height: auto;
  position: relative;
  margin: 70px;
}

#botonCompetir {
  padding: 10px 20px;
  background-color: rgb(59, 59, 251);
  border: none;
  color: white;
  border-radius: 5px;
  cursor: pointer;
  font-size: 20px;
}

#botonCompetir:hover {
  background-color: rgb(70, 70, 200);
}
</style>