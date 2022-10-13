import * as dtstr from "../datastructures.js";
import * as hndl from "../handlers/handlers.js";
import * as scls from "../scales/scales.js";
import * as reps from "../representations/representations.js";
import * as auxs from "../auxiliaries/auxiliaries.js";
import * as funs from "../functions.js";
import { Wrangler } from "../wrangler/Wrangler.js";
import { Plot } from "./Plot.js";
import { DataFrame } from "../DataFrame.js";

export class HistoPlot extends Plot {
  constructor(
    id: string,
    element: HTMLDivElement,
    mapping: dtstr.Mapping,
    globals: dtstr.Globals,
    dimensions: { width: number; height: number }
  ) {
    super(id, element, mapping, globals, dimensions);

    this.wranglers = {
      wrangler1: new Wrangler(globals.data, mapping, globals.handlers.marker)
        .splitBy("x")
        .splitWhat("y")
        .doAcross("by", funs.bin, 10)
        .doWithin("by", funs.unique)
        .doWithin("what", funs.sum)
        .assignIndices(),
    };

    this.scales = {
      x: new scls.XYScaleContinuous(this.width),
      y: new scls.XYScaleContinuous(this.height, -1, true),
    };

    this.representations = {
      bars: new reps.Bars(this.wranglers.wrangler1, 1),
    };

    this.initialize();
  }
}
