import * as funs from "../functions.js";
import * as auxs from "../auxiliaries/auxiliaries.js";
import * as hndl from "../handlers/handlers.js";
import { GraphicStack } from "./GraphicStack.js";
export class Plot extends GraphicStack {
    constructor(plotConfig) {
        const { id, element, mapping, globals } = plotConfig;
        super(element);
        this.resize = () => {
            const { layers, handlers, scales } = this;
            handlers.size.resize();
            const { bottom, left, top, right } = handlers.size.margins;
            scales.x.setPlotLimits(left, handlers.size.width - right);
            scales.y.setPlotLimits(handlers.size.height - bottom, top);
            Object.values(layers).forEach((layer) => layer.resize(handlers.size));
        };
        this.activate = () => {
            this.handlers.state.deactivateAll();
            this.handlers.state.activate(this.id);
        };
        this.getUnique = (mapping) => {
            const arr = Object.values(this.wranglers).map((wrangler) => { var _a; return (_a = wrangler[mapping]) === null || _a === void 0 ? void 0 : _a.extract(1); });
            return Array.from(new Set(arr.flat()));
        };
        this.inSelection = (selPoints) => {
            const reps = Object.values(this.representations);
            let [i, allCases] = [reps.length, new Set()];
            while (i--) {
                const cases = reps[i].inSelection(selPoints);
                let j = cases.length;
                while (j--)
                    allCases.add(cases[j]);
            }
            return Array.from(allCases);
        };
        this.inClickPosition = (clickPoint) => {
            const reps = Object.values(this.representations);
            let [i, allCases] = [reps.length, new Set()];
            while (i--) {
                const cases = reps[i].atClick(clickPoint);
                let j = cases.length;
                while (j--)
                    allCases.add(cases[j]);
            }
            return Array.from(allCases);
        };
        this.updateCurrent = () => this.drawHighlight();
        this.clearCurrent = () => this.drawHighlight();
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
            if (this.handlers.click.button === 2) {
                const { x, y } = this.scales;
                const { previous, end } = this.handlers.drag;
                const [xDiff, yDiff] = [
                    (previous[0] - end[0]) / this.width,
                    (previous[1] - end[1]) / this.height,
                ];
                x.expandDataLimits(-xDiff, xDiff);
                y.expandDataLimits(yDiff, -yDiff);
                this.handlers.marker.clearCurrent();
                this.auxiliaries.highlightrects.clear();
                this.drawRedraw();
                return;
            }
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
                if (key === "KeyZ") {
                    // const { x, y } = this.scales;
                    // const w = this.auxiliaries.highlightrects.last;
                    // const x0 = x.plotToPct(w[0][0]) as number;
                    // const y0 = y.plotToPct(w[0][1]) as number;
                    // const x1 = x.plotToPct(w[1][0]) as number;
                    // const y1 = y.plotToPct(w[1][1]) as number;
                    // x.setPctLimits(Math.min(x0, x1), Math.max(x0, x1));
                    // y.setPctLimits(Math.min(y0, y1), Math.max(y0, y1));
                    // this.handlers.marker.clearAll();
                    // this.auxiliaries.highlightrects.clear();
                }
                Object.values(this.representations).forEach((rep) => rep.keyPressed(key));
                ["x", "y"].forEach((e) => {
                    this.scales[e].keyPressed(key);
                });
                this.drawBase();
                this.drawHighlight();
                this.drawUser();
                this.drawOverlay();
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
            if (event.button === 2)
                return;
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
            const { layers, representations, auxiliaries } = this;
            const what = `draw${funs.capitalize(context)}`;
            if (context !== "user")
                this.layers[context].drawClear();
            if (context === "base")
                this.layers[context].drawBackground();
            const repsAndAuxs = Object.assign(Object.assign({}, representations), auxiliaries);
            Object.values(repsAndAuxs).forEach((repOrAux) => {
                var _a;
                (_a = repOrAux[what]) === null || _a === void 0 ? void 0 : _a.call(repOrAux, this.layers[context], ...args);
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
            Object.keys(scales).forEach((e) => {
                var _a, _b;
                (_b = (_a = scales[e]).registerData) === null || _b === void 0 ? void 0 : _b.call(_a, this.getUnique(e));
                if ((e === "x" || e === "y") && scales[e].continuous) {
                    scales[e].expandDataLimits(scales[e].zero ? 0 : 0.1, 0.1, true);
                }
            });
            const repsAndAuxs = Object.assign(Object.assign({}, representations), auxiliaries);
            Object.values(repsAndAuxs).forEach((repOrAux) => { var _a; return (_a = repOrAux.registerScales) === null || _a === void 0 ? void 0 : _a.call(repOrAux, scales); });
            sceneDiv.addEventListener("dblclick", doubleClick);
            sceneDiv.addEventListener("mousedown", mouseDownAnyPlot);
            containerDiv.addEventListener("mousedown", mouseDownThisPlot);
            containerDiv.addEventListener("contextmenu", (event) => event.preventDefault());
            Object.values(handlers).forEach((handler) => handler.listen(this));
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
