import * as scls from "../scales/scales.js";
import * as reps from "../representations/representations.js";
import { Wrangler } from "../wrangler/Wrangler.js";
import { Plot } from "./Plot.js";
export class ScatterPlot extends Plot {
    constructor(plotConfig) {
        const { data, mapping, globals } = plotConfig;
        super(plotConfig);
        this.mapping = mapping;
        this.wranglers = {
            wrangler1: new Wrangler(data, mapping, globals.marker).extractAsIs("x", "y"),
        };
        this.scales = {
            x: new scls.PlotScaleContinuous(),
            y: new scls.PlotScaleContinuous(),
        };
        this.representations = {
            points: new reps.Points(this.wranglers.wrangler1),
        };
        this.initialize();
    }
}
