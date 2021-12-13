import { AdActions } from "./ad-actions";
import { AdModules } from "./ad-modules";
import { AdOptions } from "./ad-options";
import { AdFilter } from "./ad-filter";

function newAdOption(module: AdModules, action: AdActions, filter?: AdFilter) {
    var result = {};
    result[AdOptions.MODULE] = module;
    result[AdOptions.ACTION] = action;
    result[AdOptions.FILTER] = filter;
    return result;
}

export const AdTools = {
    newAdOption
};