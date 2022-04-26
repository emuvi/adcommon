import { QinTools } from "qinpel-cps";
import { AdField } from "./ad-field";
import { AdFilters } from "./ad-filters";

export class AdModel {
  private _table: string;
  private _fields: AdField[];

  public constructor(table: string) {
    this._table = table;
    this._fields = [];
  }

  public get table(): string {
    return this._table;
  }

  public get fields(): AdField[] {
    return this._fields;
  }

  public addField(field: AdField) {
    this._fields.push(field);
  }

  public insert(values: any) {
    QinTools.qinpel();
  }

  public search(filters: AdFilters) {
    QinTools.qinpel();
  }

  public update(values: any, filters: AdFilters) {
    QinTools.qinpel();
  }

  public delete(filters: AdFilters) {
    QinTools.qinpel();
  }
}
