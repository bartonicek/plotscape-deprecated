import * as dtstr from "./datastructures.js";
import * as hndl from "./handlers/handlers.js";
import * as plts from "./plot/plots.js";
import { Plot } from "./plot/Plot.js";
import { helpPanelText } from "./helppaneltext.js";
import { globalParameters as gpars } from "./globalparameters.js";

export class Scene {
  sceneDiv: HTMLDivElement;
  data: dtstr.DataFrame;
  layout: number[][];
  nCases: number;
  nPlots: number;
  nPlotsOfType: number[];
  plots: { [name: string]: Plot };
  plotIds: string[];
  globals: dtstr.Globals;

  constructor(
    element: HTMLDivElement,
    data: dtstr.DataFrame,
    opts?: { layout?: number[][] }
  ) {
    this.sceneDiv = element;
    this.data = data;
    this.layout = opts?.layout;

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
    this.sceneDiv.style.backgroundColor = gpars.scene.backgroundColour;
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
    const [helpButton, helpPanel] = ["button", "div"].map((e) =>
      document.createElement(e)
    );
    helpButton.innerText = `?`;
    helpPanel.innerHTML = helpPanelText;
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
      const layoutString: string = this.layout
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

  setRowsCols = () => {
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

  resize = () => {
    this.plotIds.forEach((e) => {
      this.plots[e].resize();
      this.plots[e].drawRedraw();
    });
  };

  addPlotWrapper = (type: dtstr.PlotTypes, mapping: dtstr.Mapping) => {
    const { sceneDiv: element, data, plotIds, globals } = this;

    this.nPlots++;
    const plotTypeIndex = dtstr.plotTypeArray.findIndex((e) => e === type);
    this.nPlotsOfType[plotTypeIndex]++;
    const id = `${type}${this.nPlotsOfType[plotTypeIndex]}`;
    this.setRowsCols();

    const plotConfig: dtstr.PlotConfig = {
      id: id,
      element: element,
      data: data,
      mapping: mapping,
      globals: globals,
    };

    this.plots[id] = new PlotProxy(type, plotConfig) as Plot;
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

  // TODO: implement addPlotCustom
}

// A class that dynamically constructs a wrapper plot given
// a plot type (string), data, mapping, and global handlers
class PlotProxy {
  constructor(type: string, plotConfig: dtstr.PlotConfig) {
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
