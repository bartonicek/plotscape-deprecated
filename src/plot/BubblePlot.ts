import * as dtstr from "../datastructures.js";
import * as scls from "../scales/scales.js";
import * as reps from "../representations/representations.js";
import * as funs from "../functions.js";
import { Wrangler } from "../wrangler/Wrangler.js";
import { Plot } from "./Plot.js";

export class BubblePlot extends Plot {
  constructor(plotConfig: dtstr.PlotConfig) {
    const { data, mapping, globals } = plotConfig;
    if (!mapping.has("size")) mapping.set("size", "_indicator");
    super(plotConfig);

    this.wranglers = {
      wrangler1: new Wrangler(data, mapping, globals.marker)
        .splitBy("x", "y")
        .splitWhat("size")
        .doWithin("by", funs.unique)
        .doWithin("what", funs.length)
        .assignIndices(),
    };

    this.scales = {
      x: new scls.XYScaleDiscrete(this.width),
      y: new scls.XYScaleDiscrete(this.height, -1),
      size: new scls.AreaScaleContinuous(this.width),
    };

    this.representations = {
      points: new reps.Points(this.wranglers.wrangler1),
    };

    this.initialize();
  }
}
