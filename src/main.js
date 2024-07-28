import './assets/main.css'
import 'bulma/css/bulma.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router, { authGuard } from './router'

const app = createApp(App)

app.use(createPinia())

authGuard()
app.use(router)

app.mount('#app')
