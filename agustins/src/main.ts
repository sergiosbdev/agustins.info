import "./assets/main.css";

import { createApp } from "vue";

import App from "./App.vue";
import router from "./router";
import PrimeVue from "primevue/config";

import 'primevue/resources/themes/lara-light-indigo/theme.css'; 
import 'primevue/resources/primevue.min.css';                 
import 'primeicons/primeicons.css';                            

const app = createApp(App);

const components = import.meta.glob("./components/**/*.vue", { eager: true });

for (const path in components) {
  const componentModule = components[path];
  const component = (componentModule as any).default;

  const componentName =
    component.name ||
    path
      .split("/")
      .pop()!
      .replace(/\.\w+$/, "");

  if (componentName) {
    app.component(componentName, component);
  }
}

app.use(PrimeVue);
app.use(router);

app.mount("#app ");
