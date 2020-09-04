<template>
  <div id="armor-pen">
    <md-toolbar class="md-dense">
      <h3 class="md-title">Enemy Armor</h3>
    </md-toolbar>
    <div class="analysis-block">
      <canvas id="armorpen-chart"></canvas>
      <p><small>* Expose Armor is assumed to be only used with 5 combo points and with the Improved Expose Armor talent.
      <br>* Currently, only max ranks of Sunder Armor, Expose Armor, Faerie Fire and Curse of Recklessness are tracked.
      <br>* Currently, all targets have a fixed base armor of 3731.</small></p>
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
      if (!reducedArmor[target]) {
        reducedArmor[target] = {}
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

    for (let spawn of this.report.fights[this.fightKey].summons) {
      let target = this.getTargetName(spawn.targetID, spawn.targetInstance)
      if (reducedArmor[target]) {
        reducedArmor[target][spawn.timestamp - start] = 0
      }
    }

    var colors = ['#3498DB', '#9B59B6', '#1ABC9C', '#27AE60', '#DC7633', '#E6B0AA', '#D7BDE2', '#A9CCE3', '#A3E4D7', '#F9E79F', '#F5CBA7', '#E5E7E9', '#E74C3C', '#FFFFFF']

    var fullArmor = 3731
    var datasets = []
    var targets = Object.keys(reducedArmor)
    var maxX = 0
    for (const target of targets) {
      let data = []
      for (const [time, pen] of Object.entries(reducedArmor[target])) {
        data.push({x: time/1000, y: fullArmor - pen})
      }
      if (data.length) {
        if (!target.match(/#/)) {
          data.unshift({x: 0, y: fullArmor})
        }
        datasets.push({label: target, steppedLine: true, borderColor: colors.shift(), fill: false, data: data, yAxisID: 'y-axis-1'})
        maxX = Math.max(maxX, data[data.length-1].x)
      }
    }

    var mitigated = {}
    for (let dmg of this.report.fights[this.fightKey].damage) {
      let target = this.getTargetName(dmg.targetID, dmg.targetInstance)
      if (dmg.ability.type == 1 && dmg.mitigated && reducedArmor[target]) {
        if (!mitigated[dmg.timestamp - start] && reducedArmor[target] && dmg.mitigated) {
          let currentArmor = fullArmor - this.getCurrentArmorReduction(reducedArmor[target], dmg.timestamp - start)
          if (currentArmor==3731) console.log(reducedArmor[target])
          mitigated[dmg.timestamp - start] = (currentArmor / (currentArmor + 400 + 85 * (63 + 4.5 * (63 - 59)))) * 100          
        }
      }
    }
    let data = []
    for (const [time, mit] of Object.entries(mitigated)) {
      data.push({x: time/1000, y: mit})
    }
    datasets.push({label: 'Mitigated Damage %', borderColor: '#404840', backgroundColor: '#404840', fill: true, data: data, yAxisID: 'y-axis-2'})

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
              id: 'y-axis-1',
              ticks: {
                beginAtZero: true
              },
              scaleLabel: {
                display: true,
                labelString: 'Armor'
              },
            }, {
              id: 'y-axis-2',
							position: 'right',
              ticks: {
                beginAtZero: true
              },
              scaleLabel: {
                display: true,
                labelString: 'Mitigated Damage %'
              },
              gridLines: {
								drawOnChartArea: false,
							}
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
    },
    getCurrentArmorReduction: function (armor, time) {
      const values = Object.entries(armor)
      for (let i = 1; i < values.length; i++) {
        if (parseInt(values[i][0]) > time) {
          return values[i-1][1]
        }
      }
      return 0
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
