<template>
  <div id="view-log">
    <div class="md-layout md-row" id="wcl-title">
      <h3 v-if="report.title">{{report.title}} - {{new Date(report.start).toLocaleString()}}</h3>
      <a :href="`https://classic.warcraftlogs.com/reports/${wcl}`" target="_blank" rel="noopener" >View on Warcraft Logs</a>
    </div>
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

    if (this.encounter && this.report.fights[this.encounter - 1] && this.report.fights[this.encounter - 1].boss && this.report.fights[this.encounter - 1].kill) {
      this.selectFight(this.encounter)
    }
  },
  data: function () {
    return {
      report: {},
      fightKey: -1
    }
  },
  watch: {
  '$route.path' (to) {
      let m = to.match(/^\/(.*?)\/(\d+)$/)
      console.log(m, this.encounter)
      if (m && m[1] == this.wcl) {
        this.$nextTick(function () {
          this.selectFight(parseInt(m[2]))
        })
      }
    }
  },
  methods: {
    selectFight: async function (id) {
      let to = `/${this.wcl}/${id}`
      if (this.$router.history.current.path != to) {
        this.$router.push(to)
      }
      this.fightKey = -1
      // force analysis to recreate and update
      this.$nextTick(async () => {
        this.fightKey = id - 1
        if (!this.report.fights[this.fightKey].enemyDebuffs) {
          var f = await fetch(`${window.baseURL}/api/events?id=${this.wcl}&fight=${this.fightKey}&type=damage`)
          this.$set(this.report.fights[this.fightKey], 'damage', (await f.json()))
          f = await fetch(`${window.baseURL}/api/events?id=${this.wcl}&fight=${this.fightKey}&type=enemyDebuffs`)
          this.$set(this.report.fights[this.fightKey], 'enemyDebuffs', (await f.json()))
          f = await fetch(`${window.baseURL}/api/events?id=${this.wcl}&fight=${this.fightKey}&type=enemySummons`)
          this.$set(this.report.fights[this.fightKey], 'enemySummons', (await f.json()))
          f = await fetch(`${window.baseURL}/api/events?id=${this.wcl}&fight=${this.fightKey}&type=enemyDeaths`)
          this.$set(this.report.fights[this.fightKey], 'enemyDeaths', (await f.json()))
          f = await fetch(`${window.baseURL}/api/events?id=${this.wcl}&fight=${this.fightKey}&type=casts`)
          this.$set(this.report.fights[this.fightKey], 'casts', (await f.json()))
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

<style lang="scss">
h3 {
  margin: 0 0 20px;
}
#wcl-title {
  h3 {
    flex: 1;
  }
  a {
    font-size: 12px;
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
