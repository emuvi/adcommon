import { QinTools } from "qinpel-cps";
import { AdField } from "./ad-field";
import { AdFilter } from "./ad-filter"

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

    public search(filters: AdFilter) {
        QinTools.qinpel();
    }

    public update(values: any, filters: AdFilter) {
        QinTools.qinpel();
    }

    public delete(filters: AdFilter) {
        QinTools.qinpel();
    }

}