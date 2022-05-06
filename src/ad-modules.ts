import { QinAsset } from "qinpel-cps";
import { AdModule } from "./ad-tools";

export class AdModules {
  static BUSINESS: AdModule = {
    app: "adpeople",
    title: "Negócios",
    icon: QinAsset.FaceGlobe,
  };
  static REGION: AdModule = {
    app: "adpeople",
    title: "Região",
    icon: QinAsset.FaceRegion,
  };
  static NATION: AdModule = {
    app: "adpeople",
    title: "Países",
    icon: QinAsset.FaceGlobe,
  };
  static STATE: AdModule = {
    app: "adpeople",
    title: "Estados",
    icon: QinAsset.FaceGlobe,
  };
  static CITY: AdModule = {
    app: "adpeople",
    title: "Cidades",
    icon: QinAsset.FaceGlobe,
  };
  static DISTRICT: AdModule = {
    app: "adpeople",
    title: "Bairros",
    icon: QinAsset.FaceGlobe,
  };
  static PEOPLE: AdModule = {
    app: "adpeople",
    title: "Pessoas",
    icon: QinAsset.FaceGlobe,
  };
  static PEOPLE_GROUP: AdModule = {
    app: "adpeople",
    title: "Grupos de Pessoas",
    icon: QinAsset.FaceGlobe,
  };
  static PEOPLE_SUBGROUP: AdModule = {
    app: "adpeople",
    title: "SubGrupos de Pessoas",
    icon: QinAsset.FaceGlobe,
  };
}
