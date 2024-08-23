import PrimeVue from 'primevue/config';
import 'primevue/resources/themes/aura-light-green/theme.css'
import 'primeicons/primeicons.css'
import 'primeflex/primeflex.css'
import { createApp } from 'vue'
import App from './App.vue'
import Menubar from 'primevue/menubar';
import Badge from 'primevue/badge';
import InputText from 'primevue/inputtext';
import Avatar from 'primevue/avatar';
import Ripple from 'primevue/ripple';
import TabMenu from 'primevue/tabmenu';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import Skeleton from 'primevue/skeleton';
import Card from 'primevue/card';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Row from 'primevue/row';
import Menu from 'primevue/menu';
import ProgressSpinner from 'primevue/progressspinner';
import Chart from 'primevue/chart';
import ColumnGroup from 'primevue/columngroup';
import Image from 'primevue/image';
import MultiSelect from 'primevue/multiselect';
import Password from 'primevue/password';
import Listbox from 'primevue/listbox';
import Dropdown from 'primevue/dropdown';
import Toast from 'primevue/toast';
import ConfirmPopup from 'primevue/confirmpopup';
import ConfirmDialog from 'primevue/confirmdialog';
import ConfirmationService from 'primevue/confirmationservice';
import Message from 'primevue/message';
import InputNumber from 'primevue/inputnumber';
import Checkbox from 'primevue/checkbox';
import ScrollPanel from 'primevue/scrollpanel';
import Panel from 'primevue/panel';
import Carousel from 'primevue/carousel';
import Tag from 'primevue/tag';
import router from './router'
import ToastService from 'primevue/toastservice';
import FileUpload from 'primevue/fileupload';
import ProgressBar from 'primevue/progressbar';
import FloatLabel from 'primevue/floatlabel';
import Fieldset  from 'primevue/fieldset';

import Accordion from 'primevue/accordion';
import AccordionTab from 'primevue/accordiontab';
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';

// import as directive
import BadgeDirective from 'primevue/badgedirective';
const app = createApp(App);

app.use(ToastService);
app.use(ConfirmationService);
app.component("Menubar",Menubar)
app.component("ConfirmDialog",ConfirmDialog)
app.component("Badge",Badge)
app.component("InputText",InputText)
app.component("Avatar",Avatar)
app.component("TabMenu",TabMenu)
app.component("InputNumber",InputNumber)

app.directive('ripple', Ripple);

app.component("DataTable",DataTable)
app.component("Column",Column)
app.component("ColumnGroup",ColumnGroup)
app.component("Row",Row)
// eslint-disable-next-line vue/no-reserved-component-names
app.component("Menu",Menu)
app.component("Button",Button)
app.component("Dialog",Dialog)
app.component("Skeleton",Skeleton)
app.component("Card",Card)
app.component("Image",Image)
app.component("MultiSelect",MultiSelect)
app.component("Listbox",Listbox)
app.component("Dropdown",Dropdown)
// eslint-disable-next-line vue/multi-word-component-names
app.component("Toast",Toast)
app.component("ConfirmPopup",ConfirmPopup)
app.component("Message",Message)
app.component("Password",Password)
app.component("Checkbox",Checkbox)
app.component("ProgressSpinner",ProgressSpinner)

app.component("ScrollPanel",ScrollPanel)
app.component("Panel",Panel)
app.component("Carousel",Carousel)
app.component("Tag",Tag)
app.component("Chart",Chart)
app.component("FileUpload",FileUpload)
app.component("ProgressBar",ProgressBar)
app.component("FloatLabel",FloatLabel)
app.component("Fieldset",Fieldset)

app.component("Accordion",Accordion)
app.component("AccordionTab",AccordionTab)
app.component("IconField",IconField)
app.component("InputIcon",InputIcon)

app.directive('badge', BadgeDirective);

// eslint-disable-next-line vue/multi-word-component-names
app.use(router)
app.use(PrimeVue);
app.mount('#app')