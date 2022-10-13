import * as dtstr from "../datastructures.js";
import * as hndl from "../handlers/handlers.js";
import * as scls from "../scales/scales.js";
import * as reps from "../representations/representations.js";
import * as auxs from "../auxiliaries/auxiliaries.js";
import * as funs from "../functions.js";
import { Wrangler } from "../wrangler/Wrangler.js";
import { Plot } from "./Plot.js";
import { DataFrame } from "../DataFrame.js";

export class BubblePlot extends Plot {
  mapping: dtstr.Mapping;

  constructor(
    id: string,
    element: HTMLDivElement,
    mapping: dtstr.Mapping,
    globals: dtstr.Globals,
    dimensions: { width: number; height: number }
  ) {
    if (!mapping.has("size")) mapping.set("size", "_indicator");

    super(id, element, mapping, globals, dimensions);
    this.wranglers = {
      wrangler1: new Wrangler(globals.data, mapping, globals.handlers.marker)
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
