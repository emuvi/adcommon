import { AdFilter } from "./ad-filter";
import { AdRegistry } from "./ad-registry";

export type AdJoined = {
  ties?: AdJoinedTies;
  registry: AdRegistry;
  filters: AdFilter[];
};

export enum AdJoinedTies {
  INNER,
  LEFT,
  RIGHT,
  FULL,
  CROSS,
}
