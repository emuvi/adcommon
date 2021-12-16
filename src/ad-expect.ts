import { QinWaiters } from "qinpel-res";
import { AdScopes } from "./ad-consts";
import { AdFilters } from "./ad-filters";

export class AdExpect {

    private _scopes: AdScopes;
    private _filters: AdFilters;
    private _waiters: QinWaiters;

    public constructor(options: AdExpectOptions) {
        this._scopes = options.scopes;
        this._filters = options.filters;
		this._waiters = options.waiters;
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

	/**
	 * Getter waiters
	 * @return {QinWaiters}
	 */
	public get waiters(): QinWaiters {
		return this._waiters;
	}

}

export type AdExpectOptions = {
	scopes: AdScopes,
	filters?: AdFilters,
	waiters?: QinWaiters,
};
