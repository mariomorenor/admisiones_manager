<template>
  <div class="home">
    <b-tabs>
      <b-tab-item v-for="laboratory in laboratories" :key="laboratory.id" position="is-centered"
        :label="laboratory.name">
        <div class="columns">
          <div class="column is-4" v-for="client in laboratory.clients" :key="client.id">
            <div class="card">
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

export default {
  name: 'HomeView',
  data() {
    return {
      laboratories: []
    }
  },
  beforeMount() {
    for (let index = 1; index <= 7; index++) {
      this.laboratories.push({
        name: "Sála de Cómputo " + index,
        num: index,
        clients: []
      })
    }
  },
  mounted() {
    this.$socket.emit("new-manager", null, (sockets) => {
      for (let index = 0; index < 7; index++) {
        this.laboratories[index].clients = sockets.filter(socket => socket.lab == (index + 1))
      }
    })
  },
  methods: {
    open(client) {
      client.status = true
      this.$socket.emit("open-window",client)
    },
    close(client) {
      client.status = false
      this.$socket.emit("close-window",client)
    },
    powerOff(client) {
      console.log(client);
    }
  },
  sockets: {
    newClient(socket) {
      const laboratory = this.laboratories.find(lab => lab.num == socket.lab)
      laboratory.clients.push(socket)
    },
    removeClient(socket) {
      const laboratory = this.laboratories.find(lab => lab.num == socket.lab)
      laboratory.clients = laboratory.clients.filter(client => client.name != socket.name)
    }
  }
}
</script>
