/*export*/ interface ContextMenuItemDeclaration {
  /** The action to perform on click */
  action?: () => void;
  /** If not defined, will use the default css class (usually `"context-menu-item"`).
   * Otherwise, must be either:
   * * A function which modifies the style of the element
   * * A css class to apply to the element. WILL NOT REMOVE EXISTING CLASSES!.
   * Default seperator uses this with the class `"context-menu-seperator"`
   */
  style?: ((el: HTMLDivElement) => void )| string;
  /*IS THIS REQUIRED? @see {@link ContextMenuItem#style}.
   * The same as style except for when the element is hovered over.
   */
  //XXX:hoverStyle?: ((el: HTMLDivElement) => void )| string;
  /**
   * A submenu which will be displayed to one side of the existing menu when activated.
   * Will be activated on hover (or click unless `action` is also specified).
   */
  submenu?: ContextMenuDeclaration;
  /**
   * The text to display in the entry
   */
  text?: string;
}

/*export*/ interface ContextMenuObjDeclaration {
  items: ContextMenuItemDeclaration[];
  /** If not defined, will use the default css class (usually `"context-menu"`).
   * Otherwise, must be either:
   * * A function which modifies the style of the element
   * * A css class to apply to the element. WILL NOT REMOVE EXISTING CLASSES!.
   */
  style?: ((el: HTMLDivElement) => void )| string;
}

/*export*/ type ContextMenuDeclaration = ContextMenuObjDeclaration | ContextMenuItemDeclaration[];

/*export function isMenuObj(menu: ContextMenuDeclaration): menu is ContextMenuObjDeclaration {
  return !(menu instanceof Array);
}
export function isMenuArray(menu: ContextMenuDeclaration): menu is ContextMenuItemDeclaration[] {
  return menu instanceof Array;
}*/
