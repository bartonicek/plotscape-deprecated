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
  globals: dtstr.Globals;

  constructor(element: HTMLDivElement, data: DataFrame) {
    this.element = element;
    this.nObs = data[Object.keys(data)[0]].length;
    this.nPlotsOfType = Array(dtstr.plotTypeArray.length).fill(0);
    this.plots = {};
    this.plotIds = [];
    this.globals = {
      nPlots: 0,
      scaleFactor: 3,
      data: data,
      sceneWidth: parseInt(getComputedStyle(element).width, 10),
      sceneHeight: parseInt(getComputedStyle(element).height, 10),
      get plotWidth() {
        return (
          (0.85 * this.sceneWidth) /
          Math.ceil(this.nPlots / Math.floor(Math.sqrt(this.nPlots)))
        );
      },
      get plotHeight() {
        return (0.85 * this.sceneHeight) / Math.floor(Math.sqrt(this.nPlots));
      },
      handlers: {
        marker: new hndl.MarkerHandler(this.nObs),
        keypress: new hndl.KeypressHandler(),
        state: new hndl.StateHandler(),
      },
    };
    element.classList.add("graphicDiv");
    this.globals.handlers.state.keypressHandler =
      this.globals.handlers.keypress;

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
      Math.min(this.globals.sceneWidth, this.globals.sceneHeight) * 0.05;
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
    plotType: dtstr.PlotTypes,
    mapping: Mapping,
    dimensions?: { width: number; height: number }
  ) => {
    const { element, plotIds, plots, globals } = this;

    this.globals.nPlots++;
    const plotTypeIndex = dtstr.plotTypeArray.findIndex((e) => e === plotType);
    this.nPlotsOfType[plotTypeIndex]++;
    const plotId = `${plotType}${this.nPlotsOfType[plotTypeIndex]}`;

    this.plots[plotId] = new PlotProxy(
      plotType,
      plotId,
      element,
      mapping,
      globals,
      dimensions
    ) as Plot;
    plotIds.push(plotId);
    globals.handlers.state.plotIds.push(plotId);
    globals.handlers.state.plotsActive.push(false);
    globals.handlers.state.plotContainers.push(
      this.plots[plotId].graphicContainer
    );

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
    plotType: dtstr.PlotTypes,
    ...args: [
      id: string,
      element: HTMLDivElement,
      mapping: Mapping,
      globals: {
        nPlots: number;
        data: DataFrame;
        handlers: {
          marker: hndl.MarkerHandler;
          keypress: hndl.KeypressHandler;
          state: hndl.StateHandler;
        };
      },
      dimensions?: { height: number; width: number }
    ]
  ) {
    const plotClasses = {
      scatter: plts.ScatterPlot,
      bubble: plts.BubblePlot,
      bar: plts.BarPlot,
      histo: plts.HistoPlot,
      square: plts.SquarePlot,
      squareheat: plts.SquareHeatmap,
    };
    return new plotClasses[plotType](...args);
  }
}
