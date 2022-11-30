import * as funs from "../functions.js";
import { Cast } from "./Cast.js";
export class Wrangler {
    constructor(data, mapping, marker) {
        this.getVariable = (mapping) => {
            return this.data[this.mapping.get(mapping)];
        };
        this.extractAsIs = (...mappings) => {
            this.allUnique = true;
            this.indices = new Uint32Array(Array.from(Array(this.marker.n).keys()));
            this.nObjects = this.indices.length;
            mappings.forEach((mapping) => (this[mapping] = new Cast(this, mapping)));
            return this;
        };
        this.groupBy = (...mappings) => {
            mappings.forEach((mapping) => this.by.add(mapping));
            return this;
        };
        this.groupWhat = (...mappings) => {
            mappings.forEach((mapping) => this.what.add(mapping));
            return this;
        };
        this.doMap = (target, fun, ...args) => {
            const funWithArgs = (x) => fun(x, ...args);
            this.mapFuns.set(target, funWithArgs);
            return this;
        };
        this.doReduce = (target, fun, ...args) => {
            const funWithArgs = (x) => fun(x, ...args);
            this.reduceFuns.set(target, funWithArgs);
            return this;
        };
        this.assignIndices = () => {
            const { what, by, mapFuns, reduceFuns } = this;
            const splittingVars = Array.from(by).map((e) => {
                if (mapFuns.get("by")) {
                    return mapFuns.get("by")(this.getVariable(e));
                }
                return this.getVariable(e);
            });
            const indices = funs.uniqueRowIds(splittingVars);
            const nObjects = Array.from(new Set(indices)).length;
            this.indices = new Uint32Array(indices);
            this.nObjects = nObjects;
            [...what].forEach((e) => {
                this[e] = new Cast(this, e);
                this[e].registerMap(mapFuns.get("what"));
                this[e].registerReduce(reduceFuns.get("what"));
            });
            [...by].forEach((e) => {
                this[e] = new Cast(this, e);
                this[e].registerMap(mapFuns.get("by"));
                this[e].registerReduce(reduceFuns.get("by"));
            });
            return this;
        };
        this.nCases = Object.values(data)[0].length;
        this.allUnique = false;
        this.data = data;
        this.mapping = mapping;
        this.marker = marker;
        this.by = new Set();
        this.what = new Set();
        this.mapFuns = new Map();
        this.reduceFuns = new Map();
    }
}
