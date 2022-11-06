import { Plot } from "../main.js";
import { ScaleContinuous } from "./ScaleContinuous.js";

export class LengthScaleContinuous extends ScaleContinuous {
  constructor(length: number, plot: Plot, direction = 1, zero = false) {
    super(length, plot, direction, zero);
  }

  get dataMin() {
    return 0;
  }

  dataToPlot = (data: number | number[]) => {
    const res = this.dataToUnits(data);
    return res;
  };
}
