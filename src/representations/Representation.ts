import * as dtstr from "../datastructures.js";
import * as funs from "../functions.js";
import { globalParameters, RepParsWide } from "../globalparameters.js";
import { Wrangler } from "../wrangler/Wrangler.js";

export class Representation {
  wrangler: Wrangler;
  selectedCases: number[];

  plotDims: { width: number; height: number };
  scales: { [key: string]: any };
  pars: RepParsWide;

  sizeX: number;
  sizeLim: { min: number; max: number };
  alphaX: number;
  alphaLim: { min: number; max: number };

  constructor(wrangler: Wrangler) {
    this.wrangler = wrangler;
    this.selectedCases = new Array(wrangler.nCases);

    const p = globalParameters.reps;
    this.pars = dtstr.validMembershipArray.map((e) => {
      if (e === 128) return funs.accessIndexed(p, p.colour.length - 1);
      return funs.accessIndexed(p, (e & ~128) - 1);
    });
    this.sizeX = 1;
    this.alphaX = 1;
    this.sizeLim = { min: 0.2, max: 5 };
    this.alphaLim = { min: 0.01, max: 1 };
  }

  get boundingRects() {
    return [];
  }

  getMapping = (
    membership: dtstr.ValidMemberships,
    mapping: dtstr.ValidMappings
  ) => {
    const { wrangler, scales } = this;
    const res = wrangler[mapping]?.extract(membership);
    if (!res) return null;
    const coords = scales[mapping].dataToPlot(res);
    return coords;
  };

  getMappings = (
    membership: dtstr.ValidMemberships,
    ...mappings: dtstr.ValidMappings[]
  ) => {
    let [i, res] = [mappings.length, Array(mappings.length)];
    while (i--) res[i] = this.getMapping(membership, mappings[i]);
    return res;
  };

  getPars = (membership: dtstr.ValidMemberships) => {
    if (membership === 128 && this.wrangler.marker.anyPersistent) {
      let pars = this.pars[this.pars.length - 1];
      pars = { ...pars, colour: `${pars.colour}66` };
      return pars;
    }

    if (membership === 128) return this.pars[this.pars.length - 1];
    return this.pars[(membership & ~128) - 1];
  };

  registerScales = (scales: any) => {
    this.scales = scales;
    return this;
  };

  defaultize = () => {
    this.alphaX = 1;
    this.sizeX = 1;
  };

  inSelection = (selectionRect: dtstr.Rect2Points) => {
    const { wrangler, boundingRects, selectedCases } = this;
    let [i, k] = [boundingRects.length, wrangler.nCases];
    while (i--) {
      // If the ith graphical object is selected...
      if (funs.rectOverlap(selectionRect, boundingRects[i])) {
        // ...append all corresponding case indices
        // to the list of the selected cases, starting from end
        let j = wrangler.nCases;
        while (j--) {
          if (wrangler.indices[j] === i) selectedCases[--k] = j;
        }
      }
    }
    // Shorten the array if some objects were not selected
    return selectedCases.slice(k, wrangler.nCases);
  };

  atClick = (clickPoint: [number, number]) => {
    const { wrangler, selectedCases, boundingRects } = this;

    let [i, k] = [boundingRects.length, wrangler.nCases];
    while (i--) {
      // If the ith graphical object is clicked...
      if (funs.pointInRect(clickPoint, boundingRects[i])) {
        // ...append all corresponding case indices
        // to the list of the selected cases, starting from end
        let j = wrangler.nCases;
        while (j--) {
          if (wrangler.indices[j] === i) selectedCases[--k] = j;
        }
      }
    }
    // Shorten the array if some objects were not selected
    return selectedCases.slice(k, wrangler.nCases);
  };

  // Handle generic keypress actions
  keyPressed = (key: string) => {
    const {
      sizeX: sizeMultiplier,
      sizeLim: sizeLimits,
      alphaX: alphaMultiplier,
      alphaLim: alphaLimits,
    } = this;

    if (key === "KeyR") this.defaultize();

    if (key === "Minus" && sizeMultiplier) {
      this.sizeX = funs.gatedMultiply(sizeMultiplier, 0.8, sizeLimits);
    }

    if (key === "Equal" && sizeMultiplier && sizeMultiplier < sizeLimits.max) {
      this.sizeX = funs.gatedMultiply(sizeMultiplier, 1.2, sizeLimits);
    }

    if (key === "BracketLeft" && alphaMultiplier) {
      this.alphaX = funs.gatedMultiply(alphaMultiplier, 0.8, alphaLimits);
    }

    if (key === "BracketRight" && alphaMultiplier)
      this.alphaX = funs.gatedMultiply(alphaMultiplier, 1.2, alphaLimits);
  };
}
