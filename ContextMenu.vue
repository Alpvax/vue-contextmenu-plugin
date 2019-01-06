<template>
  <div :class="classbindings" :id="menuid" v-show="show" ref="menu" :style="style" @click.stop="(e)=>e.stopPropagation()">
    <div v-for="(item, i) in items" :key="i" @click.stop="handleAction(item)" class="context-item">
      {{item.text}}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    "items": {type: Array, required: true},
    "pos": {type: Object, required: true},
    "menuid": {type: String, required: true},
    "parent": {type: Object, required: false},
    "customclass": {type: String, required: false}
  },
  methods: {
    handleAction(item) {
      if (item.isParent) {
        item.action();
      } else {
        item.action();
        this.hideContextMenu();
      }
    }
  },
  computed: {
    zlevel() {
      return this.parent ? this.parent.zlevel : 1;
    },
    classbindings() {
      return [this.$root.options.elementClass, this.customclass];
    },
    show() {
      return this.items.length > 0;
    },
    style() {
      const { offsetWidth, offsetHeight } = document.getElementById(
        "context-menu" + this.menuid
      ) || { offsetWidth: 0, offsetHeight: 0 };
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
        "z-index": this.zlevel,
        position: "absolute"
      };
    }
  }
};
</script>

<style scoped>
/*.context-menu {
  position: absolute;
  /*color: var(--text-blur);
  background: var(--ui-border);*/
div {
  max-width: 160px;
  max-height: 90vh;
  padding: 10px 0px;
  border-radius: 4px;
  box-shadow: 0px 2px 15px 0px #232323;
}

/*.context-item {*/
div div {
  padding: 10px;
  margin: 0;
  cursor: pointer;
}

/*.context-item:*/
div div:hover {
  background: var(--ui-dark);
}
</style>
