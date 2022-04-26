import { QinBase, QinColumn, QinLine, QinTools } from "qinpel-cps";
import { QinWaiters } from "qinpel-res";
import { AdModules, AdOptions } from "./ad-consts";
import { AdExpect } from "./ad-expect";
import { AdRegister } from "./ad-register";

export class AdMenu extends QinColumn {
  private line: QinLine = null;

  constructor(items: AdMenuItem[]) {
    super();
  }

  public addLine() {
    this.line = new QinLine();
    this.line.install(this);
  }

  public addItem(item: AdMenuItem) {}
}

export type AdMenuItem = {
  group: string;
  module: AdModules;
  action: typeof AdRegister;
};

export function startUp(menus: AdMenuItem[]): QinBase {
  const module = QinTools.qinpel().frame.getOption(AdOptions.MODULE);
  const scopes = QinTools.qinpel().frame.getOption(AdOptions.SCOPES);
  const filters = QinTools.qinpel().frame.getOption(AdOptions.FILTERS);
  if (module) {
    for (const menu of menus) {
      if (menu.module === module) {
        let expect = new AdExpect({
          scopes,
          filters,
          waiters: new QinWaiters().addWaiter((result) => {
            QinTools.qinpel().frame.sendWaiters(result);
          }),
        });
        return new menu.action(module, expect);
      }
    }
  }
  return new AdMenu(menus);
}
