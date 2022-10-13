import * as plts from "./plot/plots.js";
import * as hndl from "handlers/handlers.js";
import { DataFrame } from "./DataFrame";

// Generic vector type has to be dirty otherwise methods like .map()
// and .filter() don't work
type VectorGeneric = (number | string | boolean)[];

type ValidMappings = "x" | "y" | "size" | "col" | "shape" | "_indicator";
type Mapping = Map<ValidMappings, string>;

const baseMembershipArray = [1, 2, 3, 4];
const validMembershipArray = [
  ...baseMembershipArray,
  ...baseMembershipArray.map((e) => e + 128),
  128,
];
const highlightMembershipArray = validMembershipArray.filter((e) => e !== 1);
type ValidMemberships = typeof validMembershipArray[number];

type Point = [number, number];
type Rect2Points = [[number, number], [number, number]];

const plotTypeArray = [
  "scatter",
  "bubble",
  "bar",
  "histo",
  "square",
  "squareheat",
];
type PlotTypes = typeof plotTypeArray[number];

type Globals = {
  nPlots: number;
  scaleFactor: number;
  sceneWidth: number;
  sceneHeight: number;
  plotWidth: number;
  plotHeight: number;
  data: DataFrame;
  handlers: {
    marker: hndl.MarkerHandler;
    keypress: hndl.KeypressHandler;
    state: hndl.StateHandler;
  };
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
  Globals,
};
