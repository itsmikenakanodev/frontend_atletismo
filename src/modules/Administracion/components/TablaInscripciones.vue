<template>

  <div class="card" v-if="usuarios">
    <Toast></Toast>
    <Dialog v-model:visible="documentosVisible" :modal="true" :style="{ width: '75vw' }">
      <TablaComprobanteInscrito :docs="documentosUsuarios" :correo="usuarioCorreo" :id="usuarioId"
        @cambioEstado="(val) => cambioEstado(val)" @competidor="(val) => eliminarCompetidor(val)"></TablaComprobanteInscrito>
    </Dialog>
    <DataTable :value="usuarios" tableStyle="min-width: 50rem" paginator :rows="5"
      :rowsPerPageOptions="[5, 10, 20, 50]">
      <Column field="nombres" header="Nombres" sortable></Column>
      <Column field="apellidos" header="Apellidos" sortable></Column>
      <Column field="ciudad" header="Provincia" sortable></Column>
      <Column field="email" header="Email" sortable></Column>
      <Column field="telefono" header="Telefono" sortable></Column>
      <Column header="Edad" field="fechaNacimiento" sortable>
        <template #body="slotProps">
          <span>{{ calcularFechaNacimiento(slotProps.data.fechaNacimiento) }}</span>
        </template>
      </Column>
      <Column field="sexo" header="Sexo" sortable></Column>
      <Column field="estadoRegistro" header="Estado">
        <template #body="slotProps">
          <Tag :severity=getSeverety(slotProps) :value=getValue(slotProps) rounded></Tag>
        </template>
      </Column>
      <Column field="documento" header="Documentos">
        <template #body="slotProps">
          <span class="p-buttonset">
            <Button label="Ver" icon="pi pi-eye" @click="verDocumentos(slotProps.data)" />

          </span>
        </template>
      </Column>
    </DataTable>
  </div>
  <!-- Usuarios posibles -->
  <div v-else>
    <DataTable :value="usuariosPosibles" tableStyle="min-width: 50rem" paginator :rows="5"
      :rowsPerPageOptions="[5, 10, 20, 50]">
      <Column field="nombres" header="Nombres" sortable>
        <template #body>
          <Skeleton></Skeleton>
        </template>
      </Column>
      <Column field="apellidos" header="Apellidos" sortable>
        <template #body>
          <Skeleton></Skeleton>
        </template>
      </Column>
      <Column field="ciudad" header="Provincia" sortable>
        <template #body>
          <Skeleton></Skeleton>
        </template>
      </Column>
      <Column field="email" header="Email" sortable>
        <template #body>
          <Skeleton></Skeleton>
        </template>
      </Column>
      <Column field="telefono" header="Telefono" sortable>
        <template #body>
          <Skeleton></Skeleton>
        </template>
      </Column>
      <Column header="Edad" field="fechaNacimiento" sortable>
        <template #body>
          <Skeleton></Skeleton>
        </template>
      </Column>
      <Column field="sexo" header="Sexo" sortable>
        <template #body>
          <Skeleton></Skeleton>
        </template>
      </Column>
      <Column field="estadoRegistro" header="Estado">
        <template #body>
          <Skeleton></Skeleton>
        </template>
      </Column>
      <Column field="documentos" header="Documentos">
        <template #body>
          <Skeleton></Skeleton>
        </template>
      </Column>
      <Column field="accion" header="Accion">
        <template #body>
          <Skeleton></Skeleton>
        </template>
      </Column>

    </DataTable>
  </div>
</template>


<script>
import { consultarInscripcionFachada, eliminarCompetidorFachada } from '../helpers/inscripciones';
import TablaComprobanteInscrito from './TablaComprobanteInscrito.vue';
export default {
  components: { TablaComprobanteInscrito },
  data() {
    return {
      usuariosPosibles: new Array(5),
      usuarios: null,
      usuarioId: null,
      documentosUsuarios: [],
      documentosVisible: false,
      usuarioCorreo: null,

    }
  },
  methods: {
    calcularFechaNacimiento(fechaNacimiento) {
      //calcular edad en base a fecha de nacimiento
      const fechaNacimientoFormateada = new Date(fechaNacimiento)
      const fechaActual = new Date()
      const edad = Math.round((fechaActual.getTime() - fechaNacimientoFormateada.getTime()) / (1000 * 3600 * 24 * 365))
      return edad

    },
    async cambioEstado(val) {
      if (val === true) {
        this.$toast.add({ severity: 'info', summary: 'Confirmado', detail: 'Aprobado', life: 3000 });
      }
      else {
        this.$toast.add({ severity: 'error', summary: 'Rechazado', detail: 'Denegado', life: 3000 });
      }
      /*this.usuarios = []
      this.documentosVisible = false
      await this.getUsuarios()*/
    },
    async eliminarCompetidor(val) {
      console.log("val de eliminar competidor",val);
      console.log(this.usuarios);
      const competidor = this.usuarios.find(usuario => usuario.documento.id == val);
      if(competidor){
        await eliminarCompetidorFachada(competidor.id);
        this.$toast.add({ severity:'success', summary: 'Eliminado', detail: 'Competidor eliminado', life: 3000 });
        this.usuarios = []
        this.documentosVisible = false
        await this.getUsuarios()
      }
    },
    verDocumentos(data) {
      this.documentosUsuarios = []
      this.documentosUsuarios.push(data.documento)
      this.documentosVisible = true
      this.usuarioCorreo = data.email
      this.usuarioId = data.id
    },
    async getUsuarios() {
      let tipoSus = {
        tipo: "Pendiente",
        estado: "Pendiente"
      };
      await consultarInscripcionFachada(tipoSus).then((response) => this.usuarios = response);
    },
    getValue(slotProps) { 
      if (slotProps.data.estadoRegistro === true) {
        return 'Confirmado';
      } else {
        return 'En Proceso';
      }
    },
    getSeverety(slotProps) {
      if (slotProps.data.estadoRegistro === true) {
        return 'success';
      } else {
        return 'danger';
      }
    },
  },
  mounted() {
    this.getUsuarios()
  },
}
</script>
<style lang="css">
.card {
  margin: 10px
}
</style>