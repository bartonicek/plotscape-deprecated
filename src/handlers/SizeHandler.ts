import * as dtstr from "../datastructures.js";
import { Handler } from "./Handler.js";

export class SizeHandler extends Handler {
  nPlots: number;
  sceneWidth: number;
  sceneHeight: number;
  scaleFactor: number;
  shrinkFactor: number;

  constructor(element: HTMLDivElement, scaleFactor = 3, shrinkFactor = 0.85) {
    super();
    this.nPlots = 0;
    this.sceneWidth = parseInt(getComputedStyle(element).width, 10);
    this.sceneHeight = parseInt(getComputedStyle(element).height, 10);
    this.scaleFactor = scaleFactor;
    this.shrinkFactor = shrinkFactor;
  }

  get nRows() {
    return Math.floor(Math.sqrt(this.nPlots));
  }

  get nCols() {
    return Math.ceil(this.nPlots / this.nRows);
  }

  get plotHeight() {
    return (this.shrinkFactor * this.sceneHeight) / this.nRows;
  }

  get plotWidth() {
    return (this.shrinkFactor * this.sceneWidth) / this.nCols;
  }
}
