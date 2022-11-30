import { Auxiliary } from "./Auxiliary.js";
export class AxisTitle extends Auxiliary {
    constructor(plot, along, label) {
        super(plot);
        this.getLabelMetrics = (context) => {
            return context.context.measureText(this.label);
        };
        this.draw = (context) => {
            if (this.label === "_indicator")
                return;
            const { scales, along, other } = this;
            const { margins, fontsize } = this.sizeHandler;
            const size = Math.floor(fontsize * 1.5);
            const dir = along === "x" ? -1 : 1;
            const margin = along === "x" ? margins.bottom : margins.left;
            const coords = { x: null, y: null };
            coords[along] = scales[along].pctToPlot(0.5);
            coords[other] = scales[other].plotMin - dir * (margin - 1.5 * fontsize);
            const rot = this.along === "x" ? 0 : 270;
            context.context.textAlign = "center";
            context.context.textBaseline = "middle";
            context.drawText([coords.x], [coords.y], [this.label], size, rot);
        };
        this.drawOverlay = (context) => {
            this.draw(context);
        };
        this.plot = plot;
        this.sizeHandler = plot.handlers.size;
        this.along = along;
        this.other = along === "x" ? "y" : "x";
        this.label = label;
    }
}
