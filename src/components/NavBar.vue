<template>
  <Menubar :model="filteredItems">
    <template #start>
      <!-- Mantener el espacio para otros elementos si es necesario -->
    </template>

    <template #end>
      <div class="session-button-container">
        <button 
          class="session-button"
          @click="handleSessionAction"
        >
          <i :class="sessionButtonIcon"></i>
          <span>{{ sessionButtonLabel }}</span>
        </button>
      </div>
    </template>
  </Menubar>
</template>

<script>
import router from "@/router";

export default {
  data() {
    return {
      items: [
        {
          label: "Inicio",
          icon: "pi pi-home",
          command: () => {
            router.push("/");
          },
          visible: true,
        },
        {
          label: "Registrarse",
          icon: "pi pi-pen-to-square",
          command: () => {
            router.push("/registro");
          },
          visible: true,
        },
        {
          label: "Socio",
          icon: "pi pi-pen-to-square",
          command: () => {
            router.push("/socio");
          },
          visible: false,
        },
        {
          label: "Atletas",
          icon: "pi pi-users",
          command: () => {
            router.push("/atletas");
          },
          visible: true,
        },
        {
          label: "Calendario de campeonatos",
          icon: "pi pi-calendar",
          command: () => {
            router.push("/calendarios");
          },
          visible: true,
        },
        {
          label: "Reportes de Campeonatos",
          icon: "pi pi-book",
          command: () => {
            router.push("/administracion/campeonatos/reportes");
          },
          visible: true,
        },
        {
          label: "Contáctanos",
          icon: "pi pi-envelope",
          command: () => {
            router.push("/contacto");
          },
          visible: false,
        },
        {
          label: "Adm",
          icon: "pi pi-crown",
          items: [
            {
              label: "Administrar",
              icon: "pi pi-user",
              items: [
                {
                  label: "Usuarios",
                  icon: "pi pi-user-plus",
                  command: () => {
                    router.push("/administracion/usuarios");
                  },
                  visible: true,
                },
                {
                  label: "Suscripciones",
                  icon: "pi pi-money-bill",
                  command: () => {
                    router.push("/administracion/suscripciones");
                  },
                  visible: true,
                },
                {
                  label: "Inscripciones",
                  icon: "pi pi-pencil",
                  command: () => {
                    router.push("/administracion/inscripciones");
                  },
                  visible: true,
                },
                {
                  label: "Correos de ayuda",
                  icon: "pi pi-envelope",
                  command: () => {
                    router.push("/administracion/correos-ayuda");
                  },
                  visible: true,
                },
              ],
              hasSubmenu: true,
              visible: true,
            },
            {
              label: "Crear Campeonato",
              icon: "pi pi-pen-to-square",
              command: () => {
                router.push("/registrarCampeonatos");
              },
              visible: true,
            },
            {
              label: "Asignar Pruebas a Campeonato",
              icon: "pi pi-pen-to-square",
              command: () => {
                router.push("/registrarCampeonatos/asignarPruebas");
              },
              visible: true,
            },
            {
              label: "Registrar nuevas pruebas",
              icon: "pi pi-pen-to-square",
              command: () => {
                router.push("/registrarPruebas");
              },
              visible: true,
            },
          ],
          visible: false,
        },
      ],
      user: null,
      admin: false,
      adminN: false,
      contac: false
    };
  },
  created() {
    const usuario = JSON.parse(localStorage.getItem('userdata'));

    if (usuario) {
      this.user = usuario;

      if (this.user.rol.id === 1) {
        this.admin = this.user.rol.id === 1;
        this.items.forEach(item => {
          if (item.label === "Adm") {
            item.visible = this.admin;
          } else if (item.label === "Socio") {
            item.visible = !this.admin;
          } else if (item.label === "Campeonatos Nacionales") {
            item.visible = true;
          } else if (item.label === "Registrarse") {
            item.visible = false;
          } else if (item.label === "Cerrar sesión") {
            item.visible = true;
          }
        });
      } else if (this.user.rol.id === 6) {
        this.adminN = this.user.rol.id === 6;
        this.items.forEach(item => {
          if (item.label === "Adm") {
            item.visible = this.adminN;
            item.items.forEach(item => {
              if (item.label === "Asignar Pruebas a Campeonato") {
                item.visible = !this.adminN;
              } else if (item.label === "Administrar") {
                item.visible = !this.adminN;
              }
            });
          } else if (item.label === "Socio") {
            item.visible = !this.adminN;
          } else if (item.label === "Campeonatos Nacionales") {
            item.visible = true;
          } else if (item.label === "Registrarse") {
            item.visible = false;
          } else if (item.label === "Cerrar sesión") {
            item.visible = true;
          }
        });
      } else if (this.user.rol.id === 5) {
        this.contac = true;
        this.items.forEach(item => {
        if (item.label === "Contáctanos") {
            item.visible = true;
        } else if (item.label === "Registrarse") {
            item.visible = false;
        }
    });
      } else {
        this.items.forEach(item => {
          if (item.label === "Adm") {
            item.visible = false;
          } else if (item.label === "Socio") {
            item.visible = true;
          } else if (item.label === "Campeonatos Nacionales") {
            item.visible = true;
          } else if (item.label === "Registrarse") {
            item.visible = false;
          } else if (item.label === "Cerrar sesión") {
            item.visible = true;
          }
        });
      }

      this.adminN = this.user.rol.id === 6;
      console.log("user ls ", this.user);
      console.log("admin ls ", this.admin);
    } else {
      this.contac = true;
      this.items.forEach(item => {
        if (item.label === "Contáctanos") {
          item.visible = this.contac;
        }
        if (item.label === "Adm") {
          item.visible = false;
        }
      });
    }
  },
  computed: {
    filteredItems() {
      return this.items.filter(item => item.visible !== false);
    },
    sessionButtonLabel() {
      return this.user ? 'Cerrar sesión' : 'Iniciar sesión';
    },
    sessionButtonIcon() {
      return this.user ? 'pi pi-sign-out' : 'pi pi-sign-in';
    }
  },
  methods: {
    handleSessionAction() {
      if (this.user) {
        localStorage.setItem("userdata", null);
        router.push("/");
        setTimeout(() => {
          window.location.reload();
        }, 0);
      } else {
        router.push("/login");
      }
    }
  }
};
</script>

<style scoped>
.session-button-container {
  margin-right: 1rem;
}

.session-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: 2px solid #2c666e;
  border-radius: 20px;
  background-color: transparent;
  color: #2c666e;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.session-button:hover {
  background-color: #2c666e;
  color: white;
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(44, 102, 110, 0.2);
}

.session-button i {
  font-size: 1rem;
}

:deep(.p-menuitem-link) {
  display: flex;
  align-items: center;
  padding: 0.75rem 1.25rem;
  color: inherit;
  cursor: pointer;
  text-decoration: none;
}

:deep(.p-menuitem-icon) {
  margin-right: 0.5rem;
}

:deep(.p-menuitem-text) {
  font-weight: normal;
}
</style>
