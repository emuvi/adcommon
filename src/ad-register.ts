import { AdField } from "./ad-field";
import { AdModel } from "./ad-model";

export class AdRegister {

    private _title: string;
    private _model: AdModel;

    public constructor(title: string, table: string) {
        this._title = title;
        this._model = new AdModel(table);
    }

    public addTab(title: string) {

    }

    public addLine() {

    }

    public addView(title: string, field: AdField) {
        this._model.addField(field);
    }

}