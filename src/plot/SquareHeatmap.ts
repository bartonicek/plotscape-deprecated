import * as dtstr from "../datastructures.js";
import * as scls from "../scales/scales.js";
import * as reps from "../representations/representations.js";
import * as funs from "../functions.js";
import { Wrangler } from "../wrangler/Wrangler.js";
import { Plot } from "./Plot.js";

export class SquareHeatmap extends Plot {
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
        .doAcross("by", funs.toPretty, 10)
        .doWithin("by", funs.unique)
        .doWithin("what", funs.sum)
        .assignIndices(),
    };

    this.scales = {
      x: new scls.XYScaleDiscrete(this.width),
      y: new scls.XYScaleDiscrete(this.height, -1),
      size: new scls.LengthScaleContinuous(1),
    };

    this.representations = {
      squares: new reps.Squares(this.wranglers.wrangler1),
    };

    this.initialize();
  }
}
