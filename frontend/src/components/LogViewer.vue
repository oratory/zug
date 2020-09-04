<template>
  <div id="view-log">
    <h3 v-if="report.title">{{report.title}} - {{new Date(report.start).toLocaleString()}}</h3>
    <div class="md-layout" v-if="report.fights" id="fight-select">
      <div class="md-layout-item" v-for="(fight, key) in bossFights" :key="key" :class="{selected: fightKey+1 === fight.id}" @click="selectFight(fight.id)"><span>{{fight.name}}</span></div>
    </div>
    <div id="analysis" v-if="fightKey >= 0 && report.fights[fightKey].summary">
      <armor-pen :report="report" :fightKey="fightKey"></armor-pen>
      <ability-use :report="report" :fightKey="fightKey"></ability-use>
      <world-buffs :report="report" :fightKey="fightKey"></world-buffs>
    </div>
    <loading  v-if="fightKey >= 0 && !report.fights[fightKey].summary">Fetching data...</loading>
  </div>
</template>

<script>
import AbilityUse from '@/components/analysis/AbilityUse.vue'
import ArmorPen from '@/components/analysis/ArmorPen.vue'
import WorldBuffs from '@/components/analysis/WorldBuffs.vue'
import Loading from '@/components/Loading.vue'

export default {
  props: {
    wcl: String
  },
  components: {
    AbilityUse,
    ArmorPen,
    WorldBuffs,
    Loading
  },
  created: async function () {
    var f = await fetch(`${window.baseURL}/api/report?id=${this.wcl}`)
    this.report = await f.json()
  },
  data: function () {
    return {
      report: {},
      fightKey: -1
    }
  },
  methods: {
    selectFight: async function (id) {
      this.fightKey = -1
      // force analysis to recreate and update
      this.$nextTick(async () => {
        this.fightKey = id - 1
        if (!this.report.fights[this.fightKey].summary) {
          var f = await fetch(`${window.baseURL}/api/events?id=${this.wcl}&fight=${this.fightKey}&type=damage`)
          this.$set(this.report.fights[this.fightKey], 'damage', (await f.json()))
          f = await fetch(`${window.baseURL}/api/events?id=${this.wcl}&fight=${this.fightKey}&type=debuffs`)
          this.$set(this.report.fights[this.fightKey], 'debuffs', (await f.json()))
          f = await fetch(`${window.baseURL}/api/events?id=${this.wcl}&fight=${this.fightKey}&type=summons`)
          this.$set(this.report.fights[this.fightKey], 'summons', (await f.json()))
          f = await fetch(`${window.baseURL}/api/events?id=${this.wcl}&fight=${this.fightKey}&type=enemyDeaths`)
          this.$set(this.report.fights[this.fightKey], 'enemyDeaths', (await f.json()))
          f = await fetch(`${window.baseURL}/api/events?id=${this.wcl}&fight=${this.fightKey}&type=summary`)
          this.$set(this.report.fights[this.fightKey], 'summary', (await f.json()))
        }
      })
    }
  },
  computed: {
    bossFights () {
      var bosses = []
      for (let f of this.report.fights) {
        if (f.boss && f.kill) {
          bosses.push(f)
        }
      }
      return bosses
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 0 0 20px;
}
#fight-select {
  justify-content: center;
  flex-wrap: wrap
}
#fight-select > div {
  max-width: 150px;
  min-width: 110px;
  text-align: center;
  border: 1px solid #555;
  border-radius: 4px;
  padding: 4px;
  margin: 2px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  cursor: pointer;
}
#fight-select > div.selected {
  border-color: #55AA55;
}
#fight-select > div:hover {
  background: #393939;
}
#analysis > div {
  margin: 40px 0;
}
</style>
