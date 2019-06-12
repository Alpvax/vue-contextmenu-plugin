import { IContextMenu, ContextMenuDeclaration, CustomStyleDeclaration, parse as parseMenu } from "./ContextMenu";

export interface IContextMenuItemAction {
  (): void;
}

export interface IContextMenuItem {
  /** The action to perform on click */
  action?: IContextMenuItemAction;
  /** If not defined, will use the default css class (usually `"context-menu-item"`).
   * Otherwise, must be either:
   * * A function which modifies the style of the element, or returns a css class.
   * * A css class to apply to the element. WILL NOT REMOVE EXISTING CLASSES!.
   * Default seperator uses this with the class `"context-menu-seperator"`
   */
  style?: CustomStyleDeclaration;
  /**
   * A submenu which will be displayed to one side of the existing menu when activated.
   * Will be activated on hover (or click unless `action` is also specified).
   */
  submenu?: IContextMenu;
  /**
   * The text to display in the entry.
   * Can be an empty string to display nothing (used for separators).
   */
  text: string;
}

export type ContextMenuItemDeclarationValue = IContextMenuItem | Omit<IContextMenuItem, "text"> | IContextMenuItemAction | ContextMenuDeclaration;

function isAction(dec: ContextMenuItemDeclarationValue): dec is IContextMenuItemAction {
  return typeof dec === "function";
}

export function parse(declaration: ContextMenuItemDeclarationValue, textkey?: string): IContextMenuItem {
  if (textkey === undefined) {
    return declaration as IContextMenuItem;
  }
  let item: IContextMenuItem = { text: textkey };
  if (isAction(declaration)) {
    return Object.assign(item, { action: declaration });
  } else if (typeof declaration === "object") {
    let isItem = false;
    for (let prop of ["action", "submenu", "text"]) {
      if (declaration.hasOwnProperty(prop)) {
        return Object.assign(item, declaration);
      }
    }
    return Object.assign(item, parseMenu(declaration));
  }
  throw new TypeError("Unable to parse context menu item:\n" + JSON.stringify(declaration));
}
