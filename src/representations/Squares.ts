import * as dtstr from "../datastructures.js";
import * as sprs from "../sparsearrays.js";
import { Wrangler } from "../wrangler/Wrangler.js";
import { Representation } from "./Representation.js";
import { GraphicLayer } from "../plot/GraphicLayer.js";

export class Squares extends Representation {
  widthBase: number[];
  constructor(wrangler: Wrangler) {
    super(wrangler);
    this.sizeLimits = { min: 0.01, max: 1.5 };
  }
  getMappings = (membership?: dtstr.ValidMemberships) => {
    const { getMapping, defaultSize, sizeMultiplier } = this;
    const mappings: dtstr.ValidMappings[] = ["x", "y", "size", "fillHeight"];
    let [x, y, size, fillHeight] = mappings.map((e) =>
      getMapping(e, membership)
    );

    if (!size.length) {
      size = new sprs.SparseUint16Array(x.length).fill(
        defaultSize * sizeMultiplier
      );
      return [x, y, size, fillHeight];
    }

    let i = size.length;
    while (i--) {
      size[i] *= defaultSize * sizeMultiplier;
      fillHeight[i] *= defaultSize * sizeMultiplier;
    }
    return [x, y, size, fillHeight];
  };

  get defaultSize() {
    const { x, y } = this.scales;
    if (x.breakWidth && y.breakWidth) {
      return Math.min(x.breakWidth, y.breakWidth);
    }
    return (
      Math.abs(Math.min(x.plotRange, y.plotRange)) / this.wrangler.nObjects
    );
  }
  drawBase = (context: GraphicLayer) => {
    let [x, y, size] = this.getMappings(1);
    if (!x) return;
    const pars = { ...this.getPars(1), alpha: this.alphaMultiplier };

    let i = x.length;
    const y0 = new sprs.SparseUint16Array(x.length);
    const y1 = new sprs.SparseUint16Array(x.length);
    while (i--) {
      y0[i] = y[i] + size[i] / 2;
      y1[i] = y[i] - size[i] / 2;
    }
    context.drawBarsV(x, y0, y1, size, pars);
  };
  drawHighlight = (context: GraphicLayer) => {
    dtstr.highlightMembershipArray.forEach((e) => {
      const [x, y, size, fillHeight] = this.getMappings(e);
      const [, , sizeBase, fillHeightBase] = this.getMappings(1);
      if (!x) return;
      const pars = { ...this.getPars(e), alpha: 1 };

      let i = x.length;
      const y0 = new sprs.SparseUint16Array(x.length);
      const y1 = new sprs.SparseUint16Array(x.length);
      while (i--) {
        const c = fillHeight[i] / fillHeightBase[i];
        y0[i] = y[i] + sizeBase[i] / 2;
        y1[i] = y[i] + sizeBase[i] / 2 - c * size[i];
      }
      context.drawBarsV(x, y0, y1, sizeBase, pars);
    });
  };
  get boundingRects() {
    const [x, y, size] = this.getMappings();

    let [i, res] = [x.length, Array(x.length)];
    while (i--) {
      res[i] = [
        [x[i] - size[i] / 2, y[i] - size[i] / 2],
        [x[i] + size[i] / 2, y[i] + size[i] / 2],
      ];
    }
    return res;
  }
}
