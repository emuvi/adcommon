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

export enum AdModules {
    BUSINESS = "business",
    REGION = "region",
    NATION = "nation",
    STATE = "state",
    CITY = "city",
    DISTRICT = "district",
    PEOPLE = "people",
    PEOPLE_GROUP = "people_group",
    PEOPLE_SUBGROUP = "people_subgroup",
}
