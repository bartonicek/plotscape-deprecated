import * as dtstr from "datastructures.js";
import { GraphicLayer } from "./GraphicLayer.js";

export class GraphicStack {
  graphicDiv: HTMLDivElement;
  graphicContainer: HTMLDivElement;
  globals: dtstr.Globals;
  dimensions: { height: number; width: number };

  graphicBase: GraphicLayer;
  graphicHighlight: GraphicLayer;
  graphicUser: GraphicLayer;

  constructor(
    element: HTMLDivElement,
    globals: dtstr.Globals,
    dimensions?: { height: number; width: number }
  ) {
    this.graphicDiv = element;
    this.graphicContainer = document.createElement("div");
    this.globals = globals;
    this.dimensions = dimensions;
    this.initialize();
  }

  get width() {
    if (this.dimensions) return this.dimensions.width;
    return this.globals.size.plotWidth;
  }

  get height() {
    if (this.dimensions) return this.dimensions.height;
    return this.globals.size.plotHeight;
  }

  initialize = () => {
    const graphicLayers = ["graphicBase", "graphicUser", "graphicHighlight"];

    this.graphicDiv.appendChild(this.graphicContainer);
    this.graphicContainer.setAttribute("class", "graphicContainer");

    graphicLayers.forEach((e) => {
      this[e] = new GraphicLayer(this.globals, this.dimensions);
      this.graphicContainer.appendChild(this[e].canvas);
    });
    this.graphicBase.drawBackground();
  };
}
