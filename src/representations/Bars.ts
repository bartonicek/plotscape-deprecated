import * as dtstr from "../datastructures.js";
import * as sprs from "../sparsearrays.js";
import * as funs from "../functions.js";
import { GraphicLayer } from "../plot/GraphicLayer.js";
import { Wrangler } from "../wrangler/Wrangler.js";
import { Representation } from "./Representation.js";

export class Bars extends Representation {
  widthMultiplier: number;
  _y0Default: number;
  _widthDefault: number;

  constructor(wrangler: Wrangler, widthMultiplier: number) {
    super(wrangler);
    this.widthMultiplier = widthMultiplier;
    this.sizeMultiplier = widthMultiplier;
    this.sizeLimits = { min: 0.01, max: 1 };
  }

  get y0Default() {
    return this.scales.y.plotMin;
  }

  get widthDefault() {
    if (!this.scales.x.continuous) {
      return this.scales.x.breakWidth * this.sizeMultiplier;
    }
    const x = this.getMapping("x").sort((a, b) => a - b);
    return Math.floor(this.sizeMultiplier * (x[1] - x[0]));
  }

  defaultize = () => {
    this.sizeMultiplier = this.widthMultiplier;
    this.alphaMultiplier = 1;
  };

  getMappings = (membership?: dtstr.ValidMemberships) => {
    const mappings: dtstr.ValidMappings[] = ["x", "y"];
    const res = mappings.map((e) => this.getMapping(e, membership));
    return [...res, this.wrangler.emptyObjects];
  };

  drawBase = (context: GraphicLayer) => {
    const { y0Default, widthDefault, alphaMultiplier } = this;
    const [x, y] = this.getMappings(1);
    const y0 = new sprs.SparseUint16Array(x.length).fill(y0Default);
    const width = new sprs.SparseUint16Array(x.length).fill(widthDefault);
    const pars = { ...this.getPars(1), alpha: alphaMultiplier };
    context.drawBarsV(x, y0, y, width, pars);
  };

  drawHighlight = (context: GraphicLayer) => {
    dtstr.highlightMembershipArray.forEach((e) => {
      const { y0Default, widthDefault } = this;
      const [x, y] = this.getMappings(e);
      if (!(x.length > 0)) return;
      const y0 = new sprs.SparseUint16Array(x.length).fill(y0Default);
      const width = new sprs.SparseUint16Array(x.length).fill(widthDefault);
      const pars = { ...this.getPars(e), alpha: 1 };
      context.drawBarsV(x, y0, y, width, pars);
    });
  };

  get boundingRects() {
    const [x, y] = this.getMappings(1);
    const [wd, y0d] = [this.widthDefault / 2, this.y0Default];

    let [i, res] = [x.length, Array(x.length)];
    while (i--) {
      res[i] = [
        [x[i] - wd, y0d],
        [x[i] + wd, y[i]],
      ];
    }
    return res;
  }
}
