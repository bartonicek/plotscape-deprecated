import * as dtstr from "../datastructures.js";
import * as sprs from "../sparsearrays.js";
import { GraphicLayer } from "../plot/GraphicLayer.js";
import { Wrangler } from "../wrangler/Wrangler.js";
import { Representation } from "./Representation.js";

export class Points extends Representation {
  x: Uint16Array;
  y: Uint16Array;
  size: Uint16Array;
  hasSize: boolean;

  constructor(wrangler: Wrangler) {
    super(wrangler);
    this.hasSize = !!wrangler.mapping.get("size");
  }

  get defaultRadius() {
    const { x, y } = this.scales;
    if (!x.continuous && !y.continuous) {
      return Math.min(x.breakWidth, y.breakWidth) / Math.sqrt(Math.PI);
    }
    const length = Math.min(...[x, y].map((e) => Math.abs(e.plotRange)));
    const c = 10 * Math.log(this.wrangler.n);
    return length / c;
  }

  getMappings = (membership: dtstr.ValidMemberships) => {
    const { getMapping, getPars, defaultRadius, sizeMultiplier } = this;
    const mappings: dtstr.ValidMappings[] = ["x", "y", "size"];
    let [x, y, size] = mappings.map((e) => getMapping(e, membership));
    const radius = getPars(membership).radius;

    if (!this.hasSize) {
      size = new sprs.SparseUint16Array(x.length).fill(
        radius * defaultRadius * sizeMultiplier
      );

      return [x, y, size];
    }
    size = size.map((e) => e * radius * defaultRadius * sizeMultiplier);
    return [x, y, size];
  };

  drawBase = (context: GraphicLayer) => {
    const [x, y, size] = this.getMappings(1);
    const pars = { ...this.getPars(1), alpha: this.alphaMultiplier };
    context.drawPoints(x, y, size, pars, this.wrangler.emptyObjects);
  };

  drawHighlight = (context: GraphicLayer) => {
    dtstr.highlightMembershipArray.forEach((e) => {
      const [x, y, size] = this.getMappings(e);
      if (!(x.length > 0)) return;
      const pars = { ...this.getPars(e), alpha: 1 };
      context.drawPoints(x, y, size, pars, this.wrangler.emptyObjects);
    });
  };

  get boundingRects() {
    const [x, y, size] = this.getMappings(1);
    const c = 1 / Math.sqrt(2);
    let [i, res] = [x.length, Array(x.length)];
    while (i--) {
      res[i] = [
        [x[i] - c * size[i], y[i] - c * size[i]],
        [x[i] + c * size[i], y[i] + c * size[i]],
      ];
    }
    return res;
  }
}
