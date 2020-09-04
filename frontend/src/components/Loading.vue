<template>
  <div id="loading">
    <slot></slot>
    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="margin: auto; display: block;" width="200px" height="200px" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
      <circle cx="50" cy="50" r="0" fill="none" stroke="#55aa55" stroke-width="2">
        <animate attributeName="r" repeatCount="indefinite" dur="1.2987012987012987s" values="0;40" keyTimes="0;1" keySplines="0 0.2 0.8 1" calcMode="spline" begin="-0.6493506493506493s"></animate>
        <animate attributeName="opacity" repeatCount="indefinite" dur="1.2987012987012987s" values="1;0" keyTimes="0;1" keySplines="0.2 0 0.8 1" calcMode="spline" begin="-0.6493506493506493s"></animate>
      </circle>
      <circle cx="50" cy="50" r="0" fill="none" stroke="#ffee36" stroke-width="2">
        <animate attributeName="r" repeatCount="indefinite" dur="1.2987012987012987s" values="0;40" keyTimes="0;1" keySplines="0 0.2 0.8 1" calcMode="spline"></animate>
        <animate attributeName="opacity" repeatCount="indefinite" dur="1.2987012987012987s" values="1;0" keyTimes="0;1" keySplines="0.2 0 0.8 1" calcMode="spline"></animate>
      </circle>
    </svg>
  </div>
</template>

<style scoped>
#loading {
  text-align: center;
  margin: 30px;
}
</style>