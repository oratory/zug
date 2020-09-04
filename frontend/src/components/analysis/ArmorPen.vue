<template>
  <div id="armor-pen">
    <md-toolbar class="md-dense">
      <h3 class="md-title">Enemy Armor</h3>
    </md-toolbar>
    <div class="analysis-block">
      <canvas id="armorpen-chart"></canvas>
      <p><small>* Expose Armor is assumed to be only used with 5 combo points and with the Improved Expose Armor talent.
      <br>* Currently, only max ranks of Sunder Armor, Expose Armor, Faerie Fire and Curse of Recklessness are tracked.</small></p>
    </div>
  </div>
</template>

<script>
import Chart from 'chart.js'

export default {
  props: {
    report: Object,
    fightKey: Number
  },
  created: async function () {
    var reducedArmor = {}
    var targetDebuffs = {}

    const start = this.report.fights[this.fightKey].start_time
    const addDebuff = /^(applydebuff|applydebuffstack|refreshdebuff)$/
    const removeDebuff = /^(removedebuff)$/
    for (let debuff of this.report.fights[this.fightKey].debuffs) {
      let target = this.getTargetName(debuff.targetID, debuff.targetInstance)
      if (!targetDebuffs[target]) {
        reducedArmor[target] = {}
        targetDebuffs[target] = {
          sa: 0,
          iea: 0,
          ff: 0,
          cor: 0
        }
      }
      if (debuff.ability.guid==11597 && debuff.type.match(addDebuff)) {
        targetDebuffs[target].sa = Math.min(targetDebuffs[target].sa+1, 5)
      }
      else if (debuff.ability.guid==11597 && debuff.type.match(removeDebuff)) {
        targetDebuffs[target].sa = 0
      }
      else if (debuff.ability.guid==11198 && debuff.type.match(addDebuff)) {
        targetDebuffs[target].iea = 2550
      }
      else if (debuff.ability.guid==11198 && debuff.type.match(removeDebuff)) {
        targetDebuffs[target].iea = 0
      }
      else if (debuff.ability.guid==9907 && debuff.type.match(addDebuff)) {
        targetDebuffs[target].ff = 505
      }
      else if (debuff.ability.guid==9907 && debuff.type.match(removeDebuff)) {
        targetDebuffs[target].ff = 0
      }
      else if (debuff.ability.guid==11717 && debuff.type.match(addDebuff)) {
        targetDebuffs[target].cor = 640
      }
      else if (debuff.ability.guid==11717 && debuff.type.match(removeDebuff)) {
        targetDebuffs[target].cor = 0
      }
      else {
        continue
      }
      reducedArmor[target][debuff.timestamp - start] = Math.max(0, 450 * targetDebuffs[target].sa + targetDebuffs[target].iea + targetDebuffs[target].ff + targetDebuffs[target].cor)
    }

    for (let death of this.report.fights[this.fightKey].enemyDeaths) {
      let target = this.getTargetName(death.targetID, death.targetInstance)
      if (reducedArmor[target]) {
        let armorKeys = Object.keys(reducedArmor[target])
        let lastKey = armorKeys.pop()
        if (reducedArmor[target][lastKey] == 0) {
          delete reducedArmor[target][lastKey]
          reducedArmor[target][death.timestamp - start] = reducedArmor[target][armorKeys.pop()]
        }
      }
    }

    var colors = ['#3498DB', '#9B59B6', '#1ABC9C', '#27AE60', '#F1C40F', '#DC7633', '#E6B0AA', '#D7BDE2', '#A9CCE3', '#A3E4D7', '#F9E79F', '#F5CBA7', '#E5E7E9', '#E74C3C', '#FFFFFF']

    var fullArmor = 3731
    var datasets = []
    var targets = Object.keys(reducedArmor)
    var maxX = 0
    for (const target of targets) {
      var data = []
      for (const [time, pen] of Object.entries(reducedArmor[target])) {
        data.push({x: time/1000, y: fullArmor - pen})
      }
      if (data.length) {
        if (!target.match(/#/)) {
          data.unshift({x: 0, y: fullArmor})
        }
        datasets.push({label: target, steppedLine: true, borderColor: colors.shift(), fill: false, data: data})
        maxX = Math.max(maxX, data[data.length-1].x)
      }
    }
    this.$nextTick(() => {
      const ctx = document.getElementById('armorpen-chart')
      new Chart(ctx, {
        type: 'line',
        data: {
          datasets
        },
        options: {
          responsive: true,
          lineTension: 1,
          scales: {
            yAxes: [{
              ticks: {
                beginAtZero: true
              },
              scaleLabel: {
                display: true,
                labelString: 'Armor'
              },
            }],
            xAxes: [{
              type: 'linear',
              display: true,
              scaleLabel: {
                display: true,
                labelString: 'Time'
              },
              ticks: {
                source: 'auto',
                max: maxX,
                stepSize: maxX / 15,
                major: {
                  fontStyle: 'bold',
                  fontColor: '#FF0000'
                }
              }
            }]
          }
        },
      })
    })
  },
  data: function () {
    return {
      chartData: null
    }
  },
  methods: {
    getTargetName: function (targetID, instance) {
      if (this.report.raid[targetID]) return false
      if (instance) {
        instance = ' #' + instance
      }
      else {
        instance = ''
      }
      for (let t of this.report.enemies) {
        if (t.id === targetID) {
          return t.name + instance
        }
      }
      for (let t of this.report.enemyPets) {
        if (t.id === targetID) {
          return false
          // return t.name + instance
        }
      }
      for (let t of this.report.friendlyPets) {
        if (t.id === targetID) {
          return false
        }
      }

      // Skeram clones
      if (this.report.fights[this.fightKey].boss == 709) {
        return 'Clone' + instance
      }
      return 'Unknown' + instance
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
.chart {
  height: 350px;
  position: relative;  
}
p {
  margin: 8px 20px;
}
</style>
