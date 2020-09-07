<template>
  <div id="view-log">
    <div class="md-layout md-row" id="wcl-title">
      <h3 v-if="report.title">{{report.title}} - {{new Date(report.start).toLocaleString()}}</h3>
      <div class="md-layout-item">
        <md-button class="md-icon-button" id="refreshBtn" @click="refreshReport()" v-if="report.end + 3600000*4 > Date.now()">
          <md-icon>refresh</md-icon>
        </md-button>
        <md-field>
          <md-select v-model="fightKey" id="fightSelect" md-dense>
            <md-option :value="0">Select Encounter</md-option>
            <template v-for="fight in report.fights">
              <md-option v-if="fight.boss && !fight.kill" :value="fight.id" v-bind:key="fight.id">{{fight.name}} {{Math.round(fight.fightPercentage/100)}}% Wipe [ {{new Date((fight.end_time - fight.start_time)).toISOString().substr(14, 5).replace(/^0/, '')}} ]</md-option>
              <md-option v-else :value="fight.id" v-bind:key="fight.id">{{fight.name}} [ {{new Date((fight.end_time - fight.start_time)).toISOString().substr(14, 5).replace(/^0/, '')}} ]</md-option>
            </template>
          </md-select>
        </md-field>
      </div>
      <a :href="`https://classic.warcraftlogs.com/reports/${wcl}#fight=${this.fightKey+1}`" target="_blank" rel="noopener" >View on Warcraft Logs</a>
    </div>
    <div class="md-layout" v-if="report.fights" id="fight-select">
      <template v-for="fight in report.fights">
        <div v-if="fight.boss && fight.kill" class="md-layout-item" :key="fight.id" :class="{selected: fightKey === fight.id}" @click="fightKey = fight.id"><span>{{fight.name}}</span></div>
      </template>
    </div>
    <div id="analysis" v-if="fightKey && report.fights && report.fights[fightKey-1] && report.fights[fightKey-1].summary">
      <armor-pen :report="report" :fightKey="fightKey-1"></armor-pen>
      <ability-use :report="report" :fightKey="fightKey-1"></ability-use>
      <world-buffs :report="report" :fightKey="fightKey-1"></world-buffs>
    </div>
    <loading v-if="fightKey && (!report.fights[fightKey-1] || !report.fights[fightKey-1].summary)">Fetching data...</loading>
  </div>
</template>
<script>
import AbilityUse from '@/components/analysis/AbilityUse.vue'
import ArmorPen from '@/components/analysis/ArmorPen.vue'
import WorldBuffs from '@/components/analysis/WorldBuffs.vue'
import Loading from '@/components/Loading.vue'

export default {
  props: {
    wcl: String,
    encounter: Number
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
    if (this.encounter && this.report.fights[this.encounter - 1]) {
      this.fightKey = this.encounter
      this.loadFight()
    }
  },
  data: function () {
    return {
      report: {},
      fightKey: 0
    }
  },
  watch: {
  '$route.path' (to) {
      let m = to.match(/^\/(.*?)\/(\d+)$/)
      if (m && m[1] == this.wcl) {
        this.$nextTick(function () {
          this.fightKey = parseInt(m[2])
        })
      }
    },
    fightKey (to) {
      let pathTo = `/${this.wcl}/${to}`
      if (to && this.$router.history.current.path != pathTo) {
        this.$router.push(pathTo)
      }
      this.$nextTick(this.loadFight)
    }
  },
  methods: {
    loadFight: async function () {
      let id = this.fightKey - 1
      console.log(this.report.fights, id)
      if (this.fightKey && !this.report.fights[id].enemyDebuffs) {
        var f = await fetch(`${window.baseURL}/api/events?id=${this.wcl}&fight=${id}&type=damage`)
        this.$set(this.report.fights[id], 'damage', (await f.json()))
        f = await fetch(`${window.baseURL}/api/events?id=${this.wcl}&fight=${id}&type=enemyDebuffs`)
        this.$set(this.report.fights[id], 'enemyDebuffs', (await f.json()))
        f = await fetch(`${window.baseURL}/api/events?id=${this.wcl}&fight=${id}&type=enemySummons`)
        this.$set(this.report.fights[id], 'enemySummons', (await f.json()))
        f = await fetch(`${window.baseURL}/api/events?id=${this.wcl}&fight=${id}&type=enemyDeaths`)
        this.$set(this.report.fights[id], 'enemyDeaths', (await f.json()))
        f = await fetch(`${window.baseURL}/api/events?id=${this.wcl}&fight=${id}&type=casts`)
        this.$set(this.report.fights[id], 'casts', (await f.json()))
        f = await fetch(`${window.baseURL}/api/events?id=${this.wcl}&fight=${id}&type=summary`)
        this.$set(this.report.fights[id], 'summary', (await f.json()))
      }
    },
    refreshReport: async function () {
      var f = await fetch(`${window.baseURL}/api/report?id=${this.wcl}&refresh=${Date.now()}`)
      this.report = await f.json()
      this.loadFight()
    }
  },
  computed: {
    currentFightKey () {
      return this.fightKey + 1
    }
  }
}
</script>

<style lang="scss">
h3 {
  margin: 0 0 20px;
}
#wcl-title {
  align-items: center;
  margin-bottom: 10px;
  justify-content: space-between;
  h3 {
    margin: 0;
  }
  .md-layout-item {
    flex: 0.5;
    display: flex;
    align-items: flex-end;
  }
  a {
    font-size: 12px;
  }
  #refreshBtn {
    margin: 0 5px -8px;
  }
  .md-field {
    margin: 0;
    padding: 0;
    min-height: 0;
    .md-input {
      height: 20px;
      font-size: 14px;
      color: #DED;
      -webkit-text-fill-color: #DED;
    }
  }
}
#fight-select {
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
  background: #292929;
}
#fight-select > div.selected {
  border-color: #55AA55;
}
#fight-select > div:hover {
  background: #393939;
}
#analysis > div {
  margin-top: 40px;
  background: #303030;
}
#analysis .md-toolbar {
  background-color: #212121;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='504' height='420' viewBox='0 0 1080 900'%3E%3Cg fill-opacity='0.01'%3E%3Cpolygon fill='%23444' points='90 150 0 300 180 300'/%3E%3Cpolygon points='90 150 180 0 0 0'/%3E%3Cpolygon fill='%23AAA' points='270 150 360 0 180 0'/%3E%3Cpolygon fill='%23DDD' points='450 150 360 300 540 300'/%3E%3Cpolygon fill='%23999' points='450 150 540 0 360 0'/%3E%3Cpolygon points='630 150 540 300 720 300'/%3E%3Cpolygon fill='%23DDD' points='630 150 720 0 540 0'/%3E%3Cpolygon fill='%23444' points='810 150 720 300 900 300'/%3E%3Cpolygon fill='%23FFF' points='810 150 900 0 720 0'/%3E%3Cpolygon fill='%23DDD' points='990 150 900 300 1080 300'/%3E%3Cpolygon fill='%23444' points='990 150 1080 0 900 0'/%3E%3Cpolygon fill='%23DDD' points='90 450 0 600 180 600'/%3E%3Cpolygon points='90 450 180 300 0 300'/%3E%3Cpolygon fill='%23666' points='270 450 180 600 360 600'/%3E%3Cpolygon fill='%23AAA' points='270 450 360 300 180 300'/%3E%3Cpolygon fill='%23DDD' points='450 450 360 600 540 600'/%3E%3Cpolygon fill='%23999' points='450 450 540 300 360 300'/%3E%3Cpolygon fill='%23999' points='630 450 540 600 720 600'/%3E%3Cpolygon fill='%23FFF' points='630 450 720 300 540 300'/%3E%3Cpolygon points='810 450 720 600 900 600'/%3E%3Cpolygon fill='%23DDD' points='810 450 900 300 720 300'/%3E%3Cpolygon fill='%23AAA' points='990 450 900 600 1080 600'/%3E%3Cpolygon fill='%23444' points='990 450 1080 300 900 300'/%3E%3Cpolygon fill='%23222' points='90 750 0 900 180 900'/%3E%3Cpolygon points='270 750 180 900 360 900'/%3E%3Cpolygon fill='%23DDD' points='270 750 360 600 180 600'/%3E%3Cpolygon points='450 750 540 600 360 600'/%3E%3Cpolygon points='630 750 540 900 720 900'/%3E%3Cpolygon fill='%23444' points='630 750 720 600 540 600'/%3E%3Cpolygon fill='%23AAA' points='810 750 720 900 900 900'/%3E%3Cpolygon fill='%23666' points='810 750 900 600 720 600'/%3E%3Cpolygon fill='%23999' points='990 750 900 900 1080 900'/%3E%3Cpolygon fill='%23999' points='180 0 90 150 270 150'/%3E%3Cpolygon fill='%23444' points='360 0 270 150 450 150'/%3E%3Cpolygon fill='%23FFF' points='540 0 450 150 630 150'/%3E%3Cpolygon points='900 0 810 150 990 150'/%3E%3Cpolygon fill='%23222' points='0 300 -90 450 90 450'/%3E%3Cpolygon fill='%23FFF' points='0 300 90 150 -90 150'/%3E%3Cpolygon fill='%23FFF' points='180 300 90 450 270 450'/%3E%3Cpolygon fill='%23666' points='180 300 270 150 90 150'/%3E%3Cpolygon fill='%23222' points='360 300 270 450 450 450'/%3E%3Cpolygon fill='%23FFF' points='360 300 450 150 270 150'/%3E%3Cpolygon fill='%23444' points='540 300 450 450 630 450'/%3E%3Cpolygon fill='%23222' points='540 300 630 150 450 150'/%3E%3Cpolygon fill='%23AAA' points='720 300 630 450 810 450'/%3E%3Cpolygon fill='%23666' points='720 300 810 150 630 150'/%3E%3Cpolygon fill='%23FFF' points='900 300 810 450 990 450'/%3E%3Cpolygon fill='%23999' points='900 300 990 150 810 150'/%3E%3Cpolygon points='0 600 -90 750 90 750'/%3E%3Cpolygon fill='%23666' points='0 600 90 450 -90 450'/%3E%3Cpolygon fill='%23AAA' points='180 600 90 750 270 750'/%3E%3Cpolygon fill='%23444' points='180 600 270 450 90 450'/%3E%3Cpolygon fill='%23444' points='360 600 270 750 450 750'/%3E%3Cpolygon fill='%23999' points='360 600 450 450 270 450'/%3E%3Cpolygon fill='%23666' points='540 600 630 450 450 450'/%3E%3Cpolygon fill='%23222' points='720 600 630 750 810 750'/%3E%3Cpolygon fill='%23FFF' points='900 600 810 750 990 750'/%3E%3Cpolygon fill='%23222' points='900 600 990 450 810 450'/%3E%3Cpolygon fill='%23DDD' points='0 900 90 750 -90 750'/%3E%3Cpolygon fill='%23444' points='180 900 270 750 90 750'/%3E%3Cpolygon fill='%23FFF' points='360 900 450 750 270 750'/%3E%3Cpolygon fill='%23AAA' points='540 900 630 750 450 750'/%3E%3Cpolygon fill='%23FFF' points='720 900 810 750 630 750'/%3E%3Cpolygon fill='%23222' points='900 900 990 750 810 750'/%3E%3Cpolygon fill='%23222' points='1080 300 990 450 1170 450'/%3E%3Cpolygon fill='%23FFF' points='1080 300 1170 150 990 150'/%3E%3Cpolygon points='1080 600 990 750 1170 750'/%3E%3Cpolygon fill='%23666' points='1080 600 1170 450 990 450'/%3E%3Cpolygon fill='%23DDD' points='1080 900 1170 750 990 750'/%3E%3C/g%3E%3C/svg%3E");
}
</style>
