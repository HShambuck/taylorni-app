import { createApp } from 'vue';
import { createPinia } from 'pinia';
import './style.css';
import App from './App.vue';
import router from './router';
import "@fortawesome/fontawesome-free/css/all.min.css";
import { useUserStore } from "@/stores/auth";


const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);

// Initialize user store before mounting the app
const userStore = useUserStore();
userStore.initializeStore();

app.mount('#app')
