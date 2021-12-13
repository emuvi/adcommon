import { QinTools } from "qinpel-cps";
import { AdField } from "./ad-field";

export class AdModel {

    private _table: string;
    private _fields: AdField[];

    public constructor(table: string) {
        this._table = table;
        this._fields = [];
    }

    public addField(field: AdField) {
        this._fields.push(field);
    }

    public insert(values: any) {
        QinTools.qinpel();
    }

    public search(filters: any) {
        QinTools.qinpel();
    }

    public update(values: any, filters: any) {
        QinTools.qinpel();
    }

    public delete(filters: any) {
        QinTools.qinpel();
    }

}