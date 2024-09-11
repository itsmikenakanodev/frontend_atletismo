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
        this.cuerpoCorreo.cuerpo = "Tu inscripción al campeonato " + this.campeonato + " fue aprobada.";
        this.cuerpoCorreo.mensajeHtml = `
          <body>
            <div style="color:rgb(144,221,240); text-align: center;">
              <img width="100%" height="100%" src="../../Inicio/aname-footer.png"/>
            </div>
            <br>
            <p style="color:rgb(44, 102, 110); font-family: Arial; font-size:12px; line-height: 1em;">
              El presente correo es para informar el siguiente comunicado: <br>  
            </p>
            <p style="color:rgb(44, 102, 110); font-family: Arial; font-size:12px; line-height: 1em;" > `+
          this.cuerpoCorreo.cuerpo +
          `
            </p>
            <p style="font-family: Arial; font-size:12px; line-height: 1em;">
              <b>Gracias por la atención</b><br>
              <b>Saludos cordiales,</b> <br><br>
            </p>
            <img src="../../Inicio/Aletismo.jpg" width="100%" height="100%"/>
          </body>
        `;
        await actualizarEstadoFachada(this.id, "Confirmado");
      }
      else {
        this.cuerpoCorreo.cuerpo = "Tu comprobante de pago no es válido, inscripción al campeonato " + this.campeonato + " denegada! Por favor, verifica que tu pago o documento sea válido e intenta enviar tu comprobante nuevamente.";
        this.cuerpoCorreo.mensajeHtml = `
          <body>
            <div style="color:rgb(144,221,240); text-align: center;">
              <img width="100%" height="100%" src="../../Inicio/aname-footer.png"/>
            </div>
            <br>
            <p style="color:rgb(44, 102, 110); font-family: Arial; font-size:12px; line-height: 1em;">
              El presente correo es para informar el siguiente comunicado: <br>  
            </p>
            <p style="color:rgb(44, 102, 110); font-family: Arial; font-size:12px; line-height: 1em;" > `+
          this.cuerpoCorreo.cuerpo +
          `
            </p>
            <p style="font-family: Arial; font-size:12px; line-height: 1em;">
              <b>Gracias por la atención</b><br>
              <b>Saludos cordiales,</b> <br><br>
            </p>
            <img src="../../Inicio/Aletismo.jpg" width="100%" height="100%"/>
          </body>
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
          this.enviarCorreo(true).then(() => { this.$emit('cambioEstado', true) });
        },
        reject: async () => {
          await eliminarDocumentoSocioFachada(this.documentosUsuarios[0].id);
          this.enviarCorreo(false).then(() => { 
            this.$emit('cambioEstado', false);
            this.$emit('competidor', this.documentosUsuarios[0].id);
           });
          
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
    console.log(this.documentos)
    this.documentosUsuarios = this.docs;
  },
};
</script>
<style></style>