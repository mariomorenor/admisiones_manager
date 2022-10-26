<template>
  <div class="home">
    <b-tabs position="is-centered">
      <b-tab-item label="Laboratorio 1">
        <div class="columns">
          <div class="column is-4" v-for="client in clients" :key="client.id">
            <div class="card">
              <div class="card-content">
                <b-field label="Nombre" label-position="on-border">
                  <b-input v-model="client.name"></b-input>
                </b-field>
                <b-field label="IP" label-position="on-border">
                  <b-input v-model="client.ip_address"></b-input>
                </b-field>
                <div class="is-flex is-justify-content-space-between">
                  <div>
                    <b-tooltip label="Abrir Admisiones">
                      <b-button size="is-small" icon-left="external-link-alt"></b-button>
                    </b-tooltip>
                    <b-tooltip label="Cerrar Admisiones">
                      <b-button size="is-small" class="mx-1" icon-left="times-circle"></b-button>
                    </b-tooltip>
                  </div>
                  <div>
                    <b-tag type="is-success">
                      <fa-icon icon="signal"></fa-icon>
                    </b-tag>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </b-tab-item>
      <b-tab-item label="Laboratorio 2"></b-tab-item>
    </b-tabs>
  </div>
</template>

<script>
import { ipcRenderer } from 'electron';

export default {
  name: 'HomeView',
  data() {
    return {
      clients: []
    }
  },
  beforeMount() {
    ipcRenderer.invoke("clients").then(clients => {
      console.log(clients);
      this.clients = clients
    })
    ipcRenderer.on("new-client", (event, data) => {
      this.clients.push(data)
    })
  }
}
</script>
