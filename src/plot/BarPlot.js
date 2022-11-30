import * as scls from "../scales/scales.js";
import * as reps from "../representations/representations.js";
import * as funs from "../functions.js";
import { Wrangler } from "../wrangler/Wrangler.js";
import { Plot } from "./Plot.js";
export class BarPlot extends Plot {
    constructor(plotConfig) {
        const { data, mapping, globals } = plotConfig;
        super(plotConfig);
        this.wranglers = {
            wrangler1: new Wrangler(data, mapping, globals.marker)
                .groupBy("x")
                .groupWhat("y")
                .doReduce("by", funs.unique)
                .doReduce("what", funs.sum)
                .assignIndices(),
        };
        this.scales = {
            x: new scls.PlotScaleDiscrete(),
            y: new scls.PlotScaleContinuous(true),
        };
        this.representations = {
            bars: new reps.Bars(this.wranglers.wrangler1, 0.8),
        };
        this.initialize();
    }
}
