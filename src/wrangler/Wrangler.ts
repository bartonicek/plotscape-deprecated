import * as dtstr from "../datastructures.js";
import * as funs from "../functions.js";
import { MarkerHandler } from "../handlers/MarkerHandler.js";
import { Cast } from "./Cast.js";

export class Wrangler {
  n: number;
  allUnique: boolean;
  data: dtstr.DataFrame;
  mapping: dtstr.Mapping;
  marker: MarkerHandler;

  by: Set<dtstr.ValidMappings>;
  what: Set<dtstr.ValidMappings>;
  indices: Uint32Array;
  nObjects: number;
  emptyObjects: Uint8Array;

  acrossFuns: Map<dtstr.ValidMappings | "by" | "what", Function>;
  acrossArgs: Map<dtstr.ValidMappings | "by" | "what", any[]>;
  withinFuns: Map<dtstr.ValidMappings | "by" | "what", Function>;
  withinArgs: Map<dtstr.ValidMappings | "by" | "what", any[]>;

  constructor(
    data: dtstr.DataFrame,
    mapping: dtstr.Mapping,
    marker: MarkerHandler
  ) {
    this.n = data[Object.keys(data)[0]].length;
    this.allUnique = false;
    this.data = data;
    this.mapping = mapping;
    this.marker = marker;
    this.by = new Set();
    this.what = new Set();

    this.acrossFuns = new Map();
    this.withinFuns = new Map();
  }

  getVariable = (mapping: dtstr.ValidMappings) => {
    return this.data[this.mapping.get(mapping)] as dtstr.VectorGeneric;
  };

  extractAsIs = (...mappings: dtstr.ValidMappings[]) => {
    this.allUnique = true;
    this.indices = new Uint32Array(Array.from(Array(this.marker.n).keys()));
    this.nObjects = this.indices.length;
    this.emptyObjects = new Uint8Array(this.nObjects);

    mappings.forEach((mapping) => {
      this[mapping] = new Cast(this, mapping);
    });
    return this;
  };

  splitBy = (...mappings: dtstr.ValidMappings[]) => {
    mappings.forEach((mapping, i) => this.by.add(mapping));
    return this;
  };

  splitWhat = (...mappings: dtstr.ValidMappings[]) => {
    mappings.forEach((mapping) => this.what.add(mapping));
    return this;
  };

  doAcross = (
    target: dtstr.ValidMappings | "by" | "what",
    fun: Function,
    ...args: any[]
  ) => {
    const funWithArgs = (x: any[]) => fun(x, ...args);
    this.acrossFuns.set(target, funWithArgs);
    return this;
  };

  doWithin = (
    target: dtstr.ValidMappings | "by" | "what",
    fun: Function,
    ...args: any[]
  ) => {
    const funWithArgs = (x: any[]) => fun(x, ...args);
    this.withinFuns.set(target, funWithArgs);
    return this;
  };

  assignIndices = () => {
    const { what, by, acrossFuns, withinFuns, acrossArgs, withinArgs } = this;
    const splittingVars = Array.from(by).map((e) => {
      if (acrossFuns.get("by")) {
        return acrossFuns.get("by")(this.getVariable(e));
      }
      return this.getVariable(e);
    });

    const indices = funs.uniqueRowIds(splittingVars);
    const nObjects = Array.from(new Set(indices)).length;

    this.indices = new Uint32Array(indices);
    this.nObjects = nObjects;
    this.emptyObjects = new Uint8Array(this.nObjects);

    [...what].forEach((e) => {
      this[e] = new Cast(this, e);
      this[e].registerAcross(acrossFuns.get("what"));
      this[e].registerWithin(withinFuns.get("what"));
    });

    [...by].forEach((e) => {
      this[e] = new Cast(this, e);
      this[e].registerAcross(acrossFuns.get("by"));
      this[e].registerWithin(withinFuns.get("by"));
    });

    return this;
  };
}
