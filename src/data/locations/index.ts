// TODO:
// If we add thousands of city, ZIP, or neighborhood pages later,
// move location lookup/rendering to a Cloudflare Worker route.
// For now, use Astro getStaticPaths() so pages are built cleanly and deployed through Cloudflare Pages.

import { illinois } from "./illinois";
import { iowa } from "./iowa";

export type { LocalCity, StateLocation } from "./types";

export const locations = [illinois, iowa];

export function getStateBySlug(stateSlug: string) {
  return locations.find((state) => state.slug === stateSlug);
}

export function getCityBySlug(stateSlug: string, citySlug: string) {
  const state = getStateBySlug(stateSlug);
  return state?.cities.find((city) => city.slug === citySlug);
}

export function getAllStatePages() {
  return locations;
}

export function getAllCityPages() {
  return locations.flatMap((state) =>
    state.cities.map((city) => ({
      state,
      city,
    }))
  );
}
