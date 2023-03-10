type radialProps = {
  radius: number;
  circleThick: number;
  padding: number;
  backGroundColor?: string;
  continuous?: boolean;
};

type circleProps = {
  canvas: HTMLCanvasElement;
  radius: number;
  circleThick: number;
  innercircleThick: number;
  knobWidth: number;
};

/**Returns an HTML canvas element with a graphical wheel and numerical angle display inside of the wheel.
 * As the wheel rotates the display is updated. with the new angle in degrees. Fires even on
 * mouseup or optionally on mouse move with the angle value in radians
 * @param {number} radius - The radius of the circle in pixels
 * @param {number} circleThick - The thickness of the wheel in pixels
 * @param {number} padding - The padding space around the wheel in pixels
 * @param {string} [backgroundColor] - The color of the canvas behind the wheel
 * @param {string} [continuous] - If true, generate rotate event continuously as user moves the wheel
 *  */
export function ControlWheel(props: radialProps) {
  const { radius, padding, circleThick, backGroundColor, continuous } = props;
  const knobWidth = circleThick * 1.1;
  const diameter = radius * 2;
  const xPad = padding > 0 ? padding / 2 : 0;
  const yPad = padding > 0 ? padding / 2 : 0;
  const origin = { x: radius + xPad, y: radius + yPad };
  const canvas = document.createElement("canvas");
  const innercircleThick = circleThick * 0.25;
  let isRotating = false;
  let angleInRadians = 0; //0.785398;

  canvas.width = diameter + padding;
  canvas.height = diameter + padding;
  canvas.style.backgroundColor = backGroundColor || "lightblue";
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.translate(origin.x, origin.y);

  const drawCircleCall = () =>
    drawCircle({
      canvas,
      radius,
      circleThick,
      innercircleThick,
      knobWidth,
    });

  const drawAngleDisplayCall = () => {
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, origin.x, origin.y);
    drawAngleDisplay({
      degrees: radianToDegrees(angleInRadians),
      canvas,
      radius,
      circleThick,
    });
    ctx.restore();
  };

  drawAngleDisplayCall();
  rotate(canvas, angleInRadians);
  drawCircleCall();

  function rotateCircle(newAngleInRadians: number) {
    drawAngleDisplayCall();
    const diff = (angleInRadians - newAngleInRadians) * -1;
    rotate(canvas, diff);
    drawCircleCall();
    drawAngleDisplayCall();
    angleInRadians = newAngleInRadians;
  }

  // mouse position event is relative to client not canavs
  function getMousePosRelClientOrigin(ev: MouseEvent) {
    const rect = canvas.getBoundingClientRect();
    const originRelClient = { x: origin.x + rect.left, y: origin.y + rect.top };
    return {
      x: ev.clientX - originRelClient.x,
      y: (ev.clientY - originRelClient.y) * -1,
    };
  }
  const rotateEvent = () => {
    const rotateEvent = new CustomEvent("CONTROL_WHEEL_ROTATE", {
      bubbles: true,
      detail: angleInRadians,
    });
    canvas.dispatchEvent(rotateEvent);
  };
  document.addEventListener("mouseup", () => {
    isRotating = false;
    rotateEvent();
  });
  canvas.addEventListener("mousedown", (ev) => {
    // mouse position event is relative to client not canavs
    const mousePosRelOrigin = getMousePosRelClientOrigin(ev);
    isRotating = isMouseInKnobArea({
      angleInRadians,
      mousePosRelOrigin,
      radius,
      knobWidth,
    });
    if (isRotating)
      angleInRadians = -Math.atan2(mousePosRelOrigin.x, mousePosRelOrigin.y); // start fresh
  });
  canvas.addEventListener("mousemove", (ev) => {
    const mousePosRelOrigin = getMousePosRelClientOrigin(ev);
    if (isRotating) {
      const newAngle = -Math.atan2(mousePosRelOrigin.x, mousePosRelOrigin.y); //counter clockwise is positive
      rotateCircle(newAngle);
      if (continuous) rotateEvent();
    }
  });

  return canvas;
}

function drawCircle(props: circleProps) {
  const { canvas, radius, circleThick, innercircleThick, knobWidth } = props;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  clear(canvas);
  // Outer circle
  ctx.beginPath();
  ctx.strokeStyle = "silver";
  ctx.lineWidth = circleThick;
  ctx.arc(0, 0, radius, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.closePath();

  // Inner circle
  ctx.beginPath();
  ctx.strokeStyle = "#545761";
  ctx.lineWidth = innercircleThick;
  ctx.arc(0, 0, radius - circleThick / 2, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.closePath();

  // y axis top control knob
  ctx.beginPath();
  ctx.arc(0, -radius, knobWidth, 0, 2 * Math.PI);
  ctx.fillStyle = "#814141";
  ctx.fill();
  ctx.closePath();

  // Control knob lighting effect
  ctx.beginPath();
  ctx.arc(0, -radius, knobWidth * 0.9, 0, Math.PI);
  ctx.strokeStyle = "#5C4033";
  ctx.stroke();
  ctx.closePath();

  // x axis left tick
  ctx.beginPath();
  ctx.moveTo(-radius, 0);
  ctx.lineTo(-radius + circleThick / 2, 0);
  ctx.strokeStyle = "black";
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.closePath();

  // x axis right tick
  ctx.beginPath();
  ctx.moveTo(radius, 0);
  ctx.lineTo(radius - circleThick / 2, 0);
  ctx.strokeStyle = "black";
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.closePath();

  // y axis bottom tick
  ctx.beginPath();
  ctx.moveTo(0, radius - circleThick / 2);
  ctx.lineTo(0, radius);
  ctx.strokeStyle = "black";
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.closePath();
}

type isMouseInKnobAreaProps = {
  angleInRadians: number;
  mousePosRelOrigin: { x: number; y: number };
  radius: number;
  knobWidth: number;
};

function isMouseInKnobArea(props: isMouseInKnobAreaProps) {
  const { angleInRadians, mousePosRelOrigin, radius, knobWidth } = props;
  const yTranslate = Math.cos(angleInRadians) * radius;
  const xTranslate = -Math.sin(angleInRadians) * radius;
  return (
    Math.abs(mousePosRelOrigin.x - xTranslate) <= knobWidth &&
    Math.abs(mousePosRelOrigin.y - yTranslate) <= knobWidth
  );
}

function rotate(canvas: HTMLCanvasElement, angleInRadians: number) {
  const ctx = canvas.getContext("2d");
  if (ctx) ctx.rotate(-angleInRadians);
}

type drawDegreDisplayProps = {
  degrees: number;
  canvas: HTMLCanvasElement;
  radius: number;
  circleThick: number;
};
function drawAngleDisplay(props: drawDegreDisplayProps) {
  const { degrees, canvas, radius, circleThick } = props;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.beginPath();
  ctx.font = `${radius * 0.65}px Arial`;
  ctx.strokeStyle = "#696969";
  ctx.lineWidth = 4;
  const xCord = -radius / 1.5;
  const yCord = radius / 4 + circleThick / 2;
  ctx.strokeText(Math.round(degrees).toString() + "??", xCord, yCord);
  ctx.closePath();
}

function clear(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.restore();
}

function radianToDegrees(angleInRadians: number) {
  return (angleInRadians * 180) / Math.PI;
}
