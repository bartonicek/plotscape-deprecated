import * as dtstr from "../datastructures.js";
import * as funs from "../functions.js";
import * as sprs from "../sparsearrays.js";
import { MarkerHandler } from "../handlers/MarkerHandler.js";
import { Wrangler } from "./Wrangler.js";

export class Cast {
  data: dtstr.VectorGeneric;
  _transformedData: dtstr.VectorGeneric;
  processedData: dtstr.VectorGeneric;
  processedData2: sprs.SparseArray;
  marker: MarkerHandler;

  indices: Uint32Array;
  nObjects: number;
  emptyObjects: Uint8Array;

  allUnique: boolean;
  acrossFun: (data: any[]) => any[];
  withinFun: (data: any[]) => any | any[];

  constructor(wrangler: Wrangler, mapping: dtstr.ValidMappings) {
    this.data = wrangler.getVariable(mapping);
    this.marker = wrangler.marker;
    this.indices = wrangler.indices;
    this.allUnique = wrangler.allUnique;
    this.nObjects = wrangler.nObjects;
    this.emptyObjects = wrangler.emptyObjects;

    this.processedData = Array(this.nObjects);
    this.processedData2 = new sprs.SparseArray(this.nObjects);

    this.acrossFun = funs.identity;
    this.withinFun = funs.identity;
  }

  get transformedData() {
    if (!this._transformedData) {
      this._transformedData = this.acrossFun(this.data);
    }
    return this._transformedData;
  }

  extract = (membership?: dtstr.ValidMemberships) => {
    const { marker, indices, nObjects, withinFun } = this;
    // this.emptyObjects.fill(0);
    // this.processedData.fill(0);

    this.processedData.fill(null);
    this.processedData2.empty.fill(0);

    let i = nObjects;

    if (this.allUnique) {
      if (!membership) {
        while (i--) this.processedData2[i] = this.transformedData[i];
        return this.processedData2;
      }
      while (i--) {
        if (!marker.isOfMembership(i, membership)) {
          this.processedData2.empty[i] = 1;
          continue;
        }
        this.processedData2[i] = this.transformedData[i];
      }
      return this.processedData2;
    }

    let [j, subArrs] = [indices.length, Array.from(Array(nObjects), (e) => [])];
    while (j--) {
      if (!membership || marker.isOfMembership(j, membership)) {
        subArrs[this.indices[j]].push(this.transformedData[j]);
      }
    }

    while (i--) {
      if (subArrs[i].length) {
        this.processedData2[i] = withinFun(subArrs[i]);
        continue;
      }
      this.processedData2.empty[i] = 1;
    }
    return this.processedData2;
  };

  registerAcross = (fun: (data: any[]) => any[]) => {
    if (!fun) return;
    this.acrossFun = fun;
    return this;
  };

  registerWithin = (fun: (data: any[]) => string | number | boolean) => {
    if (!fun) return;
    this.withinFun = fun;
    return this;
  };
}
