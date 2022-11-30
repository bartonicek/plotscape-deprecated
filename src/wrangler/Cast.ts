import * as dtstr from "../datastructures.js";
import * as funs from "../functions.js";
import * as sprs from "../sparsearrays.js";
import { MarkerHandler } from "../handlers/MarkerHandler.js";
import { Wrangler } from "./Wrangler.js";

export class Cast {
  data: dtstr.VectorGeneric;
  marker: MarkerHandler;

  allUnique: boolean;
  nCases: number;
  nObjects: number;
  indices: Uint32Array;

  _transformedData: dtstr.VectorGeneric;
  processedData: sprs.SparseArray;

  mapFun: (x: any[]) => any[];
  reduceFun: (x: any[]) => any | any[];

  constructor(wrangler: Wrangler, mapping: dtstr.ValidMappings) {
    this.data = wrangler.getVariable(mapping);
    this.marker = wrangler.marker;
    this.allUnique = wrangler.allUnique;
    this.nCases = wrangler.nCases;
    this.nObjects = wrangler.nObjects;
    this.indices = wrangler.indices;

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
    const { marker, indices, nCases, nObjects, transformedData, reduceFun } =
      this;
    // Initialize all values as empty.
    this.processedData.empty.fill(1);

    let i = nObjects;

    // If each object is a row of data, return the transformed data
    // (possibly filtered by membership)
    if (this.allUnique) {
      // Base membership, no filtering
      if (membership === 1) {
        this.processedData = new sprs.SparseArray(transformedData);
        this.processedData.empty.fill(0);
        return this.processedData;
      }
      // Filter by membership, using indices that were updated only
      while (i--) {
        const u = marker.updated[i];
        if (u === -1) break;
        if (marker.isOfMembership(u, membership)) {
          this.processedData[u] = transformedData[u];
          this.processedData.empty[u] = 0;
        }
      }
      return this.processedData;
    }

    // If each object is a function of multiple rows of the data,
    // split the data into sub-arrays, one for each object
    let [j, subArrs] = [nCases, Array.from(Array(nObjects), (e) => [])];
    // Base membership, no filtering
    if (membership === 1) {
      while (j--) subArrs[indices[j]].push(transformedData[j]);
    } else {
      // Filter by membership, use indices that were updated only
      while (j--) {
        const u = marker.updated[j];
        if (marker.isOfMembership(u, membership)) {
          subArrs[indices[u]].push(transformedData[u]);
        }
      }
    }

    // Take the sub-arrays and apply the reducing function to each
    // (if the sub-array is empty, ingore it & leave the
    // processed data value marked as empty)
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
