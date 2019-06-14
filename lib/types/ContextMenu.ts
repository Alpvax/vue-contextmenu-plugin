import { IContextMenuItem, parseItem, ContextMenuItemDeclarationValue } from "./internal";

type ContextMenuItemsObjDeclaration = Omit<{
  [text: string]: ContextMenuItemDeclarationValue;
}, "items" | "style" | "text" | "action" | "submenu">;//keyof (IContextMenuDeclaration | IContextMenuItem)>;

type ContextMenuItemsDeclaration = ContextMenuItemsObjDeclaration | IContextMenuItem[];
export type CustomStyleDeclaration = string | ((el: HTMLDivElement) => string | void)

interface IContextMenuDeclaration {
  items: ContextMenuItemsDeclaration;
  style?: CustomStyleDeclaration;
}

export type ContextMenuDeclaration = ContextMenuItemsDeclaration | IContextMenuDeclaration;

export interface IContextMenu {
  items: IContextMenuItem[];
  //activeItem: number;
  style?: CustomStyleDeclaration;
}

/*class ContextMenu implements IContextMenu {
  readonly items: IContextMenuItem[];
  readonly style?: CustomStyleDeclaration;

  private readonly activeItem = -1;
  constructor(declaration: ContextMenuDeclaration) {
    if (isObjDeclaration(declaration)) {
      this.items = parseItems(declaration.items);
      this.style = declaration.style;
    }
  }
}*/

export function parse(declaration: ContextMenuDeclaration): IContextMenu {
  let menu = isObjDeclaration(declaration) ? declaration : { items: declaration };
  return Object.assign(menu, { items: parseItems(menu.items) });
}

function isObjDeclaration(declaration: ContextMenuDeclaration): declaration is IContextMenuDeclaration {
  return declaration.hasOwnProperty("items");
}

function parseItems(declaration: ContextMenuItemsDeclaration): IContextMenuItem[] {
  if (declaration instanceof Array) {
    return declaration.map(dec => parseItem(dec));
  } else {
    return Object.entries(declaration).map(([text, value]) => parseItem(value as ContextMenuItemDeclarationValue, text));
  }
}
