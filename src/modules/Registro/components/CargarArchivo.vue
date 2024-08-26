<template>
    <div class="card">
        <Toast />
        <FileUpload name="demo[]" url="/api/upload" @upload="onTemplatedUpload($event)" :multiple="false"
            accept="application/pdf" :maxFileSize="4000000" @select="onSelectedFiles">
            <template #header="{ chooseCallback, uploadCallback, clearCallback, files }">
                <div class="flex flex-wrap justify-content-between align-items-center flex-1 gap-2">
                    <div class="flex gap-2">
                        <Button class="button-search" @click=" onFileUpload(chooseCallback, uploadCallback)"
                            icon="pi pi-file" rounded outlined severity="success"
                            :disabled="files.length === 1 || this.carga === true"></Button>
                        <Button class="button-clear" @click="onFileClear(clearCallback)" icon="pi pi-times" rounded
                            outlined severity="danger" :disabled="!files || files.length === 0 || this.carga"></Button>
                    </div>
                    <ProgressBar :value="totalSizePercent" :showValue="false"
                        :class="['md:w-20rem h-1rem w-full md:ml-auto color: #90ddf0', { 'exceeded-progress-bar': totalSizePercent > 100 }]">
                        <span class="white-space-nowrap">{{ totalSize }}B / 4Mb</span>
                    </ProgressBar>
                </div>
            </template>
            <template #content="{ files }">
                <div v-if="this.seleccion && !this.carga">
                    <h5>Pendiente</h5>
                    <div class="flex flex-wrap p-0 sm:p-5 gap-5">
                        <div v-for="(file, index) of files" :key="file.name + file.type + file.size"
                            class="card m-0 px-6 flex flex-column border-1 surface-border align-items-center gap-3">
                            <div v-if="file.type === 'application/pdf'">
                                <img role="presentation" :alt="file.name" src="../assets/pdf_50px.png" width="50"
                                    height="50" />
                            </div>
                            <div v-else>
                                <img role="presentation" :alt="file.name" :src="file.objectURL" width="100"
                                    height="50" />
                            </div>
                            <span class="font-semibold">{{ file.name }}</span>
                            <div>{{ formatSize(file.size) }}</div>
                            <Badge value="Pending" severity="warning" />
                        </div>
                    </div>
                </div>

                <div v-if="this.seleccion && this.carga">
                    <h5>Archivo subido</h5>
                    <div class="flex flex-wrap p-0 sm:p-5 gap-5">
                        <div v-for="(file, index) of files" :key="file.name + file.type + file.size"
                            class="card m-0 px-6 flex flex-column border-1 surface-border align-items-center gap-3">
                            <div v-if="file.type === 'application/pdf'">
                                <img role="presentation" :alt="file.name" src="../assets/pdf_50px.png" width="50"
                                    height="50" />
                            </div>
                            <div v-else>
                                <img role="presentation" :alt="file.name" :src="file.objectURL" width="100"
                                    height="50" />
                            </div>
                            <span class="font-semibold">{{ file.name }}</span>
                            <div>{{ formatSize(file.size) }}</div>
                            <Badge value="Completed" class="mt-3" severity="success" />
                        </div>
                    </div>
                </div>
            </template>
            <template #empty>
                <div class="flex align-items-center justify-content-center flex-column">
                    <i class="pi pi-cloud-upload border-2 border-circle p-5 text-8xl text-400 border-400 " />
                    <p class="mt-4 mb-0">El tamaño máximo permitido para el archivo es de 4Mb</p>
                </div>
            </template>
        </FileUpload>
    </div>
</template>

<script>
import { guardarDocFachada } from "../helpers/DocHelper";
import { guardarUsuarioFachada } from "../helpers/UsuarioHelper";
import { storage } from "../helpers/firebase";
import { useToast } from 'primevue/usetoast';

export default {
    components: {
        useToast
    },
    props: ["campeonatoNombre"],
    data() {
        return {
            files: [],
            totalSize: 0,
            totalSizePercent: 0,
            carga: false,
            seleccion: false,
            url: ''
        };
    },
    setup() {
        const toast = useToast();
        return { toast };
    },
    methods: {
        onRemoveTemplatingFile(file, removeFileCallback, index) {
            removeFileCallback(index);
            this.totalSize -= parseInt(this.formatSize(file.size));
            this.totalSizePercent = this.totalSize / 10;
        },
        onClearTemplatingUpload(clear) {
            clear();
            this.totalSize = 0;
            this.totalSizePercent = 0;
        },
        onSelectedFiles(event) {
            this.files = event.files;
            this.files.forEach((file) => {
                this.totalSize = parseFloat(this.formatSize(file.size));
            });
        },
        onFileUpload(callbackSelect, callbackUpload) {
            callbackSelect();
            this.seleccion = true;
            this.$emit('uploaded', true);
            callbackUpload();
        },
        onFileClear(callbackClear) {
            this.seleccion = false;
            this.$emit('uploaded', false);
            callbackClear();
        },
        async uploadEvent(user) {
            this.carga = true;

            const usuario = {
                nombres: user.firstName,
                apellidos: user.lastName,
                direccion: user.address,
                ciudad: user.city,
                email: user.email,
                password: user.password,
                fechaNacimiento: user.birthDate,
                sexo: user.gender,
                contactoNombre: user.contact,
                contactoTelefono: user.phoneContact,
                telefono: user.phone,
                estado: false,
                estadoRegistro: false
            };

            const doc = {
                nombre: "",
                link: "",
                extension: "",
                usuario: {
                    "id": null,
                },
                tipo: "Registro"
            }

            if (this.files.length > 0) {
                const file = this.files[0];

                let name = "";
                let extension = "";

                if (file.type === 'image/png') {
                    extension = file.type.split('/')[1];
                    name = "ID." + extension;
                } else {
                    name = "ID.pdf";
                    extension = ".pdf";
                }

                const storageRef = storage.ref(`${user.email}/${name}`);
                const task = storageRef.put(file);
                task.then(snapshot => {
                    this.toast.add({ severity: 'success', summary: 'Success', detail: 'Archivo subido con exito, un administrador evaluará su solicitud, estar atendo a su correo electrónico', life: 15000 });
                    storageRef.getDownloadURL().then(async url => {
                        this.$emit('uploaded', url);
                        const obj = await guardarUsuarioFachada(usuario);
                        doc.usuario.id = obj;
                        doc.nombre = name;
                        doc.extension = extension;
                        doc.link = url;

                        const obj2 = await guardarDocFachada(doc);
                        setTimeout(() => {
                            this.$router.push("/");
                        }, 2000);  // 2000 milisegundos = 2 segundos

                    }).catch(error => {
                        this.toast.add({ severity: 'error', summary: 'Error', detail: 'Error al obtener su archivo.', life: 3000 });
                    });

                }).catch(error => {
                    this.toast.add({ severity: 'error', summary: 'Error', detail: 'Error al cargar archivo', life: 3000 });
                });
            }

            this.totalSizePercent = 100;
        },
        async uploadInscripcionEvent(user) {
            this.carga = true;

            const doc = {
                nombre: "",
                link: "",
                extension: "",
                usuario: {
                    "id": user.id,
                },
                tipo: "Inscripcion"
            }

            if (this.files.length > 0) {
                const file = this.files[0];

                let name = "";
                let extension = "";

                if (file.type === 'image/png') {
                    extension = file.type.split('/')[1];
                    name = "ID." + extension;
                } else {
                    name = "PagoInscripcion_" + this.campeonatoNombre + ".pdf";
                    extension = ".pdf";
                }

                const storageRef = storage.ref(`${user.email}/${name}`);
                const task = storageRef.put(file);
                task.then(snapshot => {
                    this.toast.add({ severity: 'success', summary: 'Success', detail: 'Archivo subido con exito, un administrador evaluará su solicitud, estar atendo a su correo electrónico', life: 15000 });
                    storageRef.getDownloadURL().then(async url => {
                        doc.nombre = name;
                        doc.extension = extension;
                        doc.link = url;

                        await guardarDocFachada(doc);
                        setTimeout(() => {
                            this.$router.push("/");
                        }, 2000);  // 2000 milisegundos = 2 segundos
                    }).catch(error => {
                        this.toast.add({ severity: 'error', summary: 'Error', detail: 'Error al obtener su archivo.', life: 3000 });
                    });

                }).catch(error => {
                    this.toast.add({ severity: 'error', summary: 'Error', detail: 'Error al actualizar su archivo.', life: 3000 });
                });
            }

            this.totalSizePercent = 100;
        },
        async uploadPagoEvent(user) {
            this.carga = true;

            const doc = {
                nombre: "",
                link: "",
                extension: "",
                usuario: {
                    "id": user.id,
                },
                tipo: "Socio"
            }

            if (this.files.length > 0) {
                const file = this.files[0];

                let name = "";
                let extension = "";

                if (file.type === 'image/png') {
                    extension = file.type.split('/')[1];
                    name = "ID." + extension;
                } else {
                    name = "Pago.pdf";
                    extension = ".pdf";
                }

                const storageRef = storage.ref(`${user.email}/${name}`);
                const task = storageRef.put(file);
                task.then(snapshot => {
                    this.toast.add({ severity: 'success', summary: 'Success', detail: 'Archivo subido con exito, un administrador evaluará su solicitud, estar atendo a su correo electrónico', life: 15000 });
                    storageRef.getDownloadURL().then(async url => {
                        doc.nombre = name;
                        doc.extension = extension;
                        doc.link = url;

                        await guardarDocFachada(doc);
                        setTimeout(() => {
                            this.$router.push("/");
                        }, 2000); 
                    }).catch(error => {
                        this.toast.add({ severity: 'error', summary: 'Error', detail: 'Error al obtener su archivo.', life: 3000 });
                    });

                }).catch(error => {
                    this.toast.add({ severity: 'error', summary: 'Error', detail: 'Error al actualizar su archivo.', life: 3000 });
                });
            }

            this.totalSizePercent = 100;
        },
        onTemplatedUpload() {
            this.toast.add({ severity: 'info', summary: 'Success', detail: 'Archivo actualizado', life: 3000 });
        },
        formatSize(bytes) {
            const k = 1024;
            const dm = 3;
            const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

            if (bytes === 0) return `0 ${sizes[0]}`;

            const i = Math.floor(Math.log(bytes) / Math.log(k));
            const formattedSize = parseFloat((bytes / Math.pow(k, i)).toFixed(dm));

            return `${formattedSize} ${sizes[i]}`;
        },
        getDate() {
            const hoy = new Date();
            const dia = String(hoy.getDate()).padStart(2, '0');
            const mes = String(hoy.getMonth() + 1).padStart(2, '0');
            const año = hoy.getFullYear();
            const horas = String(hoy.getHours()).padStart(2, '0');
            const minutos = String(hoy.getMinutes()).padStart(2, '0');
            const segundos = String(hoy.getSeconds()).padStart(2, '0');

            return `${año}-${mes}-${dia}T${horas}:${minutos}:${segundos}`;
        }
    }
};
</script>


<style scoped>
.button-search,
.button-upload,
.button-remove {
    border-radius: 50px;
    border-width: 2px;
    transition: background-color 0.3s, color 0.3s, border-color 0.3s;
}

/* Botón buscar */
.button-search {
    background-color: #f0edee;
    /* color primario claro */
    color: #0a090c;
    /* color primario oscuro */
    border: 3px solid #0a090c;
}

.button-search:hover:enabled {
    background-color: #90ddf0;
    /* color acento */
    color: #f0edee;
    border: 3px solid #f0edee;
}

.button-search:disabled {
    background-color: #0a090c;
    color: #f0edee;
    border: 3px solid #f0edee;
    opacity: 0.6;
}

/* Botón clear */
.button-clear {
    background-color: #f0edee;
    /* color primario claro */
    color: #ff0000;
    /* color primario oscuro */
    border: 3px solid #0a090c;
}

.button-clear:hover:enabled {
    background-color: #90ddf0;
    /* color acento */
    color: #ff0000;
    border: 3px solid #f0edee;
}

.button-clear:disabled {
    background-color: #0a090c;
    color: #ff0000;
    border: 3px solid #f0edee;
    opacity: 0.6;
}
</style>