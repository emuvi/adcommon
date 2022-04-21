import { QinAsset, QinIconPick, QinIcon, QinLine } from "qinpel-cps";
import { AdRegister, AdRegMode } from "./ad-register";

export class AdRegBar extends QinLine {
  private _reg: AdRegister;

  private _qinMode = new QinIconPick();
  private _qinInsert = new QinIcon(QinAsset.FaceAdd);
  private _qinSearch = new QinIcon(QinAsset.FaceSearch);
  private _qinMutate = new QinIcon(QinAsset.FacePencil);

  public constructor(register: AdRegister) {
    super();
    this._reg = register;
    this._qinMode.install(this);
    this._qinMode.addIcon(this._qinInsert);
    this._qinMode.addIcon(this._qinSearch);
    this._qinMode.addIcon(this._qinMutate);
    this._qinInsert.addAction((ev) => {
      if (ev.isPrimary) {
        this._reg.tryChangeMode(AdRegMode.INSERT);
      }
    });
    this._qinSearch.addAction((ev) => {
      if (ev.isPrimary) {
        this._reg.tryChangeMode(AdRegMode.SEARCH);
      }
    });
    this._qinMutate.addAction((ev) => {
      if (ev.isPrimary) {
        this._reg.tryChangeMode(AdRegMode.MUTATE);
      }
    });
  }

  public setMode(mode: AdRegMode) {
    this._qinMode.setData(null);
    if (mode) {
      switch (mode) {
        case AdRegMode.INSERT:
          this._qinMode.setData(this._qinInsert.asset);
          break;
        case AdRegMode.SEARCH:
          this._qinMode.setData(this._qinSearch.asset);
          break;
        case AdRegMode.MUTATE:
          this._qinMode.setData(this._qinMutate.asset);
          break;
      }
    }
  }
}
