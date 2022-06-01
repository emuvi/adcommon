import { QinColumn, QinSplitter, QinStack } from "qinpel-cps";
import { AdExpect } from "./ad-expect";
import { AdField } from "./ad-field";
import { AdRegBar } from "./ad-reg-bar";
import { AdRegBase } from "./ad-reg-base";
import { AdRegEditor } from "./ad-reg-editor";
import { AdRegLoader } from "./ad-reg-loader";
import { AdRegModel } from "./ad-reg-model";
import { AdRegSearch } from "./ad-reg-search";
import { AdRegTable } from "./ad-reg-table";
import { AdRegistry } from "./ad-registry";
import { AdModule, AdScope } from "./ad-tools";

export class AdRegister extends QinColumn {
  private _module: AdModule;
  private _base: AdRegBase;
  private _expect: AdExpect;
  private _model: AdRegModel;

  private _regMode: AdRegMode;
  private _regView: AdRegView;

  private _seeRow: number = -1;

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

  public constructor(module: AdModule, base: AdRegBase, expect: AdExpect) {
    super();
    this._module = module;
    this._base = base;
    this._expect = expect;
    this._model = new AdRegModel(this);
    this._viewSingle.style.putAsFlexMax();
    this._viewVertical.style.putAsFlexMax();
    this._viewHorizontal.style.putAsFlexMax();
    this._bar.install(this);
    this._body.stack(this._editor);
    this._body.stack(this._search);
    this.prepare();
    this.viewVertical();
    this._body.style.putAsFlexMax();
    this._editor.style.putAsFlexMax();
    this._search.style.putAsFlexMax();
    this._table.style.putAsFlexMax();
    this._bar.tabIndex = 0;
    this._body.tabIndex = 1;
    this._table.tabIndex = 2;
  }

  public prepare() {
    this._model.clean();
    if (
      this._expect.scopes.find((scope) => scope === AdScope.ALL || scope === AdScope.INSERT)
    ) {
      this.tryTurnMode(AdRegMode.INSERT);
    } else {
      this.tryTurnMode(AdRegMode.SEARCH);
    }
  }

  public get module(): AdModule {
    return this._module;
  }

  public get base(): AdRegBase {
    return this._base;
  }

  public get registry(): AdRegistry {
    return this._base.registry;
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

  public tryTurnMode(mode: AdRegMode): Promise<AdRegTurningMode> {
    return new Promise<AdRegTurningMode>((resolve, reject) => {
      this.checkForMutations()
        .then(() => {
          let turning = {
            oldMode: this._regMode,
            newMode: mode,
          } as AdRegTurningMode;
          let canceled = this.callTryListeners(AdRegTurn.TURN_MODE, turning);
          if (canceled) {
            reject(canceled);
          }
          if (mode == AdRegMode.NOTICE) {
            if (!this.isSeeRowValid()) {
              reject({ why: "There's no valid row selected to notice." });
              return;
            }
          }
          this.turnMode(mode);
          this.callDidListeners(AdRegTurn.TURN_MODE, turning);
          resolve(turning);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  private isSeeRowValid(): boolean {
    return this._seeRow >= 0 && this._seeRow < this._table.getLinesSize();
  }

  private turnMode(mode: AdRegMode) {
    if (mode === AdRegMode.INSERT) {
      this._model.clean();
    }
    if (mode === AdRegMode.SEARCH) {
      this._body.show(this._search);
    } else {
      this._body.show(this._editor);
    }
    if (mode === AdRegMode.NOTICE) {
      if (this._seeRow > -1) {
        let values = this._table.getLine(this._seeRow);
        if (values) {
          this.setRowAndValues(this._seeRow, values);
        }
      }
      this._model.turnReadOnly();
    } else {
      this._model.turnEditable();
    }
    this._regMode = mode;
  }

  public tryNotice(row: number, values: string[]): Promise<AdRegTurningNotice> {
    return new Promise<AdRegTurningNotice>((resolve, reject) => {
      this.checkForMutations()
        .then(() => {
          let turningMode = {
            oldMode: this._regMode,
            newMode: AdRegMode.NOTICE,
          } as AdRegTurningMode;
          let canceled = this.callTryListeners(AdRegTurn.TURN_MODE, turningMode);
          if (canceled) {
            reject(canceled);
          }
          this.turnMode(AdRegMode.NOTICE);
          this.callDidListeners(AdRegTurn.TURN_MODE, turningMode);
          let turningNotice = {
            oldRow: this._seeRow,
            newRow: row,
          } as AdRegTurningNotice;
          let canceledNotice = this.callTryListeners(AdRegTurn.TURN_NOTICE, turningNotice);
          if (canceledNotice) {
            reject(canceledNotice);
          }
          this.setRowAndValues(row, values);
          this.callDidListeners(AdRegTurn.TURN_NOTICE, turningNotice);
          resolve(turningNotice);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  private setRowAndValues(row: number, values: string[]) {
    for (let i = 0; i < values.length; i++) {
      this._model.setData(i, values[i]);
    }
    this._seeRow = row;
    this._table.select(row);
    this._table.scrollTo(row);
  }

  private isThereAnyRowSelected(): boolean {
    return this._seeRow > -1;
  }

  public unselectAll(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.checkForMutations()
        .then(() => {
          this._seeRow = -1;
          this._table.unselectAll();
          this._model.clean();
          resolve();
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  public tryGoFirst() {
    if (this._table.getLinesSize() > 0) {
      let values = this._table.getLine(0);
      this.tryNotice(0, values);
    }
  }

  public tryGoPrior() {
    let size = this._table.getLinesSize();
    let attempt = this._seeRow - 1;
    if (attempt >= 0 && attempt < size) {
      let values = this._table.getLine(attempt);
      this.tryNotice(attempt, values);
    }
  }

  public tryGoNext() {
    let size = this._table.getLinesSize();
    let attempt = this._seeRow + 1;
    if (attempt < size) {
      let values = this._table.getLine(attempt);
      this.tryNotice(attempt, values);
    }
  }

  public tryGoLast() {
    let size = this._table.getLinesSize();
    if (size > 0) {
      let values = this._table.getLine(size - 1);
      this.tryNotice(size - 1, values);
    }
  }

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

  public tryConfirm(): Promise<void> {
    if (this.regMode === AdRegMode.SEARCH) {
      return this.trySelect();
    } else if (this.regMode === AdRegMode.INSERT) {
      return this.tryInsert();
    } else if (this.regMode === AdRegMode.MUTATE) {
      return this.tryUpdate();
    }
  }

  private trySelect(): Promise<void> {
    return this.loader.load();
  }

  private tryInsert(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.model
        .insert()
        .then((res) => {
          this._model.clean();
          this.focusFirstField();
          this.displayInfo("Inserted: " + JSON.stringify(res));
          let values = res.map((valued) => valued.data);
          this._table.addLine(values);
          resolve();
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  private tryUpdate(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.model
        .update()
        .then((res) => {
          this.focusFirstField();
          this.displayInfo("Updated: " + JSON.stringify(res));
          let values = res.map((valued) => valued.data);
          this._table.setLine(this._seeRow, values);
          this.tryTurnMode(AdRegMode.NOTICE);
          resolve();
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  public tryCancel() {
    if (this.regMode === AdRegMode.INSERT) {
      this.checkForMutations().then((_) => this._model.clean());
    } else if (this.regMode === AdRegMode.SEARCH) {
      this._search.clean();
    } else if (this.regMode === AdRegMode.MUTATE) {
      this.tryTurnMode(AdRegMode.NOTICE);
    }
  }

  public tryDelete(): Promise<AdRegTurningDelete> {
    return new Promise<AdRegTurningDelete>((resolve, reject) => {
      this.checkForMutations()
        .then(() => {
          if (!this.isThereAnyRowSelected()) {
            reject({ why: "No selected row to delete" });
            return;
          }
          this.qinpel.jobbed
            .showDialog("Do you really want to delete?")
            .then((want) => {
              if (want) {
                let turning = {
                  seeRow: this._seeRow,
                } as AdRegTurningDelete;
                let canceled = this.callTryListeners(AdRegTurn.TURN_DELETE, turning);
                if (canceled) {
                  reject(canceled);
                }
                this._model
                  .delete()
                  .then(() => {
                    this._table.delLine(this._seeRow);
                    this.callDidListeners(AdRegTurn.TURN_DELETE, turning);
                    this.tryTurnMode(AdRegMode.INSERT);
                    resolve(turning);
                  })
                  .catch((err) => {
                    reject(err);
                  });
              }
            })
            .catch((err) => {
              reject(err);
            });
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  private checkForMutations(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const mutations = this._model.hasMutations();
      if (mutations) {
        let message =
          "There are mutations on:\n" + mutations.join(", ") + "\nShould we continue?";
        this.qinpel.jobbed.showDialog(message).then((confirmed) => {
          if (confirmed) {
            resolve();
          } else {
            reject(canceledByMutations);
          }
        });
      } else {
        resolve();
      }
    });
  }

  public displayInfo(message: string) {
    this.qinpel.jobbed.statusInfo(message);
  }

  public displayError(error: any, origin: string) {
    if (error == canceledByMutations) {
      this.qinpel.jobbed.statusError(error, origin);
    } else {
      this.qinpel.jobbed.showError(error, origin);
    }
  }

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
  MUTATE = "MUTATE",
  NOTICE = "NOTICE",
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
  TURN_DELETE = "TURN_DELETE",
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
  newRow: number;
};

export type AdRegTurningDelete = {
  seeRow: number;
};

export type AdRegTurning = AdRegTurningMode | AdRegTurningView | AdRegTurningNotice;

export type AdRegTryCanceled = {
  why: string;
};

const canceledByMutations = {
  why: "The user canceled this action to not loose his mutations.",
} as AdRegTryCanceled;

export type AdRegTryCaller = (turning: AdRegTurning) => AdRegTryCanceled;
export type AdRegDidCaller = (turning: AdRegTurning) => void;

export type AdRegListener = {
  event: AdRegTurn;
  onTry?: AdRegTryCaller;
  onDid?: AdRegDidCaller;
};
