import { AdDelete } from "./ad-delete";
import { AdField } from "./ad-field";
import { AdFilter, AdFilterLikes, AdFilterSeems, AdFilterTies } from "./ad-filter";
import { AdInsert } from "./ad-insert";
import { AdRegister } from "./ad-register";
import { AdTyped } from "./ad-typed";
import { AdValued } from "./ad-valued";

export class AdRegModel {
  private _reg: AdRegister;
  private _fields: AdField[] = [];
  private _typeds: AdTyped[] = null;

  public constructor(register: AdRegister) {
    this._reg = register;
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
    this._fields[index].data = data;
  }

  public clean() {
    for (let field of this._fields) {
      field.clean();
    }
  }

  public turnReadOnly() {
    for (let field of this._fields) {
      field.turnReadOnly();
    }
  }

  public turnEditable() {
    for (let field of this._fields) {
      field.turnEditable();
    }
  }

  public hasMutations(): string[] {
    let result: Array<string> = null;
    for (let field of this._fields) {
      if (field.hasMutations()) {
        if (result == null) {
          result = [];
        }
        result.push(field.title);
      }
    }
    return result;
  }

  public undoMutations() {
    for (let field of this._fields) {
      field.undoMutations();
    }
  }

  public async insert(): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      let valueds = new Array<AdValued>();
      for (let field of this._fields) {
        valueds.push(field.valued);
      }
      let inserting = {
        registry: this._reg.registry,
        valueds: valueds,
      } as AdInsert;
      this._reg.qinpel.chief.talk
        .post("/reg/new", inserting)
        .then((_) => {
          resolve(true);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  public async delete(): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      let deleting = {
        registry: this._reg.registry,
        filters: this.getKeyFieldsFilter(),
        limit: 1,
      } as AdDelete;
      this._reg.qinpel.chief.talk
        .post("/reg/del", deleting)
        .then((_) => {
          resolve(true);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  private getKeyFieldsFilter(): AdFilter[] {
    let result: AdFilter[] = [];
    for (let field of this._fields) {
      if (field.key) {
        let filter = new AdFilter({
          seems: AdFilterSeems.SAME,
          likes: AdFilterLikes.EQUALS,
          valued: field.valued,
          ties: AdFilterTies.AND,
        });
        result.push(filter);
      }
    }
    return result;
  }
}
