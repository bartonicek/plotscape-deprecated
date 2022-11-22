import * as dtstr from "../datastructures.js";
import * as funs from "../functions.js";
import * as reps from "../representations/representations.js";
import * as scls from "../scales/scales.js";
import * as auxs from "../auxiliaries/auxiliaries.js";
import * as hndl from "../handlers/handlers.js";
import { GraphicStack } from "./GraphicStack.js";
import { Wrangler } from "../wrangler/Wrangler.js";

const layers = ["layerBase", "layerUser", "layerHighlight", "layerOverlay"];

export class Plot extends GraphicStack {
  id: string;
  scales: {
    x: scls.PlotScaleContinuous | scls.PlotScaleDiscrete;
    y: scls.PlotScaleContinuous | scls.PlotScaleDiscrete;
    [key: string]:
      | scls.PlotScaleContinuous
      | scls.PlotScaleDiscrete
      | scls.AreaScaleContinuous
      | scls.LengthScaleContinuous;
  };

  xExpandDirection: number;
  yExpandDirection: number;

  representations: { [key: string]: reps.Representation };
  auxiliaries: {
    [key: string]: auxs.Auxiliary;
    highlightrects: auxs.HighlightRects;
  };
  wranglers: { [key: string]: Wrangler };
  handlers: {
    marker: hndl.MarkerHandler;
    size: hndl.SizeHandler;
    drag: hndl.DragHandler;
    state: hndl.StateHandler;
    click: hndl.ClickHandler;
    keypress: hndl.KeypressHandler;
  };

  constructor(plotConfig: {
    id: string;
    element: HTMLDivElement;
    data: dtstr.DataFrame;
    mapping: dtstr.Mapping;
    globals: dtstr.Globals;
  }) {
    const { id, element, mapping, globals } = plotConfig;
    super(element);
    this.id = id;
    this.representations = {};
    this.wranglers = {};
    this.scales = { x: null, y: null };
    this.xExpandDirection = 1;
    this.yExpandDirection = 1;
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

  resize = () => {
    const { handlers, scales } = this;
    handlers.size.resize();
    const { bottom, left, top, right } = handlers.size.margins;
    scales.x.setPlotLimits(left, handlers.size.width - right);
    scales.y.setPlotLimits(handlers.size.height - bottom, top);
    layers.forEach((e) => this[e].resize());
  };

  activate = () => {
    this.handlers.state.deactivateAll();
    this.handlers.state.activate(this.id);
  };

  getUnique = (mapping: string) => {
    const arr = Object.keys(this.wranglers).map((name) =>
      this.wranglers[name][mapping]?.extract(1)
    );
    return Array.from(new Set(arr.flat()));
  };

  inSelection = (selPoints: dtstr.Rect2Points): number[] => {
    const repNames = Object.keys(this.representations);
    let [i, allCases] = [repNames.length, new Set<number>()];
    while (i--) {
      const cases = this.representations[repNames[i]].inSelection(selPoints);
      let j = cases.length;
      while (j--) allCases.add(cases[j]);
    }
    return Array.from(allCases);
  };

  inClickPosition = (clickPoint: [number, number]): number[] => {
    const repNames = Object.keys(this.representations);
    let [i, allCases] = [repNames.length, new Set<number>()];
    while (i--) {
      const cases = this.representations[repNames[i]].atClick(clickPoint);
      let j = cases.length;
      while (j--) allCases.add(cases[j]);
    }
    return Array.from(allCases);
  };

  updateCurrent = () => this.drawHighlight();
  clearAll = () => this.drawHighlight();

  startDrag = () => {
    const { state, drag } = this.handlers;
    const { highlightrects } = this.auxiliaries;
    if (!state.none && highlightrects.lastComplete) {
      highlightrects.pushLastToPast();
    }
    highlightrects.updateCurrentOrigin(drag.start);
  };

  whileDrag = () => {
    if (this.handlers.click.button === 2) {
      const { x, y } = this.scales;
      const { previous, end } = this.handlers.drag;
      const { xExpandDirection, yExpandDirection } = this;
      const [xDiff, yDiff] = [
        ((previous[0] - end[0]) / this.width) * xExpandDirection,
        ((previous[1] - end[1]) / this.height) * yExpandDirection,
      ];

      if (x.zero) x.expand(0, xDiff);
      if (!x.zero) x.expand(-xDiff, xDiff);
      if (y.zero) y.expand(0, yDiff);
      if (!y.zero) y.expand(yDiff, -yDiff);

      this.drawRedraw();

      return;
    }

    const { marker, drag, state } = this.handlers;
    const { highlightrects } = this.auxiliaries;

    highlightrects.updateCurrentEndpoint(drag.end);
    highlightrects.updateLast();
    marker.updateCurrent(
      this.inSelection([drag.start, drag.end]),
      state.membership
    );
    if (this.active || state.none) this.draw("user");
  };

  endDrag = () => {
    const { highlightrects } = this.auxiliaries;
    if (!this.handlers.state.none && highlightrects.lastComplete) {
      highlightrects.pushLastToPast();
    }
  };

  keyPressed = (key: string) => {
    if (this.active) {
      Object.keys(this.representations).forEach((e) => {
        this.representations[e].keyPressed(key);
      });
      this.drawBase();
      this.drawHighlight();
    }
  };

  keyReleased = () => {};

  mouseDownAnyPlot = (event: MouseEvent) => {
    if (this.handlers.state.none) {
      this.auxiliaries.highlightrects.clear();
      this.drawUser();
    }
  };

  mouseDownThisPlot = (event: MouseEvent) => {
    const { marker, click, state } = this.handlers;

    marker.mergeCurrent(state.membership === 128);

    if (state.none) {
      marker.clearCurrent();
      this.auxiliaries.highlightrects.clear();
      this.drawUser();
    }

    if (event.button === 2) return;

    state.deactivateAll();
    this.activate();

    marker.updateCurrent(
      this.inClickPosition(click.positionLast),
      state.membership
    );
  };

  doubleClick = () => {
    const { marker, state } = this.handlers;
    state.activateAll();
    marker.clearAll();
    this.auxiliaries.highlightrects.clear();
    this.drawHighlight();
    this.drawUser();
    state.deactivateAll();
  };

  draw = (
    context: "base" | "highlight" | "user" | "overlay",
    ...args: any[]
  ) => {
    const { representations, auxiliaries } = this;
    const [what, where] = ["draw", "layer"].map(
      (e) => e + funs.capitalize(context)
    );
    if (context !== "user") this[where].drawClear();
    if (context === "base") this[where].drawBackground();

    const repsAndAuxs = { ...representations, ...auxiliaries };
    Object.keys(repsAndAuxs).forEach((e) => {
      repsAndAuxs[e]?.[what]?.(this[where], ...args);
    });
  };

  drawBase = () => this.draw("base");
  drawHighlight = () => this.draw("highlight");
  drawUser = () => this.draw("user");
  drawOverlay = () => this.draw("overlay");

  drawRedraw = () => {
    this.drawBase();
    this.drawUser();
    this.drawHighlight();
    this.drawOverlay();
  };

  initialize = () => {
    const {
      representations,
      auxiliaries,
      handlers,
      scales,
      mouseDownThisPlot,
      mouseDownAnyPlot,
      doubleClick,
      containerDiv,
      sceneDiv,
    } = this;

    this.handlers.drag.state = this.handlers.state;
    this.resize();

    if (scales.x.continuous) scales.x.expand(scales.x.zero ? 0 : 0.1, 0.1);
    if (scales.y.continuous) scales.y.expand(scales.y.zero ? 0 : 0.1, 0.1);

    Object.keys(scales).forEach((e) => {
      scales[e].registerData?.(this.getUnique(e));
    });

    const repsAndAuxs = { ...representations, ...auxiliaries };
    Object.keys(repsAndAuxs).forEach((e) =>
      repsAndAuxs[e].registerScales?.(scales)
    );

    sceneDiv.addEventListener("dblclick", doubleClick);
    sceneDiv.addEventListener("mousedown", mouseDownAnyPlot);
    containerDiv.addEventListener("mousedown", mouseDownThisPlot);
    containerDiv.addEventListener("contextmenu", (event) =>
      event.preventDefault()
    );

    Object.keys(handlers).forEach((e) => handlers[e].subscribe(this));
  };
}
