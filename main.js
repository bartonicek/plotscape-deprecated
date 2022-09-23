const div1 = document.createElement("div");
document.body.appendChild(div1);

const data = new PLOTSCAPE.DataFrame({ x: [1, 2, 3], y: [4, 3, 5] });
const scene = new PLOTSCAPE.Scene(div1, data)
  .addPlotWrapper("scatter", new PLOTSCAPE.Mapping(["x", "x"], ["y", "y"]))
  .addPlotWrapper(
    "bar",
    new PLOTSCAPE.Mapping(["x", "x"], ["y", "_indicator"])
  );
