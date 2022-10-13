import * as dtstr from "../datastructures.js";
import * as scls from "../scales/scales.js";
import * as reps from "../representations/representations.js";
import * as funs from "../functions.js";
import { Wrangler } from "../wrangler/Wrangler.js";
import { Plot } from "./Plot.js";

export class BarPlot extends Plot {
  constructor(plotConfig: dtstr.PlotConfig) {
    const { data, mapping, globals } = plotConfig;
    super(plotConfig);

    this.wranglers = {
      wrangler1: new Wrangler(data, mapping, globals.marker)
        .splitBy("x")
        .splitWhat("y")
        .doWithin("by", funs.unique)
        .doWithin("what", funs.sum)
        .assignIndices(),
    };

    this.scales = {
      x: new scls.XYScaleDiscrete(this.width),
      y: new scls.XYScaleContinuous(this.height, -1, true),
    };

    this.representations = {
      bars: new reps.Bars(this.wranglers.wrangler1, 0.8),
    };
    this.initialize();
  }
}
