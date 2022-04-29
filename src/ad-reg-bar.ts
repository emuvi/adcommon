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

  private _qinFirst = new QinButton({ icon: new QinIcon(QinAsset.FaceRUpChevronPush) });
  private _qinPrior = new QinButton({ icon: new QinIcon(QinAsset.FaceRLeftChevronPush) });
  private _qinNext = new QinButton({ icon: new QinIcon(QinAsset.FaceRRightChevronPush) });
  private _qinLast = new QinButton({ icon: new QinIcon(QinAsset.FaceRDownChevronPush) });

  private _qinDelete = new QinButton({ icon: new QinIcon(QinAsset.FaceTrash) });
  private _qinConfirm = new QinButton({ icon: new QinIcon(QinAsset.FaceConfirm) });
  private _qinCancel = new QinButton({ icon: new QinIcon(QinAsset.FaceCancel) });

  public constructor(register: AdRegister) {
    super();
    this._reg = register;
    this.initMenu();
    this.initMode();
    this.initMove();
    this.initMark();
    this.style.putAsPaddingBottom(2);
    this.style.putAsBorderBottom(2, "#999");
    this.style.putAsMarginBottom(2);
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

  private initMove() {
    this._qinFirst.install(this);
    this._qinFirst.addActionMain((_) => alert("first"));
    this._qinPrior.install(this);
    this._qinPrior.addActionMain((_) => alert("prior"));
    this._qinNext.install(this);
    this._qinNext.addActionMain((_) => alert("next"));
    this._qinLast.install(this);
    this._qinLast.addActionMain((_) => alert("last"));
  }

  private initMark() {
    this._qinDelete.install(this);
    this._qinDelete.addActionMain((_) => alert("delete"));
    this._qinConfirm.install(this);
    this._qinConfirm.addActionMain((_) => alert("confirm"));
    this._qinCancel.install(this);
    this._qinCancel.addActionMain((_) => alert("cancel"));
  }

  private setMode(mode: AdRegMode) {
    this._qinMode.setData(null);
    if (mode) {
      switch (mode) {
        case AdRegMode.INSERT:
          this._qinMode.setData(this._qinInsert.asset);
          this._qinFirst.unDisplay();
          this._qinPrior.unDisplay();
          this._qinNext.unDisplay();
          this._qinLast.unDisplay();
          this._qinDelete.unDisplay();
          this._qinConfirm.reDisplay();
          this._qinCancel.reDisplay();
          break;
        case AdRegMode.SEARCH:
          this._qinMode.setData(this._qinSearch.asset);
          this._qinFirst.reDisplay();
          this._qinPrior.reDisplay();
          this._qinNext.reDisplay();
          this._qinLast.reDisplay();
          this._qinDelete.unDisplay();
          this._qinConfirm.unDisplay();
          this._qinCancel.unDisplay();
          break;
        case AdRegMode.MUTATE:
          this._qinMode.setData(this._qinMutate.asset);
          this._qinFirst.unDisplay();
          this._qinPrior.unDisplay();
          this._qinNext.unDisplay();
          this._qinLast.unDisplay();
          this._qinDelete.reDisplay();
          this._qinConfirm.reDisplay();
          this._qinCancel.reDisplay();
          break;
      }
    }
  }
}
