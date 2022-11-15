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
  selectedCases: number[];

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
    this.selectedCases = new Array(wrangler.n);

    const p = globalParameters.reps;
    this.pars = dtstr.validMembershipArray.map((e) => {
      if (e === 128) return funs.accessIndexed(p, p.colour.length - 1);
      return funs.accessIndexed(p, (e & ~128) - 1);
    });
    this.sizeMultiplier = 1;
    this.alphaMultiplier = 1;
    this.sizeLimits = { min: 0.2, max: 5 };
    this.alphaLimits = { min: 0.01, max: 1 };
  }

  getMapping = (
    mapping: dtstr.ValidMappings,
    membership?: dtstr.ValidMemberships
  ) => {
    const { wrangler, scales } = this;
    const res = wrangler[mapping]?.extract(membership, wrangler.emptyObjects);
    if (!res) return [];
    const coords = scales[mapping].dataToPlot(res, wrangler.emptyObjects);
    return coords;
  };

  get boundingRects() {
    return [];
  }

  getPars = (membership: dtstr.ValidMemberships) => {
    if (membership === 128 && this.wrangler.marker.anyPersistent) {
      let pars = this.pars[this.pars.length - 1];
      pars = { ...pars, colour: `${pars.colour}66` };
      return pars;
    }

    if (membership === 128) return this.pars[this.pars.length - 1];
    return this.pars[(membership & ~128) - 1];
  };

  drawBase = (context: GraphicLayer) => {};
  drawHighlight = (context: GraphicLayer) => {};

  registerScales = (scales: any) => {
    this.scales = scales;
    return this;
  };

  defaultize = () => {
    this.alphaMultiplier = 1;
    this.sizeMultiplier = 1;
  };

  inSelection = (selectionRect: dtstr.Rect2Points) => {
    const { wrangler, boundingRects, selectedCases } = this;
    let [i, k] = [boundingRects.length, wrangler.n];
    while (i--) {
      // If the ith representation is selected...
      if (funs.rectOverlap(selectionRect, boundingRects[i])) {
        // ...append all case indices that correspond to it
        // to the list of the selected cases, starting from the end
        let j = wrangler.n;
        while (j--) {
          if (wrangler.indices[j] === i) selectedCases[--k] = j;
        }
      }
    }

    // Return only the selected indices
    return selectedCases.slice(k, wrangler.n);
  };

  atClick = (clickPoint: [number, number]) => {
    const { wrangler, selectedCases, boundingRects } = this;

    let [i, k] = [boundingRects.length, wrangler.n];
    while (i--) {
      // If the ith representation is clicked...
      if (funs.pointInRect(clickPoint, boundingRects[i])) {
        // ...add all case indices that correspond to it
        // to the list of selected cases, starting from the end
        let j = wrangler.n;
        while (j--) {
          if (wrangler.indices[j] === i) selectedCases[--k] = j;
        }
      }
    }

    // Return only the selected indices
    return selectedCases.slice(k, wrangler.n);
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
