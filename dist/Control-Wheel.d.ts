type radialProps = {
    radius: number;
    circleThick: number;
    padding: number;
    backGroundColor?: string;
    continuous?: boolean;
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
export declare function ControlWheel(props: radialProps): HTMLCanvasElement;
export {};
