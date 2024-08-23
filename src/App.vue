<template>
  <div class="app">
    <NavBar></NavBar>
    <router-view></router-view>
    <Footer></Footer>
  </div>
</template>

<script>
import NavBar from './components/NavBar.vue';
import Footer from './components/Footer.vue'

export default {
  components: {
    NavBar,
    Footer
  }
}
</script>

<style>
  /* Button */
 .p-button{
    background: #2C666E;
    border: 1px solid #2C666E;
  }

  .p-button.p-button-outlined.p-button-secondary {
    color: white;
  }

  /* Dropdown */
  .p-dropdown	{
    color:#2C666E;
    border: 1px solid #2C666E;
  }

  .p-dropdown-panel .p-dropdown-items .p-dropdown-item.p-highlight {
    background: #90ddf0 !important;
    color: black !important;
  }

  .p-dropdown-panel .p-dropdown-items .p-dropdown-item.p-highlight.p-focus {
    background: #66c8e1 !important;
    color: black !important;
  }

  .p-dropdown:not(.p-disabled).p-focus {
    outline: 1px solid #2c666e; 
  }

  /* Datatable */
  .p-datatable {
    border: 1px solid black;
    border-radius: 10px; 
  }

  .p-datatable .p-datatable-thead > tr:first-child > th:first-child {
    border-top-left-radius: 10px;
  }

  .p-datatable .p-datatable-thead > tr:first-child > th:last-child {
    border-top-right-radius: 10px;
  }

  .p-datatable .p-datatable-thead > tr > th {
    background-color: #2c666e; 
    color: white; 
    padding: 10px; 
  }

  .p-datatable .p-datatable-tbody > tr > td {
    padding: 10px; /* Espaciado interno de las celdas del cuerpo */
    border-bottom: 1px solid #ffffff; /* Línea inferior de las celdas */
  }

  .p-datatable .p-datatable-tbody > tr:nth-child(even) {
    background-color: #a5e4f3; /* Color de fondo para filas pares */
  }

  .p-datatable .p-datatable-tbody > tr:nth-child(odd) {
    background-color: #b7e3ee; /* Color de fondo para filas impares */
  }

  .p-datatable .p-datatable-tbody > tr:hover {
    background-color: #6bbfd4; /* Color de fondo al pasar el mouse por encima de las filas */
  }

  .p-datatable .p-datatable-tbody > tr > td {
    color: #000000; /* Color del texto del cuerpo de la tabla */
  }

  .p-datatable .p-sortable-column .p-sortable-column-icon {
    color: #07393c;
  }

  .p-datatable .p-sortable-column.p-highlight .p-sortable-column-icon {
    color: #ffffff;
  }

  /* Checkbox */ 
  .p-checkbox.p-highlight .p-checkbox-box {
    background: black !important;
    border-color: black !important;
  }

  /* Paginator */
  .p-paginator {
    border-radius: 0px 0px 10px 10px;
  }

  .p-paginator .p-paginator-pages .p-paginator-page.p-highlight {
    background: #90ddf0;
    color: black;
  }

  /* Upload */
  .p-fileupload .p-fileupload-buttonbar {
    background: #2c666e;
    padding: 1.125rem;
    border: 1px solid #90ddf0;
    color: #334155;
    border-bottom: 0 none;
    border-top-right-radius: 6px;
    border-top-left-radius: 6px;
    gap: 0.5rem;
}

/* Menubar */
.p-menubar {
    padding: 0.5rem 0.5rem;
    background: #ffffff;
    color: #334155;
    border: 2px solid #000000;
    border-radius: 6px;
    margin-bottom: 0.5rem
  }


</style>
