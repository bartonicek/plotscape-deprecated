import * as dtstr from "../datastructures.js";
import * as funs from "../functions.js";
import * as reps from "../representations/representations.js";
import * as scls from "../scales/scales.js";
import * as auxs from "../auxiliaries/auxiliaries.js";
import * as hndl from "../handlers/handlers.js";
import { GraphicStack } from "./GraphicStack.js";
import { Wrangler } from "../wrangler/Wrangler.js";

export class Plot extends GraphicStack {
  id: string;
  scales: { [key: string]: scls.Scale };
  representations: { [key: string]: reps.Representation };
  auxiliaries: {
    [key: string]: auxs.Auxiliary;
    highlightrects: auxs.HighlightRects;
  };
  wranglers: { [key: string]: Wrangler };
  handlers: {
    marker: hndl.MarkerHandler;
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
    this.scales = {};
    this.handlers = {
      marker: globals.marker,
      keypress: globals.keypress,
      state: globals.state,
      drag: new hndl.DragHandler(this.containerDiv),
      click: new hndl.ClickHandler(this.containerDiv),
    };
    this.auxiliaries = {
      axisbox: new auxs.AxisBox(),
      axistextx: new auxs.AxisText("x", this),
      axistexy: new auxs.AxisText("y", this),
      axistitlex: new auxs.AxisTitle("x", mapping.get("x"), this),
      axistitley: new auxs.AxisTitle("y", mapping.get("y"), this),
      highlightrects: new auxs.HighlightRects(this.handlers),
    };
  }

  get active() {
    return this.handlers.state.isActive(this.id);
  }

  get fontsize() {
    return Math.floor(Math.min(this.width, this.height) * 0.05);
  }

  resize = () => {
    const graphicLayers = ["graphicBase", "graphicUser", "graphicHighlight"];
    this.scales.x.setLength(this.width);
    this.scales.y.setLength(this.height);
    graphicLayers.forEach((e) => this[e].resize());
  };

  activate = () => {
    this.handlers.state.deactivateAll();
    this.handlers.state.activate(this.id);
  };

  // Gets all unique values of a mapping [string], across all wranglers
  getUnique = (mapping: string) => {
    const arr = Object.keys(this.wranglers).map((name) =>
      this.wranglers[name][mapping]?.extract()
    );
    return Array.from(new Set(arr.flat()));
  };

  // Given an array of selection points, checks each representation
  inSelection = (selPoints: dtstr.Rect2Points): number[] => {
    const allPoints = Object.keys(this.representations).map((e) => {
      return this.representations[e]?.inSelection?.(selPoints);
    });
    return Array.from(new Set(allPoints.flat()));
  };

  inClickPosition = (clickPoint: [number, number]): number[] => {
    const allPoints = Object.keys(this.representations).map((e) => {
      return this.representations[e]?.atClick?.(clickPoint);
    });
    return Array.from(new Set(allPoints.flat()));
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
    event.cancelBubble = true;
    event.stopPropagation?.();
    if (this.handlers.state.none) {
      this.auxiliaries.highlightrects.clear();
      this.drawUser();
    }
  };

  mouseDownThisPlot = (event: MouseEvent) => {
    const { marker, click, state } = this.handlers;

    event.cancelBubble = true;
    event.stopPropagation?.();

    marker.mergeCurrent(state.membership === 128);

    if (state.none) {
      marker.clearCurrent();
      this.auxiliaries.highlightrects.clear();
      this.drawUser();
    }

    state.deactivateAll();
    this.activate();

    marker.updateCurrent(
      this.inClickPosition(click.clickLast),
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

  draw = (context: "base" | "highlight" | "user", ...args: any[]) => {
    const { representations, auxiliaries } = this;

    const [what, where] = [
      "draw" + funs.capitalize(context),
      "graphic" + funs.capitalize(context),
    ];
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

  drawRedraw = () => {
    this.drawBase();
    this.drawHighlight();
    this.drawUser();
  };

  initialize = () => {
    const {
      representations,
      auxiliaries,
      handlers,
      scales,
      mouseDownThisPlot: mouseDownHere,
      mouseDownAnyPlot: mouseDownAnywhere,
      doubleClick,
      drawBase,
      containerDiv,
      sceneDiv,
    } = this;

    this.handlers.drag.state = this.handlers.state;

    Object.keys(scales).forEach((e) => {
      scales[e].registerData?.(this.getUnique(e));
    });

    const repsAndAuxs = { ...representations, ...auxiliaries };
    Object.keys(repsAndAuxs).forEach((e) =>
      repsAndAuxs[e].registerScales?.(scales)
    );

    sceneDiv.addEventListener("dblclick", doubleClick);
    sceneDiv.addEventListener("mousedown", mouseDownAnywhere);
    containerDiv.addEventListener("mousedown", mouseDownHere);

    Object.keys(handlers).forEach((e) => handlers[e].subscribe(this));

    drawBase();
  };
}
