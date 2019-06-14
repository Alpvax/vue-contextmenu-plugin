<template>
  <div id="app">
    <menu-builder :value="tsdefault"/>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import MenuBuilder from "./components/MenuBuilder.vue";

export default Vue.extend({
  name: 'app',
  components: {
    MenuBuilder
  },
  data() {
    return {
      tsdefault:
`[
  {
    "text": "What is this?",
    "action": () => console.log("Something"),
  },
  {
    text: "A submenu",
    submenu: {
      test1: () => console.log("Test 1 action"),
      test2: () => console.log("Test 2 action"),
    }
  },
]
`}
  }
});
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
