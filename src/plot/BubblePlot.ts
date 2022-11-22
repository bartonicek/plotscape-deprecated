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
        .groupBy("x", "y")
        .groupWhat("size")
        .doReduce("by", funs.unique)
        .doReduce("what", funs.length)
        .assignIndices(),
    };

    this.scales = {
      x: new scls.PlotScaleDiscrete(),
      y: new scls.PlotScaleDiscrete(),
      size: new scls.AreaScaleContinuous(),
    };

    this.representations = {
      points: new reps.Points(this.wranglers.wrangler1),
    };

    this.initialize();
  }
}
