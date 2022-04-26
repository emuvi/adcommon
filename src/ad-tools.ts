import { AdFilters } from "./ad-filters";
import { AdModule } from "./ad-consts";
import { AdOptions } from "./ad-consts";
import { AdScopes } from "./ad-consts";

function newAdOption(module: AdModule, scopes: AdScopes, filters?: AdFilters) {
    var result = {};
    result[AdOptions.MODULE] = module;
    result[AdOptions.SCOPES] = scopes;
    result[AdOptions.FILTERS] = filters;
    return result;
}

export const AdTools = {
    newAdOption
};
