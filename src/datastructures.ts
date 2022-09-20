// Generic vector type has to be dirty otherwise methods like .map()
// and .filter() don't work
type VectorGeneric = (number | string | boolean)[];

type ValidMappings = "x" | "y" | "size" | "col" | "shape" | "_indicator";
type Mapping = Map<ValidMappings, string>;

const baseMembershipArray = [1, 2, 3];
const validMembershipArray = [
  ...baseMembershipArray,
  ...baseMembershipArray.map((e) => e + 128),
  128,
];
type ValidMemberships = typeof validMembershipArray[number];

type Point = [number, number];
type Rect2Points = [[number, number], [number, number]];

const plotTypeArray = ["scatter", "bubble", "bar", "histo", "square"];
type PlotTypes = typeof plotTypeArray[number];

export {
  VectorGeneric,
  ValidMappings,
  Mapping,
  baseMembershipArray,
  validMembershipArray,
  ValidMemberships,
  Point,
  Rect2Points,
  plotTypeArray,
  PlotTypes,
};
