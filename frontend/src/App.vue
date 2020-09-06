<template>
  <div id="app">
    <md-toolbar id="header">
      <div>
        <h3 class="md-title"><router-link to="/">ZUG ZUG</router-link></h3>
        <h4>*Work-In-Progress* Log Analysis Tool for WoW Classic</h4>
      </div>
    </md-toolbar>
    <div id="content">
      <router-view/>
    </div>
    <div id="footer" v-if="$router.history.current.path!='/'">
      Want to support the site? Contribute on <a href="https://github.com/oratory/zug" target="_blank" rel="noopener" aria-label="View source on GitHub">GitHub</a> or buy me a <a @click.prevent="$refs.coffee.submit()" href="#">coffee</a>.
      <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top" ref="coffee">
        <input type="hidden" name="cmd" value="_s-xclick" />
        <input type="hidden" name="hosted_button_id" value="YNWX7N2R7AE52" />
      </form>
    </div>
  </div>
</template>

<style lang="scss">
:root {
  --md-theme-default-primary-on-background: #DED
}

body {
  overflow-y: scroll;
  background-color: #292929;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1600 900'%3E%3Cpolygon fill='%23aaaa55' points='957 450 539 900 1396 900'/%3E%3Cpolygon fill='%23bbbb66' points='957 450 872.9 900 1396 900'/%3E%3Cpolygon fill='%239daa51' points='-60 900 398 662 816 900'/%3E%3Cpolygon fill='%23adbb62' points='337 900 398 662 816 900'/%3E%3Cpolygon fill='%238eaa4f' points='1203 546 1552 900 876 900'/%3E%3Cpolygon fill='%239ebb61' points='1203 546 1552 900 1162 900'/%3E%3Cpolygon fill='%237daa4f' points='641 695 886 900 367 900'/%3E%3Cpolygon fill='%238ebb60' points='587 900 641 695 886 900'/%3E%3Cpolygon fill='%236baa51' points='1710 900 1401 632 1096 900'/%3E%3Cpolygon fill='%237bbb62' points='1710 900 1401 632 1365 900'/%3E%3Cpolygon fill='%2355aa55' points='1210 900 971 687 725 900'/%3E%3Cpolygon fill='%2366bb66' points='943 900 1210 900 971 687'/%3E%3C/svg%3E");
  background-attachment: fixed;
  background-size: cover;
  background-position: center center;
}
#app {
  font-family: Roboto;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #DED;
  display: flex;
  flex-direction: column
}
#header {
  margin-bottom: 32px;
}
#header > *, #content, #footer {
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  text-align: left
}
#header > div > * {
  margin: 0
}
#header a:hover {
  text-decoration: none;
  color: #CFC;
}
#header h4 {
  color: #666
}
#content {
  margin-bottom: 40px;
}
#footer {
  border: 1px solid #212121;
  background: #303030;
  min-height: 40px;
  line-height: 40px;
  padding: 0 20px;
}
body .md-tooltip {
  height: auto;
  font-size: 12px;
  line-height: 20px;
  max-width: 95%;
  white-space: normal;
}
#footer a {
  text-decoration: underline;
}
.github-corner {z-index: 10; position: absolute; top: 0; border: 0; right: 0; display: block!important}
.github-corner:hover .octo-arm{animation:octocat-wave 560ms ease-in-out}
@keyframes octocat-wave{0%,100%{transform:rotate(0)}20%,60%{transform:rotate(-25deg)}40%,80%{transform:rotate(10deg)}}
@media (max-width:500px){
  .github-corner:hover .octo-arm{animation:none}.github-corner .octo-arm{animation:octocat-wave 560ms ease-in-out}
}
</style>
