import { Auxiliary } from "./Auxiliary.js";
import * as funs from "../functions.js";
import { GraphicLayer } from "../plot/GraphicLayer.js";
import { Plot } from "../main.js";

export class AxisText extends Auxiliary {
  along: string;
  other: string;
  plot: Plot;
  nbreaks: number;

  constructor(along: string, plot: Plot, nbreaks?: number) {
    super();
    this.along = along;
    this.other = along === "x" ? "y" : "x";
    this.plot = plot;
    this.nbreaks = nbreaks ?? 4;
  }

  get dataBreaks() {
    return (
      this.scales[this.along].values ??
      funs.prettyBreaks(this.scales[this.along].data, this.nbreaks)
    );
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
    const { scales, along, other, breaks, plot } = this;
    const size = plot.fontsize;

    const intercepts = Array.from(
      Array(breaks.length),
      (e) => scales[other].plotMin + ((along === "x" ? 1 : -1) * size) / 2
    );

    const coords = { x: null, y: null };
    coords[along] = breaks;
    coords[other] = intercepts;

    if (along === "x") {
      context.context.textBaseline = "top";
      context.context.textAlign = "center";
    }
    if (along === "y") {
      context.context.textBaseline = "middle";
      context.context.textAlign = "right";
    }

    context.drawText(coords.x, coords.y, this.labels, size);
  };

  drawBase = (context: GraphicLayer) => {
    this.draw(context);
  };
}
