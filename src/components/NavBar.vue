<template>
  <Menubar :model="filteredItems">
    <template #start> </template>
    <template #item="{ item, props, hasSubmenu, root }">
      <a v-ripple class="flex align-items-center" v-bind="props.action">
        <span :class="item.icon" />
        <span class="ml-2">{{ item.label }}</span>
        <Badge v-if="item.badge" :class="{ 'ml-auto': !root, 'ml-2': root }" :value="item.badge" />
        <span v-if="item.shortcut" class="ml-auto border-1 surface-border border-round surface-100 text-xs p-1">{{
          item.shortcut }}</span>
        <i v-if="hasSubmenu" :class="[
          'pi pi-angle-down',
          { 'pi-angle-down ml-2': root, 'pi-angle-right ml-auto': !root },
        ]"></i>
      </a>
    </template>
    <template #end>
      <div class="flex align-items-center gap-2"></div>
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
              ],
              hasSubmenu: true,
              visible: true,
            },
            {
              label: "Campeonatos Reportes",
              icon: "pi pi-book",
              command: () => {
                router.push("/administracion/campeonatos/reportes");
              },
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
        {
          label: "Inicio",
          icon: "pi pi-home",
          command: () => {
            router.push("/");
          },
          visible: true, // Siempre visible
        },
        {
          label: "Registrarse",
          icon: "pi pi-pen-to-square",
          command: () => {
            router.push("/registro");
          },
          visible: true, // Visible solo si no hay un usuario
        },
        {
          label: "Socio",
          icon: "pi pi-pen-to-square",
          command: () => {
            router.push("/socio");
          },
          visible: false, // Inicializado como falso
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
          label: "Campeonatos Nacionales",
          icon: "pi pi-book",
          command: () => {
            router.push("/campeonatos-n");
          },
          visible: false,
        },
      ],
      user: null,
      admin: false, // Inicializado como falso
      adminN: false
    };
  },
  created() {
    const usuario = JSON.parse(localStorage.getItem('userdata'));

    if (usuario) {
      this.user = usuario;
      if (this.user.rol.id === 1) {
        this.admin = this.user.rol.id === 1;

        // Actualizar visibilidad de los ítems del menú
        this.items.forEach(item => {
          if (item.label === "Adm") {
            item.visible = this.admin;
          } else if (item.label === "Socio") {
            item.visible = !this.admin; // Ejemplo de ajuste según el rol
          } else if (item.label === "Campeonatos Nacionales") {
            item.visible = true;
          } else if (item.label === "Registrarse") {
            item.visible = false; // Ocultar el registro si el usuario está conectado
          } else if (item.label === "Cerrar sesión") {
            item.visible = true; // Ocultar el registro si el usuario está conectado
          }
        });

      } else if (this.user.rol.id === 6) {
        this.adminN = this.user.rol.id === 6;

        // Actualizar visibilidad de los ítems del menú
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
            item.visible = !this.adminN; // Ejemplo de ajuste según el rol
          } else if (item.label === "Campeonatos Nacionales") {
            item.visible = true;
          } else if (item.label === "Registrarse") {
            item.visible = false; // Ocultar el registro si el usuario está conectado
          } else if (item.label === "Cerrar sesión") {
            item.visible = true; // Ocultar el registro si el usuario está conectado
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



      this.items.unshift({
        label: "Cerrar sesión",
        icon: "pi pi-sign-out",
        command: () => {
          localStorage.setItem("userdata", null);
          router.push("/");
          setTimeout(() => {
            window.location.reload();
          }, 0);
        },
      });
    } else {
      this.items.forEach(item => {
        if (item.label === "Adm") {
          item.visible = false;
        } else if (item.label === "Cerrar sesión") {
          item.visible = false;
        }
      });
      this.items.unshift({
        label: "Iniciar sesión",
        icon: "pi pi-sign-in",
        command: () => router.push("/login")
      });
    }
  },
  computed: {
    filteredItems() {
      return this.items.filter(item => item.visible !== false);
    }
  },
  methods: {
    toggle() {
      this.$refs.menu.toggle();
    },
  },
};
</script>

<style lang=""></style>
