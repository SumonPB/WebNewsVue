import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router' 
import { createPinia } from 'pinia'
import 'vuetify/styles'                // estilos globales
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css'

const pinia = createPinia();
const vuetify = createVuetify({
  components,
  directives,
})
createApp(App).use(vuetify).use(pinia).use(router).mount('#app')
