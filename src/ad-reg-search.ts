import {
  QinAsset,
  QinBoolean,
  QinButton,
  QinColumn,
  QinCombo,
  QinComboItem,
  QinIcon,
  QinLine,
  QinPanel,
  QinString,
} from "qinpel-cps";
import { AdField } from "./ad-field";
import { AdRegister } from "./ad-register";

export class AdRegSearch extends QinPanel {
  private _reg: AdRegister;
  private _lines = new QinColumn();
  private _clauses = new Array<SearchClause>();

  public constructor(register: AdRegister) {
    super();
    this._reg = register;
    this._lines.install(this);
    const first = new SearchClause(this);
    this._clauses.push(first);
    first.install(this._lines);
  }

  public addField(field: AdField) {
    this._clauses.forEach((clause) => {
      clause.addField({ title: field.title, value: field.name });
    });
  }

  public addClause(after: SearchClause) {
    const clause = new SearchClause(this);
    this._reg.model.fields.forEach((field) => {
      clause.addField({ title: field.title, value: field.name });
    });
    const index = this._clauses.indexOf(after);
    this._clauses.splice(index + 1, 0, clause);
    this.rebuild();
  }

  public delClause(clause: SearchClause) {
    if (this._clauses.length > 1) {
      const index = this._clauses.indexOf(clause);
      this._clauses.splice(index, 1);
      this.rebuild();
    } else {
      this._clauses[0].clear();
    }
  }

  private rebuild() {
    this._lines.unInstallChildren();
    this._clauses.forEach((clause) => {
      clause.install(this._lines);
    });
  }
}

class SearchClause extends QinLine {
  private _dad: AdRegSearch;
  private _same = new SearchSame();
  private _field = new QinCombo();
  private _likes = new SearchCondition();
  private _value = new QinString();
  private _tie = new SearchTie();
  private _add = new QinButton({ icon: new QinIcon(QinAsset.FacePlus) });
  private _del = new QinButton({ icon: new QinIcon(QinAsset.FaceMinus) });

  public constructor(dad: AdRegSearch) {
    super();
    this._dad = dad;
    this._same.install(this);
    this._field.install(this);
    this._likes.install(this);
    this._value.install(this);
    this._tie.install(this);
    this._add.install(this);
    this._del.install(this);
    this._add.addActionMain((_) => {
      this._dad.addClause(this);
    });
    this._del.addActionMain((_) => {
      this._dad.delClause(this);
    });
  }

  public addField(item: QinComboItem) {
    this._field.addItem(item);
  }

  public clear() {
    this._same.setData("EQUALS");
    this._likes.setData("EQUALS");
    this._value.setData(null);
    this._tie.setData("AND");
  }
}

class SearchSame extends QinCombo {
  public constructor() {
    super();
    this.addItem({ title: "==", value: "EQUALS" });
    this.addItem({ title: "!=", value: "DIVERS" });
    this.style.putAsMaxWidth(64);
  }
}

class SearchCondition extends QinCombo {
  public constructor() {
    super();
    this.addItem({ title: "=", value: "EQUALS" });
    this.addItem({ title: ">", value: "BIGGER" });
    this.addItem({ title: "<", value: "LESSER" });
    this.addItem({ title: ">=", value: "BIGGER_EQUALS" });
    this.addItem({ title: "<=", value: "LESSER_EQUALS" });
    this.addItem({ title: "$_", value: "STARTS_WITH" });
    this.addItem({ title: "_$", value: "ENDS_WITH" });
    this.addItem({ title: "_$_", value: "CONTAINS" });
    this.style.putAsMaxWidth(64);
  }
}

class SearchTie extends QinCombo {
  public constructor() {
    super();
    this.addItem({ title: "&&", value: "AND" });
    this.addItem({ title: "||", value: "OR" });
    this.style.putAsMaxWidth(64);
  }
}
