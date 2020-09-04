<template>
  <div id="armor-pen">
    <md-toolbar class="md-dense">
      <h3 class="md-title">World Buffs</h3>
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
  created: async function () {
  },
  data: function () {
    return {
    }
  },
  methods: {
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
