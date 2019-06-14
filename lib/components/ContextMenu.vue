<template>
  <div
    class="context-menu"
    v-show="show"
    :style="style"
    @click.stop="(e)=>e.stopPropagation()"
  >
    <context-menu-item v-for="(item, i) in menu.items" :key="i" v-bind:item="item"/>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
//import { ContextMenuDeclaration, ContextMenuItemDeclaration, isMenuObj } from "../types";
import { IContextMenu } from "../types";
import ContextMenuItem from "./ContextMenuItem.vue";

export default Vue.extend({
  props: {
    menu: { type: Object as () => IContextMenu, required: true },
    pos: { type: Object as () => { x: number, y: number/*, z?: number*/}, required: true },
    show: { type: Boolean, required: true },
  },
  computed: {
    /*items(): ContextMenuItemDeclaration[] {
      return isMenuObj(this.menu) ? this.menu.items : this.menu;
    },
    /*show(): boolean {
      return this.parent && this.parent.athis.items.length > 0;
    },*/
    style(): Partial<CSSStyleDeclaration> {
      const { offsetWidth, offsetHeight } = (this.$el as HTMLElement) || { offsetWidth: 0, offsetHeight: 0 };
      const [posX, posY] = [this.pos.x, this.pos.y];
      return {
        left:
          posX + offsetWidth < window.innerWidth
            ? `${posX}px`
            : `${posX - offsetWidth}px`,
        top:
          posY + offsetHeight < window.innerHeight
            ? `${posY}px`
            : `${posY - offsetHeight}px`,
        //"z-index": this.zlevel
      };
    },
    /*zlevel(): number {
      return this.pos.z !== undefined ? this.pos.z : 1;
    },*/
  },
});
</script>
