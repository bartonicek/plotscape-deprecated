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

  get y0Scalar() {
    return this.scales.y.plotMin;
  }

  get widthScalar() {
    const x = this.getMapping("x");
    return this.sizeMultiplier * (x.sort()[1] - x.sort()[0]);
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
    const [x, y] = this.getMappings();
    const { y0Scalar, widthScalar, alphaMultiplier } = this;
    const y0 = Array.from(Array(x.length), (e) => y0Scalar);
    const width = Array.from(Array(x.length), (e) => widthScalar);
    const pars = { ...this.getPars(1), alpha: alphaMultiplier };
    context.drawBarsV(x, y, y0, width, pars);
  };

  drawHighlight = (context: GraphicLayer) => {
    dtstr.highlightMembershipArray.forEach((e) => {
      const [x, y] = this.getMappings(e);
      if (!(x.length > 0)) return;
      const { y0Scalar, widthScalar } = this;
      const y0 = Array.from(Array(x.length), (e) => y0Scalar);
      const width = Array.from(Array(x.length), (e) => widthScalar);
      const pars = { ...this.getPars(e), alpha: 1 };
      context.drawBarsV(x, y, y0, width, pars);
    });
  };

  get boundingRects() {
    const [x, y] = this.getMappings();
    const [wh, y0] = [this.widthScalar / 2, this.y0Scalar];
    return x.map((xi, i) => [
      [xi - wh, y0],
      [xi + wh, y[i]],
    ]);
  }
}
