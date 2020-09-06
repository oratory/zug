<template>
  <div id="armor-pen">
    <md-toolbar class="md-dense">
      <h3 class="md-title">Enemy Armor</h3>
    </md-toolbar>
    <div class="analysis-block">
      <div id="armorpen-chart-container"><canvas id="armorpen-chart"></canvas></div>
      <div class="md-layout md-row">
        <div class="md-layout-item md-size-70 md-small-size-100">
          <template  v-for="(item, target) in armorGainsLosses">
            <div v-if="item.FF.on || item.CoR.on" v-bind:key="target" class="stats">
              <strong>Armor Debuffs on {{target}}</strong>
              <p class="cor"><a :href="`https://classic.wowhead.com/spell=${item.CoR.spellID}`">{{item.CoR.spellID}}</a> was active for <strong>{{Math.round(100*item.CoR.on/(item.CoR.on+item.CoR.off)) || 0}}%</strong> of physical attacks:
                <span v-if="item.CoR.on">This contributed to <strong>{{Math.round(item.CoR.contributed).toLocaleString()}}</strong> damage ({{Math.round(item.CoR.contributed/((item.time - item.firstDamage)/1000)).toLocaleString()}} DPS).</span>
                <span v-if="item.CoR.off">With 100% uptime this would have added <strong>{{Math.round(item.CoR.missed).toLocaleString()}}</strong> damage ({{Math.round(item.CoR.missed/((item.time - item.firstDamage)/1000)).toLocaleString()}} DPS).</span>
              </p>
              <p class="ff"><a :href="`https://classic.wowhead.com/spell=${item.FF.spellID}`">{{item.FF.spellID}}</a> was active for <strong>{{Math.round(100*item.FF.on/(item.FF.on+item.FF.off)) || 0}}%</strong> of physical attacks:
                <span v-if="item.FF.on">This contributed to <strong>{{Math.round(item.FF.contributed).toLocaleString()}}</strong> damage ({{Math.round(item.FF.contributed/((item.time - item.firstDamage)/1000)).toLocaleString()}} DPS).</span>
                <span v-if="item.FF.off">With 100% uptime this would have added <strong>{{Math.round(item.FF.missed).toLocaleString()}}</strong> damage ({{Math.round(item.FF.missed/((item.time - item.firstDamage)/1000)).toLocaleString()}} DPS).</span>
              </p>
              <p class="sa"><a :href="`https://classic.wowhead.com/spell=${item.SA.spellID}`">{{item.SA.spellID}}</a> x5 was active for <strong>{{Math.round(100*item.SA.on5/(item.SA.on5+item.SA.on+item.SA.off+item.EA.on)) || 0}}%</strong> of physical attacks:
                <span v-if="item.SA.contributed5">This contributed to <strong>{{Math.round(item.SA.contributed5).toLocaleString()}}</strong> damage ({{Math.round(item.SA.contributed5/((item.time - item.firstDamage)/1000)).toLocaleString()}} DPS).</span>
                <span v-else-if="item.SA.contributed">This contributed to <strong>{{Math.round(item.SA.contributed).toLocaleString()}}</strong> damage ({{Math.round(item.SA.contributed/((item.time - item.firstDamage)/1000)).toLocaleString()}} DPS).</span>
                <span v-if="item.SA.on">Less then 5 stacks were active for <strong>{{Math.round(100*item.SA.on/(item.SA.on5+item.SA.on+item.SA.off+item.EA.on)) || 0}}%</strong> of attacks, which could have added <strong>{{Math.round(item.SA.missed).toLocaleString()}}</strong> damage ({{Math.round(item.SA.missed/((item.time - item.firstDamage)/1000)).toLocaleString()}} DPS).</span>
                <span v-else-if="item.SA.off">With 100% uptime this would have added <strong>{{Math.round(item.SA.missed).toLocaleString()}}</strong> damage ({{Math.round(item.SA.missed/((item.time - item.firstDamage)/1000)).toLocaleString()}} DPS).</span>
              </p>
              <p class="ea"><a :href="`https://classic.wowhead.com/spell=${item.EA.spellID}`">{{item.EA.spellID}}</a> was active for <strong>{{Math.round(100*item.EA.on/(item.EA.on+item.EA.off)) || 0}}%</strong> of physical attacks:
                <span v-if="item.EA.on">This contributed to <strong>{{Math.round(item.EA.contributed).toLocaleString()}}</strong> damage ({{Math.round(item.EA.contributed/((item.time - item.firstDamage)/1000)).toLocaleString()}} DPS).</span>
                <span v-if="item.EA.off">With 100% uptime this would have added <strong>{{Math.round(item.EA.missed).toLocaleString()}}</strong> damage ({{Math.round(item.EA.missed/((item.time - item.firstDamage)/1000)).toLocaleString()}} DPS).</span>
              </p>
            </div>
          </template>
          <p><small>* Expose Armor is assumed to be only used with 5 combo points and with the Improved Expose Armor talent.
          <br>* Currently, only max ranks of Sunder Armor, Expose Armor, Faerie Fire and Curse of Recklessness are tracked.
          <br>* Skeram has an armor value of 3009, other AQ40 bosses have 3731. Other targets use their calculated values you see on the right.</small></p>
        </div>
        <div class="md-layout-item md-size-30 md-small-size-100">
          <md-card v-if="targetArmor">            
            <md-toolbar class="md-dense">
              <div class="md-toolbar-section-start">
                <h3 class="md-title">Calculated Armor Values</h3>
              </div>
              <div class="md-toolbar-section-end">
                <div class="tooltip-hotspot">
                  <md-icon>help_outline</md-icon>
                  <md-tooltip md-direction="top">Armor values as calculated within <strong>this encounter</strong> only.
                  <br>There are rounding errors, a small sample size and some (de)buffs not unaccounted for yet:
                  <br>So this won't always be 100% accurate but should be somewhat close.
                  <br>Fight Club user <strong>sockgirlx</strong> has worked out Skeram to 3009, and all other AQ40 bosses to 3731 armor.</md-tooltip>
                </div>
              </div>
            </md-toolbar>

            <md-card-content>
              <md-table>
                <md-table-row v-for="(armor, target) of targetArmor" v-bind:key="target">
                  <md-table-cell>{{target}}</md-table-cell>
                  <md-table-cell md-numeric>{{Math.round(armor).toLocaleString()}}</md-table-cell>
                </md-table-row>
              </md-table>
            </md-card-content>
          </md-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Chart from 'chart.js'
import baseArmor from './bossArmor'

export default {
  props: {
    report: Object,
    fightKey: Number
  },
  created: async function () {
    const start = this.report.fights[this.fightKey].start_time

    // track target negative armor values
    const addDebuff = /^(applydebuff|applydebuffstack|refreshdebuff)$/
    const removeDebuff = /^(removedebuff)$/
    var armorDebuffs = {}
    let sunderStacks = {}
    for (let debuff of this.report.fights[this.fightKey].enemyDebuffs) {
      let target = this.getTargetName(debuff.targetID, debuff.targetInstance)
      if (!armorDebuffs[target]) {
        armorDebuffs[target] = []
        sunderStacks[target] = []
      }
      if (debuff.ability.guid==11597 && debuff.type.match(addDebuff)) {
        sunderStacks[target] = Math.min(sunderStacks[target]+1, 5)
        armorDebuffs[target].push({type: 'SA', spell: debuff.ability.guid, stacks: sunderStacks[target], reduced: sunderStacks[target] * 450, time: debuff.timestamp - start })
      }
      else if (debuff.ability.guid==11597 && debuff.type.match(removeDebuff)) {
        sunderStacks[target] = 0
        armorDebuffs[target].push({type: 'SA', spell: debuff.ability.guid, stacks: 0, reduced: 0, time: debuff.timestamp - start })
      }
      else if (debuff.ability.guid==11198 && debuff.type.match(addDebuff)) {
        armorDebuffs[target].push({type: 'EA', spell: debuff.ability.guid, reduced: 2550, time: debuff.timestamp - start })
      }
      else if (debuff.ability.guid==11198 && debuff.type.match(removeDebuff)) {
        armorDebuffs[target].push({type: 'EA', spell: debuff.ability.guid, reduced: 0, time: debuff.timestamp - start })
      }
      else if (debuff.ability.guid==9907 && debuff.type.match(addDebuff)) {
        armorDebuffs[target].push({type: 'FF', spell: debuff.ability.guid, reduced: 505, time: debuff.timestamp - start })
      }
      else if (debuff.ability.guid==9907 && debuff.type.match(removeDebuff)) {
        armorDebuffs[target].push({type: 'FF', spell: debuff.ability.guid, reduced: 0, time: debuff.timestamp - start })
      }
      else if (debuff.ability.guid==11717 && debuff.type.match(addDebuff)) {
        armorDebuffs[target].push({type: 'CoR', spell: debuff.ability.guid, reduced: 640, time: debuff.timestamp - start })
      }
      else if (debuff.ability.guid==11717 && debuff.type.match(removeDebuff)) {
        armorDebuffs[target].push({type: 'CoR', spell: debuff.ability.guid, reduced: 0, time: debuff.timestamp - start })
      }
      else {
        continue
      }
    }

    // correctly end the target's data on death rather then reset it
    for (let death of this.report.fights[this.fightKey].enemyDeaths) {
      let target = this.getTargetName(death.targetID, death.targetInstance)
      if (armorDebuffs[target]) {
        var deathEvent = {reduced: this.getArmorReductionAtTime(armorDebuffs[target], death.timestamp - start), time: death.timestamp - start}
        for (let i = armorDebuffs[target].length - 1; i > 0; i--) {
          if (death.timestamp - start - 500 <= armorDebuffs[target][i].time) {
            armorDebuffs[target].pop()
          }
          else {
            armorDebuffs[target].push(deathEvent)
            break
          }
        }
      }
    }

    // account for newly spawned adds mid-fight
    for (let spawn of this.report.fights[this.fightKey].enemySummons) {
      let target = this.getTargetName(spawn.targetID, spawn.targetInstance)
      if (armorDebuffs[target]) {
        armorDebuffs[target].unshift({reduced: 0, time: spawn.timestamp - start })
      }
    }


    // calculate initial target armor values
    var targetArmor = {}
    for (let dmg of this.report.fights[this.fightKey].damage) {
      let target = this.getTargetName(dmg.targetID)
      if (target && dmg.ability.type == 1 && !dmg.tick && dmg.mitigated && dmg.unmitigatedAmount > 800) { // reduce rounding errors by setting a minimum value
        if (!targetArmor[target]) targetArmor[target] = []
        targetArmor[target].push(Math.round(this.calcArmor(dmg.mitigated / dmg.unmitigatedAmount)) + this.getArmorReductionAtTime(armorDebuffs[target], dmg.timestamp - start))
      }
    }
    // get median datapoint for each target
    for (let target of Object.keys(targetArmor)) {
      targetArmor[target].sort()
      let len = targetArmor[target].length
      let mid = Math.ceil(len / 2)
      targetArmor[target] = len % 2 == 0 ? (targetArmor[target][mid] + targetArmor[target][mid - 1]) / 2 : targetArmor[target][mid - 1]
    }
    this.targetArmor = targetArmor


    var colors = ['#3498DB', '#9B59B6', '#1ABC9C', '#27AE60', '#DC7633', '#E6B0AA', '#D7BDE2', '#A9CCE3', '#A3E4D7', '#F9E79F', '#F5CBA7', '#E5E7E9', '#E74C3C', '#FFFFFF']

    var datasets = []
    var maxX = 0
    // plot each target armor
    for (const target of Object.keys(armorDebuffs)) {
      var fullArmor = baseArmor[this.targetToGUID(target)] || this.targetArmor[target.replace(/\s#.*/, '')] || 3731
      var data = []
      var timePoints = []
      var tracker = {
        SA: {
          on: 0,
          on5: 0,
          contributed: 0,
          contributed5: 0,
          off: 0,
          off5: 0,
          missed: 0,
          spellID: 11597
        },
        EA: {
          on: 0,
          contributed: 0,
          off: 0,
          missed: 0,
          spellID: 11198,
          missedVsSa: 0,
          contributedVsSA: 0
        },
        FF: {
          on: 0,
          contributed: 0,
          off: 0,
          missed: 0,
          spellID: 9907
        },
        CoR: {
          on: 0,
          contributed: 0,
          off: 0,
          missed: 0,
          spellID: 11717
        }
      }
      let prevTime = 0
      for (let pen of armorDebuffs[target]) {
        timePoints.push(pen.time)
        tracker['SA'][pen.time] = tracker['SA'][prevTime] || 0
        tracker['EA'][pen.time] = tracker['EA'][prevTime] || 0
        tracker['FF'][pen.time] = tracker['FF'][prevTime] || 0
        tracker['CoR'][pen.time] = tracker['CoR'][prevTime] || 0
        if (pen.type) {
          tracker[pen.type][pen.time] = pen.reduced
        }
        prevTime = pen.time
      }
      timePoints = [...timePoints]
      var armorTime = {}
      for (let time of timePoints) {
        armorTime[time] = fullArmor - this.getArmorReductionAtTime(armorDebuffs[target], time)
        data.push({x: time/1000, y: Math.max(0, armorTime[time])})
      }
      if (data.length) {
        if (!target.match(/#/)) {
          data.unshift({x: 0, y: fullArmor})
        }
        datasets.push({label: target, steppedLine: true, borderColor: colors.shift(), fill: false, data: data, yAxisID: 'y-axis-1'})
        maxX = Math.max(maxX, data[data.length-1].x)
      }

      tracker.time = 0
      // one more pass and calculate actual damage gained or missed from each debuff
      for (let i = 0; i < timePoints.length; i++) {
        for (let dmg of this.report.fights[this.fightKey].damage) {
          while (timePoints[i+1] && dmg.timestamp - start >= timePoints[i+1]) {
            i++
          }
          tracker.time = timePoints[i]
          if (!tracker.firstDamage) {
            tracker.firstDamage = timePoints[i]
          }
          if (dmg.timestamp - start > tracker.time && dmg.ability.type == 1 && dmg.hitType == 1 && !dmg.tick && this.getTargetName(dmg.targetID, dmg.targetInstance) == target) {
            if (tracker['CoR'][timePoints[i]]) {
              tracker['CoR'].on++
              tracker['CoR'].contributed = tracker['CoR'].contributed + Math.max(0, dmg.amount - dmg.unmitigatedAmount * (1 - this.calcMitigation(armorTime[timePoints[i]] + 640)))
            }
            else {
              tracker['CoR'].off++
              tracker['CoR'].missed = tracker['CoR'].missed + Math.max(0, dmg.unmitigatedAmount * (1 - this.calcMitigation(armorTime[timePoints[i]] - 640)) - dmg.amount)
            }
            if (tracker['FF'][timePoints[i]]) {
              tracker['FF'].on++
              tracker['FF'].contributed = tracker['FF'].contributed + Math.max(0, dmg.amount - dmg.unmitigatedAmount * (1 - this.calcMitigation(armorTime[timePoints[i]] + 505)))
            }
            else {
              tracker['FF'].off++
              tracker['FF'].missed = tracker['FF'].missed + Math.max(0, dmg.unmitigatedAmount * (1 - this.calcMitigation(armorTime[timePoints[i]] - 505)) - dmg.amount)
            }
            if (tracker['EA'][timePoints[i]]) {
              tracker['EA'].on++
              tracker['EA'].contributed = tracker['EA'].contributed + Math.max(0, dmg.amount - dmg.unmitigatedAmount * (1 - this.calcMitigation(armorTime[timePoints[i]] + 2550)))
              tracker['EA'].contributedVsSA = tracker['EA'].contributedVsSA + Math.max(0, dmg.amount - dmg.unmitigatedAmount * (1 - this.calcMitigation(armorTime[timePoints[i]] + 2550))) - Math.max(0, dmg.unmitigatedAmount - dmg.amount * (1 - this.calcMitigation(armorTime[timePoints[i]] + 2250)))
            }
            else if (tracker['SA'][timePoints[i]]) {
              if (tracker['SA'][timePoints[i]] == 2250) {
                tracker['SA'].on5++
                tracker['SA'].contributed5 = tracker['SA'].contributed5 + Math.max(0, dmg.amount - dmg.unmitigatedAmount * (1 - this.calcMitigation(armorTime[timePoints[i]] + 2250)))
              }
              else {
                tracker['SA'].on++
                tracker['SA'].contributed = tracker['SA'].contributed + Math.max(0, dmg.amount - dmg.unmitigatedAmount * (1 - this.calcMitigation(armorTime[timePoints[i]] + tracker['SA'][timePoints[i]])))
                tracker['SA'].missed = tracker['SA'].missed + Math.max(0, dmg.unmitigatedAmount * (1 - this.calcMitigation(armorTime[timePoints[i]] - 2250)) - dmg.amount)
              }
              tracker['EA'].off++
              tracker['EA'].missed = tracker['EA'].missed + Math.max(0, dmg.unmitigatedAmount * (1 - this.calcMitigation(armorTime[timePoints[i]] - 2550)) - dmg.amount)
            }
            else {
              tracker['SA'].off++
              tracker['SA'].missed = tracker['SA'].missed + Math.max(0, dmg.unmitigatedAmount * (1 - this.calcMitigation(armorTime[timePoints[i]] - 2250)) - dmg.amount)
              tracker['EA'].off++
              tracker['EA'].missed = tracker['EA'].missed + Math.max(0, dmg.unmitigatedAmount * (1 - this.calcMitigation(armorTime[timePoints[i]] - 2550)) - dmg.amount)
            }
          }
        }
      }
      this.$set(this.armorGainsLosses, target, tracker)
    }

    this.$nextTick(() => {
      window.$WowheadPower.refreshLinks()
      const ctx = document.getElementById('armorpen-chart')
      new Chart(ctx, {
        type: 'line',
        data: {
          datasets
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
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
      chartData: null,
      targetArmor: null,
      armorGainsLosses: {}
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
    targetToGUID: function (targetName) {
      targetName = targetName.replace(/\s#.*/, '')
      for (let t of this.report.enemies) {
        if (t.name === targetName) {
          return t.guid
        }
      }
      for (let t of this.report.enemyPets) {
        if (t.name === targetName) {
          return t.guid
        }
      }
      return false
    },
    getArmorReductionAtTime: function (armor, time) {
      if (!armor) return 0
      var pen = {
        SA: 0,
        FF: 0,
        CoR: 0,
        EA: 0
      }
      for (let arm of armor) {
        if (time < arm.time) {
          return pen.SA + pen.FF + pen.CoR + pen.EA
        }
        else if (arm.type) {
          pen[arm.type] = arm.reduced
        }
      }
      return pen.SA + pen.FF + pen.CoR + pen.EA
    },
    calcMitigation: function (armor) {
      armor = Math.max(0, armor)
      return armor / (armor + 5882.5)
    },
    calcArmor: function (reduction) {
      return (-5882.5 * reduction) / (reduction - 1)
    }
  }
}
</script>

<style scoped lang="scss">
@media (min-width: 1200px) {
  #armorpen-chart-container {
    padding: 10px 20px;
  }
}
canvas, #armorpen-chart-container {
  min-height: 400px;
  height: 400px;
  max-height: 400px;
  width: 100%;
  position: relative;
}
.analysis-block {
  min-height: 250px;
  border: 1px solid var(--md-theme-default-toolbarvariant, #212121);
  border-radius: 0 0 4px 4px;
  border-top: 0;
  > .md-row {
    padding: 0 10px;
  }
  > .md-row > .md-layout-item {
    padding: 10px 10px 20px 10px;
  }
  
  .md-layout {
  }
  .md-card {
  }
  .md-card .md-title {
    font-size: 20px;
  }
}
.chart {
  height: 350px;
  position: relative;  
}
p {
  margin: 8px 20px;
}
.tooltip-hotspot {
  cursor: help
}
.stats {
  line-height: 22px;
  padding: 10px;
  background: #383838;
  border-radius: 4px;
  margin: 0 0 20px 0;

  span {
    display: block;
    margin-left: 20px;
  }
  p {
    margin-bottom: 20px;

    strong {
      color: #CFC;
    }
    :last-child {
      margin-bottom: 0;
    }
  }
  .cor a {
    color: #8787ED
  }
  .ff a {
    color: #FF7D0A
  }
  .sa a {
    color: #C79C6E
  }
  .ea a {
    color: #FFF569
  }
}
</style>
