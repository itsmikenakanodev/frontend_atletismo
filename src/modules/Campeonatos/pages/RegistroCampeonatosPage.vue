<template>
    <div class="register-container">
        <Toast />
        <h2>Crea nuevo campeonato</h2>
        <form @submit.prevent="registrarCampeonato()">
            <div class="form-row centerElement">
                <div class="form-group">
                    <label for="name">Nombre</label>
                    <input type="text" id="name" placeholder="Ingresa nombre campeonato..." required
                        v-model="campeonato.nombre" />
                </div>
            </div>
            <div class="form-row" v-if="usuario.rol.id === 1">
                <div class="form-group">
                    <label for="organizator">Organizador</label>
                    <input type="text" id="organizator" disabled placeholder="Ingresa organizador..." required
                        v-model="organizador" readonly />
                </div>
                <div class="form-group">
                    <label for="organizator">Sede</label>
                    <input type="text" id="organizator" disabled placeholder="Ingresa Sede..." required v-model="ciudad"
                        readonly />
                </div>
            </div>
            <div class="form-row" v-if="usuario.rol.id === 6">
                <div class="form-group">
                    <label for="organizator">Organizador</label>
                    <input type="text" id="organizator" disabled placeholder="Ingresa organizador..." required
                        v-model="campeonato.organizador" readonly />
                </div>
                <div class="form-group">
                    <label for="sede">Sede</label>
                    <select id="sede" v-model="campeonato.sede" required class="center-aligned"
                        @change="designarOrganizador">
                        <option disabled value="">Selecciona tu provincia</option>
                        <option class="options" v-for="(option, index) in admins" :key="index" :value="option.ciudad">
                            {{ option.ciudad }}
                        </option>
                    </select>
                </div>
            </div>
            <div class="form-row">
                <div class="form-group ">
                    <label for="startDate">Fecha Inicio</label>
                    <input type="date" id="startDate" required v-model="campeonato.fechaInicio" :min="minFechaInicio"
                        :max="campeonato.fechaFin" />
                </div>
                <div class="form-group ">
                    <label for="finDate">Fecha Fin</label>
                    <input type="date" id="finDate" required v-model="campeonato.fechaFin"
                        :min="campeonato.fechaInicio" />
                </div>
            </div>
            <div class="form-row">
                <div class="form-group ">
                    <label for="regStartDate">Fecha Inicio Inscripción</label>
                    <input type="date" id="regStartDate" required v-model="campeonato.inscripcionInicio"
                        :max="campeonato.fechaInicio" :min="minFechaInicio" />
                </div>
                <div class="form-group ">
                    <label for="regFinDate">Fecha Fin Inscripción</label>
                    <input type="date" id="regFinDate" required v-model="campeonato.inscripcionFin"
                        :max="campeonato.fechaInicio" :min="campeonato.inscripcionInicio" />
                </div>
            </div>
            <div class="form-row centerElement">
                <div class="form-group">
                    <label for="name">Desea adjuntar un Documento?</label>
                    <div class="form-row centerElement">
                        <label for="si">Sí</label>
                        <input type="radio" id="si" name="respuesta" v-model="hasDoc" :value="true">
                        <label for="no">No</label>
                        <input type="radio" id="no" name="respuesta" v-model="hasDoc" :value="false">
                    </div>
                    <CargarArchivo2 ref="cargarArchivoCampeonato" v-if="hasDoc" :accept="accept"
                        @uploaded="handleUpload" @file-upload-error="handleFileUploadError" />
                </div>
            </div>
            <div class="centerElement">
                <div class="form-group">
                    <Button type="submit"
                        :loading="loading">Guardar</Button>
                </div>
            </div>
        </form>
    </div>
</template>

<script>
import { registroCampeonatosFachada, consultarAdminsFachada } from "@/modules/Campeonatos/helpers/RegistroCampeonatos.js"
import CargarArchivo2 from "@/modules/Registro/components/CargarArchivo2.vue";


export default {
    components: {
        CargarArchivo2
    },
    data() {
        return {
            usuario: JSON.parse(localStorage.getItem('userdata')),
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
            doc: {
                nombre: "",
                link: "",
                extension: ".pdf",
                tipo: "Informativo",
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
            uploadPath: "campeonatos", // Aquí se debe especificar la ruta donde se subirá el archivo
            uploadedFileUrl: '',
            accept: 'application/pdf,image/*'
        }
    },
    computed: {
        // La fecha mínima de inicio es el día en que se ingresa a la página
        minFechaInicio() {
            const today = new Date();
            return today.toISOString().split('T')[0]; // 'yyyy-mm-dd'
        }
    },
    methods: {
        async triggerUpload() {
            // Llama al método uploadFile del componente hijo
            await this.$refs.cargarArchivoCampeonato.uploadFile(this.uploadPath+``);
        },
        handleUpload(uploadedData) {
            console.log('Archivo subido:', uploadedData);
            this.uploadedFileUrl = uploadedData.url;
            this.doc.link = this.uploadedFileUrl;
            this.doc.nombre = uploadedData.name;
            this.doc.extension = uploadedData.extension;
        },
        handleFileUploadError() {
            this.toast.add({ severity: 'error', summary: 'Error', detail: 'Por favor, selecciona un archivo antes de registrar el campeonato.', life: 3000 });
        },
        async registrarCampeonato() {
            if (this.hasDoc) {
                await this.triggerUpload();

                // Validar que haya un archivo subido
                if (!this.uploadedFileUrl) {
                    this.showToast('warn', 'Advertencia', 'No se puede registrar el campeonato sin un archivo subido.');
                    return;
                }else{
                    this.campeonato.documentos.push(this.doc);
                }
            }

            this.loading = true
            console.log(this.campeonato);
            await registroCampeonatosFachada(this.campeonato).then(r => {
                this.loading = false
                this.$toast.add({ severity: 'info', summary: 'Info', detail: 'Registro de campeonato completado', life: 3000 });
                setTimeout(() => {
                    this.$router.push("/calendarios");
                }, 3000);
            }).catch(e => {
                console.error(e)
                this.loading = false
                this.$toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo completar el registro de campeonato', life: 3000 });
            })
        },
        async consultarAdmins() {
            this.admins = await consultarAdminsFachada();
            console.log(this.admins);
        },
        designarOrganizador() {
            const organizadorProvincia = this.admins.find(admin => admin.ciudad === this.campeonato.sede);
            console.log("handle", organizadorProvincia);
            this.campeonato.organizador = organizadorProvincia.nombres + " " + organizadorProvincia.apellidos;
        },
    },
    mounted() {
        console.log(this.usuario);
        if (this.usuario.rol.id === 1) {
            this.organizador = this.usuario.nombres + " " + this.usuario.apellidos;
            this.ciudad = this.usuario.ciudad;
            this.campeonato.organizador = this.organizador;
            this.campeonato.sede = this.ciudad;
        } else {
            this.consultarAdmins();
        }
    },
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