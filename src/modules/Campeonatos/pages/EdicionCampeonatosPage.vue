<template>
    <div class="register-container">
        <Toast />
        <h2>Editar campeonato</h2>
        <form @submit.prevent="actualizarCampeonato()">
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
                <div v-if="campeonato.documentos">
                    <DataTable :value="campeonato.documentos" class="datatable">
                        <Column field="nombre" header="Nombre"></Column>
                        <Column header="Link">
                            <template #body="slotProps">
                                <a :href="slotProps.data.link" target="_blank">Ver doc</a>
                            </template>
                        </Column>
                        <Column header="Acciones">
                            <template #body="slotProps">
                                <button type="button" class="btn-dt-eliminar"
                                    @click="eliminarDocCampeonato(slotProps.data.id, slotProps.data.link)">Eliminar</button>
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
                    <CargarArchivo2 ref="cargarArchivoEdicionCampeonato" v-if="hasDoc" :accept="accept"
                        @uploaded="handleUpload" @file-upload-error="handleFileUploadError" />
                </div>
            </div>
            <div class="centerElement">
                <div class="form-group">
                    <Button type="submit" :loading="loading">Actualizar</Button>
                </div>
            </div>
        </form>
    </div>
</template>

<script>
import { actualizarCampeonatosFachada } from "@/modules/Campeonatos/helpers/RegistroCampeonatos.js"
import { obtenerCampeonatoFachada } from "../helpers/ObtenerCampeonatosHelper";
import { guardarDocCampeonatosFachada, eliminarDocCampeonatosFachada } from "../helpers/DocumentoCampeonatoHelper";
import { storage } from "@/modules/Registro/helpers/firebase";
import CargarArchivo2 from "@/modules/Registro/components/CargarArchivo2.vue";

export default {
    components: {
        CargarArchivo2
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
                inscripcionFin: ''
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
            doc: {
                nombre: "",
                link: "",
                extension: "",
                tipo: "Informativo",
            },
            loading: false,
            admins: [],
            campeonatoOriginal: null,
            uploadPath: "campeonatos", // Aquí se debe especificar la ruta donde se subirá el archivo
            uploadedFileUrl: '',
            accept: 'application/pdf,image/*'
        }
    },
    methods: {
        async triggerUpload() {
            // Llama al método uploadFile del componente hijo
            await this.$refs.cargarArchivoEdicionCampeonato.uploadFile(this.uploadPath + `/${this.campeonato.nombre}`);
        },
        handleUpload(uploadedData) {
            console.log('Archivo subido:', uploadedData);
            this.uploadedFileUrl = uploadedData.url;
            this.doc.link = this.uploadedFileUrl;
            this.doc.nombre = uploadedData.name;
            this.doc.extension = uploadedData.extension;
            this.doc.idCampeonato = this.campeonato.id;
        },
        handleFileUploadError() {
            this.toast.add({ severity: 'error', summary: 'Error', detail: 'Por favor, selecciona un archivo antes de registrar el campeonato.', life: 3000 });
        },
        async verificarArchivoExistente(rutaArchivo) {
            const storageRef = storage.ref();
            const archivoRef = storageRef.child(rutaArchivo);
            try {
                // Intenta obtener los metadatos del archivo
                await archivoRef.getDownloadURL();
                console.log("El archivo existe. ");
                return true; // El archivo existe
            } catch (error) {
                if (error.code === 'storage/object-not-found') {
                    console.log("El archivo no existe.");
                    return false; // El archivo no existe
                } else {
                    console.error("Error al verificar el archivo:", error);
                    throw error; // Manejar otros errores
                }
            }
        },
        async actualizarCampeonato() {
            if (this.hasDoc) {
                try {
                    await this.triggerUpload(); // Llama al método para subir el archivo
                    if(await this.verificarArchivoExistente(this.uploadPath + `/${this.campeonato.nombre}/${this.doc.nombre}`)){
                        this.hasDoc = false;
                        this.$toast.add({ severity: 'warn', summary: 'Advertencia', detail: 'Este documento ya está asignado al Campeonato', life: 3000 });
                        return;
                    }
                    // Validar que haya un archivo subido
                    if (!this.uploadedFileUrl) {
                        this.$toast.add({ severity: 'warn', summary: 'Advertencia', detail: 'No se puede actualizar el campeonato sin un archivo subido.', life: 3000 });
                        return; // Termina la ejecución si no hay archivo subido
                    }

                    // Intentar guardar el documento en el backend
                    await this.guardarDocCampeonato(this.doc);
                } catch (error) {
                    this.$toast.add({ severity: 'error', summary: 'Error', detail: 'No se subió el archivo correctamente', life: 3000 });
                    await this.deleteUploadedFile(this.uploadedFileUrl);
                    return; // Termina la ejecución si hay un error al subir el documento
                } finally {
                    this.hasDoc = false;
                    this.obtenerCampeonatos();
                }
            }

            // Verificar si se han realizado modificaciones en el campeonato
            const modificacionesRealizadas = this.verificarModificaciones(); // Implementa este método según tu lógica

            if (modificacionesRealizadas) {
                this.loading = true;
                try {
                    await actualizarCampeonatosFachada(this.campeonato);
                    this.$toast.add({ severity: 'info', summary: 'Info', detail: 'Actualización de campeonato completada', life: 3000 });
                    setTimeout(() => {
                        this.$router.push("/calendarios");
                    }, 3000);
                } catch (e) {
                    console.error(e);
                    this.$toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo completar el registro de campeonato', life: 3000 });
                } finally {
                    this.loading = false; // Asegúrate de que loading se establezca en false al final
                }
            } else {
                this.$toast.add({ severity: 'info', summary: 'Info', detail: 'No se realizaron modificaciones en los datos del campeonato.', life: 3000 });
            }
        },
        async guardarDocCampeonato(documento) {
            this.loading = true
            await guardarDocCampeonatosFachada(documento).then(r => {
                this.loading = false
                this.$toast.add({ severity: 'info', summary: 'Info', detail: 'Documento agregado', life: 3000 });
            }).catch(e => {
                console.error(e)
                this.loading = false
                this.$toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo agregar el documento', life: 3000 });
            })
        },
        async eliminarDocCampeonato(id, link) {
            this.loading = true;
            console.log("doc link: ", link);

            // Primero, intenta eliminar el archivo subido
            try {
                await this.deleteUploadedFile(link); // Llama al método para eliminar el archivo de Firebase

                // Filtrar los documentos para eliminar el que coincide con el id
                const documentos = this.campeonato.documentos.filter(doc => doc.id !== id);
                this.campeonato.documentos = documentos;

                // Luego, procede a eliminar el documento en el backend
                await eliminarDocCampeonatosFachada(id);

                this.$toast.add({ severity: 'info', summary: 'Info', detail: 'Documento eliminado', life: 3000 });
            } catch (error) {
                console.error(error);
                this.$toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar el documento', life: 3000 });
            } finally {
                this.loading = false; // Asegúrate de que loading se establezca en false al final
            }
        },
        async deleteUploadedFile(fileUrl) {
            // Extraer el nombre del archivo de la URL
            const fileName = decodeURIComponent(fileUrl.split('/').pop().split('?')[0]); // Obtener solo el nombre del archivo
            console.log("Deleting", fileName)
            const storageRef = storage.ref(`${fileName}`);
            try {
                await storageRef.delete(); // Eliminar el archivo de Firebase Storage
                console.log('Archivo eliminado:', fileName);
            } catch (err) {
                console.error('Error al eliminar el archivo:', err.message);
            }
        },
        verificarModificaciones() {
            // Verificar si el nombre o las fechas han cambiado
            const nombreModificado = this.campeonato.nombre !== this.campeonatoOriginal.nombre;
            const fechaInicioModificada = this.campeonato.fechaInicio !== this.campeonatoOriginal.fechaInicio;
            const fechaFinModificada = this.campeonato.fechaFin !== this.campeonatoOriginal.fechaFin;
            const inscripcionInicioModificada = this.campeonato.inscripcionInicio !== this.campeonatoOriginal.inscripcionInicio;
            const inscripcionFinModificada = this.campeonato.inscripcionFin !== this.campeonatoOriginal.inscripcionFin;
            return nombreModificado || fechaFinModificada || fechaInicioModificada || inscripcionInicioModificada || inscripcionFinModificada;
        },
        async obtenerCampeonatos() {
            this.campeonato = await obtenerCampeonatoFachada(this.$route.params.id);
            this.campeonatoOriginal = { ...this.campeonato };
        }
    },
    async mounted() {
        await this.obtenerCampeonatos();
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

.btn-dt-eliminar {
    background-color: #07393C;
    color: #f0edee;
    border: none;
    padding: 10px 20px;
    border-radius: 4px;
    cursor: pointer;
}

.btn-dt-eliminar:hover {
    background-color: #90DDF0;
    color: #0A090C;
    border: 1px solid #0A090C;
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