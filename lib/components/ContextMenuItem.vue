<template>
  <div
    class="context-item"
    :style="style"
    @click.stop="handleAction"
    @mouseover="hover"
    @mouseleave="hover"
  >
    {{item.text}}
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
//import { ContextMenuItemDeclaration } from '../types';
import { IContextMenuItem } from "../types";
export default Vue.extend({
  props: {
    item: { type: Object as () => IContextMenuItem, required: true },
  },
  methods: {
    handleAction(event: MouseEvent): void {
      if (this.item.action instanceof Function) {
        this.item.action();
      }
    },
    hover(event: MouseEvent): void {
      //TODO: Implement
      console.log("Activating item:", this.item.text);
    }
  },
})
</script>
