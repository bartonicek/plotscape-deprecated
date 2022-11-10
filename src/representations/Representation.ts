import * as dtstr from "../datastructures.js";
import * as funs from "../functions.js";
import {
  globalParameters,
  RepParsWide,
  SingleValuedRepPars,
} from "../globalparameters.js";
import { GraphicLayer } from "../plot/GraphicLayer.js";
import { Wrangler } from "../wrangler/Wrangler.js";

export class Representation {
  wrangler: Wrangler;
  plotDims: { width: number; height: number };
  scales: { [key: string]: any };
  pars: RepParsWide;
  pattern: CanvasPattern;

  sizeMultiplier: number;
  sizeLimits: { min: number; max: number };
  alphaMultiplier: number;
  alphaLimits: { min: number; max: number };

  constructor(wrangler: Wrangler) {
    this.wrangler = wrangler;
    this.pars = dtstr.validMembershipArray.map((e) => {
      const p = globalParameters.reps;
      if (e === 128) return funs.accessIndexed(p, p.colour.length - 1);
      return funs.accessIndexed(p, (e & ~128) - 1);
    });
    this.pattern = funs.createStripePattern(
      this.pars[this.pars.length - 1].colour,
      10
    );
    this.sizeMultiplier = 1;
    this.alphaMultiplier = 1;
    this.sizeLimits = {
      min: 1 / 5,
      max: 5,
    };
    this.alphaLimits = {
      min: 0.01,
      max: 1,
    };
  }

  getMapping = (
    mapping: dtstr.ValidMappings,
    membership?: dtstr.ValidMemberships
  ) => {
    let res = this.wrangler[mapping]?.extract(membership);
    if (!res) return [];
    return this.scales[mapping].dataToPlot(res);
  };

  // getMappings2 = (
  //   membership: dtstr.ValidMemberships,
  //   ...mappings: dtstr.ValidMappings[]
  // ) => {
  //   const { scales, wrangler } = this;
  //   let [i, res] = [mappings.length, Array(mappings.length)];
  //   while (i--) {
  //     const mapping = wrangler[mappings[i]];
  //     res[i] = scales[mapping].dataToPlot(
  //       wrangler[mappings[i]]?.extract(membership)
  //     );
  //   }
  // };

  get boundingRects() {
    return [];
  }

  getPars = (membership: dtstr.ValidMemberships) => {
    if (membership === 128 && this.wrangler.marker.anyPersistent) {
      return {
        ...this.pars[this.pars.length - 1],
        colour: this.pattern,
      } as unknown as SingleValuedRepPars;
    }
    if (membership === 128) return this.pars[this.pars.length - 1];
    return this.pars[(membership & ~128) - 1];
  };

  drawBase = (context: GraphicLayer) => {};
  drawHighlight = (context: GraphicLayer, selectedPoints: number[]) => {};

  registerScales = (scales: any) => {
    this.scales = scales;
    return this;
  };

  defaultize = () => {
    this.alphaMultiplier = 1;
    this.sizeMultiplier = 1;
  };

  // Checks which bounding rects overlap with a rectangular selection region
  //E.g. [[0, 0], [Width, Height]] should include all bound. rects
  inSelection = (selectionRect: dtstr.Rect2Points) => {
    const { wrangler, boundingRects } = this;
    const selectedReps = boundingRects.map((rect: dtstr.Rect2Points) => {
      return funs.rectOverlap(selectionRect, rect);
    });
    const selectedDatapoints = wrangler.indices.flatMap((e, i) => {
      return selectedReps[e] ? i : [];
    });
    return selectedDatapoints;
  };

  atClick = (clickPoint: [number, number]) => {
    const { wrangler, boundingRects } = this;
    const selectedReps = boundingRects.map((rect: dtstr.Rect2Points) => {
      return funs.pointInRect(clickPoint, rect);
    });
    const selectedDatapoints = wrangler.indices.flatMap((e, i) => {
      return selectedReps[e] ? i : [];
    });
    return selectedDatapoints;
  };

  // Handle generic keypress actions
  keyPressed = (key: string) => {
    const { sizeMultiplier, sizeLimits, alphaMultiplier, alphaLimits } = this;

    if (key === "KeyR") this.defaultize();

    if (key === "Minus" && sizeMultiplier) {
      this.sizeMultiplier = funs.gatedMultiply(sizeMultiplier, 0.8, sizeLimits);
    }

    if (key === "Equal" && sizeMultiplier && sizeMultiplier < sizeLimits.max) {
      this.sizeMultiplier = funs.gatedMultiply(sizeMultiplier, 1.2, sizeLimits);
    }

    if (key === "BracketLeft" && alphaMultiplier) {
      this.alphaMultiplier = funs.gatedMultiply(
        alphaMultiplier,
        0.8,
        alphaLimits
      );
    }

    if (key === "BracketRight" && alphaMultiplier)
      this.alphaMultiplier = funs.gatedMultiply(
        alphaMultiplier,
        1.2,
        alphaLimits
      );
  };
}
