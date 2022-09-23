import { GraphicLayer } from "./GraphicLayer.js";

export class GraphicStack {
  nPlots: number;
  graphicDiv: HTMLDivElement;
  graphicContainer: HTMLDivElement;
  graphicBase: GraphicLayer;
  graphicHighlight: GraphicLayer;
  graphicUser: GraphicLayer;
  divWidth: number;
  divHeight: number;
  containerWidth: number;
  containerHeight: number;
  width: number;
  height: number;

  constructor(element: HTMLDivElement, nPlots: number) {
    this.nPlots = nPlots;
    this.graphicDiv = element;
    this.graphicContainer = document.createElement("div");
    this.initialize();
  }

  initialize = () => {
    const graphicLayers = ["graphicBase", "graphicUser", "graphicHighlight"];

    this.graphicDiv.appendChild(this.graphicContainer);
    this.graphicContainer.setAttribute("class", "graphicContainer");

    // this.divWidth = parseInt(getComputedStyle(this.graphicDiv).width, 10);
    // this.divHeight = parseInt(getComputedStyle(this.graphicDiv).height, 10);

    this.width = parseInt(getComputedStyle(this.graphicContainer).width, 10);
    this.height = parseInt(getComputedStyle(this.graphicContainer).height, 10);

    graphicLayers.forEach((e) => {
      this[e] = new GraphicLayer(this.width, this.height);
      this.graphicContainer.appendChild(this[e].canvas);
    });
    this.graphicBase.drawBackground();
  };
}
