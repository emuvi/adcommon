import { QinMutants, QinMutantsArm, QinEdit } from "qinpel-cps";

export class AdField {

    private _title: string;
    private _key: boolean;
    private _name: string;
    private _kind: QinMutants;
    private _options: any;

	constructor(newer: AdFieldNewer) {
        this._title = newer.title;
        this._name = newer.name;
		this._kind = newer.kind;
		this._options = newer.options;
		this._key = newer.key ? true : false;
	}

    public newEdit(): QinEdit {
        return QinMutantsArm.newEdit(this._kind, this._options);
    }

    /**
     * Getter title
     * @return {string}
     */
	public get title(): string {
		return this._title;
	}

    /**
     * Getter name
     * @return {string}
     */
	public get name(): string {
		return this._name;
	}

    /**
     * Getter kind
     * @return {QinMutants}
     */
	public get kind(): QinMutants {
		return this._kind;
	}

    /**
     * Getter options
     * @return {any}
     */
	public get options(): any {
		return this._options;
	}

    /**
     * Getter key
     * @return {boolean}
     */
	public get key(): boolean {
		return this._key;
	}

}

export type AdFieldNewer = {
    title?: string,
    name: string,
    kind: QinMutants,
    options?: any,
    key?: boolean,
};