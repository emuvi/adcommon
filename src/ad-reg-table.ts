import { QinTable } from "qinpel-cps";
import { AdRegister } from "./ad-register";

export class AdRegTable extends QinTable {
  private _reg: AdRegister;

  public constructor(register: AdRegister) {
    super();
    this._reg = register;
  }
}