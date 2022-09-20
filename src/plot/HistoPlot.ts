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
    data: DataFrame,
    mapping: dtstr.Mapping,
    handlers: {
      marker: hndl.MarkerHandler;
      keypress: hndl.KeypressHandler;
      state: hndl.StateHandler;
    }
  ) {
    super(id, element, data, mapping, handlers);

    this.wranglers = {
      summary: new Wrangler(data, mapping, handlers.marker)
        .splitBy("x")
        .splitWhat("y")
        .doAcross("by", funs.bin, 10)
        .doWithin("by", funs.unique)
        .doWithin("what", funs.length)
        .assignIndices(),
    };

    this.scales = {
      x: new scls.XYScaleContinuous(this.width),
      y: new scls.XYScaleContinuous(this.height, -1, true),
    };

    this.representations = {
      bars: new reps.Bars(this.wranglers.summary, 1),
    };

    this.initialize();
  }
}
