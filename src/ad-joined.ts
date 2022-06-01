import { AdFilter } from "./ad-filter";
import { AdRegistry } from "./ad-registry";

export type AdJoined = {
  ties?: AdJoinedTies;
  registry: AdRegistry;
  alias?: string;
  filters?: AdFilter[];
};

export enum AdJoinedTies {
  INNER,
  LEFT,
  RIGHT,
  FULL,
  CROSS,
}
