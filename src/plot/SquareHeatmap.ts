import * as dtstr from "../datastructures.js";
import * as scls from "../scales/scales.js";
import * as reps from "../representations/representations.js";
import * as funs from "../functions.js";
import { Wrangler } from "../wrangler/Wrangler.js";
import { Plot } from "./Plot.js";

export class SquareHeatmap extends Plot {
  constructor(plotConfig: dtstr.PlotConfig) {
    const { data, mapping, globals } = plotConfig;
    if (!mapping.has("size")) mapping.set("size", "_indicator");
    super(plotConfig);

    this.wranglers = {
      wrangler1: new Wrangler(data, mapping, globals.marker)
        .splitBy("x", "y")
        .splitWhat("size")
        .doAcross("by", funs.toPretty, 10)
        .doWithin("by", funs.unique)
        .doWithin("what", funs.sum)
        .assignIndices(),
    };

    this.scales = {
      x: new scls.XYScaleContinuous(this.width, this),
      y: new scls.XYScaleContinuous(this.height, this, -1),
      size: new scls.LengthScaleContinuous(1, this),
    };

    this.representations = {
      squares: new reps.Squares(this.wranglers.wrangler1),
    };

    this.initialize();
  }
}
