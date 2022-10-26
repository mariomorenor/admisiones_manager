<template>
  <div class="home">
    <b-tabs position="is-centered">
      <b-tab-item label="Laboratorio 1">
          <div class="columns">
            <div class="column is-4">
              <div class="card">
                <div class="card-content">
                  <b-field label="Nombre" label-position="on-border">
                    <b-input></b-input>
                  </b-field>
                  <b-field label="IP" label-position="on-border">
                    <b-input></b-input>
                  </b-field>
                  <div class="is-flex is-justify-content-space-between">
                    <div>
                      <b-tooltip label="Abrir Admisiones">
                        <b-button size="is-small"  icon-left="external-link-alt"></b-button>
                      </b-tooltip>
                      <b-tooltip label="Cerrar Admisiones">
                        <b-button size="is-small" class="mx-1" icon-left="external-link-alt"></b-button>
                      </b-tooltip>
                    </div>
                    <div>
                      <b-tag type="is-success"><fa-icon icon="signal"></fa-icon></b-tag>
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
export default {
  name: 'HomeView',
}
</script>
