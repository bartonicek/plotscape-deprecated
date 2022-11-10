import * as dtstr from "../datastructures.js";
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
    console.log({ size, fillHeight });

    if (!size.length) {
      size = new dtstr.SparseFloat32Array(x.length).fill(
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
    return Math.abs(Math.min(x.plotScale.range, y.plotScale.range)) / 25;
  }
  drawBase = (context: GraphicLayer) => {
    let [x, y, size] = this.getMappings(1);
    if (!x) return;
    const pars = { ...this.getPars(1), alpha: this.alphaMultiplier };
    const y0 = y.map((e, i) => e + size[i] / 2);
    const y1 = y0.map((e, i) => e - size[i]);
    context.drawBarsV(x, y0, y1, size, pars);
  };
  drawHighlight = (context: GraphicLayer) => {
    dtstr.highlightMembershipArray.forEach((e) => {
      const [x, y, size, fillHeight] = this.getMappings(e);
      const [, , sizeBase, fillHeightBase] = this.getMappings(1);
      if (!x) return;
      const pars = { ...this.getPars(e), alpha: 1 };
      let [i, y0, y1] = [
        x.length,
        new dtstr.SparseFloat32Array(x.length),
        new dtstr.SparseFloat32Array(x.length),
      ];
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
