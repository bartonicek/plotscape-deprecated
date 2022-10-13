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
    return Math.min(this.scales.x.length, this.scales.y.length) / 20;
  }

  getMappings = (membership: dtstr.ValidMemberships) => {
    const { getMapping, getPars, defaultRadius, sizeMultiplier } = this;
    const mappings: dtstr.ValidMappings[] = ["x", "y", "size"];
    let [x, y, size] = mappings.map((e) => getMapping(e, membership));
    const radius = getPars(membership).radius;

    size =
      size.length > 0
        ? size.map((e) => radius * e * defaultRadius * sizeMultiplier)
        : Array.from(
            Array(x.length),
            (e) => radius * defaultRadius * sizeMultiplier
          );
    return [x, y, size];
  };

  drawBase = (context: GraphicLayer) => {
    const [x, y, size] = this.getMappings(1);
    const { col, strokeCol, strokeWidth } = this.getPars(1);
    const pars = {
      col,
      radius: size,
      strokeCol,
      strokeWidth,
      alpha: this.alphaMultiplier,
    };
    context.drawPoints(x, y, pars);
  };

  drawHighlight = (context: GraphicLayer) => {
    dtstr.highlightMembershipArray.forEach((e) => {
      const [x, y, size] = this.getMappings(e);
      if (!(x.length > 0)) return;
      const { col, strokeCol, strokeWidth } = this.getPars(e);
      const pars = {
        col,
        radius: size,
        strokeCol,
        strokeWidth,
        alpha: 1,
      };
      context.drawPoints(x, y, pars);
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
