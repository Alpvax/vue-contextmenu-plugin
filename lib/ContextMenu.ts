//export { parse as parseMenu, IContextMenu } from "./ContextMenu";
//export { IContextMenuItem } from "./ContextMenuItem";

namespace ContextMenuDeclarationTypes {
  export interface IContextMenuItemDeclaration {
    text: string;
    action?: ActionType;
    submenu?: ContextMenuDeclaration;
    style?: StyleType;
  }

  export interface IContextMenuItemArrayDeclaration extends Array<IContextMenuItemDeclaration> {}
  export interface IContextMenuItemObjDeclaration {
    [key: string]: ActionType | ContextMenuDeclaration;//IStyledContextMenu | IContextMenuItemArray | IContextMenuItemObj;
  }
  export interface IContextMenuDeclarationWithOptions {
      items: IContextMenuItemArrayDeclaration | IContextMenuItemObjDeclaration;
      options: IContextMenuOptions;
  }
  export type ContextMenuDeclaration = IContextMenuDeclarationWithOptions | IContextMenuItemArrayDeclaration | IContextMenuItemObjDeclaration
}

export type ContextMenuDeclaration = ContextMenuDeclarationTypes.ContextMenuDeclaration;

function isAction(dec: ActionType | ContextMenuDeclaration): dec is ActionType {
  return typeof dec === "function";
}

function isOptionsDeclaration(declaration: ContextMenuDeclaration): declaration is ContextMenuDeclarationTypes.IContextMenuDeclarationWithOptions {
  return declaration.hasOwnProperty("items") && declaration.hasOwnProperty("options");
}

function parseItems(declaration: ContextMenuDeclarationTypes.IContextMenuItemArrayDeclaration
                               | ContextMenuDeclarationTypes.IContextMenuItemObjDeclaration): IContextMenuItem[] {
  if (declaration instanceof Array) {
    return (declaration as ContextMenuDeclarationTypes.IContextMenuItemArrayDeclaration).map((item) => {
      return Object.assign(item, {submenu: item.submenu ? parseMenu(item.submenu) : undefined});
    });
  } else {
    return Object.entries(declaration).map(([text, dec]) => {
      let item: IContextMenuItem = {
        text: text,
      };
      if (isAction(dec)) {
        item.action = dec;
      } else {
        item.submenu = parseMenu(dec);
      }
      return item;
    });
  }
}

export function parseMenu(declaration: ContextMenuDeclaration): IContextMenu {
  if (isOptionsDeclaration(declaration)) {
    return {
      options: declaration.options,
      items: parseItems(declaration.items),
    };
  } else {
    return {
      options: {},
      items: parseItems(declaration),
    };
  }
}

type ActionType = () => void;
type StyleType = CSSStyleDeclaration;

interface IContextMenuOptions {
  style?: StyleType;
}

export interface IContextMenuItem {
    text: string;
    action?: ActionType;
    submenu?: IContextMenu;
    style?: StyleType;
}

export interface IContextMenu {
  items: IContextMenuItem[];
  options: IContextMenuOptions;
}
