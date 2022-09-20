import { GraphicLayer } from "./GraphicLayer.js";

export class GraphicStack {
  graphicDiv: HTMLDivElement;
  graphicContainer: HTMLDivElement;
  graphicBase: GraphicLayer;
  graphicHighlight: GraphicLayer;
  graphicUser: GraphicLayer;
  width: number;
  height: number;

  constructor(element: HTMLDivElement) {
    this.graphicDiv = element;
    this.graphicContainer = document.createElement("div");
    this.initialize();
  }

  initialize = () => {
    const graphicLayers = ["graphicBase", "graphicUser", "graphicHighlight"];

    this.graphicDiv.appendChild(this.graphicContainer);
    this.graphicContainer.setAttribute("class", "graphicContainer");

    this.width = parseInt(getComputedStyle(this.graphicContainer).width, 10);
    this.height = parseInt(getComputedStyle(this.graphicContainer).height, 10);

    graphicLayers.forEach((e) => {
      this[e] = new GraphicLayer(this.width, this.height);
      this.graphicContainer.appendChild(this[e].canvas);
    });
    this.graphicBase.drawBackground();
  };
}
