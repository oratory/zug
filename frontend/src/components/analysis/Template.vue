<template>
  <div id="armor-pen">
    <md-toolbar class="md-dense">
      <h3 class="md-title">Title</h3>
    </md-toolbar>
    <div class="analysis-block"></div>
  </div>
</template>

<script>

export default {
  props: {
    report: Object,
    fightKey: Number
  },
  mounted: async function () {
    this.process()
    Object.keys(this.$options.props).forEach(key => {
      this.$watch(key, this.process)
    })
  },
  data: function () {
    return {
    }
  },
  methods: {
    process: function () {
      // main processing for a given fight
    }
  }
}
</script>

<style scoped>
.analysis-block {
  min-height: 250px;
  border: 1px solid var(--md-theme-default-toolbarvariant, #212121);
  border-radius: 0 0 4px 4px;
  border-top: 0;
}
</style>
