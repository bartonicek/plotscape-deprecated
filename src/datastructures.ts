import * as plts from "./plot/plots.js";
import * as hndl from "handlers/handlers.js";
import { DataFrame } from "./DataFrame";

// Generic vector type has to be dirty otherwise methods like .map()
// and .filter() don't work
type VectorGeneric = (number | string | boolean)[];

type ValidMappings = "x" | "y" | "size" | "col" | "shape" | "_indicator";
type Mapping = Map<ValidMappings, string>;

type Point = [number, number];
type Rect2Points = [[number, number], [number, number]];

const baseMembershipArray = [1, 2, 3, 4] as const;
const transientMembershipArray = [129, 130, 131, 132] as const;
const validMembershipArray = [
  ...baseMembershipArray,
  ...transientMembershipArray,
  128,
] as const;
const [, ...highlightMembershipArray] = validMembershipArray;
type ValidMemberships = typeof validMembershipArray[number];

const plotTypeArray = [
  "scatter",
  "bubble",
  "bar",
  "histo",
  "square",
  "squareheat",
] as const;
type PlotTypes = typeof plotTypeArray[number];

type PlotConfig = {
  id: string;
  element: HTMLDivElement;
  data: DataFrame;
  mapping: Mapping;
  globals: Globals;
  dimensions?: { width: number; height: number };
};

type Globals = {
  size: hndl.SizeHandler;
  marker: hndl.MarkerHandler;
  keypress: hndl.KeypressHandler;
  state: hndl.StateHandler;
};

export {
  VectorGeneric,
  ValidMappings,
  Mapping,
  baseMembershipArray,
  validMembershipArray,
  highlightMembershipArray,
  ValidMemberships,
  Point,
  Rect2Points,
  plotTypeArray,
  PlotTypes,
  PlotConfig,
  Globals,
};
