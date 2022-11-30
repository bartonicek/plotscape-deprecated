import * as funs from "../functions.js";
export class Handler {
    constructor() {
        this.registerEvents = (element) => {
            this.events.forEach((action, i) => {
                element.addEventListener(action, (event) => funs.throttle(this[this.consequences[i]](event), 100));
            });
        };
        this.listen = (listener) => {
            const ownProperties = Object.keys(this);
            Object.keys(listener).forEach((e) => {
                if (typeof listener[e] === "function" && ownProperties.includes(e)) {
                    if (!this.callbacks.has(e))
                        this.callbacks.set(e, []);
                    this.callbacks.set(e, [...this.callbacks.get(e), listener[e]]);
                }
            });
        };
        this.broadcast = (name, ...args) => {
            var _a;
            (_a = this.callbacks.get(name)) === null || _a === void 0 ? void 0 : _a.forEach((e) => e(...args));
        };
        this.callbacks = new Map();
    }
}
