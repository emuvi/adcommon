import { QinAsset, QinButton, QinIcon, QinLine } from "qinpel-cps";
import { QinGrandeur } from "qinpel-res";
import { AdRegister } from "./ad-register";

export class AdRegBar extends QinLine {
  private _reg: AdRegister;

  private _test = new QinIcon(QinAsset.FaceAdd, QinGrandeur.MEDIUM);

  public constructor(register: AdRegister) {
    super();
    this._reg = register;
    this._test.install(this);
    this._test.style.putAsMarginBottom(30);
  }
}
