<template>
  <div id="app">
    <menu-builder :value="tsdefault" @menu-changed="onMenuChange" v-contextmenu/>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import MenuBuilder from "./components/MenuBuilder.vue";
import { IContextMenu } from '../lib/ContextMenu';
import { install } from "../lib";

Vue.use(install);

let globalMenu: any;// IContextMenu;

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
    "style": {background: "yellow";},
    "action": () => console.log("Something"),
  },
  {
    text: "A submenu",
    submenu: {
      test1: () => console.log("Sub Test 1 action"),
      test2: () => console.log("Sub Test 2 action"),
      "sub-sub": {
        test3: () => console.log("Sub-Sub Test 3 action"),
      },
      "sub-sub2": [
        {
          text: "test4",
          action: () => console.log("Sub-submenu test(4)"),
        },
        {
          text: "sub-sub-submenu",
          submenu: {
            test5: () => console.log("Sub-sub-submenu test(5)"),
          },
        },
      ],
    },
  },
]
`,
    }
  },
  methods: {
    onMenuChange(ts: string, { rawObj }: { rawObj: any }) {
      globalMenu = rawObj;
      this.tsdefault = ts;
    },
    contextMenuItems(): any {
      return globalMenu;
    }
  },
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
.context-menu {
  max-width: 160px;
  max-height: 90vh;
  /*color: var(--text-blur);
  background: var(--ui-border);*/
  padding: 10px 0px;
  border-radius: 4px;
  box-shadow: 0px 2px 15px 0px #232323;
}

.context-item {
  padding: 10px;
  margin: 0;
  cursor: pointer;
}
</style>
