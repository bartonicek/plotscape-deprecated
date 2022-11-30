import * as dtstr from "datastructures.js";
import { GraphicLayer } from "./GraphicLayer.js";

export class GraphicStack {
  sceneDiv: HTMLDivElement;
  containerDiv: HTMLDivElement;
  globals: dtstr.Globals;
  dimensions: { height: number; width: number };
  layers: { [key: string]: GraphicLayer };

  constructor(element: HTMLDivElement) {
    this.sceneDiv = element;
    this.containerDiv = document.createElement("div");
    this.layers = {};
    this.initialize();
  }

  get width() {
    return parseInt(getComputedStyle(this.containerDiv).width, 10);
  }

  get height() {
    return parseInt(getComputedStyle(this.containerDiv).height, 10);
  }

  initialize = () => {
    const graphicLayers = ["base", "user", "highlight", "overlay"];

    this.sceneDiv.appendChild(this.containerDiv);
    this.containerDiv.classList.add("plotscape-container");

    graphicLayers.forEach((e) => {
      this.layers[e] = new GraphicLayer(this.containerDiv);
      this.containerDiv.appendChild(this.layers[e].canvas);
    });
    this.layers.base.drawBackground();
  };
}
