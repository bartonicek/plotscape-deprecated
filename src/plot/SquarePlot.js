import * as scls from "../scales/scales.js";
import * as reps from "../representations/representations.js";
import * as funs from "../functions.js";
import { Wrangler } from "../wrangler/Wrangler.js";
import { Plot } from "./Plot.js";
export class SquarePlot extends Plot {
    constructor(plotConfig) {
        const { data, mapping, globals } = plotConfig;
        if (!mapping.has("size"))
            mapping.set("size", "_indicator");
        if (!mapping.has("fillSize"))
            mapping.set("fillSize", "_indicator");
        super(plotConfig);
        this.wranglers = {
            wrangler1: new Wrangler(data, mapping, globals.marker)
                .groupBy("x", "y")
                .groupWhat("size", "fillSize")
                .doReduce("by", funs.unique)
                .doReduce("what", funs.sum)
                .assignIndices(),
        };
        this.scales = {
            x: new scls.PlotScaleDiscrete(),
            y: new scls.PlotScaleDiscrete(),
            size: new scls.AreaScaleContinuous(),
            fillSize: new scls.LengthScaleContinuous(),
        };
        this.representations = {
            squares: new reps.Squares(this.wranglers.wrangler1),
        };
        this.initialize();
    }
}
