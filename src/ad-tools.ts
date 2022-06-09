import { QinAsset } from "qinpel-cps";
import { AdFilter } from "./ad-filter";
import { AdNames } from "./ad-names";

export type AdSetup = {
  module: AdModule;
  scopes: AdScope[];
  filters?: AdFilter[];
};

export enum AdScope {
  ALL = "all",
  INSERT = "insert",
  SEARCH = "search",
  NOTICE = "notice",
  RELATE = "relate",
  MUTATE = "mutate",
  DELETE = "delete",
}

export type AdModule = {
  appName: string;
  title: string;
  icon: QinAsset;
};

function isSameModule(one: AdModule, two: AdModule): boolean {
  return one?.appName == two?.appName && one?.title == two?.title;
}

function newAdSetup(module: AdModule, scopes: AdScope[], filters?: AdFilter[]): AdSetup {
  return {
    module,
    scopes,
    filters,
  };
}

function newAdSetupOption(module: AdModule, scopes: AdScope[], filters?: AdFilter[]) {
  let result = {};
  result[AdNames.AdSetup] = newAdSetup(module, scopes, filters);
  return result;
}

export const AdTools = {
  isSameModule,
  newAdSetup,
  newAdSetupOption,
};
