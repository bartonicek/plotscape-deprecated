import { Auxiliary } from "./Auxiliary.js";
import * as funs from "../functions.js";
import { GraphicLayer } from "../plot/GraphicLayer.js";
import { Plot } from "../main.js";
import { SizeHandler } from "../handlers/SizeHandler.js";
import { PlotScaleDiscrete } from "../scales/PlotScaleDiscrete.js";

export class AxisText extends Auxiliary {
  sizeHandler: SizeHandler;
  along: string;
  other: string;
  plot: Plot;
  nbreaks: number;

  constructor(plot: Plot, along: string, nbreaks?: number) {
    super(plot);
    this.plot = plot;
    this.sizeHandler = plot.handlers.size;
    this.along = along;
    this.other = along === "x" ? "y" : "x";
    this.nbreaks = nbreaks ?? 4;
  }

  get dataBreaks() {
    const { scales, along, nbreaks } = this;
    if (scales[along].continuous) {
      return funs.prettyBreaks(scales[along].dataRepresentation, nbreaks);
    }
    return scales[along].dataRepresentation;
  }

  get breaks() {
    return this.scales[this.along].dataToPlot(this.dataBreaks);
  }

  get labels() {
    return this.scales[this.along].values
      ? this.scales[this.along].values.map((e) => e.toString())
      : this.dataBreaks.map((e) => e.toString());
  }

  getLabelMetrics = (context: GraphicLayer) => {
    return this.labels.map((label) => context.context.measureText(label));
  };

  draw = (context: GraphicLayer) => {
    const { along, other, breaks, sizeHandler } = this;
    const size = sizeHandler.fontsize;

    const coord0 = sizeHandler.innerCoords[`${other}0`];
    const min = coord0 + ((along === "x" ? 1 : -1) * size) / 2;
    const intercepts = Array(breaks.length).fill(min);

    const coords = { x: null, y: null };
    coords[along] = breaks;
    coords[other] = intercepts;

    context.context.save();

    if (along === "x") {
      context.context.textBaseline = "top";
      context.context.textAlign = "center";
    }
    if (along === "y") {
      context.context.textBaseline = "middle";
      context.context.textAlign = "right";
    }

    context.drawText(coords.x, coords.y, this.labels, size);
    context.context.restore();
  };

  drawOverlay = (context: GraphicLayer) => {
    this.draw(context);
  };
}
