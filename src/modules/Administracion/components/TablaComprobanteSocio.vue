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
          <Button @click="cambiarEstado()" label="Cambiar estado" ></Button>
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
import { actualizarEstadoSocioUsuarioFachada } from '../helpers/actualizarEstadoUsuario';
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
      }
    };
  },
  methods: {
    abrirUrl(data) {
      window.open(data.link, "_blank");
    },
    async enviarCorreo(val) {
      if (val) {
        this.cuerpoCorreo.cuerpo =
          "Tu suscripción fue aprobada.";
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
      } else {
        this.cuerpoCorreo.cuerpo =
          "Tu comprobante de pago no es válido, suscripción denegada! Por favor, verifica que tu pago sea válido e intenta enviar tu comprobante nuevamente.";
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
      await actualizarEstadoSocioUsuarioFachada(this.id);
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
          this.enviarCorreo(true).then(() => { this.$emit('cambioEstado', true) });
        },
        reject: async () => {
          await eliminarDocumentoSocioFachada(this.documentosUsuarios[0].id);
          this.enviarCorreo(false).then(() => { this.$emit('cambioEstado', false) });
          //falta eliminar el documento de pago del firebase
        }
      });
    },
    async eliminarCarpeta() {
      const ref = storage.ref(this.correo);

      try {
        // Listar todos los archivos en la carpeta
        const listResult = await ref.listAll();

        // Eliminar todos los archivos encontrados
        const deletePromises = listResult.items.map((itemRef) =>
          itemRef.delete()
        );
        await Promise.all(deletePromises);

        // Verificar si hay subcarpetas y eliminarlas recursivamente
        const deleteSubfolderPromises = listResult.prefixes.map((folderRef) =>
          this.eliminarCarpeta(folderRef.fullPath)
        );
        await Promise.all(deleteSubfolderPromises);

        console.log(`Carpeta '${this.correo}' eliminada con éxito.`);
      } catch (error) {
        console.error("Error al eliminar la carpeta:", error);
      }
    },
    async eliminarArchivoHandler(correo, nombreArchivo) {
      if (correo && nombreArchivo) {
        const filePath = `${correo}/${nombreArchivo}`;
        try {
          await this.eliminarArchivo(filePath);
          alert("Archivo eliminado con éxito");
        } catch (error) {
          alert("Error al eliminar el archivo: " + error.message);
        }
      }
    },
    async eliminarArchivo(filePath) {
      const ref = storage.ref(filePath);
      try {
        await ref.delete();
        console.log(`Archivo '${filePath}' eliminado con éxito.`);
      } catch (error) {
        console.error("Error al eliminar el archivo:", error);
      }
    },
  },

  mounted() {
    console.log(this.id)
    this.documentosUsuarios = this.docs;
  },
};
</script>
<style></style>