import { SizeHandler } from "../handlers/SizeHandler.js";
import { Plot } from "../main.js";
import { GraphicLayer } from "../plot/GraphicLayer.js";
import { Auxiliary } from "./Auxiliary.js";

export class AxisTitle extends Auxiliary {
  sizeHandler: SizeHandler;
  along: "x" | "y";
  other: "x" | "y";
  label: string;

  constructor(plot: Plot, along: "x" | "y", label: string) {
    super(plot);
    this.plot = plot;
    this.sizeHandler = plot.handlers.size;
    this.along = along;
    this.other = along === "x" ? "y" : "x";
    this.label = label;
  }

  getLabelMetrics = (context: GraphicLayer) => {
    return context.context.measureText(this.label);
  };

  draw = (context: GraphicLayer) => {
    if (this.label === "_indicator") return;
    const { sizeHandler, scales, along, other } = this;

    const size = Math.floor(sizeHandler.fontsize * 1.5);
    const dir = along === "x" ? -1 : 1;
    const margin =
      along === "x" ? sizeHandler.margins.bottom : sizeHandler.margins.left;

    const coords = { x: null, y: null };
    coords[along] = scales[along].pctToPlot(0.5);
    coords[other] =
      scales[other].plotMin - dir * (margin - 1.5 * sizeHandler.fontsize);

    const rot = this.along === "x" ? 0 : 270;

    context.context.textAlign = "center";
    context.context.textBaseline = "middle";
    context.drawText([coords.x], [coords.y], [this.label], size, rot);
  };

  drawOverlay = (context: GraphicLayer) => {
    this.draw(context);
  };
}
