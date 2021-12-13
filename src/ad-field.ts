import { QinMutants, QinMutantsArm, QinEdit } from "qinpel-cps";

export class AdField {

    private _name: string;
    private _kind: QinMutants;
    private _options: any;

	constructor(name: string, kind: QinMutants, options: any) {
		this._name = name;
		this._kind = kind;
		this._options = options;
	}

    public newEdit(): QinEdit {
        return QinMutantsArm.newEdit(this._kind, this._options);
    }

}