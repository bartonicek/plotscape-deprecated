import * as dtstr from "../datastructures.js";
import * as funs from "../functions.js";
import * as sprs from "../sparsearrays.js";
import { MarkerHandler } from "../handlers/MarkerHandler.js";
import { Wrangler } from "./Wrangler.js";

export class Cast {
  data: dtstr.VectorGeneric;
  _transformedData: dtstr.VectorGeneric;
  processedData: sprs.SparseArray;
  marker: MarkerHandler;

  indices: Uint32Array;
  nObjects: number;
  emptyObjects: Uint8Array;

  allUnique: boolean;
  mapFun: (x: any[]) => any[];
  reduceFun: (x: any[]) => any | any[];

  constructor(wrangler: Wrangler, mapping: dtstr.ValidMappings) {
    this.data = wrangler.getVariable(mapping);
    this.marker = wrangler.marker;
    this.indices = wrangler.indices;
    this.allUnique = wrangler.allUnique;
    this.nObjects = wrangler.nObjects;
    this.emptyObjects = wrangler.emptyObjects;

    this.processedData = new sprs.SparseArray(this.nObjects);

    this.mapFun = funs.identity;
    this.reduceFun = funs.identity;
  }

  get transformedData() {
    if (!this._transformedData) {
      this._transformedData = this.mapFun(this.data);
    }
    return this._transformedData;
  }

  extract = (membership?: dtstr.ValidMemberships) => {
    const { marker, indices, nObjects, reduceFun } = this;

    this.processedData.fill(null);
    this.processedData.empty.fill(1);

    let i = nObjects;

    if (this.allUnique) {
      if (membership === 1) {
        this.processedData.empty.fill(0);
        while (i--) this.processedData[i] = this.transformedData[i];
        return this.processedData;
      }
      while (i--) {
        const u = marker.updated[i];
        if (u === -1) break;
        if (marker.isOfMembership(u, membership)) {
          this.processedData[u] = this.transformedData[u];
          this.processedData.empty[u] = 0;
        }
      }
      return this.processedData;
    }

    let [j, subArrs] = [indices.length, Array.from(Array(nObjects), (e) => [])];
    while (j--) {
      const u = membership === 1 ? j : marker.updated[j];
      if (u === -1) break;
      if (membership === 1 || marker.isOfMembership(u, membership)) {
        subArrs[this.indices[u]].push(this.transformedData[u]);
      }
    }

    while (i--) {
      if (subArrs[i].length) {
        this.processedData[i] = reduceFun(subArrs[i]);
        this.processedData.empty[i] = 0;
      }
    }
    return this.processedData;
  };

  registerMap = (fun: (data: any[]) => any[]) => {
    if (!fun) return;
    this.mapFun = fun;
    return this;
  };

  registerReduce = (fun: (data: any[]) => string | number | boolean) => {
    if (!fun) return;
    this.reduceFun = fun;
    return this;
  };
}
