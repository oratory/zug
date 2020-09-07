<template>
  <div id="ability-use">
    <md-toolbar class="md-dense">
      <h3 class="md-title">Ability Use</h3>
    </md-toolbar>
    <div class="analysis-block">
      <template v-if="downrankers">
        <h3>Higher rank abilities are available for training!</h3>
        <div class="md-layout md-row"> 
          <div v-for="(abilities, playerID, i) in downrankers" v-bind:key="playerID" class="playerDownrank md-layout-item md-small-size-100">
            <p><strong :class="report.raid[playerID].type.toLowerCase()">{{report.raid[playerID].name}}</strong></p>
            <ul>
              <li v-for="(k, spell) in abilities" v-bind:key="i+'-'+spell" ><a :href="`https://classic.wowhead.com/spell=${spell}`">{{spell}}</a></li>
            </ul>
          </div>
        </div>
      </template>
      <p><small>* Currently, only warrior abilities are looked at.</small></p>
    </div>
  </div>
</template>

<script>

import lowRanks from './underRankedSkills'

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
      downrankers: null
    }
  },
  methods: {
    process: function () {
      var downranked = {}
      for (let cast of this.report.fights[this.fightKey].casts) {
        if (lowRanks[cast.ability.guid]) {
          downranked[cast.sourceID] = downranked[cast.sourceID] || {}
          downranked[cast.sourceID][cast.ability.guid] = 1
        }
      }
      this.downrankers = downranked
      this.$nextTick(() => {
        window.$WowheadPower.refreshLinks()
      })
    },
    getPlayerName: function (playerID) {
      if (this.report.raid[playerID]) return this.report.raid[playerID].name
      return 'Unknown'
    },
    getPlayerClass: function (playerID) {
      if (this.report.raid[playerID]) return this.report.raid[playerID].type.toLowerCase()
      return 'Unknown'
    }
  }
}
</script>

<style scoped lang="scss">
.analysis-block {
  min-height: 250px;
  border: 1px solid var(--md-theme-default-toolbarvariant, #212121);
  border-radius: 0 0 4px 4px;
  border-top: 0;
  padding: 20px;
}
.playerDownrank {
  padding: 10px 10px 0;
  background: #383838;
  border-radius: 4px;
  margin: 10px;
  @media (min-width: 1200px) {
    min-width: 211px;
    max-width: 211px;
    width: 211px;
  }
}
.playerDownrank ul {
  padding: 0;
  list-style-type: none;
}
.playerDownrank p {
  margin: 0;
}
</style>
