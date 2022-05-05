import { AdField } from "./ad-field";
import { AdRegister } from "./ad-register";
import { AdInsert, AdValued } from "./ad-swap";

export class AdModel {
  private _register: AdRegister;
  private _fields: AdField[];

  public constructor(register: AdRegister) {
    this._register = register;
    this._fields = [];
  }

  public get register(): AdRegister {
    return this._register;
  }

  public get fields(): AdField[] {
    return this._fields;
  }

  public addField(field: AdField) {
    this._fields.push(field);
  }

  public tryGoFirst() {
    throw new Error("Method not implemented.");
  }

  public tryGoPrior() {
    throw new Error("Method not implemented.");
  }

  public tryGoNext() {
    throw new Error("Method not implemented.");
  }

  public tryGoLast() {
    throw new Error("Method not implemented.");
  }

  public tryDelete() {
    throw new Error("Method not implemented.");
  }

  public tryConfirm() {
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
    this.register.qinpel.chief.talk.post("/reg/new", insert).then((res) => {
      console.log(res);
    });
  }

  public tryCancel() {
    throw new Error("Method not implemented.");
  }
}
