import ContextMenu from "./ContextMenu";

const options = {
  defaultFuncName: "contextMenuItems"
};

export default {
  install(Vue, opts) {
    // Merge options argument into options defaults
    Object.assign(options, opts);

    function hideContextMenu() {
      root.$data.items = [];
    }

    function bindEventListener(el, binding, vnode) {
      let build = binding.value;
      if (build !== undefined) {
        if (typeof build !== "function") { // If not a function,
          if (typeof build[Symbol.iterator] === "function") { // Is it iterable?
            build = (vm, args) => [].concat(build);
          } else {
            Vue.util.warn(`v-${binding.name}="${binding.expression}" expects either a function value or an iterable value. Recieved: ${build}`);
          }
        }
      } else {
        build = (vm, args) => vm[options.defaultFuncName](vm, args);
      }
      let modifiers = Object.freeze(Object.assign({}, binding.modifiers, {
        prevent: !binding.modifiers.noprevent
      }));
      let listener = showMenuHandler(vnode, build, modifiers);
      listener.opts = Object.freeze({
        capture: !!binding.modifiers.capture,
        once: !!binding.modifiers.once
      });
      el["vue-contextmenu-plugin-eventListener"] = listener;
      el.addEventListener("contextmenu", listener, listener.opts);
    }

    function unbindEventListener(el, binding) {
      let listener = el["vue-contextmenu-plugin-eventListener"];
      el.removeEventListener("contextmenu", listener, listener.options);
    }

    Vue.mixin({
      methods: {
        hideContextMenu
      }
    });
    Vue.directive("contextmenu", {
      bind: bindEventListener,
      update(el, binding, vnode, oldVnode) {
        if (vnode !== oldVnode) {
          unbindEventListener(el, binding, oldVnode);
          bindEventListener(el, binding, vnode);
        } else if (binding.value !== binding.oldValue) {
          unbindEventListener(el, binding, vnode);
          bindEventListener(el, binding, vnode);
        }
      },
      unbind: unbindEventListener
    });

    // Create plugin's root Vue instance
    const root = new Vue({
      data: {
        items: [],
        pos: {
          x: 0,
          y: 0
        }
      },
      components: {ContextMenu},
      template: `<ContextMenu
        :items="items"
        :pos="pos"
      />`
    });

    // Mount root Vue instance on new div element added to body
    root.$mount(document.body.appendChild(document.createElement("div")));
    document.addEventListener("click", hideContextMenu, false);

    let contextEvent;
    function showMenuHandler(vnode, buildFunc, modifiers) {
      return function(event) {
        if (modifiers.self && event.target !== event.currentTarget){
          return;
        }
        if (event !== contextEvent) {
          contextEvent = event;
          root.$data.pos = { x: event.x, y: event.y };
          root.$data.items = [];
          //console.log(root.$data);
        }
        if (modifiers.prevent) {
          event.preventDefault();
        }
        if (stop) {
          event.stopPropagation();
        }
        let targetEl = event.target;
        while (!targetEl.hasOwnProperty("__vue__")) {
          targetEl = targetEl.parentElement;
        }
        let args = {
          event,
          menuitems: root.$data.items,
          targetVm: targetEl.__vue__,
          targetEl: event.target,
          directiveModifiers: modifiers
        };
        let items = buildFunc(vnode.context, args);
        if(items && typeof items[Symbol.iterator] === "function") {
          root.$data.items.push(...items);
        } else {
          console.warn("Context menu build function did not return an iterable value:", items, "\nVNode:", vnode);
        }
      };
    }
  }
};
