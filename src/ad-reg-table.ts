import { QinTable } from "qinpel-cps";
import { AdRegister } from "./ad-register";

export class AdRegTable extends QinTable {
  private _register: AdRegister;

  public constructor(register: AdRegister) {
    super();
    this._register = register;
  }
}
