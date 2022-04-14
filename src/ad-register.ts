import { QinColumn } from "qinpel-cps";
import { AdExpect } from "./ad-expect";
import { AdField } from "./ad-field";
import { AdModel } from "./ad-model";
import { AdRegBar } from "./ad-reg-bar";
import { AdRegBody } from "./ad-reg-body";
import { AdRegTable } from "./ad-reg-table";

export class AdRegister extends QinColumn {
  private _expect: AdExpect;
  private _model: AdModel;

  private _bar = new AdRegBar(this);
  private _body = new AdRegBody(this);
  private _table = new AdRegTable(this);

  public constructor(expect: AdExpect, table: string) {
    super();
    this._expect = expect;
    this._model = new AdModel(table);
    this._bar.install(this);
    this._body.install(this);
    this._table.install(this);
  }

  public get expect(): AdExpect {
    return this._expect;
  }

  public get model(): AdModel {
    return this._model;
  }

  public addTab(title: string) {
    this._body.addTab(title);
  }

  public addLine() {
    this._body.addLine();
  }

  public addView(field: AdField) {
    this._body.addView(field);
  }
}
