<template>
    <div class="register-container">
        <Toast />
        <h2>Agregar Usuario</h2>
        <form @submit.prevent="registrarUsuario">
            <div class="form-row">
                <div class="form-group">
                    <label for="firstName">Nombres</label>
                    <input type="text" id="firstName" v-model="form.nombres" placeholder="Ingresa los nombres..." required />
                </div>
                <div class="form-group">
                    <label for="lastName">Apellidos</label>
                    <input type="text" id="lastName" placeholder="Ingresa los apellidos..." v-model="form.apellidos" required />
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label for="cedula">Cédula</label>
                    <input type="text" id="cedula" v-model="form.cedula" placeholder="Ingresa la cédula..." required />
                </div>
                <div class="form-group">
                    <label for="address">Dirección</label>
                    <input type="text" id="address" placeholder="Ingresa la dirección..." v-model="form.direccion" required />
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label for="email">Email</label>
                    <input type="email" id="email" placeholder="example@email.com" v-model="form.email" required />
                </div>
                <div class="form-group">
                    <label for="birthDate">Fecha de Nacimiento</label>
                    <input type="date" id="birthDate" v-model="form.fechaNacimiento" required />
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label for="gender">Género</label>
                    <select id="gender" v-model="form.sexo" required>
                        <option disabled value="">Selecciona tu género</option>
                        <option v-for="(option, index) in sexo" :key="index" :value="option">{{ option }}</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="phone">Número de celular</label>
                    <input type="text" maxlength="10" minlength="10" onkeypress="return (event.charCode >= 48 && event.charCode <= 57)" id="phone" placeholder="Número de celular" v-model="form.telefono" required />
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label for="contact">Nombre Contacto</label>
                    <input type="text" id="contact" placeholder="Nombre de contacto" v-model="form.contactoNombre" required />
                </div>
                <div class="form-group">
                    <label for="phoneContact">Número de celular de contacto</label>
                    <input type="text" maxlength="10" minlength="10" onkeypress="return (event.charCode >= 48 && event.charCode <= 57)" id="phoneContact" placeholder="Teléfono de contacto" v-model="form.contactoTelefono" required />
                </div>
            </div>
    
                <!-- Checkbox para ser socio -->
                <div class="centerElement">
                <label>
                    ¿Desea que este usuario sea socio?
                    <input type="checkbox" v-model="form.estado" class="large-checkbox" />
                </label>
            </div>

            <div class="centerElement">
    <button type="submit" class="register-button">Registrar Usuario</button>
</div>

        </form>
    </div>
</template>

<script>
import { guardarUsuarioFachada } from "../../Registro/helpers/UsuarioHelper";
import { useToast } from 'primevue/usetoast';

export default {
    setup() {
        const toast = useToast();
        return { 
            
            toast };
    },
    data() {
        return {
            form: {
                nombres: "",
                apellidos: "",
                cedula: "",
                ciudad:"",
                direccion: "",
                email: "",
                fechaNacimiento: "",
                sexo: "",
                telefono: "",
                contactoNombre: "",
                contactoTelefono: "",
                estado: false,
                estadoRegistro: true
            },
            sexo: ["M", "F"]
        };
    },
    mounted() {
        // Obtener los datos del usuario del localStorage
        const usuario = JSON.parse(localStorage.getItem('userdata'));
        if (usuario && usuario.ciudad) {
            this.form.ciudad = usuario.ciudad; // Asignar la provincia al formulario
        }
    },
    methods: {
        async registrarUsuario() {
            // Generar una contraseña aleatoria de 10 caracteres con letras y números
            const contraseñaAleatoria = Math.random().toString(36).slice(2, 12);

            // Crear el objeto de usuario con la contraseña generada
            const usuarioData = { ...this.form, password: contraseñaAleatoria};

            // Imprimir los datos que se van a enviar
            //console.log("Datos que se van a enviar:", usuarioData);

            try {
                await guardarUsuarioFachada(usuarioData);
                this.toast.add({ severity: 'success', summary: 'Registro Exitoso', detail: 'Usuario registrado correctamente', life: 3000 });
                
                // Limpiar el formulario después del registro
                this.form = {
                    nombres: "",
                apellidos: "",
                cedula: "",
                direccion: "",
                email: "",
                fechaNacimiento: "",
                sexo: "",
                telefono: "",
                contactoNombre: "",
                contactoTelefono: "",
                estado: false,
                estadoRegistro: true
                };
            } catch (error) {
                this.toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo registrar el usuario', life: 3000 });
            }
        }
    }
};
</script>


<style scoped>
/* Estilos copiados del componente original para mantener la consistencia */
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
    color: #f0edee;
    text-align: left;
}

.form-group input::placeholder {
    color: white; 
    opacity: 1; 
}


.form-group button {
    width: 100%;
    padding: 12px;
    background-color: #90ddf0;
    color: #f0edee;
    border: none;
    font-size: 18px;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.form-group button:hover {
    background-color: #07393c;
    color: #f0edee;
}

.centerElement {
    display: flex;
    justify-content: center;
}

.register-button {
    width: 100%;
    padding: 12px;
    background-color: #07393c;
    color: #f0edee;
    border: none;
    font-size: 18px;
    font-weight: bold;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s ease, transform 0.2s ease;
}

.register-button {
    width: 100%;
    margin-top: 12px;
    background: linear-gradient(135deg, #2c666e, #4b8b92); /* Degradado de color */
    padding: 5px;
    color: #f0edee;
    border: none;
    font-size: 18px;
    font-weight: bold;
    border-radius: 8px; /* Bordes más redondeados */
    cursor: pointer;
    transition: background-color 0.3s ease, transform 0.2s ease, box-shadow 0.3s ease;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* Sombra sutil */
}

.register-button:hover {
    background: linear-gradient(135deg, #4b8b92, #2c666e); /* Invertir el degradado al pasar el mouse */
    color: #ffffff;
    transform: translateY(-3px); /* Eleva el botón ligeramente al pasar el mouse */
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3); /* Sombra más intensa */
}

.register-button:active {
    transform: translateY(0); /* Restablece la posición cuando se hace clic */
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* Sombra normal al hacer clic */
}

/* Nuevo estilo para el checkbox */
.large-checkbox {
    transform: scale(1.5); /* Aumentar el tamaño del checkbox */
    margin-right: 10px; /* Espacio adicional al lado */
}
</style>
