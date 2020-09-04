<template>
  <div id="ability-use">
    <md-toolbar class="md-dense">
      <h3 class="md-title">Ability Use</h3>
    </md-toolbar>
    <div class="analysis-block">
      <template v-if="downrankers">
        <h3>Higher rank abilities are available for training!</h3>
        <div class="md-layout" >
          <div v-for="(abilities, player, i) in downrankers" v-bind:key="player" class="playerDownrank">
            <p><strong>{{player}}</strong></p>
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

const lowRanks = {
  // --- WARRIOR
  // heroic strike
  78: 25286,
  284: 25286,
  285: 25286,
  1608: 25286,
  11564: 25286,
  11565: 25286,
  11566: 25286,
  11567: 25286,
  // battle shout
  6673: 25289,
  5242: 25289,
  6192: 25289,
  11549: 25289,
  11550: 25289,
  11551: 25289,
  // charge
  100: 11578,
  6178: 11578,
  // rend (but why?)
  772: 11574,
  6546: 11574,
  6547: 11574,
  6548: 11574,
  11572: 11574,
  11573: 11574,
  // thunderclap
  6343: 11581,
  8198: 11581,
  8204: 11581,
  8205: 11581,
  11580: 11581,
  // hamstring
  1715: 7373,
  7372: 7373,
  // sunder armor
  7386: 11597,
  7405: 11597,
  8380: 11597,
  11596: 11597,
  // overpower
  7384: 11585,
  7887: 11585,
  11584: 11585,
  // shield bash
  72: 1672,
  1671: 1672,
  // demo shout
  1160: 11556,
  6190: 11556,
  11554: 11556,
  11555: 11556,
  // revenge
  6572: 25288,
  6574: 25288,
  7379: 25288,
  11600: 25288,
  11601: 25288,
  // mocking blow
  694: 20560,
  7400: 20560,
  7402: 20560,
  20559: 20560,
  // cleave
  845: 20569,
  7369: 20569,
  11608: 20569,
  11609: 20569,
  // execute
  5308: 20662,
  20658: 20662,
  20660: 20662,
  20661: 20662,
  // intecept
  20252: 20617,
  20616: 20617,
  // slam
  1464: 11605,
  8820: 11605,
  11604: 11605,
  // pummel
  6552: 6554,
  // mortal strike
  12294: 21553,
  21551: 21553,
  21552: 21553,
  // bloodthirst
  23881: 23894,
  23892: 23894,
  23893: 23894,
  // shield slam
  23922: 23925,
  23923: 23925,
  23924: 23925
}

export default {
  props: {
    report: Object,
    fightKey: Number
  },
  created: async function () {
    var downranked = {}
    for (let cast of this.report.fights[this.fightKey].casts) {
      if (lowRanks[cast.ability.guid]) {
        downranked[this.getPlayerName(cast.sourceID)] = downranked[this.getPlayerName(cast.sourceID)] || {}
        downranked[this.getPlayerName(cast.sourceID)][cast.ability.guid] = 1
      }
    }
    this.downrankers = downranked
    this.$nextTick(() => {
      window.$WowheadPower.refreshLinks()
    })
  },
  data: function () {
    return {
      downrankers: null
    }
  },
  methods: {
    getPlayerName: function (playerID) {
      if (this.report.raid[playerID]) return this.report.raid[playerID].name
      return 'Unknown'
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
  padding: 20px;
}
.playerDownrank {
  max-width: 250px;
  min-width: 200px;
  padding: 10px 10px 0;
  background: #383838;
  border-radius: 4px;
  margin: 10px;
}
.playerDownrank ul {
  padding: 0;
  list-style-type: none;
}
.playerDownrank p {
  margin: 0;
}
</style>
