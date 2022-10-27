<template>
  <div class="home">
    <b-tabs>
      <b-tab-item v-for="laboratory in labs" :key="laboratory.id" position="is-centered" :label="laboratory.name">
        <div class="columns">
          <div class="column is-4" v-for="client in clients" :key="client.id">
            <div class="card" v-if="client.lab == laboratory.num">
              <div class="card-content">
                <b-field label="Nombre" label-position="on-border">
                  <b-input readonly v-model="client.name"></b-input>
                </b-field>
                <b-field label="IP" label-position="on-border">
                  <b-input readonly v-model="client.ip_address"></b-input>
                </b-field>
                <div class="is-flex is-justify-content-space-between">
                  <div>
                    <b-tooltip type="is-dark" label="Abrir Admisiones">
                      <b-button @click="open(client)" size="is-small" type="is-primary" icon-left="external-link-alt">
                      </b-button>
                    </b-tooltip>
                    <b-tooltip type="is-dark" label="Cerrar Admisiones">
                      <b-button @click="close(client)" size="is-small" class="mx-1" type="is-info"
                        icon-left="times-circle"></b-button>
                    </b-tooltip>
                    <b-tooltip type="is-dark" label="Apagar PC">
                      <b-button @click="powerOff(client)" size="is-small" class="" type="is-danger"
                        icon-left="power-off"></b-button>
                    </b-tooltip>
                  </div>
                  <div>
                    <b-tag :type="client.status ? 'is-success' : 'is-warning'">
                      <fa-icon icon="signal"></fa-icon>
                    </b-tag>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </b-tab-item>
    </b-tabs>
  </div>
</template>

<script>
import { ipcRenderer } from 'electron';

export default {
  name: 'HomeView',
  data() {
    return {
      clients: [],
      labs: []
    }
  },
  beforeMount() {
    for (let index = 1; index <= 7; index++) {
      this.labs.push({
        name: "Sála de Cómputo " + index,
        num: index
      })
    }

    ipcRenderer.invoke("clients").then(clients => {
      this.clients = clients
    })
    ipcRenderer.on("new-client", (event, data) => {

      if (this.clients.length == 0) {
        this.clients.push(data);
        return
      }

      if (this.clients.find(c => c.name != data.name)) {
        this.clients.push(data)
      }
    });

    ipcRenderer.on("remove-client", (event, data) => {
      this.clients = this.clients.filter(c => c.socket_id != data.socket_id)
    })
  },
  methods: {
    open(client) {
      client.status = true
      ipcRenderer.send("open-client-window", client)
    },
    close(client) {
      client.status = false
      ipcRenderer.send("close-client-window", client)
    },
    powerOff(client) {
      ipcRenderer.send("power-off", client)
    }
  },
  computed: {
    clients_lab_1() {
      return this.clients.filter(c => c.lab == 1)
    },
    clients_lab_2() {
      return this.clients.filter(c => c.lab == 2)
    },
    clients_lab_7() {
      return this.clients.filter(c => c.lab == 7)
    },
    clients_other() {
      return this.clients.filter(c => c.lab == null)
    }
  }
}
</script>
