import { QinPanel } from "qinpel-cps";
import { AdRegister } from "./ad-register";

export class AdRegTable extends QinPanel {
  private _reg: AdRegister;

  public constructor(register: AdRegister) {
    super();
    this._reg = register;
  }

}