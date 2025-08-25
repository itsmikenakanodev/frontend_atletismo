<template>
    <div class="register-container">
        <Toast />
        <h2>Crea tu cuenta</h2>
        <form @submit.prevent="registrar">
            <div class="form-row">
                <div class="form-group">
                    <label for="firstName">Nombres</label>
                    <input type="text" id="firstName" v-model="user.nombres" placeholder="Ingresa tus 2 nombres..."
                        required />
                </div>
                <div class="form-group">
                    <label for="lastName">Apellidos</label>
                    <input type="text" id="lastName" placeholder="Ingresa tus 2 apellidos..." v-model="user.apellidos"
                        required />
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label for="cedula">Cédula</label>
                    <input type="text" id="cedula" v-model="user.cedula" placeholder="Ingresa tu cédula..." required />
                </div>
                <div class="form-group">
                    <label for="address">Dirección</label>
                    <input type="text" id="address" placeholder="Ingresa tu dirección..." v-model="user.direccion"
                        required />
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label for="city">Provincia</label>
                    <select id="city" v-model="user.ciudad" required class="center-aligned">
                        <option disabled value="">Selecciona tu provincia</option>
                        <option class="options" v-for="(option, index) in provincias" :key="index" :value="option">{{
                            option }}</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="email">Email</label>
                    <input type="email" id="email" placeholder="example@email.com" v-model="user.email" required />
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label for="password">Contraseña</label>
                    <input type="password" id="password" placeholder="***********************" v-model="user.password"
                        required />
                </div>
                <div class="form-group ">
                    <label for="birthDate">Fecha de Nacimiento</label>
                    <input type="date" id="birthDate" v-model="user.fechaNacimiento" required />
                </div>
            </div>
            <div class="form-row">

                <div class="form-group">
                    <label for="genre">Género</label>
                    <select id="genre" v-model="user.sexo" required class="center-aligned">
                        <option disabled value="">Selecciona tu genero</option>
                        <option class="options" v-for="(option, index) in genders" :key="index" :value="option">{{
                            option }}</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="phone">Número de celular</label>
                    <input type="text" maxlength="10" minlength="10"
                        onkeypress="return (event.charCode >= 48 && event.charCode <= 57)" inputmode="numeric"
                        pattern="\d*" id="phone" placeholder="Ingrese su numero telefónico" v-model="user.telefono"
                        required />
                </div>
            </div>
            <div class="form-row">

                <div class="form-group">
                    <label for="nameContact">Nombre Contacto</label>
                    <input type="text" id="nameContact" placeholder="Ingrese nombre de contacto"
                        v-model="user.contactoNombre" required />
                </div>
                <div class="form-group">
                    <label for="phoneContact">Número de celular de contacto</label>
                    <input type="text" maxlength="10" minlength="10"
                        onkeypress="return (event.charCode >= 48 && event.charCode <= 57)" id="phoneContact"
                        placeholder="Ingrese número teléfono de contacto" v-model="user.contactoTelefono" required />
                </div>
            </div>
            <div class="form-row centerElement">

            </div>
            <h3 class="centerElement">Ingrese un archivo pdf que contenga su identificación</h3>
            <CargarArchivo2 ref="cargarArchivo" :customFileName="customFileName" :accept="accept"
                @uploaded="handleUpload" @file-upload-error="handleFileUploadError" />
            <div class="centerElement">
                <div class="form-group">
                    <button type="submit" :disabled="!isFormValid">Solicitar registro</button>
                </div>
            </div>
        </form>
    </div>
</template>

<script>
import { guardarDocFachada } from "../helpers/DocHelper";
import { guardarUsuarioFachada } from "../helpers/UsuarioHelper";
import CargarArchivo2 from "../components/CargarArchivo2.vue";
import { storage } from "../helpers/firebase";
import { useToast } from 'primevue/usetoast';


export default {
    components: {
        CargarArchivo2
    },
    setup() {
        const toast = useToast();
        return { toast };
    },
    data() {
        return {
            user: {
                nombres: "",
                apellidos: "",
                direccion: "",
                ciudad: "",
                email: "",
                cedula: "",
                password: "",
                fechaNacimiento: "",
                sexo: "",
                contactoNombre: "",
                contactoTelefono: "",
                telefono: "",
                estado: false,
                estadoRegistro: false
            },
            doc : {
                nombre: "ID.pdf",
                link: "",
                extension: "pdf",
                tipo: "Registro",
                usuario: {
                    "id": null,
                }
            },
            genders: [
                "M",
                "F"
            ],
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
            uploadPath: null, // Aquí se debe especificar la ruta donde se subirá el archivo
            customFileName: 'ID.pdf', // Nombre de archivo personalizado
            uploadedFileUrl: '',
            accept: 'application/pdf'
        };
    },
    computed: {
        isFormValid() {
            const today = new Date();
            const birthDate = new Date(this.user.fechaNacimiento);
            const age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();
            const dayDiff = today.getDate() - birthDate.getDate();
            const isAdult = age > 18 || (age === 18 && monthDiff > 0) || (age === 18 && monthDiff === 0 && dayDiff >= 0);

            return this.user.nombres && this.user.apellidos && this.user.cedula && this.user.direccion &&
                   this.user.ciudad && this.user.email && this.user.password && this.user.fechaNacimiento &&
                   this.user.sexo && this.user.telefono && this.user.contactoNombre && this.user.contactoTelefono &&
                   isAdult;
        }
    },
    methods: {
        async triggerUpload() {
            // Llama al método uploadFile del componente hijo
            await this.$refs.cargarArchivo.uploadFile(this.uploadPath);
        },
        handleUpload(uploadedData) {
            console.log('Archivo subido:', uploadedData);
            this.uploadedFileUrl = uploadedData.url;
            this.doc.link = this.uploadedFileUrl; 
        },
        handleFileUploadError() {
            this.toast.add({ severity: 'error', summary: 'Error', detail: 'Por favor, selecciona un archivo antes de registrar al usuario.', life: 3000 });
        },
        async registrar() {
            this.uploadPath = `usuarios/${this.user.email}`
            console.log('Ruta de subida actualizada:', this.uploadPath);

            await this.triggerUpload();
            
            // Validar que haya un archivo subido antes de guardar al usuario y el documento
            if (!this.uploadedFileUrl) {
                this.toast.add({ severity: 'warn', summary: 'Advertencia', detail: 'No se puede registrar al usuario sin un archivo subido.', life: 3000 });
                return;
            }
            
            try {
                const userId = await guardarUsuarioFachada(this.user);
                this.doc.usuario.id = userId;
                await guardarDocFachada(this.doc);
                this.toast.add({ severity:'success', summary: 'Exito', detail: 'Usuario registrado con éxito.', life: 3000 }); 
                setTimeout(() => {
                    this.$router.push("/");
                }, 3000);
            } catch (error) {
                this.toast.add({ severity: 'error', summary: 'Error', detail: error.message, life: 3000 });
                // Si hubo un error al guardar el usuario, eliminar el archivo subido
                if (error.message.includes('Error al guardar el usuario')) {
                    await this.deleteUploadedFile(this.uploadedFileUrl);
                    this.uploadedFileUrl = ''; // Resetear la URL del archivo subido
                }
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
        }
    }
};
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
    text-align: left;
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
    text-align: left;
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
    text-align: left;
}

.centerElement {
    display: flex;
    justify-content: center;

}

.form-group button:disabled {
    background-color: #ccc; /* Color de fondo para el botón deshabilitado */
    color: #666; /* Color del texto para el botón deshabilitado */
    cursor: not-allowed; /* Cambia el cursor para indicar que está deshabilitado */
    opacity: 0.7; /* Opacidad para dar un efecto de deshabilitado */
}
</style>