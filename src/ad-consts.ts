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
  data: string;
};

export function isSameModule(one: AdModule, two: AdModule): boolean {
  return one?.app == two?.app && one?.title == two?.title;
}

export class AdModules {
  static BUSINESS: AdModule = {
    app: "adpeople",
    title: "Negócios",
    icon: QinAsset.FaceGlobe,
    data: "negocios",
  };
  static REGION: AdModule = {
    app: "adpeople",
    title: "Região",
    icon: QinAsset.FaceRegion,
    data: "regioes",
  };
  static NATION: AdModule = {
    app: "adpeople",
    title: "Países",
    icon: QinAsset.FaceGlobe,
    data: "paises",
  };
  static STATE: AdModule = {
    app: "adpeople",
    title: "Estados",
    icon: QinAsset.FaceGlobe,
    data: "estados",
  };
  static CITY: AdModule = {
    app: "adpeople",
    title: "Cidades",
    icon: QinAsset.FaceGlobe,
    data: "cidades",
  };
  static DISTRICT: AdModule = {
    app: "adpeople",
    title: "Bairros",
    icon: QinAsset.FaceGlobe,
    data: "bairros",
  };
  static PEOPLE: AdModule = {
    app: "adpeople",
    title: "Pessoas",
    icon: QinAsset.FaceGlobe,
    data: "pessoas",
  };
  static PEOPLE_GROUP: AdModule = {
    app: "adpeople",
    title: "Grupos de Pessoas",
    icon: QinAsset.FaceGlobe,
    data: "grupos_pessoas",
  };
  static PEOPLE_SUBGROUP: AdModule = {
    app: "adpeople",
    title: "SubGrupos de Pessoas",
    icon: QinAsset.FaceGlobe,
    data: "subgrupos_pessoas",
  };
}
