import * as dtstr from "../datastructures.js";
import { GraphicLayer } from "../plot/GraphicLayer.js";
import { Wrangler } from "../wrangler/Wrangler.js";
import { Representation } from "./Representation.js";

export class Bars extends Representation {
  widthMultiplier: number;

  constructor(wrangler: Wrangler, widthMultiplier: number) {
    super(wrangler);
    this.widthMultiplier = widthMultiplier;
    this.sizeMultiplier = widthMultiplier;
    this.sizeLimits = { min: 0.01, max: 1 };
    this.alphaMultiplier = 1;
  }

  get y0() {
    return this.scales.y.plotMin;
  }

  get width() {
    return (
      this.sizeMultiplier *
      (this.getMapping("x").sort()[1] - this.getMapping("x").sort()[0])
    );
  }

  defaultize = () => {
    this.sizeMultiplier = this.widthMultiplier;
    this.alphaMultiplier = 1;
  };

  getMappings = (membership?: dtstr.ValidMemberships) => {
    const mappings: dtstr.ValidMappings[] = ["x", "y"];
    return mappings.map((e) => this.getMapping(e, membership));
  };

  drawBase = (context: GraphicLayer) => {
    const [x, y] = this.getMappings(0);
    const { y0, width, alphaMultiplier } = this;
    const { col, strokeCol, strokeWidth } = this.pars[0];
    const pars = { col, strokeCol, strokeWidth, alpha: alphaMultiplier, width };
    context.drawBarsV(x, y, y0, pars);
  };

  drawHighlight = (context: GraphicLayer) => {
    dtstr.highlightMembershipArray.forEach((e) => {
      const [x, y] = this.getMappings(e);
      // console.log(e);
      // console.log(y);
      if (!(x.length > 0)) return;
      const { y0, width } = this;
      const { col, strokeCol, strokeWidth } = this.getPars(e);
      const pars = { col, strokeCol, strokeWidth, alpha: 1, width };
      context.drawBarsV(x, y, y0, pars);
    });
  };

  get boundingRects() {
    const [x, y] = this.getMappings();
    const [wh, y0] = [this.width / 2, this.scales.y.plotMin];
    return x.map((xi, i) => [
      [xi - wh, y0],
      [xi + wh, y[i]],
    ]);
  }
}
