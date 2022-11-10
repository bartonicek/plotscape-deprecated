import * as funs from "../functions.js";
import * as dtstr from "../datastructures";
import { ScaleContinuous } from "./ScaleContinuous.js";

export class AreaScaleContinuous extends ScaleContinuous {
  zero: boolean;
  dataScale: ScaleContinuous;
  areaScale: ScaleContinuous;

  constructor() {
    super();
    this.zero = true;
    this.dataScale = new ScaleContinuous();
    this.areaScale = new ScaleContinuous().setLimits(0, 1);
  }

  registerData = (data: number[]) => {
    this.dataScale.setLimits(this.zero ? 0 : funs.min(data), funs.max(data));
    return this;
  };

  dataToPlot = (data: number | number[]) => {
    if (dtstr.isArray(data)) {
      const res = this.dataScale.unitsToPct(data) as Float32Array;
      return res.map((e) => Math.sqrt(e));
    }
    return Math.sqrt(this.dataScale.unitsToPct(data) as number);
  };
}
