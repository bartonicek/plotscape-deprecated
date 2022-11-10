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
  }

  get y0Scalar() {
    return this.scales.y.plotMin;
  }

  get widthScalar() {
    const x = this.getMapping("x").sort((a, b) => a - b);
    return this.sizeMultiplier * (x[1] - x[0]);
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
    const y0 = new dtstr.SparseFloat32Array(x.length).fill(y0Scalar);
    const width = new dtstr.SparseFloat32Array(x.length).fill(widthScalar);
    const pars = { ...this.getPars(1), alpha: alphaMultiplier };
    context.drawBarsV(x, y0, y, width, pars);
  };

  drawHighlight = (context: GraphicLayer) => {
    dtstr.highlightMembershipArray.forEach((e) => {
      const [x, y] = this.getMappings(e);

      if (!(x.length > 0)) return;
      const { y0Scalar, widthScalar } = this;
      const y0 = new dtstr.SparseFloat32Array(x.length).fill(y0Scalar);
      const width = new dtstr.SparseFloat32Array(x.length).fill(widthScalar);
      const pars = { ...this.getPars(e), alpha: 1 };
      context.drawBarsV(x, y0, y, width, pars);
    });
  };

  get boundingRects() {
    const [x, y] = this.getMappings();
    const [wh, y0] = [this.widthScalar / 2, this.y0Scalar];

    let [i, res] = [x.length, Array(x.length)];
    while (i--) {
      res[i] = [
        [x[i] - wh, y0],
        [x[i] + wh, y[i]],
      ];
    }

    return res;
  }
}
