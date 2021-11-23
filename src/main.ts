import { QinWaiter } from "qinpel-res";

export enum AdModules {
    BUSINESS = "business",
    REGION = "region",
    NATION = "nation",
    STATE = "state",
    CITY = "city",
    DISTRICT = "district",
    PEOPLE = "people",
    PEOPLE_GROUP = "people_group",
    PEOPLE_SUBGROUP = "people_subgroup",
}

export enum AdActions {
    ALL = "all",
    SEARCH = "search",
    INSERT = "insert",
    EDIT = "edit",
    DELETE = "delete",
}

export enum AdOptions {
    MODULE = "module",
    ACTION = "action",
    FILTER = "filter",
}

export class AdModule {

    private action: AdActions;
    private filter: any;
    private waiters: QinWaiter[] = [];

    public constructor(action: AdActions, filter?: any) {
        this.action = action;
        this.filter = filter;
    }

    public getAction(): AdActions {
        return this.action;
    }

    public getFilter(): any {
        return this.filter;
    }

    public addWaiter(waiter: QinWaiter): AdModule {
        this.waiters.push(waiter);
        return this;
    }

    public hasWaiter(): boolean {
        return this.waiters.length > 0;
    }

    public sendWaiters(result: any) {
        for (const waiter of this.waiters) {
            waiter(result);
        }
    }

}

function newAdOption(module: AdModules, action: AdActions, filter?: any) {
    var result = {};
    result[AdOptions.MODULE] = module;
    result[AdOptions.ACTION] = action;
    result[AdOptions.FILTER] = filter;
    return result;
}

export default {
    newAdOption
};