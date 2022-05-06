import { AdValued } from "./ad-valued";

export class AdFilter {
  public seems: AdFilterSeems;
  public likes: AdFilterLikes;
  public valued: AdValued;
  public ties: AdFilterTies;

  constructor(options?: AdFilterSet) {
    this.seems = options?.seems;
    this.likes = options?.likes;
    this.valued = options?.valued;
    this.ties = options?.ties;
  }
}

export type AdFilterSet = {
  seems?: AdFilterSeems;
  likes?: AdFilterLikes;
  valued?: AdValued;
  ties?: AdFilterTies;
};

export enum AdFilterSeems {
  SAME = "SAME",
  DIVERSE = "DIVERSE",
}

export enum AdFilterLikes {
  EQUALS = "EQUALS",
  BIGGER = "BIGGER",
  LESSER = "LESSER",
  BIGGER_EQUALS = "BIGGER_EQUALS",
  LESSER_EQUALS = "LESSER_EQUALS",
  STARTS_WITH = "STARTS_WITH",
  ENDS_WITH = "ENDS_WITH",
  CONTAINS = "CONTAINS",
}

export enum AdFilterTies {
  AND = "AND",
  OR = "OR",
}
