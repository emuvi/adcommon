import { QinWaiter } from "qinpel-res";
import { AdScopes } from "./ad-scopes";
import { AdFilters } from "./ad-filters";

export class AdExpect {

    private _scopes: AdScopes;
    private _filters: AdFilters;
    
    private waiters: QinWaiter[] = [];

    public constructor(scopes: AdScopes, filters?: AdFilters) {
        this._scopes = scopes;
        this._filters = filters;
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

    /**
     * Getter scopes
     * @return {AdScopes}
     */
	public get scopes(): AdScopes {
		return this._scopes;
	}

    /**
     * Getter filters
     * @return {AdFilters}
     */
	public get filters(): AdFilters {
		return this._filters;
	}

}