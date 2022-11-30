import * as dtstr from "../datastructures.js";
import * as sprs from "../sparsearrays.js";
import { GraphicLayer } from "../plot/GraphicLayer.js";
import { Wrangler } from "../wrangler/Wrangler.js";
import { Representation } from "./Representation.js";

export class Bars extends Representation implements dtstr.RepresentationType {
  widthXD: number;

  constructor(wrangler: Wrangler, widthMultiplier: number) {
    super(wrangler);
    this.widthXD = widthMultiplier;
    this.sizeX = widthMultiplier;
    this.sizeLim = { min: 0.01, max: 1 };
  }

  get y0D() {
    return this.scales.y.plotMin;
  }

  get widthD() {
    if (!this.scales.x.continuous) {
      return this.scales.x.breakWidth * this.sizeX;
    }
    const x = [...this.getMapping(1, "x")].sort((a, b) => a - b);
    return Math.max(
      Math.floor(this.sizeX * (x[1] - x[0])),
      Math.floor(this.sizeX * (x[x.length - 1] - x[x.length - 2]))
    );
  }

  get drawHighlight() {
    return this.drawHighlightStack;
  }

  defaultize = () => {
    this.sizeX = this.widthXD;
    this.alphaX = 1;
  };

  drawBase = (context: GraphicLayer) => {
    const { y0D, widthD, alphaX } = this;
    const [x, y] = this.getMappings(1, "x", "y");
    const y0 = new sprs.SparseUint16Array(x.length).fill(y0D);
    const width = new sprs.SparseUint16Array(x.length).fill(widthD);
    const pars = { ...this.getPars(1), alpha: alphaX };
    context.drawBarsV(x, y0, y, width, pars);
  };

  drawHighlightStack = (context: GraphicLayer) => {
    dtstr.highlightMembershipArray.forEach((e) => {
      const { y0D, widthD } = this;
      const [x, y] = this.getMappings(e, "x", "y");
      if (!(x.length > 0)) return;
      const y0 = new sprs.SparseUint16Array(x.length).fill(y0D);
      const width = new sprs.SparseUint16Array(x.length).fill(widthD);
      const pars = { ...this.getPars(e), alpha: 1 };
      context.drawBarsV(x, y0, y, width, pars);
    });
  };

  drawHighlightSplit = (context: GraphicLayer) => {};

  get boundingRects() {
    const [x, y] = this.getMappings(1, "x", "y");
    const [widthD, y0d] = [this.widthD, this.y0D];

    let [i, res] = [x.length, Array(x.length)];
    while (i--) {
      res[i] = [
        [x[i] - widthD / 2, y0d],
        [x[i] + widthD / 2, y[i]],
      ];
    }
    return res;
  }
}
