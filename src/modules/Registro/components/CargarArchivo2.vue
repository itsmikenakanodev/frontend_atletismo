<template>
    <div class="card">
        <Toast />
        <h2>Cargar Archivo</h2>
        <input type="file" @change="onFileChange" :accept="accept" class="file-input" ref="fileInput" />
        <div v-if="file" class="file-preview">
            <img v-if="isImage" :src="filePreview" alt="File Preview" class="file-icon" />
            <img v-else :src="fileIcon" alt="File Icon" class="file-icon" />
            <span>{{ file.name }}</span>
        </div>
        <p v-if="error" class="error">{{ error }}</p>
        <p v-if="success" class="success">{{ success }}</p>
    </div>
</template>

<script>
import { storage } from "../helpers/firebase"; // Mantener solo la importación necesaria
import pdfIcon from '../assets/pdf_50px.png'; // Importar el ícono PDF

export default {
    props: {
        accept: {
            type: String,
            default: 'application/pdf,image/png,image/jpeg' // Tipos de archivo permitidos
        },
        customFileName: {
            type: String,
            default: '' // Nombre de archivo personalizado
        }
    },
    data() {
        return {
            file: null,
            error: '',
            success: '',
            filePreview: '', // Para almacenar la URL de la vista previa
        };
    },
    computed: {
        fileIcon() {
            return pdfIcon; // Usar la variable importada
        },
        isImage() {
            return this.file && (this.file.type === 'image/png' || this.file.type === 'image/jpeg');
        },
    },
    methods: {
        onFileChange(event) {
            const selectedFile = event.target.files[0];
            if (selectedFile) {
                this.file = selectedFile; // Actualizar el archivo seleccionado
                this.error = '';
                this.success = '';

                // Crear una URL de vista previa para el archivo
                if (this.isImage) {
                    this.filePreview = URL.createObjectURL(selectedFile);
                } else {
                    this.filePreview = ''; // Limpiar la vista previa si no es una imagen
                }
            } else {
                this.file = null; // Si no hay archivo seleccionado, restablecer el estado
                this.filePreview = ''; // Limpiar la vista previa
            }
        },
        async uploadFile(uploadPath) {
            if (!this.file) {
                this.success = '';
                this.error = 'No hay archivo seleccionado.';
                this.$emit('file-upload-error'); // Emitir un evento si no hay archivo
                return; // No hacer nada si no hay archivo
            }

            console.log("ruta de guardar",uploadPath)

            // Usar el nombre de archivo personalizado si se proporciona, de lo contrario usar el nombre original
            const fileName = this.customFileName || this.file.name;
            const extension = this.file.name.split('.')[1];
            const storageRef = storage.ref(`${uploadPath}/${fileName}`); // Usar la ruta pasada como prop
            try {
                await storageRef.put(this.file);
                this.success = 'Archivo subido con éxito.';
                const url = await storageRef.getDownloadURL();
                this.$emit('uploaded', { name: fileName, extension, url }); // Emitir el evento con la URL
                this.file = null; // Limpiar el archivo después de la carga
                this.filePreview = ''; // Limpiar la vista previa
                this.$refs.fileInput.value = '';
            } catch (err) {
                this.error = 'Error al subir el archivo: ' + err.message;
            }
        }
    }
};
</script>

<style scoped>
.card {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    border: 1px solid #2c666e; /* Color de borde */
    border-radius: 8px;
    background-color: #0a090c; /* Color de fondo de la tarjeta */
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    margin: 20px;
    color: #f0edee; /* Color del texto */
}

.file-input {
    display: block;
    margin: 10px 0;
    padding: 10px;
    border: 1px solid #90ddf0; /* Color del borde del input */
    border-radius: 5px;
    background-color: #2c666e; /* Color de fondo del input */
    color: #f0edee; /* Color del texto del input */
}

.file-input::file-selector-button {
    background-color: #90ddf0; /* Color del botón de selección */
    color: #0a090c; /* Color del texto del botón */
    border: none;
    border-radius: 5px;
    padding: 10px;
    cursor: pointer;
}

.upload-button {
    background-color: #90ddf0; /* Color del botón de subir */
    color: #0a090c; /* Color del texto del botón */
    border: none;
    border-radius: 5px;
    margin-top: 10px;
}

.remove-button {
    background-color: #ff0000; /* Color del botón de eliminar */
    color: #f0edee; /* Color del texto del botón */
    border: none;
    border-radius: 5px;
    margin-top: 10px;
}

.file-preview {
    display: flex;
    align-items: center;
    margin-top: 10px;
}

.file-icon {
    width: 50px;
    height: 50px;
    margin-right: 10px;
}

.error {
    color: red;
}

.success {
    color: green;
}
</style>