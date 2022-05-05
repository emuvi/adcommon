import { QinNature } from "qinpel-res";

export type AdRegistry = {
  base: string;
  catalog?: string;
  schema?: string;
  name: string;
  alias?: string;
};

export type AdValued = {
  name: string;
  type: QinNature;
  data: any;
};

export type AdInsert = {
  registry: AdRegistry;
  valueds: AdValued[];
};
