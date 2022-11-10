import * as dtstr from "../datastructures.js";
import * as funs from "../functions.js";
import { MarkerHandler } from "../handlers/MarkerHandler.js";

export class Cast {
  data: dtstr.VectorGeneric;
  _transformedData: dtstr.VectorGeneric;
  marker: MarkerHandler;
  memoCache: Map<string, number>;

  nObjects: number;
  indices: number[];
  allUnique: boolean;
  withinFun: Function;
  withinArgs: any[];
  acrossFun: Function;
  acrossArgs: any[];

  constructor(data: dtstr.VectorGeneric) {
    this.data = data;
    this.marker = null;
    this.indices = null;
    this.allUnique = false;

    this.memoCache = new Map();

    this.acrossFun = funs.identity;
    this.acrossArgs = [];

    this.withinFun = funs.identity;
    this.withinArgs = [];
  }

  get transformedData() {
    if (!this._transformedData) {
      this._transformedData = this.acrossFun(this.data, ...this.acrossArgs);
    }
    return this._transformedData;
  }

  extract = (membership?: dtstr.ValidMemberships) => {
    const { marker, memoCache, withinFun, withinArgs, transformedData } = this;

    if (this.allUnique) {
      if (!membership) return transformedData;
      return transformedData.filter((_, i) =>
        marker.isOfMembership(i, membership)
      );
    }

    let [i, j, subArr, res] = [
      this.indices.length,
      this.nObjects,
      Array.from(Array(this.nObjects), (e) => []),
      Array(this.nObjects).fill(null),
    ];

    while (i--) {
      if (!membership || marker.isOfMembership(i, membership)) {
        subArr[this.indices[i]].push(this.transformedData[i]);
      }
    }

    while (j--) {
      if (subArr[j].length) {
        const arrString = funs.tabulateAndStringify(subArr[j]);
        if (memoCache.has(arrString)) {
          res[j] = memoCache.get(arrString);
          continue;
        }
        const temp = withinFun(subArr[j], ...withinArgs);
        res[j] = temp;
        memoCache.set(arrString, temp);
        continue;
      }
      res[j] = null;
    }
    return res;
  };

  registerAcross = (fun: Function, ...args: any[]) => {
    this.acrossFun = fun;
    this.acrossArgs = args;
    this._transformedData = this.acrossFun(this.data, ...this.acrossArgs);
    return this;
  };

  registerWithin = (fun: Function, ...args: any[]) => {
    this.withinFun = fun;
    this.withinArgs = args;
    return this;
  };
}
