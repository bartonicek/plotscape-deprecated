import { GraphicLayer } from "../plot/GraphicLayer.js";

export class Auxiliary {
  scales: { [key: string]: any };
  handler: any;
  handlers: any;

  registerScales = (scales: any) => {
    this.scales = scales;
    return this;
  };

  draw = (context: GraphicLayer, ...args: any[]) => {};
  drawBase = (context: GraphicLayer, ...args: any[]) => {};
  drawUser = (context: GraphicLayer, handler: any, ...args: any[]) => {};
}
