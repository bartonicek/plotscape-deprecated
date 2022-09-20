(() => {
    const defines = {};
    const entry = [null];
    function define(name, dependencies, factory) {
        defines[name] = { dependencies, factory };
        entry[0] = name;
    }
    define("require", ["exports"], (exports) => {
        Object.defineProperty(exports, "__cjsModule", { value: true });
        Object.defineProperty(exports, "default", { value: (name) => resolve(name) });
    });
    define("datastructures", ["require", "exports"], function (require, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.plotTypeArray = exports.validMembershipArray = exports.baseMembershipArray = void 0;
        const baseMembershipArray = [1, 2, 3];
        exports.baseMembershipArray = baseMembershipArray;
        const validMembershipArray = [
            ...baseMembershipArray,
            ...baseMembershipArray.map((e) => e + 128),
            128,
        ];
        exports.validMembershipArray = validMembershipArray;
        const plotTypeArray = ["scatter", "bubble", "bar", "histo", "square"];
        exports.plotTypeArray = plotTypeArray;
    });
    define("functions", ["require", "exports"], function (require, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.timeExecution = exports.rectOverlap = exports.pointInRect = exports.uniqueRowIds = exports.uniqueRows = exports.arrTranspose = exports.arrEqual = exports.prettyBreaks = exports.accessIndexed = exports.accessUnpeel = exports.accessDeep = exports.throttle = exports.unique = exports.match = exports.which = exports.gatedMultiply = exports.quantile = exports.bin = exports.capitalize = exports.max = exports.min = exports.mean = exports.sum = exports.length = exports.identity = exports.isNumeric = void 0;
        const isNumeric = (x) => typeof x[0] === "number";
        exports.isNumeric = isNumeric;
        const identity = (x) => x;
        exports.identity = identity;
        const length = (x) => (x.length ? x.length : 0);
        exports.length = length;
        const sum = (x) => x.reduce((a, b) => a + b, 0);
        exports.sum = sum;
        const mean = (x) => x.length > 0 ? x.reduce((a, b) => a + b) / x.length : null;
        exports.mean = mean;
        const min = (x) => (x.length > 0 ? Math.min(...x) : null);
        exports.min = min;
        const max = (x) => (x.length > 0 ? Math.max(...x) : null);
        exports.max = max;
        const capitalize = (x) => {
            return typeof x === "string"
                ? x.charAt(0).toUpperCase() + x.slice(1)
                : x.map((e) => e.charAt(0).toUpperCase() + e.slice(1));
        };
        exports.capitalize = capitalize;
        const bin = (x, n = 5) => {
            const range = Math.max(...x) - Math.min(...x);
            const width = range / n;
            const breaks = Array.from(Array(n + 1), (e, i) => Math.min(...x) + i * width);
            const centroids = breaks.map((e, i) => (e + breaks[i - 1]) / 2);
            breaks.reverse();
            centroids.shift();
            return x
                .map((e) => breaks.findIndex((f) => e >= f))
                .map((e) => (e === 0 ? breaks.length - 2 : breaks.length - e - 1))
                .map((e) => centroids[e]);
        };
        exports.bin = bin;
        const quantile = (x, q) => {
            const sorted = x.sort((a, b) => a - b);
            if (typeof q === "number") {
                // For a single quantile
                const pos = q * (sorted.length - 1);
                const { lwr, uppr } = { lwr: Math.floor(pos), uppr: Math.ceil(pos) };
                return sorted[lwr] + (pos % 1) * (sorted[uppr] - sorted[lwr]);
            }
            else {
                // For multiple quantiles
                const pos = q.map((e) => e * (sorted.length - 1));
                const { lwr, uppr } = {
                    lwr: pos.map((e) => Math.floor(e)),
                    uppr: pos.map((e) => Math.ceil(e)),
                };
                return pos.map((e, i) => sorted[lwr[i]] + (e % 1) * (sorted[uppr[i]] - sorted[lwr[i]]));
            }
        };
        exports.quantile = quantile;
        const gatedMultiply = (a, b, limits) => {
            if (a * b < limits.min)
                return limits.min;
            if (a * b > limits.max)
                return limits.max;
            return a * b;
        };
        exports.gatedMultiply = gatedMultiply;
        const which = (x, value) => {
            return x.map((e, i) => (e === value ? i : NaN)).filter((e) => !isNaN(e));
        };
        exports.which = which;
        const match = (x, values) => {
            return x.map((e) => values.indexOf(e));
        };
        exports.match = match;
        const unique = (x) => {
            const uniqueArray = Array.from(new Set(x));
            return uniqueArray.length === 1 ? uniqueArray[0] : uniqueArray;
            //return x.filter((e, i) => x.indexOf(e) === i);    Slower
        };
        exports.unique = unique;
        const accessDeep = (obj, ...props) => {
            return props.reduce((a, b) => a && a[b], obj);
        };
        exports.accessDeep = accessDeep;
        const accessUnpeel = (obj, ...props) => {
            const destination = props.pop();
            let result;
            for (let i = props.length; i >= 0; i--) {
                result = accessDeep(obj, ...props, destination) ?? null;
                if (result)
                    break;
                props.pop();
            }
            return result;
        };
        exports.accessUnpeel = accessUnpeel;
        const accessIndexed = (obj, index) => {
            const res = Object.keys(obj).map((e) => [e, obj[e][index]]);
            return Object.fromEntries(res);
        };
        exports.accessIndexed = accessIndexed;
        const throttle = (fun, delay) => {
            let lastTime = 0;
            return (...args) => {
                const now = new Date().getTime();
                if (now - lastTime < delay)
                    return;
                lastTime = now;
                fun(...args);
            };
        };
        exports.throttle = throttle;
        // Function to construct "pretty" breaks, inspired by R's pretty()
        const prettyBreaks = (x, n = 4) => {
            const [min, max] = [Math.min(...x), Math.max(...x)];
            const range = max - min;
            const unitGross = range / n;
            const base = Math.floor(Math.log10(unitGross));
            const dists = [1, 2, 4, 5, 6, 8, 10].map((e) => (e - unitGross / 10 ** base) ** 2);
            const unitNeat = 10 ** base * [1, 2, 4, 5, 6, 8, 10][dists.indexOf(Math.min(...dists))];
            const big = Math.abs(base) > 4;
            const minNeat = Math.round(min / unitNeat) * unitNeat;
            const maxNeat = Math.round(max / unitNeat) * unitNeat;
            const middle = Array.from(Array((maxNeat - minNeat) / unitNeat - 1), (e, i) => minNeat + (i + 1) * unitNeat);
            const breaks = [minNeat, ...middle, maxNeat].map((e) => parseFloat(e.toFixed(4)));
            return big ? breaks.map((e) => e.toExponential()) : breaks;
        };
        exports.prettyBreaks = prettyBreaks;
        // arrEqual: Checks if two arrays are deeply equal
        const arrEqual = (array1, array2) => {
            return (array1.length == array2.length && array1.every((e, i) => e === array2[i]));
        };
        exports.arrEqual = arrEqual;
        const arrTranspose = (data) => {
            return data[0].map((_, i) => data.map((row) => row[i]));
        };
        exports.arrTranspose = arrTranspose;
        // uniqueRows: Gets the unique rows & corresponding row ids of a dataframe
        // (stored as an array of arrays/list of columns).
        // Runs faster than a for loop, even though the rows are created twice
        const uniqueRows = (data) => {
            // Transpose dataframe from array of cols to array of rows & turn the rows into strings
            const stringDataT = data[0].map((_, i) => JSON.stringify(data.map((row) => row[i])));
            const stringValues = unique(stringDataT);
            const indices = stringValues.map((e) => stringDataT.flatMap((f, j) => (f === e ? j : [])));
            const values = indices.map((e) => {
                return data.map((f) => f[e[0]]);
            });
            return { values, indices };
        };
        exports.uniqueRows = uniqueRows;
        const uniqueRowIds = (data) => {
            // Transpose dataframe from array of cols to array of rows & turn the rows into strings
            const stringRows = data[0].map((_, i) => JSON.stringify(data.map((row) => row[i])));
            const uniqueStringRows = unique(stringRows);
            return stringRows.map((e) => uniqueStringRows.indexOf(e));
        };
        exports.uniqueRowIds = uniqueRowIds;
        const pointInRect = (point, // x, y
        rect // x0, x1, y0, y1
        ) => {
            return ((point[0] - rect[0][0]) * (point[0] - rect[1][0]) < 0 &&
                (point[1] - rect[0][1]) * (point[1] - rect[1][1]) < 0);
        };
        exports.pointInRect = pointInRect;
        const rectOverlap = (rect1, rect2) => {
            const [p1x, p1y] = [0, 1].map((e) => rect1.map((f) => f[e]));
            const [p2x, p2y] = [0, 1].map((e) => rect2.map((f) => f[e]));
            return !(Math.max(...p1x) < Math.min(...p2x) ||
                Math.min(...p1x) > Math.max(...p2x) ||
                Math.max(...p1y) < Math.min(...p2y) ||
                Math.min(...p1y) > Math.max(...p2y));
        };
        exports.rectOverlap = rectOverlap;
        const vecDiff = (x, y) => {
            return x.map((e, i) => e - y[i]);
        };
        // Function to test if point is inside polygon based on linear algebra.
        // Hopefuly works. If not, try implementing the following:
        // https://wrf.ecse.rpi.edu/Research/Short_Notes/pnpoly.html
        const insidePoly = (point, polygon, distance) => {
            const xmin = Math.min(...polygon.map((e) => e[0]));
            const ymin = Math.min(...polygon.map((e) => e[1]));
            const xmax = Math.max(...polygon.map((e) => e[0]));
            const ymax = Math.max(...polygon.map((e) => e[1]));
            if (point[0] < xmin ||
                point[0] > xmax ||
                point[1] < ymin ||
                point[1] > ymax) {
                return false;
            }
            const inds1 = Array.from(Array(polygon.length), (e, i) => i);
            const inds2 = Array.from(Array(polygon.length), (e, i) => i);
            inds2.shift();
            inds2.push(0);
            const sides = inds1.map((e, i) => vecDiff(polygon[inds2[i]], polygon[e]));
            const intersections = polygon.map((e, i) => {
                return [
                    (point[1] - e[1]) / sides[i][1],
                    ((point[1] - e[1]) / sides[i][1]) * sides[i][0] + e[0] - point[0],
                ];
            });
            const valid = intersections
                .map((e) => e[1])
                .filter((f) => f > 0 && f < distance);
            return valid.length % 2 === 1;
        };
        const timeExecution = (fun) => {
            const start = performance.now();
            fun();
            const end = performance.now();
            return end - start;
        };
        exports.timeExecution = timeExecution;
    });
    define("main", ["require", "exports", "functions"], function (require, exports, funs) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.funs = void 0;
        exports.funs = funs;
    });
    
    'marker:resolver';

    function get_define(name) {
        if (defines[name]) {
            return defines[name];
        }
        else if (defines[name + '/index']) {
            return defines[name + '/index'];
        }
        else {
            const dependencies = ['exports'];
            const factory = (exports) => {
                try {
                    Object.defineProperty(exports, "__cjsModule", { value: true });
                    Object.defineProperty(exports, "default", { value: require(name) });
                }
                catch {
                    throw Error(['module "', name, '" not found.'].join(''));
                }
            };
            return { dependencies, factory };
        }
    }
    const instances = {};
    function resolve(name) {
        if (instances[name]) {
            return instances[name];
        }
        if (name === 'exports') {
            return {};
        }
        const define = get_define(name);
        if (typeof define.factory !== 'function') {
            return define.factory;
        }
        instances[name] = {};
        const dependencies = define.dependencies.map(name => resolve(name));
        define.factory(...dependencies);
        const exports = dependencies[define.dependencies.indexOf('exports')];
        instances[name] = (exports['__cjsModule']) ? exports.default : exports;
        return instances[name];
    }
    if (entry[0] !== null) {
        return resolve(entry[0]);
    }
})();