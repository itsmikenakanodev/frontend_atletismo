<template>
  <div class="register-container">
    <Toast />
    <h2>Inscripción a {{ campeonato.nombre }}</h2>
    <h3>Datos Usuario</h3>

    <form @submit.prevent="inscribirse">
      <div class="form-row">
        <div class="form-group">
          <label for="firstName">Nombres</label>
          <input
            type="text"
            id="firstName"
            v-model="form.nombres"
            required
            disabled
          />
        </div>
        <div class="form-group">
          <label for="lastName">Apellidos</label>
          <input
            type="text"
            id="lastName"
            v-model="form.apellidos"
            required
            disabled
          />
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label for="address">Dirección</label>
          <input
            type="text"
            id="address"
            v-model="form.direccion"
            required
            disabled
          />
        </div>
        <div class="form-group">
          <label for="city">Provincia</label>
          <input
            type="text"
            id="city"
            v-model="form.provincia"
            required
            disabled
          />
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label for="email">Email</label>
          <input
            type="email"
            id="email"
            v-model="form.email"
            required
            disabled
          />
        </div>
        <div class="form-group">
          <label for="phone">Número de teléfono</label>
          <input
            type="text"
            maxlength="10"
            minlength="10"
            onkeypress="return (event.charCode >= 48 && event.charCode <= 57)"
            inputmode="numeric"
            pattern="\d*"
            id="phone"
            v-model="form.telefono"
            required
            disabled
          />
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label for="birthDate">Fecha de Nacimiento</label>
          <input
            type="date"
            id="birthDate"
            v-model="form.fechaNacimiento"
            required
            disabled
          />
        </div>
        <div class="form-group">
          <label for="genre">Género</label>
          <input
            type="text"
            id="genre"
            v-model="form.genero"
            required
            disabled
          />
        </div>
      </div>

      <h3>Categoria</h3>
      <span style="opacity: 50%"
        >La categoria asignada se calcula a partir de su fecha de nacimiento y
        la fecha del campeonato.</span
      >
      <!-- <div class="form-row">
        <div class="form-group">
          <input
            type="text"
            id="nameContact"
            placeholder=""
            v-model="form.categoria"
            required
            disabled
          />
        </div>
      </div> -->

      <h3>Pruebas</h3>
      <table id="pruebasTable" class="display pruebas-table">
        <thead>
          <tr>
            <th>Seleccionar</th>
            <th>Nombre prueba</th>
            <th>Tipo</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="prueba in campeonato.pruebas" :key="prueba.id">
            <td><input type="checkbox" v-model="prueba.selected" /></td>
            <td>{{ prueba.nombre }}</td>
            <td>{{ prueba.tipo }}</td>
          </tr>
        </tbody>
      </table>

      <strong v-if="pagoTotal">Total a pagar: {{ pagoTotal }} USD.</strong>

      <h3 class="titulo">Suba su archivo aquí</h3>

      <div class="centerElement">
        <div>
          <CargarArchivo ref="cargarArchivoPago" :campeonatoNombre="campeonato.nombre" @uploaded="verificarSubida" />
        </div>
      </div>

      <div class="centerElement">
        <div class="form-group">
          <button @click="comprobarPago" type="submit">Inscribirse</button>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import $ from "jquery";
import { registroCompetidorFachada } from "../helpers/CompetidorHelper";
import { obtenerCampeonatoFachada } from "../helpers/ObtenerCampeonatosHelper";
import { registroPruebasCompetidorFachada } from "../helpers/CampeonatoPruebaCompetidorHelper";

import categorias from "@/utils/categorias.json";
import CargarArchivo from "@/modules/Registro/components/CargarArchivo.vue";

export default {
  components: {
    CargarArchivo,
  },
  data() {
    return {
      form: {
        nombres: "",
        apellidos: "",
        direccion: "",
        provincia: "",
        email: "",
        fechaNacimiento: "",
        genero: "",
        telefono: "",
        categoria: "",
      },
      campeonato: { id: null, nombre: "", pruebas: null, fecha: "" },
      competidor: null,
      camp_id: 1,
      userData: null,
      categorias: categorias,
      campeonatoRecibido: null,
      upload: false,
      usuario: JSON.parse(localStorage.getItem("userdata")),
      estado: null,
    };
  },

  computed: {
    pagoTotal() {
      if (this.campeonato.pruebas) {
        const pruebasSeleccionadas = this.campeonato.pruebas.filter(
          (prueba) => prueba.selected
        ).length;
        let total = 0;
        if (!pruebasSeleccionadas) {
          return 0;
        }

        if (this.estado) {
          if (pruebasSeleccionadas <= 3) {
            total = 15;
          } else {
            total = 15 + (pruebasSeleccionadas - 3) * 10;
          }
        } else {
          if (pruebasSeleccionadas <= 3) {
            total = 25;
          } else {
            total = 25 + (pruebasSeleccionadas - 3) * 10;
          }
        }
        return total;
      }
    },
  },

  async mounted() {
    const c = await obtenerCampeonatoFachada(this.$route.params.id);
    this.campeonato.id = c.id;
    this.campeonato.nombre = c.nombre;
    this.campeonato.fecha = c.fechaFin;
    this.campeonato.pruebas = c.pruebas;

    try {
      this.campeonato.pruebas = this.campeonato.pruebas.map((prueba) => ({
        ...prueba,
        selected: false,
      }));
    } catch (error) {
      console.log(error);
    }

    document.addEventListener("DOMContentLoaded", this.initializeDataTable);
    const userDataJSON = localStorage.getItem("userdata");
    this.userData = JSON.parse(userDataJSON);

    this.estado = this.userData.estado;
    this.form.nombres = this.userData.nombres;
    this.form.apellidos = this.userData.apellidos;
    this.form.direccion = this.userData.direccion;
    this.form.provincia = this.userData.ciudad;
    this.form.email = this.userData.email;
    this.form.telefono = this.userData.telefono;
    this.form.genero = this.userData.sexo;
    console.log(this.userData.fechaNacimiento);
    if (this.userData.fechaNacimiento) {
      this.form.fechaNacimiento = this.userData.fechaNacimiento.split("T")[0];
      const edad = this.calcularEdad(this.form.fechaNacimiento);
      this.form.categoria = this.obtenerCategoria(
        edad.anios,
        this.userData.sexo
      ).nombre;
    }
  },
  methods: {
    initializeDataTable() {
      $("#pruebasTable").DataTable();
    },
    async inscribirse() {
      const pruebasS = this.obtenerPruebasSeleccionadas();
      if (pruebasS == false) {
        this.$toast.add({
          severity: "info",
          summary: "Info",
          detail: "Selecciona al menos 1 prueba",
          life: 3000,
        });
      } else {
        const hoy = new Date();
        this.competidor = {
          id: null,
          fechaInscripcion: hoy.toISOString(),
          estadoParticipacion: "Pendiente",
          categoria: this.form.categoria,
          usuario: this.userData,
          campeonato: {
            id: this.campeonato.id
          }
        };
        try {
          this.comp_id = await registroCompetidorFachada(this.competidor);
          console.log(this.comp_id);
          this.competidor.id = this.comp_id;
        } catch (error) {
          return;
        }

        if (this.competidor) {
          pruebasS.map(async (p) => {
            const cuerpoCPC = {
              prueba: p,
              competidor: {
                id: this.competidor.id
              },
              campeonato: {
                id: this.campeonato.id
              }
            };
            try {
              await registroPruebasCompetidorFachada(cuerpoCPC);
              console.log(cuerpoCPC)
            } catch (error) {
              this.$toast.add({
                severity: "danger",
                summary: "Error",
                detail: "Error en la Inscripción",
                life: 3000,
              });
            }
          });
          this.$toast.add({
            severity: "success",
            summary: "Éxito",
            detail: "Inscripción exitosa",
            life: 3000,
          });
        }
      }
    },
    obtenerPruebasSeleccionadas() {
      const selectedPruebas = this.campeonato.pruebas.filter(
        (prueba) => prueba.selected
      );
      return selectedPruebas;
    },
    calcularEdad(fechaNacimiento) {
      const fin = new Date(this.campeonato.fecha);
      const nacimiento = new Date(fechaNacimiento);

      let edad = fin.getFullYear() - nacimiento.getFullYear();
      let mes = fin.getMonth() - nacimiento.getMonth();
      let dia = fin.getDate() - nacimiento.getDate();

      // Si el mes actual es menor que el mes de nacimiento, restamos un año a la edad
      if (mes < 0 || (mes === 0 && dia < 0)) {
        edad--;
        mes += 12;
      }

      // Si el día actual es menor que el día de nacimiento, restamos un mes
      if (dia < 0) {
        mes--;
        const ultimoDiaMesAnterior = new Date(
          fin.getFullYear(),
          fin.getMonth(),
          0
        ).getDate();
        dia += ultimoDiaMesAnterior;
      }
      return { anios: edad, meses: mes, dias: dia };
    },

    obtenerCategoria(edad, genero) {
      const categoria = this.categorias.find(
        (cat) =>
          cat.edadMinima <= edad &&
          cat.edadMaxima >= edad &&
          cat.genero === genero
      );
      console.log("categoria",categoria);
      return categoria ? { id: categoria.id, nombre: categoria.nombre } : null;
    },
    verificarSubida(uploaded) {
      this.upload = uploaded;
      console.log("Archivo subido:", this.upload);
    },
    comprobarPago() {
      const usuario = JSON.parse(localStorage.getItem("userdata"));
      if (this.upload) {
        this.$refs.cargarArchivoPago.uploadInscripcionEvent(usuario);
        console.log("Pago Inscripcion comprobado:", this.upload);
      } else {
        alert("Debe subir el archivo para comprobar el pago!");
      }
    },
  },
};
</script>

<style scoped>
.register-container {
  display: block;
  max-width: 900px;
  margin: auto;
  margin-top: 5vh;
  margin-bottom: 2vh;
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

.h3Element {
  margin-bottom: 20px;
  text-align: center;
  font-size: 20px;
  color: #90ddf0;
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
  color: #0a090c;
  border: none;
  font-size: 18px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.form-group button:hover {
  background-color: #07393c;
  border: solid white 1px;
  color: #f0edee;
}

.CargarArchivo {
  margin-top: 20px;
}

.form-group input::placeholder {
  color: #90ddf0;
}

.centerElement {
  display: flex;
  justify-content: center;
}

.pruebas-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}

.pruebas-table th,
.pruebas-table td {
  border: 1px solid #90ddf0;
  padding: 10px;
  text-align: left;
  background-color: #2c666e;
  color: #90ddf0;
}

.pruebas-table th {
  background-color: #2c666e;
  color: #90ddf0;
}

.pruebas-table td {
  background-color: #07393c;
  color: #f0edee;
}

.pruebas-table input[type="checkbox"] {
  width: 20px;
  height: 20px;
}

.pruebas-table input[type="text"] {
  width: 100%;
  padding: 10px;
  border: none;
  border-radius: 4px;
  box-sizing: border-box;
  background-color: #2c666e;
  color: #90ddf0;
}
</style>
