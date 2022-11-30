import { Auxiliary } from "./Auxiliary.js";
export class AxisBox extends Auxiliary {
    constructor() {
        super(...arguments);
        this.draw = (context) => {
            const { x0, y0, x1, y1 } = this.plot.handlers.size.innerCoords;
            context.drawLine([x0, x1], [y0, y0]);
            context.drawLine([x0, x0], [y0, y1]);
        };
        this.drawOverlay = (context) => {
            this.draw(context);
        };
    }
}
