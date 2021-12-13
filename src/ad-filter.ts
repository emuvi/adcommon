import { AdField } from "./ad-field"

export class AdFilter {

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

    private _field: AdField;
    private _mode: AdFilterMode;
    private _value: any;
    private _next: AdFilterNext;

	constructor(field: AdField, mode: AdFilterMode, value: any, next: AdFilterNext) {
        this._field = field;
        this._mode = mode;
        this._value = value;
        this._next = next;
	}

    /**
     * Getter field
     * @return {AdField}
     */
	public get field(): AdField {
		return this._field;
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
     * Getter next
     * @return {AdFilterNext}
     */
	public get next(): AdFilterNext {
		return this._next;
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

export enum AdFilterNext {
    OR = "or",
    AND = "and",
}