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
          <div class="col-12 md:col-6">
            <span class="font-bold mr-2">Fecha de finalización</span>
            <span>{{ campeonato.fechaFin }}</span>
          </div>
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
      filtroInput: null,
      campeonatos: [],
    };
  },

  async mounted() {
    this.campeonatos = await this.obtenerCampeonatosValidos();
  },

  methods: {
    async obtenerCampeonatosValidos() {
      const campeonatos = await obtenerTodosLosCampeonatosFachada();
      const hoy = new Date().toISOString().split("T")[0]; // Fecha actual

      return campeonatos.filter(campeonato => {
        const fechaInicio = new Date(campeonato.fechaInicio).toISOString().split("T")[0];
        const fechaFin = new Date(campeonato.fechaFin).toISOString().split("T")[0];
        const inscripcionInicio = new Date(campeonato.inscripcionInicio).toISOString().split("T")[0];
        const inscripcionFin = new Date(campeonato.inscripcionFin).toISOString().split("T")[0];

        // Verificar que todas las fechas sean desde hoy en adelante
        const fechasValidas = [fechaInicio, fechaFin, inscripcionInicio, inscripcionFin].every(fecha => fecha >= hoy);

        // Verificar que la fecha de inscripción esté antes de la fecha de inicio
        const inscripcionValida = inscripcionInicio < fechaInicio && inscripcionFin < fechaInicio;

        return fechasValidas && inscripcionValida;
      });
    },
  },

  computed: {
    campeonatosFiltrados() {
      if (this.filtroInput) {
        return this.campeonatos.filter(campeonato =>
          campeonato.nombre.toLowerCase().includes(this.filtroInput.toLowerCase())
        );
      } else {
        return this.campeonatos;
      }
    },
  },
};
</script>

<style scoped>
.custom-accordion {
  border: 1px solid #ccc;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.custom-accordion .p-accordion-header {
  border-bottom: 1px solid #ccc;
}

.custom-accordion .p-accordion-header:not(:first-child) {
  border-top: 1px solid #ccc;
}
</style>
