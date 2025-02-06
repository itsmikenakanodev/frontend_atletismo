<template lang="">
    <div>
      <DataTable
        :value="documentosUsuarios"
        tableStyle="min-width: 50rem"
        paginator
        :rows="5"
        :rowsPerPageOptions="[5, 10, 20, 50]"
      >
        <template #header>
          <Toast></Toast>
          <ConfirmDialog></ConfirmDialog>
        <div class="card flex flex-wrap gap-2 justify-content-center">
          <Button v-if="campeonato" @click="cambiarEstado()" label="Cambiar estado" ></Button>
      </div>
        </template>
<Column field="nombre" header="Nombre"></Column>
<Column field="link" header="Ver">
  <template #body="slotProps">
            <span class="p-buttonset">
              <Button
                label="Ver"
                icon="pi pi-eye"
                @click="abrirUrl(slotProps.data)"
              />
            </span>
          </template>
</Column>
</DataTable>
</div>
<div>

</div>
</template>
<script>
import { enviarcorreoFachada } from '../helpers/enviarCorrreo';
import { actualizarEstadoFachada } from '../helpers/actualizarEstadoCompetidor';
import { eliminarDocumentoSocioFachada } from '../helpers/suscripciones';
import { storage } from '@/modules/Registro/helpers/firebase';

export default {
  props: ["docs", "correo", "id"],
  data() {
    return {
      documentosUsuarios: null,
      cambioEstadoVisible: false,
      cuerpoCorreo: {
        destinatario: this.correo,
        asunto: "Notificación de cambio de estado",
        cuerpo: "",
        mensajeHtml: ""
      },
      campeonato: null
    };
  },
  methods: {
    abrirUrl(data) {
      // Expresión regular para extraer el texto entre el guion y el punto
      const regex = /_(.*)\./;

      // Ejecutar la expresión regular en el texto
      const match = data.nombre.match(regex);

      // Extraer el resultado, si existe
      const resultado = match ? match[1] : null;

      this.campeonato = resultado;
      window.open(data.link, "_blank");
    },
    async enviarCorreo(val) {
      if (val) {
        this.cuerpoCorreo.cuerpo =
          "Tu inscripción al campeonato " + this.campeonato + " fue aprobada.";
        this.cuerpoCorreo.mensajeHtml =
          `
          <div style="max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px; background-color: #f9f9f9;">
            <h3 style="color: #333;">${this.cuerpoCorreo.cuerpo}</h3>
            <p style="font-family: Arial; font-size:12px; line-height: 1em;">
              ¡Bienvenido! Estamos felices de tenerte con nosotros.
            </p>
            <p style="font-family: Arial; font-size:12px; line-height: 1em;">
              <b>Gracias por unirte a nosotros.</b><br>
              <b>Saludos cordiales,</b> <br><br>
            </p>
            <div style="color:rgb(144,221,240); text-align: center;">
            </div>
          </div>
        `;
        await actualizarEstadoFachada(this.id, "Confirmado");
      } else {
        this.cuerpoCorreo.cuerpo =
          "Tu comprobante de pago no es válido, inscripción al campeonato " + this.campeonato + " denegada! Por favor, verifica que tu pago o documento sea válido e intenta enviar tu comprobante nuevamente.";
        this.cuerpoCorreo.mensajeHtml =
          `
          <div style="max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px; background-color: #f9f9f9;">
            <h3 style="color: #333;">${this.cuerpoCorreo.cuerpo}</h3>
            <p style="font-family: Arial; font-size:12px; line-height: 1em;">
              Lamentamos informarte que tus documentos no son válidos. 
              Por favor, intenta registrarte nuevamente.
            </p>
            <p style="font-family: Arial; font-size:12px; line-height: 1em;">
              <b>Gracias por tu comprensión.</b><br>
              <b>Saludos cordiales,</b> <br><br>
            </p>
            <div style="color:rgb(144,221,240); text-align: center;">
            </div>
          </div>
        `;
      }
      this.campeonato = null;
      await enviarcorreoFachada(this.cuerpoCorreo);
    },
    cambiarEstado() {
      this.$confirm.require({
        message: '¿Está seguro que desea cambiar el estado de este usuario?',
        icon: 'pi pi-exclamation-triangle',
        rejectClass: 'p-button-secondary p-button-outlined',
        rejectLabel: 'Denegar',
        acceptLabel: 'Aprobar',
        accept: () => {
          this.$emit('mostrarEspera');
          this.enviarCorreo(true).then(() => {
            this.$emit('cambioEstado', true);
          });
        },
        reject: async () => {
          this.$emit('mostrarEspera');
          const idDocumento = this.documentosUsuarios[0].id;
          const url = this.documentosUsuarios[0].link;
          try {
            await this.deleteUploadedFile(url); // Eliminar el archivo de Firebase Storage
            await eliminarDocumentoSocioFachada(idDocumento);
          } catch (error) {
            console.error('Error al eliminar el documento:', error.message);
          }
          
          this.enviarCorreo(false).then(() => {
            this.$emit('cambioEstado', false);
            this.$emit('competidor', idDocumento);
          });
        }
      });
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
  },

  mounted() {
    console.log(this.id)
    console.log(this.documentos)
    this.documentosUsuarios = this.docs;
  },
};
</script>
<style></style>