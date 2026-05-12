import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ui from '@nuxt/ui/vue-plugin'

import App from './App.vue'
import { router } from './router'
import { i18n } from './i18n'

import './styles/main.css'

// Dark mode as default (matches React prototype)
if (typeof document !== 'undefined') {
  document.documentElement.classList.add('dark')
}

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(i18n)
app.use(ui)

app.mount('#app')
