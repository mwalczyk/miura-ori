import { saveAs } from "file-saver";

import { GeneratingLine } from "./src/generating_line";
import { GeneratingStrip } from "./src/generating_strip";
import { Vector } from "./src/vector";

// Running:
//
// 1. Install prerequisites:
// 		a. `npm install -g browserify` <-- used to package node modules
//		b. `npm install -g watchify` <-- used to "watch" index.js for changes and auto re-compile
//    c. `npm install -g babelify` <-- used to transpile ES6 to ES5 (for imports/exports, etc.)
//    d. `npm install --save-dev @babel/preset-env` <-- the preset needed for step (c)
// 2. Install any other required node modules locally: `npm install`
// 3. In the root directory run: `npm run bundle-watch`
//
// To format:
//
// 1. Install JsPrettier: `npm install --global prettier`
// 2. Open the Sublime command palette and install the IDE integration

// Create canvas element and append it to document body
const divCanvas = document.getElementById("div_canvas");

const canvasDrawing = document.createElement("canvas");
canvasDrawing.setAttribute("id", "canvas_drawing");
canvasDrawing.setAttribute("class", "drawing_upper");
canvasDrawing.width = 600;
canvasDrawing.height = 600;

const canvasCreasePattern = document.createElement("canvas");
canvasCreasePattern.setAttribute("id", "canvas_crease_pattern");
canvasCreasePattern.setAttribute("class", "drawing_lower");
canvasCreasePattern.width = 600;
canvasCreasePattern.height = 180;

divCanvas.appendChild(canvasDrawing);
divCanvas.appendChild(canvasCreasePattern);

// Grab the 2D rendering contexts
const ctxDrawing = canvasDrawing.getContext("2d");
const ctxCreasePattern = canvasCreasePattern.getContext("2d");

// Grab references to DOM elements
const buttonClear = document.getElementById("button_clear");
const buttonSave = document.getElementById("button_save");
const pNumberOfPoints = document.getElementById("p_number_of_points");
const inputRepeat = document.getElementById("input_repeat");

// Add event listeners
canvasDrawing.addEventListener("mousedown", addPoint);
buttonClear.addEventListener("click", reset);
buttonSave.addEventListener("click", save);
inputRepeat.addEventListener("input", () => drawCanvas());

let generatingLine = new GeneratingLine();
let generatingStrip;
let creasePattern;

/**
 * Exports the current crease pattern to a .FOLD file.
 */
function save() {
	const fold = creasePattern.exportFoldData();
	const file = new File([JSON.stringify(fold, null, 4)], "miura.fold", {
		type: "text/plain;charset=utf-8"
	});
	saveAs(file);
}

/**
 * Clears all active canvases.
 */
function clearCanvas() {
	ctxDrawing.clearRect(0, 0, canvasDrawing.width, canvasDrawing.height);
	ctxCreasePattern.clearRect(
		0,
		0,
		canvasCreasePattern.width,
		canvasCreasePattern.height
	);
}

/**
 * Clears all active canvases and resets the generating line.
 */
function reset() {
	clearCanvas();
	generatingLine.clear();
}

/**
 * A callback function that adds a point at the specified cursor position.
 */
function addPoint(e) {
	generatingLine.push(new Vector(e.offsetX, e.offsetY, 0.0));

	// Add some text information to the UI
	pNumberOfPoints.innerHTML = `Number of Points: ${generatingLine
		.length()
		.toString()}`;

	drawCanvas();
}

/**
 * Draws all active canvases.
 */
function drawCanvas() {
	clearCanvas();

	// Only do this if there are at least 2 points to draw
	if (generatingLine.length() > 1) {
		generatingStrip = new GeneratingStrip(generatingLine, 20.0, inputRepeat.value);
		creasePattern = generatingStrip.generateCreasePattern();
		
		generatingStrip.draw(ctxDrawing);
		creasePattern.draw(ctxCreasePattern);
	}

	// Always draw the line on top
	generatingLine.draw(ctxDrawing);
}