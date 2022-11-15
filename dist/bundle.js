var PLOTSCAPE = (() => {
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
    var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        var desc = Object.getOwnPropertyDescriptor(m, k);
        if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
          desc = { enumerable: true, get: function() { return m[k]; } };
        }
        Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        o[k2] = m[k];
    }));
    var __exportStar = (this && this.__exportStar) || function(m, exports) {
        for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
    };
    define("functions", ["require", "exports"], function (require, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.timeExecution = exports.rectOverlap = exports.pointInRect = exports.uniqueRowIds = exports.uniqueRows = exports.arrTranspose = exports.arrEqual = exports.toPretty = exports.prettyBreaks = exports.createStripePattern = exports.accessIndexed = exports.accessUnpeel = exports.accessDeep = exports.throttle = exports.tabulateAndStringify = exports.tabulate = exports.unique = exports.match = exports.which = exports.gatedMultiply = exports.quantile = exports.bin = exports.capitalize = exports.max = exports.min = exports.mean = exports.sum = exports.length = exports.identity = exports.stringify = exports.deeplyClone = exports.sort = void 0;
        const sort = (arr) => {
            if (typeof arr[0] === "number")
                return arr.sort((a, b) => a - b);
            return arr.sort();
        };
        exports.sort = sort;
        /**
         * Copy an object with all of its (nested) properties. Use to avoid passing by reference.
         * @param x An object.
         * @returns A copy of `x`.
         */
        const deeplyClone = (x) => {
            return JSON.parse(JSON.stringify(x));
        };
        exports.deeplyClone = deeplyClone;
        /**
         * Turn a value or an array into a string or array of strings
         * @param x A value or array
         * @returns A string or array of strings
         */
        const stringify = (x) => {
            if (typeof x === "string" || typeof x[0] === "string")
                return x;
            return x.length ? x.map((e) => `${e}`) : `${x}`;
        };
        exports.stringify = stringify;
        /**
         * Returns the length of an array
         * @param x An array
         * @returns Length (`number`)
         */
        const length = (x) => x.length;
        exports.length = length;
        /**
         * Return back the same array, unchanged.
         * @param x An array of values.
         * @returns The same array.
         */
        const identity = (x) => x;
        exports.identity = identity;
        /**
         * Sum an array
         * @param x An array of numbers
         * @returns Sum (`number`)
         */
        const sum = (x) => {
            if (!x.length)
                return null;
            return x.reduce((a, b) => a + b, 0);
        };
        exports.sum = sum;
        /**
         * Take the average of an array
         * @param x An array of numbers
         * @returns Mean (`number`)
         */
        const mean = (x) => (x.length ? sum(x) / x.length : null);
        exports.mean = mean;
        /**
         * Take the minimum of an array
         * @param x An array of numbers
         * @returns Minimum (`number`)
         */
        const min = (x) => (x.length ? Math.min.apply(null, x) : null);
        exports.min = min;
        /**
         * Take the maximum of an array
         * @param x An array of numbers
         * @returns Maximum (`number`)
         */
        const max = (x) => (x.length ? Math.max.apply(null, x) : null);
        exports.max = max;
        /**
         * Capitalize the first letter of a string or an array of strings
         * @param x A `string` or an array of strings
         * @returns A `string` or an array of strings, equal shape as `x`
         */
        const capitalize = (x) => {
            return typeof x === "string"
                ? x.charAt(0).toUpperCase() + x.slice(1)
                : x.map((e) => e.charAt(0).toUpperCase() + e.slice(1));
        };
        exports.capitalize = capitalize;
        /**
         * Bin an array into equally sized bin and assigns each element to the nearest bin centroid
         * @param x An array of numbers
         * @param n Number of bins (`number`)
         * @returns An array of bin cetroids, equal length as `x`
         */
        const bin = (x, n = 5) => {
            if (!x.length)
                return null;
            const minimum = min(x);
            const range = max(x) - minimum;
            const width = range / n;
            const breaks = Array.from(Array(n + 1), (e, i) => minimum + i * width);
            const centroids = breaks.map((e, i) => (e + breaks[i - 1]) / 2);
            breaks.reverse();
            centroids.shift();
            return x
                .map((e) => breaks.findIndex((f) => e >= f))
                .map((e) => (e === 0 ? breaks.length - 2 : breaks.length - e - 1))
                .map((e) => centroids[e]);
        };
        exports.bin = bin;
        /**
         * Take the quantile(s) of an array
         * @param x An array of numbers
         * @param q A quantile (`number`, between 0 and 1) or an array of quantiles
         * @returns A data quantile or an array of data quantiles
         */
        const quantile = (x, q) => {
            if (!x.length)
                return null;
            const sorted = x.sort((a, b) => a - b);
            // For a single quantile
            if (typeof q === "number") {
                const pos = q * (sorted.length - 1);
                const { lwr, uppr } = { lwr: Math.floor(pos), uppr: Math.ceil(pos) };
                return sorted[lwr] + (pos % 1) * (sorted[uppr] - sorted[lwr]);
            }
            // For multiple quantiles
            const pos = q.map((e) => e * (sorted.length - 1));
            const { lwr, uppr } = {
                lwr: pos.map((e) => Math.floor(e)),
                uppr: pos.map((e) => Math.ceil(e)),
            };
            return pos.map((e, i) => sorted[lwr[i]] + (e % 1) * (sorted[uppr[i]] - sorted[lwr[i]]));
        };
        exports.quantile = quantile;
        /**
         * Multiply two numbers or return a minimum or maximum limit, if the products exceeds either of them
         * @param a A `number`
         * @param b A `number`
         * @param limits An object with `min` and `max` properties
         * @returns Either `a * b` or `min` (if `a * b < min`) or `max` (if `a * b > max`)
         */
        const gatedMultiply = (a, b, limits) => {
            if (a * b < limits.min)
                return limits.min;
            if (a * b > limits.max)
                return limits.max;
            return a * b;
        };
        exports.gatedMultiply = gatedMultiply;
        /**
         * Returns indices of an array that match a particular value
         * @param x An array
         * @param value A value to be matched
         * @returns An array of indices
         */
        const which = (x, value) => {
            return x.map((e, i) => (e === value ? i : NaN)).filter((e) => !isNaN(e));
        };
        exports.which = which;
        const match = (x, values) => {
            return x.map((e) => values.indexOf(e));
        };
        exports.match = match;
        /**
         * Returns a unique value or array of values in an array
         * @param x An array
         * @returns A value (if all values in `x` are the same) or an array of values
         */
        const unique = (x, flatten = true) => {
            const u = Array.from(new Set(x));
            if (flatten && u.length === 1)
                return u[0];
            return u;
        };
        exports.unique = unique;
        const tabulate = (arr) => {
            const u = unique(arr, false);
            let [i, n] = [arr.length, new Uint16Array(u.length)];
            while (i--)
                n[u.findIndex((e) => e == arr[i])]++;
            return [u, n];
        };
        exports.tabulate = tabulate;
        const tabulateAndStringify = (arr) => {
            const [u, n] = tabulate(arr);
            let [i, str] = [u.length, ""];
            while (i--)
                str += `,${u[i]}:${n[i]}`;
            return str;
        };
        exports.tabulateAndStringify = tabulateAndStringify;
        const accessDeep = (obj, ...props) => {
            return props.reduce((a, b) => a && a[b], obj);
        };
        exports.accessDeep = accessDeep;
        const accessUnpeel = (obj, ...props) => {
            var _a;
            const destination = props.pop();
            let result;
            for (let i = props.length; i >= 0; i--) {
                result = (_a = accessDeep(obj, ...props, destination)) !== null && _a !== void 0 ? _a : null;
                if (result)
                    break;
                props.pop();
            }
            return result;
        };
        exports.accessUnpeel = accessUnpeel;
        const accessIndexed = (obj, index) => {
            const res = deeplyClone(obj); // Deeply-clone the object
            Object.keys(obj).forEach((e) => (res[e] = obj[e][index]));
            return res;
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
        const createStripePattern = (colour, size) => {
            const canv = document.createElement("canvas");
            canv.width = size;
            canv.height = size;
            const ctx = canv.getContext("2d");
            ctx.fillStyle = colour;
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(0, size / 4);
            ctx.lineTo(size / 4, 0);
            ctx.lineTo(0, 0);
            ctx.closePath();
            ctx.fill();
            ctx.beginPath();
            ctx.moveTo(0, size);
            ctx.lineTo(size / 4, size);
            ctx.lineTo(size, size / 4);
            ctx.lineTo(size, 0);
            ctx.lineTo((3 * size) / 4, 0);
            ctx.lineTo(0, (3 * size) / 4);
            ctx.closePath();
            ctx.fill();
            ctx.beginPath();
            ctx.moveTo(size, size);
            ctx.lineTo(size, (3 * size) / 4);
            ctx.lineTo((3 * size) / 4, size);
            ctx.lineTo(size, size);
            ctx.closePath();
            ctx.fill();
            return ctx.createPattern(canv, "repeat");
        };
        exports.createStripePattern = createStripePattern;
        // Function to construct "pretty" breaks, inspired by R's pretty()
        const prettyBreaks = (x, n = 4) => {
            const [minimum, maximum] = [min(x), max(x)];
            const range = maximum - minimum;
            const unitGross = range / n;
            const base = Math.floor(Math.log10(unitGross));
            const neatValues = [1, 2, 4, 5, 10];
            const dists = neatValues.map((e) => Math.pow((e - unitGross / Math.pow(10, base)), 2));
            const unitNeat = Math.pow(10, base) * neatValues[dists.indexOf(min(dists))];
            const big = Math.abs(base) >= 3;
            const minimumNeat = Math.ceil(minimum / unitNeat) * unitNeat;
            const maximumNeat = Math.floor(maximum / unitNeat) * unitNeat;
            const middle = Array.from(Array(Math.round((maximumNeat - minimumNeat) / unitNeat - 1)), (_, i) => minimumNeat + (i + 1) * unitNeat);
            const breaks = [minimumNeat, ...middle, maximumNeat].map((e) => parseFloat(e.toFixed(4)));
            return big ? breaks.map((e) => e.toExponential()) : breaks;
        };
        exports.prettyBreaks = prettyBreaks;
        // Finds the nearest pretty number for each
        const toPretty = (x, n = 4) => {
            const breaks = prettyBreaks(x, n);
            let [i, res] = [x.length, Array(x.length)];
            while (i--) {
                const x2 = breaks.map((e) => Math.pow((e - x[i]), 2));
                res[i] = breaks[x2.indexOf(min(x2))];
            }
            return res;
        };
        exports.toPretty = toPretty;
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
            return !(max(p1x) < min(p2x) ||
                min(p1x) > max(p2x) ||
                max(p1y) < min(p2y) ||
                min(p1y) > max(p2y));
        };
        exports.rectOverlap = rectOverlap;
        const timeExecution = (fun) => {
            const start = performance.now();
            fun();
            const end = performance.now();
            return end - start;
        };
        exports.timeExecution = timeExecution;
    });
    define("handlers/Handler", ["require", "exports", "functions"], function (require, exports, funs) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.Handler = void 0;
        class Handler {
            constructor() {
                this.registerEvents = (element) => {
                    this.events.forEach((action, i) => {
                        element.addEventListener(action, (event) => funs.throttle(this[this.consequences[i]](event), 100));
                    });
                };
                this.subscribe = (sub) => {
                    const ownProperties = Object.keys(this);
                    Object.keys(sub).forEach((e) => {
                        if (typeof sub[e] === "function" && ownProperties.includes(e)) {
                            if (!this.callbacks.has(e))
                                this.callbacks.set(e, []);
                            this.callbacks.set(e, [...this.callbacks.get(e), sub[e]]);
                        }
                    });
                };
                this.publish = (name, ...args) => {
                    var _a;
                    (_a = this.callbacks.get(name)) === null || _a === void 0 ? void 0 : _a.forEach((e) => e(...args));
                };
                this.callbacks = new Map();
            }
        }
        exports.Handler = Handler;
    });
    define("handlers/MarkerHandler", ["require", "exports", "handlers/Handler"], function (require, exports, Handler_js_1) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.MarkerHandler = void 0;
        class MarkerHandler extends Handler_js_1.Handler {
            constructor(n) {
                super();
                this.isOfMembership = (index, membership) => {
                    if (membership === 1)
                        return true;
                    const { current: curr, past } = this;
                    if (membership === 128 && curr[index] > 1)
                        return !!(curr[index] & 128);
                    if (membership === 128)
                        return !!(past[index] & 128);
                    if (curr[index] > 1)
                        return curr[index] >= membership;
                    return past[index] >= membership;
                };
                this.updateCurrent = (at, membership) => {
                    if (membership < 128 && at.length)
                        this.anyPersistent = true;
                    this.clearCurrent(true);
                    this.current.update(at, membership);
                    this.publish("updateCurrent");
                };
                this.mergeCurrent = (keepTransient = false) => {
                    if (!keepTransient)
                        this.current.discardTransient();
                    this.past.merge(this.current);
                };
                this.clearCurrent = (keepTransient = false) => {
                    if (!keepTransient)
                        this.past.discardTransient();
                    this.current = new MembershipArray(this.past);
                    this.publish("clearAll");
                };
                this.clearAll = () => {
                    this.anyPersistent = false;
                    this.current.clear();
                    this.past.clear();
                };
                this.n = n;
                this.current = new MembershipArray(n);
                this.past = new MembershipArray(n);
                this.anyPersistent = false;
            }
        }
        exports.MarkerHandler = MarkerHandler;
        class MembershipArray extends Uint8Array {
            constructor(arg) {
                const buffer = typeof arg === "number" ? new ArrayBuffer(arg) : arg;
                super(buffer);
                this.clear = () => this.fill(1);
                this.discardTransient = () => {
                    let i = this.length;
                    while (i--)
                        this[i] = this[i] & ~128;
                };
                this.merge = (arr) => {
                    let i = this.length;
                    while (i--) {
                        if (arr[i] === 1)
                            continue;
                        this[i] = arr[i];
                    }
                };
                this.update = (at, membership) => {
                    let i = at.length;
                    if (membership === 128) {
                        while (i--)
                            this[at[i]] = this[at[i]] | 128;
                        return;
                    }
                    while (i--)
                        this[at[i]] = membership;
                };
                if (typeof arg === "number")
                    this.fill(1);
            }
        }
    });
    define("handlers/KeypressHandler", ["require", "exports", "handlers/Handler"], function (require, exports, Handler_js_2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.KeypressHandler = void 0;
        class KeypressHandler extends Handler_js_2.Handler {
            constructor() {
                super();
                this.keyPressed = (event) => {
                    if (this.pressing && !this.isRedrawKey)
                        return;
                    this.pressing = true;
                    if (this.validKeys.includes(event.code)) {
                        event.preventDefault();
                        this.lastPressed = event.code;
                        this.currentlyPressed[this.validKeys.indexOf(event.code)] = true;
                        this.publish("keyPressed", event.code);
                    }
                };
                this.keyReleased = (event) => {
                    this.pressing = false;
                    if (this.validKeys.includes(event.code)) {
                        this.currentlyPressed[this.validKeys.indexOf(event.code)] = false;
                        this.publish("keyReleased", event.code);
                    }
                };
                this.isPressed = (key) => {
                    return this.currentlyPressed.filter((_, i) => this.validKeys[i] === key)[0];
                };
                this.validKeys = [
                    "Equal",
                    "Minus",
                    "BracketLeft",
                    "BracketRight",
                    "ControlLeft",
                    "ShiftLeft",
                    "KeyR",
                    "Digit1",
                    "Digit2",
                    "Digit3",
                ];
                this.redrawKeys = ["Equal", "Minus", "BracketLeft", "BracketRight", "KeyR"];
                this.pressing = false;
                this.lastPressed = "";
                this.currentlyPressed = Array(this.validKeys.length).fill(false);
                this.events = ["keydown", "keyup"];
                this.consequences = ["keyPressed", "keyReleased"];
                this.registerEvents(document.body);
            }
            get isRedrawKey() {
                return this.redrawKeys.includes(this.lastPressed);
            }
            get currentlyPressedKeys() {
                return this.validKeys.filter((_, i) => this.currentlyPressed[i]);
            }
        }
        exports.KeypressHandler = KeypressHandler;
    });
    define("handlers/StateHandler", ["require", "exports", "handlers/Handler"], function (require, exports, Handler_js_3) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.StateHandler = void 0;
        class StateHandler extends Handler_js_3.Handler {
            constructor() {
                super();
                this.updateBools = (index, value) => {
                    const { states, keyStateValues } = this;
                    const stateIndex = states.findIndex((e) => keyStateValues[index] === e);
                    this.stateBool[stateIndex] = value;
                    this.membershipBool[index] = value;
                };
                this.keyPressed = (key) => {
                    if (this.keys.includes(key)) {
                        const index = this.keys.findIndex((e) => e === key);
                        this.updateBools(index, true);
                    }
                };
                this.keyReleased = (key) => {
                    if (this.keys.includes(key)) {
                        const index = this.keys.findIndex((e) => e === key);
                        this.updateBools(index, false);
                    }
                };
                this.activate = (id) => {
                    this.plotsActive[this.plotIds.indexOf(id)] = true;
                    this.containerDivs[this.plotIds.indexOf(id)].classList.add("active");
                };
                this.activateAll = () => {
                    this.plotsActive.fill(true);
                    this.containerDivs.forEach((e) => e.classList.add("active"));
                };
                this.deactivateAll = () => {
                    this.plotsActive.fill(false);
                    this.containerDivs.forEach((e) => e.classList.remove("active"));
                };
                this.isActive = (id) => {
                    return this.plotsActive[this.plotIds.indexOf(id)];
                };
                this.plotIds = [];
                this.plotsActive = [];
                this.containerDivs = [];
                this.states = ["not", "or"];
                this.keys = ["ControlLeft", "ShiftLeft", "Digit1", "Digit2", "Digit3"];
                this.keyStateValues = ["not", "or", "or", "or", "or"];
                this.keyMembershipValues = [1, 128, 2, 3, 4];
                this.stateBool = Array(this.states.length).fill(false);
                this.membershipBool = Array(this.keyMembershipValues.length).fill(false);
            }
            get none() {
                return !this.stateBool.some((e) => e);
            }
            get or() {
                return [1, 2, 3, 4].some((e) => this.stateBool[e]);
            }
            get membershipId() {
                let [id, i] = [-1, this.membershipBool.length];
                while (i--) {
                    if (this.membershipBool[i]) {
                        id = i;
                        break;
                    }
                }
                return id;
            }
            get membership() {
                var _a;
                return (_a = this.keyMembershipValues[this.membershipId]) !== null && _a !== void 0 ? _a : 128;
            }
        }
        exports.StateHandler = StateHandler;
    });
    define("handlers/DragHandler", ["require", "exports", "handlers/Handler"], function (require, exports, Handler_js_4) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.DragHandler = void 0;
        class DragHandler extends Handler_js_4.Handler {
            constructor(container) {
                super();
                this.startDrag = (event) => {
                    this.dragging = true;
                    this.start = [event.offsetX, event.offsetY];
                    this.publish("startDrag");
                };
                this.whileDrag = (event) => {
                    const { dragging, start, end } = this;
                    if (dragging) {
                        this.end = [event.offsetX, event.offsetY];
                        const dist = Math.pow((start[0] - end[0]), 2) + Math.pow((start[1] - end[1]), 2);
                        if (dist > 50)
                            this.publish("whileDrag");
                    }
                };
                this.endDrag = () => {
                    this.dragging = false;
                    this.publish("endDrag");
                };
                this.container = container;
                this.dragging = false;
                this.start = [null, null];
                this.end = [null, null];
                this.events = ["mousedown", "mousemove", "mouseup"];
                this.consequences = ["startDrag", "whileDrag", "endDrag"];
                this.registerEvents(this.container);
            }
        }
        exports.DragHandler = DragHandler;
    });
    define("handlers/ClickHandler", ["require", "exports", "handlers/Handler"], function (require, exports, Handler_js_5) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.ClickHandler = void 0;
        class ClickHandler extends Handler_js_5.Handler {
            constructor(container) {
                super();
                this.mouseDown = (event) => {
                    this.holding = true;
                    this.button = event.button;
                    this.positionCurrent = [event.offsetX, event.offsetY];
                    this.positionLast = [event.offsetX, event.offsetY];
                    this.publish("mouseDown");
                };
                this.mouseUp = (event) => {
                    this.holding = false;
                    this.button = -1;
                    this.positionCurrent = [null, null];
                    this.publish("mouseUp");
                };
                this.container = container;
                this.button = -1;
                this.holding = false;
                this.positionCurrent = [null, null];
                this.positionLast = [null, null];
                this.events = ["mousedown", "mouseup"];
                this.consequences = ["mouseDown", "mouseUp"];
                this.registerEvents(this.container);
            }
        }
        exports.ClickHandler = ClickHandler;
    });
    define("globalparameters", ["require", "exports"], function (require, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.globalParameters = void 0;
        exports.globalParameters = {
            scene: {
                backgroundColour: `#deded9`,
            },
            plot: {
                scaleExpandFactor: 0.1,
                backgroundColour: `#F7F7F2`,
                marginColour: `#F7F7F2`,
            },
            reps: {
                colour: [`#cccccc`, `#7fc97f`, `#fdc086`, `#beaed4`, `#386cb0`],
                strokeColour: [null, `#7fc97f`, `#fdc086`, `#beaed4`, `#386cb0`],
                strokeWidth: [null, null, null, null, 1],
                radius: [1, 1, 1, 1, 1],
                alpha: [1, 1, 1, 1, 1],
            },
        };
    });
    define("sparsearrays", ["require", "exports"], function (require, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.SparseUint16Array = exports.SparseFloat32Array = exports.SparseArray = exports.isArrayLike = void 0;
        const isArrayLike = (arg) => {
            return Array.isArray(arg) || ArrayBuffer.isView(arg);
        };
        exports.isArrayLike = isArrayLike;
        class SparseArray extends Array {
            constructor(arg) {
                if (isArrayLike(arg)) {
                    super(arg.length);
                    let i = arg.length;
                    while (i--)
                        this[i] = arg[i];
                    this.empty = new Uint8Array(arg.length);
                    return this;
                }
                super(arg);
                this.empty = new Uint8Array(arg);
            }
        }
        exports.SparseArray = SparseArray;
        class SparseFloat32Array extends Float32Array {
            constructor(arg) {
                if (isArrayLike(arg)) {
                    super(arg);
                    this.empty = new Uint8Array(arg.length);
                    if ("empty" in arg)
                        this.empty.set(arg.empty);
                    return this;
                }
                super(arg);
                this.empty = new Uint8Array(arg);
            }
        }
        exports.SparseFloat32Array = SparseFloat32Array;
        class SparseUint16Array extends Uint16Array {
            constructor(arg) {
                if (isArrayLike(arg)) {
                    super(arg);
                    this.empty = new Uint8Array(arg.length);
                    if ("empty" in arg)
                        this.empty.set(arg.empty);
                    return this;
                }
                super(arg);
                this.empty = new Uint8Array(arg);
            }
        }
        exports.SparseUint16Array = SparseUint16Array;
    });
    define("plot/GraphicLayer", ["require", "exports", "globalparameters"], function (require, exports, globalparameters_js_1) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.GraphicLayer = void 0;
        class GraphicLayer {
            constructor(containerDiv) {
                this.resize = () => {
                    this.canvas.style.width = `${this.width}px`;
                    this.canvas.style.height = `${this.height}px`;
                    this.canvas.width = Math.ceil(this.width * this.scaleFactor);
                    this.canvas.height = Math.ceil(this.height * this.scaleFactor);
                    this.context.scale(this.scaleFactor, this.scaleFactor);
                };
                this.toAlpha = (col, alpha) => {
                    if (alpha === 1)
                        return col;
                    let alpha16 = Math.floor(alpha * 255)
                        .toString(16)
                        .toUpperCase();
                    if (alpha16.length < 2)
                        alpha16 = "0" + alpha16;
                    return col + alpha16;
                };
                this.drawClear = () => {
                    const context = this.context;
                    context.save();
                    context.clearRect(0, 0, this.width, this.height);
                    context.restore();
                };
                this.drawBackground = () => {
                    const context = this.context;
                    context.save();
                    context.fillStyle = globalparameters_js_1.globalParameters.plot.backgroundColour;
                    context.fillRect(0, 0, this.width, this.height);
                    context.restore();
                };
                this.drawBarsV = (x, y0, y1, width, pars = this.defaultPars) => {
                    const { colour, strokeColour, strokeWidth, alpha } = pars;
                    const [context, w] = [this.context, width];
                    context.save();
                    context.fillStyle = this.toAlpha(colour, alpha);
                    context.strokeStyle = strokeColour;
                    context.lineWidth = strokeWidth;
                    let i = x.length;
                    while (i--) {
                        if (x.empty[i] || y0.empty[i] || y1.empty[i] || width.empty[i])
                            continue;
                        if (colour)
                            context.fillRect(x[i] - w[i] / 2, y1[i], w[i], y0[i] - y1[i]);
                        if (strokeColour)
                            context.strokeRect(x[i] - w[i] / 2, y1[i], w[i], y0[i] - y1[i]);
                    }
                    context.restore();
                };
                this.drawPoints = (x, y, radius, pars = this.defaultPars, empty) => {
                    const context = this.context;
                    const { colour, strokeColour, strokeWidth, alpha } = pars;
                    context.save();
                    context.fillStyle = this.toAlpha(colour, alpha);
                    context.strokeStyle = strokeColour;
                    context.lineWidth = strokeWidth;
                    let i = x.length;
                    while (i--) {
                        if (x.empty[i] || y.empty[i] || radius.empty[i])
                            continue;
                        context.beginPath();
                        context.arc(x[i], y[i], radius[i], 0, Math.PI * 2);
                        if (strokeColour)
                            context.stroke();
                        if (colour)
                            context.fill();
                    }
                    context.restore();
                };
                this.drawRectsHW = (x, y, h, w, pars = this.defaultPars) => {
                    const context = this.context;
                    const { colour, strokeColour, strokeWidth, alpha } = pars;
                    context.save();
                    context.fillStyle = this.toAlpha(colour, alpha);
                    context.strokeStyle = strokeColour;
                    context.lineWidth = strokeWidth;
                    let i = x.length;
                    while (i--) {
                        // if (empty[i]) continue;
                        if (colour)
                            context.fillRect(x[i] - w[i] / 2, y[i] - h[i] / 2, h[i], w[i]);
                        if (strokeColour)
                            context.strokeRect(x[i] - w[i] / 2, y[i] - h[i] / 2, h[i], w[i]);
                    }
                    context.restore();
                };
                this.drawRectsAB = (x0, y0, x1, y1, pars = this.defaultPars) => {
                    const context = this.context;
                    const { colour, strokeColour, strokeWidth, alpha } = pars;
                    let i = x0.length;
                    context.save();
                    context.fillStyle = this.toAlpha(colour, alpha);
                    context.strokeStyle = strokeColour;
                    context.lineWidth = strokeWidth;
                    while (i--) {
                        const ws = x1[i] - x0[i];
                        const hs = y0[i] - y1[i];
                        context.fillRect(x0[i], y0[i], ws, -hs);
                    }
                    context.restore();
                };
                this.drawLine = (x, y, col = "black") => {
                    const context = this.context;
                    context.save();
                    context.beginPath();
                    context.strokeStyle = col;
                    context.moveTo(x[0], y[0]);
                    x.shift();
                    y.shift();
                    let i = x.length;
                    while (i--) {
                        context.lineTo(x[i], y[i]);
                    }
                    context.stroke();
                    context.restore();
                };
                this.drawText = (x, y, labels, size = 20, rotate) => {
                    const context = this.context;
                    context.save();
                    context.font = `${size}px Times New Roman`;
                    let i = x.length;
                    while (i--) {
                        context.translate(x[i], y[i]);
                        if (rotate)
                            context.rotate((rotate / 360) * Math.PI * 2);
                        context.fillText(labels[i], 0, 0);
                        context.translate(-x[i], -y[i]);
                    }
                    context.restore();
                };
                this.drawDim = (col = "rgba(120, 120, 120, 0.05)") => {
                    const context = this.context;
                    context.fillStyle = col;
                    context.fillRect(0, 0, this.width, this.height);
                };
                this.drawWindow = (start, end, stroke = "rgba(0, 0, 0, 0.25)") => {
                    const context = this.context;
                    context.save();
                    context.strokeStyle = stroke;
                    context.setLineDash([5, 5]);
                    context.clearRect(start[0], start[1], end[0] - start[0], end[1] - start[1]);
                    context.restore();
                };
                this.containerDiv = containerDiv;
                this.canvas = document.createElement("canvas");
                this.context = this.canvas.getContext("2d");
                this.defaultPars = {
                    colour: `#000000`,
                    strokeColour: null,
                    strokeWidth: null,
                    alpha: 1,
                    radius: 1,
                };
                this.resize();
            }
            get width() {
                return parseInt(getComputedStyle(this.containerDiv).width, 10);
            }
            get height() {
                return parseInt(getComputedStyle(this.containerDiv).height, 10);
            }
            get scaleFactor() {
                return 3;
            }
        }
        exports.GraphicLayer = GraphicLayer;
    });
    define("wrangler/Cast", ["require", "exports", "functions", "sparsearrays"], function (require, exports, funs, sprs) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.Cast = void 0;
        class Cast {
            constructor(wrangler, mapping) {
                this.extract = (membership) => {
                    const { marker, indices, nObjects, withinFun } = this;
                    // this.emptyObjects.fill(0);
                    // this.processedData.fill(0);
                    this.processedData.fill(null);
                    this.processedData2.empty.fill(0);
                    let i = nObjects;
                    if (this.allUnique) {
                        if (!membership) {
                            while (i--)
                                this.processedData2[i] = this.transformedData[i];
                            return this.processedData2;
                        }
                        while (i--) {
                            if (!marker.isOfMembership(i, membership)) {
                                this.processedData2.empty[i] = 1;
                                continue;
                            }
                            this.processedData2[i] = this.transformedData[i];
                        }
                        return this.processedData2;
                    }
                    let [j, subArrs] = [indices.length, Array.from(Array(nObjects), (e) => [])];
                    while (j--) {
                        if (!membership || marker.isOfMembership(j, membership)) {
                            subArrs[this.indices[j]].push(this.transformedData[j]);
                        }
                    }
                    while (i--) {
                        if (subArrs[i].length) {
                            this.processedData2[i] = withinFun(subArrs[i]);
                            continue;
                        }
                        this.processedData2.empty[i] = 1;
                    }
                    return this.processedData2;
                };
                this.registerAcross = (fun) => {
                    if (!fun)
                        return;
                    this.acrossFun = fun;
                    return this;
                };
                this.registerWithin = (fun) => {
                    if (!fun)
                        return;
                    this.withinFun = fun;
                    return this;
                };
                this.data = wrangler.getVariable(mapping);
                this.marker = wrangler.marker;
                this.indices = wrangler.indices;
                this.allUnique = wrangler.allUnique;
                this.nObjects = wrangler.nObjects;
                this.emptyObjects = wrangler.emptyObjects;
                this.processedData = Array(this.nObjects);
                this.processedData2 = new sprs.SparseArray(this.nObjects);
                this.acrossFun = funs.identity;
                this.withinFun = funs.identity;
            }
            get transformedData() {
                if (!this._transformedData) {
                    this._transformedData = this.acrossFun(this.data);
                }
                return this._transformedData;
            }
        }
        exports.Cast = Cast;
    });
    define("wrangler/Wrangler", ["require", "exports", "functions", "wrangler/Cast"], function (require, exports, funs, Cast_js_1) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.Wrangler = void 0;
        class Wrangler {
            constructor(data, mapping, marker) {
                this.getVariable = (mapping) => {
                    return this.data[this.mapping.get(mapping)];
                };
                this.extractAsIs = (...mappings) => {
                    this.allUnique = true;
                    this.indices = new Uint32Array(Array.from(Array(this.marker.n).keys()));
                    this.nObjects = this.indices.length;
                    this.emptyObjects = new Uint8Array(this.nObjects);
                    mappings.forEach((mapping) => {
                        this[mapping] = new Cast_js_1.Cast(this, mapping);
                    });
                    return this;
                };
                this.splitBy = (...mappings) => {
                    mappings.forEach((mapping, i) => this.by.add(mapping));
                    return this;
                };
                this.splitWhat = (...mappings) => {
                    mappings.forEach((mapping) => this.what.add(mapping));
                    return this;
                };
                this.doAcross = (target, fun, ...args) => {
                    const funWithArgs = (x) => fun(x, ...args);
                    this.acrossFuns.set(target, funWithArgs);
                    return this;
                };
                this.doWithin = (target, fun, ...args) => {
                    const funWithArgs = (x) => fun(x, ...args);
                    this.withinFuns.set(target, funWithArgs);
                    return this;
                };
                this.assignIndices = () => {
                    const { what, by, acrossFuns, withinFuns, acrossArgs, withinArgs } = this;
                    const splittingVars = Array.from(by).map((e) => {
                        if (acrossFuns.get("by")) {
                            return acrossFuns.get("by")(this.getVariable(e));
                        }
                        return this.getVariable(e);
                    });
                    const indices = funs.uniqueRowIds(splittingVars);
                    const nObjects = Array.from(new Set(indices)).length;
                    this.indices = new Uint32Array(indices);
                    this.nObjects = nObjects;
                    this.emptyObjects = new Uint8Array(this.nObjects);
                    [...what].forEach((e) => {
                        this[e] = new Cast_js_1.Cast(this, e);
                        this[e].registerAcross(acrossFuns.get("what"));
                        this[e].registerWithin(withinFuns.get("what"));
                    });
                    [...by].forEach((e) => {
                        this[e] = new Cast_js_1.Cast(this, e);
                        this[e].registerAcross(acrossFuns.get("by"));
                        this[e].registerWithin(withinFuns.get("by"));
                    });
                    return this;
                };
                this.n = data[Object.keys(data)[0]].length;
                this.allUnique = false;
                this.data = data;
                this.mapping = mapping;
                this.marker = marker;
                this.by = new Set();
                this.what = new Set();
                this.acrossFuns = new Map();
                this.withinFuns = new Map();
            }
        }
        exports.Wrangler = Wrangler;
    });
    define("representations/Representation", ["require", "exports", "datastructures", "functions", "globalparameters"], function (require, exports, dtstr, funs, globalparameters_js_2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.Representation = void 0;
        class Representation {
            constructor(wrangler) {
                this.getMapping = (mapping, membership) => {
                    var _a;
                    const { wrangler, scales } = this;
                    const res = (_a = wrangler[mapping]) === null || _a === void 0 ? void 0 : _a.extract(membership, wrangler.emptyObjects);
                    if (!res)
                        return [];
                    const coords = scales[mapping].dataToPlot(res, wrangler.emptyObjects);
                    return coords;
                };
                this.getPars = (membership) => {
                    if (membership === 128 && this.wrangler.marker.anyPersistent) {
                        let pars = this.pars[this.pars.length - 1];
                        pars = Object.assign(Object.assign({}, pars), { colour: `${pars.colour}66` });
                        return pars;
                    }
                    if (membership === 128)
                        return this.pars[this.pars.length - 1];
                    return this.pars[(membership & ~128) - 1];
                };
                this.drawBase = (context) => { };
                this.drawHighlight = (context) => { };
                this.registerScales = (scales) => {
                    this.scales = scales;
                    return this;
                };
                this.defaultize = () => {
                    this.alphaMultiplier = 1;
                    this.sizeMultiplier = 1;
                };
                this.inSelection = (selectionRect) => {
                    const { wrangler, boundingRects, selectedCases } = this;
                    let [i, k] = [boundingRects.length, wrangler.n];
                    while (i--) {
                        // If the ith representation is selected...
                        if (funs.rectOverlap(selectionRect, boundingRects[i])) {
                            // ...append all case indices that correspond to it
                            // to the list of the selected cases, starting from the end
                            let j = wrangler.n;
                            while (j--) {
                                if (wrangler.indices[j] === i)
                                    selectedCases[--k] = j;
                            }
                        }
                    }
                    // Return only the selected indices
                    return selectedCases.slice(k, wrangler.n);
                };
                this.atClick = (clickPoint) => {
                    const { wrangler, selectedCases, boundingRects } = this;
                    let [i, k] = [boundingRects.length, wrangler.n];
                    while (i--) {
                        // If the ith representation is clicked...
                        if (funs.pointInRect(clickPoint, boundingRects[i])) {
                            // ...add all case indices that correspond to it
                            // to the list of selected cases, starting from the end
                            let j = wrangler.n;
                            while (j--) {
                                if (wrangler.indices[j] === i)
                                    selectedCases[--k] = j;
                            }
                        }
                    }
                    // Return only the selected indices
                    return selectedCases.slice(k, wrangler.n);
                };
                // Handle generic keypress actions
                this.keyPressed = (key) => {
                    const { sizeMultiplier, sizeLimits, alphaMultiplier, alphaLimits } = this;
                    if (key === "KeyR")
                        this.defaultize();
                    if (key === "Minus" && sizeMultiplier) {
                        this.sizeMultiplier = funs.gatedMultiply(sizeMultiplier, 0.8, sizeLimits);
                    }
                    if (key === "Equal" && sizeMultiplier && sizeMultiplier < sizeLimits.max) {
                        this.sizeMultiplier = funs.gatedMultiply(sizeMultiplier, 1.2, sizeLimits);
                    }
                    if (key === "BracketLeft" && alphaMultiplier) {
                        this.alphaMultiplier = funs.gatedMultiply(alphaMultiplier, 0.8, alphaLimits);
                    }
                    if (key === "BracketRight" && alphaMultiplier)
                        this.alphaMultiplier = funs.gatedMultiply(alphaMultiplier, 1.2, alphaLimits);
                };
                this.wrangler = wrangler;
                this.selectedCases = new Array(wrangler.n);
                const p = globalparameters_js_2.globalParameters.reps;
                this.pars = dtstr.validMembershipArray.map((e) => {
                    if (e === 128)
                        return funs.accessIndexed(p, p.colour.length - 1);
                    return funs.accessIndexed(p, (e & ~128) - 1);
                });
                this.sizeMultiplier = 1;
                this.alphaMultiplier = 1;
                this.sizeLimits = { min: 0.2, max: 5 };
                this.alphaLimits = { min: 0.01, max: 1 };
            }
            get boundingRects() {
                return [];
            }
        }
        exports.Representation = Representation;
    });
    define("representations/Bars", ["require", "exports", "datastructures", "sparsearrays", "representations/Representation"], function (require, exports, dtstr, sprs, Representation_js_1) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.Bars = void 0;
        class Bars extends Representation_js_1.Representation {
            constructor(wrangler, widthMultiplier) {
                super(wrangler);
                this.defaultize = () => {
                    this.sizeMultiplier = this.widthMultiplier;
                    this.alphaMultiplier = 1;
                };
                this.getMappings = (membership) => {
                    const mappings = ["x", "y"];
                    const res = mappings.map((e) => this.getMapping(e, membership));
                    return [...res, this.wrangler.emptyObjects];
                };
                this.drawBase = (context) => {
                    const { y0Default, widthDefault, alphaMultiplier } = this;
                    const [x, y] = this.getMappings(1);
                    const y0 = new sprs.SparseUint16Array(x.length).fill(y0Default);
                    const width = new sprs.SparseUint16Array(x.length).fill(widthDefault);
                    const pars = Object.assign(Object.assign({}, this.getPars(1)), { alpha: alphaMultiplier });
                    context.drawBarsV(x, y0, y, width, pars);
                };
                this.drawHighlight = (context) => {
                    dtstr.highlightMembershipArray.forEach((e) => {
                        const { y0Default, widthDefault } = this;
                        const [x, y] = this.getMappings(e);
                        if (!(x.length > 0))
                            return;
                        const y0 = new sprs.SparseUint16Array(x.length).fill(y0Default);
                        const width = new sprs.SparseUint16Array(x.length).fill(widthDefault);
                        const pars = Object.assign(Object.assign({}, this.getPars(e)), { alpha: 1 });
                        context.drawBarsV(x, y0, y, width, pars);
                    });
                };
                this.widthMultiplier = widthMultiplier;
                this.sizeMultiplier = widthMultiplier;
                this.sizeLimits = { min: 0.01, max: 1 };
            }
            get y0Default() {
                return this.scales.y.plotMin;
            }
            get widthDefault() {
                if (!this.scales.x.continuous) {
                    return this.scales.x.breakWidth * this.sizeMultiplier;
                }
                const x = this.getMapping("x").sort((a, b) => a - b);
                return Math.floor(this.sizeMultiplier * (x[1] - x[0]));
            }
            get boundingRects() {
                const [x, y] = this.getMappings(1);
                const [wd, y0d] = [this.widthDefault / 2, this.y0Default];
                let [i, res] = [x.length, Array(x.length)];
                while (i--) {
                    res[i] = [
                        [x[i] - wd, y0d],
                        [x[i] + wd, y[i]],
                    ];
                }
                return res;
            }
        }
        exports.Bars = Bars;
    });
    define("representations/Points", ["require", "exports", "datastructures", "sparsearrays", "representations/Representation"], function (require, exports, dtstr, sprs, Representation_js_2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.Points = void 0;
        class Points extends Representation_js_2.Representation {
            constructor(wrangler) {
                super(wrangler);
                this.getMappings = (membership) => {
                    const { getMapping, getPars, defaultRadius, sizeMultiplier } = this;
                    const mappings = ["x", "y", "size"];
                    let [x, y, size] = mappings.map((e) => getMapping(e, membership));
                    const radius = getPars(membership).radius;
                    if (!this.hasSize) {
                        size = new sprs.SparseUint16Array(x.length).fill(radius * defaultRadius * sizeMultiplier);
                        return [x, y, size];
                    }
                    size = size.map((e) => e * radius * defaultRadius * sizeMultiplier);
                    return [x, y, size];
                };
                this.drawBase = (context) => {
                    const [x, y, size] = this.getMappings(1);
                    const pars = Object.assign(Object.assign({}, this.getPars(1)), { alpha: this.alphaMultiplier });
                    context.drawPoints(x, y, size, pars, this.wrangler.emptyObjects);
                };
                this.drawHighlight = (context) => {
                    dtstr.highlightMembershipArray.forEach((e) => {
                        const [x, y, size] = this.getMappings(e);
                        if (!(x.length > 0))
                            return;
                        const pars = Object.assign(Object.assign({}, this.getPars(e)), { alpha: 1 });
                        context.drawPoints(x, y, size, pars, this.wrangler.emptyObjects);
                    });
                };
                this.hasSize = !!wrangler.mapping.get("size");
            }
            get defaultRadius() {
                const { x, y } = this.scales;
                if (!x.continuous && !y.continuous) {
                    return Math.min(x.breakWidth, y.breakWidth) / Math.sqrt(Math.PI);
                }
                const length = Math.min(...[x, y].map((e) => Math.abs(e.plotRange)));
                const c = 10 * Math.log(this.wrangler.n);
                return length / c;
            }
            get boundingRects() {
                const [x, y, size] = this.getMappings(1);
                const c = 1 / Math.sqrt(2);
                let [i, res] = [x.length, Array(x.length)];
                while (i--) {
                    res[i] = [
                        [x[i] - c * size[i], y[i] - c * size[i]],
                        [x[i] + c * size[i], y[i] + c * size[i]],
                    ];
                }
                return res;
            }
        }
        exports.Points = Points;
    });
    define("representations/Squares", ["require", "exports", "datastructures", "sparsearrays", "representations/Representation"], function (require, exports, dtstr, sprs, Representation_js_3) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.Squares = void 0;
        class Squares extends Representation_js_3.Representation {
            constructor(wrangler) {
                super(wrangler);
                this.getMappings = (membership) => {
                    const { getMapping, defaultSize, sizeMultiplier } = this;
                    const mappings = ["x", "y", "size", "fillHeight"];
                    let [x, y, size, fillHeight] = mappings.map((e) => getMapping(e, membership));
                    if (!size.length) {
                        size = new sprs.SparseUint16Array(x.length).fill(defaultSize * sizeMultiplier);
                        return [x, y, size, fillHeight];
                    }
                    let i = size.length;
                    while (i--) {
                        size[i] *= defaultSize * sizeMultiplier;
                        fillHeight[i] *= defaultSize * sizeMultiplier;
                    }
                    return [x, y, size, fillHeight];
                };
                this.drawBase = (context) => {
                    let [x, y, size] = this.getMappings(1);
                    if (!x)
                        return;
                    const pars = Object.assign(Object.assign({}, this.getPars(1)), { alpha: this.alphaMultiplier });
                    let i = x.length;
                    const y0 = new sprs.SparseUint16Array(x.length);
                    const y1 = new sprs.SparseUint16Array(x.length);
                    while (i--) {
                        y0[i] = y[i] + size[i] / 2;
                        y1[i] = y[i] - size[i] / 2;
                    }
                    context.drawBarsV(x, y0, y1, size, pars);
                };
                this.drawHighlight = (context) => {
                    dtstr.highlightMembershipArray.forEach((e) => {
                        const [x, y, size, fillHeight] = this.getMappings(e);
                        const [, , sizeBase, fillHeightBase] = this.getMappings(1);
                        if (!x)
                            return;
                        const pars = Object.assign(Object.assign({}, this.getPars(e)), { alpha: 1 });
                        let i = x.length;
                        const y0 = new sprs.SparseUint16Array(x.length);
                        const y1 = new sprs.SparseUint16Array(x.length);
                        while (i--) {
                            const c = fillHeight[i] / fillHeightBase[i];
                            y0[i] = y[i] + sizeBase[i] / 2;
                            y1[i] = y[i] + sizeBase[i] / 2 - c * size[i];
                        }
                        context.drawBarsV(x, y0, y1, sizeBase, pars);
                    });
                };
                this.sizeLimits = { min: 0.01, max: 1.5 };
            }
            get defaultSize() {
                const { x, y } = this.scales;
                if (x.breakWidth && y.breakWidth) {
                    return Math.min(x.breakWidth, y.breakWidth);
                }
                return (Math.abs(Math.min(x.plotRange, y.plotRange)) / this.wrangler.nObjects);
            }
            get boundingRects() {
                const [x, y, size] = this.getMappings();
                let [i, res] = [x.length, Array(x.length)];
                while (i--) {
                    res[i] = [
                        [x[i] - size[i] / 2, y[i] - size[i] / 2],
                        [x[i] + size[i] / 2, y[i] + size[i] / 2],
                    ];
                }
                return res;
            }
        }
        exports.Squares = Squares;
    });
    define("representations/representations", ["require", "exports", "representations/Representation", "representations/Bars", "representations/Points", "representations/Squares"], function (require, exports, Representation_js_4, Bars_js_1, Points_js_1, Squares_js_1) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        __exportStar(Representation_js_4, exports);
        __exportStar(Bars_js_1, exports);
        __exportStar(Points_js_1, exports);
        __exportStar(Squares_js_1, exports);
    });
    define("scales/PlotScaleContinuous", ["require", "exports", "sparsearrays"], function (require, exports, sprs) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.PlotScaleContinuous = void 0;
        class PlotScaleContinuous {
            constructor(zero = false) {
                this.setPlotLimits = (min, max) => {
                    this.plotMin = min;
                    this.plotMax = max;
                    return this;
                };
                this.registerData = (data) => {
                    const sorted = data.sort((a, b) => a - b);
                    this._dataMin = this.zero ? 0 : sorted[0];
                    this._dataMax = sorted[sorted.length - 1];
                    return this;
                };
                this.expand = (min, max) => {
                    this.expandMin += min;
                    this.expandMax += max;
                    return this;
                };
                this.pctToPlot = (pct) => {
                    const { plotMin, plotRange } = this;
                    if (Array.isArray(pct)) {
                        let [i, res] = [pct.length, Array(pct.length)];
                        while (i--)
                            res[i] = plotMin + pct[i] * plotRange;
                        return res;
                    }
                    return plotMin + pct * plotRange;
                };
                this.dataToPlot = (data) => {
                    const { dataMin, dataRange, plotMin, plotRange } = this;
                    if (sprs.isArrayLike(data)) {
                        let [i, res] = [data.length, new sprs.SparseUint16Array(data)];
                        while (i--) {
                            if (res.empty[i])
                                continue;
                            res[i] = plotMin + ((data[i] - dataMin) / dataRange) * plotRange;
                        }
                        return res;
                    }
                    return plotMin + ((data - dataMin) / dataRange) * plotRange;
                };
                this.continuous = true;
                this.zero = zero;
                this.plotMin = 0;
                this.plotMax = 0;
                this._dataMax = 0;
                this._dataMin = 0;
                this.expandMin = 0;
                this.expandMax = 0;
            }
            get plotRange() {
                return this.plotMax - this.plotMin;
            }
            get dataMin() {
                return this._dataMin - this.expandMin * (this._dataMax - this._dataMin);
            }
            get dataMax() {
                return this._dataMax + this.expandMax * (this._dataMax - this._dataMin);
            }
            get dataRange() {
                return this.dataMax - this.dataMin;
            }
            get dataRepresentation() {
                return [this.dataMin, this.dataMax];
            }
        }
        exports.PlotScaleContinuous = PlotScaleContinuous;
    });
    define("scales/PlotScaleDiscrete", ["require", "exports", "functions", "sparsearrays"], function (require, exports, funs, sprs) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.PlotScaleDiscrete = void 0;
        class PlotScaleDiscrete {
            constructor() {
                this.setPlotLimits = (min, max) => {
                    this.plotMin = min;
                    this.plotMax = max;
                    return this;
                };
                this.registerData = (data) => {
                    this._dataValues = funs.sort(funs.unique(data));
                    let i = this._dataValues.length;
                    this._positions = [...Array(i).keys()].map((e) => (e + 1) / (i + 1));
                    this.positionValueMap = new Map();
                    while (i--) {
                        this.positionValueMap.set(this._dataValues[i], this._positions[i]);
                    }
                    return this;
                };
                this.expand = (min, max) => {
                    this.expandMin += min;
                    this.expandMax += max;
                    return this;
                };
                this.pctToPlot = (pct) => {
                    const { plotMin, plotRange } = this;
                    if (Array.isArray(pct)) {
                        let [i, res] = [pct.length, Array(pct.length)];
                        while (i--)
                            res[i] = plotMin + pct[i] * plotRange;
                        return res;
                    }
                    return plotMin + pct * plotRange;
                };
                this.dataToPlot = (data) => {
                    const { expandMin, unitRange, positionValueMap, plotMin, plotRange } = this;
                    if (sprs.isArrayLike(data)) {
                        let [i, res] = [data.length, new sprs.SparseUint16Array(data)];
                        while (i--) {
                            if (res.empty[i])
                                continue;
                            const dataPct = positionValueMap.get(data[i]);
                            res[i] = plotMin + (-expandMin + dataPct * unitRange) * plotRange;
                        }
                        return res;
                    }
                    const dataPct = positionValueMap.get(data);
                    return plotMin + (-expandMin + dataPct * unitRange) * plotRange;
                };
                this.continuous = false;
                this.plotMin = 0;
                this.plotMax = 0;
                this.expandMin = 0;
                this.expandMax = 0;
            }
            get plotRange() {
                return this.plotMax - this.plotMin;
            }
            get dataRepresentation() {
                return this._dataValues;
            }
            get unitRange() {
                return 1 - this.expandMin - this.expandMax;
            }
            get breakWidth() {
                return Math.abs(this.dataToPlot(this._dataValues[1]) -
                    this.dataToPlot(this._dataValues[0]));
            }
        }
        exports.PlotScaleDiscrete = PlotScaleDiscrete;
    });
    define("scales/AreaScaleContinuous", ["require", "exports", "sparsearrays"], function (require, exports, sprs) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.AreaScaleContinuous = void 0;
        class AreaScaleContinuous {
            constructor(zero = false) {
                this.setPlotLimits = (min, max) => {
                    this.areaMin = min;
                    this.areaMax = max;
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
                            res[i] = Math.sqrt(data[i] / dataMax);
                        }
                        return res;
                    }
                    return Math.sqrt(data / dataMax);
                };
                this.continuous = true;
                this.zero = zero;
                this.areaMin = 0;
                this.areaMax = 1;
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
        exports.AreaScaleContinuous = AreaScaleContinuous;
    });
    define("scales/LengthScaleContinuous", ["require", "exports", "sparsearrays"], function (require, exports, sprs) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.LengthScaleContinuous = void 0;
        class LengthScaleContinuous {
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
        exports.LengthScaleContinuous = LengthScaleContinuous;
    });
    define("scales/scales", ["require", "exports", "scales/PlotScaleContinuous", "scales/PlotScaleDiscrete", "scales/AreaScaleContinuous", "scales/LengthScaleContinuous"], function (require, exports, PlotScaleContinuous_js_1, PlotScaleDiscrete_js_1, AreaScaleContinuous_js_1, LengthScaleContinuous_js_1) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        __exportStar(PlotScaleContinuous_js_1, exports);
        __exportStar(PlotScaleDiscrete_js_1, exports);
        __exportStar(AreaScaleContinuous_js_1, exports);
        __exportStar(LengthScaleContinuous_js_1, exports);
    });
    define("auxiliaries/Auxiliary", ["require", "exports"], function (require, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.Auxiliary = void 0;
        class Auxiliary {
            constructor(plot) {
                this.registerScales = (scales) => {
                    this.scales = scales;
                    return this;
                };
                this.draw = (context, ...args) => { };
                this.drawBase = (context, ...args) => { };
                this.drawUser = (context, handler, ...args) => { };
                this.plot = plot;
            }
        }
        exports.Auxiliary = Auxiliary;
    });
    define("auxiliaries/AxisBox", ["require", "exports", "auxiliaries/Auxiliary"], function (require, exports, Auxiliary_js_1) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.AxisBox = void 0;
        class AxisBox extends Auxiliary_js_1.Auxiliary {
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
        exports.AxisBox = AxisBox;
    });
    define("auxiliaries/AxisText", ["require", "exports", "auxiliaries/Auxiliary", "functions"], function (require, exports, Auxiliary_js_2, funs) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.AxisText = void 0;
        class AxisText extends Auxiliary_js_2.Auxiliary {
            constructor(plot, along, nbreaks) {
                super(plot);
                this.getLabelMetrics = (context) => {
                    return this.labels.map((label) => context.context.measureText(label));
                };
                this.draw = (context) => {
                    const { along, other, breaks, sizeHandler } = this;
                    const size = sizeHandler.fontsize;
                    const coord0 = sizeHandler.innerCoords[`${other}0`];
                    const min = coord0 + ((along === "x" ? 1 : -1) * size) / 2;
                    const intercepts = Array(breaks.length).fill(min);
                    const coords = { x: null, y: null };
                    coords[along] = breaks;
                    coords[other] = intercepts;
                    context.context.save();
                    if (along === "x") {
                        context.context.textBaseline = "top";
                        context.context.textAlign = "center";
                    }
                    if (along === "y") {
                        context.context.textBaseline = "middle";
                        context.context.textAlign = "right";
                    }
                    context.drawText(coords.x, coords.y, this.labels, size);
                    context.context.restore();
                };
                this.drawOverlay = (context) => {
                    this.draw(context);
                };
                this.plot = plot;
                this.sizeHandler = plot.handlers.size;
                this.along = along;
                this.other = along === "x" ? "y" : "x";
                this.nbreaks = nbreaks !== null && nbreaks !== void 0 ? nbreaks : 4;
            }
            get dataBreaks() {
                if (this.scales[this.along].continuous) {
                    return funs.prettyBreaks(this.scales[this.along].dataRepresentation, this.nbreaks);
                }
                return this.scales[this.along].dataRepresentation;
            }
            get breaks() {
                return this.scales[this.along].dataToPlot(this.dataBreaks);
            }
            get labels() {
                return this.scales[this.along].values
                    ? this.scales[this.along].values.map((e) => e.toString())
                    : this.dataBreaks.map((e) => e.toString());
            }
        }
        exports.AxisText = AxisText;
    });
    define("auxiliaries/AxisTitle", ["require", "exports", "auxiliaries/Auxiliary"], function (require, exports, Auxiliary_js_3) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.AxisTitle = void 0;
        class AxisTitle extends Auxiliary_js_3.Auxiliary {
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
        exports.AxisTitle = AxisTitle;
    });
    define("auxiliaries/HighlightRects", ["require", "exports", "auxiliaries/Auxiliary"], function (require, exports, Auxiliary_js_4) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.HighlightRects = void 0;
        class HighlightRects extends Auxiliary_js_4.Auxiliary {
            constructor(plot, handlers) {
                super(plot);
                this.updateCurrentOrigin = (point) => {
                    this.current[0] = point;
                };
                this.updateCurrentEndpoint = (point) => {
                    this.current[1] = point;
                };
                this.updateLast = () => {
                    this.last = [this.current[0], this.current[1]];
                    this.empty = false;
                };
                this.pushLastToPast = () => {
                    this.past.push([this.last[0], this.last[1]]);
                    this.empty = false;
                };
                this.clear = () => {
                    this.last = [
                        [null, null],
                        [null, null],
                    ];
                    this.past = [];
                    this.empty = true;
                };
                this.draw = (context, points) => {
                    context.drawWindow([points[0][0], points[0][1]], [points[1][0], points[1][1]]);
                };
                this.drawUser = (context) => {
                    const { drag, state } = this.handlers;
                    if (this.empty) {
                        context.drawClear();
                        return;
                    }
                    if (!state.none) {
                        context.drawClear();
                        context.drawDim();
                        this.past.forEach((points) => {
                            this.draw(context, points);
                        });
                        this.draw(context, this.last);
                        return;
                    }
                    context.drawClear();
                    context.drawDim();
                    this.draw(context, this.last);
                };
                this.current = [
                    [null, null],
                    [null, null],
                ];
                this.last = [
                    [null, null],
                    [null, null],
                ];
                this.past = [];
                this.empty = true;
                this.handlers = handlers;
                this.bgDrawn = false;
            }
            get lastComplete() {
                return !this.last.flat().some((e) => e === null);
            }
        }
        exports.HighlightRects = HighlightRects;
    });
    define("auxiliaries/auxiliaries", ["require", "exports", "auxiliaries/Auxiliary", "auxiliaries/AxisBox", "auxiliaries/AxisText", "auxiliaries/AxisTitle", "auxiliaries/HighlightRects"], function (require, exports, Auxiliary_js_5, AxisBox_js_1, AxisText_js_1, AxisTitle_js_1, HighlightRects_js_1) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        __exportStar(Auxiliary_js_5, exports);
        __exportStar(AxisBox_js_1, exports);
        __exportStar(AxisText_js_1, exports);
        __exportStar(AxisTitle_js_1, exports);
        __exportStar(HighlightRects_js_1, exports);
    });
    //export * from "./MaskingRects.js";
    define("plot/GraphicStack", ["require", "exports", "plot/GraphicLayer"], function (require, exports, GraphicLayer_js_1) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.GraphicStack = void 0;
        class GraphicStack {
            constructor(element) {
                this.initialize = () => {
                    const graphicLayers = [
                        "layerBase",
                        "layerUser",
                        "layerHighlight",
                        "layerOverlay",
                    ];
                    this.sceneDiv.appendChild(this.containerDiv);
                    this.containerDiv.classList.add("plotscape-container");
                    graphicLayers.forEach((e) => {
                        this[e] = new GraphicLayer_js_1.GraphicLayer(this.containerDiv);
                        this.containerDiv.appendChild(this[e].canvas);
                    });
                    this.layerBase.drawBackground();
                };
                this.sceneDiv = element;
                this.containerDiv = document.createElement("div");
                this.initialize();
            }
            get width() {
                return parseInt(getComputedStyle(this.containerDiv).width, 10);
            }
            get height() {
                return parseInt(getComputedStyle(this.containerDiv).height, 10);
            }
        }
        exports.GraphicStack = GraphicStack;
    });
    define("plot/Plot", ["require", "exports", "functions", "auxiliaries/auxiliaries", "handlers/handlers", "plot/GraphicStack"], function (require, exports, funs, auxs, hndl, GraphicStack_js_1) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.Plot = void 0;
        const layers = ["layerBase", "layerUser", "layerHighlight", "layerOverlay"];
        class Plot extends GraphicStack_js_1.GraphicStack {
            constructor(plotConfig) {
                const { id, element, mapping, globals } = plotConfig;
                super(element);
                this.resize = () => {
                    const { handlers, scales } = this;
                    handlers.size.resize();
                    const { bottom, left, top, right } = handlers.size.margins;
                    scales.x.setPlotLimits(left, handlers.size.width - right);
                    scales.y.setPlotLimits(handlers.size.height - bottom, top);
                    layers.forEach((e) => this[e].resize());
                };
                this.activate = () => {
                    this.handlers.state.deactivateAll();
                    this.handlers.state.activate(this.id);
                };
                this.getUnique = (mapping) => {
                    const arr = Object.keys(this.wranglers).map((name) => { var _a; return (_a = this.wranglers[name][mapping]) === null || _a === void 0 ? void 0 : _a.extract(); });
                    return Array.from(new Set(arr.flat()));
                };
                this.inSelection = (selPoints) => {
                    const repNames = Object.keys(this.representations);
                    let [i, allCases] = [repNames.length, new Set()];
                    while (i--) {
                        const cases = this.representations[repNames[i]].inSelection(selPoints);
                        let j = cases.length;
                        while (j--)
                            allCases.add(cases[j]);
                    }
                    return Array.from(allCases);
                };
                this.inClickPosition = (clickPoint) => {
                    const repNames = Object.keys(this.representations);
                    let [i, allCases] = [repNames.length, new Set()];
                    while (i--) {
                        const cases = this.representations[repNames[i]].atClick(clickPoint);
                        let j = cases.length;
                        while (j--)
                            allCases.add(cases[j]);
                    }
                    return Array.from(allCases);
                };
                this.updateCurrent = () => this.drawHighlight();
                this.clearAll = () => this.drawHighlight();
                this.startDrag = () => {
                    const { state, drag } = this.handlers;
                    const { highlightrects } = this.auxiliaries;
                    if (!state.none && highlightrects.lastComplete) {
                        highlightrects.pushLastToPast();
                    }
                    highlightrects.updateCurrentOrigin(drag.start);
                };
                this.whileDrag = () => {
                    const { marker, drag, state } = this.handlers;
                    const { highlightrects } = this.auxiliaries;
                    highlightrects.updateCurrentEndpoint(drag.end);
                    highlightrects.updateLast();
                    marker.updateCurrent(this.inSelection([drag.start, drag.end]), state.membership);
                    if (this.active || state.none)
                        this.draw("user");
                };
                this.endDrag = () => {
                    const { highlightrects } = this.auxiliaries;
                    if (!this.handlers.state.none && highlightrects.lastComplete) {
                        highlightrects.pushLastToPast();
                    }
                };
                this.keyPressed = (key) => {
                    if (this.active) {
                        Object.keys(this.representations).forEach((e) => {
                            this.representations[e].keyPressed(key);
                        });
                        this.drawBase();
                        this.drawHighlight();
                    }
                };
                this.keyReleased = () => { };
                this.mouseDownAnyPlot = (event) => {
                    if (this.handlers.state.none) {
                        this.auxiliaries.highlightrects.clear();
                        this.drawUser();
                    }
                };
                this.mouseDownThisPlot = (event) => {
                    const { marker, click, state } = this.handlers;
                    marker.mergeCurrent(state.membership === 128);
                    if (state.none) {
                        marker.clearCurrent();
                        this.auxiliaries.highlightrects.clear();
                        this.drawUser();
                    }
                    state.deactivateAll();
                    this.activate();
                    marker.updateCurrent(this.inClickPosition(click.positionLast), state.membership);
                };
                this.doubleClick = () => {
                    const { marker, state } = this.handlers;
                    state.activateAll();
                    marker.clearAll();
                    this.auxiliaries.highlightrects.clear();
                    this.drawHighlight();
                    this.drawUser();
                    state.deactivateAll();
                };
                this.draw = (context, ...args) => {
                    const { representations, auxiliaries } = this;
                    const [what, where] = ["draw", "layer"].map((e) => e + funs.capitalize(context));
                    if (context !== "user")
                        this[where].drawClear();
                    if (context === "base")
                        this[where].drawBackground();
                    const repsAndAuxs = Object.assign(Object.assign({}, representations), auxiliaries);
                    Object.keys(repsAndAuxs).forEach((e) => {
                        var _a, _b;
                        (_b = (_a = repsAndAuxs[e]) === null || _a === void 0 ? void 0 : _a[what]) === null || _b === void 0 ? void 0 : _b.call(_a, this[where], ...args);
                    });
                };
                this.drawBase = () => this.draw("base");
                this.drawHighlight = () => this.draw("highlight");
                this.drawUser = () => this.draw("user");
                this.drawOverlay = () => this.draw("overlay");
                this.drawRedraw = () => {
                    this.drawBase();
                    this.drawUser();
                    this.drawHighlight();
                    this.drawOverlay();
                };
                this.initialize = () => {
                    const { representations, auxiliaries, handlers, scales, mouseDownThisPlot, mouseDownAnyPlot, doubleClick, containerDiv, sceneDiv, } = this;
                    this.handlers.drag.state = this.handlers.state;
                    this.resize();
                    if (scales.x.continuous)
                        scales.x.expand(scales.x.zero ? 0 : 0.1, 0.1);
                    if (scales.y.continuous)
                        scales.y.expand(scales.y.zero ? 0 : 0.1, 0.1);
                    Object.keys(scales).forEach((e) => {
                        var _a, _b;
                        (_b = (_a = scales[e]).registerData) === null || _b === void 0 ? void 0 : _b.call(_a, this.getUnique(e));
                    });
                    const repsAndAuxs = Object.assign(Object.assign({}, representations), auxiliaries);
                    Object.keys(repsAndAuxs).forEach((e) => { var _a, _b; return (_b = (_a = repsAndAuxs[e]).registerScales) === null || _b === void 0 ? void 0 : _b.call(_a, scales); });
                    sceneDiv.addEventListener("dblclick", doubleClick);
                    sceneDiv.addEventListener("mousedown", mouseDownAnyPlot);
                    containerDiv.addEventListener("mousedown", mouseDownThisPlot);
                    Object.keys(handlers).forEach((e) => handlers[e].subscribe(this));
                };
                this.id = id;
                this.representations = {};
                this.wranglers = {};
                this.scales = { x: null, y: null };
                this.handlers = {
                    marker: globals.marker,
                    keypress: globals.keypress,
                    state: globals.state,
                    size: new hndl.SizeHandler(this),
                    drag: new hndl.DragHandler(this.containerDiv),
                    click: new hndl.ClickHandler(this.containerDiv),
                };
                this.auxiliaries = {
                    axisbox: new auxs.AxisBox(this),
                    axistextx: new auxs.AxisText(this, "x"),
                    axistexy: new auxs.AxisText(this, "y"),
                    axistitlex: new auxs.AxisTitle(this, "x", mapping.get("x")),
                    axistitley: new auxs.AxisTitle(this, "y", mapping.get("y")),
                    highlightrects: new auxs.HighlightRects(this, this.handlers),
                };
            }
            get active() {
                return this.handlers.state.isActive(this.id);
            }
            get width() {
                return parseInt(getComputedStyle(this.containerDiv).width, 10);
            }
            get height() {
                return parseInt(getComputedStyle(this.containerDiv).height, 10);
            }
            get fontsize() {
                return Math.floor(Math.min(this.width, this.height) * 0.05);
            }
        }
        exports.Plot = Plot;
    });
    define("handlers/SizeHandler", ["require", "exports", "handlers/Handler"], function (require, exports, Handler_js_6) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.SizeHandler = void 0;
        class SizeHandler extends Handler_js_6.Handler {
            constructor(plot) {
                super();
                this.resize = () => {
                    this.width = this.plot.width;
                    this.height = this.plot.height;
                };
                this.pctAlong = (along, percent) => {
                    return along === "x" ? this.width * percent : this.height * (1 - percent);
                };
                this.plot = plot;
                this.width = plot.width;
                this.height = plot.height;
            }
            get fontsize() {
                return Math.floor(Math.min(this.width, this.height) * 0.05);
            }
            get margins() {
                return {
                    bottom: 4 * this.fontsize,
                    left: 4 * this.fontsize,
                    top: 2 * this.fontsize,
                    right: 2 * this.fontsize,
                };
            }
            get innerWidth() {
                return this.width - this.margins.left - this.margins.right;
            }
            get innerHeight() {
                return this.height - this.margins.bottom - this.margins.top;
            }
            get innerCoords() {
                return {
                    x0: this.margins.left,
                    x1: this.width - this.margins.right,
                    y0: this.height - this.margins.bottom,
                    y1: this.height - this.margins.bottom - this.innerHeight,
                };
            }
        }
        exports.SizeHandler = SizeHandler;
    });
    define("handlers/handlers", ["require", "exports", "handlers/MarkerHandler", "handlers/KeypressHandler", "handlers/DragHandler", "handlers/StateHandler", "handlers/ClickHandler", "handlers/SizeHandler"], function (require, exports, MarkerHandler_js_1, KeypressHandler_js_1, DragHandler_js_1, StateHandler_js_1, ClickHandler_js_1, SizeHandler_js_1) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        __exportStar(MarkerHandler_js_1, exports);
        __exportStar(KeypressHandler_js_1, exports);
        __exportStar(DragHandler_js_1, exports);
        __exportStar(StateHandler_js_1, exports);
        __exportStar(ClickHandler_js_1, exports);
        __exportStar(SizeHandler_js_1, exports);
    });
    define("datastructures", ["require", "exports"], function (require, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.plotTypeArray = exports.highlightMembershipArray = exports.validMembershipArray = exports.baseMembershipArray = exports.Mapping = exports.DataFrame = void 0;
        class DataFrame {
            constructor(data) {
                Object.keys(data).forEach((e) => (this[e] = data[e]));
                this._indicator = Array(this[Object.keys(this)[0]].length).fill(1);
            }
        }
        exports.DataFrame = DataFrame;
        class Mapping extends Map {
            constructor(...mappings) {
                super([...mappings]);
                if (!this.has("y"))
                    this.set("y", "_indicator");
            }
        }
        exports.Mapping = Mapping;
        const baseMembershipArray = [1, 2, 3, 4];
        exports.baseMembershipArray = baseMembershipArray;
        const transientMembershipArray = [129, 130, 131, 132];
        const validMembershipArray = [
            ...baseMembershipArray,
            ...transientMembershipArray,
            128,
        ];
        exports.validMembershipArray = validMembershipArray;
        const [, ...highlightMembershipArray] = validMembershipArray;
        exports.highlightMembershipArray = highlightMembershipArray;
        const plotTypeArray = [
            "scatter",
            "bubble",
            "bar",
            "histo",
            "square",
            "squareheat",
        ];
        exports.plotTypeArray = plotTypeArray;
    });
    define("plot/ScatterPlot", ["require", "exports", "scales/scales", "representations/representations", "wrangler/Wrangler", "plot/Plot"], function (require, exports, scls, reps, Wrangler_js_1, Plot_js_1) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.ScatterPlot = void 0;
        class ScatterPlot extends Plot_js_1.Plot {
            constructor(plotConfig) {
                const { data, mapping, globals } = plotConfig;
                super(plotConfig);
                this.mapping = mapping;
                this.wranglers = {
                    wrangler1: new Wrangler_js_1.Wrangler(data, mapping, globals.marker).extractAsIs("x", "y"),
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
        exports.ScatterPlot = ScatterPlot;
    });
    define("plot/BubblePlot", ["require", "exports", "scales/scales", "representations/representations", "functions", "wrangler/Wrangler", "plot/Plot"], function (require, exports, scls, reps, funs, Wrangler_js_2, Plot_js_2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.BubblePlot = void 0;
        class BubblePlot extends Plot_js_2.Plot {
            constructor(plotConfig) {
                const { data, mapping, globals } = plotConfig;
                if (!mapping.has("size"))
                    mapping.set("size", "_indicator");
                super(plotConfig);
                this.wranglers = {
                    wrangler1: new Wrangler_js_2.Wrangler(data, mapping, globals.marker)
                        .splitBy("x", "y")
                        .splitWhat("size")
                        .doWithin("by", funs.unique)
                        .doWithin("what", funs.length)
                        .assignIndices(),
                };
                this.scales = {
                    x: new scls.PlotScaleDiscrete(),
                    y: new scls.PlotScaleDiscrete(),
                    size: new scls.AreaScaleContinuous(),
                };
                this.representations = {
                    points: new reps.Points(this.wranglers.wrangler1),
                };
                this.initialize();
            }
        }
        exports.BubblePlot = BubblePlot;
    });
    define("plot/BarPlot", ["require", "exports", "scales/scales", "representations/representations", "functions", "wrangler/Wrangler", "plot/Plot"], function (require, exports, scls, reps, funs, Wrangler_js_3, Plot_js_3) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.BarPlot = void 0;
        class BarPlot extends Plot_js_3.Plot {
            constructor(plotConfig) {
                const { data, mapping, globals } = plotConfig;
                super(plotConfig);
                this.wranglers = {
                    wrangler1: new Wrangler_js_3.Wrangler(data, mapping, globals.marker)
                        .splitBy("x")
                        .splitWhat("y")
                        .doWithin("by", funs.unique)
                        .doWithin("what", funs.sum)
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
        exports.BarPlot = BarPlot;
    });
    define("plot/HistoPlot", ["require", "exports", "scales/scales", "representations/representations", "functions", "wrangler/Wrangler", "plot/Plot"], function (require, exports, scls, reps, funs, Wrangler_js_4, Plot_js_4) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.HistoPlot = void 0;
        class HistoPlot extends Plot_js_4.Plot {
            constructor(plotConfig) {
                const { data, mapping, globals } = plotConfig;
                super(plotConfig);
                this.wranglers = {
                    wrangler1: new Wrangler_js_4.Wrangler(data, mapping, globals.marker)
                        .splitBy("x")
                        .splitWhat("y")
                        .doAcross("by", funs.bin, 10)
                        .doWithin("by", funs.unique)
                        .doWithin("what", funs.sum)
                        .assignIndices(),
                };
                this.scales = {
                    x: new scls.PlotScaleContinuous(),
                    y: new scls.PlotScaleContinuous(true),
                };
                this.representations = {
                    bars: new reps.Bars(this.wranglers.wrangler1, 1),
                };
                this.initialize();
            }
        }
        exports.HistoPlot = HistoPlot;
    });
    define("plot/SquarePlot", ["require", "exports", "scales/scales", "representations/representations", "functions", "wrangler/Wrangler", "plot/Plot"], function (require, exports, scls, reps, funs, Wrangler_js_5, Plot_js_5) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.SquarePlot = void 0;
        class SquarePlot extends Plot_js_5.Plot {
            constructor(plotConfig) {
                const { data, mapping, globals } = plotConfig;
                if (!mapping.has("size"))
                    mapping.set("size", "_indicator");
                if (!mapping.has("fillHeight"))
                    mapping.set("fillHeight", "_indicator");
                super(plotConfig);
                this.wranglers = {
                    wrangler1: new Wrangler_js_5.Wrangler(data, mapping, globals.marker)
                        .splitBy("x", "y")
                        .splitWhat("size", "fillHeight")
                        .doWithin("by", funs.unique)
                        .doWithin("what", funs.sum)
                        .assignIndices(),
                };
                this.scales = {
                    x: new scls.PlotScaleDiscrete(),
                    y: new scls.PlotScaleDiscrete(),
                    size: new scls.AreaScaleContinuous(),
                    fillHeight: new scls.LengthScaleContinuous(),
                };
                this.representations = {
                    squares: new reps.Squares(this.wranglers.wrangler1),
                };
                this.initialize();
            }
        }
        exports.SquarePlot = SquarePlot;
    });
    define("plot/SquareHeatmap", ["require", "exports", "scales/scales", "representations/representations", "functions", "wrangler/Wrangler", "plot/Plot"], function (require, exports, scls, reps, funs, Wrangler_js_6, Plot_js_6) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.SquareHeatmap = void 0;
        class SquareHeatmap extends Plot_js_6.Plot {
            constructor(plotConfig) {
                const { data, mapping, globals } = plotConfig;
                if (!mapping.has("size"))
                    mapping.set("size", "_indicator");
                if (!mapping.has("fillHeight"))
                    mapping.set("fillHeight", "_indicator");
                super(plotConfig);
                this.wranglers = {
                    wrangler1: new Wrangler_js_6.Wrangler(data, mapping, globals.marker)
                        .splitBy("x", "y")
                        .splitWhat("size", "fillHeight")
                        .doAcross("by", funs.toPretty, 10)
                        .doWithin("by", funs.unique)
                        .doWithin("what", funs.sum)
                        .assignIndices(),
                };
                this.scales = {
                    x: new scls.PlotScaleContinuous(),
                    y: new scls.PlotScaleContinuous(),
                    size: new scls.AreaScaleContinuous(),
                    fillHeight: new scls.LengthScaleContinuous(),
                };
                this.representations = {
                    squares: new reps.Squares(this.wranglers.wrangler1),
                };
                this.initialize();
            }
        }
        exports.SquareHeatmap = SquareHeatmap;
    });
    define("plot/plots", ["require", "exports", "plot/ScatterPlot", "plot/BubblePlot", "plot/BarPlot", "plot/HistoPlot", "plot/SquarePlot", "plot/SquareHeatmap"], function (require, exports, ScatterPlot_js_1, BubblePlot_js_1, BarPlot_js_1, HistoPlot_js_1, SquarePlot_js_1, SquareHeatmap_js_1) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        __exportStar(ScatterPlot_js_1, exports);
        __exportStar(BubblePlot_js_1, exports);
        __exportStar(BarPlot_js_1, exports);
        __exportStar(HistoPlot_js_1, exports);
        __exportStar(SquarePlot_js_1, exports);
        __exportStar(SquareHeatmap_js_1, exports);
    });
    define("helppaneltext", ["require", "exports"], function (require, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.helpPanelText = void 0;
        exports.helpPanelText = `
        Welcome to Plotscape! <br>
        Try interacting with the plots in the following ways: <br> <br>
        <kbd>Click</kbd> a plot to make it active <br>
        <kbd>+</kbd>/<kbd>-</kbd> to increase/decrease size of objects <br>
        <kbd>[</kbd>/<kbd>]</kbd> to decrease/increase opacity (alpha) of objects <br>
        <kbd>R</kbd> to reset graphical settings of the active plot <br>
        <kbd>Click-and-drag</kbd>/<kbd>click</kbd> to transiently select objects<br>
        <kbd>1</kbd>,<kbd>2</kbd>,<kbd>...</kbd> + <kbd>click-and-drag</kbd> to make a permanent (group) selection <br>
        <kbd>Double-click</kbd> to reset selection
    
        <br>
    `;
    });
    define("Scene", ["require", "exports", "datastructures", "handlers/handlers", "plot/plots", "helppaneltext", "globalparameters"], function (require, exports, dtstr, hndl, plts, helppaneltext_js_1, globalparameters_js_3) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.Scene = void 0;
        class Scene {
            constructor(element, data, opts) {
                this.setRowsCols = () => {
                    if (this.layout) {
                        this.sceneDiv.style.setProperty("--nrows", `${this.layout.length}`);
                        this.sceneDiv.style.setProperty("--ncols", `${this.layout[0].length}`);
                        return;
                    }
                    const nRows = Math.floor(Math.sqrt(this.nPlots));
                    const nCols = Math.ceil(this.nPlots / nRows);
                    this.sceneDiv.style.setProperty("--nrows", `${nRows}`);
                    this.sceneDiv.style.setProperty("--ncols", `${nCols}`);
                };
                this.resize = () => {
                    this.plotIds.forEach((e) => {
                        this.plots[e].resize();
                        this.plots[e].drawRedraw();
                    });
                };
                this.addPlotWrapper = (type, mapping) => {
                    const { sceneDiv: element, data, plotIds, globals } = this;
                    this.nPlots++;
                    const plotTypeIndex = dtstr.plotTypeArray.findIndex((e) => e === type);
                    this.nPlotsOfType[plotTypeIndex]++;
                    const id = `${type}${this.nPlotsOfType[plotTypeIndex]}`;
                    this.setRowsCols();
                    const plotConfig = {
                        id: id,
                        element: element,
                        data: data,
                        mapping: mapping,
                        globals: globals,
                    };
                    this.plots[id] = new PlotProxy(type, plotConfig);
                    plotIds.push(id);
                    globals.state.plotIds.push(id);
                    globals.state.plotsActive.push(false);
                    globals.state.containerDivs.push(this.plots[id].containerDiv);
                    if (this.layout) {
                        this.plots[id].containerDiv.style.gridArea = `p${this.nPlots}`;
                    }
                    this.resize();
                    return this;
                };
                this.sceneDiv = element;
                this.data = data;
                this.layout = opts === null || opts === void 0 ? void 0 : opts.layout;
                this.nCases = data[Object.keys(data)[0]].length;
                this.nPlots = 0;
                this.nPlotsOfType = Array(dtstr.plotTypeArray.length).fill(0);
                this.plots = {};
                this.plotIds = [];
                this.globals = {
                    marker: new hndl.MarkerHandler(this.nCases),
                    keypress: new hndl.KeypressHandler(),
                    state: new hndl.StateHandler(),
                };
                this.sceneDiv.classList.add("plotscape-scene");
                this.sceneDiv.classList.add("js-plotscape-scene");
                this.sceneDiv.style.backgroundColor = globalparameters_js_3.globalParameters.scene.backgroundColour;
                this.sceneDiv.style.border = `#000000`;
                this.globals.state.keypressHandler = this.globals.keypress;
                this.globals.keypress.subscribe(this.globals.state);
                // Inject css
                const head = document.head;
                const link = document.createElement("link");
                [link.type, link.rel, link.href] = [
                    "text/css",
                    "stylesheet",
                    "./styles.css",
                ];
                head.appendChild(link);
                // Add help button and panel
                const [helpButton, helpPanel] = ["button", "div"].map((e) => document.createElement(e));
                helpButton.innerText = `?`;
                helpPanel.innerHTML = helppaneltext_js_1.helpPanelText;
                helpButton.classList.add("help-button", "js-help-button");
                helpPanel.classList.add("help-panel", "js-help-panel");
                const helpButtonDim = Math.min(this.width, this.height) * 0.05;
                const hs = helpButton.style;
                [hs.width, hs.height, hs.fontSize] = [
                    `${helpButtonDim}px`,
                    `${helpButtonDim}px`,
                    `${0.5 * helpButtonDim}px`,
                ];
                [helpButton, helpPanel].forEach((e) => this.sceneDiv.appendChild(e));
                const activateHelpPanel = () => helpPanel.classList.toggle("active");
                helpButton.addEventListener("click", activateHelpPanel);
                // Add CSS grid layout template if available
                if (this.layout) {
                    const layoutString = this.layout
                        .map((row) => row.map((e) => `p${e.toString()}`).join(" "))
                        .reduce((a, b) => `${a}"${b}"`, ``);
                    this.sceneDiv.style.gridTemplateAreas = layoutString;
                }
                window.addEventListener("resize", this.resize);
            }
            get width() {
                return parseInt(getComputedStyle(this.sceneDiv).width, 10);
            }
            get height() {
                return parseInt(getComputedStyle(this.sceneDiv).height, 10);
            }
        }
        exports.Scene = Scene;
        // A class that dynamically constructs a wrapper plot given
        // a plot type (string), data, mapping, and global handlers
        class PlotProxy {
            constructor(type, plotConfig) {
                const plotClasses = {
                    scatter: plts.ScatterPlot,
                    bubble: plts.BubblePlot,
                    bar: plts.BarPlot,
                    histo: plts.HistoPlot,
                    square: plts.SquarePlot,
                    squareheat: plts.SquareHeatmap,
                };
                return new plotClasses[type](plotConfig);
            }
        }
    });
    define("main", ["require", "exports", "Scene", "datastructures", "plot/Plot", "functions", "scales/scales"], function (require, exports, Scene_js_1, datastructures_js_1, Plot_js_7, functions_js_1, scales_js_1) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        __exportStar(Scene_js_1, exports);
        __exportStar(datastructures_js_1, exports);
        __exportStar(Plot_js_7, exports);
        __exportStar(functions_js_1, exports);
        __exportStar(scales_js_1, exports);
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
                catch (_a) {
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