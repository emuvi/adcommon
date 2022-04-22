import {
  QinAsset,
  QinButton,
  QinColumn,
  QinIcon,
  QinIconPick,
  QinLabel,
  QinLine,
  QinPopup,
} from "qinpel-cps";
import { AdRegister, AdRegMode } from "./ad-register";

export class AdRegBar extends QinLine {
  private _reg: AdRegister;

  private _qinMenu = new QinButton({ icon: new QinIcon(QinAsset.FaceMenuLines) });
  private _qinMenuView = new QinButton({ label: new QinLabel("View") });
  private _qinMenuBody = new QinColumn({ items: [this._qinMenuView] });
  private _qinPopup = new QinPopup(this._qinMenuBody);
  private _qinMenuViewItem = new QinButton({ label: new QinLabel("Item") });
  private _qinMenuViewBody = new QinColumn({ items: [this._qinMenuViewItem] });
  private _qinPopupView = new QinPopup(this._qinMenuViewBody);

  private _qinMode = new QinIconPick();
  private _qinInsert = new QinIcon(QinAsset.FaceAdd);
  private _qinSearch = new QinIcon(QinAsset.FaceSearch);
  private _qinMutate = new QinIcon(QinAsset.FacePencil);

  public constructor(register: AdRegister) {
    super();
    this._reg = register;
    this.initMenu();
    this.initMode();
  }

  private initMenu() {
    this._qinMenu.install(this);
    this._qinMenu.addActionMain((_) => this._qinPopup.showOnParent(this._qinMenu));
    this._qinMenuView.addActionMain((_) => this._qinPopupView.showOnParent(this._qinMenuView));
  }

  private initMode() {
    this._qinMode.install(this);
    this._qinMode.addIcon(this._qinInsert);
    this._qinMode.addIcon(this._qinSearch);
    this._qinMode.addIcon(this._qinMutate);
    this._qinInsert.addAction((ev) => {
      if (ev.isMain) {
        this._reg.tryChangeMode(AdRegMode.INSERT);
      }
    });
    this._qinSearch.addAction((ev) => {
      if (ev.isMain) {
        this._reg.tryChangeMode(AdRegMode.SEARCH);
      }
    });
    this._qinMutate.addAction((ev) => {
      if (ev.isMain) {
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
