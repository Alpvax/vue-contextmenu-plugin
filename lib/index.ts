interface IContexMenuPluginOptions {
  defaultFuncName: string;
  mountOnVue: boolean;
  mountToElement?: HTMLElement;
}
interface IContextMenuBindingOptions {
  capture: boolean;
  once: boolean;
}
interface IContextMenuBindingModifiers {
  self: boolean;
  prevent: boolean;
  stop: boolean;
}
interface IContextMenuBuildArgs {
  event: ContextMenuEvent;
  menu: IContextMenu;
  targetVm: VueType;
  targetEl: HTMLElement;
  directiveModifiers: IContextMenuBindingModifiers;
}
type ContexMenuBuildBinding = (vm: VueType, args: any) => IContextMenu;
declare module "vue/types/vue" {
  interface Vue {
    $contextMenuRoot?: Vue;
    hideContextMenu: () => void;//??
  }
}
type ContextMenuListener = ((event: ContextMenuEvent) => void) & {
  options: IContextMenuBindingOptions;
}
type ContextMenuEvent = WindowEventMap["contextmenu"];

import { PluginFunction, VNode, default as VueType } from "vue";
import { DirectiveBinding } from "vue/types/options";
import { ContextMenuDeclaration, parseMenu, IContextMenu } from "./ContextMenu";
import { ContextMenuComponent } from "./components";//components/ContextMenu.vue";

let defaultOpts: IContexMenuPluginOptions = {
  defaultFuncName: "contextMenuItems",
  mountOnVue: true,
};

const bindings = new WeakMap<HTMLElement, ContextMenuListener>();

let install: PluginFunction<Partial<IContexMenuPluginOptions>> = function install(Vue, opts) {
  let options: IContexMenuPluginOptions = Object.assign({}, defaultOpts, opts);

  function bindEventListener(el: HTMLElement, binding: DirectiveBinding, vnode: VNode) {
    let build: ContexMenuBuildBinding;
    if (binding.value !== undefined) {
      let bindVal = binding.value;
      if (typeof bindVal === "function") {
        build = (vm, args) => parseMenu(bindVal(vm, args));
      } else {
        let menu: IContextMenu = parseMenu(bindVal);
        build = (vm, args) => menu;
        //Vue.util.warn(`v-${binding.name}="${binding.expression}" expects either a function value or an iterable value. Recieved: ${build}`);
      }
    } else {
      build = (vm, args) => parseMenu(
        //@ts-ignore
        vm[options.defaultFuncName](vm, args)
      );
    }
    let listener = makeShowMenuHandler(vnode, build, {
      self: !!binding.modifiers.self,
      prevent: !binding.modifiers.noprevent,
      stop: !!binding.modifiers.stop,
    }, Object.freeze({
      capture: !!binding.modifiers.capture,
      once: !!binding.modifiers.once
    }));
    if (bindings.has(el)) {
      unbindEventListener(el, binding);
    }
    bindings.set(el, listener);
    el.addEventListener("contextmenu", listener, listener.options);
  }

  function unbindEventListener(el: HTMLElement, binding: DirectiveBinding) {
    let listener = bindings.get(el);
    if (listener) {
      el.removeEventListener("contextmenu", listener, listener.options);
    }
  }

  function makeShowMenuHandler(vnode: VNode, build: ContexMenuBuildBinding, modifiers: IContextMenuBindingModifiers, listenerOpts: IContextMenuBindingOptions): ContextMenuListener {
    return Object.assign(function(event: ContextMenuEvent) {
      if (modifiers.self && event.target !== event.currentTarget){
        return;
      }
      if (contextMenuRoot.$data.menu) {
        contextMenuRoot.$data.pos = { x: event.x, y: event.y };
      }
      if (modifiers.prevent) {
        event.preventDefault();
      }
      if (modifiers.stop) {
        event.stopPropagation();
      }
      let targetEl = event.target! as HTMLElement;
      while (!targetEl.hasOwnProperty("__vue__")) {
        targetEl = targetEl.parentElement!;
      }
      let args = {
        event,
        menu: contextMenuRoot.$data.menu,
        //@ts-ignore
        targetVm: targetEl.__vue__,
        targetEl: event.target,
        directiveModifiers: modifiers
      };
      let menu = build(vnode.context!, args);
      if(menu) {
        (contextMenuRoot.$data.menu as IContextMenu).items.push(...menu.items);
      } else {
        console.warn("Context menu build function did not return a ContextMenu:", menu, "\nVNode:", vnode);
      }
    }, { options: listenerOpts});
  }

  const contextMenuRoot =
  new Vue({
    data: {
      menu: null,
      pos: {
        x: 0,
        y: 0,
      },
      show: false,
    },
    components: {
      ContextMenuComponent,
    },
    template: `<ContextMenu
      :menu="menu"
      :pos="pos"
      :show="show"
    />`
  });
  if (options.mountOnVue) {
    Vue.prototype.$contextMenuRoot = contextMenuRoot;
  }

  Vue.prototype.hideContextMenu = hideContextMenu;

  Vue.directive("contextmenu", {
    bind: bindEventListener,
    update(el, binding, vnode, oldVnode) {
      unbindEventListener(el, binding);
      bindEventListener(el, binding, vnode);
    },
    unbind: unbindEventListener
  });

  function hideContextMenu(): void {
    contextMenuRoot.$data.show = false;
  }

  // Mount root Vue instance on new div element added to body
  let mountTo = options.mountToElement || document.body.appendChild(document.createElement("div"))
  contextMenuRoot.$mount(mountTo);
  document.addEventListener("click", hideContextMenu, false);
}
