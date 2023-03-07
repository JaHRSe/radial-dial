import { ControlWheel } from "./Conrol-Wheel";

function container() {
  const container = document.createElement("div");
  container.className = "container";
  const title = document.createElement("h3");
  title.innerText = "Radial Degree Display";

  const radialComponent = ControlWheel({
    radius: 50,
    padding: 10,
    circleThick: 5,
    backGroundColor: "white",
  });
  container.appendChild(title);
  container.appendChild(radialComponent);
  return container;
}

const comp = container();
document.body.appendChild(comp);
