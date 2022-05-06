import { QinEdit, QinMutants, QinMutantsArm } from "qinpel-cps";
import { AdTyped } from "./ad-typed";
import { AdValued } from "./ad-valued";

export class AdField {
  private _title: string;
  private _key: boolean;
  private _name: string;
  private _kind: QinMutants;
  private _alias: string;
  private _options: any;

  private _edit: QinEdit = null;
  private _typed: AdTyped = null;

  constructor(newer: AdFieldSet) {
    this._title = newer.title;
    this._name = newer.name;
    this._kind = newer.kind;
    this._options = newer.options;
    this._key = newer.key ? true : false;
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

  public get edit(): QinEdit {
    if (this._edit == null) {
      this._edit = QinMutantsArm.newEdit(this._kind, this._options);
    }
    return this._edit;
  }

  public get typed(): AdTyped {
    if (this._typed == null) {
      this._typed = {
        name: this._name,
        type: this.edit.getNature(),
        alias: this._alias,
      };
    }
    return this._typed;
  }

  public get valued(): AdValued {
    return {
      name: this._name,
      type: this.edit.getNature(),
      data: this.edit.getData(),
    };
  }

  public clean() {
    this.edit.setData(null);
  }

  public focus() {
    this.edit.focus();
  }
}

export type AdFieldSet = {
  title?: string;
  name: string;
  kind: QinMutants;
  alias?: string;
  options?: any;
  key?: boolean;
};
