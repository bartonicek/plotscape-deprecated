const div1 = document.createElement("div");
div1.style.width = "1000px";
div1.style.height = "500px";
document.body.appendChild(div1);

const data = new PLOTSCAPE.DataFrame({ x: [1, 2, 3], y: [4, 3, 5] });
const scene = new PLOTSCAPE.Scene(div1, data)
  .addPlotWrapper("scatter", new PLOTSCAPE.Mapping(["x", "x"], ["y", "y"]))
  .addPlotWrapper(
    "bar",
    new PLOTSCAPE.Mapping(["x", "x"], ["y", "_indicator"])
  );

console.log(scene);
