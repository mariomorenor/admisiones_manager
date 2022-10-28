import Vue from "vue";
import "./plugins/fontawesome";
import App from "./App.vue";
import router from "./router";
import Buefy from "buefy";
import "buefy/dist/buefy.css";
import VueSocketIO from "vue-socket.io";
import { io } from "socket.io-client";

import Store from "electron-store";

const store = new Store();

const server = store.get("server");

Vue.use(
  new VueSocketIO({
    debug: true,
    connection: io(`http://${server.hostname}:${server.port}`),
    vuex: {
      actionPrefix: "SOCKET_",
      mutationPrefix: "SOCKET_",
    },
  })
);

Vue.use(Buefy, {
  defaultIconComponent: "fa-icon",
  defaultIconPack: "fas",
});

Vue.config.productionTip = false;

new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
