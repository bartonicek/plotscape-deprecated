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

    const labelWidth = this.getLabelMetrics(context).width;
    const labelHeight = this.getLabelMetrics(context).actualBoundingBoxAscent;

    const x =
      this.along === "x"
        ? this.scales.x.pctToPlot(0.5)
        : this.scales.x.pctToPlot(0) - 50;

    const y =
      this.along === "x"
        ? this.scales.y.pctToPlot(0) + 50
        : this.scales.y.pctToPlot(0.5);

    const rot = this.along === "x" ? 0 : 270;

    context.drawText([x], [y], [this.label], 30, rot);
  };

  drawBase = (context: GraphicLayer) => {
    this.draw(context);
  };
}
