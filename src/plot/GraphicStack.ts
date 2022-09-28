import * as dtstr from "datastructures.js";
import { GraphicLayer } from "./GraphicLayer.js";

export class GraphicStack {
  globals: dtstr.Globals;
  graphicDiv: HTMLDivElement;
  graphicContainer: HTMLDivElement;
  graphicBase: GraphicLayer;
  graphicHighlight: GraphicLayer;
  graphicUser: GraphicLayer;

  constructor(element: HTMLDivElement, globals: dtstr.Globals) {
    this.globals = globals;
    this.graphicDiv = element;
    this.graphicContainer = document.createElement("div");
    this.initialize();
  }

  get width() {
    return this.globals.plotWidth;
  }

  get height() {
    return this.globals.plotHeight;
  }

  initialize = () => {
    const graphicLayers = ["graphicBase", "graphicUser", "graphicHighlight"];

    this.graphicDiv.appendChild(this.graphicContainer);
    this.graphicContainer.setAttribute("class", "graphicContainer");

    graphicLayers.forEach((e) => {
      this[e] = new GraphicLayer(this.globals);
      this.graphicContainer.appendChild(this[e].canvas);
    });
    this.graphicBase.drawBackground();
  };
}
