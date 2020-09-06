<template>
  <div id="main"> 
    <div id="wcl-input" v-if="!wcl">
      <md-field md-inline>
        <label>Enter Warcraft Logs ID or URL</label>
        <md-input v-model="wclInput"></md-input>
      </md-field>
    </div>
    <log-viewer v-else :wcl="wcl" :encounter="encounter"></log-viewer>
  </div>
</template>

<script>
import LogViewer from '@/components/LogViewer.vue'

export default {
  props: ['wcl', 'encounter'],
  components: {
    LogViewer
  },
  data: function () {
    return {
      wclInput: ''
    }
  },
  created: function () {
    var w = this.validateWCL()
    if (!w && this.wcl) {
      this.$router.push(`/`)
    }
    else if (document.querySelector('#wcl-input input')) {      
      this.$nextTick(() => {
        document.querySelector('#wcl-input input').focus()
      })
    }
  },
  watch: {
    wclInput: function (val) {
      var test = this.validateWCL(val)
      if (test) {
        this.$router.push(`/${test}`)
      }
    }
  },
  methods: {
    validateWCL: function (val) {
      if (!val) {
        val = this.wcl
      }
      if (!val) {
        return ''
      }
      else if (val.match(/^[a-zA-Z0-9]{16}$/)) {
        return val
      }
      var m = val.match(/^https:\/\/classic.warcraftlogs.com\/reports\/([a-zA-Z0-9]{16})(#|\/|$)/)
      if (m && m[1]) {
        return m[1]
      }
      return ''
    }
  }
}
</script>

<style lang="scss">
#wcl-input {
  margin-top: 20%;
  padding: 5px;
  background: #38383855;
  border-radius: 8px;
}
.md-field.md-theme-default:before {
  display:none
}
</style>