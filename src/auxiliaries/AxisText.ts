import { Auxiliary } from "./Auxiliary.js";
import * as funs from "../functions.js";
import { GraphicLayer } from "../plot/GraphicLayer.js";

export class AxisText extends Auxiliary {
  along: string;
  other: string;
  nbreaks: number;

  constructor(along: string, nbreaks?: number) {
    super();
    this.along = along;
    this.other = along === "x" ? "y" : "x";
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
    const labelWidths = this.getLabelMetrics(context).map((e) => e.width);
    const labelHeights = this.getLabelMetrics(context).map(
      (e) => e.actualBoundingBoxAscent
    );

    const intercepts = Array.from(
      Array(this.breaks.length),
      (e) => this.scales[this.other].plotMin
    );

    const x =
      this.along === "x"
        ? this.breaks
        : intercepts.map((e, i) => -5 + e - labelWidths[i]);
    const y =
      this.along === "x"
        ? intercepts.map((e, i) => 5 + e + 2 * labelHeights[i])
        : this.breaks;

    context.drawText(x, y, this.labels);
  };

  drawBase = (context: GraphicLayer) => {
    this.draw(context);
  };
}
