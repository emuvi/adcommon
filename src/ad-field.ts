import { QinBase, QinEdit, QinField, QinMutants, QinMutantsArm } from "qinpel-cps";
import { AdTyped } from "./ad-typed";
import { AdValued } from "./ad-valued";

export class AdField {
  private _title: string;
  private _key: boolean;
  private _name: string;
  private _alias: string;
  private _kind: QinMutants;
  private _options: any;

  private _edit: QinEdit = null;
  private _typed: AdTyped = null;

  private _data: any = null;

  constructor(newer: AdFieldSet) {
    this._title = newer.title;
    this._name = newer.name;
    this._alias = newer.alias;
    this._kind = newer.kind;
    this._options = newer.options;
    this._key = newer.key ?? false;
    this.init();
  }

  private init() {
    this._edit = QinMutantsArm.newEdit(this._kind, this._options);
    this._typed = {
      name: this._name,
      type: this._edit.getNature(),
      alias: this._alias,
    };
  }

  public get title(): string {
    return this._title;
  }

  public get name(): string {
    return this._name;
  }

  public get kind(): QinMutants {
    return this._kind;
  }

  public get alias(): string {
    return this._alias;
  }

  public get options(): any {
    return this._options;
  }

  public get key(): boolean {
    return this._key;
  }

  public get typed(): AdTyped {
    return this._typed;
  }

  public get valued(): AdValued {
    let name = this._name;
    let type = this._edit.getNature();
    let data = this._edit.getData();
    return { name, type, data };
  }

  public get data(): any {
    let result = this._edit.getData();
    if (result === "") {
      result = null;
    }
    return result;
  }

  public set data(newData: any) {
    this._edit.setData(newData);
    this._data = newData;
  }

  public install(on: QinBase) {
    if (this._title) {
      const titled = new QinField(this._title, this._edit);
      titled.install(on);
    } else {
      this._edit.install(on);
    }
  }

  public hasMutations(): boolean {
    let early = this._data;
    let byNow = this.data;
    return early != byNow;
  }

  public undoMutations() {
    this._edit.setData(this._data);
  }

  public clean() {
    this.data = null;
  }

  public turnReadOnly() {
    this._edit.turnReadOnly();
  }

  public turnEditable() {
    this._edit.turnEditable();
  }

  public focus() {
    this._edit.focus();
  }
}

export type AdFieldSet = {
  title?: string;
  name: string;
  alias?: string;
  kind: QinMutants;
  options?: any;
  key?: boolean;
};
