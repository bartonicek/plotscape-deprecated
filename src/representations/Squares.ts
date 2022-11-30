import * as dtstr from "../datastructures.js";
import * as sprs from "../sparsearrays.js";
import { Wrangler } from "../wrangler/Wrangler.js";
import { Representation } from "./Representation.js";
import { GraphicLayer } from "../plot/GraphicLayer.js";

export class Squares
  extends Representation
  implements dtstr.RepresentationType
{
  constructor(wrangler: Wrangler) {
    super(wrangler);
    this.sizeLim = { min: 0.01, max: 1.5 };
  }

  // Default size
  get sizeD() {
    const { x, y } = this.scales;
    if (x.breakWidth && y.breakWidth) {
      return Math.min(x.breakWidth, y.breakWidth);
    }
    return (
      Math.min(Math.abs(x.plotRange), Math.abs(y.plotRange)) /
      this.wrangler.nObjects
    );
  }

  drawBase = (context: GraphicLayer) => {
    let [x, y, size] = this.getMappings(1, "x", "y", "size");
    if (!x) return;
    const pars = { ...this.getPars(1), alpha: this.alphaX };
    const { sizeD: defaultSize, sizeX } = this;

    let i = x.length;
    const y0 = new sprs.SparseFloat32Array(x.length);
    const y1 = new sprs.SparseFloat32Array(x.length);

    while (i--) {
      // Scale size
      size[i] = size[i] * defaultSize * sizeX;
      y0[i] = y[i] + size[i] / 2;
      y1[i] = y[i] - size[i] / 2;
    }

    context.drawBarsV(x, y0, y1, size, pars);
  };
  drawHighlight = (context: GraphicLayer) => {
    dtstr.highlightMembershipArray.forEach((e) => {
      const [x, y, fillSize] = this.getMappings(e, "x", "y", "fillSize");
      const [sizeBase, fillSizeBase] = this.getMappings(1, "size", "fillSize");
      if (!x) return;
      const pars = { ...this.getPars(e), alpha: 1 };
      const { sizeD, sizeX } = this;

      let i = x.length;
      const y0 = new sprs.SparseFloat32Array(x.length);
      const y1 = new sprs.SparseFloat32Array(x.length);

      while (i--) {
        // Scale size and fillsize (height)
        sizeBase[i] = sizeBase[i] * sizeD * sizeX;
        fillSize[i] = (fillSize[i] / fillSizeBase[i]) * sizeBase[i];
        y0[i] = y[i] + sizeBase[i] / 2;
        y1[i] = y[i] + sizeBase[i] / 2 - fillSize[i];
      }

      context.drawBarsV(x, y0, y1, sizeBase, pars);
    });
  };
  get boundingRects() {
    const [x, y, s2] = this.getMappings(1, "x", "y", "size");
    const { sizeD, sizeX } = this;

    let [i, res] = [x.length, Array(x.length)];
    while (i--) {
      s2[i] = s2[i] * sizeD * sizeX;
      res[i] = [
        [x[i] - s2[i] / 2, y[i] - s2[i] / 2],
        [x[i] + s2[i] / 2, y[i] + s2[i] / 2],
      ];
    }
    return res;
  }
}
