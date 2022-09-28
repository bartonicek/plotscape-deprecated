import { GraphicLayer } from "../plot/GraphicLayer.js";
import { Auxiliary } from "./Auxiliary.js";

export class AxisTitle extends Auxiliary {
  along: string;
  other: string;
  label: string;

  constructor(along: string, label: string) {
    super();
    this.along = along;
    this.other = along === "x" ? "y" : "x";
    this.label = label;
  }

  getLabelMetrics = (context: GraphicLayer) => {
    return context.context.measureText(this.label);
  };

  draw = (context: GraphicLayer) => {
    if (this.label === "_indicator") return;

    const { scales, along, other } = this;

    const size = Math.min(
      ...[along, other].map(
        (e) => 0.4 * scales[e].margins.lower * scales[e].length
      )
    );

    const coords = { x: null, y: null };
    coords[along] = scales[along].pctToPlot(0.5);
    coords[other] =
      scales[other].pctToPlot(0) +
      (along === "x" ? 1 : -1) *
        0.85 *
        scales[other].margins.lower *
        scales[other].length;

    const rot = this.along === "x" ? 0 : 270;

    context.context.textAlign = "center";
    context.context.textBaseline = "middle";
    context.drawText([coords.x], [coords.y], [this.label], size, rot);
  };

  drawBase = (context: GraphicLayer) => {
    this.draw(context);
  };
}
