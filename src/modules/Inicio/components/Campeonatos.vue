<template>
  <div class="contenedorInicio">
    <div class="contenedorTexto">
      <h2>Campeonatos</h2>
      <p>
        Puedes inscribirte en competencias diferentes pruebas atléticas como
        marcha, posta, saltos y más, organizadas por provincia. Ofrecemos una
        suscripción anual que proporciona descuentos exclusivos para la
        inscripción en pruebas, facilitando así tu participación.
      </p>
      <button id="botonCompetir" @click="goToCampeonatos">¡Compite ahora!</button>
    </div>
    <div class="contenedorImagen">
      <div class="image-item">
        <Carousel
          :value="images"
          :numVisible="1"
          :numScroll="1"
          circular
          :autoplayInterval="5000"
          :showIndicators="false"
        >
          <template #item="slotProps">
            <img
              id="imagenCarousel"
              :src="slotProps.data.src"
              :alt="slotProps.data.alt"
            />
          </template>
        </Carousel>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      images: [
        { src: "https://firebasestorage.googleapis.com/v0/b/cloudcomptest-e86ae.appspot.com/o/1.jpg?alt=media&token=28a741b4-1842-4b7a-80f6-9569e1816dbe", alt: "Decatlon" },
        { src: "https://firebasestorage.googleapis.com/v0/b/cloudcomptest-e86ae.appspot.com/o/2.jpeg?alt=media&token=81366d40-c03c-4e50-a18f-4f9aa453d442", alt: "Postas" },
        {
          src: "https://firebasestorage.googleapis.com/v0/b/cloudcomptest-e86ae.appspot.com/o/3.jpg?alt=media&token=b275d9c9-a221-4268-829b-ac65144fcf62",
          alt: "Salto Garrocha",
        },
        {
          src: "https://firebasestorage.googleapis.com/v0/b/cloudcomptest-e86ae.appspot.com/o/4.jpg?alt=media&token=f1082d6c-131d-4846-971d-c1e36b3199cb",
          alt: "Lanzamiento",
        },
      ],
    };
  },
  methods:{
    goToCampeonatos(){
      this.$router.push('/login');
    }
  }
};
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
  width: 45%;
  text-align: justify;
  padding-left: 70px;
}

.contenedorImagen {
  width: 55%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.image-item {
  width: 100%;
  padding: 70px;
}

#imagenCarousel {
  border-radius: 20px;
  padding: 10px 10px;
  width: 100%;
  height: auto;
  position: relative;
}

#botonCompetir {
  padding: 10px 20px;
  background-color: #2C666E;
  border: none;
  color: white;
  border-radius: 5px;
  cursor: pointer;
  font-size: 20px;
}

#botonCompetir:hover {
  background-color: #07393C;
}
</style>