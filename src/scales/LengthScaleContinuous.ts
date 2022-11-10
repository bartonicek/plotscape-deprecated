import * as funs from "../functions.js";
import * as dtstr from "../datastructures";
import { ScaleContinuous } from "./ScaleContinuous.js";

export class LengthScaleContinuous extends ScaleContinuous {
  zero: boolean;
  dataScale: ScaleContinuous;
  lengthScale: ScaleContinuous;

  constructor() {
    super();
    this.zero = true;
    this.dataScale = new ScaleContinuous();
    this.lengthScale = new ScaleContinuous().setLimits(0, 1);
  }

  registerData = (data: number[]) => {
    this.dataScale.setLimits(this.zero ? 0 : funs.min(data), funs.max(data));
    return this;
  };

  dataToPlot = (data: number | number[]) => {
    if (dtstr.isArray(data)) {
      return this.dataScale.unitsToPct(data);
    }
    return this.dataScale.unitsToPct(data);
  };
}
