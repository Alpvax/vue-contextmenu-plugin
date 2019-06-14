<template>
  <div>
    <textarea id="tsinput" :value="value" @change="parseTs">
    </textarea>
    <textarea id="jsout" :value="jsval">
    </textarea>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import typescript from "typescript";
import * as CMType from "../../lib/types";

export default Vue.extend({
  name: "MenuBuilder",
  props: {
    value: { type: String, default: "{}" },
  },
  data() {
    return {
      jsval: "",
    }
  },
  methods: {
    parseTs(event: Event) {
      let js = typescript.transpile("(" + (event.target as HTMLTextAreaElement).value + ")");
      this.jsval = JSON.stringify(CMType.parseMenu(eval(js)));
    }
  },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
div {
  height: 600px;
  width: 80%;
}
textarea {
  width: 45%;
  height: 90%;
}
</style>
