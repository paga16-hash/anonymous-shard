import App from './App.vue'
import { createApp } from 'vue'
import router from './router'
import { Dialog, Notify, Quasar } from 'quasar' // Import icon libraries
import '@quasar/extras/material-icons/material-icons.css' // Import Quasar css
import 'quasar/src/css/index.sass'

const app = createApp(App)
app.use(Quasar, {
  plugins: { Notify, Dialog }
})

app.use(router)
app.mount('#app')
