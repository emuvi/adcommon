import {
  QinAsset,
  QinButton,
  QinDivider,
  QinIcon,
  QinIconPick,
  QinLine,
  QinPopup,
} from "qinpel-cps";
import { AdRegister, AdRegMode } from "./ad-register";

export class AdRegBar extends QinLine {
  private _reg: AdRegister;

  private _qinMenu = new QinButton({ icon: new QinIcon(QinAsset.FaceMenuLines) });
  private _qinMenuViewSingle = new QinButton({
    icon: new QinIcon(QinAsset.FaceSplitNotView),
  });
  private _qinMenuViewVertical = new QinButton({
    icon: new QinIcon(QinAsset.FaceSplitViewVertical),
  });
  private _qinMenuViewHorizontal = new QinButton({
    icon: new QinIcon(QinAsset.FaceSplitViewHorizontal),
  });
  private _qinMenuFocusBody = new QinButton({
    icon: new QinIcon(QinAsset.FaceListView),
  });
  private _qinMenuFocusTable = new QinButton({
    icon: new QinIcon(QinAsset.FaceGridView),
  });
  private _qinMenuBody = new QinLine({
    items: [
      this._qinMenuViewSingle,
      this._qinMenuViewVertical,
      this._qinMenuViewHorizontal,
      new QinDivider(),
      this._qinMenuFocusBody,
      this._qinMenuFocusTable,
    ],
  });
  private _qinPopup = new QinPopup(this._qinMenuBody);

  private _qinInsert = new QinIcon(QinAsset.FaceAdd);
  private _qinSearch = new QinIcon(QinAsset.FaceSearch);
  private _qinMutate = new QinIcon(QinAsset.FacePencil);
  private _qinMode = new QinIconPick({
    icons: [this._qinInsert, this._qinSearch, this._qinMutate],
  });

  public constructor(register: AdRegister) {
    super();
    this._reg = register;
    this.initMenu();
    this.initMode();
  }

  private initMenu() {
    this._qinMenu.install(this);
    this._qinMenu.addActionMain((_) => this._qinPopup.showOnParent(this._qinMenu));
    this._qinMenuViewSingle.addActionMain((_) => {
      this._qinPopup.close();
      this._reg.viewSingle();
    });
    this._qinMenuViewVertical.addActionMain((_) => {
      this._qinPopup.close();
      this._reg.viewVertical();
    });
    this._qinMenuViewHorizontal.addActionMain((_) => {
      this._qinPopup.close();
      this._reg.viewHorizontal();
    });
    this._qinMenuFocusBody.addActionMain((_) => {
      this._qinPopup.close();
      this._reg.focusBody();
    });
    this._qinMenuFocusTable.addActionMain((_) => {
      this._qinPopup.close();
      this._reg.focusTable();
    });
  }

  private initMode() {
    this._qinMode.install(this);
    this._qinInsert.addActionMain((_) => this._reg.tryChangeMode(AdRegMode.INSERT));
    this._qinSearch.addActionMain((_) => this._reg.tryChangeMode(AdRegMode.SEARCH));
    this._qinMutate.addActionMain((_) => this._reg.tryChangeMode(AdRegMode.MUTATE));
    this._reg.addOnChangeMode((mode) => this.setMode(mode));
  }

  private setMode(mode: AdRegMode) {
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
