import * as sprs from "../sparsearrays.js";
export class LengthScaleContinuous {
    constructor(zero = false) {
        this.setPlotLimits = (min, max) => {
            this.lengthMin = min;
            this.lengthMax = max;
            return this;
        };
        this.registerData = (data) => {
            const sorted = data.sort((a, b) => a - b);
            this.dataMin = this.zero ? 0 : sorted[0];
            this.dataMax = sorted[sorted.length - 1];
            return this;
        };
        this.dataToPlot = (data) => {
            const { dataMin, dataMax } = this;
            if (sprs.isArrayLike(data)) {
                let [i, res] = [data.length, new sprs.SparseFloat32Array(data)];
                while (i--) {
                    if (res.empty[i])
                        continue;
                    res[i] = data[i] / dataMax;
                }
                return res;
            }
            return data / dataMax;
        };
        this.continuous = true;
        this.zero = zero;
        this.lengthMin = 0;
        this.lengthMax = 1;
        this.dataMax = 0;
        this.dataMin = 0;
    }
    get dataRange() {
        return this.dataMax - this.dataMin;
    }
    get dataRepresentation() {
        return [this.dataMin, this.dataMax];
    }
}
