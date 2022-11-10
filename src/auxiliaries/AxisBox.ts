import { GraphicLayer } from "../plot/GraphicLayer.js";
import { Auxiliary } from "./Auxiliary.js";

export class AxisBox extends Auxiliary {
  draw = (context: GraphicLayer) => {
    const { x0, y0, x1, y1 } = this.plot.handlers.size.innerCoords;
    context.drawLine([x0, x1], [y0, y0]);
    context.drawLine([x0, x0], [y0, y1]);
  };

  drawOverlay = (context: GraphicLayer) => {
    this.draw(context);
  };
}
