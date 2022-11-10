import * as dtstr from "../datastructures.js";
import * as funs from "../functions.js";
import { MarkerHandler } from "../handlers/MarkerHandler.js";
import { Cast } from "./Cast.js";

export class Wrangler {
  n: number;
  data: dtstr.DataFrame;
  mapping: dtstr.Mapping;
  marker: MarkerHandler;
  by: Set<string>;
  what: Set<string>;
  indices: number[];
  nObjects: number;

  constructor(
    data: dtstr.DataFrame,
    mapping: dtstr.Mapping,
    marker: MarkerHandler
  ) {
    this.n = data[Object.keys(data)[0]].length;
    this.data = data;
    this.mapping = mapping;
    this.marker = marker;
    this.indices = [];
    this.by = new Set();
    this.what = new Set();
  }

  getVariable = (mapping: dtstr.ValidMappings) => {
    return this.data[this.mapping.get(mapping)] as dtstr.VectorGeneric;
  };

  extractAsIs = (...mappings: dtstr.ValidMappings[]) => {
    this.indices = Array.from(Array(this.marker.n), (e, i) => i);
    mappings.forEach((mapping) => {
      this[mapping] = new Cast(this.getVariable(mapping));
      this[mapping].marker = this.marker;
      this[mapping].allUnique = true;
    });
    return this;
  };

  splitBy = (...mappings: dtstr.ValidMappings[]) => {
    mappings.forEach((mapping, i) => {
      this.by.add(mapping);
      this[mapping] = new Cast(this.getVariable(mapping));
      this[mapping].marker = this.marker;
    });
    return this;
  };

  splitWhat = (...mappings: dtstr.ValidMappings[]) => {
    mappings.forEach((mapping) => {
      this.what.add(mapping);
      this[mapping] = new Cast(this.getVariable(mapping));
      this[mapping].marker = this.marker;
    });
    return this;
  };

  doAcross = (
    target: dtstr.ValidMappings | "by" | "what",
    fun: Function,
    ...args: any[]
  ) => {
    if (target === "by" || target === "what") {
      Array.from(this[target]).forEach((mapping) => {
        this[mapping].registerAcross(fun, ...args);
      });
      return this;
    }
    this[target].registerAcross(fun, ...args);
    return this;
  };

  doWithin = (
    target: dtstr.ValidMappings | "by" | "what",
    fun: Function,
    ...args: any[]
  ) => {
    if (target === "by" || target === "what") {
      Array.from(this[target]).forEach((mapping) => {
        this[mapping].registerWithin(fun, ...args);
      });
      return this;
    }
    this[target].registerWithin(fun, ...args);
    return this;
  };

  assignIndices = () => {
    const { what, by } = this;
    const splittingVars = Array.from(by).map((e) => this[e].transformedData);
    this.indices = funs.uniqueRowIds(splittingVars);

    this.nObjects = Array.from(new Set([...this.indices])).length;

    Array.from([...by, ...what]).map((e) => {
      this[e].indices = this.indices;
      this[e].nObjects = this.nObjects;
    });
    return this;
  };
}
