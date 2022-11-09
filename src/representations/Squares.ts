import { Handler } from "../handlers/Handler.js";
import { Wrangler } from "../wrangler/Wrangler.js";
import { Representation } from "./Representation.js";
import * as dtstr from "../datastructures.js";
import { GraphicLayer } from "../plot/GraphicLayer.js";

export class Squares extends Representation {
  constructor(wrangler: Wrangler) {
    super(wrangler);
    this.sizeLimits = { min: 0.01, max: 1.5 };
  }

  getMappings = (membership?: dtstr.ValidMemberships) => {
    const { getMapping, maxWidth, sizeMultiplier } = this;
    const mappings: dtstr.ValidMappings[] = ["x", "y", "size"];
    let [x, y, size] = mappings.map((e) => getMapping(e, membership));

    if (size.length > 0) {
      size = size.map((e) => maxWidth * e * sizeMultiplier);
    } else {
      size = Array.from(Array(x.length), (e) => maxWidth * sizeMultiplier);
    }

    return [x, y, size];
  };

  get maxWidth() {
    const { x, y } = this.scales;
    if (x.continuous || y.continuous) {
      return Math.min(
        (x.plotMax - x.plotMin) / 10,
        (y.plotMin - y.plotMax) / 10
      );
    }
    return Math.min(x.intervalWidth, y.intervalWidth);
  }

  drawBase = (context: GraphicLayer) => {
    let [x, y, size] = this.getMappings(1);
    if (!x) return;
    const pars = { ...this.getPars(1), alpha: this.alphaMultiplier };
    const y0 = y.map((e, i) => e + size[i] / 2);
    const y1 = y0.map((e, i) => e - size[i]);
    context.drawBarsV(x, y1, y0, size, pars);
  };

  drawHighlight = (context: GraphicLayer) => {
    dtstr.highlightMembershipArray.forEach((e) => {
      let [x, y, size] = this.getMappings(e);
      const [, , sizeBase] = this.getMappings();
      if (!x) return;
      const pars = { ...this.getPars(e), alpha: 1 };
      const y0 = y.map((e, i) => e + sizeBase[i] / 2);
      const y1 = y0.map((e, i) => e - size[i]);
      context.drawBarsV(x, y1, y0, sizeBase, pars);
    });
  };

  get boundingRects() {
    const [x, y, size] = this.getMappings();
    return x.map((xi, i) => [
      [xi - size[i] / 2, y[i] - size[i] / 2],
      [xi + size[i] / 2, y[i] + size[i] / 2],
    ]);
  }
}
