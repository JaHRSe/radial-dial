## Interactive Radial Control

![radial degree control](./screen.jpg?raw=true)

Description:<br>
A UI wheel that displays the rotation angle and fires a custom event containing it as well.<br>
<br>
To use, listen for "CONTROL_WHEEL_ROTATE" event. Event fires on mouse up after rotating the wheel.<br>
Example<br>

````typescript
const controlWheel = ControlWheel({
  circleThick: 5, // thickness of wheel in pixels
  padding: 10, // Extra canvas area around the wheel
  radius: 100, // Wheel radius in pixels
  backGroundColor: "white", // Optional: Color of the canvas
  continuous: true, // Optional: if true, rotate event fires continuously as wheel moves
});
```<br>

Listen for wheel move event to get angle<br>
Javascript

```javascript
document.addEventListener("CONTROL_WHEEL_ROTATE", (ev) => {
  const angleInRadians = ev.detail; // ev.detail contains the angle in radians
});
````

Typescript<br>

```typescript
document.addEventListener("CONTROL_WHEEL_ROTATE", (ev) => {
  const angleInRadians = (<CustomEvent>ev).detail;
});
```

Dependencies <br>
Production dependencies - None

Installing
To run project locally <br> 1. npm Install <br> 2. npm start<br>
<br>
Author <br>
Jacob Searles

Version History<br>
0.1

License<br>
This project is licensed under the MIT License
