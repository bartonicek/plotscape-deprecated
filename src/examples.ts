import { Scene } from "./Scene.js";
import { Mapping } from "./Mapping.js";
import { DataFrame } from "./DataFrame.js";
import { VectorGeneric } from "./datastructures.js";

// export const mtcarsExample = (
//   element: HTMLDivElement,
//   data: { [key: string]: VectorGeneric }
// ) => {
//   const dataProcessed = new DataFrame(data);
//   const scene = new Scene(element, dataProcessed)
//     .addPlotWrapper("histo", new Mapping(["x", "mpg"], ["y", "_indicator"]))
//     .addPlotWrapper("scatter", new Mapping(["x", "wt"], ["y", "mpg"]))
//     .addPlotWrapper(
//       "square",
//       new Mapping(["x", "cyl"], ["y", "am"], ["size", "_indicator"])
//     )
//     .addPlotWrapper("bar", new Mapping(["x", "carb"], ["y", "_indicator"]));
//   return scene;
// };

// const mtcars = async (element: HTMLDivElement) => {
//   const dataMtcars = await DataFrame.getData("./exampleData/mtcars.json");
//   const scene = new Scene(element, dataMtcars)
//     .addPlotWrapper("histo", new Mapping(["x", "mpg"], ["y", "_indicator"]))
//     .addPlotWrapper("scatter", new Mapping(["x", "wt"], ["y", "mpg"]))
//     .addPlotWrapper(
//       "square",
//       new Mapping(["x", "cyl"], ["y", "am"], ["size", "_indicator"])
//     )
//     .addPlotWrapper("bar", new Mapping(["x", "carb"], ["y", "_indicator"]));
//   return scene;
// };

// const mpg = async (element: HTMLDivElement) => {
//   const dataMpg = await DataFrame.getData("./exampleData/mpg.json");
//   const scene = new Scene(element, dataMpg)
//     .addPlotWrapper(
//       "bar",
//       new Mapping(["x", "manufacturer"], ["y", "_indicator"])
//     )
//     .addPlotWrapper("histo", new Mapping(["x", "cty"], ["y", "_indicator"]))
//     .addPlotWrapper("scatter", new Mapping(["x", "displ"], ["y", "hwy"]));
//   return scene;
// };

// const gapminder = async (element: HTMLDivElement) => {
//   const dataGapminder = await DataFrame.getData("./exampleData/gapminder.json");
//   const scene = new Scene(element, dataGapminder)
//     .addPlotWrapper("scatter", new Mapping(["x", "pop"], ["y", "lifeExp"]))
//     .addPlotWrapper(
//       "histo",
//       new Mapping(["x", "gdpPercap"], ["y", "_indicator"])
//     )
//     .addPlotWrapper(
//       "bar",
//       new Mapping(["x", "continent"], ["y", "_indicator"])
//     );
//   return scene;
// };

// const diamonds = async (element: HTMLDivElement) => {
//   const dataDiamonds = await DataFrame.getData("./exampleData/diamonds.json");
//   const scene = new Scene(element, dataDiamonds)
//     .addPlotWrapper("scatter", new Mapping(["x", "carat"], ["y", "price"]))
//     .addPlotWrapper("histo", new Mapping(["x", "price"], ["y", "_indicator"]));
//   return scene;
// };

// export { mtcars, mpg, gapminder, diamonds };
