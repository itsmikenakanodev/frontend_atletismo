<template lang="">
  <div class="card">
    <div class="flex justify-content-end gap-3 py-2">
      <IconField iconPosition="left">
        <InputIcon>
          <i class="pi pi-search" />
        </InputIcon>
        <InputText
          v-model="filtroInput"
          type="text"
          size="small"
          placeholder="Buscar"
        />
      </IconField>

      <!-- Aqui puse un filter pero aun no cacho como es esa vaina de la fecha y pos ahi se queda comentado hasta que se saque de la db -->
      <!-- <FloatLabel class="w-full md:w-14rem">
     <Dropdown v-model="filtroSeleccionado" :options="[{opt:'Más antiguo'}, {opt:'Sede'}]" showClear  optionLabel="opt"  class="w-full md:w-14rem text-sm"/>
     <label class="text-sm">Filtrar por</label>
    </FloatLabel> -->
    </div>

    <Accordion class="custom-accordion" :multiple="true" collapsed>
      <AccordionTab
        name="test-tab"
        v-for="(campeonato, index) in campeonatosFiltrados"
        :key="index"
        class="my-2"
      >
        <template #header>
          <span class="font-bold">{{ campeonato.nombre }}</span>
        </template>

        <div class="grid">
          <div class="col-6">
            <span class="font-bold mr-2">Organizador</span>
            <span>{{ campeonato.organizador }}</span>
          </div>
          <div class="col-12 md:col-6">
            <span class="font-bold mr-2">Sede</span>
            <span>{{ campeonato.sede }}</span>
          </div>
          <div class="col-12 md:col-6">
            <span class="font-bold mr-2">Fecha de inicio</span>
            <span>{{ campeonato.fechaInicio }}</span>
          </div>
        <!--  <div class="col-12 md:col-6">
            <span class="font-bold mr-2">Fecha de finalización</span>
            <span>{{ campeonato.fechaFin }}</span>
          </div>-->
          <div class="col-12 md:col-6">
            <span class="font-bold mr-2">Fecha de inscripción</span>
            <span>{{ campeonato.inscripcionInicio }}</span>
          </div>
          <div class="col-12 md:col-6">
            <span class="font-bold mr-2">Fecha fin de inscripción</span>
            <span>{{ campeonato.inscripcionFin }}</span>
          </div>
        </div>

        <div class="my-2">
          <span class="font-bold mr-2">Pruebas</span>
        </div>

        <DataTable :value="campeonato.pruebas" tableStyle="min-width: 50rem">
          <Column field="nombre" header="Nombre" sortable></Column>
          <Column field="intentos" header="Intentos" sortable></Column>
          <Column field="tipo" header="Tipo" sortable></Column>
          <Column field="categoria" header="Categoría" sortable></Column>
        </DataTable>
      </AccordionTab>
    </Accordion>
  </div>
</template>
<script>
import { obtenerTodosLosCampeonatosFachada } from "../helpers/campeonatosHelper";
export default {
  data() {
    return {
      products: null,
      columns: null,
      filtroSeleccionado: null,
      filtroInput: null,
      campeonatos: null,
    };
  },

  created() {},
  async mounted() {
    this.campeonatos = await obtenerTodosLosCampeonatosFachada();
    console.log(this.campeonatos);
    //  ProductService.getProductsMini().then((data) => (this.products = data));
  },

  methods: {},

  computed: {
    campeonatosFiltrados() {
      if (this.filtroInput) {
        return this.campeonatos.filter((campeonato) => {
          return campeonato.nombre
            .toLowerCase()
            .includes(this.filtroInput.toLowerCase());
        });
      } else {
        return this.campeonatos;
      }
    },
  },
};
</script>
<style scoped>
.custom-accordion {
  border: 1px solid #ccc; /* Borde alrededor del acordeón */
  border-radius: 4px; /* Esquinas redondeadas */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Sombra ligera */
}

.custom-accordion .p-accordion-header {
  border-bottom: 1px solid #ccc; /* Borde inferior para cada encabezado */
}

.custom-accordion .p-accordion-header:not(:first-child) {
  border-top: 1px solid #ccc; /* Borde superior para cada encabezado excepto el primero */
}
</style>
