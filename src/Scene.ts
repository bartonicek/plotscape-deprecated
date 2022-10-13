import * as dtstr from "./datastructures.js";
import * as hndl from "./handlers/handlers.js";
import * as plts from "./plot/plots.js";
import { Plot } from "./plot/Plot.js";
import { Mapping } from "./Mapping.js";
import { DataFrame } from "./DataFrame.js";
import { helpPanelText } from "./helppaneltext.js";

export class Scene {
  element: HTMLDivElement;
  nObs: number;
  nPlotsOfType: number[];
  plots: { [name: string]: Plot };
  plotIds: string[];
  data: DataFrame;
  globals: dtstr.Globals;

  constructor(element: HTMLDivElement, data: DataFrame) {
    this.element = element;
    this.nObs = data[Object.keys(data)[0]].length;
    this.nPlotsOfType = Array(dtstr.plotTypeArray.length).fill(0);
    this.plots = {};
    this.plotIds = [];
    this.data = data;
    this.globals = {
      size: new hndl.SizeHandler(this.element),
      marker: new hndl.MarkerHandler(this.nObs),
      keypress: new hndl.KeypressHandler(),
      state: new hndl.StateHandler(),
    };
    element.classList.add("graphicDiv");
    this.globals.state.keypressHandler = this.globals.keypress;

    // Inject css
    const head = document.head;
    const link = document.createElement("link");
    link.type = "text/css";
    link.rel = "stylesheet";
    link.href = "./styles.css";
    head.appendChild(link);

    // Add help button and panel
    const helpButton = document.createElement("button");
    const helpPanel = document.createElement("div");
    helpButton.innerText = `?`;
    helpButton.classList.add("buttonHelp");
    helpPanel.innerHTML = helpPanelText;
    helpPanel.classList.add("helpPanel");

    const helpButtonDim =
      Math.min(this.globals.size.sceneWidth, this.globals.size.sceneHeight) *
      0.05;
    helpButton.style.width = `${helpButtonDim}px`;
    helpButton.style.height = `${helpButtonDim}px`;
    helpButton.style.fontSize = `${0.5 * helpButtonDim}px`;

    element.appendChild(helpPanel);
    element.appendChild(helpButton);
    helpButton.addEventListener("click", (event) => {
      helpPanel.classList.toggle("activePanel");
    });
  }

  addPlotWrapper = (
    type: dtstr.PlotTypes,
    mapping: Mapping,
    dimensions?: { width: number; height: number }
  ) => {
    const { element, data, plotIds, plots, globals } = this;

    this.globals.size.nPlots++;
    const plotTypeIndex = dtstr.plotTypeArray.findIndex((e) => e === type);
    this.nPlotsOfType[plotTypeIndex]++;
    const id = `${type}${this.nPlotsOfType[plotTypeIndex]}`;

    const plotConfig = {
      id: id,
      element: element,
      data: data,
      mapping: mapping,
      globals: globals,
      dimensions: dimensions,
    };

    this.plots[id] = new PlotProxy(type, plotConfig) as Plot;
    plotIds.push(id);
    globals.state.plotIds.push(id);
    globals.state.plotsActive.push(false);
    globals.state.plotContainers.push(this.plots[id].graphicContainer);

    plotIds.forEach((e) => {
      plots[e].resize();
      plots[e].drawRedraw();
    });

    return this;
  };

  // implement addPlotCustom()
}

// A class that dynamically constructs a wrapper plot given
// a plot type (string), data, mapping, and global handlers
class PlotProxy {
  constructor(
    type: string,
    plotConfig: {
      id: string;
      element: HTMLDivElement;
      mapping: Mapping;
      globals: dtstr.Globals;
      dimensions?: { height: number; width: number };
    }
  ) {
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
