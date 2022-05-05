import {
  QinBase,
  QinButton,
  QinColumn,
  QinIcon,
  QinLabel,
  QinLine,
  QinTitled,
  QinTool,
} from "qinpel-cps";
import { QinGrandeur, QinWaiters } from "qinpel-res";
import { AdModule, AdOptions, AdScope, isSameModule } from "./ad-consts";
import { AdExpect } from "./ad-expect";
import { AdRegister } from "./ad-register";
import { AdTools } from "./ad-tools";

export class AdMenu extends QinColumn {
  private _lines = new Array<QinTitled>();

  constructor(items: AdMenuItem[]) {
    super();
    for (const item of items) {
      const line = this.getLine(item.group);
      const button = new QinButton({
        icon: new QinIcon(item.module.icon, QinGrandeur.MEDIUM),
        label: new QinLabel(item.module.title),
      });
      button.putAsColumn();
      button.addActionMain((_) => {
        this.qinpel.chief.newJobber(
          item.module.title,
          item.module.app,
          AdTools.newAdOption(item.module, [AdScope.ALL])
        );
        this.qinpel.jobbed.close();
      });
      line.put(button);
    }
  }

  private getLine(title: string): QinLine {
    if (!title) {
      if (this._lines.length === 0) {
        const newLine = new QinTitled();
        newLine.install(this);
        this._lines.push(newLine);
      }
      return this._lines[this._lines.length - 1];
    }
    for (const line of this._lines) {
      if (line.title == title) {
        return line;
      }
    }
    const newLine = new QinTitled({ title });
    newLine.install(this);
    this._lines.push(newLine);
    return newLine;
  }
}

export type AdMenuAct<T extends QinBase> = new (module: AdModule, expect: AdExpect) => T;

export type AdMenuItem = {
  group?: string;
  module: AdModule;
  register?: AdMenuAct<AdRegister>;
};

export function menuStartUp(menus: AdMenuItem[]): QinBase {
  const module = QinTool.qinpel.jobbed.getOption(AdOptions.MODULE);
  const scopes = QinTool.qinpel.jobbed.getOption(AdOptions.SCOPES);
  const filters = QinTool.qinpel.jobbed.getOption(AdOptions.FILTERS);
  if (module) {
    for (const menu of menus) {
      if (isSameModule(menu.module, module)) {
        let expect = new AdExpect({
          scopes,
          filters,
          waiters: new QinWaiters().addWaiter((result) => {
            QinTool.qinpel.jobbed.sendWaiters(result);
          }),
        });
        if (menu.register) {
          return new menu.register(menu.module, expect);
        } else {
          throw new Error("No menu action defined");
        }
      }
    }
  }
  return new AdMenu(menus);
}
