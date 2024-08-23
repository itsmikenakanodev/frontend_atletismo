<template>
  <div class="contenedorPrincipal">
    <div class="contenedorInicio">
      <div class="contenedorTexto">
        <h2>{{ campeonato.nombre }}</h2>
        <h3>Fecha inicio: {{ campeonato.fechaInicio }}</h3>
        <h3>Fecha finalización: {{ campeonato.fechaFin }}</h3>
        <h3>Fecha Inscripciones: {{ campeonato.inscripcionInicio }} - {{ campeonato.inscripcionFin }}</h3>
        <h3>Organizador: {{ campeonato.organizador }}</h3>
        <h3>Sede: {{ campeonato.sede }}</h3>
        <div>
        </div>

      </div>
      <div class="contenedorImagen">
        <div class="image-item">
          <img id="imagenCarousel" :src="provincias_urls[campeonato.sede]" alt="No se pudo cargar imagen" />
        </div>
      </div>
    </div>
    <div class="contenedor">
      <Accordion class="custom-accordion" :multiple="true" collapsed>
        <AccordionTab header="Pruebas del Campeonato" name="test-tab" class="my-2">
          <DataTable :value="campeonato.pruebas" tableStyle="min-width: 50rem">
            <Column field="nombre" header="Nombre" sortable></Column>
            <Column field="descripcion" header="Descripción" sortable></Column>
            <Column field="tipo" header="Tipo" sortable></Column>
            <Column field="categoria" header="Categoría" sortable></Column>
          </DataTable>
        </AccordionTab>
      </Accordion>
      <div class="centeredItem">
        <button class="mb-3" v-if="usuario.roles.id===5" @click="mostrarInscripcionCampeonato(campeonato.id)">Inscripciones</button>
      </div>
    </div>

  </div>
</template>

<script>

export default {
  props: {
    campeonato: {
      type: Object,
      required: true,
    },
    pruebas: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      provincias_urls: {
        "Azuay": "https://firebasestorage.googleapis.com/v0/b/cloudcomptest-e86ae.appspot.com/o/1.jpg?alt=media&token=28a741b4-1842-4b7a-80f6-9569e1816dbe",
        "Bolívar": "https://firebasestorage.googleapis.com/v0/b/cloudcomptest-e86ae.appspot.com/o/2.jpeg?alt=media&token=81366d40-c03c-4e50-a18f-4f9aa453d442",
        "Cañar": "https://firebasestorage.googleapis.com/v0/b/cloudcomptest-e86ae.appspot.com/o/3.jpg?alt=media&token=b275d9c9-a221-4268-829b-ac65144fcf62",
        "Carchi": "https://firebasestorage.googleapis.com/v0/b/cloudcomptest-e86ae.appspot.com/o/4.jpg?alt=media&token=f1082d6c-131d-4846-971d-c1e36b3199cb",
        "Chimborazo": "https://firebasestorage.googleapis.com/v0/b/cloudcomptest-e86ae.appspot.com/o/5.jpeg?alt=media&token=464af6f1-2883-4bf4-b608-61a6e4e6ff9a",
        "Cotopaxi": "https://firebasestorage.googleapis.com/v0/b/cloudcomptest-e86ae.appspot.com/o/6.jpg?alt=media&token=bad35508-30f8-4688-8956-68b335020677",
        "El Oro": "https://firebasestorage.googleapis.com/v0/b/cloudcomptest-e86ae.appspot.com/o/7.jpeg?alt=media&token=41c3ed6f-cccc-4468-bf5a-6bcc2fc1a3ae",
        "Esmeraldas": "https://firebasestorage.googleapis.com/v0/b/cloudcomptest-e86ae.appspot.com/o/8.jpeg?alt=media&token=1c1d19a4-bff8-4f99-85e1-8b271000a0d2",
        "Galápagos": "https://firebasestorage.googleapis.com/v0/b/cloudcomptest-e86ae.appspot.com/o/9.jpg?alt=media&token=1be0cf1c-d0cf-4b45-afc9-fe5651325e50",
        "Guayas": "https://firebasestorage.googleapis.com/v0/b/cloudcomptest-e86ae.appspot.com/o/10.jpg?alt=media&token=f91e6a1f-b9b8-4f34-87a8-60e3e01f964d",
        "Imbabura": "https://firebasestorage.googleapis.com/v0/b/cloudcomptest-e86ae.appspot.com/o/11.jpeg?alt=media&token=87a8521a-a52c-458a-9f3d-86a9717e9799",
        "Loja": "https://firebasestorage.googleapis.com/v0/b/cloudcomptest-e86ae.appspot.com/o/12.jpg?alt=media&token=bcdf83a7-3438-4d61-8b9a-ab4e03addae5",
        "Los Ríos": "https://firebasestorage.googleapis.com/v0/b/cloudcomptest-e86ae.appspot.com/o/13.jpg?alt=media&token=57d14c0d-2442-4aae-9e3a-9ddc581075d8",
        "Manabí": "https://firebasestorage.googleapis.com/v0/b/cloudcomptest-e86ae.appspot.com/o/14.jpg?alt=media&token=39cd5b7c-1f9c-4c14-947f-507f0754b8fa",
        "Morona Santiago": "https://firebasestorage.googleapis.com/v0/b/cloudcomptest-e86ae.appspot.com/o/15.jpg?alt=media&token=a47323c0-e82a-45ba-95ae-bfc076fbb232",
        "Napo": "https://firebasestorage.googleapis.com/v0/b/cloudcomptest-e86ae.appspot.com/o/16.jpeg?alt=media&token=0604fb6c-3da4-4364-8c36-faee717d98cb",
        "Sucumbíos": "https://firebasestorage.googleapis.com/v0/b/cloudcomptest-e86ae.appspot.com/o/17.jpg?alt=media&token=62ed5ff4-fae4-45f6-bf76-68b8dbd537ab",
        "Pastaza": "https://firebasestorage.googleapis.com/v0/b/cloudcomptest-e86ae.appspot.com/o/18.jpg?alt=media&token=4b355256-db20-4549-800c-a4d730699923",
        "Pichincha": "https://firebasestorage.googleapis.com/v0/b/cloudcomptest-e86ae.appspot.com/o/19.jpeg?alt=media&token=429bf271-5837-4e01-b4c3-7bc81b8f81c5",
        "Santa Elena": "https://firebasestorage.googleapis.com/v0/b/cloudcomptest-e86ae.appspot.com/o/20.jpg?alt=media&token=d8204c6a-de35-40f1-8cad-ee2d4c29cfbc",
        "Santo Domingo de los Tsáchilas": "https://firebasestorage.googleapis.com/v0/b/cloudcomptest-e86ae.appspot.com/o/21.jpg?alt=media&token=6129a343-b83f-422e-9d4a-45e47538a4b6",
        "Orellana": "https://firebasestorage.googleapis.com/v0/b/cloudcomptest-e86ae.appspot.com/o/22.jpg?alt=media&token=b0bda827-0b8a-4554-9c7d-c5b9db502cc9",
        "Tungurahua": "https://firebasestorage.googleapis.com/v0/b/cloudcomptest-e86ae.appspot.com/o/23.jpg?alt=media&token=ab95ec39-fd8d-4e35-99bf-3067e3c6cdae",
        "Zamora Chinchipe": "https://firebasestorage.googleapis.com/v0/b/cloudcomptest-e86ae.appspot.com/o/24.jpg?alt=media&token=c29c02e8-c263-4595-8188-14c898e6bca6"
      },
      usuario: JSON.parse(localStorage.getItem('userdata'))

    };
  },
  methods: {
    mostrarInscripcionCampeonato(campeonatoId) {
      this.$router.push({ name: 'InscripcionCompetidores', params: { id: campeonatoId } });
    },
  },
};
</script>

<style scoped>
p {
  margin-block: 40px;
  font-size: 20px;
}

.contenedorPrincipal {
  display: flex;
  flex-direction: column;
  justify-content: center;
  background-color: #90DDF0;
  padding: 20px;
  margin: 10px;
  border-radius: 20px;
}

.contenedor {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.contenedorInicio {
  display: flex;
  flex-direction: row;
  align-items: center;
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
  width: 90%;
  padding: 70px;
}

#imagenCarousel {
  border-radius: 20px;
  width: 400px;
  height: auto;
  position: relative;
}

#verCampeonato {
  padding: 10px 20px;
  background-color: #2c666e;
  border: none;
  color: white;
  border-radius: 5px;
  cursor: pointer;
  font-size: 20px;
}

#verCampeonato:hover {
  background-color: #07393c;
}

button {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 30%;
  padding: 12px;
  margin-top: 15px;
  margin-bottom: -15px;
  background-color: #2C666E;
  color: #0A090C;
  border: none;
  font-size: 18px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button:hover {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 30%;
  padding: 12px;
  margin-top: 15px;
  margin-bottom: -15px;
  background-color: #f0edee;
  color: #0A090C;
  border: none;
  font-size: 18px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.centeredItem {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
