import { QinWaiter } from "qinpel-res";
import { AdActions } from "./ad-actions";
import { AdFilter } from "./ad-filter";

export class AdExpect {

    private action: AdActions;
    private filter: AdFilter;
    private waiters: QinWaiter[] = [];

    public constructor(action: AdActions, filter?: AdFilter) {
        this.action = action;
        this.filter = filter;
    }

    public getAction(): AdActions {
        return this.action;
    }

    public getFilter(): AdFilter {
        return this.filter;
    }

    public addWaiter(waiter: QinWaiter): AdExpect {
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