import { Plot } from "./../plot/Plot.js";
import { GraphicLayer } from "../plot/GraphicLayer.js";

export class Auxiliary {
  plot: Plot;
  scales: { [key: string]: any };
  handler: any;
  handlers: any;

  constructor(plot: Plot) {
    this.plot = plot;
  }

  registerScales = (scales: any) => {
    this.scales = scales;
    return this;
  };

  draw = (context: GraphicLayer, ...args: any[]) => {};
  drawBase = (context: GraphicLayer, ...args: any[]) => {};
  drawUser = (context: GraphicLayer, handler: any, ...args: any[]) => {};
}
