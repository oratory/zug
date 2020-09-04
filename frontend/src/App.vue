<template>
  <div id="app">
    <link rel="stylesheet" href="//fonts.googleapis.com/css?family=Roboto:400,500,700,400italic|Material+Icons">
    <md-toolbar id="header">
      <div>
        <h3 class="md-title"><router-link to="/">ZUG ZUG</router-link></h3>
        <h4>*Work-In-Progress* Log Analysis Tool for WoW Classic</h4>
      </div>
    </md-toolbar>
    <router-view/>
  </div>
</template>

<style lang="scss">
:root {
  --md-theme-default-primary-on-background: #DED
}
body {
  overflow-y: scroll;
  background-color: #303030;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1600 900'%3E%3Cpolygon fill='%23aaaa55' points='957 450 539 900 1396 900'/%3E%3Cpolygon fill='%23bbbb66' points='957 450 872.9 900 1396 900'/%3E%3Cpolygon fill='%239daa51' points='-60 900 398 662 816 900'/%3E%3Cpolygon fill='%23adbb62' points='337 900 398 662 816 900'/%3E%3Cpolygon fill='%238eaa4f' points='1203 546 1552 900 876 900'/%3E%3Cpolygon fill='%239ebb61' points='1203 546 1552 900 1162 900'/%3E%3Cpolygon fill='%237daa4f' points='641 695 886 900 367 900'/%3E%3Cpolygon fill='%238ebb60' points='587 900 641 695 886 900'/%3E%3Cpolygon fill='%236baa51' points='1710 900 1401 632 1096 900'/%3E%3Cpolygon fill='%237bbb62' points='1710 900 1401 632 1365 900'/%3E%3Cpolygon fill='%2355aa55' points='1210 900 971 687 725 900'/%3E%3Cpolygon fill='%2366bb66' points='943 900 1210 900 971 687'/%3E%3C/svg%3E");
  background-attachment: fixed;
  background-size: cover;
  background-position: center center;
  padding-bottom: 40px;
}
#app {
  font-family: Roboto;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #DED;
}
#header {
  margin-bottom: 32px;
}
#header > *, #content {
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
</style>
