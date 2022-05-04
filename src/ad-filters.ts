export class AdFilters {
  private _items: AdFilterItem[];

  constructor(items: AdFilterItem[]) {
    this._items = items;
  }

  public get items(): AdFilterItem[] {
    return this._items;
  }
}

export class AdFilterItem {
  private _name: string;
  private _mode: AdFilterLikes;
  private _value: any;
  private _union: AdFilterTie;

  constructor(name: string, mode: AdFilterLikes, value: any, union: AdFilterTie) {
    this._name = name;
    this._mode = mode;
    this._value = value;
    this._union = union;
  }

  public get name(): string {
    return this._name;
  }

  public get mode(): AdFilterLikes {
    return this._mode;
  }

  public get value(): any {
    return this._value;
  }

  public get union(): AdFilterTie {
    return this._union;
  }
}

export enum AdFilterLikes {
  EQUALS = "equals",
  DIFFERENT = "different",
  BIGGER = "bigger",
  LESSER = "lesser",
  BIGGER_OR_EQUALS = "bigger_or_equals",
  LESSER_OR_EQUALS = "lesser_or_equals",
}

export enum AdFilterTie {
  AND = "and",
  OR = "or",
}
