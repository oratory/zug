<template>
  <div id="app">
    <link rel="stylesheet" href="//fonts.googleapis.com/css?family=Roboto:400,500,700,400italic|Material+Icons">
    <md-toolbar id="header">
      <h3 class="md-title"><router-link to="/">ZUG ZUG</router-link></h3>
      <h4>Work-In-Progress Log Analysis Tool for WoW Classic</h4>
    </md-toolbar>
    <router-view/>
  </div>
</template>

<style lang="scss">
:root {
  --md-theme-default-primary-on-background: #DED
}
body {
  overflow-y: scroll
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
#header a:hover {
  text-decoration: none;
  color: #CFC;
}
#header h4 {
  color: #666
}
</style>
