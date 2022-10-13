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
    mapping: dtstr.Mapping,
    globals: dtstr.Globals,
    dimensions: { width: number; height: number }
  ) {
    super(id, element, mapping, globals, dimensions);

    this.mapping = mapping;
    this.wranglers = {
      wrangler1: new Wrangler(
        globals.data,
        mapping,
        globals.handlers.marker
      ).extractAsIs(...mapping.keys()),
    };

    this.scales = {
      x: new scls.XYScaleContinuous(this.width),
      y: new scls.XYScaleContinuous(this.height, -1),
      ...(mapping.get("size") && { size: new scls.AreaScaleContinuous(1) }),
    };

    this.representations = {
      points: new reps.Points(this.wranglers.wrangler1),
    };

    this.initialize();
  }
}
