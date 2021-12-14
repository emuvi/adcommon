import { AdFilters } from "./ad-filters";
import { AdModules } from "./ad-modules";
import { AdOptions } from "./ad-options";
import { AdScopes } from "./ad-scopes";

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