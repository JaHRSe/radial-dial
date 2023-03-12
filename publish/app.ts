import { ControlWheel } from "../src/Control-Wheel";

function container() {
  const container = document.createElement("div");
  container.className = "container";

  const title = document.createElement("h3");
  title.innerText = "Radial Control Wheel";

  const controlWheel = ControlWheel({
    circleThick: 5,
    padding: 10,
    radius: 100,
    backGroundColor: "white",
  });

  document.addEventListener("CONTROL_WHEEL_ROTATE", (ev) => {
    console.log("rotate", (<CustomEvent>ev).detail); // detail contains the angle in radians
  });

  container.appendChild(title);
  if (controlWheel) container.appendChild(controlWheel);

  return container;
}

const comp = container();
document.body.appendChild(comp);
