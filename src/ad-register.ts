import { AdField } from "./ad-field";
import { AdModel } from "./ad-model";

export class AdRegister {

    private _model: AdModel;
    private _title: string;

    public constructor(table: string, title: string) {
        this._model = new AdModel(table);
        this._title = title;
    }

    public addTab(title: string) {

    }

    public addLine() {

    }

    public addField(field: AdField) {
        this._model.addField(field);
    }

}