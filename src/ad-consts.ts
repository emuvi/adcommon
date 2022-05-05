import { QinAsset } from "qinpel-cps";

export enum AdOptions {
  MODULE = "module",
  SCOPES = "scopes",
  FILTERS = "filters",
}

export type AdScopes = AdScope[];

export enum AdScope {
  ALL = "all",
  INSERT = "insert",
  SEARCH = "search",
  MUTATE = "mutate",
  DELETE = "delete",
}

export type AdModule = {
  app: string;
  title: string;
  icon: QinAsset;
};

export function isSameModule(one: AdModule, two: AdModule): boolean {
  return one?.app == two?.app && one?.title == two?.title;
}
