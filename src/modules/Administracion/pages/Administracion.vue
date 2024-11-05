<template>
    <div class="admin-container">
        <h1>Administración de Usuarios</h1>

        <!-- Opciones de navegación entre componentes -->
        <div class="options">
            <button :class="{ active: showVerifyUser }" @click="showVerifyUser = true">Verificar Usuario</button>
            <button :class="{ active: !showVerifyUser }" @click="showVerifyUser = false">Agregar Nuevo Usuario</button>
        </div>

        <!-- Componente de verificación de usuario o de agregar nuevo usuario según la opción seleccionada -->
        <div class="component-view">
            <div v-if="showVerifyUser">
                <TablaUsuarios />
            </div>
            <div v-else>
                <AgregarUsuario />
            </div>
        </div>
    </div>
</template>

<script>
import TablaUsuarios from '../components/TablaUsuarios.vue';
import AgregarUsuario from '../components/AgregarUsuario.vue';

export default {
    components: {
        TablaUsuarios,
        AgregarUsuario
    },
    data() {
        return {
            showVerifyUser: true // Inicialmente muestra el componente de verificación de usuario
        };
    }
}
</script>

<style scoped>
.admin-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    background-color: #ffffff;
}

h1 {
    text-align: center;
    color: #333333;
    margin-bottom: 20px;
    font-size: 24px;
}

.options {
    display: flex;
    justify-content: center;
    gap: 15px;
    margin-bottom: 20px;
}

.options button {
    padding: 10px 20px;
    font-size: 16px;
    font-weight: bold;
    color: #666666;
    background-color: #f0f0f0;
    border: 1px solid #ddd;
    border-radius: 5px;
    cursor: pointer;
    transition: all 0.3s;
}

.options button.active{
    background-color: #4b8b92 ;
    color: #ffffff;
    border-color: #4b8b92 ;
}


.options button:hover {
    background-color: #2c666e;
    color: #ffffff;
    border-color: #2c666e;
}



.component-view {
    padding: 20px;
    border-radius: 8px;
    border: 1px solid #e0e0e0;
    background-color: #f9f9f9;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>
