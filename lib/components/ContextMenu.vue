<template>
  <div
    class="context-menu"
    v-show="show"
    :style="style"
    ref="menu"
    @click.stop="(e)=>e.stopPropagation()"
    @mouseleave="active=-1"
  >
    <context-menu-item-component v-for="(item, i) in menu.items"
      :key="i"
      :item="item"
      :active="active==i"
      @mouseover.native="active=i"
      />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { IContextMenu } from "../ContextMenu";

export default Vue.extend({
  data() {
    return {
      active: -1,
    }
  },
  props: {
    menu: { type: Object as () => IContextMenu, required: true },
    pos: { type: Object as () => { x: number, y: number/*, z?: number*/}, required: true },
    show: { type: Boolean, required: true },
  },
  computed: {
    style(): Partial<CSSStyleDeclaration> {
      const { offsetWidth, offsetHeight } = (this.$el as HTMLElement) || { offsetWidth: 0, offsetHeight: 0 };
      const [posX, posY] = [this.pos.x, this.pos.y];
      return {
        position: "absolute",
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

<style>
.context-menu {
  position: absolute;
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
