import * as hndl from "handlers/handlers.js";
import { GraphicLayer } from "./plot/GraphicLayer";

type MethodsOf<Type> = Pick<
  Type,
  {
    [key in keyof Type]: Type[key] extends () => void ? key : never;
  }[keyof Type]
>;

// Generic vector type has to be dirty otherwise methods like .map()
// and .filter() don't work
type VectorGeneric = (number | string | boolean)[];

class DataFrame {
  [key: string]: VectorGeneric;
  constructor(data: { [key: string]: VectorGeneric }) {
    Object.keys(data).forEach((e) => (this[e] = data[e]));
    this._indicator = Array(
      (this[Object.keys(this)[0]] as VectorGeneric).length
    ).fill(1);
  }
}

type ValidMappings = "x" | "y" | "size" | "fillSize" | "_indicator";
class Mapping extends Map<ValidMappings, string> {
  constructor(...mappings: [ValidMappings, string][]) {
    super([...mappings]);
    if (!this.has("y")) this.set("y", "_indicator");
  }
}

type Point = [number, number];
type Rect2Points = [[number, number], [number, number]];

type RepresentationType = {
  boundingRects: Rect2Points[];
  defaultize: () => void;
  getMappings: (membership: number) => any[];
  drawBase: (context: GraphicLayer) => void;
  drawHighlight: (context: GraphicLayer) => void;
};

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
};

type Globals = {
  marker: hndl.MarkerHandler;
  keypress: hndl.KeypressHandler;
  state: hndl.StateHandler;
};

export {
  MethodsOf,
  DataFrame,
  VectorGeneric,
  ValidMappings,
  Mapping,
  RepresentationType,
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
