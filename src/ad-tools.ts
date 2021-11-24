import { AdActions } from "./ad-actions";
import { AdModules } from "./ad-modules";
import { AdOptions } from "./ad-options";

function newAdOption(module: AdModules, action: AdActions, filter?: any) {
    var result = {};
    result[AdOptions.MODULE] = module;
    result[AdOptions.ACTION] = action;
    result[AdOptions.FILTER] = filter;
    return result;
}

export const AdTools = {
    newAdOption
};