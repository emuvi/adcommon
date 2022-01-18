import { QinColumn, QinField, QinLine, QinMutantsArm, QinPanel, QinTabs } from "qinpel-cps";
import { AdExpect } from "./ad-expect";
import { AdField } from "./ad-field";
import { AdModel } from "./ad-model";

export class AdRegister extends QinPanel {

  private _expect: AdExpect;
  private _model: AdModel;

  private tabs: QinTabs = null;
  private column: QinColumn = null;
  private line: QinLine = null;

  public constructor(expect: AdExpect, table: string) {
      super();
      this._expect = expect;
      this._model = new AdModel(table);
  }

  public addTab(title: string) {
      if (this.tabs == null) {
          this.tabs = new QinTabs();
          this.tabs.install(this);
      }
      this.column = new QinColumn();
      this.tabs.addTab({title, viewer: this.column});
      this.line = new QinLine();
      this.line.install(this.column);
  }

  public addLine() {
      if (this.column == null) {
          this.column = new QinColumn();
          this.column.install(this);
      }
      this.line = new QinLine();
      this.line.install(this.column);
  }

  public addView(field: AdField) {
      this._model.addField(field);
      if (this.line == null) {
          this.addLine();
      }
      const editor = QinMutantsArm.newEdit(field.kind, field.options);
      if (field.title) {
          const viewer = new QinField(field.title, editor);
          viewer.install(this.line);
      } else {
          editor.install(this.line);
      }
  }

	public get expect(): AdExpect {
		return this._expect;
	}

	public get model(): AdModel {
		return this._model;
	}

}
