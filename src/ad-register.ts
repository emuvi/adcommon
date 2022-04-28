import { QinColumn, QinSplitter, QinStack } from "qinpel-cps";
import { AdModule, AdScope } from "./ad-consts";
import { AdExpect } from "./ad-expect";
import { AdField } from "./ad-field";
import { AdModel } from "./ad-model";
import { AdRegBar } from "./ad-reg-bar";
import { AdRegEditor } from "./ad-reg-editor";
import { AdRegSearch } from "./ad-reg-search";
import { AdRegTable } from "./ad-reg-table";

export class AdRegister extends QinColumn {
  private _module: AdModule;
  private _expect: AdExpect;
  private _model: AdModel;

  private _regMode: AdRegMode;
  private _onChangeMode = new Array<OnChangeMode>();
  private _regView: AdRegView;
  private _onChangeView = new Array<OnChangeView>();

  private _regBar = new AdRegBar(this);
  private _viewSingle = new QinStack();
  private _viewVertical = new QinSplitter({ horizontal: false });
  private _viewHorizontal = new QinSplitter({ horizontal: true });
  private _body = new QinStack();
  private _bodyEditor = new AdRegEditor(this);
  private _bodySearch = new AdRegSearch(this);
  private _table = new AdRegTable(this);

  public;
  constructor(module: AdModule, expect: AdExpect) {
    super();
    this._module = module;
    this._expect = expect;
    this._model = new AdModel(this._module.data);
    this._viewSingle.style.putAsFlexMax();
    this._viewVertical.style.putAsFlexMax();
    this._viewHorizontal.style.putAsFlexMax();
    this._regBar.install(this);
    this._body.stack(this._bodyEditor);
    this._body.stack(this._bodySearch);
    if (
      expect.scopes.find((scope) => scope === AdScope.ALL) ||
      expect.scopes.find((scope) => scope === AdScope.INSERT)
    ) {
      this.changeMode(AdRegMode.INSERT);
    } else {
      this.changeMode(AdRegMode.SEARCH);
    }
    this.viewVertical();
    this._regBar.tabIndex = 0;
    this._body.tabIndex = 1;
    this._table.tabIndex = 2;
  }

  public get expect(): AdExpect {
    return this._expect;
  }

  public get model(): AdModel {
    return this._model;
  }

  public addTab(title: string) {
    this._bodyEditor.addTab(title);
  }

  public addLine() {
    this._bodyEditor.addLine();
  }

  public addField(field: AdField) {
    this._model.addField(field);
    this._bodyEditor.addField(field);
    this._bodySearch.addField(field);
    this._table.addHead(field.title);
  }

  private changeMode(mode: AdRegMode) {
    if (mode === AdRegMode.SEARCH) {
      this._body.show(this._bodySearch);
    } else {
      this._body.show(this._bodyEditor);
    }
    this._regMode = mode;
    this._onChangeMode.forEach((callback) => callback(this._regMode));
  }

  public tryChangeMode(mode: AdRegMode): boolean {
    this.changeMode(mode);
    return true;
  }

  public addOnChangeMode(callback: OnChangeMode) {
    this._onChangeMode.push(callback);
  }

  public delOnChangeMode(callback: OnChangeMode) {
    let index = this._onChangeMode.indexOf(callback);
    if (index >= 0) {
      this._onChangeMode.splice(index, 1);
    }
  }

  public get mode(): AdRegMode {
    return this._regMode;
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
    this._onChangeView.forEach((callback) => callback(this._regView));
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
    this._onChangeView.forEach((callback) => callback(this._regView));
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
    this._onChangeView.forEach((callback) => callback(this._regView));
  }

  public addOnChangeView(callback: OnChangeView) {
    this._onChangeView.push(callback);
  }

  public delOnChangeView(callback: OnChangeView) {
    let index = this._onChangeView.indexOf(callback);
    if (index >= 0) {
      this._onChangeView.splice(index, 1);
    }
  }

  public get view(): AdRegView {
    return this._regView;
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
  INSERT = "insert",
  SEARCH = "search",
  MUTATE = "mutate",
}

export type OnChangeMode = (mode: AdRegMode) => void;

export enum AdRegView {
  SINGLE = "insert",
  VERTICAL = "search",
  HORIZONTAL = "mutate",
}

export type OnChangeView = (view: AdRegView) => void;
