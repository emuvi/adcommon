import { QinColumn } from "qinpel-cps";
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

  private _bar = new AdRegBar(this);
  private _editor = new AdRegEditor(this);
  private _search = new AdRegSearch(this);
  private _table = new AdRegTable(this);

  public constructor(expect: AdExpect, table: string) {
    super();
    this._expect = expect;
    this._model = new AdModel(table);
    this._bar.install(this);
    this._editor.install(this);
    this._search.install(this);
    this._table.install(this);
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
  }
}
