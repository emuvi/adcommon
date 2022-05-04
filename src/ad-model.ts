import { QinTools } from "qinpel-cps";
import { AdField } from "./ad-field";
import { AdFilters } from "./ad-filters";

export class AdModel {
  private _registry: AdRegistry;
  private _fields: AdField[];

  public constructor(registry: AdRegistry) {
    this._registry = registry;
    this._fields = [];
  }

  public get registry(): AdRegistry {
    return this._registry;
  }

  public get fields(): AdField[] {
    return this._fields;
  }

  public addField(field: AdField) {
    this._fields.push(field);
  }

  public insert() {
    QinTools.qinpel();
  }

  public search(filters: AdFilters) {
    QinTools.qinpel();
  }

  public update(filters: AdFilters) {
    QinTools.qinpel();
  }

  public delete(filters: AdFilters) {
    QinTools.qinpel();
  }
}

export type AdRegistry = {
  base: string;
  catalog?: string;
  schema?: string;
  name?: string;
  alias?: string;
};
