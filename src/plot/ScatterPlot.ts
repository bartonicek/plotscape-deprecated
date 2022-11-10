import * as dtstr from "../datastructures.js";
import * as scls from "../scales/scales.js";
import * as reps from "../representations/representations.js";
import { Wrangler } from "../wrangler/Wrangler.js";
import { Plot } from "./Plot.js";

export class ScatterPlot extends Plot {
  mapping: dtstr.Mapping;

  constructor(plotConfig: dtstr.PlotConfig) {
    const { data, mapping, globals } = plotConfig;
    super(plotConfig);

    this.mapping = mapping;
    this.wranglers = {
      wrangler1: new Wrangler(data, mapping, globals.marker).extractAsIs(
        ...mapping.keys()
      ),
    };

    this.scales = {
      x: new scls.PlotScaleContinuous(),
      y: new scls.PlotScaleContinuous(),
      // ...(mapping.get("size") && {
      //   size: new scls.AreaScaleContinuous(1, this),
      // }),
    };

    this.representations = {
      points: new reps.Points(this.wranglers.wrangler1),
    };

    this.initialize();
  }
}
