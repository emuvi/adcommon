import { AdField } from "./ad-field";

export class AdFilters {

    private _items: AdFilterItem[];

    constructor(items: AdFilterItem[]) {
        this._items = items;
    }

    /**
     * Getter items
     * @return {AdFilterItem[]}
     */
    public get items(): AdFilterItem[] {
        return this._items;
    }

}

export class AdFilterItem {

    private _name: string;
    private _mode: AdFilterMode;
    private _value: any;
    private _union: AdFilterUnion;

    constructor(name: string, mode: AdFilterMode, value: any, union: AdFilterUnion) {
        this._name = name;
        this._mode = mode;
        this._value = value;
        this._union = union;
    }

    /**
     * Getter name
     * @return {string}
     */
	public get name(): string {
		return this._name;
	}

    /**
     * Getter mode
     * @return {AdFilterMode}
     */
    public get mode(): AdFilterMode {
        return this._mode;
    }

    /**
     * Getter value
     * @return {any}
     */
    public get value(): any {
        return this._value;
    }

    /**
     * Getter union
     * @return {AdFilterUnion}
     */
	public get union(): AdFilterUnion {
		return this._union;
	}

}

export enum AdFilterMode {
    EQUALS = "equals",
    DIFFERENT = "different",
    BIGGER = "bigger",
    LESSER = "lesser",
    BIGGER_OR_EQUALS = "bigger_or_equals",
    LESSER_OR_EQUALS = "lesser_or_equals",
}

export enum AdFilterUnion {
    OR = "or",
    AND = "and",
}