import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";

import "./style.css";

import "@vue-flow/core/dist/style.css";
import "@vue-flow/core/dist/theme-default.css";

const app = createApp(App);

// 🔥 CREATE PINIA
const pinia = createPinia();

// 🔥 REGISTER PINIA BEFORE MOUNT
app.use(pinia);

app.mount("#app");
