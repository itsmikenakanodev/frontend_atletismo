<template>
  <div class="register-container mb-6">
    <Toast />
    <h2>Crea nueva prueba</h2>
    <form @submit.prevent="registrar">
      <div class="form-row centerElement">
        <div class="form-group">
          <label for="name">Nombre</label>
          <input type="text" id="name" placeholder="Ingresa nombre de la prueba que desea crear" required v-model="prueba.nombre" />
        </div>
      </div>

      <div class="form-row centerElement">
        <div class="form-group">
          <label for="type">Tipo</label>
          <select id="type" v-model="prueba.tipo" required class="center-aligned">
            <option disabled value="">Selecciona el tipo</option>
            <option class="options" v-for="(option, index) in tipos" :key="index" :value="option">
              {{ option }}
            </option>
          </select>
        </div>
      </div>

      <div class="form-row centerElement">
        <div class="form-group">
          <label for="category">Categoría</label>
          <select id="category" v-model="prueba.categoria" required class="center-aligned">
            <option disabled value="">Selecciona la categoría</option>
            <option class="options" v-for="(option, index) in categorias" :key="index" :value="option">
              {{ option }}
            </option>
          </select>
        </div>
      </div>

      <div class="form-row centerElement">
  <div class="form-group">
    <label for="criterio">Criterio</label>
    <select
      id="criterio"
      v-model="prueba.criterio"
      required
      class="center-aligned"
    >
      <option disabled value="">Selecciona un criterio a medir en esta prueba</option>
      <option v-for="(criterio, index) in criterios" :key="index" :value="criterio">
        {{ criterio }}
      </option>
    </select>
  </div>
</div>



<div v-if="prueba.categoria === 'Individual' && (prueba.combinada || prueba.criterio === 'Puntos')">
  <DataTable
    v-model:selection="selectedPrueba"
    :value="pruebas"
    paginator
    showGridlines
    :rows="5"
    :rowsPerPageOptions="[5, 10, 20, 50]"
    tableStyle="min-width: 40rem"
  >
    <Column selectionMode="multiple" headerStyle="width: 3rem;"></Column>
    <Column field="nombre" header="Nombre" sortable></Column>
    <Column field="tipo" header="Tipo" sortable></Column>
  </DataTable>
</div>

      <div class="centerElement">
        <div class="form-group">
          <Button type="submit" :loading="loading">Guardar</Button>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import { registrarPruebaFachada } from "@/modules/Pruebas/helpers/RegistroPruebasHelper";
import { obtenerPruebasFachada } from '@/modules/Campeonatos/helpers/ObtenerPruebasHelper.js'

export default {
  data() {
    return {
      prueba: {
        nombre: "",
        categoria: "",
        tipo: "",
        combinada: false,
        descripcion: "",
        criterio: "", // Nuevo atributo

      },
      tipos: ["Pista", "Campo"],
      categorias: ["Individual", "Colectiva"],
      criterios: ["Tiempo", "Distancia", "Puntos"],
      loading: false,
      pruebas: [],
      selectedPrueba: [],
    };
  },
  methods: {
    async listarPruebas() {
      try {
    const response = await obtenerPruebasFachada();
    this.pruebas = response.filter((prueba) => {
      return this.prueba.criterio !== 'Puntos' || prueba.esPuntual === true;
    });
  } catch (error) {
    console.error("Error al listar las pruebas:", error);
  }
    },
    async registrar() {
      this.prueba.pruebasCombinadas = this.prueba.combinada;
      this.loading = true;

      // Asegúrate de que selectedPrueba sea un array antes de llamar a forEach
      if (Array.isArray(this.selectedPrueba)) {
        this.prueba.descripcion = this.selectedPrueba.map(prueba => prueba.nombre).join(", ");
      } else {
        this.prueba.descripcion = "";
      }

      this.prueba.tipo = this.prueba.tipo.toLowerCase();
      console.log(this.prueba);
      console.log(this.selectedPrueba);

      try {
        await registrarPruebaFachada(this.prueba);
        this.loading = false;
        this.$toast.add({
          severity: "info",
          summary: "Info",
          detail: "Registro de prueba completado",
          life: 3000,
        });
        this.prueba = {
          nombre: "",
          categoria: "",
          tipo: "",
          combinada: false,
          descripcion: "",
          criterio: ""
        };
      } catch (e) {
        console.error(e);
        this.loading = false;
        this.$toast.add({
          severity: "error",
          summary: "Error",
          detail: "No se pudo completar el registro de prueba",
          life: 3000,
        });
      }
    }
  },
  watch: {
    selectedPrueba(newVal) {
      if (newVal.length > 10) {
        this.$toast.add({ severity: 'warn', summary: 'Límite de selección', detail: 'Solo puedes seleccionar hasta 10 pruebas.', life: 3000 });
        this.selectedPrueba = newVal.slice(0, 10);
      }
    }
  },
  mounted() {
    this.listarPruebas();
  },
};
</script>


<style scoped>
.register-container {
  display: block;
  max-width: 800px;
  margin: auto;
  margin-top: 5vh;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  background-color: #07393c;
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
  width: calc(100% - 10px);
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

.form-group input::placeholder {
  color: #90ddf0;
  text-align: center; /* Asegura que el placeholder también esté centrado */
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
  color: #0a090c;
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
  color: #0a090c;
  border: none;
  font-size: 18px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.form-group input::placeholder {
  color: #90ddf0;
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
  background-color: #07393c;
}

.options {
  background-color: #f0edee;
  color: #0a090c;
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
