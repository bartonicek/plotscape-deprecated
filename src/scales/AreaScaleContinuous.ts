import { ScaleContinuous } from "./ScaleContinuous.js";

export class AreaScaleContinuous extends ScaleContinuous {
  constructor(length: number, direction = 1, zero = false) {
    super(length, direction, zero);
  }

  get dataMin() {
    return 0;
  }

  dataToPlot = (data: number | number[]) => {
    const res = this.dataToUnits(data);
    return typeof res === "number"
      ? Math.sqrt(res)
      : res.map((e) => Math.sqrt(e));
  };
}
