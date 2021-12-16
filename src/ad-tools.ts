import { AdFilters } from "./ad-filters";
import { AdModules } from "./ad-consts";
import { AdOptions } from "./ad-consts";
import { AdScopes } from "./ad-consts";

function newAdOption(module: AdModules, scopes: AdScopes, filters?: AdFilters) {
    var result = {};
    result[AdOptions.MODULE] = module;
    result[AdOptions.SCOPES] = scopes;
    result[AdOptions.FILTERS] = filters;
    return result;
}

export const AdTools = {
    newAdOption
};
