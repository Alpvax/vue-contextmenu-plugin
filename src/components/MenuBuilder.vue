<template>
  <div>
    <textarea ref="tsinput" :value="value" @change="parseTs">
    </textarea>
    <textarea ref="jsout" :value="jsval">
    </textarea>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import typescript from "typescript";
import * as CMType from "../../lib/ContextMenu";

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
      let ts = (event.target as HTMLTextAreaElement).value;
      let js = typescript.transpile("(" + ts + ")");
      let rawObj = eval(js);
      let menu = CMType.parseMenu(rawObj);
      this.$emit("menu-changed", ts, { js, rawObj, menu });
      this.jsval = JSON.stringify(menu, (name, value) => name === "action" ? value.toString() : value, 2);
    }
  },
  mounted() {
    (this.$refs.tsinput as Element).dispatchEvent(new Event("change"));
  }
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
