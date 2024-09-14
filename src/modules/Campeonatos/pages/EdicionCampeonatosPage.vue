<template>
    <div class="register-container">
        <Toast />
        <h2>Editar campeonato</h2>
        <form @submit.prevent="registrar">
            <div class="form-row centerElement">
                <div class="form-group">
                    <label for="name">Nombre</label>
                    <input type="text" id="name" placeholder="Ingresa nombre campeonato..." required
                        v-model="campeonato.nombre" />
                </div>
            </div>
            <div class="form-row" v-if="usuario.rol.id === 1 || usuario.rol.id === 6">
                <div class="form-group">
                    <label for="organizator">Organizador</label>
                    <input type="text" id="organizator" disabled placeholder="Ingresa organizador..." required
                        v-model="campeonato.organizador" readonly />
                </div>
                <div class="form-group">
                    <label for="organizator">Sede</label>
                    <input type="text" id="organizator" disabled placeholder="Ingresa Sede..." required
                        v-model="campeonato.sede" readonly />
                </div>
            </div>
            <div class="form-row">
                <div class="form-group ">
                    <label for="startDate">Fecha Inicio</label>
                    <input type="date" id="startDate" required v-model="campeonato.fechaInicio" />
                </div>
                <div class="form-group ">
                    <label for="finDate">Fecha Fin</label>
                    <input type="date" id="finDate" required v-model="campeonato.fechaFin" />
                </div>
            </div>
            <div class="form-row">
                <div class="form-group ">
                    <label for="regStartDate">Fecha Inicio Inscripción</label>
                    <input type="date" id="regStartDate" required v-model="campeonato.inscripcionInicio" />
                </div>
                <div class="form-group ">
                    <label for="regFinDate">Fecha Fin Inscripción</label>
                    <input type="date" id="regFinDate" required v-model="campeonato.inscripcionFin" />
                </div>
            </div>
            <div class="form group">
                <div v-if="campeonato.documentos.length != 0">
                    <DataTable :value="campeonato.documentos" class="datatable">
                        <Column field="nombre" header="Nombre"></Column>
                        <Column header="Link">
                            <template #body="slotProps">
                                <a :href="slotProps.data.link" target="_blank">Ver doc</a>
                            </template>
                        </Column>
                        <Column header="Acciones">
                            <template #body="slotProps">
                                <button @click="eliminarDocumento(slotProps.data)">Eliminar</button>
                            </template>
                        </Column>
                    </DataTable>
                </div>
            </div>
            <div class="form-row centerElement">
                <div class="form-group">
                    <label for="name">Agregar Documento?</label>
                    <div class="form-row centerElement">
                        <label for="si">Sí</label>
                        <input type="radio" id="si" name="respuesta" v-model="hasDoc" :value="true">

                        <label for="no">No</label>
                        <input type="radio" id="no" name="respuesta" v-model="hasDoc" :value="false">
                    </div>
                    <CargarArchivo ref="cargarChampDoc" v-if="hasDoc === true" @uploaded="(val) => comprobarSubida(val)"
                        @champDoc="(val) => asignarDocumento(val)"></CargarArchivo>
                </div>
            </div>
            <div class="centerElement">
                <div class="form-group">
                    <Button v-if="(hasDoc === true && docUploaded === true) || (hasDoc === false)" type="submit"
                        :loading="loading">Actualizar</Button>
                </div>
            </div>
        </form>
    </div>
</template>

<script>
import {actualizarCampeonatosFachada } from "@/modules/Campeonatos/helpers/RegistroCampeonatos.js"
import CargarArchivo from "@/modules/Registro/components/CargarArchivo.vue";
import { consultarCampeonatosFachada } from "../helpers/CampeonatosNacionalHelper";

export default {
    components: {
        CargarArchivo
    },
    data() {
        return {
            usuario: JSON.parse(localStorage.getItem('userdata')),
            campeonatos: null,
            organizador: "",
            ciudad: "",
            hasDoc: false,
            docUploaded: false,
            campeonato: {
                nombre: '',
                organizador: '',
                sede: '',
                fechaInicio: '',
                fechaFin: '',
                inscripcionInicio: '',
                inscripcionFin: '',
                documentos: [],
            },
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
                "Zamora Chinchipe"
            ],
            loading: false,
            admins: [],
        }
    },
    methods: {
        async registrar() {
            await this.$refs.cargarChampDoc.uploadCampeonatoEvent()
        },
        async registrarCampeonato() {
            this.loading = true
            console.log(this.campeonato);
            await actualizarCampeonatosFachada(this.campeonato).then(r => {
                this.loading = false
                this.$toast.add({ severity: 'info', summary: 'Info', detail: 'Registro de campeonato completado', life: 3000 });
                setTimeout(() => {
                    this.$router.push("/");
                }, 2000);
            }).catch(e => {
                console.error(e)
                this.loading = false
                this.$toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo completar el registro de campeonato', life: 3000 });
            })
        },
        async asignarDocumento(documento) {
            console.log("Doc uploaded", documento);
            if (documento) {
                console.log("id de campeonato",this.campeonato.id); 
                documento.campeonato = {
                    id: this.campeonato.id,
                }
                this.campeonato.documentos.push(documento);
                this.registrarCampeonato();
            } else {
                this.$toast.add({ severity: 'error', summary: 'Error', detail: 'No se subio el archivo correctamente', life: 3000 });
            }

        },
        comprobarSubida(uploaded) {
            this.docUploaded = uploaded;
        },
        obtenerCampeonatoPorId(id) {
            this.campeonato = this.campeonatos.find(c => c.id == id);
        },
    },
    async mounted() {
        try {
            let campeonatos = localStorage.getItem('campeonatos');

            if (campeonatos) {
                // Si existen, parsear y usar los campeonatos guardados
                console.log("Campeonatos obtenidos desde Local Storage");
                campeonatos = JSON.parse(campeonatos);
            } else {
                // Si no existen, consultar a la fachada
                console.log("Campeonatos obtenidos desde LA API");
                campeonatos = await consultarCampeonatosFachada();
                // Guardar campeonatos en Local Storage para futuras consultas
                localStorage.setItem('campeonatos', JSON.stringify(campeonatos));
            }
            //const campeonatos = await consultarCampeonatosFachada();
            this.campeonatos = campeonatos;
            this.obtenerCampeonatoPorId(this.$route.params.id);
            console.log(this.campeonato);
        } catch (error) {
            console.error("Error obteniendo campeonatos:", error);
        }
    }
}
</script>

<style scoped>
.register-container {
    display: block;
    max-width: 900px;
    margin: auto;
    margin-top: 5vh;
    padding: 40px;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    background-color: #07393C;
    color: #f0edee;
    font-size: 16px;
}

h2 {
    margin-bottom: 20px;
    text-align: center;
    font-size: 24px;
}

.h3Element {
    margin-bottom: 20px;
    text-align: center;
    font-size: 20px;
    color: #90DDF0;
}

.form-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
}

.form-group {
    width: calc(50% - 10px);
    text-align: center;
}

.form-group label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
}

.form-group input,
.form-group select {
    width: 100%;
    padding: 10px;
    border: none;
    border-radius: 4px;
    box-sizing: border-box;
    background-color: #2c666e;
    color: #90ddf0;
}

.form-group button {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    padding: 12px;
    margin-top: 15px;
    margin-bottom: -15px;
    background-color: #90ddf0;
    color: #0A090C;
    border: none;
    font-size: 18px;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.form-group button:hover {
    background-color: #07393c;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
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

.CargarArchivo {
    margin-top: 20px;
}

.form-group input::placeholder {
    color: #90DDF0;
}

.center-aligned {
    display: flex;
    text-align: center;
    justify-content: center;
    align-items: center;
}

.form-group select {
    width: 100%;
    padding: 10px;
    border: none;
    border-radius: 4px;
    box-sizing: border-box;
    background-color: #2c666e;
    color: #90ddf0;
    appearance: none;
    background-image: url('data:image/svg+xml;utf8,<svg fill="%2390ddf0" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M7 10l5 5 5-5z"/><path d="M0 0h24v24H0z" fill="none"/></svg>');
    background-repeat: no-repeat;
    background-position: right;
    cursor: pointer;
}

.form-group select:hover {
    background-color: #07393C;
}

.options {
    background-color: #f0edee;
    color: #0A090C;
}

.form-group label {
    display: block;
    margin-bottom: 10px;
    font-weight: bold;
    font-size: 18px;
}

.form-group input,
.form-group select {
    width: 100%;
    padding: 12px;
    border: none;
    border-radius: 4px;
    box-sizing: border-box;
    background-color: #2c666e;
    color: #90ddf0;
    font-size: 18px;
}

.centerElement {
    display: flex;
    justify-content: center;

}
</style>