import { QinBoolean, QinColumn, QinCombo, QinComboItem, QinLine, QinPanel, QinString } from "qinpel-cps";
import { AdField } from "./ad-field";
import { AdRegister } from "./ad-register";

export class AdRegSearch extends QinColumn {
  private _reg: AdRegister;
  private _clauses: SearchClause[] = [];

  public constructor(register: AdRegister) {
    super();
    this._reg = register;
    const first = new SearchClause();
    this._clauses.push(first);
    first.install(this);
  }

  public addField(field: AdField) {
    this._clauses.forEach(clause => {
      clause.fields.addItem({title: field.title, value: field.name});
    });
  }
}

class SearchClause extends QinLine {
  negate = new QinBoolean();
  fields = new QinCombo();
  conditions = new SearchCondition();
  valued = new QinString();

  public constructor() {
    super();
    this.negate.install(this);
    this.fields.install(this);
    this.conditions.install(this);
    this.valued.install(this);
  }
}

class SearchCondition extends QinCombo {
  public constructor() {
    super();
    this.addItem({title: "=", value: "EQUALS"});
    this.addItem({title: ">", value: "BIGGER"});
    this.addItem({title: "<", value: "LESSER"});
    this.addItem({title: ">=", value: "BIGGER_EQUALS"});
    this.addItem({title: "<=", value: "LESSER_EQUALS"});
    this.addItem({title: "$%", value: "STARTS_WITH"});
    this.addItem({title: "%$", value: "ENDS_WITH"});
    this.addItem({title: "%$%", value: "CONTAINS"});
  }
}
