import { createApp } from 'vue'
import App from './App.vue'
import style from './style.css'
import router from './route'

createApp(App).use(router).use(style).mount('#app')
