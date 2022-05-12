import { AdField } from "./ad-field";
import { AdInsert } from "./ad-insert";
import { AdRegister } from "./ad-register";
import { AdTyped } from "./ad-typed";
import { AdValued } from "./ad-valued";

export class AdModel {
  private _register: AdRegister;
  private _fields: AdField[] = [];
  private _typeds: AdTyped[] = null;

  public constructor(register: AdRegister) {
    this._register = register;
  }

  public get register(): AdRegister {
    return this._register;
  }

  public get fields(): AdField[] {
    return this._fields;
  }

  public get typeds(): AdTyped[] {
    if (this._typeds == null) {
      this._typeds = [];
      for (let field of this._fields) {
        this._typeds.push(field.typed);
      }
    }
    return this._typeds;
  }

  public addField(field: AdField) {
    this._fields.push(field);
  }

  public getFieldByName(name: string): AdField {
    for (let field of this._fields) {
      if (field.name === name) {
        return field;
      }
    }
    return null;
  }

  public setData(index: number, data: any) {
    this._fields[index].edit.setData(data);
  }

  public clean() {
    for (let field of this._fields) {
      field.clean();
    }
  }

  public turnReadOnly() {
    for (let field of this._fields) {
      field.edit.turnReadOnly();
    }
  }

  public turnEditable() {
    for (let field of this._fields) {
      field.edit.turnEditable();
    }
  }

  public undoMutations() {
    // [ TODO ] - Implement undoMutations on the model.
  }

  public async insert(): Promise<AdInsert> {
    return new Promise<AdInsert>((resolve, reject) => {
      let valueds = new Array<AdValued>();
      for (let field of this._fields) {
        valueds.push({
          name: field.name,
          type: field.edit.getNature(),
          data: field.edit.getData(),
        });
      }
      let insert = {
        registry: this.register.registry,
        valueds: valueds,
      } as AdInsert;
      this.register.qinpel.chief.talk
        .post("/reg/new", insert)
        .then((_) => {
          resolve(insert);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
}
