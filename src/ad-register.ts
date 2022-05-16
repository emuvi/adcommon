import { QinColumn, QinSplitter, QinStack } from "qinpel-cps";
import { AdExpect } from "./ad-expect";
import { AdField } from "./ad-field";
import { AdRegBar } from "./ad-reg-bar";
import { AdRegEditor } from "./ad-reg-editor";
import { AdRegLoader } from "./ad-reg-loader";
import { AdRegModel } from "./ad-reg-model";
import { AdRegSearch } from "./ad-reg-search";
import { AdRegTable } from "./ad-reg-table";
import { AdRegistry } from "./ad-registry";
import { AdModule, AdScope } from "./ad-tools";

export class AdRegister extends QinColumn {
  private _module: AdModule;
  private _registry: AdRegistry;
  private _expect: AdExpect;
  private _model: AdRegModel;

  private _regMode: AdRegMode;
  private _regView: AdRegView;

  private _seeRow: number;
  private _seeValues: string[];

  private _listener = new Array<AdRegListener>();

  private _body = new QinStack();
  private _viewSingle = new QinStack();
  private _viewVertical = new QinSplitter({ horizontal: false });
  private _viewHorizontal = new QinSplitter({ horizontal: true });

  private _bar = new AdRegBar(this);
  private _editor = new AdRegEditor(this);
  private _search = new AdRegSearch(this);
  private _table = new AdRegTable(this);

  private _loader = new AdRegLoader(this);

  public constructor(module: AdModule, registry: AdRegistry, expect: AdExpect) {
    super();
    this._module = module;
    this._registry = registry;
    this._expect = expect;
    this._model = new AdRegModel(this);
    this._viewSingle.style.putAsFlexMax();
    this._viewVertical.style.putAsFlexMax();
    this._viewHorizontal.style.putAsFlexMax();
    this._bar.install(this);
    this._body.stack(this._editor);
    this._body.stack(this._search);
    if (
      expect.scopes.find((scope) => scope === AdScope.ALL) ||
      expect.scopes.find((scope) => scope === AdScope.INSERT)
    ) {
      this.tryTurnMode(AdRegMode.INSERT);
    } else {
      this.tryTurnMode(AdRegMode.SEARCH);
    }
    this.viewVertical();
    this._body.style.putAsFlexMax();
    this._editor.style.putAsFlexMax();
    this._search.style.putAsFlexMax();
    this._table.style.putAsFlexMax();
    this._bar.tabIndex = 0;
    this._body.tabIndex = 1;
    this._table.tabIndex = 2;
  }

  public get module(): AdModule {
    return this._module;
  }

  public get registry(): AdRegistry {
    return this._registry;
  }

  public get expect(): AdExpect {
    return this._expect;
  }

  public get model(): AdRegModel {
    return this._model;
  }

  public get regMode(): AdRegMode {
    return this._regMode;
  }

  public get regView(): AdRegView {
    return this._regView;
  }

  public get bar(): AdRegBar {
    return this._bar;
  }

  public get editor(): AdRegEditor {
    return this._editor;
  }

  public get search(): AdRegSearch {
    return this._search;
  }

  public get table(): AdRegTable {
    return this._table;
  }

  public get loader(): AdRegLoader {
    return this._loader;
  }

  public addTab(title: string) {
    this._editor.addTab(title);
  }

  public addLine() {
    this._editor.addLine();
  }

  public addField(field: AdField) {
    this._model.addField(field);
    this._editor.addField(field);
    this._search.addField(field);
    this._table.addHead(field.title);
  }

  public tryTurnMode(mode: AdRegMode): AdRegTryCanceled {
    let turning = {
      oldMode: this._regMode,
      newMode: mode,
    } as AdRegTurningMode;
    let canceled = this.callTryListeners(AdRegTurn.TURN_MODE, turning);
    if (canceled) return canceled;
    this.turnMode(mode);
    this.callDidListeners(AdRegTurn.TURN_MODE, turning);
    return null;
  }

  private turnMode(mode: AdRegMode) {
    if (mode === AdRegMode.SEARCH) {
      this._body.show(this._search);
    } else {
      this._body.show(this._editor);
    }
    if (mode === AdRegMode.NOTICE) {
      this._model.turnReadOnly();
    } else {
      this._model.turnEditable();
    }
    this._regMode = mode;
  }

  public tryNotice(row: number, values: string[]): AdRegTryCanceled {
    let canceled = this.tryTurnMode(AdRegMode.NOTICE);
    if (canceled) return canceled;
    let turning = {
      oldRow: this._seeRow,
      oldValues: this._seeValues,
      newRow: row,
      newValues: values,
    } as AdRegTurningNotice;
    canceled = this.callTryListeners(AdRegTurn.TURN_NOTICE, turning);
    if (canceled) return canceled;
    for (let i = 0; i < values.length; i++) {
      this._model.setData(i, values[i]);
    }
    this.turnMode(AdRegMode.NOTICE);
    this.callDidListeners(AdRegTurn.TURN_NOTICE, turning);
    return null;
  }

  public tryGoFirst() {}

  public tryGoPrior() {}

  public tryGoNext() {}

  public tryGoLast() {}

  public tryMutate() {
    let canceled = this.tryTurnMode(AdRegMode.MUTATE);
    if (canceled) return canceled;
    let turning = {
      oldMode: this._regMode,
      newMode: AdRegMode.MUTATE,
    } as AdRegTurningMode;
    this.turnMode(AdRegMode.MUTATE);
    this.callDidListeners(AdRegTurn.TURN_MODE, turning);
    return null;
  }

  public tryConfirm() {
    if (this.regMode === AdRegMode.SEARCH) {
      this.trySelect();
    } else if (this.regMode === AdRegMode.INSERT) {
      this.tryInsert();
    } else if (this.regMode === AdRegMode.MUTATE) {
      this.tryUpdate();
    }
  }

  private trySelect() {
    this.loader.load();
  }

  private tryInsert() {
    this.model
      .insert()
      .then((res) => {
        this._model.clean();
        this.focusFirstField();
        this.qinpel.jobbed.statusInfo("Inserted: " + JSON.stringify(res));
      })
      .catch((err) => {
        this.qinpel.jobbed.statusError(err, "{adcommon}(ErrCode-000001)");
      });
  }

  private tryUpdate() {}

  public tryCancel() {
    if (this.regMode === AdRegMode.INSERT) {
      this._model.clean();
    } else if (this.regMode === AdRegMode.SEARCH) {
      this._search.clean();
    } else if (this.regMode === AdRegMode.MUTATE) {
      this._model.undoMutations();
      this.tryTurnMode(AdRegMode.NOTICE);
    }
  }

  public tryDelete() {}

  public viewSingle() {
    this._viewVertical.unInstall();
    this._viewHorizontal.unInstall();
    this._viewSingle.install(this);
    this._body.install(this._viewSingle);
    this._table.install(this._viewSingle);
    if (this._regMode === AdRegMode.SEARCH) {
      this._viewSingle.show(this._table);
    } else {
      this._viewSingle.show(this._body);
    }
    this._regView = AdRegView.SINGLE;
    this.callDidListeners(AdRegTurn.TURN_VIEW, { newValue: this._regView });
  }

  public viewVertical() {
    this._viewSingle.unInstall();
    this._viewHorizontal.unInstall();
    this._viewVertical.install(this);
    this._body.install(this._viewVertical);
    this._table.install(this._viewVertical);
    this._body.reDisplay();
    this._table.reDisplay();
    this._regView = AdRegView.VERTICAL;
    this.callDidListeners(AdRegTurn.TURN_VIEW, { newValue: this._regView });
  }

  public viewHorizontal() {
    this._viewSingle.unInstall();
    this._viewVertical.unInstall();
    this._viewHorizontal.install(this);
    this._body.install(this._viewHorizontal);
    this._table.install(this._viewHorizontal);
    this._body.reDisplay();
    this._table.reDisplay();
    this._regView = AdRegView.HORIZONTAL;
    this.callDidListeners(AdRegTurn.TURN_VIEW, { newValue: this._regView });
  }

  public addListener(listener: AdRegListener) {
    this._listener.push(listener);
  }

  public delListener(listener: AdRegListener) {
    var index = this._listener.indexOf(listener);
    if (index >= 0) {
      this._listener.splice(index, 1);
    }
  }

  private callTryListeners(event: AdRegTurn, valued: any): AdRegTryCanceled {
    this._listener.forEach((listen) => {
      if (listen.event === event) {
        if (listen.onTry) {
          let cancel = listen.onTry(valued);
          if (cancel) {
            return cancel;
          }
        }
      }
    });
    return null;
  }

  private callDidListeners(event: AdRegTurn, mutation: any) {
    this._listener.forEach((listen) => {
      if (listen.event === event) {
        if (listen.onDid) {
          listen.onDid(mutation);
        }
      }
    });
  }

  public focusFirstField() {
    if (this.model.fields.length > 0) {
      this.model.fields[0].focus();
    }
  }

  public focusBody() {
    if (this._regView == AdRegView.SINGLE) {
      this._viewSingle.show(this._body);
    }
    this._body.focus();
  }

  public focusTable() {
    if (this._regView == AdRegView.SINGLE) {
      this._viewSingle.show(this._table);
    }
    this._table.focus();
  }
}

export enum AdRegMode {
  INSERT = "INSERT",
  SEARCH = "SEARCH",
  NOTICE = "NOTICE",
  MUTATE = "MUTATE",
}

export enum AdRegView {
  SINGLE = "SINGLE",
  VERTICAL = "VERTICAL",
  HORIZONTAL = "HORIZONTAL",
}

export enum AdRegTurn {
  TURN_MODE = "TURN_MODE",
  TURN_VIEW = "TURN_VIEW",
  TURN_NOTICE = "TURN_NOTICE",
}

export type AdRegTurningMode = {
  oldMode: AdRegMode;
  newMode: AdRegMode;
};

export type AdRegTurningView = {
  oldView: AdRegView;
  newView: AdRegView;
};

export type AdRegTurningNotice = {
  oldRow: number;
  oldValues: string[];
  newRow: number;
  newValues: string[];
};

export type AdRegTurning = AdRegTurningMode | AdRegTurningView | AdRegTurningNotice;

export type AdRegTryCanceled = {
  why: string;
};

export type AdRegTryCaller = (turning: AdRegTurning) => AdRegTryCanceled;
export type AdRegDidCaller = (turning: AdRegTurning) => void;

export type AdRegListener = {
  event: AdRegTurn;
  onTry?: AdRegTryCaller;
  onDid?: AdRegDidCaller;
};
