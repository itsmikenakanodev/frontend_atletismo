<template>
  <div>
    <!-- Modal de Términos y Condiciones -->
    <div v-if="!termsAccepted" class="terms-modal">
      <h2 class="terms-title">Términos y Condiciones de Participación en el Campeonato</h2>
      <div class="terms-content">
        <p>
          Al inscribirme en este Campeonato, acepto y declaro lo siguiente:
        </p>
        <ul>
          <li><strong>Cierre de Inscripciones:</strong> Entiendo que, una vez finalizado el proceso de inscripción, la
            plataforma cerrará y no se realizarán modificaciones en ninguna inscripción. Esto incluye, pero no se limita
            a, cambios en pruebas, correcciones de nombre o género, ni eliminación o adición de inscripciones.</li>
          <li><strong>Responsabilidad sobre Pertenencias:</strong> Asumo total responsabilidad por el cuidado de mis
            pertenencias durante el evento.</li>
          <li><strong>Exoneración de Responsabilidad:</strong> Libero de toda responsabilidad a los organizadores,
            colaboradores y patrocinadores del Campeonato por cualquier accidente, daño, enfermedad o pérdida que pueda
            ocurrir antes, durante o después del evento. Renuncio a cualquier acción legal o reclamo de indemnización
            que pudiera derivarse de mi participación en el evento.</li>
          <li><strong>Uso de Imagen:</strong> Autorizo el uso de mi imagen en fotografías o videos capturados durante el
            campeonato para fines de promoción y difusión del evento.</li>
        </ul>
      </div>
      <button @click="acceptTerms" class="accept-button">Aceptar</button>
    </div>
    <div :class="{ 'terms-background': !termsAccepted }" class="register-container">
      <Toast />
      <h2>Inscripción a {{ campeonato.nombre }}</h2>
      <h3>Datos Usuario</h3>

      <form @submit.prevent="inscribirse">
        <div class="form-row">
          <div class="form-group">
            <label for="firstName">Nombres</label>
            <input type="text" id="firstName" v-model="form.nombres" required disabled />
          </div>
          <div class="form-group">
            <label for="lastName">Apellidos</label>
            <input type="text" id="lastName" v-model="form.apellidos" required disabled />
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label for="address">Dirección</label>
            <input type="text" id="address" v-model="form.direccion" required disabled />
          </div>
          <div class="form-group">
            <label for="city">Provincia</label>
            <input type="text" id="city" v-model="form.provincia" required disabled />
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label for="email">Email</label>
            <input type="email" id="email" v-model="form.email" required disabled />
          </div>
          <div class="form-group">
            <label for="phone">Número de teléfono</label>
            <input type="text" maxlength="10" minlength="10"
              onkeypress="return (event.charCode >= 48 && event.charCode <= 57)" inputmode="numeric" pattern="\d*"
              id="phone" v-model="form.telefono" required disabled />
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label for="birthDate">Fecha de Nacimiento</label>
            <input type="date" id="birthDate" v-model="form.fechaNacimiento" required disabled />
          </div>
          <div class="form-group">
            <label for="genre">Género</label>
            <input type="text" id="genre" v-model="form.genero" required disabled />
          </div>
        </div>

        <h3>Categoria</h3>
        <span style="opacity: 50%">La categoria asignada se calcula a partir de su fecha de nacimiento y
          la fecha del campeonato.</span>
        <div class="form-row">
          <div class="form-group">
            <input type="text" id="nameContact" placeholder="" v-model="form.categoria" required disabled />
          </div>
        </div>

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

        <h3 class="titulo">Ingrese su comprobante de pago a continuación:</h3>

        <div class="centerElement">
          <div>
            <CargarArchivo2 ref="cargarArchivoInscripcion" :customFileName="customFileName" :accept="accept"
              @uploaded="handleUpload" @file-upload-error="handleFileUploadError" />
          </div>
        </div>

        <div class="centerElement">
          <div class="form-group">
            <button type="submit">Inscribirse</button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import $ from "jquery";
import { registroCompetidorFachada } from "../helpers/CompetidorHelper";
import { obtenerCampeonatoFachada } from "../helpers/ObtenerCampeonatosHelper";
import { registroPruebasCompetidorFachada } from "../helpers/CampeonatoPruebaCompetidorHelper";
import categorias from "@/utils/categorias.json";
import CargarArchivo2 from "@/modules/Registro/components/CargarArchivo2.vue";
import { storage } from '@/modules/Registro/helpers/firebase';
import { useToast } from 'primevue/usetoast';
import { guardarDocFachada } from "@/modules/Registro/helpers/DocHelper";

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
      termsAccepted: false,
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
      doc: {
        nombre: "",
        link: "",
        extension: "pdf",
        tipo: "Inscripcion",
        usuario: {
          "id": null,
        }
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
      uploadPath: null, // Aquí se debe especificar la ruta donde se subirá el archivo
      customFileName: `Inscripcion_${this.$route.params.id}.pdf`, // Nombre de archivo personalizado
      uploadedFileUrl: '',
      accept: 'application/pdf'
    };
  },

  computed: {
    pagoTotal() {
      if (!this.campeonato.pruebas) {
        return 0; // Retorna 0 si no hay pruebas
      }

      const pruebasSeleccionadas = this.campeonato.pruebas.filter(prueba => prueba.selected).length;

      if (pruebasSeleccionadas === 0) {
        return 0; // Retorna 0 si no hay pruebas seleccionadas
      }

      const costoBase = this.estado ? 15 : 25; // Costo base según el estado
      const costoAdicionalPorPrueba = 10; // Costo adicional por prueba extra
      const pruebasAdicionales = Math.max(0, pruebasSeleccionadas - 3); // Calcula cuántas pruebas adicionales hay

      return costoBase + (pruebasAdicionales * costoAdicionalPorPrueba); // Retorna el total
    }
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

    this.estado = this.usuario.estado;
    this.form.nombres = this.usuario.nombres;
    this.form.apellidos = this.usuario.apellidos;
    this.form.direccion = this.usuario.direccion;
    this.form.provincia = this.usuario.ciudad;
    this.form.email = this.usuario.email;
    this.form.telefono = this.usuario.telefono;
    this.form.genero = this.usuario.sexo;
    console.log(this.usuario.fechaNacimiento);
    if (this.usuario.fechaNacimiento) {
      this.form.fechaNacimiento = this.usuario.fechaNacimiento.split("T")[0];
      const edad = this.calcularEdad(this.form.fechaNacimiento);
      this.form.categoria = this.obtenerCategoria(
        edad,
        this.usuario.sexo
      ).nombre;
    }
  },
  methods: {
    initializeDataTable() {
      $("#pruebasTable").DataTable();
    },
    async triggerUpload() {
      // Llama al método uploadFile del componente hijo
      await this.$refs.cargarArchivoInscripcion.uploadFile(this.uploadPath);
    },
    handleUpload(uploadedData) {
      console.log('Archivo subido:', uploadedData);
      this.uploadedFileUrl = uploadedData.url;
      this.doc.link = this.uploadedFileUrl;
      this.doc.nombre = this.customFileName;
      this.doc.usuario.id = this.usuario.id;
    },
    handleFileUploadError() {
      this.toast.add({ severity: 'error', summary: 'Error', detail: 'Por favor, selecciona el archivo de pago antes de inscribirte.', life: 3000 });
    },
    async inscribirse() {
      const pruebasSeleccionadas = this.obtenerPruebasSeleccionadas();
      if (!pruebasSeleccionadas.length) {
        this.showToast('info', 'Info', 'Selecciona al menos 1 prueba');
        return;
      }

      this.uploadPath = `usuarios/${this.usuario.email}/inscripciones`;
      console.log('Ruta de subida actualizada:', this.uploadPath);

      await this.triggerUpload();

      // Validar que haya un archivo subido
      if (!this.uploadedFileUrl) {
        this.showToast('warn', 'Advertencia', 'No se puede inscribir al usuario sin el archivo de pago subido.');
        return;
      }

      this.competidor = this.createCompetidorData();
      try {
        const id = await registroCompetidorFachada(this.competidor);
        console.log("id de registro", id)
        this.competidor.id = id;
        await guardarDocFachada(this.doc);
        await this.registerPruebas(pruebasSeleccionadas);
        this.showToast('success', 'Éxito', 'Inscripción exitosa');
        setTimeout(() => this.$router.push("/"), 3000);    
      } catch (error) {
        // Si ocurre un error, eliminar el archivo subido
        await this.deleteUploadedFile(this.uploadedFileUrl);
        this.handleError(error);
      }
    },

    // Método para mostrar toast
    showToast(severity, summary, detail) {
      this.$toast.add({ severity, summary, detail, life: 3000 });
    },

    // Método para crear el objeto competidor
    createCompetidorData() {
      const hoy = new Date();
      return {
        fechaInscripcion: hoy.toISOString(),
        estadoParticipacion: "Pendiente",
        categoria: this.form.categoria,
        totalPagar: this.pagoTotal,
        cantidadPruebas: this.campeonato.pruebas.filter(prueba => prueba.selected).length,
        usuario: this.usuario,
        campeonato: {
          id: this.campeonato.id
        }
      };
    },

    // Método para registrar pruebas
    async registerPruebas(pruebas) {
      const promises = pruebas.map(async (prueba) => {
        const cuerpoCPC = {
          prueba,
          competidor: {
            id: this.competidor.id
          },
          campeonato: {
            id: this.campeonato.id
          },
          registrado: false
        };
        try {
          await registroPruebasCompetidorFachada(cuerpoCPC);
          console.log(cuerpoCPC);
        } catch (error) {
          this.showToast('danger', 'Error', 'Error en la Inscripción de prueba');
        }
      });
      await Promise.all(promises); // Espera a que todas las inscripciones se completen
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
    // Método para manejar errores
    handleError(error) {
      console.error(error);
      this.showToast('error', 'Error', 'Ocurrió un error al registrar al competidor');
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
      const mes = fin.getMonth() - nacimiento.getMonth();
      const dia = fin.getDate() - nacimiento.getDate();

      // Ajustar la edad si el cumpleaños no ha ocurrido aún en el año actual
      if (mes < 0 || (mes === 0 && dia < 0)) {
        edad--;
      }

      return edad; // Retorna solo la edad en años
    },
    obtenerCategoria(edad, genero) {
      const categoria = this.categorias.find(({ edadMinima, edadMaxima, genero: catGenero }) =>
        edad >= edadMinima &&
        edad <= edadMaxima &&
        catGenero === genero
      );

      if (categoria) {
        console.log("Categoría encontrada:", categoria);
        return { id: categoria.id, nombre: categoria.nombre };
      } else {
        console.warn("No se encontró categoría para edad:", edad, "y género:", genero);
        return null; // Retorna null si no se encuentra categoría
      }
    },
    acceptTerms() {
      this.termsAccepted = true;
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

.terms-background {
  filter: blur(5px);
  pointer-events: none;
  position: relative;
}

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

.terms-modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #ffffff;
  padding: 25px;
  max-width: 90%; /* Cambiado a 90% para ser más responsivo */
  max-height: 80%; /* Limitar la altura máxima */
  overflow-y: auto; /* Permitir desplazamiento vertical */
  border-radius: 8px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  text-align: left;
}

.terms-title {
  font-size: 1.8em;
  color: #07393c;
  margin-bottom: 15px;
  text-align: center;
}

.terms-content {
  color: #333333;
  font-size: 1em;
  line-height: 1.6;
  max-height: 60vh; /* Limitar la altura del contenido */
  overflow-y: auto; /* Permitir desplazamiento en el contenido */
}

/* Estilos para la barra de desplazamiento */
.terms-content::-webkit-scrollbar {
  width: 12px; /* Ancho de la barra de desplazamiento */
}

.terms-content::-webkit-scrollbar-track {
  background: #f1f1f1; /* Color del fondo de la barra de desplazamiento */
  border-radius: 10px; /* Bordes redondeados */
}

.terms-content::-webkit-scrollbar-thumb {
  background: #90ddf0; /* Color de la barra de desplazamiento */
  border-radius: 10px; /* Bordes redondeados */
}

.terms-content::-webkit-scrollbar-thumb:hover {
  background: #73b3c8; /* Color de la barra de desplazamiento al pasar el mouse */
}

.terms-content p {
  font-weight: 500;
  margin-bottom: 10px;
}

.terms-content ul {
  padding-left: 20px;
  list-style-type: disc;
}

.terms-content li {
  margin-bottom: 10px;
}

.accept-button {
  display: block;
  margin: 20px auto 0;
  padding: 10px 20px;
  font-size: 1em;
  font-weight: bold;
  color: #ffffff;
  background-color: #07393c;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.accept-button:hover {
  background-color: #055a67;
}
</style>
