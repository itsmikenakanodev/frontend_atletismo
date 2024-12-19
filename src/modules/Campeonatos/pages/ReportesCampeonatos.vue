<template>
    <div class="container">
        <Toast></Toast>
        <h2 class="title">Reporte del campeonato: {{ nombreCampeonato }}</h2>

        <section class="filtros">
            <div class="filtro">
                <span class="filtro-text">Año:</span>
                <div class="filtro-opciones filtro-anos">
                    <button v-for="year in availableYears" 
                        :key="year"
                        :class="['filtro-boton', { activo: year === selectedYear }]" 
                        @click="filtrarCampeonatosPorAno(year)">
                        {{ year }}
                    </button>
                </div>
            </div>

            <div class="filtro">
                <span class="filtro-text">Mes:</span>
                <div class="filtro-opciones filtro-meses">
                    <button v-for="(mes, index) in meses" 
                        :key="index"
                        :class="['filtro-boton', { activo: index + 1 === selectedMonth }]"
                        @click="filtrarCampeonatosPorMes(index + 1)">
                        {{ mes }}
                    </button>
                </div>
            </div>
        </section>

        <div class="dropdown-container">
            <Dropdown 
                v-model="selectedCampeonato" 
                :options="campeonatosFiltrados" 
                filter 
                optionLabel="nombre" 
                placeholder="Seleccione el campeonato que desea ver..."
                class="dropdown"
                emptyFilterMessage="No hay campeonatos para la fecha seleccionada"
            ></Dropdown>
            <Button 
                v-if="selectedCampeonato !== null" 
                @click="cargarReporte" 
                label="Cargar Reporte"
                class="primary-button"
            ></Button>
        </div>
        
        <LoadingSpinner v-if="loading" :mensaje="loadingMessage" />

        <DetalleReporteCampeonato
            v-if="reporteCampeonato && reportePruebas && (reporteCampeonato.maleCompetitors > 0 || reporteCampeonato.femaleCompetitors > 0)"
            :reporteCampeonato="reporteCampeonato"
            :reportePruebas="reportePruebas"
            :competidores="competidores"
        />
    </div>
</template>

<script>
import DetalleReporteCampeonato from '../components/DetalleReporteCampeonato.vue'
import { obtenerCampeonatosSinPruebasFachada } from "../helpers/ObtenerCampeonatosHelper.js"
import { obtenerReporteCampeonatoFachada, obtenerReportePruebasCampeonatoFachada, obtenerReporteCompetidoresCampeonatoFachada } from "../helpers/ReportesHelper.js";
import LoadingSpinner from '../../../components/LoadingSpinner.vue';

export default {
    components: {
        DetalleReporteCampeonato,
        LoadingSpinner
    },
    data() {
        const currentDate = new Date();
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
            showCompetidores: false,
            activeIndex: null,
            selectedYear: currentDate.getFullYear(),
            selectedMonth: currentDate.getMonth() + 1,
            meses: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
            availableYears: [],
            campeonatosFiltrados: [],
            loading: false,
            loadingMessage: "Cargando reporte, espere un momento...",
        }
    },
    mounted() {
        console.log("Valores iniciales - año:", this.selectedYear, "mes:", this.selectedMonth);
        this.availableYears = this.getAvailableYears(2024);
        this.consultarCampeonatos();
    },

    computed: {
        nombreCampeonato() {
            return this.selectedCampeonato ? this.selectedCampeonato.nombre : '';
        },
    },

    methods: {
        async consultarCampeonatos() {
            try {
                console.log("Consultando campeonatos con año:", this.selectedYear, "mes:", this.selectedMonth);
                const response = await obtenerCampeonatosSinPruebasFachada(
                    this.selectedYear,
                    this.selectedMonth
                );
                this.campeonatosFiltrados = response || [];
            } catch (error) {
                console.error("Error al obtener campeonatos:", error);
                this.$toast.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'No se pudieron cargar los campeonatos',
                    life: 3000
                });
            }
        },

        filtrarCampeonatosPorAno(year) {
            this.selectedYear = year;
            this.resetReportData();
            this.consultarCampeonatos();
        },

        filtrarCampeonatosPorMes(month) {
            this.selectedMonth = month;
            this.resetReportData();
            this.consultarCampeonatos();
        },

        resetReportData() {
            this.reporteCampeonato = null;
            this.reportePruebas = [];
            this.competidores = [];
            this.selectedCampeonato = null;
        },

        getAvailableYears(startYear) {
            const currentYear = new Date().getFullYear();
            const years = [];
            for (let year = startYear; year <= currentYear; year++) {
                years.push(year);
            }
            return years;
        },

        async cargarReporte() {
            this.loading = true;
            this.loadingMessage = "Cargando reporte, espere un momento...";

            // Restablecer los datos del reporte antes de cargar uno nuevo
            this.reporteCampeonato = null; // Ocultar el detalle del reporte
            this.reportePruebas = []; // Limpiar las pruebas
            this.competidores = []; // Limpiar los competidores

            try {
                const [reporteCampeonato, reportePruebas, competidores] = await Promise.all([
                    obtenerReporteCampeonatoFachada(this.selectedCampeonato.id),
                    obtenerReportePruebasCampeonatoFachada(this.selectedCampeonato.id),
                    obtenerReporteCompetidoresCampeonatoFachada(this.selectedCampeonato.id)
                ]);

                this.reporteCampeonato = reporteCampeonato || {};
                this.reportePruebas = reportePruebas || [];
                this.competidores = competidores || [];

                // Verifica que los datos se estén cargando correctamente
                console.log("Reporte Campeonato:", this.reporteCampeonato);
                console.log("Reporte Pruebas:", this.reportePruebas);
                console.log("Competidores:", this.competidores);

                if (this.reporteCampeonato.maleCompetitors === 0 && this.reporteCampeonato.femaleCompetitors === 0) {
                    this.$toast.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'El campeonato seleccionado no tiene competidores inscritos, seleccione otro campeonato por favor.',
                        life: 3000
                    });
                }
            } catch (error) {
                console.error("Error al cargar el reporte:", error);
                this.$toast.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'El campeonato seleccionado no tiene competidores inscritos, seleccione otro campeonato por favor.',
                    life: 3000
                });
            } finally {
                this.loading = false;
            }
        },

        async toggleTab(event) {
            const index = event.index;
            if (this.activeIndex === index) {
                this.activeIndex = null;
            } else {
                this.activeIndex = index;

                if (!this.competidores.length) {
                    const reporteCompetidores = await obtenerReporteCompetidoresCampeonatoFachada(this.selectedCampeonato.id);
                    this.competidores = reporteCompetidores;
                }
            }
        },

        async cargarCompetidores() {
            var reporteCompetidores = await obtenerReporteCompetidoresCampeonatoFachada(this.selectedCampeonato.id);
            this.competidores = reporteCompetidores;
            console.log("Competidores", this.competidores)

        },

        async obtenerCampeonatos() {
            try {
                console.log("Solicitando campeonatos para:", this.selectedYear, this.selectedMonth); // Para depuración
                const response = await obtenerCampeonatosSinPruebasFachada(
                    this.selectedYear, 
                    this.selectedMonth
                );
                if (response) {
                    console.log("Campeonatos recibidos:", response); // Para depuración
                    this.campeonatosFiltrados = response;
                } else {
                    console.log("No se recibieron datos");
                }
            } catch (error) {
                console.error("Error al obtener campeonatos:", error);
                this.$toast.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'No se pudieron cargar los campeonatos',
                    life: 3000
                });
            }
        },

        async seleccionarCampeonato(campeonato) {
            this.selectedCampeonato = campeonato;
            this.resetReportData(); // Restablecer datos del reporte
            await this.cargarReporte(); // Cargar el nuevo reporte
        }
    },
}
</script>

<style scoped>
.container {
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
.title {
    font-size: 24px;
    font-weight: bold;
    color: #333;
    margin-bottom: 20px;
}
.dropdown-container {
    display: flex;
    align-items: center;
    gap: 15px;
    margin-bottom: 20px;
}
.dropdown {
    flex: 1;
}
.primary-button {
    background-color: #2c666e;
    color: white;
    border: none;
    font-weight: bold;
    cursor: pointer;
}
.primary-button:hover {
    background-color: #07393c;
}
.data-table {
    margin-top: 20px;
    border: 1px solid #ddd;
    border-radius: 8px;
    overflow: hidden;
}
.accordion {
    border: none;
}

.competitor-info {
    display: flex;
    justify-content: space-between;
    gap: 15px;
}

.categories {
    display: flex;
    flex-direction: column;
    gap: 5px; /* Espacio entre las categorías */
    
}
.category {
    font-size: 16px;
    font-weight: normal;
}
.female {
    color: #d63384;
}
.male {
    color: #0d6efd;
}
.event-title {
    font-size: 18px;
    font-weight: bold;
    color: #333;
}
/* Contenedor Principal */
.contenedorInicio {
    margin-top: 20px;
}

.accordion-header:hover {
    background-color: #e9ecef;
}
.event-details {
    display: flex;
    flex-direction: column;
}
.event-title {
    font-size: 20px;
    font-weight: bold;
    color: #333;
    margin-bottom: 0;
}
.accordion-content {
    padding: 15px;
    border: 1px solid #ddd;
    border-radius: 8px;
    background-color: #fff;
    margin-bottom: 15px;
}

/* Tabla */
.data-table {
    margin-top: 15px;
    border: 1px solid #ccc;
    border-radius: 8px;
    overflow: hidden;
}

/* Etiquetas para Sí/No */
.badge {
    padding: 5px 10px;
    border-radius: 15px;
    font-size: 14px;
    color: white;
    text-align: center;
}
.badge-yes {
    background-color: #28a745;
}
.badge-no {
    background-color: #dc3545;
}

.filtros {
    display: flex;
    flex-direction: column;
    gap: 20px;
    margin-bottom: 30px;
    align-items: center;
}

.filtro {
    display: flex;
    align-items: center;
    gap: 10px;
}

.filtro-text {
    font-size: 1.2rem;
    color: #333;
}

.filtro-opciones {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
}

.filtro-boton {
    background-color: #2c666e;
    color: white;
    border: none;
    padding: 10px 15px;
    font-size: 1rem;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.filtro-boton:hover {
    background-color: #07393c;
}

.filtro-boton.activo {
    background-color: #07393c;
    font-weight: bold;
}

.white-text {
    color: white;
}

</style>