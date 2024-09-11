import { createWebHashHistory, createRouter } from 'vue-router';

// Importa tus componentes existentes
import AdministrationView from '../modules/Administracion/pages/Administracion.vue';
import HomeView from '../modules/Inicio/pages/InicioPage.vue';
import RegistroPage from '../modules/Registro/pages/RegistroPage.vue';
import RecuperarContrasenia from '../modules/Recuperar/pages/RecuperarContraseniaPage.vue';
import NuevaContrsenia from '../modules/Recuperar/pages/CambioContrasenia.vue';
import suscripcionPage from '../modules/Socio/pages/suscripcionPage.vue';
import LoginPage from '../modules/Login/pages/LoginPage.vue';
import CampeonatosProvincialesView from '@/modules/Administracion/pages/CampeonatosProvinciales.vue';
import AdministrationSuscriptionView from '@/modules/Administracion/pages/AdmSuscripciones.vue';
import CampeonatosPage from '../modules/Campeonatos/pages/RegistroCampeonatosPage.vue';
import AsignarPruebasPage from '../modules/Campeonatos/pages/AsignarPruebasCampeonatosPage.vue';
import CampeonatosNacionales from '../modules/Campeonatos/pages/CampeonatosNacional.vue';
import RegistroPruebas from '../modules/Pruebas/pages/RegistroPruebasPage.vue';
import InscripcionCompetidores from '../modules/Campeonatos/pages/InscripcionCompetidores.vue';
import ReportesCampeonatos from '@/modules/Campeonatos/pages/ReportesCampeonatos.vue';
import AdministracionInscripcion from '../modules/Administracion/pages/AdmInscripciones.vue';

// Importa el nuevo componente para Atletas
import AtletasPage from '../modules/Atletas/pages/AtletasPage.vue';

const routes = [
  { path: '/administracion/usuarios', component: AdministrationView },
  { path: '/administracion/campeonatos/reportes', component: ReportesCampeonatos },
  { path: '/administracion/suscripciones', component: AdministrationSuscriptionView },
  { path: '/administracion/campeonatos-p', component: CampeonatosProvincialesView },
  { path: '/administracion/inscripciones', component: AdministracionInscripcion },

  { path: '/', component: HomeView },
  { path: '/registro', component: RegistroPage },
  { path: '/cambio-contrasenia/:correo', component: NuevaContrsenia },
  { path: '/recuperar', component: RecuperarContrasenia },
  { path: '/socio', component: suscripcionPage },
  { path: '/registrarCampeonatos', component: CampeonatosPage },
  { path: '/registrarCampeonatos/asignarPruebas', component: AsignarPruebasPage },
  { path: '/campeonatos-n', component: CampeonatosNacionales },
  { path: '/registrarPruebas', component: RegistroPruebas },
  { path: '/inscripcionCompetidores/:id', name: 'InscripcionCompetidores', component: InscripcionCompetidores },
  { path: '/login', component: LoginPage },
  { path: '/atletas', component: AtletasPage },
];

const router = createRouter({
  history: createWebHashHistory('./'),
  routes,
});

export default router;
