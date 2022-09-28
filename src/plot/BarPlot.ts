import * as dtstr from "../datastructures.js";
import * as hndl from "../handlers/handlers.js";
import * as scls from "../scales/scales.js";
import * as reps from "../representations/representations.js";
import * as funs from "../functions.js";
import { Wrangler } from "../wrangler/Wrangler.js";
import { Plot } from "./Plot.js";
import { DataFrame } from "../DataFrame.js";

export class BarPlot extends Plot {
  mapping: dtstr.Mapping;

  constructor(
    id: string,
    element: HTMLDivElement,
    mapping: dtstr.Mapping,
    globals: dtstr.Globals
  ) {
    super(id, element, mapping, globals);
    this.mapping = mapping;
    this.wranglers = {
      summary: new Wrangler(globals.data, mapping, globals.handlers.marker)
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
      bars: new reps.Bars(this.wranglers.summary, 0.8),
    };
    this.initialize();
  }
}
