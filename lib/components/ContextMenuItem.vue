<template>
  <div>
    <div
      class="context-item"
      ref="item"
      :style="style"
      @click.stop="handleAction"
    >
      {{item.text}}
    </div>
    <context-menu-component
      v-if="item.submenu"
      :menu="item.submenu"
      :pos="pos"
      :show="active"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { IContextMenuItem } from "../ContextMenu";
export default Vue.extend({
  data() {
    return {
      pos: {},
    }
  },
  props: {
    item: { type: Object as () => IContextMenuItem, required: true },
    active: { type: Boolean, default: false },
  },
  computed: {
    style(): Partial<CSSStyleDeclaration> {
      return this.item.style || {};
    },
  },
  methods: {
    handleAction(event: MouseEvent): void {
      if (this.item.action instanceof Function) {
        this.item.action();
      } else if (!this.item.submenu) {
        console.warn("Error activating non-submenu item:\n", this.item);
      }
    },
  },
  beforeUpdate() {
    if (this.item.submenu) {
      let { top } = (this.$refs.item as HTMLElement).getBoundingClientRect();
      let { width, top: ptop } = (this.$parent.$refs.menu as HTMLElement).getBoundingClientRect();
      this.pos = { x: width, y: top - ptop };
    }
  },
})
</script>
