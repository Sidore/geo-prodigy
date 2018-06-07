<template>
  <div id="app">
    <router-view/>
    <notifications group="foo" position="bottom right"/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* text-align: center; */
  color: #2c3e50;
  background: #E0F2F1;
  /* margin-top: 20px; */
}

body, html {
  margin: 0; 
  padding: 0;
}
.vue-notification {
  padding: 10px;
  margin: 0 5px 5px;
 
  font-size: 24px;
  }
</style>
