import * as dtstr from "../datastructures.js";
import * as funs from "../functions.js";
import { GraphicLayer } from "../plot/GraphicLayer.js";
import { Wrangler } from "../wrangler/Wrangler.js";
import { Representation } from "./Representation.js";

export class Points extends Representation {
  constructor(wrangler: Wrangler) {
    super(wrangler);
  }

  get defaultRadius() {
    return Math.min(this.scales.x.length, this.scales.y.length) / 50;
  }

  getMappings = (membership: dtstr.ValidMemberships) => {
    const { getMapping, getPars, defaultRadius, sizeMultiplier } = this;
    const mappings: dtstr.ValidMappings[] = ["x", "y", "size"];
    let [x, y, size] = mappings.map((e) => getMapping(e, membership));
    const radius = getPars(membership).radius;

    if (!size.length) {
      size = Array(x.length).fill(radius * defaultRadius * sizeMultiplier);
    }

    if (size.length) {
      size = size.map((e) => e * radius * defaultRadius * sizeMultiplier);
    }

    return [x, y, size];
  };

  drawBase = (context: GraphicLayer) => {
    const [x, y, size] = this.getMappings(1);
    const pars = { ...this.getPars(1), alpha: this.alphaMultiplier };
    context.drawPoints(x, y, size, pars);
  };

  drawHighlight = (context: GraphicLayer) => {
    dtstr.highlightMembershipArray.forEach((e) => {
      const [x, y, size] = this.getMappings(e);
      if (!(x.length > 0)) return;
      const pars = { ...this.getPars(e), alpha: 1 };
      context.drawPoints(x, y, size, pars);
    });
  };

  get boundingRects() {
    const [x, y, size] = this.getMappings(1);
    const c = 1 / Math.sqrt(2);
    return x.map((xi, i) => [
      [xi - c * size[i], y[i] - c * size[i]],
      [xi + c * size[i], y[i] + c * size[i]],
    ]);
  }
}
