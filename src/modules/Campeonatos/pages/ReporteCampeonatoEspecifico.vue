<template>
    <div class="container">
        <Toast></Toast>
        
        <LoadingSpinner 
    v-if="loading" 
    mensaje="Cargando reporte del campeonato..." 
/>

        <!-- Contenido principal -->
        <div v-else>
            <div class="header">
                <h2 class="title">Reporte del campeonato: {{ campeonato?.nombre }}</h2>
                <Button 
                    icon="pi pi-arrow-left" 
                    label="Volver" 
                    class="p-button-secondary"
                    @click="volver"
                />
            </div>
            
            <DetalleReporteCampeonato
                v-if="reporteCampeonato && reportePruebas"
                :reporteCampeonato="reporteCampeonato"
                :reportePruebas="reportePruebas"
                :competidores="competidores"
            />
        </div>
    </div>
</template>

<script>
import DetalleReporteCampeonato from '../components/DetalleReporteCampeonato.vue'
import LoadingSpinner from '../../../components/LoadingSpinner.vue'
import { obtenerReporteCampeonatoFachada, obtenerReportePruebasCampeonatoFachada, obtenerReporteCompetidoresCampeonatoFachada } from "../helpers/ReportesHelper.js";
import { obtenerCampeonatoFachada } from "../helpers/ObtenerCampeonatosHelper";

export default {
    name: 'ReporteCampeonatoEspecifico',
    components: {
        DetalleReporteCampeonato,
        LoadingSpinner
    },
    data() {
        return {
            campeonato: null,
            reporteCampeonato: null,
            reportePruebas: null,
            competidores: [],
            loading: true
        }
    },
    async mounted() {
        await this.inicializarDatos();
    },
    methods: {
        async inicializarDatos() {
            this.loading = true;
            
            try {
                // Intentar obtener el campeonato del state de la ruta
                this.campeonato = this.$router.currentRoute.value.state?.campeonato;
                
                // Si no está en el state, obtenerlo por ID
                if (!this.campeonato) {
                    const campeonatoId = this.$route.params.id;
                    this.campeonato = await obtenerCampeonatoFachada(campeonatoId);
                    
                    if (!this.campeonato) {
                        throw new Error('No se encontró el campeonato');
                    }
                }

                await this.cargarReporte();
                
                await new Promise(resolve => setTimeout(resolve, 250));
                
            } catch (error) {
                console.error('Error:', error);
                this.$toast.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'No hay competidores inscritos en el campeonato',
                    life: 0
                });
            } finally {
                this.loading = false;
            }
        },
        async cargarReporte() {
            try {
                // Cargar todos los datos necesarios
                const [reporteCampeonato, reportePruebas, competidores] = await Promise.all([
                    obtenerReporteCampeonatoFachada(this.campeonato.id),
                    obtenerReportePruebasCampeonatoFachada(this.campeonato.id),
                    obtenerReporteCompetidoresCampeonatoFachada(this.campeonato.id)
                ]);

                this.reporteCampeonato = reporteCampeonato ? [reporteCampeonato] : [];
                this.reportePruebas = reportePruebas || [];
                this.competidores = competidores || [];

            } catch (error) {
                console.error('Error al cargar el reporte:', error);
                this.$toast.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'No hay competidores inscritos en el campeonato',
                    life: 0
                });
            }
        },
        volver() {
            this.$router.back();
        }
    }
}
</script>

<style scoped>
.container {
    padding: 20px;
    max-width: 1200px;
    margin: 0 auto;
}

.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}

.title {
    font-size: 24px;
    font-weight: bold;
    color: #333;
    margin: 0;
}
</style>