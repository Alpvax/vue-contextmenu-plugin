import ContextMenu from "./ContextMenu";

export default {
  install(Vue, opts) {
    // Merge options argument into options defaults
    const options = opts; //TODO: {...optionsDefaults, ...opts };

    // Create plugin's root Vue instance
    const root = new Vue({
      data: { targets: options.data.targets },
      render: createElement => createElement(ContextMenu)
    });

    // Mount root Vue instance on new div element added to body
    root.$mount(document.body.appendChild(document.createElement("div")));

    function showMenuHandler(vm, buildFunc, bubble) {
      return function(event) {
        let pos = { x: event.x, y: event.y };
        let items = buildFunc(vm, {event, items: []});
        if (bubble) {
          let comp = vm.$parent;
          while (comp) {
            /*let e = comp.contextMenuItems(comp, items, event) || [];
            items = [].concat(items, e);*/
            console.log(comp); //XXX
            comp = comp.$parent;
          }
        }
        root.data.items = items;
        this.$nextTick(() => root.data.pos = pos);
      };
    }

    Vue.mixin({
      methods: {
        contextMenuItems(vm, menuitems, event) {
          return menuitems.map((v) => v.text).includes("WhoAmI?") ? [] : [{text: "WhoAmI?", call(){console.log(vm);}}];
        },
        hideContextMenu() {
          root.data.items = [];
        }
      }
    });
    Vue.directive("contextmenu", {
      bind(el, binding, vnode) {
        let build = binding.value;
        if (build) {
          if (typeof build !== "function") { // If not a function,
            if (typeof build[Symbol.iterator] === "function") { // Is it iterable?
              build = (vm, args) => [].concat(build);
            } else {
              Vue.util.warn(`v-${binding.name}="${binding.expression}" expects either a function value or an iterable value. Recieved: ${build}`);
            }
          }
        }
        let bubble = !binding.modifiers.stop;
        el.addEventListener("contextmenu", showMenuHandler(vnode, build, bubble), false);
      }
    });
  }
};
