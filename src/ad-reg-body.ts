import { QinColumn, QinField, QinLine, QinMutantsArm, QinPanel, QinTabs } from "qinpel-cps";
import { AdField } from "./ad-field";
import { AdRegister } from "./ad-register";

export class AdRegBody extends QinPanel {
  private _reg: AdRegister;

  private _tabs: QinTabs = null;
  private _column: QinColumn = null;
  private _line: QinLine = null;

  public constructor(register: AdRegister) {
    super();
    this._reg = register;
  }

  public addTab(title: string) {
    if (this._tabs == null) {
      this._tabs = new QinTabs();
      this._tabs.install(this);
    }
    this._column = new QinColumn();
    this._tabs.addTab({ title, viewer: this._column });
    this._line = new QinLine();
    this._line.install(this._column);
  }

  public addLine() {
    if (this._column == null) {
      this._column = new QinColumn();
      this._column.install(this);
    }
    this._line = new QinLine();
    this._line.install(this._column);
  }

  public addView(field: AdField) {
    this._reg.model.addField(field);
    if (this._line == null) {
      this.addLine();
    }
    const editor = QinMutantsArm.newEdit(field.kind, field.options);
    if (field.title) {
      const viewer = new QinField(field.title, editor);
      viewer.install(this._line);
    } else {
      editor.install(this._line);
    }
  }
}
