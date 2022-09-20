import * as dtstr from "../datastructures.js";
import * as funs from "../functions.js";
import { GraphicLayer } from "../plot/GraphicLayer.js";
import { Wrangler } from "../wrangler/Wrangler.js";
import { Representation } from "./Representation.js";

export class Points extends Representation {
  constructor(wrangler: Wrangler) {
    super(wrangler);
  }

  getMappings = (membership: dtstr.ValidMemberships) => {
    const mappings: dtstr.ValidMappings[] = ["x", "y", "size"];
    let [x, y, size] = mappings.map((e) => this.getMapping(e, membership));
    const radius = this.getPars(membership).radius;

    size =
      size.length > 0
        ? size.map((e) => radius * e * this.sizeMultiplier)
        : Array.from(Array(x.length), (e) => radius * this.sizeMultiplier);
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
    dtstr.validMembershipArray.forEach((e) => {
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
