import { Plot } from "../main.js";
import { GraphicLayer } from "../plot/GraphicLayer.js";
import { Auxiliary } from "./Auxiliary.js";

export class AxisTitle extends Auxiliary {
  along: string;
  other: string;
  label: string;
  plot: Plot;

  constructor(along: string, label: string, plot: Plot) {
    super();
    this.along = along;
    this.other = along === "x" ? "y" : "x";
    this.label = label;
    this.plot = plot;
  }

  getLabelMetrics = (context: GraphicLayer) => {
    return context.context.measureText(this.label);
  };

  draw = (context: GraphicLayer) => {
    if (this.label === "_indicator") return;
    const { scales, along, other, plot } = this;

    const size = Math.floor(plot.fontsize * 1.5);

    const coords = { x: null, y: null };
    coords[along] = scales[along].pctToPlot(0.5);
    coords[other] =
      scales[other].pctToPlot(0) +
      (along === "x" ? 1 : -1) * plot.fontsize * 2.5;

    const rot = this.along === "x" ? 0 : 270;

    context.context.textAlign = "center";
    context.context.textBaseline = "middle";
    context.drawText([coords.x], [coords.y], [this.label], size, rot);
  };

  drawBase = (context: GraphicLayer) => {
    this.draw(context);
  };
}
