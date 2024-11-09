<template>
    <h2>Reporte {{ nombreCampeonato }}</h2>
    <Dropdown v-model="selectedCampeonato" :options="campeonatos" filter optionLabel="nombre" placeholder="Seleccione"
        class="w-full md:w-30rem"></Dropdown>
    <Button v-if="selectedCampeonato !== null" @click="cargar" label="Cargar Reporte"></Button>
    <span></span>
    <DataTable :value="reporteCampeonato" showGridlines class="mt-3" tableStyle="min-width: 50rem">
        <Column field="maleCompetitors" header="Masculino"></Column>
        <Column field="femaleCompetitors" header="Femenino"></Column>
    </DataTable>
    <Button v-if="reporteCampeonato" @click="cargarCompetidores"
        :label="showCompetidores == false ? 'Mostrar Competidores' : 'Ocultar Competidores'"></Button>
    <span></span>
    <div class="contenedorInicio">


        <Accordion v-if="reportePruebas && reportePruebas.length > 0" :activeIndex="0">
            <AccordionTab v-for="(item, index) in reportePruebas" :key="index">
                <template #header>
                    <span>
                        <h3>Damas: {{ item.femaleCompetitors }}</h3>
                        <h3>Varones: {{ item.maleCompetitors }}</h3>
                    </span>
                    <h2>{{ item.eventName }}</h2>
                </template>
                <DataTable v-if="showCompetidores" :value="competidores.filter(c => c.nombreEvento === item.eventName)"
                    showGridlines tableStyle="min-width: 50rem">
                    <Column field="provincia" header="Provincia"></Column>
                    <Column field="apellidos" header="Apellido"></Column>
                    <Column field="nombres" header="Nombre"></Column>
                    <Column field="sexo" header="Genero"></Column>
                    <Column field="esMiembro" header="Socio">
                        <template #body="{ data }">
                            <span v-if="data.esMiembro === true">
                                Si
                            </span>
                            <span v-if="data.esMiembro === false">
                                No
                            </span>

                        </template>
                    </Column>

                </DataTable>
            </AccordionTab>


        </Accordion>

    </div>

</template>
<script>
import { obtenerCampeonatosSinPruebasFachada } from "../helpers/ObtenerCampeonatosHelper.js"
import { obtenerReporteCampeonatoFachada, obtenerReportePruebasCampeonatoFachada, obtenerReporteCompetidoresCampeonatoFachada } from "../helpers/ReportesHelper.js";
export default {
    data() {
        return {
            provincias: [
                "Azuay",
                "Bolívar",
                "Cañar",
                "Carchi",
                "Chimborazo",
                "Cotopaxi",
                "El Oro",
                "Esmeraldas",
                "Galápagos",
                "Guayas",
                "Imbabura",
                "Loja",
                "Los Ríos",
                "Manabí",
                "Morona Santiago",
                "Napo",
                "Orellana",
                "Pastaza",
                "Pichincha",
                "Santa Elena",
                "Santo Domingo de los Tsáchilas",
                "Sucumbíos",
                "Tungurahua",
                "Zamora Chinchipe",
            ],
            campeonatos: [],
            selectedCampeonato: null,

            selectedPruebasCompetidores: null,
            pruebasCompetidores: null,
            selectedCampeonatoPrueba: null,
            campeonatosPruebas: [],
            competidores: [],
            reporteCampeonato: null,
            reportePruebas: null,
            showCompetidores: false
        }
    },
    mounted() {
        //this.consultarCampeonatosPruebas()
        this.consultarCampeonatos();
    },

    computed: {
        nombreCampeonato() {
            return this.selectedCampeonato ? this.selectedCampeonato.nombre : '';
        }
    },

    methods: {

        async consultarCampeonatos() {
            this.campeonatos = await obtenerCampeonatosSinPruebasFachada();
        },

        cargar() {
            this.consultarPruebasDeCampeonato();
        },

        async consultarPruebasDeCampeonato() {
            var conteoCampeonato = await obtenerReporteCampeonatoFachada(this.selectedCampeonato.id);
            this.reporteCampeonato = [conteoCampeonato];
            console.log("Campeonato", conteoCampeonato)

            var conteoPruebas = await obtenerReportePruebasCampeonatoFachada(this.selectedCampeonato.id);
            this.reportePruebas = conteoPruebas;
            console.log("Pruebas", conteoPruebas)

        },

        async cargarCompetidores() {
            if (!this.showCompetidores) {
                var reporteCompetidores = await obtenerReporteCompetidoresCampeonatoFachada(this.selectedCampeonato.id);
                this.competidores = reporteCompetidores;
                console.log("Competidores", this.competidores)
            }

            this.showCompetidores = !this.showCompetidores;
        },
    },
}
</script>
<style></style>