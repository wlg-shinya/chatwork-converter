import { createApp } from "vue";
import App from "./App.vue";

// axios
import axios from "axios";
axios.defaults.baseURL = `${import.meta.env.VITE_BASE_URL}:${import.meta.env.VITE_BACKEND_PORT}`;

// bootstrap
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";

// fort awesome
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
library.add(fas);
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

// vue3-notification
import Notifications from "@kyvg/vue3-notification";

// router
import router from "./router";

createApp(App).use(router).use(Notifications).component("fa", FontAwesomeIcon).mount("#app");
