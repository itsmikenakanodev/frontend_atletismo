<template>
  <div class="contenedorInicio">
    <div class="contenedorTexto">
      <h2>Campeonatos</h2>
      <p>
        Puedes inscribirte en competencias de diversas pruebas atléticas como marcha, posta, saltos y más, organizadas por provincia. Ofrecemos una suscripción anual que proporciona descuentos exclusivos para la inscripción en pruebas, facilitando así tu participación.
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
        { src: "https://firebasestorage.googleapis.com/v0/b/cloudcomptest-e86ae.appspot.com/o/1.jpg?alt=media&token=28a741b4-1842-4b7a-80f6-9569e1816dbe", alt: "Decatlón" },
        { src: "https://firebasestorage.googleapis.com/v0/b/cloudcomptest-e86ae.appspot.com/o/2.jpeg?alt=media&token=81366d40-c03c-4e50-a18f-4f9aa453d442", alt: "Postas" },
        { src: "https://firebasestorage.googleapis.com/v0/b/cloudcomptest-e86ae.appspot.com/o/3.jpg?alt=media&token=b275d9c9-a221-4268-829b-ac65144fcf62", alt: "Salto con Garrocha" },
        { src: "https://firebasestorage.googleapis.com/v0/b/cloudcomptest-e86ae.appspot.com/o/4.jpg?alt=media&token=f1082d6c-131d-4846-971d-c1e36b3199cb", alt: "Lanzamiento" },
      ],
    };
  },
  methods: {
    goToCampeonatos() {
      this.$router.push('/login');
    }
  }
};
</script>

<style scoped>
.contenedorInicio {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 2rem;
  gap: 2rem;
  background-color: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.contenedorTexto {
  flex: 1;
  max-width: 500px;
  padding-right: 1rem;
  background-color: #ffffff;
  border-radius: 10px;
  padding: 1.5rem;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.contenedorImagen {
  flex: 1;
  max-width: 600px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  overflow: hidden;
}

.image-item {
  width: 100%;
  border-radius: 10px;
  overflow: hidden;
  transition: transform 0.3s;
}

.image-item:hover {
  transform: scale(1.05);
}

#imagenCarousel {
  width: 100%;
  height: auto;
  border-radius: 10px;
}

p {
  margin: 0 0 1rem 0;
  font-size: 1rem;
  line-height: 1.5;
  color: #333;
}

#botonCompetir {
  padding: 0.75rem 1.5rem;
  background-color: #2C666E;
  border: none;
  color: white;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s, transform 0.3s;
}

#botonCompetir:hover {
  background-color: #07393C;
  transform: scale(1.05);
}
</style>
