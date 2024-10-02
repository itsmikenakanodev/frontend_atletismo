<template>
    <div class="register-container">
        <Toast />
        <h2>Crea tu cuenta</h2>
        <form @submit.prevent="registrar">
            <div class="form-row">
                <div class="form-group">
                    <label for="firstName">Nombres</label>
                    <input type="text" id="firstName" v-model="form.firstName" placeholder="Ingresa tus 2 nombres..." required />
                </div>
                <div class="form-group">
                    <label for="lastName">Apellidos</label>
                    <input type="text" id="lastName" placeholder="Ingresa tus 2 apellidos..." v-model="form.lastName" required />
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label for="cedula">Cédula</label>
                    <input type="text" id="cedula" v-model="form.cedula" placeholder="Ingresa tu cédula..." required />
                </div>
                <div class="form-group">
                    <label for="address">Dirección</label>
                    <input type="text" id="address" placeholder="Ingresa tu dirección..." v-model="form.address" required />
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label for="city">Provincia</label>
                    <select id="city" v-model="form.city" required class="center-aligned">
                        <option disabled value="">Selecciona tu provincia</option>
                        <option class="options" v-for="(option, index) in provincias" :key="index" :value="option">{{ option }}</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="email">Email</label>
                    <input type="email" id="email" placeholder="example@email.com" v-model="form.email" required />
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label for="password">Contraseña</label>
                    <input type="password" id="password" placeholder="***********************" v-model="form.password" required />
                </div>
                <div class="form-group ">
                    <label for="birthDate">Fecha de Nacimiento</label>
                    <input type="date" id="birthDate" v-model="form.birthDate" required />
                </div>
            </div>
            <div class="form-row">
                
                <div class="form-group">
                    <label for="genre">Género</label>
                    <select id="genre" v-model="form.gender" required class="center-aligned">
                        <option disabled value="">Selecciona tu genero</option>
                        <option class="options" v-for="(option, index) in genders" :key="index" :value="option">{{ option }}</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="phone">Número de celular</label>
                    <input type="text" maxlength="10" minlength="10" onkeypress="return (event.charCode >= 48 && event.charCode <= 57)" inputmode="numeric" pattern="\d*" id="phone" placeholder="Ingrese su numero telefónico" v-model="form.phone" required />
                </div>
            </div>
            <div class="form-row">
                
                <div class="form-group">
                    <label for="nameContact">Nombre Contacto</label>
                    <input type="text" id="nameContact" placeholder="Ingrese nombre de contacto" v-model="form.contact" required />
                </div>
                <div class="form-group">
                    <label for="phoneContact">Número de celular de contacto</label>
                    <input type="text" maxlength="10" minlength="10" onkeypress="return (event.charCode >= 48 && event.charCode <= 57)" id="phoneContact" placeholder="Ingrese número teléfono de contacto" v-model="form.phoneContact" required />
                </div>
            </div>
            <div class="form-row centerElement">
                
            </div>
            <h3 class="centerElement">Ingrese un archivo pdf que contenga su identificación</h3>
            <CargarArchivo ref="cargarArchivo" @uploaded="verificarSubida" />
            <div class="centerElement">
                <div class="form-group">
                    <button type="submit">Solicitar registro</button>
                </div>
            </div>
        </form>
    </div>
</template>

<script>
import CargarArchivo from "../components/CargarArchivo.vue";
import { useToast } from 'primevue/usetoast';

export default {
    components: {
        CargarArchivo
    },
    setup() {
        const toast = useToast();
        return { toast };
    },
    data() {
        return {
            form: {
                firstName: "",
                lastName: "",
                cedula: "", // Agregado aquí
                address: "",
                city: "",
                email: "",
                password: "",
                birthDate: "",
                gender: "",
                phone: "",
                phoneContact: "",
                contact: "",
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
            upload: false
        };
    },
    methods: {
        verificarSubida(uploaded) {
            this.upload = uploaded;
        },
        async registrar() {
            if (this.upload) {
                try {
                    // Esperar a que el archivo se suba antes de registrar
                    await this.$refs.cargarArchivo.uploadEvent(this.form);

                    // Mostrar toast de éxito solo después de la carga
                    this.$toast.add({ severity: 'success', summary: 'Registro Exitoso', detail: 'Subiendo archivo elegido...', life: 6000 });
                } catch (error) {
                    this.$toast.add({ severity: 'error', summary: 'Error', detail: 'Hubo un error al registrar su cuenta. Por favor, intente de nuevo.', life: 3000 });
                }
            } else {
                this.$toast.add({ severity: 'warn', summary: 'Advertencia', detail: 'Debe subir el archivo para poder registrarse.', life: 3000 });
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