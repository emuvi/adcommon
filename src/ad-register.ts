import { QinColumn, QinRow, QinStack } from "qinpel-cps";
import { AdScope } from "./ad-consts";
import { AdExpect } from "./ad-expect";
import { AdField } from "./ad-field";
import { AdModel } from "./ad-model";
import { AdRegBar } from "./ad-reg-bar";
import { AdRegEditor } from "./ad-reg-editor";
import { AdRegSearch } from "./ad-reg-search";
import { AdRegTable } from "./ad-reg-table";

export class AdRegister extends QinColumn {
  private _expect: AdExpect;
  private _model: AdModel;
  private _regMode: AdRegMode;

  private _bar = new AdRegBar(this);
  private _viewSingle = new QinStack();
  private _viewVertical = new QinColumn();
  private _viewHorizontal = new QinRow();
  private _body = new QinStack();
  private _editor = new AdRegEditor(this);
  private _search = new AdRegSearch(this);
  private _table = new AdRegTable(this);

  public constructor(expect: AdExpect, table: string) {
    super();
    this._expect = expect;
    this._model = new AdModel(table);
    this._bar.install(this);
    this._body.stack(this._editor);
    this._body.stack(this._search);
    if (
      expect.scopes.find((scope) => scope === AdScope.ALL) ||
      expect.scopes.find((scope) => scope === AdScope.INSERT)
    ) {
      this.changeMode(AdRegMode.INSERT);
    } else {
      this.changeMode(AdRegMode.SEARCH);
    }
    this.viewVertical();
  }

  public get expect(): AdExpect {
    return this._expect;
  }

  public get model(): AdModel {
    return this._model;
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

  private changeMode(mode: AdRegMode) {
    if (mode === AdRegMode.SEARCH) {
      this._body.show(this._search);
    } else {
      this._body.show(this._editor);
    }
    this._bar.setMode(mode);
    this._regMode = mode;
  }

  public tryChangeMode(mode: AdRegMode) {
    this.changeMode(mode);
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
  }

  public viewVertical() {
    this._viewSingle.unInstall();
    this._viewHorizontal.unInstall();
    this._viewVertical.install(this);
    this._body.install(this._viewVertical);
    this._table.install(this._viewVertical);
  }

  public viewHorizontal() {
    this._viewSingle.unInstall();
    this._viewVertical.unInstall();
    this._viewHorizontal.install(this);
    this._body.install(this._viewHorizontal);
    this._table.install(this._viewHorizontal);
  }
}

export enum AdRegMode {
  INSERT = "insert",
  SEARCH = "search",
  MUTATE = "mutate",
}
