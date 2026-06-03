export type LocalCity = {
  slug: string;
  name: string;
  stateSlug: string;
  stateName: string;
  stateAbbreviation: string;
  population: number;
  localPainPoints?: string[];
};

export type StateLocation = {
  slug: string;
  name: string;
  abbreviation: string;
  isActiveMarket: boolean;
  cities: LocalCity[];
};
