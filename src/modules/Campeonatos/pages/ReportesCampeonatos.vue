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
                <DataTable v-if="item.maleCompetitors > 0 || item.femaleCompetitors > 0" :value="competidores.filter(c => c.nombreEvento === item.eventName)"
                    showGridlines tableStyle="min-width: 50rem">
                    <Column field="provincia" header="Provincia"></Column>
                    <Column field="apellidos" header="Apellido"></Column>
                    <Column field="nombres" header="Nombre"></Column>
                    <Column field="sexo" header="Genero"></Column>
                    <Column field="numeroCompetidor" header="Nro Competidor">
                        <template #body="{ data }">
                            {{ formatNumberWithZeros(data.numeroCompetidor) }}
                        </template>
                    </Column>
                    <Column field="marca" header="Marca"></Column>
                    <Column field="distancia" header="Distancia"></Column>
                    <Column field="posicion" header="Posicion"></Column>
                    <Column field="puntaje" header="Puntaje"></Column>

                </DataTable>

                <Message v-else severity="info" :closable="false">No hay competidores inscritos en esta prueba.</Message>
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
        },
    },

    methods: {

        async consultarCampeonatos() {
            this.campeonatos = await obtenerCampeonatosSinPruebasFachada();
        },
        formatNumberWithZeros(numero) {
            // Convierte el número a string, rellena con ceros a la izquierda y corta a 5 caracteres
            return numero.toString().padStart(5, '0').slice(0, 5);
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

            this.cargarCompetidores();

        },

        async cargarCompetidores() {
            var reporteCompetidores = await obtenerReporteCompetidoresCampeonatoFachada(this.selectedCampeonato.id);
            this.competidores = reporteCompetidores;
            console.log("Competidores", this.competidores)

        },

    },
}
</script>
<style>
</style>