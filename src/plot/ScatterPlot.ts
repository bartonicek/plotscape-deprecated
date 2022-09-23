import * as dtstr from "../datastructures.js";
import * as hndl from "../handlers/handlers.js";
import * as scls from "../scales/scales.js";
import * as reps from "../representations/representations.js";
import * as auxs from "../auxiliaries/auxiliaries.js";
import { Wrangler } from "../wrangler/Wrangler.js";
import { Plot } from "./Plot.js";
import { DataFrame } from "../DataFrame.js";

export class ScatterPlot extends Plot {
  mapping: dtstr.Mapping;

  constructor(
    id: string,
    element: HTMLDivElement,
    nPlots: number,
    data: DataFrame,
    mapping: dtstr.Mapping,
    handlers: {
      marker: hndl.MarkerHandler;
      keypress: hndl.KeypressHandler;
      state: hndl.StateHandler;
    }
  ) {
    super(id, element, nPlots, mapping, handlers);

    this.mapping = mapping;

    this.wranglers = {
      identity: new Wrangler(data, mapping, handlers.marker).extractAsIs(
        "x",
        "y"
      ),
    };

    this.scales = {
      x: new scls.XYScaleContinuous(this.width),
      y: new scls.XYScaleContinuous(this.height, -1),
    };

    this.representations = {
      points: new reps.Points(this.wranglers.identity),
    };

    this.initialize();
  }
}
