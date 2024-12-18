<template>
    <div class="reporte-container">
        <DataTable 
            v-if="hasCompetitors"
            :value="formattedReporteCampeonato" 
            showGridlines 
            class="mt-3 data-table" 
            tableStyle="min-width: 50rem"
        >
            <Column field="maleCompetitors" header="Masculino"></Column>
            <Column field="femaleCompetitors" header="Femenino"></Column>
        </DataTable>

        <div class="contenedorInicio">
            <Accordion 
                v-if="reportePruebas && reportePruebas.length > 0" 
                :activeIndex="activeIndex"
                @tab-click="toggleTab"
                class="accordion"
            >
                <AccordionTab 
                    v-for="(item, index) in reportePruebas" 
                    :key="index"
                >
                    <template #header>
                        <div class="accordion-header">
                            <div class="event-info">
                                <h2 class="event-title">{{ item.eventName }}</h2>
                                <div class="categories">
                                    <h3 class="category">Damas: {{ item.femaleCompetitors }}</h3>
                                    <h3 class="category">Varones: {{ item.maleCompetitors }}</h3>
                                </div>
                            </div>
                        </div>
                    </template>
                    <DataTable 
                        v-if="activeIndex === index && (item.maleCompetitors > 0 || item.femaleCompetitors > 0)" 
                        :value="competidoresFormateados.filter(c => c.nombreEvento === item.eventName)"
                        showGridlines 
                        class="data-table"
                        tableStyle="min-width: 50rem"
                    >
                        <Column field="provincia" header="Provincia"></Column>
                        <Column field="apellidos" header="Apellido"></Column>
                        <Column field="nombres" header="Nombre"></Column>
                        <Column field="sexo" header="Género"></Column>
                        <Column field="numeroCompetidor" header="Número de competidor"></Column>
                        <Column field="categoria" header="Categoría"></Column>
                        <Column field="posicion" header="Posición"></Column>
                        <Column field="criterio" header="Marca">
                            <template #body="{ data }">
                                <span v-if="data.criterio === 'Tiempo'">{{ data.marca + " segundos"}}</span>
                                <span v-else-if="data.criterio === 'Distancia'">{{ data.distancia + " metros" }}</span>
                                <span v-else>{{ data.puntaje + " puntos"}}</span>
                            </template>
                        </Column>
                        <Column field="criterio" header="Viento (m/s)">
                            <template #body="{ data }">
                                <span v-if="data.criterio === 'Tiempo' || data.criterio === 'Distancia' ">{{ data.viento || 0.00}}</span>
                                <span v-else> No aplica </span>
                            </template>
                        </Column>
                    </DataTable>
                    <Message 
                        v-else-if="activeIndex === index"
                        severity="info" 
                        :closable="false"
                    >
                        No hay competidores inscritos en esta prueba.
                    </Message>
                </AccordionTab>
            </Accordion>
        </div>
    </div>
</template>

<script>
import { convertirTiemposAsegundos } from '@/modules/Atletas/helpers/getResultados';

export default {
    name: 'DetalleReporteCampeonato',
    props: {
        reporteCampeonato: {
            type: [Object, Array],
            required: true
        },
        reportePruebas: {
            type: Array,
            default: () => []
        },
        competidores: {
            type: Array,
            default: () => []
        }
    },
    computed: {
        formattedReporteCampeonato() {
            return Array.isArray(this.reporteCampeonato) ? this.reporteCampeonato : [this.reporteCampeonato];
        },
        hasCompetitors() {
            const report = Array.isArray(this.reporteCampeonato) ? this.reporteCampeonato[0] : this.reporteCampeonato;
            return report && (report.maleCompetitors > 0 || report.femaleCompetitors > 0);
        }
    },
    data() {
        return {
            activeIndex: null,
            competidoresFormateados: []
        }
    },
    mounted() {
        if(this.competidores){
            this.competidoresFormateados = convertirTiemposAsegundos(this.competidores);
        }
    },
    methods: {
        toggleTab(event) {
            const index = event.index;
            if (this.activeIndex === index) {
                this.activeIndex = null;
            } else {
                this.activeIndex = index;
            }
        }
    }
}
</script>

<style scoped>
/* Tabla */
.data-table {
    margin-top: 15px;
    border: 1px solid #ccc;
    border-radius: 8px;
    overflow: hidden;
}

/* Acordeón */
.accordion-header {
    padding: 10px;
}

.event-info {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.event-title {
    font-size: 20px;
    font-weight: bold;
    color: #333;
    margin: 0;
}

.categories {
    display: flex;
    gap: 20px;
}

.category {
    margin: 0;
    font-size: 0.9rem;
    color: #666;
}

.accordion-content {
    padding: 15px;
    border: 1px solid #ddd;
    border-radius: 8px;
    background-color: #fff;
    margin-bottom: 15px;
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

/* Asegurarse que el Tag de PrimeVue esté centrado */
:deep(.p-tag) {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    white-space: nowrap;
}
</style>