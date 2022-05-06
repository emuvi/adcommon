import {
  QinAsset,
  QinButton,
  QinColumn,
  QinCombo,
  QinComboItem,
  QinIcon,
  QinLine,
  QinScroll,
  QinString,
} from "qinpel-cps";
import { AdField } from "./ad-field";
import { AdFilter, AdFilterLikes, AdFilterSeems, AdFilterTies } from "./ad-filter";
import { AdRegister } from "./ad-register";

export class AdRegSearch extends QinScroll {
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

  public get reg(): AdRegister {
    return this._reg;
  }

  public addField(field: AdField) {
    this._clauses.forEach((clause) => {
      clause.addField({ title: field.title, value: field.name });
    });
  }

  // [ TODO ] - Make addClause private
  public addClause(after: SearchClause) {
    const clause = new SearchClause(this);
    this._reg.model.fields.forEach((field) => {
      clause.addField({ title: field.title, value: field.name });
    });
    const index = this._clauses.indexOf(after);
    this._clauses.splice(index + 1, 0, clause);
    this.rebuild();
  }

  // [ TODO ] - Make delClause private
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

  public getFilters(): AdFilter[] {
    let results: AdFilter[] = null;
    this._clauses.forEach((clause) => {
      let filter = clause.getFilter();
      if (filter) {
        if (!results) {
          results = [];
        }
        results.push(filter);
      }
    });
    return results;
  }
}

class SearchClause extends QinLine {
  private _dad: AdRegSearch;

  private _qinSame = new SearchSame();
  private _qinField = new QinCombo();
  private _qinLikes = new SearchCondition();
  private _qinValue = new QinString();
  private _qinTies = new SearchTie();

  private _qinAdd = new QinButton({ icon: new QinIcon(QinAsset.FacePlus) });
  private _qinDel = new QinButton({ icon: new QinIcon(QinAsset.FaceMinus) });

  public constructor(dad: AdRegSearch) {
    super();
    this._dad = dad;
    this._qinSame.install(this);
    this._qinField.addItem({ title: "", value: "" });
    this._qinField.install(this);
    this._qinLikes.install(this);
    this._qinValue.install(this);
    this._qinTies.install(this);
    this._qinAdd.install(this);
    this._qinDel.install(this);
    this._qinAdd.addActionMain((_) => {
      this._dad.addClause(this);
    });
    this._qinDel.addActionMain((_) => {
      this._dad.delClause(this);
    });
    this.style.putAsPaddingBottom(4);
    this.style.putAsBorderBottom(2, "#bbb");
    this.style.putAsMarginBottom(4);
  }

  public addField(item: QinComboItem) {
    this._qinField.addItem(item);
  }

  public clear() {
    this._qinSame.setData("EQUALS");
    this._qinLikes.setData("EQUALS");
    this._qinValue.setData(null);
    this._qinTies.setData("AND");
  }

  public getFilter(): AdFilter {
    let fieldName = this._qinField.getData();
    if (!fieldName) {
      return null;
    }
    const field = this._dad.reg.model.getFieldByName(fieldName);
    if (!field) {
      return null;
    }
    return new AdFilter({
      seems: this._qinSame.getData() as AdFilterSeems,
      likes: this._qinLikes.getData() as AdFilterLikes,
      valued: field.valued,
      ties: this._qinTies.getData() as AdFilterTies,
    });
  }
}

class SearchSame extends QinCombo {
  public constructor() {
    super();
    this.addItem({ title: "==", value: "SAME" });
    this.addItem({ title: "!=", value: "DIVERSE" });
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
