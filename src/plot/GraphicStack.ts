import * as dtstr from "datastructures.js";
import { GraphicLayer } from "./GraphicLayer.js";

export class GraphicStack {
  sceneDiv: HTMLDivElement;
  containerDiv: HTMLDivElement;
  globals: dtstr.Globals;
  dimensions: { height: number; width: number };

  graphicBase: GraphicLayer;
  graphicHighlight: GraphicLayer;
  graphicUser: GraphicLayer;

  constructor(element: HTMLDivElement) {
    this.sceneDiv = element;
    this.containerDiv = document.createElement("div");
    this.initialize();
  }

  get width() {
    return parseInt(getComputedStyle(this.containerDiv).width, 10);
  }

  get height() {
    return parseInt(getComputedStyle(this.containerDiv).height, 10);
  }

  initialize = () => {
    const graphicLayers = ["graphicBase", "graphicUser", "graphicHighlight"];

    this.sceneDiv.appendChild(this.containerDiv);
    this.containerDiv.classList.add("plotscape-container");

    graphicLayers.forEach((e) => {
      this[e] = new GraphicLayer(this.containerDiv);
      this.containerDiv.appendChild(this[e].canvas);
    });
    this.graphicBase.drawBackground();
  };
}
