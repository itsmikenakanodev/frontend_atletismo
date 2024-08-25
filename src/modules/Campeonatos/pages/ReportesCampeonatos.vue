<template>
    <h2 >Reporte {{ nombreCampeonato}}</h2>
    <Dropdown v-model="selectedCampeonato" :options="campeonatos" filter optionLabel="nombre" placeholder="Seleccione" class="w-full md:w-30rem"></Dropdown>
    <Button  v-if="selectedCampeonato!==null" @click="cargar" label="Cargar Reporte"></Button >
        <span></span>
    <DataTable :value="generosPruebas" showGridlines class="mt-3"
        tableStyle="min-width: 50rem">
        <Column field="genero" header="Género">
        </Column> 
        <Column field="cantidad" header="Cantidad"></Column>

    </DataTable>

    <span></span>
    <div class="contenedorInicio">
        

        <Accordion v-if="campeonatosPruebas.length > 0" :activeIndex="0">
            <AccordionTab v-for="(item, index) in campeonatosPruebas" :key="index">
                <template #header>
                    <span>
                        <h3>Damas: {{ calcularCantidadGenero(item.competidores,"F") }}</h3>
                        <h3>Varones: {{ calcularCantidadGenero(item.competidores,"M") }}</h3>

                    </span>
                    <h2>{{ item.prueba.nombre }}</h2>
                </template>
                <DataTable  v-model:selection="selectedCampeonatoPrueba" :value="item.competidores" showGridlines
                    tableStyle="min-width: 50rem">
                    <Column field="competidor.usuarios.ciudad" header="Provincia"></Column>
                    <Column field="competidor.usuarios.nombres" header="Nombre"></Column>
                    <Column field="competidor.usuarios.sexo" header="Genero"></Column>
                    <Column field="competidor.usuarios.estado" header="Socio">
                        <template #body="{data}">
                            <span v-if="data.competidor.usuarios.estado === true">
                                Si
                            </span>
                            <span v-if="data.competidor.usuarios.estado === false">
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
import { obtenerCampeonatosPruebasFachada } from "../helpers/ObtenerPruebasCompetidores.js"
import {obtenerCampeonatosSinPruebasFachada} from "../helpers/ObtenerCampeonatosHelper.js"
import {obtenerPruebasDadoCampeonatoFachada} from "../helpers/ObtenerPruebasHelper.js"
import {obtenerCompetidoresDadoCampeonatoyPruebaFachada} from "../helpers/CampeonatosPruebasCompetidoresHelper.js"
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
            selectedCampeonato:null,

            selectedPruebasCompetidores: null,
            pruebasCompetidores: null,
            selectedCampeonatoPrueba: null,
            campeonatosPruebas: [],
            competidores:[],
            
            generosPruebas: [{
                genero: "F",
                cantidad: 0
            },
            {
                genero: "M",
                cantidad: 0
            }

            ]

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

        cargar(){
            this.consultarPruebasDeCampeonato();
        },

        async consultarPruebasDeCampeonato(){
            this.campeonatosPruebas = [];
            this.generosPruebas= [{
                genero: "F",
                cantidad: 0
            },
            {
                genero: "M",
                cantidad: 0
            }

            ]

            var campeonatosPruebasAux = await obtenerPruebasDadoCampeonatoFachada(this.selectedCampeonato.id);
            for (let prueba of campeonatosPruebasAux) {
    prueba.competidores = await obtenerCompetidoresDadoCampeonatoyPruebaFachada(this.selectedCampeonato.id, prueba.prueba.id);
  }

            this.campeonatosPruebas = campeonatosPruebasAux;
            await this.calcularCantidadGeneroTotal();
            
        },

        async consultarCompetidores(campeonatoId, pruebaId){
            this.competidores = await obtenerCompetidoresDadoCampeonatoyPruebaFachada(campeonatoId, pruebaId);
        },


        async consultarCampeonatosPruebas(id) {
            this.pruebasCompetidores = null
            await obtenerCampeonatosPruebasFachada(id).then(r => {
                this.pruebasCompetidores = Object.entries(r)

            })
            await this.calcularCantidadGeneroTotal();

        },
        async calcularCantidadGeneroTotal() {
            this.campeonatosPruebas.forEach(element => {
                element.competidores.forEach(comp => {
                    if (comp.competidor.usuarios.sexo === "F") {
                        this.generosPruebas[0].cantidad ++
                    }
                    if (comp.competidor.usuarios.sexo === "M") {
                        this.generosPruebas[1].cantidad ++
                    }
                })

            })

            console.log('this.generosPruebas', this.generosPruebas)
        },
        calcularCantidadGenero(datos,genero) {
            var cantidad=0;
            datos.forEach(element => {
                
                if (element.competidor.usuarios.sexo === genero) {
                    cantidad++
                    }
            
            })
            return cantidad;
        }

    },
}
</script>
<style></style>